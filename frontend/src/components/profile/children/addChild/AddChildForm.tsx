import React, { useMemo, useState } from "react";
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
import type { WaiverSnapshot } from "@/types/policies";


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
	const [createdWaiverId, setCreatedWaiverId] = useState<string | null>(null);
	const [showSuccess, setShowSuccess] = useState(false);
	const [createdChild, setCreatedChild] = useState<Child | null>(null);
	const [signedAtLocal, setSignedAtLocal] = useState<string | null>(null);
	// Stores typed guardian full name for waiver signature
	const [waiverFullName, setWaiverFullName] = useState("");
	const [waiverLoading, setWaiverLoading] = useState(true);
	const [waiverLoadError, setWaiverLoadError] = useState<string | null>(null);

	// 1) Snapshot from backend
	const [waiverSnapshot, setWaiverSnapshot] = useState<WaiverSnapshot | null>(null);

	React.useEffect(() => {
		let cancelled = false;

		(async () => {
			try {
			setWaiverLoading(true);
			setWaiverLoadError(null);

			const snap = await makeApiRequest<WaiverSnapshot>(
				`${WONDERHOOD_URL}/api/policies/waiver?version=1.0&lang=en`,
				{ method: "GET" }
			);

			if (!cancelled) setWaiverSnapshot(snap);
			} catch (e) {
			console.error("Failed to load waiver snapshot", e);
			if (!cancelled) {
				setWaiverSnapshot(null);
				setWaiverLoadError("Failed to load waiver text. Please try again.");
			}
			} finally {
			if (!cancelled) setWaiverLoading(false);
			}
		})();

		return () => {
			cancelled = true;
		};
	}, []);

	// 2) Use snapshot data when loaded; otherwise empty defaults
	const waiverSections = useMemo(() => waiverSnapshot?.sections ?? [], [waiverSnapshot]);
	const waiverVersion = waiverSnapshot?.version ?? "1.0";
	const conductPolicyShort = waiverSnapshot?.conductPolicyShort ?? "";

	// 3) Build default checkbox state for all waiver sections (unchecked)
	const initialAck = React.useMemo(
	() => Object.fromEntries(waiverSections.map(s => [s.key, false] as const)),
	[waiverSections]
	);

	// 4) State for section checkboxes (key -> checked)
	const [waiverAck, setWaiverAck] = useState<Record<string, boolean>>(() => initialAck);

	// 5) Sync checkbox map whenever sections change (keep user's checks)
	React.useEffect(() => {
	setWaiverAck(prev => {
		const next: Record<string, boolean> = { ...initialAck };
		for (const k of Object.keys(prev)) {
		if (k in next) next[k] = prev[k];
		}
		return next;
	});
	}, [initialAck]);


	// Stores per-section waiver acknowledgements (each section must be checked)

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

		setForm(p => ({ ...p, [name]: value })) 
	}

	if (!showForm) return null // Render nothing if the modal/form is hidden

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
			if (waiverLoading) {
				setServerError("Waiver is still loading. Please wait.");
			return;
			}
			if (waiverLoadError || waiverSections.length === 0) {
				setServerError("Waiver text is unavailable. Please refresh and try again.");
			return;
			}
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

	// const handleDownloadWaiver = async () => {
	// 	if (!createdWaiverId) return;

	// 	try {
	// 		const res = await makeApiRequest<{ url: string }>(
	// 			`${WONDERHOOD_URL}/api/waivers/${createdWaiverId}/download`,
	// 			{ method: "GET" }
	// 		);


	// 		// Open the signed URL in a new tab (convenient for printing as well)
	// 		window.open(res.url, "_blank", "noopener,noreferrer");
	// 	} catch (e) {
	// 		setServerError(e instanceof Error ? e.message : "Failed to download waiver.");
	// 	}
	// };

	// ✅ iOS Safari often blocks `window.open()` if it happens AFTER an async `await`.
	// This helper detects iOS so we can use a safe workaround only there.
	const isIOS = () => {
		if (typeof navigator === "undefined") return false;
		return /iPad|iPhone|iPod/.test(navigator.userAgent);
	};

	const handleDownloadWaiver = async () => {
		if (!createdWaiverId) return;

		// Use the "open blank tab immediately" workaround ONLY on iOS.
		// Desktop/Android can safely open the PDF after the async call.
		const usePopupWorkaround = isIOS();
		let popup: Window | null = null;

		// iOS workaround:
		// Open a new blank tab synchronously inside the click handler.
		// This prevents Safari from blocking the popup.
		if (usePopupWorkaround) {
			popup = window.open("", "_blank");

			// Optional: show a friendly message instead of a blank white page
			// while we fetch the signed download URL.
			if (popup) {
			try {
				popup.document.write(
				`<p style="font-family: system-ui; padding: 16px;">Opening your PDF…</p>`
				);
				popup.document.close();
			} catch {
				// Some browsers may block writing to the popup; ignore safely.
			}
			}
		}

		try {
			// 1) Ask backend for a signed URL to the PDF
			const res = await makeApiRequest<{ url: string }>(
			`${WONDERHOOD_URL}/api/waivers/${createdWaiverId}/download`,
			{ method: "GET" }
			);

			// Defensive check
			if (!res?.url) throw new Error("Download link is missing.");

			// 2) iOS: redirect the already-opened tab to the signed URL
			if (popup) {
			popup.location.replace(res.url);
			return;
			}

			// 3) Desktop/Android: stay on the current page and open PDF in a new tab
			window.open(res.url, "_blank", "noopener,noreferrer");
		} catch (e) {
			// If anything fails, close the blank tab (if it exists) and show an error
			try {
			popup?.close();
			} catch {
			// Ignore close errors
			}
			setServerError(e instanceof Error ? e.message : "Failed to download waiver.");
		}
	};



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
		if (waiverLoading) {
				setServerError("Waiver is still loading. Please wait.");
			return;
			}

			if (waiverLoadError || waiverSections.length === 0) {
				setServerError("Waiver text is unavailable. Please refresh and try again.");
			return;
		}

		const allAcked = waiverSections.every(sec => waiverAck[sec.key]);
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
			waiverVersion: waiverVersion, // Helps backend store the version the user agreed to

		}

		try {
			setSubmitting(true);

			const response = await makeApiRequest<CreateChildResponse>(`${WONDERHOOD_URL}/child`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: payload,
			});

			setCreatedChild(response.child);
			setCreatedWaiverId(response.waiverSignatureId ?? null);
			setShowSuccess(true);
			// Show exact signed time returned by backend (displayed in Mountain Time)
			if (response.waiverSignedAt) {
				const dt = new Date(response.waiverSignedAt);

				const formatted = dt.toLocaleString("en-US", {
					timeZone: "America/Denver",
					year: "numeric",
					month: "short",
					day: "numeric",
					hour: "numeric",
					minute: "2-digit",
				});

				setSignedAtLocal(`${formatted} (MT)`);
			}

			//errors
			setServerError(null);
			setErrors({});
			setEcErrors([]);
			setEcErrorMap({});
			} catch (err) {
			setServerError(
				err instanceof Error
				? err.message
				: "Fail to join child to account. Please try again later."
			);
			} finally {
			setSubmitting(false);
			}

	}
	
	if (showSuccess) {
		return (
			<div className="border border-green-200 p-4 rounded-lg bg-green-50">
				<h2 className="text-lg font-semibold text-green-800">Child added successfully ✅</h2>

				<p className="mt-2 text-sm text-green-700">
					You can download the signed waiver for your records.
				</p>

				{signedAtLocal && (
					<p className="mt-2 text-sm text-green-700">
						Signed at: {signedAtLocal}
					</p>
				)}

				<div className="mt-4 flex flex-col sm:flex-row gap-3">
					<button
					type="button"
					onClick={handleDownloadWaiver}
					disabled={!createdWaiverId}
					className="bg-green-600 text-white text-sm sm:text-base px-3 sm:px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-60 leading-snug"
					>
					Download PDF copy
					</button>

					<button
					type="button"
					onClick={() => {
						if (createdChild) onSuccess(createdChild); 

						setShowSuccess(false);
						setCreatedWaiverId(null);
						setCreatedChild(null);
						setSignedAtLocal(null);

						setForm(initCreateForm());
						setEcs([{ firstName: "", lastName: "", relationship: "", phoneNumber: "" }]);
						setRowKeys([`${crypto.randomUUID()}`]);
						setEcErrors([{}]);
						setEcErrorMap({});
						setServerError(null);
						setCurrentStep(1);
						setWaiverFullName("");
						setWaiverAck(initialAck);
						}}

					className="bg-gray-200 text-gray-700 text-sm sm:text-base px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-300 leading-snug"
					>
						Done
					</button>
				</div>
			</div>
		);
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
				waiverLoading ? (
					<div className="rounded-lg border bg-yellow-50 p-3 text-yellow-800">
					Loading waiver text… Please wait.
					</div>
				) : waiverLoadError ? (
					<div className="rounded-lg border bg-red-50 p-3 text-red-700">
					{waiverLoadError}
					</div>
				) : (
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
					signedAtLocal={signedAtLocal}
					waiverSections={waiverSections}
					waiverVersion={waiverVersion}
					conductPolicyShort={conductPolicyShort}
					/>
				)
			)}
		</form>
	)
}
