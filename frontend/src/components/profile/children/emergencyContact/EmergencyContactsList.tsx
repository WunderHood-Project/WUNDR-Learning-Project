import type { ECErrorMap, ECErrors, ECShape } from "@/types/emergencyContact"
import EmergencyContactRow from "./EmergencyContactRow"

type Props = {
	ecs: ECShape[]
	ecErrors: ECErrors[]
	ecErrorMap: ECErrorMap
	rowKeys: string[]
	addEC: () => void
	removeEC: (i: number) => void
	changeEC: (i: number, patch: Partial<ECShape>) => void
	changePhone: (i: number, raw: string) => void
	disabled?: boolean
}

export default function EmergencyContactsList({ ecs, ecErrorMap, rowKeys, addEC, removeEC, changeEC, changePhone, disabled }: Props) {
	return (
		<div className="space-y-3">
			{ecs.map((c, i) => {
				const key = rowKeys[i]
				const errForRow = ecErrorMap[key] ?? {}

				return (
					<EmergencyContactRow
						key={rowKeys[i]}
						idx={i}
						value={c}
						error={errForRow}
						onChange={changeEC}
						onPhone={changePhone}
						onRemove={!disabled ? removeEC : undefined}
						required={i === 0}
					/>
				)
			})}

			<div className="flex w-full justify-center mt-4">
				<button
					type="button"
					onClick={addEC}
					disabled={disabled || ecs.length >= 3}
					className="px-6 py-3 rounded-xl border border-green-600 text-green-700 hover:bg-green-50 disabled:opacity-50"
				>
					+ Add another ({ecs.length}/3)
				</button>
			</div>


		</div>
	)
}
