import React, { useState } from "react"
// import { ChildPayload } from "../../../../utils/auth";
import { makeApiRequest } from "../../../../utils/api";
import { calculateAge } from "../../../../utils/calculateAge";
import { gradeOptions } from "../../../../utils/displayGrade";
import { ECErrors, EmergencyContact } from "@/types/emergencyContact";
import { formatUs, toE164US } from "../../../../utils/formatPhoneNumber";
import { Child } from "@/types/child";

type Props = {
    showForm: boolean
    onSuccess: (createdChild: Child) => void
}

type FormErrors = Partial<Record<"firstName" | "lastName" | "birthday", string>>
type ChildForm = Omit<Child, "createdAt" | "updatedAt" | "parents" | "id">;
const blankEC = (): EmergencyContact => ({
    id: "",
    firstName: "",
    lastName: "",
    relationship: "",
    phoneNumber: ""
});

const JoinChildForm: React.FC<Props> = ({ showForm, onSuccess }) => {
    const [errors, setErrors] = useState<FormErrors>({})
    const [ecErrors, setEcErrors] = useState<ECErrors[]>([])
    const [serverError, setServerError] = useState<string | null>(null)
    const [currentStep, setCurrentStep] = useState(1)
    const [submitting, setSubmitting] = useState(false)
    const [ecs, setEcs] = useState<EmergencyContact[]>([blankEC()])
    const [child, setChild] = useState<ChildForm>({
        firstName: '',
        lastName: '',
        preferredName: "",
        homeschool: true,
        grade: null,
        birthday: '',
        allergiesMedical: "",
        notes: "",
        photoConsent: false,
        waiver: false,
        emergencyContacts: []
    })

    const handleChange: React.ChangeEventHandler<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> = (e) => {
        const target = e.currentTarget as HTMLInputElement
        const { name, type, value } = target

        // child fields
        if (type === "checkbox") {
            setChild(prev => ({ ...prev, [name]: target.checked }));
            setServerError(null);
            return;
        }

        if (name === "grade") {
            setChild(prev => ({ ...prev, grade: value === "" ? null : Number(value) }))
            setServerError(null)
            return
        }

        setChild(prev => ({ ...prev, [name]: value }))
        setServerError(null)
    }

    const handleECChange = (i: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.currentTarget

        setEcs(prev => prev.map((contact, idx) =>
            idx === i ?
                {
                    ...contact,
                    ...(name === "emergencyFirstName" ? { firstName: value }
                        : name === "emergencyLastName" ? { lastName: value }
                        : name === "relationship" ? { relationship: value }
                        : {})
                }
            : contact
        ))
        setServerError(null)
    }

    const handleECPhoneChange = (i: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.currentTarget

        setEcs(prev => prev.map((contact, idx) =>
            idx === i ?
                {
                    ...contact,
                    phoneNumber: formatUs(value)
                }
            : contact
        ))
        setServerError(null)
    }

    const addEC = () => setEcs(prev => (prev.length < 3 ? [...prev, blankEC()] : prev))
    const removeEC = (i: number) => {
        setEcs(prev => prev.filter((_, idx) => idx !== i));
        setEcErrors(prev => prev.filter((_, idx) => idx !== i));
    }

    const validations = () => {
        const newErrors: FormErrors = {}
        if (!child.firstName?.trim()) newErrors.firstName = "Required"
        if (!child.lastName?.trim()) newErrors.lastName = "Required"
        if (!child.birthday) newErrors.birthday = "Required"

        const age = child.birthday ? calculateAge(child.birthday) : NaN
        if (Number.isNaN(age) || age < 10 || age > 18) {
            newErrors.birthday = "Child's age must be between 10 and 18 years old."
        }

        const ecNewErrors: ECErrors[] = ecs.map(() => ({}))
        const isFilled = (c: EmergencyContact) =>
            !!(c.firstName?.trim() || c.lastName?.trim() || c.relationship?.trim() || c.phoneNumber)

        ecs.forEach((c, i) => {
            const required = i === 0 || isFilled(c)
            if (!required) return

            if (!c.firstName?.trim()) ecNewErrors[i].firstName = "Required"
            if (!c.lastName?.trim()) ecNewErrors[i].lastName = "Required"
            if (!c.relationship?.trim()) ecNewErrors[i].relationship = "Required"
            if (!toE164US(c.phoneNumber)) ecNewErrors[i].phoneNumber = "Enter a valid US phone"
        })

        const hasAtLeastOneValid =
            ecs.length > 0 &&
            !ecNewErrors[0]?.firstName &&
            !ecNewErrors[0]?.lastName &&
            !ecNewErrors[0]?.relationship &&
            !ecNewErrors[0]?.phoneNumber

        setErrors(newErrors)
        setEcErrors(ecNewErrors)

        return Object.keys(newErrors).length === 0 && hasAtLeastOneValid && ecNewErrors.every((e, i) => {
            const required = i === 0 || isFilled(ecs[i])
            return !required || Object.keys(e).length === 0
        })
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setServerError(null)
        if (!validations()) return

        const emergencyContacts = ecs
            .map(c => {
                const empty = !(c.firstName?.trim() || c.lastName?.trim() || c.relationship?.trim() || c.phoneNumber)
                if (empty) return null;

                const phoneE164 = toE164US(c.phoneNumber)
                return {
                    firstName: c.firstName.trim(),
                    lastName: c.lastName.trim(),
                    relationship: c.relationship.trim(),
                    phoneNumber: phoneE164!,
                }
            })
            .filter(Boolean) as EmergencyContact[]

        const payload: ChildForm = {
            firstName: child.firstName?.trim(),
            lastName: child.lastName?.trim(),
            preferredName: child.preferredName === "" ? null : child.preferredName?.trim(),
            homeschool: child.homeschool,
            grade: child.grade,
            birthday: new Date(child.birthday).toISOString(),
            allergiesMedical: child.allergiesMedical === "" ? null : child.allergiesMedical?.trim(),
            notes: child.notes === "" ? null : child.notes?.trim(),
            photoConsent: child.photoConsent,
            waiver: child.waiver,
            // createdAt: new Date().toISOString(),
            // updatedAt: new Date().toISOString(),
            emergencyContacts
        }

        try {
            setSubmitting(true)
            const response = await makeApiRequest("http://localhost:8000/child", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: payload
            })

            onSuccess(response as Child)
            setChild({
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
            setEcs([blankEC()])
            setErrors({})
        } catch (err) {
            setServerError(err instanceof Error ? err.message : "Fail to join child to account. Please try again later.")
        } finally {
            showForm = false
            setSubmitting(false)
        }
    }

    const nextStep = () => {
        if (currentStep === 1) {
            if (!child.firstName || !child.lastName || !child.homeschool || !child.birthday) {
                setServerError("Please fill in all required fields.");
                return;
            }
        }
        setCurrentStep(prev => prev + 1);
        setServerError(null);
    }

    const prevStep = () => {
        setCurrentStep(prev => prev - 1);
        setServerError(null);
    }

    if (!showForm) return null

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
                        <div className="flex flex-row gap-3 w-full">
                            <div>
                                <input
                                    name="firstName"
                                    placeholder="Legal First Name"
                                    value={child.firstName}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    maxLength={50}
                                    required
                                />
                                    {errors.firstName && <p className="text-sm text-red-600 mt-1">{String(errors.firstName)}</p>}
                            </div>

                            <div>
                                <input
                                    name="lastName"
                                    placeholder="Legal Last Name"
                                    value={child.lastName}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    maxLength={50}
                                    required
                                />
                                    {errors.lastName && <p className="text-sm text-red-600 mt-1">{String(errors.lastName)}</p>}
                            </div>
                        </div>

                        <div>
                            <input
                                name="preferredName"
                                placeholder="Preferred Name"
                                value={child.preferredName ?? ""}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                maxLength={50}
                                required
                            />
                        </div>

                        <div>
                            <div className="font-bold mb-2">BIRTHDAY</div>
                            <input
                                type="date"
                                name="birthday"
                                value={child.birthday}
                                max={new Date().toISOString().split("T")[0]}
                                onChange={handleChange}
                                className="w-1/2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent mx-auto"
                                required
                            />
                                {errors.birthday && <p className="text-sm text-red-600 mt-1">{String(errors.birthday)}</p>}
                        </div>

                        <label className="inline-flex items-center gap-2">
                            <input
                            type="checkbox"
                            name="homeschool"
                            checked={child.homeschool ?? false}
                            onChange={handleChange}
                            className="h-4 w-4"
                            />
                                <span>Homeschool?</span>
                        </label>

                        <div className="font-bold mb-2">GRADE (OPTIONAL)</div>
                        <select
                            name="grade"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wondergreen focus:border-transparent"
                            value={child.grade ?? ""}
                            onChange={handleChange}
                        >
                            <option value="">N/A</option>
                            {gradeOptions.map(o => (
                                <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                        </select>

                        <div className="font-bold mb-2">PHOTO CONSENT</div>
                        <input
                            name="photoConsent"
                            type="checkbox"
                            checked={child.photoConsent}
                            onChange={handleChange}
                        />

                        <div className="font-bold">MEDICAL ACCOMMODATIONS</div>
                        <textarea
                            name="allergiesMedical"
                            value={child.allergiesMedical ?? ""}
                            onChange={handleChange}
                            placeholder="List any allergies or medical accommodations"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wondergreen focus:border-transparent"
                        />

                        <div className="font-bold">ADDITIONAL NOTES</div>
                        <textarea
                            name="notes"
                            value={child.notes ?? ""}
                            onChange={handleChange}
                            placeholder="Optional: Please note any information that would be beneficial for instructor"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wondergreen focus:border-transparent"
                        />

                        <button type="button" onClick={nextStep}
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
                        <span className="mt-1">It is required that you have at least one emergency contact. Maximum is three.</span>
                    </h2>
                    {serverError && <div className="mb-4 rounded bg-red-50 text-red-700 p-3">{serverError}</div>}

                    <div className="space-y-3">
                        {ecs.map((c, i) => (
                            <div key={i} className="p-3 border rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="font-semibold">Contact {i + 1}</div>
                                    {i > 0 && (
                                        <button type="button" onClick={() => removeEC(i)} className="text-sm text-red-600 hover:underline">
                                            Remove
                                        </button>
                                    )}
                                </div>

                                <div className="flex flex-row gap-3 w-full">
                                    <div className="flex-1">
                                        <input
                                            name="emergencyFirstName"
                                            placeholder="First Name"
                                            value={c.firstName}
                                            onChange={handleECChange(i)}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            maxLength={50}
                                            required={i === 0}
                                        />
                                        {ecErrors[i]?.firstName && <p className="text-sm text-red-600 mt-1">{ecErrors[i]?.firstName}</p>}
                                    </div>

                                    <div className="flex-1">
                                        <input
                                            name="emergencyLastName"
                                            placeholder="Last Name"
                                            value={c.lastName}
                                            onChange={handleECChange(i)}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            maxLength={50}
                                            required={i === 0}
                                        />
                                        {ecErrors[i]?.lastName && <p className="text-sm text-red-600 mt-1">{ecErrors[i]?.lastName}</p>}
                                    </div>
                                </div>

                                <div className="mt-3">
                                    <input
                                        name="relationship"
                                        placeholder="Relationship to Child"
                                        value={c.relationship}
                                        onChange={handleECChange(i)}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        maxLength={50}
                                        required={i === 0}
                                    />
                                        {ecErrors[i]?.relationship && <p className="text-sm text-red-600 mt-1">{ecErrors[i]?.relationship}</p>}
                                </div>

                                <div className="mt-3">
                                    <input
                                        type="tel"
                                        name="phoneNumber"
                                        inputMode="tel"
                                        autoComplete="tel"
                                        maxLength={12}
                                        placeholder="Phone Number"
                                        value={c?.phoneNumber ?? ""}
                                        onChange={handleECPhoneChange(i)}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        required={i === 0}
                                    />
                                    {ecErrors[i]?.phoneNumber && <p className="text-sm text-red-600 mt-1">{ecErrors[i]?.phoneNumber}</p>}
                                </div>
                            </div>
                        ))}

                        <div className="flex items-center justify-between">
                            <button type="button" onClick={prevStep}
                                className="bg-gray-200 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                            >
                             Back
                            </button>

                            <div className="flex items-center gap-3">
                                <button type="button" onClick={addEC} disabled={ecs.length >= 3}
                                    className="px-4 py-3 rounded-lg border border-green-600 text-green-700 hover:bg-green-50 disabled:opacity-50"
                                >
                                    + Add another ({ecs.length}/3)
                                </button>

                                <button type="button" onClick={nextStep}
                                    className="px-4 py-3 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors font-medium"
                                >
                                    Continue
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {currentStep === 3 && (
                <>
                    <h2 className="flex flex-col text-xl mt-4 mb-6 text-center">Waiver</h2>
                    <label className="inline-flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="waiver"
                            checked={child.waiver ?? false}
                            onChange={handleChange}
                            className="h-4 w-4"
                        />
                            <span>Placeholder Waiver</span>
                    </label>

                    <div className="flex space-x-3 pt-4">
                        <button type="button" onClick={prevStep}
                            className="flex-1 bg-gray-200 text-gray-700 p-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                        >
                            Back
                        </button>

                        <button type="submit" disabled={submitting}
                            className="w-full bg-blue-100 text-white p-3 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-60"
                        >
                            {submitting ? "Saving…" : "Save"}
                        </button>
                    </div>
                </>
            )}

            <div className="flex flex-col space-x-3 pt-4">
                <div className="flex justify-center">
                    <div className="flex space-x-2">
                        {[1, 2, 3].map((step) => (
                            <div key={step}
                                className={`w-3 h-3 rounded-full transition-colors ${step <= currentStep ? 'bg-green-500' : 'bg-gray-300'}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </form>
    )
}

export default JoinChildForm
