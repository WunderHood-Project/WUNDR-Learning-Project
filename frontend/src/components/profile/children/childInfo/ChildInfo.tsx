import React, { useEffect, useState, useRef, useMemo } from "react"
import { Child } from "@/types/child"
import { FaCircleChevronLeft, FaCircleChevronRight } from "react-icons/fa6"
import JoinChildForm from "../addChild/AddChildForm"
import UpdateChildForm from "../UpdateChild"
import { useChild } from "../../../../../hooks/useChild"
import ChildInfoCard from "./ChildInfoCard"


const NO_CHILDREN: readonly Child[] = Object.freeze([] as const);

const ChildInfo = () => {
    const { children, loading, refetch } = useChild(undefined)
    const formAnchorRef = useRef<HTMLDivElement | null>(null)
    const [showForm, setShowForm] = useState<boolean>(false)
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [pendingId, setPendingId] = useState<string | null>(null)
    const [editingChildId, setEditingChildId] = useState<string | null>(null)
    const items = useMemo(() => children ?? NO_CHILDREN, [children])

    useEffect(() => {
        if (!items.length) return
        if (pendingId && items.some(c => c.id === pendingId)) {
            setSelectedId(pendingId)
            setPendingId(null)
            return
        }

        if (!selectedId || !items.some(c => c.id === selectedId)) {
            const firstId = items[0].id
            if (selectedId !== firstId) setSelectedId(firstId)
        }
    }, [items, pendingId, selectedId])

    useEffect(() => {
        if (showForm) {
            requestAnimationFrame(() => {
                formAnchorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
            })
        }
    }, [showForm])

    const selectedIndex = useMemo(() => {
        if (!selectedId) return 0
        const i = items.findIndex(c => c.id === selectedId)
        return i >= 0 ? i : 0
    }, [items, selectedId])

    const visibleChild = items.length ? items[selectedIndex] : null

    const handleFormSuccess = (createdChild?: Child) => {
        setShowForm(false)
        if (createdChild) {
            setSelectedId(createdChild.id)
            setPendingId(createdChild.id)
        }
        refetch()
    }

    const handleNext = () => {
        if (!items.length) return
        const next = (selectedIndex + 1) % items.length
        setSelectedId(items[next].id)
    }

    const handlePrev = () => {
        if (!items.length) return
        const prev = (selectedIndex - 1 + items.length) % items.length
        setSelectedId(items[prev].id)
    }

    if (loading && !items.length) return <div className="flex justify-center items-center min-h-[200px]">No children displayable at this moment</div>

    return (
        <div>
            <div className="text-center mb-[20px]">
                <h1 className="text-4xl font-bold text-wondergreen mb-4">Your Children&apos;s Information</h1>
                <h2 className="max-w-2xl mx-auto text-lg text-wondergreen">
                    {items.length ? "Manage your children’s profile for their events" : "You do not have any children in our system yet."}
                </h2>
            </div>

            <button onClick={() => setShowForm(v => !v)}
                className="flex items-center bg-wonderleaf border-none py-[12px] px-[24px] text-base rounded-md cursor-pointer mx-auto"
            >
                Add a child?
            </button>

            {items.length > 0 && visibleChild && (
                <div className="flex flex-row gap-6 my-10">
                    {items.length > 1 && (
                        <FaCircleChevronLeft
                            className="w-[50px] h-[50px] cursor-pointer my-auto"
                            onClick={handlePrev}
                        />
                    )}

                    <div key={visibleChild.id} className="basis-full max-w-3xl w-full mx-auto">
                        {editingChildId === visibleChild.id ? (
                            <UpdateChildForm
                                setEditingChildId={setEditingChildId}
                                currChild={visibleChild}
                                onPatched={(id) => setPendingId(id)}
                                refetchChildren={refetch}
                            />
                        ) : (
                            <ChildInfoCard
                                child={visibleChild}
                                onEdit={() => setEditingChildId(visibleChild.id)}
                            />
                        )}
                    </div>

                    {items.length > 1 && (
                        <FaCircleChevronRight
                            className="w-[50px] h-[50px] cursor-pointer my-auto"
                            onClick={handleNext}
                        />
                    )}
                </div>
            )}

            <div ref={formAnchorRef} className="scroll-mt-24" aria-hidden='true' />
            <JoinChildForm showForm={showForm} onSuccess={handleFormSuccess} />
        </div>
    )
}

export default ChildInfo
