import React, { useEffect, useState, useCallback, useRef } from "react"
import { makeApiRequest } from "../../../../utils/api"
import { Child } from "@/types/child"
import { FaCircleChevronLeft, FaCircleChevronRight, FaX } from "react-icons/fa6"
import { FaCheck, FaPen, FaTrash } from "react-icons/fa"
import JoinChildForm from "./JoinChildForm"
import UpdateChildForm from "./UpdateChild"
import OpenModalButton from "@/app/context/openModalButton"
import DeleteChild from "./DeleteChild"
import { numericFormatDate } from "../../../../utils/formatDate"
import { calculateAge } from "../../../../utils/calculateAge"
import { displayGrade } from "../../../../utils/displayGrade"
import { determineEnv } from "../../../../utils/api"

const ChildInfo = () => {
    const formAnchorRef = useRef<HTMLDivElement | null>(null)
    const [children, setChildren] = useState<Child[]>([])
    const [loadErrors, setLoadErrors] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [showForm, setShowForm] = useState<boolean>(false)
    const [currChildIdx, setCurrChildIdx] = useState<number>(0)
    const [refreshKey, setRefreshKey] = useState(0)
    const [editingChildId, setEditingChildId] = useState<string | null>(null)

    let WONDERHOOD_URL = determineEnv()

    const fetchChildren = useCallback(async () => {
        setLoading(true)

        try {
            const response = await makeApiRequest(`${WONDERHOOD_URL}/child/current`)
            const allChildren: Child[] = response as Child[]
            setChildren(allChildren)
            setLoadErrors(null)
            setCurrChildIdx(prev => (allChildren.length ? Math.min(prev, allChildren.length - 1) : 0))
        } catch (e) {
            if (e instanceof Error) setLoadErrors(e.message)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchChildren()
    }, [fetchChildren, refreshKey])

    useEffect(() => {
        if (showForm) {
            requestAnimationFrame(() => {
                formAnchorRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                })
            })
        }
    }, [showForm])

    const handleFormSuccess = (createdChild?: Child) => {
        setShowForm(false)
        if (createdChild) {
            setChildren(prev => [createdChild, ...prev])
            setCurrChildIdx(0)
        } else {
            setRefreshKey(counter => counter + 1)
        }
    }

    const visibleChildren = Array.from({ length: Math.min(1, children.length) }, (_, i) => {
        const idx = (((currChildIdx + i) % children.length) + children.length) % children.length
        return children[idx]
    })

    const handleNext = () => {
        if (children.length > 0) setCurrChildIdx((prevIdx) => (((prevIdx + 1) % children.length) + children.length) % children.length)
    }

    const handlePrev = () => {
        if (children.length > 0) setCurrChildIdx((prevIdx) => (((prevIdx - 1) % children.length) + children.length) % children.length)
    }

    const handleShowForm = () => !showForm ? setShowForm(true) : setShowForm(false)

    if (loading) return <div className="flex justify-center items-center min-h-[200px]">Loading...</div>

    return (
        <div>
            <div className="text-center mb-[40px]">
                <h1 className="text-4xl font-bold text-wondergreen mb-4">Your Childrens&apos; Information</h1>
                {!children ? (
                    <div className="flex justify-center items-center min-h-[200px]">You have do not have any children in our system yet.</div>
                ) : (
                    <h2 className="max-w-2xl mx-auto text-lg text-wondergreen">Manage your children&apos;s profile for their events</h2>
                )}
            </div>

            <button
                onClick={handleShowForm}
                className="flex items-center mb-30 bg-wonderleaf border-none py-[12px] px-[24px] text-base rounded-md cursor-pointer mb-30 mx-auto"
            >
                Add a child?
            </button>

            <div className="flex flex-row gap-6 my-10">
                {children.length > 1 && (
                    <FaCircleChevronLeft className="w-[50px] h-[50px] cursor-pointer my-auto" onClick={handlePrev} />
                )}

                {visibleChildren.map((child) => (
                    <div key={child.id} className="basis-full max-w-3xl w-full mx-auto">
                        {editingChildId === child.id ? (
                            <UpdateChildForm
                                setEditingChildId={setEditingChildId}
                                currChild={child}
                                refreshChildren={fetchChildren}
                            />
                        ) : (
                            <div className="bg-white rounded-lg p-6 min-h-[350px]">
                                <div className="flex justify-between items-center mb-6">
                                    <div className="font-bold text-xl">{child.firstName} {child?.preferredName ? `"${child?.preferredName}"` : ""} {child.lastName}</div>

                                    <div className="flex flex-row gap-2">
                                        <FaPen onClick={() => setEditingChildId(child.id)} />
                                        <OpenModalButton
                                            buttonText={<FaTrash />}
                                            modalComponent={<DeleteChild currChild={child} onDeleteSuccess={fetchChildren} />}
                                        />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <div className="font-bold">BIRTHDAY</div>
                                    <div className="text-gray-500 text-sm my-1 ml-2">
                                        {child.birthday ? numericFormatDate(child.birthday) + " (" + (calculateAge(child.birthday)) + " years old)" : "—"}
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <div className="font-bold">GRADE</div>
                                    <div className="text-gray-500 text-sm my-1 ml-2">{child.grade ? displayGrade(child.grade) : "N/A"}</div>
                                </div>

                                <div className="flex flex-row gap-3 mb-4">
                                    <div className="font-bold">PHOTO CONSENT </div>
                                    <div className="text-gray-500 text-sm mt-1">{child.photoConsent ? <FaCheck /> : <FaX />}</div>
                                </div>

                                <div className="mb-4 border-t pt-4">
                                    <div className="font-bold">EMERGENCY CONTACTS</div>
                                    <div className="text-gray-500 text-sm my-1 ml-2">
                                        {child?.emergencyContacts?.map((contact) => (
                                            <div key={contact.id} className="mb-2">
                                                <div>Contact: {contact.firstName} {contact.lastName}</div>
                                                <div>Relationship: {contact.relationship}</div>
                                                <div>Phone Number: {contact.phoneNumber}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="mb-4 border-t pt-4">
                                    <div className="font-bold">MEDICAL ACCOMMODATIONS</div>
                                    <div className="text-gray-500 text-sm my-1 ml-2">{child.allergiesMedical ? child.allergiesMedical : "List any allergies or medical accommodations"}</div>
                                </div>

                                <div className="mb-4 border-t pt-4">
                                    <div className="font-bold">ADDITIONAL NOTES</div>
                                    <div className="text-gray-500 text-sm my-1 ml-2">{child.notes ? child.notes : "Optional: Please note any information that would be beneficial for instructor"}</div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                {children.length > 1 && (
                    <FaCircleChevronRight className="w-[50px] h-[50px] cursor-pointer my-auto" onClick={handleNext} />
                )}
            </div>

            <div ref={formAnchorRef} className="scroll-mt-24 aria-hidden" />
            <JoinChildForm showForm={showForm} onSuccess={handleFormSuccess} />
        </div>
    )
}

export default ChildInfo
