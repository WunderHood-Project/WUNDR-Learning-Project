import OpenModalButton from "@/context/openModalButton"
import { Child } from "@/types/child"
import { FaCheck, FaPen, FaTrash } from "react-icons/fa"
import DeleteChild from "./DeleteChild"
import React from "react"
import { numericFormatDate } from "../../../../utils/formatDate"
import { calculateAge } from "../../../../utils/calculateAge"
import { displayGrade } from "../../../../utils/displayGrade"
import { FaX } from "react-icons/fa6"


type Props = {
    child: Child
    onEdit: () => void
}

const ChildInfoCard: React.FC<Props> = ({ child, onEdit }) => {
    console.log('child info', child)

    return (
        <div className="bg-white rounded-lg p-6 min-h-[350px]">
            <div className="flex justify-between items-center mb-6">
                <div className="font-bold text-xl">
                    {child.firstName} {child?.preferredName ? `"${child.preferredName}"` : ""} {child.lastName}
                </div>

                <div className="flex flex-row gap-2">
                    <FaPen onClick={onEdit} />
                    <OpenModalButton buttonText={<FaTrash />} modalComponent={<DeleteChild currChild={child} />} />
                </div>
            </div>

        <div className="mb-4">
            <div className="font-bold">BIRTHDAY</div>
            <div className="text-gray-500 text-sm my-1 ml-2">
                {child.birthday ? `${numericFormatDate(child.birthday)} (${calculateAge(child.birthday)} years old)` : "—"}
            </div>
        </div>

        <div className="mb-4">
            <div className="font-bold">GRADE</div>
            <div className="text-gray-500 text-sm my-1 ml-2">{child.grade ? displayGrade(child.grade) : "N/A"}</div>
        </div>

        <div className="flex flex-row gap-3 mb-4">
            <div className="font-bold">PHOTO CONSENT</div>
            <div className="text-gray-500 text-sm mt-1">{child.photoConsent ? <FaCheck /> : <FaX />}</div>
        </div>

        <div className="mb-4 border-t pt-4">
            <div className="font-bold">EMERGENCY CONTACTS</div>
            <div className="text-gray-500 text-sm my-1 ml-2">
                {child?.emergencyContacts?.map(ec => (
                    <div key={ec.id} className="mb-2">
                        <div>Contact: {ec.firstName} {ec.lastName}</div>
                        <div>Relationship: {ec.relationship}</div>
                        <div>Phone Number: {ec.phoneNumber}</div>
                    </div>
                ))}
            </div>
        </div>

        <div className="mb-4 border-t pt-4">
            <div className="font-bold">MEDICAL ACCOMMODATIONS</div>
            <div className="text-gray-500 text-sm my-1 ml-2">{child.allergiesMedical || "List any allergies or medical accommodations"}</div>
        </div>

        <div className="mb-4 border-t pt-4">
            <div className="font-bold">ADDITIONAL NOTES</div>
                <div className="text-gray-500 text-sm my-1 ml-2">
                    {child.notes || "Optional: Please note any information that would be beneficial for instructor"}
                </div>
            </div>
        </div>
    )
}

export default ChildInfoCard
