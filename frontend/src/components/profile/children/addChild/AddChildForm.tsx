import React, { useState } from "react"
import { ChildErrorsForm, CreateChildForm, CreateChildResponse } from "@/types/child";
import { makeApiRequest } from "../../../../../utils/api";
import { Child } from "@/types/child";
import { determineEnv } from "../../../../../utils/api";
import AddChildField from "./AddChildField";
import { useEmergencyContactsCreate } from "../emergencyContact/useEmergencyContactsCreate";
import { validateChildBasics } from "../../../../../utils/childValidations";
import EmergencyContactsList from "../emergencyContact/EmergencyContactsList";
import Stepper from "./Stepper";
import Waiver from "./Waiver";
import { WAIVER_SECTIONS, WAIVER_VERSION } from "@/constants/policies";


const WONDERHOOD_URL = determineEnv()

type AddChildProps = {
	showForm: boolean
	onSuccess: (createdChild: Child) => void
}

const initCreateForm = (): CreateChildForm => ({
	// Initial form state (matches backend ChildCreate fields)
	firstName: "",
	lastName: "",
	preferredName: "",
	homeschool: true,
	grade: null,
	birthday: "",
	allergiesMedical: "",
	notes: "",
	photoConsent: false,
	waiver: false,
	emergencyContacts: []
})

