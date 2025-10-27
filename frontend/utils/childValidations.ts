// import { calculateAge } from "./dates"
import type { ECErrors, EmergencyContact } from "@/types/emergencyContact"
import { calculateAge } from "./calculateAge";
import { toE164US } from "./formatPhoneNumber";
// import { toE164U } from "./phone"

export const validateChildBasics = (child: {
  firstName: string; lastName: string; birthday: string
}) => {
  const errors: Record<string, string> = {}
  if (!child.firstName?.trim()) errors.firstName = "Required"
  if (!child.lastName?.trim()) errors.lastName = "Required"
  if (!child.birthday) errors.birthday = "Required"

  const age = child.birthday ? calculateAge(child.birthday) : NaN
  if (Number.isNaN(age) || age < 10 || age > 18) {
    errors.birthday = "Child's age must be between 10 and 18 years old."
  }
  return errors
}

export const validateECs = (ecs: EmergencyContact[]) => {
  const isFilled = (c: EmergencyContact) =>
    !!(c.firstName?.trim() || c.lastName?.trim() || c.relationship?.trim() || c.phoneNumber)

  const errs: ECErrors[] = ecs.map(() => ({}))
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

  return { errs, ok: firstOk && allOk }
}
