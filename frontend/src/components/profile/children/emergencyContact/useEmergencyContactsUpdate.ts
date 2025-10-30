import { ECErrorMap, ECErrors, ECShape, ECUpdateForm, EmergencyContact } from "@/types/emergencyContact"
import { useCallback, useEffect, useId, useRef, useState } from "react"
import { e164toUS, formatUs } from "../../../../../utils/formatPhoneNumber"
import { validateECs } from "../../../../../utils/emergencyContactHelpers"


type ECField = keyof ECShape;
const EC_FIELDS: readonly ECField[] = ['firstName','lastName','phoneNumber','relationship'] as const;

function toECFields(patch: Partial<EmergencyContact>): ECField[] {
    return EC_FIELDS.filter((f) => Object.prototype.hasOwnProperty.call(patch, f))
}



const blankEC = (): EmergencyContact => ({
  firstName: "",
  lastName: "",
  relationship: "",
  phoneNumber: ""
})

export function useEmergencyContactsUpdate(initial: EmergencyContact[] | undefined, hydrateKey: string) {
    const rowPrefix = useId()
    const hydratedKeyRef = useRef<string | null>(null)
    const [ecs, setEcs] = useState<ECUpdateForm[]>([blankEC()])
    const [ecErrors, setEcErrors] = useState<ECErrors[]>([{}])
    const [ecErrorMap, setEcErrorMap] = useState<ECErrorMap>({})
    const [rowKeys, setRowKeys] = useState<string[]>([`${rowPrefix}-0`])

    useEffect(() => {
        if (hydratedKeyRef.current === hydrateKey) return

        const start = (initial ?? []).map(ec => ({
        firstName: ec.firstName ?? "",
        lastName: ec.lastName ?? "",
        relationship: ec.relationship ?? "",
        phoneNumber: e164toUS(ec.phoneNumber) ?? formatUs(ec.phoneNumber ?? "")
        }))

        const list = start.length ? start : [blankEC()]
        setEcs(list)
        setEcErrors(list.map(() => ({})))
        setRowKeys(list.map((_, i) => `${rowPrefix}-${i}`))
        hydratedKeyRef.current = hydrateKey
    }, [hydrateKey, initial, rowPrefix])

    const addEC = useCallback(() => {
        setEcs(prev => {
            if (prev.length >= 3) return prev

            const next = [...prev, blankEC()]
            setEcErrors(e => [...e, {}])
            setRowKeys(rk => [...rk, `${rowPrefix}-${rk.length}`])
            return next
        })
    }, [rowPrefix])

    const removeEC = useCallback((i: number) => {
        setEcs(prev => prev.filter((_, idx) => idx !== i))
        setEcErrors(prev => prev.filter((_, idx) => idx !== i))
        setRowKeys(prev => prev.filter((_, idx) => idx !== i))
        setEcErrorMap(prev => {
            const next: ECErrorMap = {}
            rowKeys.forEach((k, idx) => {
                if (idx === i) return
                const srcKey = k
                const destIdx = idx > i ? idx - 1 : idx
                const destKey = `${rowPrefix}-${destIdx}`
                if (prev[srcKey as any]) next[destKey] = prev[srcKey as any]
            })
            return next
        })
    }, [rowKeys, rowPrefix])

    const changeEC = useCallback((i: number, patch: Partial<EmergencyContact>) => {
        setEcs(prev => prev.map((c, idx) => (idx === i ? { ...c, ...patch } : c)))

        const key = rowKeys[i]
        setEcErrors(prev => {
            const copy = [...prev]
            const row = { ...(copy[i] ?? {}) }
            for (const f of toECFields(patch)) {
                delete row[f]
            }
            copy[i] = row
            return copy
        })
        setEcErrorMap(prev => {
            const next = { ...prev }
            const key = rowKeys[i]
            const row: ECErrors = { ...(next[key] ?? {}) }
            for (const f of toECFields(patch)) {
                delete row[f]
            }
            if (Object.keys(row).length) next[key] = row
            else delete next[key]
            return next
        })
    }, [rowKeys])

    const changePhone = useCallback((i: number, raw: string) => {
        setEcs(prev => prev.map((c, idx) => (idx === i ? { ...c, phoneNumber: formatUs(raw) } : c)))

        const key = rowKeys[i]
        setEcErrors(prev => {
            const copy = [...prev]
            const row: ECErrors = { ...(copy[i] ?? {}) }
            delete row.phoneNumber
            copy[i] = row
            return copy
        })
        setEcErrorMap(prev => {
            const next = { ...prev }
            const key = rowKeys[i]
            const row: ECErrors = { ...(next[key] ?? {}) }
            delete row.phoneNumber
            if (Object.keys(row).length) next[key] = row
            else delete next[key]
            return next
        })
    }, [rowKeys])

    const validateNow = useCallback(() => {
        const { errs, errMap, ok, deduped } = validateECs(ecs as EmergencyContact[], rowKeys)
        setEcErrors(errs)
        setEcErrorMap(errMap)
        return { ok, deduped }
    }, [ecs, rowKeys])

    return { ecs, ecErrors, ecErrorMap, rowKeys, setEcErrors, setEcErrorMap, addEC, removeEC, changeEC, changePhone, setEcs, setRowKeys, validateNow }
}
