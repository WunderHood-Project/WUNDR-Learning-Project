"use client"

import { useParams } from "next/navigation"
import { useEvent } from "../../../../hooks/useEvent"
import React, { useCallback, useMemo, useState } from "react"
import { useUser } from "../../../../hooks/useUser"
import { makeApiRequest } from "../../../../utils/api"

const EventDetails = () => {
    const { eventId } = useParams()
    const { event, loading, error, refetch } = useEvent(eventId)
    const { user } = useUser()
    const [serverError, setServerError] = useState<string | null>(null)
    const [showForm, setShowForm] = useState(false)
    const [selected, setSelected] = useState<Set<string>>(new Set)
    const [successEnroll, setSuccessEnroll] = useState(false)

    const toggleChild = (id: string) => {
        setSelected(prev => {
            const next = new Set(prev)
            if (next.has(id)) {
                next.delete(id)
            } else {
                next.add(id)
            }
            return next
        })
    }

    const eventParticipantSet = useMemo(() => new Set(event?.childIDs ?? []), [event?.childIDs])
    const handleDisable = useCallback((childID: string) => eventParticipantSet.has(childID), [eventParticipantSet])

    const handleEnroll = async (e: React.FormEvent) => {
        e.preventDefault()
        const childIDs = Array.from(selected)

        try {
            await makeApiRequest(`http://localhost:8000/event/${eventId}/enroll`, {
                method: "PATCH",
                headers: {"Content-Type": "application/json"},
                body: {childIDs}
            })
            setShowForm(false)
            setSuccessEnroll(true)
            refetch()
        } catch (err) {
            setServerError(err instanceof Error ? err.message : "A network error occurred. Please try again later.")
        }
    }

    if (loading) return <div className="flex justify-center items-center min-h-screen">Loading event details...</div>
    if (!event) return <div className="flex justify-center items-center min-h-screen">Event not found</div>

    if (error) return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="text-red-500">
                Error: {error}
                <button onClick={refetch} className="ml-4 bg-blue-500 text-white px-4 py-2 rounded">
                    Retry
                </button>
            </div>
        </div>
    )

    return (
        <div>
            <header className="relative">
                <h1 className="text-center font-bold text-2xl md:text-3xl py-6 bg-gradient-to-r from-wonderleaf to-wondergreen text-white">
                    Event Details
                </h1>
                <div className="relative overflow-hidden">
                    <img src={event?.image} alt={event?.name}
                        className="w-full h-64 md:h-80 object-cover transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
            </header>

            <main className="p-6 md:p-8">
                <div className="mb-8">
                    <div className="bg-gradient-to-br from-wonderleaf/10 to-wondergreen/5 rounded-xl p-6 border border-wonderbg shadow-sm">
                        <h2 className="text-2xl md:text-3xl font-bold text-white-800 mb-2">{event?.name}</h2>
                        <div className="flex items-center text-white-600 font-medium">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path>
                            </svg>
                            {event?.date.split("T")[0]}
                        </div>

                        <div className="mt-3">
                            <p>{event.address}</p>
                            <p>{event.city}, {event.state} {event.zipCode}</p>
                        </div>

                        <div className="mt-3">
                            <h3 className="flex items-center text-white-800 text-lg font-semibold">{event?.participants == 1 ? "Participant" : "Participants"}</h3>
                            <span>{event?.participants}</span>
                        </div>
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-white-800 mt-3">About this Event</h3>
                            <p className="text-white-800 leading-relaxed text-base md:text-lg">
                                {event?.description}
                            </p>
                        </div>
                    </div>
                </div>
            </main >

            <div className="px-6 md:px-8 pb-8">
                <button onClick={() => setShowForm(v => !v)}
                    className="w-full md:w-auto bg-gradient-to-r from-wondergreen to-wonderleaf hover:from-wondergreen hover:to-wonderleaf text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:translate-y-0.5 transition-all duration-200 text-lg"
                >
                    {showForm && user ? "Complete Enrollment Below" : "Enroll in Event"}
                </button>
            </div>

            {showForm && user?.children?.length ? (
                <form onSubmit={handleEnroll} className="space-y-4 px-10">
                    <h2 className="text-lg font-semibold">Select your child(ren)</h2>
                    <fieldset className="space-y-2">
                        {user.children.map(child => {
                            const childID = `child-${child.id}`
                            const isChecked = selected.has(child.id)

                            return (
                                <div key={child.id} className="flex flex-row gap-2">
                                    <input
                                        id={childID}
                                        type="checkbox"
                                        name="children"
                                        value={child.id}
                                        checked={isChecked}
                                        onChange={() => toggleChild(child.id)}
                                        className="h-4 w-4"
                                        disabled={handleDisable(child.id)}
                                    />
                                    <label className="cursor-pointer">{child.firstName} {child.lastName}</label>
                                </div>
                            )
                        })}
                    </fieldset>
                    <div className="flex flex-row gap-12">
                        <button type="submit">Enroll</button>
                        <button type="button" onClick={() => setShowForm(false)}>Cancel</button>

                    </div>
                    {serverError && <div className="mb-4 rounded bg-red-50 text-red-700 p-3">{serverError}</div>}
                </form>
            ) : showForm && !user ? (
                <div>Please create an account or log in</div>
            ) : null}

            {successEnroll && (
                <div className="border-2 border-green-500 bg-green-50 p-4 text-center text-green-800 font-bold">
                    Enrollment Successful!
                </div>
            )}
        </div>
    )
}

export default EventDetails
