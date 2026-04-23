/** Returns how old a person will be on a given reference date. */
export const ageOnDate = (birthdayDate: string, referenceDate: string): number => {
    const [by, bm, bd] = birthdayDate.split('T')[0].split('-').map(Number);
    const [ry, rm, rd] = referenceDate.split('T')[0].split('-').map(Number);
    let age = ry - by;
    if (rm < bm || (rm === bm && rd < bd)) age--;
    return age;
};

export const calculateAge = (birthdayDate: string) => {
    const [y, m, d] = birthdayDate.split('T')[0].split('-').map(Number)
    const birthYear = y
    const birthMonth = m
    const birthDay = d

    const today = new Date();
    const thisYear = today.getUTCFullYear()
    const thisMonth = today.getUTCMonth() + 1
    const thisDay = today.getUTCDate()

    let age = thisYear - birthYear

    // Hasn't had birthday yet this year?
    if (thisMonth < birthMonth || (thisMonth === birthMonth && thisDay < birthDay)) {
        age--
    }

    return age
}
