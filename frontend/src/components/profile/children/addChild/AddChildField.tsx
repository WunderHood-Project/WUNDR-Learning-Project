import { ChildErrorsForm, CreateChildForm } from "@/types/child"
import { gradeOptions } from "../../../../../utils/displayGrade"
import React from "react"
// import OpenModalButton from "@/context/openModalButton";
// import PhotoConsentText from "./PhotoConsentText";
import PhotoConsentDisclosure from "./PhotoConsentDisclosure";
import { PHOTO_CONSENT_VERSION } from "@/constants/policies";

type Props = {
	child: CreateChildForm
	onChange: React.ChangeEventHandler<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
	errors?: ChildErrorsForm
}

export default function ChildFields({ child, onChange, errors = {} }: Props) {
	return (
		<>
			<div className="flex gap-3">
				<div className="flex flex-col">
					<input
						name="firstName"
						placeholder="Legal First Name"
						value={child.firstName}
						onChange={onChange}
						className="w-full p-3 border rounded-lg"
						maxLength={50}
						required
					/>
					{errors.firstName && <p className="text-sm text-red-600">{errors.firstName}</p>}
				</div>

				<div className="flex flex-col">
					<input
						name="lastName"
						placeholder="Legal Last Name"
						value={child.lastName}
						onChange={onChange}
						className="w-full p-3 border rounded-lg"
						maxLength={50}
						required
					/>
					{errors.lastName && <p className="text-sm text-red-600">{errors.lastName}</p>}
				</div>
			</div>


			<input
				name="preferredName"
				placeholder="Preferred Name"
				value={child.preferredName ?? ""}
				onChange={onChange}
				className="w-full p-3 border rounded-lg"
				maxLength={50}
			/>

			<div>
				<div className="font-bold mb-2">BIRTHDAY</div>
				<input
					type="date"
					name="birthday"
					value={child.birthday}
					max={new Date().toISOString().split("T")[0]}
					onChange={onChange}
					className="w-1/2 p-3 border rounded-lg mx-auto"
					required
				/>
				{errors.birthday && <p className="text-sm text-red-600 mt-1">{errors.birthday}</p>}
			</div>

			<label className="inline-flex items-center gap-2">
				<input
					type="checkbox"
					name="homeschool"
					checked={child.homeschool ?? false}
					onChange={onChange}
					className="h-4 w-4"
				/>
				<span>Homeschool</span>
			</label>

			<div className="font-bold mb-2">GRADE (OPTIONAL)</div>
			<select
				name="grade"
				value={child.grade ?? ""}
				onChange={onChange}
				className="w-full px-3 py-2 border rounded-md"
			>
				<option value="">N/A</option>
				{gradeOptions.map(o =>
					<option key={o.value} value={o.value}>
						{o.label}
					</option>
				)}
			</select>

			<div className="mt-4">
				<div className="font-bold mb-1">PHOTO CONSENT</div>

				<label className="inline-flex items-start gap-2">
				<input
					name="photoConsent"
					type="checkbox"
					checked={child.photoConsent}
					onChange={onChange}
					className="mt-1 h-4 w-4"
					aria-describedby="photo-consent-help"
				/>
				<span className="text-sm">
					I allow WonderHood to use photos/videos of my child for website and social updates (v{PHOTO_CONSENT_VERSION}).
					<span id="photo-consent-help" className="block text-xs text-gray-600 mt-1">
						You may withdraw consent anytime via <b>wonderhood.project@gmail.com</b>.
					</span>
				</span>
				</label>
				
				<PhotoConsentDisclosure />
			</div>

			<div className="font-bold">MEDICAL ACCOMMODATIONS</div>
			<textarea
				name="allergiesMedical"
				value={child.allergiesMedical ?? ""}
				onChange={onChange}
				placeholder="List allergies/medical accommodations (N/A if none)"
				className="w-full px-3 py-2 border rounded-md"
			/>
			{errors.allergiesMedical && <p className="text-sm text-red-600 mt-1">{errors.allergiesMedical}</p>}

			<div className="font-bold">ADDITIONAL NOTES</div>
			<textarea
				name="notes"
				value={child.notes ?? ""}
				onChange={onChange}
				placeholder="Optional: Please note any information that would be beneficial for instructor"
				className="w-full px-3 py-2 border rounded-md"
			/>
		</>
	)
}
