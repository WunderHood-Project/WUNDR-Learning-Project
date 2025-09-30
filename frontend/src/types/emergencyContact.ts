import { onlyDigitals } from "../../utils/formatPhoneNumber"

export type EmergencyContact = {
    id?: string
    firstName: string
    lastName: string
    phoneNumber: string | null
    relationship: string
}

export type ECUpdateForm = Omit<EmergencyContact, "id">;
export type ECErrors = Partial<Record<keyof ECUpdateForm, string>>
// export type ECErrors = Partial<{
//     firstName: string
//     lastName: string
//     relationship: string
//     phoneNumber: string
// }>
