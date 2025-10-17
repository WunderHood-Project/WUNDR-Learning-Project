import type { Child, UpdateChildForm } from "@/types/child"
import React, { useEffect, useMemo, useState } from "react"
import { makeApiRequest } from "../../../../utils/api"
import { FaCheck } from "react-icons/fa"
import { FaX } from "react-icons/fa6"
import { gradeOptions } from "../../../../utils/displayGrade"
import { ECErrors, ECUpdateForm } from "@/types/emergencyContact"
import { dedupeECs, ecsEqual } from "../../../../utils/emergencyContactHelpers"
import { e164toUS, formatUs, toE164US } from "../../../../utils/formatPhoneNumber"
import { determineEnv } from "../../../../utils/api"
import { useChild } from "../../../../hooks/useChild"
import EmergencyContactField from "./emergencyContact/EmergencyContactField"
import { convertStringToIsoFormat } from "../../../../utils/formatDate"

const WONDERHOOD_URL = determineEnv()

type Props = {
    currChild: Child
    setEditingChildId: (id: string | null) => void
}

const blankEC = (): ECUpdateForm => ({
    firstName: "",
    lastName: "",
    relationship: "",
    phoneNumber: ""
});

const UpdateChildForm: React.FC<Props> = ({ currChild, setEditingChildId }) => {
    const { refetch } = useChild(undefined)
    const [ecs, setEcs] = useState<ECUpdateForm[]>([blankEC()])
    const [updatedChild, setUpdatedChild] = useState<UpdateChildForm | null>(null)
    const [saving, setSaving] = useState(false)
    const [ecErrors, setEcErrors] = useState<ECErrors[]>([])

    // useEffect(() => {
    //     const initialFromServer: ECUpdateForm[] =
    //         (currChild.emergencyContacts ?? []).map(ec => ({
    //             firstName: ec.firstName ?? "",
    //             lastName: ec.lastName ?? "",
    //             relationship: ec.relationship ?? "",
    //             phoneNumber: e164toUS(ec.phoneNumber) ?? formatUs(ec.phoneNumber ?? "")
    //         }))

    //     const initial = initialFromServer.length ? initialFromServer : [blankEC()]
    //     setEcs(initial)
    //     setEcErrors(initial.map(() => ({})))
    // }, [currChild])

    const isValid = useMemo(() => Boolean(currChild.firstName?.trim() && currChild.lastName?.trim()), [currChild.firstName, currChild.lastName])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const target = e.currentTarget as HTMLInputElement
        const { type, name, value } = target

        if (type === "checkbox") {
            setUpdatedChild((prev) => ({
                ...prev,
                [name]: target.checked
            }))
        }

        setUpdatedChild(prev => {
            if (!prev) return prev
            return { ...prev, [name]: value }
        })
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

        const checkBirthdayType = () => {
            if (typeof updatedChild?.birthday === "string") {
                convertStringToIsoFormat(updatedChild.birthday)
            } else {
                return undefined
            }
        }

        const payload: UpdateChildForm = {
            ...updatedChild,
            birthday: checkBirthdayType()
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
            refetch()
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
                                    value={currChild?.firstName}
                                    onChange={handleChange}
                                    placeholder="Legal First Name"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wondergreen focus:border-transparent"
                                    disabled={saving}
                                />

                                <input
                                    type="text"
                                    value={currChild?.lastName}
                                    onChange={handleChange}
                                    placeholder="Legal Last Name"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wondergreen focus:border-transparent"
                                    disabled={saving}
                                />

                                <input
                                    type="text"
                                    value={currChild.preferredName}
                                    onChange={handleChange}
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
                        value={currChild.birthday.split("T")[0]}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wondergreen focus:border-transparent"
                        disabled={saving}
                    />
                </div>

                <div className="flex flex-row justify-between mb-4">
                    <div>
                        <div className="font-bold mb-2">GRADE (OPTIONAL)</div>
                        <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wondergreen focus:border-transparent"
                            value={currChild.grade || ""}
                            onChange={handleChange}
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
                            checked={currChild.photoConsent}
                            onChange={handleChange}
                            disabled={saving}
                        />
                    </div>
                </div>

                <div className="mb-4 border-t pt-4">
                    <div className="font-bold">EMERGENCY CONTACTS</div>
                    <div className="text-gray-500 text-sm my-1 ml-2">
                        <div className="space-y-3">
                            <EmergencyContactField ecs={ecs} setEcs={setEcs} ecErrors={ecErrors} setEcErrors={setEcErrors} />

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
                        value={currChild.allergiesMedical || ""}
                        onChange={handleChange}
                        placeholder="List any allergies or medical accommodations"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wondergreen focus:border-transparent"
                        disabled={saving}
                    />
                </div>

                <div className="mb-4 border-t pt-4">
                    <div className="font-bold">ADDITIONAL NOTES</div>
                    <textarea
                        value={currChild.notes || ""}
                        onChange={handleChange}
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
