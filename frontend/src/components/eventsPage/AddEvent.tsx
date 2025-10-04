'use client'

import { useEffect, useMemo, useState } from 'react';
import { makeApiRequest } from '../../../utils/api';
import { CITIES_CO } from '@/data/citiesCO';
import { US_States } from '@/data/states';
import { Event } from '@/types/event';
import { Activity } from '@/types/activity';
import { convertStringToIsoFormat, toYMDLocal } from '../../../utils/formatDate';
import { useRouter } from 'next/navigation';
import { useEvent } from '../../../hooks/useEvent';
import { determineEnv } from '../../../utils/api';
import { parseFloatOrNull, parseIntOrZero } from '../../../utils/parseHelpers';

const WONDERHOOD_URL = determineEnv()

type ActivitiesResponse = { activities: Activity[] }
type FormErrors = Partial<Record<"activity" | "name" | "description" | "date" | "startTime" | "endTime" | "limit" | "address" | "longitude" | "latitude" | "zipCode", string>>
const initialEventForm: Event = {
    activityId: "",
    name: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    image: "",
    participants: 0,
    limit: 0,
    city: "",
    state: "",
    address: "",
    zipCode: "",
    latitude: null,
    longitude: null,
    userId: [],
    childIDs: []
}

export default function AddEvent() {
    const [event, setEvent] = useState<Event>(initialEventForm)
    const [errors, setErrors] = useState<FormErrors>({})
    const [activities, setActivities] = useState<Activity[]>([])
    const { events } = useEvent(undefined)
    const dateYMD = /^\d{4}-\d{2}-\d{2}$/
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    const router = useRouter()

    const todayYMD = useMemo<string>(() => toYMDLocal(), [])
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

    const handleChangeSelectOrInputOrText = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target

        if (name === "latitude" || name === "longitude") {
            setEvent(prev => ({ ...prev, [name]: parseFloatOrNull(value) }))
            return
        }

        if (name === "limit" || name === "participants") {
            setEvent(prev => ({ ...prev, [name]: parseIntOrZero(value) }))
            return
        }

        setEvent(prev => ({ ...prev, [name]: value }))
    }

    const handleDiscard = async () => setEvent(initialEventForm)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({})
        const newErrors: FormErrors = {}

        // Ensure the name does not already exist
        const matchingNames = events?.find((e) => e.name === event.name)
        if (matchingNames) newErrors.name = "Name Already Exists"

        // Validate name's length:
        if (event.name.length < 1) newErrors.name = "Name must be greater than one character"

        // Validate description length:
        if (event.description.length < 1) newErrors.description = "Description must be greater than one character"

        // Validate date format:
        if (!dateYMD.test(event.date)) newErrors.date = "Please pick a valid date"

        // Validate time formats:
        if (!timeRegex.test(event.startTime)) newErrors.startTime = "Please provide HH:mm"
        if (!timeRegex.test(event.endTime)) newErrors.endTime = "Please provide HH:mm"

        // Validate participant LIMIT:
        if (event.limit > 100) newErrors.limit = "There must be less than 100 participants"
        if (event.limit < 0) newErrors.limit = "There must be at least 0 participants"

        // Validate the address:
        //  ! Add more robust validation
        if (event.address.length < 5) newErrors.address = "Please enter an address greater than 5 characters"
        if (event.address.length > 200) newErrors.address = "Address must contain less than 200 characters"
        if (!/^\d{5}(-\d{4})?$/.test(event.zipCode)) newErrors.zipCode = "Please provide a valid 5-digit ZIP"
        // Validate lattitude/longitude
        if (event.latitude !== null && (event.latitude < -90 || event.latitude > 90)) newErrors.latitude = "Latitude must be between -90 and 90"
        if (event.longitude !== null && (event.longitude < -180 || event.longitude > 180)) newErrors.longitude = "Longitude must between -180 and 180"

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        const payload: Event = {
            activityId: event.activityId,
            name: event.name,
            description: event.description,
            date: convertStringToIsoFormat(event.date),
            startTime: event.startTime,
            endTime: event.endTime,
            image: event.image,
            participants: event.participants,
            limit: Number(event.limit),
            city: event.city,
            state: event.state,
            address: event.address,
            zipCode: event.zipCode,
            latitude: event.latitude,
            longitude: event.longitude,
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
                setEvent(initialEventForm)
                router.replace("/events")
            }
        } catch (e) {
            console.error("Failed to create event", e)
            // setErrors(e instanceof Error ? e.message : "Error deleting event");
            // throw new Error(`Unable to add event: ${e}`)
        }
    }


    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-center mb-4">Add an Event Below</h1>

            <form onSubmit={handleSubmit} className="space-y-5">
                <fieldset className="space-y-4">
                    <div>
                        <label className="block mb-1 font-medium">Activity <span className="text-rose-600">*</span></label>
                        <select
                            name="activityId"
                            value={event.activityId}
                            onChange={handleChangeSelectOrInputOrText}
                            className="w-full border rounded px-3 py-2"
                        >
                            <option>Select an Activity</option>
                            {activities.map((activity) => (
                                <option key={activity.id} value={activity.id}>
                                    {activity.name}
                                </option>
                            ))}
                        </select>
                        {errors.activity && <p className="text-sm text-red-600">{errors.activity}</p>}
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Name <span className="text-rose-600">*</span></label>
                        <input
                            name="name"
                            placeholder="Name"
                            value={event.name}
                            onChange={handleChangeSelectOrInputOrText}
                            className="w-full border rounded px-3 py-2"
                        />
                        {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Description <span className="text-rose-600">*</span></label>
                        <textarea
                            name="description"
                            placeholder="Description"
                            value={event.description}
                            onChange={handleChangeSelectOrInputOrText}
                            maxLength={750}
                            className="w-full border rounded px-3 py-2"
                        />
                        {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Date <span className="text-rose-600">*</span></label>
                        <input
                            type='date'
                            name="date"
                            min={todayYMD}
                            value={event.date}
                            onChange={handleChangeSelectOrInputOrText}
                            className="w-full border rounded px-3 py-2"
                        />
                        {errors.date && <p className="text-sm text-red-600">{errors.date}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-1 font-medium">Start Time <span className="text-rose-600">*</span></label>
                            <input
                                type='time'
                                name="startTime"
                                placeholder="Start Time"
                                value={event.startTime}
                                onChange={handleChangeSelectOrInputOrText}
                                className="w-full border rounded px-3 py-2"
                            />
                            {errors.startTime && <p className="text-sm text-red-600">{errors.startTime}</p>}
                        </div>
                        <div>
                            <label className="block mb-1 font-medium">End Time <span className="text-rose-600">*</span></label>
                            <input
                                type='time'
                                name="endTime"
                                placeholder="End Time"
                                value={event.endTime}
                                onChange={handleChangeSelectOrInputOrText}
                                className="w-full border rounded px-3 py-2"
                            />
                            {errors.endTime && <p className="text-sm text-red-600">{errors.endTime}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Image</label>
                        <input
                            name="image"
                            placeholder="Image (optional)"
                            value={event.image}
                            onChange={handleChangeSelectOrInputOrText}
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Participants Limit <span className="text-rose-600">*</span></label>
                        <input
                            name="limit"
                            placeholder="(e.g. 15)"
                            value={event.limit}
                            onChange={handleChangeSelectOrInputOrText}
                            className="w-full border rounded px-3 py-2"
                        />
                        {errors.limit && <p className="text-sm text-red-600">{errors.limit}</p>}
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">City <span className="text-rose-600">*</span></label>
                        <select
                            id="City"
                            name="city"
                            onChange={(e) => setEvent({ ...event, city: e.target.value })}
                            className="w-full border rounded px-3 py-2"
                        >
                            {CITIES_CO.map((city) => (
                                <option key={city} value={city}>
                                    {city}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">State <span className="ml-1 text-xs text-gray-500">(Select One)</span></label>
                        <select
                            id="State"
                            name="state"
                            onChange={(e) => setEvent({ ...event, state: e.target.value })}
                            className="w-full border rounded px-3 py-2"
                        >
                            {US_States.map((state) => (
                                <option key={state} value={state}>
                                    {state}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Address <span className="text-rose-600">*</span></label>
                        <input
                            name="address"
                            placeholder="Address"
                            value={event.address}
                            onChange={handleChangeSelectOrInputOrText}
                            className="w-full border rounded px-3 py-2"
                        />
                        {errors.address && <p className="text-sm text-red-600">{errors.address}</p>}
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Zipcode <span className="text-rose-600">*</span></label>
                        <input
                            type='text'
                            name="zipCode"
                            inputMode='numeric'
                            pattern='[0-9]{5}'
                            value={event.zipCode}
                            onChange={handleChangeSelectOrInputOrText}
                            required
                            className="w-full border rounded px-3 py-2"
                        />
                        {errors.zipCode && <p className="text-sm text-red-600">{errors.zipCode}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-1 font-medium">Latitude</label>
                            <input
                                type='number'
                                step="any"
                                name="latitude"
                                min={-90}
                                max={90}
                                placeholder="Latitude (optional)"
                                value={event.latitude ?? ""}
                                onChange={handleChangeSelectOrInputOrText}
                                className="w-full border rounded px-3 py-2"
                            />
                            {errors.latitude && <p className="text-sm text-red-600">{errors.latitude}</p>}
                        </div>
                        <div>
                            <label className="block mb-1 font-medium">Longitude
                            </label>
                            <input
                                type='number'
                                step="any"
                                name="longitude"
                                min={-180}
                                max={180}
                                placeholder="Longitude (optional)"
                                value={event.longitude ?? ""}
                                onChange={handleChangeSelectOrInputOrText}
                                className="w-full border rounded px-3 py-2"
                            />
                            {errors.longitude && <p className="text-sm text-red-600">{errors.longitude}</p>}
                        </div>
                    </div>
                </fieldset>

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
