import { calculateAge } from "./calculateAge";


export const validateChildBasics = (child: {
  firstName: string; lastName: string; birthday: string; allergiesMedical: string
}) => {
  const errors: Record<string, string> = {}
  if (!child.firstName?.trim()) errors.firstName = "Required"
  if (!child.lastName?.trim()) errors.lastName = "Required"
  if (!child.birthday) errors.birthday = "Required"
  if (!child.allergiesMedical) errors.allergiesMedical = "Required"

  const age = child.birthday ? calculateAge(child.birthday) : NaN
  if (Number.isNaN(age) || age < 10 || age > 18) {
    errors.birthday = "Child's age must be between 10 and 18 years old."
  }
  return errors
}
