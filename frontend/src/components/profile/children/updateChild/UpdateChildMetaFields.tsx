import { CreateChildForm } from "@/types/child"
import React from "react"
import { gradeOptions } from "../../../../../utils/displayGrade"

type Props = {
    form: CreateChildForm
    onChange: React.ChangeEventHandler<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    saving: boolean
}

export default function UpdateChildMetaFields({ form, onChange, saving }: Props) {
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
            </div>

            <div className="flex flex-row justify-between mb-4">
                <div>
                    <div className="font-bold mb-2">GRADE (OPTIONAL)</div>
                    <select
                        name="grade"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wondergreen focus:border-transparent"
                        value={form.grade ?? ""}
                        onChange={onChange}
                        disabled={saving}
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
                        name="photoConsent"
                        type="checkbox"
                        checked={form.photoConsent}
                        onChange={onChange}
                        disabled={saving}
                    />
                </div>
            </div>
        </>
    )
}
