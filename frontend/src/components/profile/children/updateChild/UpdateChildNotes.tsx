import { CreateChildForm } from "@/types/child"
import React from "react"

type Props = {
    form: CreateChildForm
    onChange: React.ChangeEventHandler<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    saving: boolean
}

export default function UpdateChildNotes({ form, onChange, saving }: Props) {
    return (
        <>
            <div className="mb-4 border-t pt-4">
                <div className="font-bold">MEDICAL ACCOMMODATIONS</div>
                <textarea
                    name="allergiesMedical"
                    value={form.allergiesMedical ?? ""}
                    onChange={onChange}
                    placeholder="List any allergies or medical accommodations"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wondergreen focus:border-transparent"
                    disabled={saving}
                />
            </div>

            <div className="mb-4 border-t pt-4">
                <div className="font-bold">ADDITIONAL NOTES</div>
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
