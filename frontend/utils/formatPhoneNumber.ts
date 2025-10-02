export const onlyDigitals = (s: string) => s.replace(/\D/g, "")

export const formatUs = (s: string) => {
    const d = onlyDigitals(s).slice(0, 10)

    const p1 = d.slice(0, 3)
    const p2 = d.slice(3, 6)
    const p3 = d.slice(6, 10)

    return [p1, p2, p3].filter(Boolean).join("-")
}

export const toE164US = (phoneNumber?: string | null): string | null => {
    if (!phoneNumber) return null
    const d = onlyDigitals(phoneNumber)
    const ten = d.length === 11 && d.startsWith("1") ? d.slice(1) : d
    return ten.length === 10 ? `+1${ten}` : null
}

export const e164toUS = (e164?: string | null) => {
    if (!e164) return
    const m = e164.match(/^\+1(\d{10})$/)
    const raw = m ? m[1] : onlyDigitals(e164).slice(0, 10)
    return formatUs(raw)
}
