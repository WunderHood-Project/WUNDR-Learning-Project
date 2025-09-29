export const parseFloatOrNull = (v: string): number | null => {
    if (v === "" || v == null) return null
    const n = parseFloat(v)
    return Number.isFinite(n) ? n : null
}

export const parseIntOrZero = (v: string): number => {
  const n = parseInt(v, 10)
  return Number.isFinite(n) ? n : 0
}
