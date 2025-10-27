import { ECErrors, EmergencyContact } from "@/types/emergencyContact"
import { useId, useMemo, useState } from "react"
import { formatUs, toE164US } from "../../../../../utils/formatPhoneNumber"
// import type { EmergencyContact, ECErrors } from "@/types/emergencyContact"
// import { formatUs, toE164US } from "@/utils/phone"

const blankEC = (): EmergencyContact => ({
  firstName: "",
  lastName: "",
  relationship: "",
  phoneNumber: ""
})

export function useEmergencyContacts(initial?: EmergencyContact[]) {
	const rowPrefix = useId()
	const [ecs, setEcs] = useState<EmergencyContact[]>(initial?.length ? initial : [blankEC()])
	const [ecErrors, setEcErrors] = useState<ECErrors[]>(ecs.map(() => ({})))
	const [rowKeys, setRowKeys] = useState<string[]>(ecs.map((_, i) => `${rowPrefix}-${i}`))

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

	const toPayload = useMemo(() => ecs
		.map(c => {
			const phoneE164 = toE164US(c.phoneNumber)
			const empty = !(c.firstName?.trim() || c.lastName?.trim() || c.relationship?.trim() || c.phoneNumber)
			if (empty) return null

			return {
				firstName: c.firstName.trim(),
				lastName: c.lastName.trim(),
				relationship: c.relationship.trim(),
				phoneNumber: phoneE164!
			}
		})
		.filter(Boolean) as EmergencyContact[], [ecs])

	return { ecs, ecErrors, rowKeys, setEcErrors, addEC, removeEC, changeEC, changePhone, toPayload, setEcs, setRowKeys }
}
