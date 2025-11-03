import { ChildErrorsForm, CreateChildForm } from "@/types/child"
import React from "react"
import { gradeOptions } from "../../../../../utils/displayGrade"

type Props = {
    form: CreateChildForm
    onChange: React.ChangeEventHandler<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    saving: boolean
    errors: ChildErrorsForm
}

export default function UpdateChildMetaFields({ errors, form, onChange, saving }: Props) {
    const bdayErr = errors.birthday

    return (
        <>
            <div className="mb-4">
                <div className="font-bold mb-2">BIRTHDAY</div>
                <input
                    name="birthday"
                    type="date"
                    value={form.birthday}
                    max={new Date().toISOString().split("T")[0]}
                    onChange={onChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wondergreen focus:border-transparent"
                    disabled={saving}
                />
                {bdayErr && (<p id="firstName-error" className="mt-1 text-sm text-red-600">{bdayErr}</p>)}

            </div>

        {/* GRADE + PHOTO CONSENT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 items-start">
            {/* Grade */}
            <div>
            <label htmlFor="grade" className="block font-semibold tracking-wide text-wondergreen mb-2">
                GRADE (OPTIONAL)
            </label>
            <select
                id="grade"
                name="grade"
                value={form.grade ?? ""}
                onChange={onChange}
                disabled={saving}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-wondergreen/40"
            >
                <option value="">N/A</option>
                {gradeOptions.map(o => (
                <option key={o.value} value={o.value}>
                    {o.label}
                </option>
                ))}
            </select>
            </div>

            {/* Photo consent */}
            <div>
            <span className="block font-semibold tracking-wide text-wondergreen mb-2.5 ml-8">
                PHOTO CONSENT
            </span>

            <label htmlFor="photoConsent" className="inline-flex items-center gap-3 ml-8">
                <input
                id="photoConsent"
                name="photoConsent"
                type="checkbox"
                checked={!!form.photoConsent}
                onChange={onChange}
                disabled={saving}
                className="h-5 w-5 rounded accent-wondergreen focus:ring-wondergreen"
                />
                <span className="text-wonderforest">Allowed to appear in photos</span>
            </label>
            </div>
        </div>
        </>
    )
}
