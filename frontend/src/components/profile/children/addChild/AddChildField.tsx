import { ChildErrorsForm, CreateChildForm } from "@/types/child"
import { gradeOptions } from "../../../../../utils/displayGrade"
import React from "react"

// type Props = {
//     child: CreateChildForm
//     errors?: ChildErrorsForm
//     onChange: React.ChangeEventHandler<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
// }

// const AddChildField: React.FC<Props> = ({ child, onChange, errors = {} }) => {
//     return (
//         <>
//             <div className="flex flex-row gap-3 w-full">
//                 <div>
//                     <input
//                         name="firstName"
//                         placeholder="Legal First Name"
//                         value={child.firstName}
//                         onChange={onChange}
//                         className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                         maxLength={50}
//                         required
//                     />
//                     {errors.firstName && <p className="text-sm text-red-600 mt-1">{String(errors.firstName)}</p>}
//                 </div>

//                 <div>
//                     <input
//                         name="lastName"
//                         placeholder="Legal Last Name"
//                         value={child.lastName}
//                         onChange={onChange}
//                         className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                         maxLength={50}
//                         required
//                     />
//                     {errors.lastName && <p className="text-sm text-red-600 mt-1">{String(errors.lastName)}</p>}
//                 </div>
//             </div>

//             <div>
//                 <input
//                     name="preferredName"
//                     placeholder="Preferred Name"
//                     value={child.preferredName ?? ""}
//                     onChange={onChange}
//                     className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                     maxLength={50}
//                 />
//             </div>

//             <div>
//                 <div className="font-bold mb-2">BIRTHDAY</div>
//                 <input
//                     type="date"
//                     name="birthday"
//                     value={child.birthday}
//                     max={new Date().toISOString().split("T")[0]}
//                     onChange={onChange}
//                     className="w-1/2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent mx-auto"
//                     required
//                 />
//                 {errors.birthday && <p className="text-sm text-red-600 mt-1">{String(errors.birthday)}</p>}
//             </div>

//             <label className="inline-flex items-center gap-2">
//                 <input
//                     type="checkbox"
//                     name="homeschool"
//                     checked={child.homeschool ?? false}
//                     onChange={onChange}
//                     className="h-4 w-4"
//                 />
//                 <span>Homeschool?</span>
//             </label>

//             <div className="font-bold mb-2">GRADE (OPTIONAL)</div>
//             <select
//                 name="grade"
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wondergreen focus:border-transparent"
//                 value={child.grade ?? ""}
//                 onChange={onChange}
//             >
//                 <option value="">N/A</option>
//                 {gradeOptions.map(o => (
//                     <option key={o.value} value={o.value}>{o.label}</option>
//                 ))}
//             </select>

//             <div className="font-bold mb-2">PHOTO CONSENT</div>
//             <input
//                 name="photoConsent"
//                 type="checkbox"
//                 checked={child.photoConsent}
//                 onChange={onChange}
//             />

//             <div className="font-bold">MEDICAL ACCOMMODATIONS</div>
//             <textarea
//                 name="allergiesMedical"
//                 value={child.allergiesMedical ?? ""}
//                 onChange={onChange}
//                 placeholder="List any allergies or medical accommodations"
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wondergreen focus:border-transparent"
//             />

//             <div className="font-bold">ADDITIONAL NOTES</div>
//             <textarea
//                 name="notes"
//                 value={child.notes ?? ""}
//                 onChange={onChange}
//                 placeholder="Optional: Please note any information that would be beneficial for instructor"
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wondergreen focus:border-transparent"
//             />
//         </>
//     )
// }

// export default AddChildField

// import type { CreateChildForm, ChildErrorsForm } from "@/types/child"
// import { dateInputMaxToday } from "@/utils/dates"

type Props = {
	child: CreateChildForm
	onChange: React.ChangeEventHandler<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
	errors?: ChildErrorsForm
}

export default function ChildFields({ child, onChange, errors = {} }: Props) {
	return (
		<>
			<div className="flex gap-3">
				<input
					name="firstName"
					placeholder="Legal First Name"
					value={child.firstName}
					onChange={onChange}
					className="w-full p-3 border rounded-lg"
					maxLength={50}
					required
				/>

				<input
					name="lastName"
					placeholder="Legal Last Name"
					value={child.lastName}
					onChange={onChange}
					className="w-full p-3 border rounded-lg"
					maxLength={50}
					required
				/>
			</div>

			{errors.firstName && <p className="text-sm text-red-600">{errors.firstName}</p>}
			{errors.lastName && <p className="text-sm text-red-600">{errors.lastName}</p>}

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
				<span>Homeschool?</span>
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

			<div className="font-bold mb-2">PHOTO CONSENT</div>
			<input
				name="photoConsent"
				type="checkbox"
				checked={child.photoConsent}
				onChange={onChange}
			/>

			<div className="font-bold">MEDICAL ACCOMMODATIONS</div>
			<textarea
				name="allergiesMedical"
				value={child.allergiesMedical ?? ""}
				onChange={onChange}
				placeholder="List any allergies or medical accommodations"
				className="w-full px-3 py-2 border rounded-md"
			/>

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
