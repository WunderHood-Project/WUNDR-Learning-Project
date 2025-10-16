import React, { useEffect, useState, useRef, useMemo } from "react"
import { Child } from "@/types/child"
import { FaCircleChevronLeft, FaCircleChevronRight } from "react-icons/fa6"
import JoinChildForm from "./AddChildForm"
import UpdateChildForm from "./UpdateChild"
import { useChild } from "../../../../hooks/useChild"
import ChildInfoCard from "./ChildInfoCard"


const ChildInfo = () => {
    const { children, loading, refetch } = useChild(undefined)
    const formAnchorRef = useRef<HTMLDivElement | null>(null)
    const [showForm, setShowForm] = useState<boolean>(false)
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [pendingId, setPendingId] = useState<string | null>(null)
    const [editingChildId, setEditingChildId] = useState<string | null>(null)
    const childrenItems = children ?? []

    useEffect(() => {
        if (!childrenItems.length) return
        if (pendingId && childrenItems.some(c => c.id === pendingId)) {
            setSelectedId(pendingId)
            setPendingId(null)
            return
        }

        if (!selectedId || !childrenItems.some(c => c.id === selectedId)) {
            const firstId = childrenItems[0].id
            if (selectedId !== firstId) setSelectedId(childrenItems[0].id)
        }
    }, [childrenItems, pendingId, selectedId])

    useEffect(() => {
        if (showForm) {
            requestAnimationFrame(() => {
                formAnchorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
            })
        }
    }, [showForm])

    const selectedIndex = useMemo(() => {
        if (!selectedId) return 0
        const i = childrenItems.findIndex(c => c.id === selectedId)
        return i >= 0 ? i : 0
    }, [childrenItems, selectedId])

    const visibleChild = childrenItems[selectedIndex];

    const handleFormSuccess = (createdChild?: Child) => {
        setShowForm(false)
        if (createdChild) {
            setSelectedId(createdChild.id)
            setPendingId(createdChild.id)
        }
        refetch()
    }

    const handleNext = () => {
        if (!childrenItems.length) return
        const next = (selectedIndex + 1) % childrenItems.length
        setSelectedId(childrenItems[next].id)
    }

    const handlePrev = () => {
        if (!childrenItems.length) return
        const prev = (selectedIndex - 1 + childrenItems.length) % childrenItems.length
        setSelectedId(childrenItems[prev].id)
    }

    if (loading) return <div className="flex justify-center childrenItems-center min-h-[200px]">No children displayable at this moment</div>

    return (
        <div>
            <div className="text-center mb-[20px]">
                <h1 className="text-4xl font-bold text-wondergreen mb-4">Your Children&apos;s Information</h1>
                <h2 className="max-w-2xl mx-auto text-lg text-wondergreen">
                    {childrenItems.length ? "Manage your children’s profile for their events" : "You do not have any children in our system yet."}
                </h2>
            </div>

            <button onClick={() => setShowForm(v => !v)}
                className="flex childrenItems-center bg-wonderleaf border-none py-[12px] px-[24px] text-base rounded-md cursor-pointer mx-auto"
            >
                Add a child?
            </button>

            {childrenItems.length > 0 && visibleChild && (
                <div className="flex flex-row gap-6 my-10">
                    {childrenItems.length > 1 && (
                        <FaCircleChevronLeft
                            className="w-[50px] h-[50px] cursor-pointer my-auto"
                            onClick={handlePrev}
                        />
                    )}

                    <div key={visibleChild.id} className="basis-full max-w-3xl w-full mx-auto">
                        {editingChildId === visibleChild.id ? (
                            <UpdateChildForm setEditingChildId={setEditingChildId} currChild={visibleChild} />
                        ) : (
                            <ChildInfoCard
                                child={visibleChild}
                                onEdit={() => setEditingChildId(visibleChild.id)}
                                onDelete={() => {}}
                            />
                        )}
                    </div>

                    {childrenItems.length > 1 && (
                        <FaCircleChevronRight
                            className="w-[50px] h-[50px] cursor-pointer my-auto"
                            onClick={handleNext}
                        />
                    )}
                </div>
            )}

            <div ref={formAnchorRef} className="scroll-mt-24 aria-hidden" />
            <JoinChildForm showForm={showForm} onSuccess={handleFormSuccess} />
        </div>
    )
}

export default ChildInfo
