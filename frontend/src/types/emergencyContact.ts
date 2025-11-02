export type ECShape = {
    firstName: string
    lastName: string
    phoneNumber?: string | null
    relationship: string
}

export type EmergencyContact = ECShape & {
    id?: string
    childIds?: string[];
}

export type ECUpdateForm = ECShape
export type ECCreateForm = ECShape

export type ECErrors = Partial<Record<keyof ECShape, string>>
export type ECErrorMap = Record<string, ECErrors>

export type ECFieldProps<T extends ECShape> = {
    ecs: T[]
    setEcs: React.Dispatch<React.SetStateAction<T[]>>
    ecErrors: ECErrors[]
    setEcErrors: React.Dispatch<React.SetStateAction<ECErrors[]>>
    rowKeys: string[]
    setRowKeys: React.Dispatch<React.SetStateAction<string[]>>
}
