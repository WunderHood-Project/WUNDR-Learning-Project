import type { EmergencyContact, ECErrors } from "@/types/emergencyContact"

type RowProps = {
	idx: number
	value: EmergencyContact
	error: ECErrors
	onChange: (idx: number, patch: Partial<EmergencyContact>) => void
	onPhone: (idx: number, raw: string) => void
	onRemove?: (idx: number) => void
	required?: boolean
}

export default function EmergencyContactRow({ idx, value, error, onChange, onPhone, onRemove, required }: RowProps) {
	return (
		<div className="p-3 border rounded-lg">
			<div className="flex items-center justify-between mb-2">
				<div className="font-semibold">Contact {idx + 1}</div>
				{onRemove && idx > 0 && (
					<button type="button" onClick={() => onRemove(idx)} className="text-sm text-red-600 hover:underline">
						Remove
					</button>
				)}
			</div>

			<div className="flex gap-3">
				<div className="flex-1">
					<input
						name="firstName"
						placeholder="First Name"
						value={value.firstName}
						onChange={e => onChange(idx, { firstName: e.currentTarget.value })}
						className="w-full p-3 border rounded-lg"
						maxLength={50}
						required={required}
					/>
					{error.firstName && <p className="text-sm text-red-600 mt-1">{error.firstName}</p>}
				</div>

				<div className="flex-1">
					<input
						name="lastName"
						placeholder="Last Name"
						value={value.lastName}
						onChange={e => onChange(idx, { lastName: e.currentTarget.value })}
						className="w-full p-3 border rounded-lg"
						maxLength={50}
						required={required}
					/>
					{error.lastName && <p className="text-sm text-red-600 mt-1">{error.lastName}</p>}
				</div>
			</div>

			<div className="mt-3">
				<input
					name="relationship"
					placeholder="Relationship to Child"
					value={value.relationship}
					onChange={e => onChange(idx, { relationship: e.currentTarget.value })}
					className="w-full p-3 border rounded-lg"
					maxLength={50}
					required={required}
				/>
				{error.relationship && <p className="text-sm text-red-600 mt-1">{error.relationship}</p>}
			</div>

			<div className="mt-3">
				<input
					type="tel"
					name="phoneNumber"
					inputMode="tel"
					autoComplete="tel"
					maxLength={12}
					placeholder="Phone Number"
					value={value.phoneNumber ?? ""}
					onChange={e => onPhone(idx, e.currentTarget.value)}
					className="w-full p-3 border rounded-lg" required={required}
				/>
				{error.phoneNumber && <p className="text-sm text-red-600 mt-1">{error.phoneNumber}</p>}
			</div>
		</div>
	)
}
