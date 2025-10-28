import { CreateChildForm, type Child, type UpdateChildForm } from "@/types/child"
import React, { useEffect, useMemo, useRef, useState } from "react"
import { makeApiRequest } from "../../../../../utils/api"
import { ECErrors, ECUpdateForm } from "@/types/emergencyContact"
import { dedupeECs, ecsEqual } from "../../../../../utils/emergencyContactHelpers"
import { e164toUS, formatUs, toE164US } from "../../../../../utils/formatPhoneNumber"
import { determineEnv } from "../../../../../utils/api"
import { buildAddEC } from "../../../../../utils/childFormShared"
import UpdateChildHeaderFields from "./UpdateChildHeaderFields"
import UpdateChildMetaFields from "./UpdateChildMetaFields"
import UpdateEmergencyContactsSection from "../emergencyContact/UpdateEmergencyContactSection"
import UpdateChildNotes from "./UpdateChildNotes"

const WONDERHOOD_URL = determineEnv()

type Props = {
    currChild: Child
    setEditingChildId: (id: string | null) => void
    onPatched?: (id: string) => void
    refetchChildren?: () => Promise<void> | void
}

const blankEC = (): ECUpdateForm => ({
    firstName: "",
    lastName: "",
    relationship: "",
    phoneNumber: ""
});

const UpdateChildForm: React.FC<Props> = ({ currChild, setEditingChildId, onPatched, refetchChildren }) => {
    const hydratedIdRef = useRef<string | null>(null)
    const keySeq = useRef(0)
    const [ecs, setEcs] = useState<ECUpdateForm[]>([blankEC()])
    const [ecErrors, setEcErrors] = useState<ECErrors[]>([])
    const [saving, setSaving] = useState(false)
    const [serverError, setServerError] = useState<string | null>(null)
    const [rowKeys, setRowKeys] = useState<string[]>([String(keySeq.current++)])
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
        const id = currChild?.id
        if (!id) return

        if (hydratedIdRef.current === id) return

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
        setRowKeys(initial.map(() => String(keySeq.current++)))
        setServerError(null)

        hydratedIdRef.current = id
    }, [currChild.id])

    const isValid = useMemo(() => Boolean(form.firstName?.trim() && form.lastName?.trim()), [form.firstName, form.lastName])

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

        const { ok: ecOk, errs, deduped } = validateECs(ecs)
        setEcErrors(errs)
        if (!ecOk) {
            setServerError("Please fix the Emergency Contact errors")
            return
        }

        const currentECs: ECUpdateForm[] = (currChild.emergencyContacts ?? []).map(ec => ({
            firstName: ec.firstName ?? "",
            lastName: ec.lastName ?? "",
            relationship: ec.relationship ?? "",
            phoneNumber: e164toUS(ec.phoneNumber) ?? formatUs(ec.phoneNumber ?? "")
        }))

        const includeECs = !ecsEqual(deduped, currentECs)
        const payload = buildUpdatePayload(form, currChild)

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
            const updated = await makeApiRequest(`${WONDERHOOD_URL}/child/${currChild.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: payload
            }) as Child

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

    const addEC = buildAddEC(blankEC, keySeq, setEcs, setRowKeys, setEcErrors)

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

                <UpdateEmergencyContactsSection
                    ecs={ecs}
                    ecErrors={ecErrors}
                    rowKeys={rowKeys}
                    setEcs={setEcs}
                    setEcErrors={setEcErrors}
                    setRowKeys={setRowKeys}
                    onAdd={addEC}
                    saving={saving}
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
