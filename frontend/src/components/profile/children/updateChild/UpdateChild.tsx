import { ChildErrorsForm, CreateChildForm, type Child, type UpdateChildForm } from "@/types/child"
import React, { useEffect, useState } from "react"
import { makeApiRequest } from "../../../../../utils/api"
import { toE164US } from "../../../../../utils/formatPhoneNumber"
import { determineEnv } from "../../../../../utils/api"
import UpdateChildHeaderFields from "./UpdateChildHeaderFields"
import UpdateChildMetaFields from "./UpdateChildMetaFields"
import UpdateChildNotes from "./UpdateChildNotes"
import { useAuth } from "@/context/auth"
import { useEmergencyContactsUpdate } from "../emergencyContact/useEmergencyContactsUpdate"
import EmergencyContactsList from "../emergencyContact/EmergencyContactsList"
import { validateChildBasics } from "../../../../../utils/childValidations"


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
    const { ecs, ecErrors, ecErrorMap, rowKeys, setEcErrors, setEcErrorMap, addEC, removeEC, changeEC, changePhone, validateNow } = useEmergencyContactsUpdate(currChild.emergencyContacts, hydrateKey)
    const [saving, setSaving] = useState(false)
    const [errors, setErrors] = useState<ChildErrorsForm>({})
    const [serverError, setServerError] = useState<string | null>(null);
    const [form, setForm] = useState<CreateChildForm>({
        firstName: "", lastName: '', preferredName: "",
        homeschool: true, grade: null, birthday: '',
        allergiesMedical: "", notes: "",
        photoConsent: false, waiver: false,
        emergencyContacts: []
    })

    useEffect(() => {
        const hydrated: CreateChildForm = {
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
        };

        setForm(hydrated);
        setServerError(null);

        const initialErrs = validateChildBasics({
            firstName: hydrated.firstName,
            lastName: hydrated.lastName,
            birthday: hydrated.birthday,
            allergiesMedical: (hydrated.allergiesMedical ?? "")
        }) as ChildErrorsForm;

        setErrors(initialErrs);
        setEcErrors([]);
        setEcErrorMap({});
        // currChild (and/or hydrateKey)me: hydrated.firstName,
    }, [currChild, hydrateKey, setEcErrors, setEcErrorMap]); 

    const isValid = Object.keys(errors).length === 0

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const target = e.currentTarget as HTMLInputElement
        const { type, name, value } = target

        if (!name) return
        setServerError(null)

        setForm(prev => {
            const data: CreateChildForm = {
                ...prev,
                ...(type === "checkbox"
                    ? { [name]: target.checked }
                    : name === "grade"
                        ? { grade: value === "" ? null : Number(value) }
                        : { [name]: value })
            }

            if (name === "firstName" || name === "lastName" || name === "birthday" || name === "allergiesMedical") {
                const basicValidations = validateChildBasics({
                    firstName: data.firstName.trim(),
                    lastName: data.lastName.trim(),
                    birthday: data.birthday.trim(),
                    allergiesMedical: (data.allergiesMedical ?? "").trim()
                }) as ChildErrorsForm
                setErrors(basicValidations)
            }

            return data
        })
    }

    const buildUpdatePayload = (form: CreateChildForm, curr: Child): UpdateChildForm => {
        const payload: UpdateChildForm = {}
        const set = <K extends keyof UpdateChildForm>(k: K, v: UpdateChildForm[K]) => { payload[k] = v }

        const prefNext  = (form.preferredName ?? "").trim()
        const medNext   = (form.allergiesMedical ?? "").trim()
        const notesNext = (form.notes ?? "").trim()
        const uiCurrBirthday = curr.birthday ? curr.birthday.split("T")[0] : ""

        if (form.firstName.trim() !== curr.firstName) set("firstName", form.firstName.trim())
        if (form.lastName.trim()  !== curr.lastName)  set("lastName",  form.lastName.trim())

        const currPref = curr.preferredName ?? ""
        if (prefNext !== currPref) set("preferredName", prefNext === "" ? null : prefNext)

        const currNotes = curr.notes ?? ""
        if (notesNext !== currNotes) set("notes", notesNext === "" ? null : notesNext)

        if (medNext !== (curr.allergiesMedical ?? "")) set("allergiesMedical", medNext)
        if (form.homeschool !== curr.homeschool) set("homeschool", form.homeschool)
        if (form.photoConsent !== curr.photoConsent) set("photoConsent", form.photoConsent)

        if (form.birthday && form.birthday !== uiCurrBirthday) {
            set("birthday", new Date(form.birthday).toISOString())
        }

        if ((form.grade ?? null) !== (curr.grade ?? null)) {
            set("grade", form.grade == null ? null : form.grade)
        }

        return payload
    }


    const submitUpdate = async () => {
        if (saving) return

        if (!isValid) {
            setServerError("Please fix the errors above")
            return
        }

        const childErrors: ChildErrorsForm = validateChildBasics({
            firstName: form.firstName.trim(),
            lastName: form.lastName.trim(),
            birthday: form.birthday.trim(),
            allergiesMedical: (form.allergiesMedical ?? "").trim()
        }) as ChildErrorsForm

        setErrors(childErrors)
        if (Object.keys(childErrors).length) {
            setServerError("Please fix the errors above")
            return
        }

        const { ok: ecOk, deduped } = validateNow()
        if (!ecOk || deduped.length === 0) {
            setServerError("Please fix the Emergency Contact errors")
            return
        }
        // normalize phones -> E.164
        const transformedECs = deduped.map(c => ({
            firstName: c.firstName.trim(),
            lastName: c.lastName.trim(),
            relationship: c.relationship.trim(),
            phoneNumber: toE164US(c.phoneNumber || "")
        }));

        if (transformedECs.some(ec => !ec.phoneNumber)) {
            setServerError("Please provide valid phone numbers (E.164, e.g. +12025550123)");
            return;
        }

        // final payload: use ONLY transformedECs
        const payload = buildUpdatePayload(form, currChild);
        payload.emergencyContacts = transformedECs;

        try {
            setSaving(true);
            const response = await makeApiRequest(`${WONDERHOOD_URL}/child/${currChild.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: payload
            }) as { child: Child, message: string };

            const updated = response.child;
            refetchUser();
            if (refetchChildren) await refetchChildren();
            onPatched?.(updated.id);
            setEditingChildId(null);
        } catch (err) {
            console.error("update failed", err);
            setServerError(err instanceof Error ? err.message : "Update failed. Please try again later");
        } finally {
            setSaving(false);
        }
    };

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        await submitUpdate()
    }

    return (
        <div className="bg-white rounded-lg p-6">
            {serverError && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm">
                    {serverError}
                </div>
            )}
            <form onSubmit={handleUpdate}>
                <UpdateChildHeaderFields
                    form={form}
                    errors={errors}
                    onChange={handleChange}
                    saving={saving}
                    onSubmitClick={submitUpdate}
                    onCancel={() => setEditingChildId(null)}
                    isValid={isValid}
                />

                <UpdateChildMetaFields
                    form={form}
                    errors={errors}
                    onChange={handleChange}
                    saving={saving}
                />

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

                <UpdateChildNotes
                    form={form}
                    errors={errors}
                    onChange={handleChange}
                    saving={saving}
                />
            </form>
        </div>
    )
}

export default UpdateChildForm
