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


const WONDERHOOD_URL = determineEnv()

type AddChildProps = {
	showForm: boolean
	onSuccess: (createdChild: Child) => void
}

const initCreateForm = (): CreateChildForm => ({
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

	const {ecs, ecErrors, ecErrorMap, rowKeys, setEcErrors, setEcErrorMap, addEC, removeEC, changeEC, changePhone, toPayload, setEcs, setRowKeys, validateNow } = useEmergencyContactsCreate()

	const onChange: React.ChangeEventHandler<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> = (e) => {
		const target = e.currentTarget as HTMLInputElement
		const { type, name, value, checked } = target

		if (!name) return
		if (type === "checkbox") {
			setForm(p => ({ ...p, [name]: checked }))
			if (name === 'waiver') setErrors(prev => ({ ...prev, waiver: undefined}))
			 return
		}

		if (name === "grade") {
			setForm(p => ({ ...p, grade: value === "" ? null : Number(value) }))
			return
		}

		setForm(p => ({ ...p, [name]: value }))
	}

	if (!showForm) return null

	const nextStep = () => {
		if (currentStep === 1) {
			const errs = validateChildBasics({
				firstName: form.firstName,
				lastName: form.lastName,
				birthday: form.birthday,
				allergiesMedical: form.allergiesMedical
			})

			if (Object.keys(errs).length) {
				setErrors(errs)
				setServerError("Please fill in all required fields.")
				return
			}
		}

		if (currentStep === 2) {
			const { ok, deduped } = validateNow()

			if (!ok || deduped.length === 0) {
				setServerError("Please fix the Emergency Contact errors")
				return
			}
		}

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
		...form,
		preferredName: form.preferredName === "" ? null : form.preferredName?.trim(),
		birthday: form.birthday ? new Date(form.birthday).toISOString() : "",
		allergiesMedical: form.allergiesMedical?.trim(),
		notes: form.notes === "" ? null : form.notes?.trim(),
	})

	const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
		e.preventDefault()
		setServerError(null)

		const childErrors: ChildErrorsForm = validateChildBasics({
			firstName: form.firstName,
			lastName: form.lastName,
			birthday: form.birthday,
			allergiesMedical: form.allergiesMedical
		}) as ChildErrorsForm

		if (Object.keys(childErrors).length) {
			setErrors(childErrors)
			setServerError("Please fix the errors above.")
			return
		}

		const { ok, deduped } = validateNow()
		if (!ok || deduped.length === 0) {
			setServerError("Please fix the Emergency Contact errors")
			return
		}

		if (!form.waiver) {
			setErrors(prev => ({ ...prev, waiver: "Please acknowledge the waiver to continue" }))
			setServerError("Please acknowledge the waiver to continue")
			return
		}

		const payload = { ...toCreatePayload(form), emergencyContacts: toPayload }

		try {
			setSubmitting(true)
			const response = await makeApiRequest<CreateChildResponse>(`${WONDERHOOD_URL}/child`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: payload
			})

			onSuccess(response.child)
			setForm(initCreateForm())
			setEcs([{ firstName: "", lastName: "", relationship: "", phoneNumber: "" }])
			setRowKeys([`${crypto.randomUUID()}`])
			setEcErrors([{}])
			setEcErrorMap({})
			setServerError(null)
			setCurrentStep(1)
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
					<h2 className="flex flex-col text-xl mt-4 mb-6 text-center">
						Add your child&apos;s information.
						<span className="mt-1">Child must be between 10–18 years old.</span>
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

					<div className="flex items-center justify-between mt-4">
						<button
							type="button"
							onClick={prevStep}
							className="bg-gray-200 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-300 font-medium"
						>
							Back
						</button>
						<button
							type="button"
							onClick={nextStep}
							className="px-4 py-3 rounded-lg bg-green-600 text-white hover:bg-green-700 font-medium"
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
				/>
			)}

		<Stepper current={currentStep} />
		</form>
	)
}
