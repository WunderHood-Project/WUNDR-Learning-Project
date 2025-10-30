import { CreateChildForm, type Child, type UpdateChildForm } from "@/types/child"
import React, { useEffect, useState } from "react"
import { makeApiRequest } from "../../../../../utils/api"
import { EmergencyContact } from "@/types/emergencyContact"
import { ecsEqual, validateECs } from "../../../../../utils/emergencyContactHelpers"
import { e164toUS, formatUs, toE164US } from "../../../../../utils/formatPhoneNumber"
import { determineEnv } from "../../../../../utils/api"
import UpdateChildHeaderFields from "./UpdateChildHeaderFields"
import UpdateChildMetaFields from "./UpdateChildMetaFields"
import UpdateChildNotes from "./UpdateChildNotes"
import { useAuth } from "@/context/auth"
import { useEmergencyContactsUpdate } from "../emergencyContact/useEmergencyContactsUpdate"
import EmergencyContactsList from "../emergencyContact/EmergencyContactsList"


const WONDERHOOD_URL = determineEnv()

type Props = {
    currChild: Child
    setEditingChildId: (id: string | null) => void
    onPatched?: (id: string) => void
    refetchChildren?: () => Promise<void> | void
}

const UpdateChildForm: React.FC<Props> = ({ currChild, setEditingChildId, onPatched, refetchChildren }) => {
    const { refetchUser } = useAuth()
    const hydrateKey = `${currChild?.id ?? ""} | ${currChild?.updatedAt ?? ""}`
    const { ecs, ecErrors, rowKeys, setEcErrors, addEC, removeEC, changeEC, changePhone } = useEmergencyContactsUpdate(currChild.emergencyContacts, hydrateKey)
    const [saving, setSaving] = useState(false)
    const [serverError, setServerError] = useState<string | null>(null)
    const [form, setForm] = useState<CreateChildForm>({
        firstName: "",
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

    useEffect(() =>{
        setForm({
            firstName: currChild.firstName ?? '',
            lastName: currChild.lastName ?? "",
            preferredName: currChild.preferredName ?? "",
            homeschool: Boolean(currChild.homeschool),
            grade: currChild.grade ?? null,
            birthday: currChild.birthday ? currChild.birthday.split("T")[0] : "",
            allergiesMedical: currChild.allergiesMedical ?? "",
            notes: currChild.notes ?? "",
            photoConsent: Boolean(currChild.photoConsent),
            waiver: Boolean(currChild.waiver),
            emergencyContacts: []
        })

        setServerError(null)
    }, [hydrateKey])

    const isValid = Boolean(form.firstName?.trim() && form.lastName?.trim())

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const target = e.currentTarget as HTMLInputElement
        const { type, name, value } = target

        if (!name) return

        if (type === "checkbox") {
            setForm(prev => ({ ...prev, [name]: target.checked }))
            setServerError(null)
            return
        }

        if (name === 'grade') {
            setForm(prev => ({ ...prev, grade: value === "" ? null : Number(value)}))
            setServerError(null)
            return
        }

        setForm(prev => ({ ...prev, [name]: value }))
        setServerError(null)
    }

    const buildUpdatePayload = (form: CreateChildForm, curr: Child): UpdateChildForm => {
        const payload: UpdateChildForm = {}
        const set = <K extends keyof UpdateChildForm>(k: K, v: UpdateChildForm[K]) => {payload[k] = v}

        if (form.firstName.trim() !== curr.firstName) set("firstName", form.firstName.trim())
        if (form.lastName.trim() !== curr.lastName) set("lastName", form.lastName.trim())

        const prefNext = form.preferredName?.trim() ?? ""
        if (prefNext !== (curr.preferredName ?? "")) {
            if (prefNext !== "") set('preferredName', prefNext)
        }

        const medNext = form.allergiesMedical?.trim() ?? ""
        if (medNext !== (curr.allergiesMedical ?? "")) {
            if (medNext !== "") set("allergiesMedical", medNext)
        }

        const notesNext = form.notes?.trim() ?? ""
        if (notesNext !== (curr.notes ?? "")) {
            if (notesNext !== "") set("notes", notesNext)
        }

        if (form.homeschool !== curr.homeschool) set("homeschool", form.homeschool)
        if (form.photoConsent !== curr.photoConsent) set("photoConsent", form.photoConsent)

        if ((form.grade ?? null) !== (curr.grade ?? null)) {
            if (form.grade !== null) set('grade', form.grade)
        }

        const uiCurrBirthday = curr.birthday ? curr.birthday.split("T")[0] : ""
        if (form.birthday && form.birthday !== uiCurrBirthday) {
            set('birthday', new Date(form.birthday).toISOString())
        }

        return payload
    }

    const submitUpdate = async () => {
        if (!isValid || saving) return

        const { ok: ecOk, errs, deduped } = validateECs(ecs as EmergencyContact[])
        setEcErrors(errs)
        if (!ecOk) {
            setServerError("Please fix the Emergency Contact errors")
            return
        }

        const currentECs = (currChild.emergencyContacts ?? []).map(ec => ({
            firstName: ec.firstName ?? "",
            lastName: ec.lastName ?? "",
            relationship: ec.relationship ?? "",
            phoneNumber: e164toUS(ec.phoneNumber) ?? formatUs(ec.phoneNumber ?? "")
        }))

        const includeECs = !ecsEqual(deduped, currentECs)
        const payload = buildUpdatePayload(form, currChild)

        if (includeECs && deduped.length > 0) {
            payload.emergencyContacts = deduped.map(c => ({
                firstName: c.firstName.trim(),
                lastName: c.lastName.trim(),
                relationship: c.relationship.trim(),
                phoneNumber: c.phoneNumber ? toE164US(c.phoneNumber) : null
            }))
        }

        try {
            setSaving(true)
            const response = await makeApiRequest(`${WONDERHOOD_URL}/child/${currChild.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: payload
            }) as { child: Child, message: string }

            const updated = response.child
            refetchUser()
            if (refetchChildren) await refetchChildren()
            onPatched?.(updated.id)
            setEditingChildId(null)
        } catch (err) {
            console.error("update failed", err)
            setServerError(err instanceof Error ? err.message : "Update failed. Please try again later")
        } finally {
            setSaving(false)
        }
    }

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        await submitUpdate()
    }

    return (
        <div className="bg-white rounded-lg p-6">
            <form onSubmit={handleUpdate}>
                <UpdateChildHeaderFields
                    form={form}
                    onChange={handleChange}
                    saving={saving}
                    onSubmitClick={submitUpdate}
                    onCancel={() => setEditingChildId(null)}
                    isValid={isValid}
                />

                <UpdateChildMetaFields
                    form={form}
                    onChange={handleChange}
                    saving={saving}
                />

                <EmergencyContactsList
                    ecs={ecs}
                    ecErrors={ecErrors}
                    rowKeys={rowKeys}
                    addEC={addEC}
                    removeEC={removeEC}
                    changeEC={changeEC}
                    changePhone={changePhone}
                />

                <UpdateChildNotes
                    form={form}
                    onChange={handleChange}
                    saving={saving}
                />
            </form>
        </div>
    )
}

export default UpdateChildForm
