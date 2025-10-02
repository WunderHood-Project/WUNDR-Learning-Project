"use client"

import { FaCircleChevronLeft, FaCircleChevronRight } from "react-icons/fa6"
import { useEvent } from "../../../../hooks/useEvent"
import { useUser } from "../../../../hooks/useUser"
import { combineLocal, formatDate } from "../../../../utils/formatDate"
import React, { useEffect, useMemo, useRef, useState } from "react"
import EventCalendar from "./calendar"
import { Child } from "@/types/child"
import { FaPen } from "react-icons/fa"
import UnenrollEvent from "./unenrollEvent"


const YourEvents = () => {
    const { events, loading, refetch } = useEvent(undefined)
    const { user } = useUser()
    const [currEventIdx, setCurrEventIdx] = useState(0)
    const [editingId, setEditingId] = useState<string | null>(null)
    const cardsRef = useRef<HTMLDivElement>(null)

    const usersEvents = useMemo(() => {
        const childIDSet = new Set((user?.children ?? []).map(c => c.id))

        return (events ?? [])
            //keeps only events that include at least one of the user's child ID
            .filter(e => (e.childIDs ?? []).some(id => childIDSet.has(id)))
            .map(e => ({
                id: e.id,
                name: e.name,
                description: e.description,
                city: e.city,
                date: e.date,
                startTime: e.startTime,
                endTime: e.endTime,
                childIDs: (e.childIDs ?? []).filter(id => childIDSet.has(id)) //string[]
            }))
    }, [events, user?.children])

    const visiblePool = useMemo(() => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        return usersEvents.filter(e => {
            // normalize date to local midnight YYYY-MM-DD
            const m = String(e.date).match(/^\d{4}-\d{2}-\d{2}/)
            const eventDay = m ? combineLocal(m[0], "00:00") : new Date(e.date)
            if (Number.isNaN(eventDay.getTime())) return false
            return eventDay >= today
        })
    }, [usersEvents])

    useEffect(() => {
        if (visiblePool.length && currEventIdx >= visiblePool.length) setCurrEventIdx(0)
    }, [visiblePool.length, currEventIdx])

    const visibleEvents = useMemo(() => {
        if (visiblePool.length === 0) return []

        return Array.from({ length: Math.min(2, visiblePool.length) }, (_, i) => {
            const idx = (((currEventIdx + i) % visiblePool.length) + visiblePool.length) % visiblePool.length
            return visiblePool[idx]
        })
    }, [visiblePool, currEventIdx])

    const handleNext = () => {
        if (visiblePool.length > 0) setCurrEventIdx((prevIdx) => (((prevIdx + 2) % visiblePool.length) + visiblePool.length) % visiblePool.length)
    }
    const handlePrev = () => {
        if (visiblePool.length > 0) setCurrEventIdx((prevIdx) => (((prevIdx - 2) % visiblePool.length) + visiblePool.length) % visiblePool.length)
    }

    const handlePickFromCalendar = (eventId: string) => {
        const idx = visiblePool.findIndex(e => e.id === eventId)
        if (idx < 0) return

        setCurrEventIdx(idx)
        cardsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }

    const childById = useMemo(() => {
        const map = new Map<string, Child>()
        for (const child of (user?.children ?? [])) map.set(child.id, child)
        return map
    }, [user?.children])

    const displayName = (c: Child) =>
        `${(c.preferredName ?? c.firstName).trim()} ${c.lastName}`.trim()

    const handleAfterUnenroll = async () => {
        await refetch()
        setEditingId(null)
    }

    if (loading) return <div className="flex justify-center items-center min-h-[200px]">Loading...</div>

    return (
        <div>
            <div className="text-center mb-[40px]">
                <h1 className="text-4xl font-bold text-wondergreen mb-4">Your Events</h1>
                {visiblePool.length < 1 && !loading ? (
                    <div className="max-w-2xl mx-auto text-md text-wondergreen">You have not enrolled in any events yet.</div>
                ) : (
                    <h2 className="max-w-2xl mx-auto text-lg text-wondergreen">Manage all the events you and children are enrolled in</h2>
                )}
            </div>

            <div ref={cardsRef} className="scroll-mt-24 aria-hidden" />
            <div className="flex flex-row gap-6 my-10">
                {visiblePool.length > 2 && (
                    <FaCircleChevronLeft className="w-[50px] h-[50px] cursor-pointer my-auto" onClick={handlePrev} />
                )}

                {visibleEvents && visibleEvents.map((event) => {
                    const isEditing = editingId === event.id

                    const enrolledChildren = (event?.childIDs ?? [])
                        .map((id) => childById.get(id))
                        .filter((c): c is Child => !!c) //this is typescript type predicate syntax (if truthy, the variable is Child type)

                    return (
                        <div key={event.id} className="basis-1/2 max-w-3xl w-full mx-auto">
                            <div className="bg-white rounded-lg p-6 min-h-[350px]">
                                <div className="mb-6">
                                    <div className="flex flex-row justify-between">
                                        <div className="inline-block bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold mb-4">
                                            {formatDate(event.date)}
                                        </div>

                                        <button type="button" aria-pressed={isEditing}
                                            onClick={(e) => {
                                                e.preventDefault()
                                                e.stopPropagation()
                                                setEditingId(isEditing ? null : (event.id ?? null))
                                            }}
                                        >
                                            <FaPen />
                                        </button>
                                    </div>

                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{event.name} in {event.city}</h3>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[3.5rem]">
                                        {event.description}
                                    </p>
                                </div>

                                <div className="flex flex-col justify-center mt-auto">
                                    <p className="text-xs text-gray-500 mb-2">
                                        Your Children Enrolled: {isEditing && (<span> (Click to remove)</span>)}
                                    </p>

                                    {enrolledChildren.length > 0 && (
                                        isEditing ? (
                                            <UnenrollEvent enrolledChildren={enrolledChildren} eventID={event.id} onAfterUnenroll={handleAfterUnenroll} />
                                        ) : (
                                            <ul className="list-disc pl-5 text-xs text-gray-700 space-y-0.5">
                                                {enrolledChildren.map((child) => (
                                                    <li key={`${event.id}-${child.id}`}>{displayName(child)}</li>
                                                ))}
                                            </ul>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
                    )
                })}

                {visiblePool.length > 2 && (
                    <FaCircleChevronRight className="w-[50px] h-[50px] cursor-pointer my-auto" onClick={handleNext} />
                )}
            </div>

            {usersEvents.length > 1 && (
                <EventCalendar events={usersEvents} onPick={handlePickFromCalendar} />
            )}
        </div>
    )
}

export default YourEvents
