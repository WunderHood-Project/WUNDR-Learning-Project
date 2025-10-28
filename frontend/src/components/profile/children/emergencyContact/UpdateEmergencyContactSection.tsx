import { ECErrors, ECUpdateForm } from "@/types/emergencyContact"
import React from "react"
import EmergencyContactField from "./EmergencyContactField"

type Props = {
    ecs: ECUpdateForm[]
    ecErrors: ECErrors[]
    rowKeys: string[]
    setEcs: React.Dispatch<React.SetStateAction<ECUpdateForm[]>>
    setEcErrors: React.Dispatch<React.SetStateAction<ECErrors[]>>
    setRowKeys: React.Dispatch<React.SetStateAction<string[]>>
    onAdd: () => void
    saving: boolean
}

export default function UpdateEmergencyContactsSection({ ecs, ecErrors, rowKeys, setEcs, setEcErrors, setRowKeys, onAdd, saving }: Props) {
    return (
        <div className="mb-4 border-t pt-4">
            <div className="font-bold">EMERGENCY CONTACTS</div>
            <div className="text-gray-500 text-sm my-1 ml-2">
                <div className="space-y-3">
                    <EmergencyContactField
                        ecs={ecs}
                        setEcs={setEcs}
                        ecErrors={ecErrors}
                        setEcErrors={setEcErrors}
                        rowKeys={rowKeys}
                        setRowKeys={setRowKeys}
                    />

                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={onAdd}
                            disabled={saving || ecs.length >= 3}
                            className="px-4 py-2 rounded-lg border border-green-600 text-green-700 hover:bg-green-50 disabled:opacity-50"
                        >
                            + Add another ({ecs.length}/3)
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
