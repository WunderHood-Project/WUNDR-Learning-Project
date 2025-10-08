"use client"

import { useParams } from "next/navigation"
import { useEvent } from "../../../../hooks/useEvent"
import { Event, EventForm, EventFormErrors } from "@/types/event"
import { useEffect, useMemo, useState } from "react"
import { Activity } from '@/types/activity';
import { makeApiRequest } from "../../../../utils/api"
import { convertStringToIsoFormat, toYMDForInput, toYMDLocal } from "../../../../utils/formatDate"
import { determineEnv } from "../../../../utils/api"
import { parseFloatOrNull, parseIntOrZero } from "../../../../utils/parseHelpers"
import UpdateEventForm from "./UpdateEventForm"


const WONDERHOOD_URL = determineEnv()

type ActivitiesResponse = { activities: Activity[] }
const toEventForm = (ev: Event): EventForm => ({
    activityId: ev.activityId ?? "",
    name: ev.name ?? "",
    description: ev.description ?? "",
    date: toYMDForInput(ev.date ?? ""),
    startTime: ev.startTime ?? "",
    endTime: ev.endTime ?? "",
    image: ev.image ?? "",
    limit: ev.limit ?? 0,
    city: ev.city ?? "",
    state: ev.state ?? "",
    address: ev.address ?? "",
    zipCode: String(ev.zipCode ?? ""),
    latitude: ev.latitude ?? null,
    longitude: ev.longitude ?? null,
})

export default function UpdateEvent() {
    const { eventId } = useParams()
    const { event: singleEvent, loading: singleLoading, error: singleError } = useEvent(eventId)
    const { events: allEvents } = useEvent(undefined)
    const [formEvent, setFormEvent] = useState<EventForm | null>(null)
    const [activities, setActivities] = useState<Activity[]>([])
    const [errors, setErrors] = useState<EventFormErrors>({})
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/
    const todayYMD = useMemo<string>(() => toYMDLocal(), [])

    useEffect(() => {
        if (singleEvent) setFormEvent(toEventForm(singleEvent))
    }, [singleEvent])

    useEffect(() => {
        // create async helper function to get activities
        const getActivities = async () => {
            try {
                const fetchActivities: ActivitiesResponse = await makeApiRequest(`${WONDERHOOD_URL}/activity`)
                if (fetchActivities.activities) setActivities(fetchActivities.activities)
            } catch {
                throw Error("Unable to fetch activities")
            }
        }
        getActivities()
    }, [])

    if (singleLoading) return <p>Loading...</p>
    if (singleError) return <p>Failed to load event.</p>
    if (!formEvent) return <p>Preparing form...</p>

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target

        setFormEvent(prev => {
            if (!prev) return prev

            if (name === "latitude" || name === "longitude") {
                return { ...prev, [name]: parseFloatOrNull(value) }
            }

            if (name === "limit") {
                return { ...prev, [name]: parseIntOrZero(value) }
            }

            return { ...prev, [name]: value}
        })
    }

    const handleDiscard = () => setFormEvent(singleEvent)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({})
        const newErrors: EventFormErrors = {}

        // * Add validations here
        // Ensure the name does not already exist
        const matchingNames = allEvents?.find((e) => e.name === formEvent.name)
        if (matchingNames) newErrors.name = "Name Already Exists"

        // Validate name's length:
        if (formEvent.name.length < 1) newErrors.name = "Name must be greater than one character"

        // Validate description length:
        if (formEvent.description.length <= 1) newErrors.description = "Description must be greater than one character"

        // Validate date format:
        if (!dateRegex.test(formEvent.date)) newErrors.date = "Please provide MM/DD/YYYY format"

        // Validate time formats:
        if (!timeRegex.test(formEvent.startTime)) newErrors.startTime = "Please provide hh:mm format"
        if (!timeRegex.test(formEvent.endTime)) newErrors.endTime = "Please provide hh:mm format"

        // Validate participant LIMIT:
        if (formEvent.limit > 100) newErrors.limit = "There must be less than 100 participants"
        if (formEvent.limit < 0) newErrors.limit = "There must be at least 0 participants"

        // Validate the address:
        //  ! Add more robust validation
        if (formEvent.address.length < 5) newErrors.address = "Please enter an address greater than 5 characters"
        if (formEvent.address.length > 200) newErrors.address = "Address must contain less than 200 characters"
        if (formEvent.zipCode.toString().length < 5) newErrors.zipCode = "Please provide a valid zipcode"
        // Validate lattitude/longitude
        if (formEvent.latitude !== null && (formEvent.latitude < -90 || formEvent.latitude > 90)) newErrors.latitude = "Latitude must be between -90 and 90"
        if (formEvent.longitude !== null && (formEvent.longitude < -180 || formEvent.longitude > 180)) newErrors.longitude = "Longitude must between -180 and 180"

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        // Create Payload
        const payload: Event = {
            activityId: formEvent.activityId,
            name: formEvent.name,
            description: formEvent.description,
            date: convertStringToIsoFormat(formEvent.date),
            startTime: formEvent.startTime,
            endTime: formEvent.endTime,
            image: formEvent.image,
            participants: formEvent.participants,
            limit: Number(formEvent.limit),
            city: formEvent.city,
            state: formEvent.state,
            address: formEvent.address,
            zipCode: formEvent.zipCode,
            latitude: formEvent.latitude,
            longitude: formEvent.longitude,
            userId: [],
            childIDs: []
        }

        // Try to add an event
        try {
            const response = await makeApiRequest(`${WONDERHOOD_URL}/event/${eventId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: payload
            })

            if (response) {
                console.log("Event successfully created:", response)
                setFormEvent(formEvent)
            }
        } catch (e) {
            throw new Error(`Unable to add event: ${e}`)
        }
    }

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-center mb-4">Update Event</h1>

            <form onSubmit={handleSubmit} className="space-y-5">
                <UpdateEventForm
                    formEvent={formEvent}
                    errors={errors}
                    activities={activities}
                    todayYMD={todayYMD}
                    onChange={handleChange}
                />

                {/* Buttons */}
                <div className="flex justify-end gap-4">
                    <button
                        type="submit"
                        className="bg-wondergreen hover:bg-wonderleaf text-white px-4 py-2 rounded-md"
                    >
                        Edit Event
                    </button>
                    <button
                        type="reset"
                        className="bg-red-600 hover:bg-red-800 text-white px-4 py-2 rounded-md"
                        onClick={handleDiscard}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    )
}
