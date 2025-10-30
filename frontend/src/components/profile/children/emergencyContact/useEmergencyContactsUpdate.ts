import { ECErrors, ECUpdateForm, EmergencyContact } from "@/types/emergencyContact"
import { useEffect, useId, useRef, useState } from "react"
import { e164toUS, formatUs } from "../../../../../utils/formatPhoneNumber"

const blankEC = (): EmergencyContact => ({
  firstName: "",
  lastName: "",
  relationship: "",
  phoneNumber: ""
})

export function useEmergencyContactsUpdate(initial: EmergencyContact[] | undefined, hydrateKey: string) {
    const rowPrefix = useId()
    const [ecs, setEcs] = useState<ECUpdateForm[]>([blankEC()])
    const [ecErrors, setEcErrors] = useState<ECErrors[]>([{}])
    const [rowKeys, setRowKeys] = useState<string[]>([`${rowPrefix}-0`])
    const hydratedKeyRef = useRef<string | null>(null)

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

    const addEC = () => {
        if (ecs.length >= 3) return

        setEcs(prev => [...prev, blankEC()])
        setEcErrors(prev => [...prev, {}])
        setRowKeys(prev => [...prev, `${rowPrefix}-${prev.length}`])
    }

    const removeEC = (i: number) => {
        setEcs(prev => prev.filter((_, idx) => idx !== i))
        setEcErrors(prev => prev.filter((_, idx) => idx !== i))
        setRowKeys(prev => prev.filter((_, idx) => idx !== i))
    }

    const changeEC = (i: number, patch: Partial<EmergencyContact>) => {
        setEcs(prev => prev.map((c, idx) => idx === i ? { ...c, ...patch } : c))
    }

    const changePhone = (i: number, raw: string) => {
        setEcs(prev => prev.map((c, idx) => idx === i ? { ...c, phoneNumber: formatUs(raw) } : c))
    }

    return { ecs, ecErrors, rowKeys, setEcErrors, addEC, removeEC, changeEC, changePhone, setEcs, setRowKeys }
}
