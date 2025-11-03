import { ECErrorMap, ECErrors, ECUpdateForm, EmergencyContact } from "@/types/emergencyContact"
import { onlyDigitals, toE164US } from "./formatPhoneNumber"

const trimSpaces = (s = "") => s.replace(/\s+/g, " ").trim();

const normalizeEC = (c: EmergencyContact): EmergencyContact => ({
    firstName: trimSpaces(c.firstName || ""),
    lastName:  trimSpaces(c.lastName  || ""),
    relationship: trimSpaces(c.relationship || ""),
    phoneNumber: onlyDigitals(c.phoneNumber || ""),
    id: c.id
})

const ecKey = (c: EmergencyContact) =>
  `${(c.firstName||"").toLowerCase()}|${(c.lastName||"").toLowerCase()}|${(c.relationship||"").toLowerCase()}|${onlyDigitals(c.phoneNumber||"")}`;


// removes duplicate contacts within array
export const dedupeECs = (ecs: EmergencyContact[]): EmergencyContact[] => {
    const seen = new Set<string>()
    const out: EmergencyContact[] = []

    for (const raw of ecs) {
        const c = normalizeEC(raw)

        if (!(c.firstName || c.lastName || c.relationship || c.phoneNumber)) continue

        const key = ecKey(c);
        if (!seen.has(key)) {
            seen.add(key)
            out.push(c)
        }
    }

    return out
}

// compares currentContact array and potential edited array
//this is necessary to see if we run patch request with or w/o emergenecy contacts
export const ecsEqual = (a: ECUpdateForm[], b: ECUpdateForm[]) => {
    const toKeySet = (xs: ECUpdateForm[]) => new Set(xs.map(x => ecKey(normalizeEC(x as EmergencyContact))));


    //converts each each to a normalized set
    const A = toKeySet(a)
    const B = toKeySet(b)

    if (A.size !== B.size) return false
    for (const k of A) if (!B.has(k)) return false

    return true
}

export const validateECs = (ecs: EmergencyContact[], rowKeys?: string[]) => {
    const errs: ECErrors[] = ecs.map(() => ({}))

    const isFilled = (c: EmergencyContact) =>
        !!(c.firstName?.trim() || c.lastName?.trim() || c.relationship?.trim() || c.phoneNumber)

    ecs.forEach((c, i) => {
        const required = i === 0 || isFilled(c)
        if (!required) return

        if (!c.firstName?.trim()) errs[i].firstName = "Required"
        if (!c.lastName?.trim()) errs[i].lastName = "Required"
        if (!c.relationship?.trim()) errs[i].relationship = "Required"
        if (!toE164US(c.phoneNumber)) errs[i].phoneNumber = "Enter a valid US phone"
    })

    const firstOk =
        ecs.length > 0 &&
        !errs[0]?.firstName && !errs[0]?.lastName && !errs[0]?.relationship && !errs[0]?.phoneNumber

    const allOk = errs.every((e, i) => {
        const required = i === 0 || isFilled(ecs[i])
        return !required || Object.keys(e).length === 0
    })

    const deduped = dedupeECs(ecs)

    const errMap: ECErrorMap = {}
    errs.forEach((e, i) => {
        if (Object.keys(e).length === 0) return
        const key = rowKeys?.[i] ?? String(i)
        errMap[key] = e
    })

  return { errs, errMap, ok: firstOk && allOk, deduped }
}
