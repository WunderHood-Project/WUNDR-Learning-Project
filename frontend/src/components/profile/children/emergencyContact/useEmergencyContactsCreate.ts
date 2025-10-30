import { ECCreateForm, ECErrors, EmergencyContact } from "@/types/emergencyContact"
import { useId, useMemo, useState } from "react"
import { formatUs, toE164US } from "../../../../../utils/formatPhoneNumber"


const blankEC = (): EmergencyContact => ({
  firstName: "",
  lastName: "",
  relationship: "",
  phoneNumber: ""
})

export function useEmergencyContactsCreate() {
	const rowPrefix = useId()
	const [ecs, setEcs] = useState<ECCreateForm[]>([blankEC()])
	const [ecErrors, setEcErrors] = useState<ECErrors[]>([{}])
	const [rowKeys, setRowKeys] = useState<string[]>([`${rowPrefix}-0`])

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
			const empty = !(c.firstName?.trim() || c.lastName?.trim() || c.relationship?.trim() || c.phoneNumber)
			if (empty) return null
			const phoneE164 = toE164US(c.phoneNumber)
			if (!phoneE164) return null

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
