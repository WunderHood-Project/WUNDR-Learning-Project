'use client'

import { useEffect, useMemo, useState } from 'react';
import { makeApiRequest } from '../../../../utils/api';
import { Event, EventForm, EventFormErrors } from '@/types/event';
import { Activity } from '@/types/activity';
import { convertStringToIsoFormat, toYMDLocal } from '../../../../utils/formatDate';
import { useRouter } from 'next/navigation';
import { useEvent } from '../../../../hooks/useEvent';
import { determineEnv } from '../../../../utils/api';
import { parseFloatOrNull, parseIntOrZero } from '../../../../utils/parseHelpers';
import AddEventForm from './AddEventForm';


const WONDERHOOD_URL = determineEnv()

type Activities = { activities: Activity[] }
const initialEventForm = (): EventForm => ({
    activityId: "",
    name: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    image: "",
    limit: 0,
    city: "",
    state: "",
    address: "",
    zipCode: "",
    latitude: null,
    longitude: null
})

export default function AddEvent() {
    const dateYMD = /^\d{4}-\d{2}-\d{2}$/
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/
    const [form, setForm] = useState<EventForm>(() => initialEventForm())
    const [errors, setErrors] = useState<EventFormErrors>({})
    const [activities, setActivities] = useState<Activity[]>([])
    const { events } = useEvent(undefined)
    const router = useRouter()
    const todayYMD = useMemo<string>(() => toYMDLocal(), [])

    useEffect(() => {
        // create async helper function to get activities
        const getActivities = async () => {
            try {
                const fetchActivities: Activities = await makeApiRequest(`${WONDERHOOD_URL}/activity`)
                if (fetchActivities.activities) setActivities(fetchActivities.activities)
            } catch {
                throw Error("Unable to fetch activities")
            }
        }
        getActivities()
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target

        if (name === "latitude" || name === "longitude") {
            setForm(prev => ({ ...prev, [name]: parseFloatOrNull(value) }))
            return
        }

        if (name === "limit") {
            setForm(prev => ({ ...prev, [name]: parseIntOrZero(value) }))
            return
        }

        setForm(prev => ({ ...prev, [name]: value }))
    }

    const handleDiscard = () => setForm(initialEventForm())

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({})
        const newErrors: EventFormErrors = {}

        // Ensure the name does not already exist
        const matchingNames = events?.find((e) => e.name === form.name)
        if (matchingNames) newErrors.name = "Name Already Exists"

        // Validate name's length:
        if (form.name.length < 1) newErrors.name = "Name must be greater than one character"

        // Validate description length:
        if (form.description.length <= 1) newErrors.description = "Description must be greater than one character"

        // Validate date format:
        if (!dateYMD.test(form.date)) newErrors.date = "Please pick a valid date"

        // Validate time formats:
        if (!timeRegex.test(form.startTime)) newErrors.startTime = "Please provide HH:mm"
        if (!timeRegex.test(form.endTime)) newErrors.endTime = "Please provide HH:mm"

        // Validate participant LIMIT:
        if (form.limit > 100) newErrors.limit = "There must be less than 100 participants"
        if (form.limit < 0) newErrors.limit = "There must be at least 0 participants"

        // Validate the address:
        //  ! Add more robust validation
        if (form.address.length < 5) newErrors.address = "Please enter an address greater than 5 characters"
        if (form.address.length > 200) newErrors.address = "Address must contain less than 200 characters"
        if (!/^\d{5}(-\d{4})?$/.test(form.zipCode)) newErrors.zipCode = "Please provide a valid 5-digit ZIP"
        // Validate lattitude/longitude
        if (form.latitude !== null && (form.latitude < -90 || form.latitude > 90)) newErrors.latitude = "Latitude must be between -90 and 90"
        if (form.longitude !== null && (form.longitude < -180 || form.longitude > 180)) newErrors.longitude = "Longitude must between -180 and 180"

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        const payload: Event = {
            activityId: form.activityId,
            name: form.name,
            description: form.description,
            date: convertStringToIsoFormat(form.date),
            startTime: form.startTime,
            endTime: form.endTime,
            image: form.image,
            participants: 0,
            limit: Number(form.limit),
            city: form.city,
            state: form.state,
            address: form.address,
            zipCode: form.zipCode,
            latitude: form.latitude,
            longitude: form.longitude,
            userId: [],
            childIDs: []
        }
        console.log('payload', payload)

        try {
            const response = await makeApiRequest(`${WONDERHOOD_URL}/event`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: payload
            })

            if (response) {
                console.log("Event successfully created:", response)
                setForm(initialEventForm())
                router.replace("/events")
            }
        } catch (e) {
            // console.error("Failed to create event", e)
            // setErrors(e instanceof Error ? e.message : "Error deleting event");
            throw new Error(`Unable to add event: ${e}`)
        }
    }


    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-center mb-4">Add an Event Below</h1>

            <form onSubmit={handleSubmit} className="space-y-5">
                <AddEventForm
                    form={form}
                    errors={errors}
                    activities={activities}
                    todayYMD={todayYMD}
                    onChange={handleChange}
                />

                <div className="flex justify-end gap-4">
                    <button
                        type="submit"
                        className="bg-wondergreen hover:bg-wonderleaf text-white px-4 py-2 rounded-md"
                    >
                        Add Event
                    </button>
                    <button
                        type="reset"
                        onClick={handleDiscard}
                        className="bg-red-600 hover:bg-red-800 text-white px-4 py-2 rounded-md"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
