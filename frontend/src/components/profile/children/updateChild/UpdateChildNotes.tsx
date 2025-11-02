import { ChildErrorsForm, CreateChildForm } from "@/types/child"
import React from "react"

type Props = {
    form: CreateChildForm
    errors: ChildErrorsForm
    onChange: React.ChangeEventHandler<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    saving: boolean
}

export default function UpdateChildNotes({ form, errors, onChange, saving }: Props) {
    return (
        <>
            <div className="mb-4 border-t pt-4">
                <div className="font-bold mb-2">MEDICAL ACCOMMODATIONS</div>
                <textarea
                    name="allergiesMedical"
                    value={form.allergiesMedical ?? ""}
                    onChange={onChange}
                    placeholder="List allergies/medical accommodations (N/A if none)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wondergreen focus:border-transparent"
                    disabled={saving}
                />
                {errors.allergiesMedical && (<p id="firstName-error" className="mt-1 text-sm text-red-600">{errors.allergiesMedical}</p>)}

            </div>

            <div className="mb-4 border-t pt-4">
                <div className="font-bold mb-2">ADDITIONAL NOTES</div>
                <textarea
                    name="notes"
                    value={form.notes ?? ""}
                    onChange={onChange}
                    placeholder="Optional: Please note any information that would be beneficial for instructor"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wondergreen focus:border-transparent"
                    disabled={saving}
                />
            </div>

        </>
    )
}
