import { ECErrors, EmergencyContact } from "@/types/emergencyContact"
import React, { useState } from "react";
import { formatUs } from "../../../../../utils/formatPhoneNumber";

// const blankEC = (): EmergencyContact => ({
//     id: "",
//     firstName: "",
//     lastName: "",
//     relationship: "",
//     phoneNumber: ""
// });

type Props = {
    ecs: EmergencyContact[]
    setEcs: React.Dispatch<React.SetStateAction<EmergencyContact[]>>
    ecErrors: Partial<Record<"firstName" | "lastName" | "phoneNumber" | "relationship", string>>[]
    setEcErrors: React.Dispatch<React.SetStateAction<Partial<Record<"firstName" | "lastName" | "phoneNumber" | "relationship", string>>[]>>
}

const EmergencyContactField: React.FC<Props> = ({ ecs, setEcs, ecErrors, setEcErrors }) => {
    // const [ecs, setEcs] = useState<EmergencyContact[]>([blankEC()])
    // const [ecErrors, setEcErrors] = useState<ECErrors[]>([])
    const [serverError, setServerError] = useState<string | null>(null)

    const handleECChange = (i: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.currentTarget

        setEcs(prev => prev.map((contact, idx) =>
            idx === i ?
                {
                    ...contact,
                    ...(name === "emergencyFirstName" ? { firstName: value }
                        : name === "emergencyLastName" ? { lastName: value }
                            : name === "relationship" ? { relationship: value }
                                : {})
                }
                : contact
        ))
        setServerError(null)
    }

    const handleECPhoneChange = (i: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.currentTarget

        setEcs(prev => prev.map((contact, idx) =>
            idx === i ?
                {
                    ...contact,
                    phoneNumber: formatUs(value)
                }
                : contact
        ))
        setServerError(null)
    }

    const removeEC = (i: number) => {
        setEcs(prev => prev.filter((_, idx) => idx !== i));
        setEcErrors(prev => prev.filter((_, idx) => idx !== i));
    }
    return (
        <div>
            {ecs.map((c, i) => (
                <div key={i} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                        <div className="font-semibold">Contact {i + 1}</div>
                        {i > 0 && (
                            <button type="button" onClick={() => removeEC(i)} className="text-sm text-red-600 hover:underline">
                                Remove
                            </button>
                        )}
                    </div>

                    <div className="flex flex-row gap-3 w-full">
                        <div className="flex-1">
                            <input
                                name="emergencyFirstName"
                                placeholder="First Name"
                                value={c.firstName}
                                onChange={handleECChange(i)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                maxLength={50}
                                required={i === 0}
                            />
                            {ecErrors[i]?.firstName && <p className="text-sm text-red-600 mt-1">{ecErrors[i]?.firstName}</p>}
                        </div>

                        <div className="flex-1">
                            <input
                                name="emergencyLastName"
                                placeholder="Last Name"
                                value={c.lastName}
                                onChange={handleECChange(i)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                maxLength={50}
                                required={i === 0}
                            />
                            {ecErrors[i]?.lastName && <p className="text-sm text-red-600 mt-1">{ecErrors[i]?.lastName}</p>}
                        </div>
                    </div>

                    <div className="mt-3">
                        <input
                            name="relationship"
                            placeholder="Relationship to Child"
                            value={c.relationship}
                            onChange={handleECChange(i)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            maxLength={50}
                            required={i === 0}
                        />
                        {ecErrors[i]?.relationship && <p className="text-sm text-red-600 mt-1">{ecErrors[i]?.relationship}</p>}
                    </div>

                    <div className="mt-3">
                        <input
                            type="tel"
                            name="phoneNumber"
                            inputMode="tel"
                            autoComplete="tel"
                            maxLength={12}
                            placeholder="Phone Number"
                            value={c?.phoneNumber ?? ""}
                            onChange={handleECPhoneChange(i)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            required={i === 0}
                        />
                        {ecErrors[i]?.phoneNumber && <p className="text-sm text-red-600 mt-1">{ecErrors[i]?.phoneNumber}</p>}
                    </div>
                </div>
            ))}
        </div>

    )
}

export default EmergencyContactField
