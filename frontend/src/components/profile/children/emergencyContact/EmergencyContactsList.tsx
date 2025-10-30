import type { ECErrors, ECShape } from "@/types/emergencyContact"
import EmergencyContactRow from "./EmergencyContactRow"

type Props = {
	ecs: ECShape[]
	ecErrors: ECErrors[]
	rowKeys: string[]
	addEC: () => void
	removeEC: (i: number) => void
	changeEC: (i: number, patch: Partial<ECShape>) => void
	changePhone: (i: number, raw: string) => void
	disabled?: boolean
}

export default function EmergencyContactsList({ ecs, ecErrors, rowKeys, addEC, removeEC, changeEC, changePhone, disabled }: Props) {
	return (
		<div className="space-y-3">
			{ecs.map((c, i) => (
				<EmergencyContactRow
					key={rowKeys[i]}
					idx={i}
					value={c}
					error={ecErrors[i] ?? {}}
					onChange={changeEC}
					onPhone={changePhone}
					onRemove={!disabled ? removeEC : undefined}
					required={i === 0}
				/>
			))}

			<div className="flex justify-end">
				<button
					type="button"
					onClick={addEC}
					disabled={disabled || ecs.length >= 3}
					className="px-4 py-2 rounded-lg border border-green-600 text-green-700 hover:bg-green-50 disabled:opacity-50"
				>
					+ Add another ({ecs.length}/3)
				</button>
			</div>
		</div>
	)
}