export default function AddChild({ showForm, onSuccess }: AddChildProps) {
	const [form, setForm] = useState<CreateChildForm>(initCreateForm())
	const [errors, setErrors] = useState<ChildErrorsForm>({})
	const [serverError, setServerError] = useState<string | null>(null)
	const [submitting, setSubmitting] = useState(false)
	const [currentStep, setCurrentStep] = useState(1)
	// Stores typed guardian full name for waiver signature
	const [waiverFullName, setWaiverFullName] = useState("");

	const initialAck = React.useMemo(
		// Build a stable "all sections unchecked" map (used to reset waiver acknowledgements)
		() => Object.fromEntries(WAIVER_SECTIONS.map(s => [s.key, false] as const)),
		[]
	);
	// Stores per-section waiver acknowledgements (each section must be checked)
	const [waiverAck, setWaiverAck] = useState<Record<string, boolean>>(initialAck);

	const {ecs, ecErrors, ecErrorMap, rowKeys, setEcErrors, setEcErrorMap, addEC, removeEC, changeEC, changePhone, toPayload, setEcs, setRowKeys, validateNow } = useEmergencyContactsCreate()

	const onChange: React.ChangeEventHandler<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> = (e) => {
		const target = e.currentTarget as HTMLInputElement
		const { type, name, value, checked } = target

		if (!name) return
		if (type === "checkbox") {
			// Generic checkbox handler (waiver/photoConsent/homeschool etc.)
			setForm(p => ({ ...p, [name]: checked }))
			// If user toggles waiver, clear waiver error immediately (better UX)
			if (name === 'waiver') setErrors(prev => ({ ...prev, waiver: undefined}))
			 return
		}

		if (name === "grade") {
			// Convert grade input to number (or null if empty)
			setForm(p => ({ ...p, grade: value === "" ? null : Number(value) }))
			return
		}

		setForm(p => ({ ...p, [name]: value })) // Render nothing if the modal/form is hidden
	}

	if (!showForm) return null

	const nextStep = () => {
		if (currentStep === 1) {
			// Step 1 validation: basic child fields
			const errs = validateChildBasics({
				firstName: form.firstName,
				lastName: form.lastName,
				birthday: form.birthday,
				allergiesMedical: form.allergiesMedical ?? ""
			})

			if (Object.keys(errs).length) {
				setErrors(errs)
				setServerError("Please fill in all required fields.")
				return
			}
		}

		if (currentStep === 2) {
			// Step 2 validation: at least 1 valid emergency contact
			const { ok, deduped } = validateNow()

			if (!ok || deduped.length === 0) {
				setServerError("Please fix the Emergency Contact errors")
				return
			}
		}
		// Clear errors when advancing
		setServerError(null)
		setErrors({})
		setEcErrors([])
		setEcErrorMap({})
		setCurrentStep(s => s + 1)
	}

	const prevStep = () => {
		setCurrentStep(s => s - 1)
		setServerError(null)
	}

	const toCreatePayload = (form: CreateChildForm): CreateChildForm => ({
		// Normalize values for backend (trim strings / convert empty to null)
		...form,
		preferredName: form.preferredName === "" ? null : form.preferredName?.trim(),
		birthday: form.birthday ? new Date(form.birthday).toISOString() : "",
		allergiesMedical: (form.allergiesMedical ?? "").trim(), 
		notes: form.notes === "" ? null : form.notes?.trim(),
	})

	const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
		e.preventDefault()
		setServerError(null)

		// Re-validate Step 1 on final submit (protects against direct submit)
		const childErrors: ChildErrorsForm = validateChildBasics({
			firstName: form.firstName,
			lastName: form.lastName,
			birthday: form.birthday,
			allergiesMedical: form.allergiesMedical ?? ""
		}) as ChildErrorsForm

		if (Object.keys(childErrors).length) {
			setErrors(childErrors)
			setServerError("Please fix the errors above.")
			return
		}

		// Re-validate emergency contacts on submit as well
		const { ok, deduped } = validateNow()
		if (!ok || deduped.length === 0) {
			setServerError("Please fix the Emergency Contact errors")
			return
		}

		// Waiver must be checked (final e-sign agreement checkbox)
		if (!form.waiver) {
			setErrors(prev => ({ ...prev, waiver: "Please acknowledge the waiver to continue" }))
			setServerError("Please acknowledge the waiver to continue")
			return
		}

		// Guardian full name is required for signature record
		if (!waiverFullName.trim()) {
			setServerError("Please enter Parent/Guardian Full Name")
			return
		}

		// All waiver sections must be acknowledged before submit
		const allAcked = WAIVER_SECTIONS.every(sec => waiverAck[sec.key]);
		if (!allAcked) {
			setServerError("Please acknowledge all waiver sections.");
		return;
		}

		const payload = {
			...toCreatePayload(form),
			emergencyContacts: toPayload, // Use normalized/deduped EC payload from the custom hook
			waiverSignedByName: waiverFullName.trim(), // Stored in DB for signature audit trail
			waiverSectionsAck: Object.entries(waiverAck)
			.filter(([, v]) => v)
			.map(([k]) => k),
			waiverVersion: WAIVER_VERSION, // Helps backend store the version the user agreed to

		}

		try {
			setSubmitting(true)
			const response = await makeApiRequest<CreateChildResponse>(`${WONDERHOOD_URL}/child`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: payload
			})

			// Notify parent component that child was created successfully
			onSuccess(response.child)
			// Reset the whole multi-step form state back to defaults
			setForm(initCreateForm())
			setEcs([{ firstName: "", lastName: "", relationship: "", phoneNumber: "" }])
			setRowKeys([`${crypto.randomUUID()}`])
			setEcErrors([{}])
			setEcErrorMap({})
			setServerError(null)
			setCurrentStep(1)
			// Reset waiver-specific state
			setWaiverFullName("");
			setWaiverAck(initialAck);

		} catch (err) {
			setServerError(err instanceof Error ? err.message : "Fail to join child to account. Please try again later.")
		} finally {
			setSubmitting(false)
		}
	}

	return (
		<form className="border border-gray-200 p-4 rounded-lg bg-gray-50" onSubmit={handleSubmit} noValidate>
			{currentStep === 1 && (
				<>
					<h2 className="flex flex-col text-base md:text-xl mt-4 mb-6 text-center">
						Add your child&apos;s information.
						<span className="mt-1">Child must be between 10-18 years old.</span>
					</h2>
					{serverError && <div className="mb-4 rounded bg-red-50 text-red-700 p-3">{serverError}</div>}

					<div className="space-y-3">
						<AddChildField child={form} onChange={onChange} errors={errors}/>
						<button
							type="button"
							onClick={nextStep}
							className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
						>
							Continue
						</button>
					</div>
				</>
			)}

			{currentStep === 2 && (
				<>
					<h2 className="flex flex-col text-xl mt-4 mb-6 text-center">
						Emergency Contact
						<span className="mt-1">At least one required. Maximum is three.</span>
					</h2>
					{serverError && <div className="mb-4 rounded bg-red-50 text-red-700 p-3">{serverError}</div>}

					<EmergencyContactsList
					ecs={ecs}
					ecErrors={ecErrors}
					ecErrorMap={ecErrorMap}
					rowKeys={rowKeys}
					addEC={addEC}
					removeEC={removeEC}
					changeEC={changeEC}
					changePhone={changePhone}
					/>

					{/* Back • dots • Continue */}
					<div className="mt-6 grid grid-cols-[auto,1fr,auto] items-center">
						<button
							type="button"
							onClick={prevStep}
							className="justify-self-start px-3 md:px-8 py-1.5 md:py-2.5 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 font-medium"
						>
							Back
						</button>

						<div className="flex justify-center">
							<Stepper current={currentStep} />
						</div>

						<button
							type="button"
							onClick={nextStep}
							className="justify-self-end px-2 md:px-5 py-1.5 md:py-2.5 rounded-lg bg-green-600 text-white hover:bg-green-700 font-medium"
						>
							Continue
						</button>
					</div>
				</>
			)}

			{currentStep === 3 && (
				<Waiver
				child={form}
				errors={errors}
				onChange={onChange}
				submitting={submitting}
				prevStep={prevStep}
				ack={waiverAck}
				setAck={setWaiverAck}
				fullName={waiverFullName}
				setFullName={setWaiverFullName}
				/>
			)}

		</form>
	)
}
