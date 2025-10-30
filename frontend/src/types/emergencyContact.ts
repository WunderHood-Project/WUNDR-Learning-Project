export type ECShape = {
    firstName: string
    lastName: string
    phoneNumber?: string | null
    relationship: string
}

export type EmergencyContact = ECShape & {
    id?: string
    // firstName: string
    // lastName: string
    // phoneNumber: string | null
    // relationship: string
}

// export type ECUpdateForm = Omit<EmergencyContact, "id">;
export type ECUpdateForm = ECShape
export type ECCreateForm = ECShape

export type ECErrors = Partial<Record<keyof ECShape, string>>

// export type ECErrors = Partial<{
//     firstName: string
//     lastName: string
//     relationship: string
//     phoneNumber: string
// }>


export type ECFieldProps<T extends ECShape> = {
    ecs: T[]
    setEcs: React.Dispatch<React.SetStateAction<T[]>>
    ecErrors: ECErrors[]
    setEcErrors: React.Dispatch<React.SetStateAction<ECErrors[]>>
    rowKeys: string[]
    setRowKeys: React.Dispatch<React.SetStateAction<string[]>>
}
