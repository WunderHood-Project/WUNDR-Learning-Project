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
