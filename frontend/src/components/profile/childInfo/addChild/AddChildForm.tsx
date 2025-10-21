import React, { useRef, useState } from "react"
import { ChildErrorsForm, CreateChildForm, CreateChildResponse } from "@/types/child";
import { makeApiRequest } from "../../../../../utils/api";
import { calculateAge } from "../../../../../utils/calculateAge";
import { ECErrors, EmergencyContact } from "@/types/emergencyContact";
import { toE164US } from "../../../../../utils/formatPhoneNumber";
import { Child } from "@/types/child";
import { determineEnv } from "../../../../../utils/api";
import EmergencyContactField from "../emergencyContact/EmergencyContactField";
import { buildAddEC, buildChildHandleChange } from "../../../../../utils/childFormShared";
import AddChildField from "./AddChildField";

const WONDERHOOD_URL = determineEnv()


type Props = {
    showForm: boolean
    onSuccess: (createdChild: Child) => void
}

const blankEC = (): EmergencyContact => ({
    firstName: "",
    lastName: "",
    relationship: "",
    phoneNumber: ""
});

const AddChild: React.FC<Props> = ({ showForm, onSuccess }) => {
    const keySeq = useRef(0)
    const [errors, setErrors] = useState<ChildErrorsForm>({})
    const [ecs, setEcs] = useState<EmergencyContact[]>([blankEC()])
    const [ecErrors, setEcErrors] = useState<ECErrors[]>([])
    const [serverError, setServerError] = useState<string | null>(null)
    const [rowKeys, setRowKeys] = useState<string[]>([String(keySeq.current++)])
    const [currentStep, setCurrentStep] = useState(1)
    const [submitting, setSubmitting] = useState(false)
    const [child, setChild] = useState<CreateChildForm>({
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

    // const handleChange = buildChildHandleChange(setChild, setServerError)
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

    const addEC = buildAddEC(blankEC, keySeq, setEcs, setRowKeys, setEcErrors)

    const validations = () => {
        const newErrors: ChildErrorsForm = {}
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

        const payload: CreateChildForm = {
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
            emergencyContacts
        }

        try {
            setSubmitting(true)
            const response = await makeApiRequest<CreateChildResponse>(`${WONDERHOOD_URL}/child`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: payload
            })

            onSuccess(response.child)
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
            setRowKeys([String(keySeq.current++)])
            setEcErrors([])
            setErrors({})
        } catch (err) {
            setServerError(err instanceof Error ? err.message : "Fail to join child to account. Please try again later.")
        } finally {
            setSubmitting(false)
        }
    }

    const nextStep = () => {
        if (currentStep === 1) {
            if (!child.firstName || !child.lastName || !child.birthday) {
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
                        <AddChildField
                            child={child}
                            onChange={handleChange}
                            errors={errors}
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
                        <EmergencyContactField
                            ecs={ecs}
                            setEcs={setEcs}
                            ecErrors={ecErrors}
                            setEcErrors={setEcErrors}
                            rowKeys={rowKeys}
                            setRowKeys={setRowKeys}
                        />

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

export default AddChild
