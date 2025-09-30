import { onlyDigitals } from "../../utils/formatPhoneNumber"

export type EmergencyContact = {
    id?: string
    firstName: string
    lastName: string
    phoneNumber: string | null
    relationship: string
}

export type ECInput = Pick<EmergencyContact, "id" | "firstName" | "lastName" | "phoneNumber" | "relationship">
export type ECUpdateForm = Omit<ECInput, "id">;

export type ECErrors = Partial<{
    firstName: string
    lastName: string
    relationship: string
    phoneNumber: string
}>

const normalizeEC = (c: ECUpdateForm) => ({
    firstName: (c.firstName || "").trim().toLowerCase(),
    lastName: (c.lastName || "").trim().toLowerCase(),
    relationship: (c.relationship || "").trim().toLowerCase(),
    phoneNumber: onlyDigitals(c.phoneNumber || "")
})

// removes duplicate contacts within array
export const dedupeECs = (arr: ECUpdateForm[]) => {
    const seen = new Set<string>()
    const out: ECUpdateForm[] = []

    for (const contact of arr) {
        const key = JSON.stringify(normalizeEC(contact))

        if (!seen.has(key)) {
            seen.add(key)
            out.push(contact)
        }
    }

    return out.slice(0, 3);
}

// compares currentContact array and potential edited array
//this is necessary to see if we run patch request with or w/o emergenecy contacts
export const ecsEqual = (a: ECUpdateForm[], b: ECUpdateForm[]) => {
    const toKeySet = (xs: ECUpdateForm[]) => new Set(xs.map(x => JSON.stringify(normalizeEC(x))))

    //converts each each to a normalized set
    const A = toKeySet(a)
    const B = toKeySet(b)

    if (A.size !== B.size) return false
    for (const k of A) if (!B.has(k)) return false

    return true
}
