import { Child } from "@/types/child"
import React, { useEffect, useMemo, useState } from "react"
import { makeApiRequest } from "../../../../utils/api"
import { FaCheck } from "react-icons/fa"
import { FaX } from "react-icons/fa6"
import { gradeOptions } from "../../../../utils/displayGrade"
import { dedupeECs, ECErrors, ECUpdateForm, ecsEqual } from "@/types/emergencyContact"
import { e164toUS, formatUs, toE164US } from "../../../../utils/formatPhoneNumber"
import { determineEnv } from "../../../../utils/api"

const WONDERHOOD_URL = determineEnv()

type ChildUpdateForm = Omit<Child, "id" | "homeschool" | "waiver" | "createdAt" | "parents">;
type Props = {
    currChild: Child
    setEditingChildId: (id: string | null) => void
    refreshChildren: () => Promise<void>
}

const blankEC = (): ECUpdateForm => ({
    firstName: "",
    lastName: "",
    relationship: "",
    phoneNumber: ""
});

const UpdateChildForm: React.FC<Props> = ({ currChild, setEditingChildId, refreshChildren }) => {
    const [firstName, setFirstName] = useState<string>("")
    const [preferredName, setPreferredName] = useState<string>("")
    const [lastName, setLastName] = useState<string>("")
    const [birthday, setBirthday] = useState<string>("")
    const [grade, setGrade] = useState<number | null>(null)
    const [photoConsent, setPhotoConsent] = useState(false)
    const [allergiesMedical, setAllergiesMedical] = useState<string>("")
    const [notes, setNotes] = useState<string>("")
    const [saving, setSaving] = useState(false)
    const [ecs, setEcs] = useState<ECUpdateForm[]>([blankEC()])
    const [ecErrors, setEcErrors] = useState<ECErrors[]>([])

    useEffect(() => {
        setFirstName(currChild.firstName ?? "")
        setPreferredName(currChild.preferredName ?? "")
        setLastName(currChild.lastName ?? "")
        setGrade(currChild.grade ?? null)
        setPhotoConsent(currChild.photoConsent)
        setAllergiesMedical(currChild.allergiesMedical ?? "")
        setNotes(currChild.notes ?? "")

        if (currChild.birthday) {
            const date = new Date(currChild.birthday)
            const formattedDate = date.toISOString().split("T")[0]
            setBirthday(formattedDate)
        } else {
            setBirthday("")
        }

        const initialFromServer: ECUpdateForm[] =
            (currChild.emergencyContacts ?? []).map(ec => ({
                firstName: ec.firstName ?? "",
                lastName: ec.lastName ?? "",
                relationship: ec.relationship ?? "",
                phoneNumber: e164toUS(ec.phoneNumber) ?? formatUs(ec.phoneNumber ?? "")
            }))

        const initial = initialFromServer.length ? initialFromServer : [blankEC()]
        setEcs(initial)
        setEcErrors(initial.map(() => ({})))
    }, [currChild])

    const isValid = useMemo(() => Boolean(firstName?.trim() && lastName?.trim()), [firstName, lastName])

    const updateFirstName = (e: React.ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)
    const updatePreferredName = (e: React.ChangeEvent<HTMLInputElement>) => setPreferredName(e.target.value)
    const updateLastName = (e: React.ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)
    const updateBirthday = (e: React.ChangeEvent<HTMLInputElement>) => setBirthday(e.target.value)
    const updateAllergiesMedical = (e: React.ChangeEvent<HTMLTextAreaElement>) => setAllergiesMedical(e.target.value)
    const updateNotes = (e: React.ChangeEvent<HTMLTextAreaElement>) => setNotes(e.target.value)
    const updateGrade: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
        const n = e.currentTarget.value
        if (n === "") return setGrade(null)
        setGrade(Number(n))
    }

    const handleECChange = (i: number, field: keyof ECUpdateForm, isPhone: boolean = false) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const v = e.target.value
        setEcs(prev => prev.map((contact, idx) =>
            (idx === i ? { ...contact, [field]: isPhone ? formatUs(v) : v } : contact)))
    }

    const validateECs = (contacts: ECUpdateForm[]) => {
        const filled = (c: ECUpdateForm) => !!(c.firstName.trim() || c.lastName.trim() || c.relationship.trim() || (c.phoneNumber ?? "").trim())
        const errs: ECErrors[] = contacts.map(() => ({}))

        contacts.forEach((c, i) => {
            const required = i === 0 || filled(c)
            if (!required) return
            if (!c.firstName.trim()) errs[i].firstName = "Required"
            if (!c.lastName.trim()) errs[i].lastName = "Required"
            if (!c.relationship.trim()) errs[i].relationship = "Required"
            if (!toE164US(c.phoneNumber)) errs[i].phoneNumber = "Enter a valid US phone"
        })

        const deduped = dedupeECs(contacts)
        const ok =
            deduped.length >= 1 &&
            deduped.length <= 3 &&
            errs.every(e => Object.keys(e).length === 0)

        return { ok, errs, deduped }
    }

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!isValid || saving) return

        const { ok: ecOk, errs, deduped } = validateECs(ecs)
        setEcErrors(errs)
        if (!ecOk) return

        const currentECs: ECUpdateForm[] = (currChild.emergencyContacts ?? []).map(ec => ({
            firstName: ec.firstName ?? "",
            lastName: ec.lastName ?? "",
            relationship: ec.relationship ?? "",
            phoneNumber: e164toUS(ec.phoneNumber) ?? formatUs(ec.phoneNumber ?? "")
        }))

        const includeECs = !ecsEqual(deduped, currentECs)

        const payload: ChildUpdateForm = {
            firstName: firstName?.trim(),
            lastName: lastName?.trim(),
            preferredName: preferredName === "" ? null : preferredName?.trim(),
            grade,
            birthday: new Date(birthday).toISOString(),
            allergiesMedical: allergiesMedical === "" ? null : allergiesMedical?.trim(),
            notes: notes === "" ? null : notes?.trim(),
            photoConsent,
            // updatedAt: new Date().toISOString()
        }

        if (includeECs) {
            payload.emergencyContacts = deduped.map(c => ({
                firstName: c.firstName.trim(),
                lastName: c.lastName.trim(),
                relationship: c.relationship.trim(),
                phoneNumber: c.phoneNumber ? toE164US(c.phoneNumber) : null
            }))
        }

        try {
            setSaving(true)
            await makeApiRequest(`${WONDERHOOD_URL}/child/${currChild.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: payload
            }) as Child
            await refreshChildren()
            setEditingChildId(null)
        } catch (err) {
            console.error("update failed", err)
        } finally {
            setSaving(false)
        }
    }

    const addEC = () => setEcs(prev => (prev.length < 3 ? [...prev, blankEC()] : prev))
    const removeEC = (i: number) => {
        setEcs(prev => prev.filter((_, idx) => idx !== i));
        setEcErrors(prev => prev.filter((_, idx) => idx !== i));
    }

    return (
        <div className="bg-white rounded-lg p-6">
            <form onSubmit={handleUpdate}>
                <div className="mb-6">
                    <div className="flex items-start justify-between">
                        <div className="w-[300px]">
                            <div className="grid grid-cols-2 gap-2">
                                <input
                                    type="text"
                                    value={firstName}
                                    onChange={updateFirstName}
                                    placeholder="Legal First Name"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wondergreen focus:border-transparent"
                                    disabled={saving}
                                />

                                <input
                                    type="text"
                                    value={lastName}
                                    onChange={updateLastName}
                                    placeholder="Legal Last Name"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wondergreen focus:border-transparent"
                                    disabled={saving}
                                />

                                <input
                                    type="text"
                                    value={preferredName}
                                    onChange={updatePreferredName}
                                    placeholder="OPTIONAL: Preferred Name"
                                    className="col-span-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wondergreen focus:border-transparent"
                                    disabled={saving}
                                />
                            </div>
                        </div>

                        <div className="flex gap-2 ml-4">
                            <button
                                type="submit"
                                disabled={!isValid || saving}
                                className="p-2 text-green-600 hover:text-green-700 disabled:text-gray-400 disabled:cursor-not-allowed"
                            >
                                <FaCheck className="w-4 h-4" />
                            </button>

                            <button
                                type="button"
                                onClick={() => setEditingChildId(null)}
                                disabled={saving}
                                className="p-2 text-red-600 hover:text-red-700 disabled:text-gray-400 disabled:cursor-not-allowed"
                            >
                                <FaX className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mb-4">
                    <div className="font-bold mb-2">BIRTHDAY</div>
                    <input
                        type="date"
                        value={birthday}
                        onChange={updateBirthday}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wondergreen focus:border-transparent"
                        disabled={saving}
                    />
                </div>

                <div className="flex flex-row justify-between mb-4">
                    <div>
                        <div className="font-bold mb-2">GRADE (OPTIONAL)</div>
                        <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wondergreen focus:border-transparent"
                            value={grade ?? ""}
                            onChange={updateGrade}
                        >
                            <option value="">N/A</option>
                            {gradeOptions.map(o => (
                                <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <div className="font-bold mb-2">PHOTO CONSENT</div>
                        <input
                            type="checkbox"
                            checked={photoConsent}
                            onChange={(e) => setPhotoConsent(e.currentTarget.checked)}
                            disabled={saving}
                        />
                    </div>
                </div>

                <div className="mb-4 border-t pt-4">
                    <div className="font-bold">EMERGENCY CONTACTS</div>
                    <div className="text-gray-500 text-sm my-1 ml-2">
                        <div className="space-y-3">
                            {ecs.map((c, i) => (
                                <div key={i} className="p-3 border rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="font-semibold">Contact {i + 1}</div>
                                        <button type="button" onClick={() => removeEC(i)} disabled={saving || ecs.length <= 1}
                                            className="text-sm text-red-600 hover:underline disabled:opacity-50"
                                        >
                                            Remove
                                        </button>
                                    </div>

                                    <div className="flex gap-3">
                                        <div className="flex-1">
                                            <input
                                                placeholder="First Name"
                                                value={c.firstName}
                                                onChange={handleECChange(i, "firstName")}
                                                disabled={saving}
                                                className="w-full p-3 border rounded-lg"
                                                maxLength={50}
                                                required={i === 0}
                                            />
                                            {ecErrors[i]?.firstName && <p className="text-sm text-red-600 mt-1">{ecErrors[i]?.firstName}</p>}
                                        </div>
                                        <div className="flex-1">
                                            <input
                                                placeholder="Last Name"
                                                value={c.lastName}
                                                onChange={handleECChange(i, "lastName")}
                                                disabled={saving}
                                                className="w-full p-3 border rounded-lg"
                                                maxLength={50}
                                                required={i === 0}
                                            />
                                            {ecErrors[i]?.lastName && <p className="text-sm text-red-600 mt-1">{ecErrors[i]?.lastName}</p>}
                                        </div>
                                    </div>

                                    <div className="mt-3">
                                        <input
                                            placeholder="Relationship to Child"
                                            value={c.relationship}
                                            onChange={handleECChange(i, "relationship")}
                                            disabled={saving}
                                            className="w-full p-3 border rounded-lg"
                                            maxLength={50}
                                            required={i === 0}
                                        />
                                        {ecErrors[i]?.relationship && <p className="text-sm text-red-600 mt-1">{ecErrors[i]?.relationship}</p>}
                                    </div>

                                    <div className="mt-3">
                                        <input
                                            type="tel"
                                            inputMode="tel"
                                            autoComplete="tel"
                                            placeholder="Phone Number"
                                            value={c.phoneNumber ?? ""}
                                            onChange={handleECChange(i, "phoneNumber", true)}
                                            disabled={saving}
                                            className="w-full p-3 border rounded-lg"
                                            maxLength={12}
                                            required={i === 0}
                                        />
                                        {ecErrors[i]?.phoneNumber && <p className="text-sm text-red-600 mt-1">{ecErrors[i]?.phoneNumber}</p>}
                                    </div>
                                </div>
                            ))}

                            <div className="flex justify-end">
                                <button type="button" onClick={addEC} disabled={saving || ecs.length >= 3}
                                    className="px-4 py-2 rounded-lg border border-green-600 text-green-700 hover:bg-green-50 disabled:opacity-50"
                                >
                                    + Add another ({ecs.length}/3)
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mb-4 border-t pt-4">
                    <div className="font-bold">MEDICAL ACCOMMODATIONS</div>
                    <textarea
                        value={allergiesMedical}
                        onChange={updateAllergiesMedical}
                        placeholder="List any allergies or medical accommodations"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wondergreen focus:border-transparent"
                        disabled={saving}
                    />
                </div>

                <div className="mb-4 border-t pt-4">
                    <div className="font-bold">ADDITIONAL NOTES</div>
                    <textarea
                        value={notes}
                        onChange={updateNotes}
                        placeholder="Optional: Please note any information that would be beneficial for instructor"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wondergreen focus:border-transparent"
                        disabled={saving}
                    />
                </div>
            </form>
        </div>
    )
}

export default UpdateChildForm
