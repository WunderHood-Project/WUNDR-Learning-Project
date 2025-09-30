"use client"

import { useParams } from "next/navigation"
import { useEvent } from "../../../hooks/useEvent"
import { Event } from "@/types/event"
import { useEffect, useState } from "react"
import { CITIES_CO } from '@/data/citiesCO';
import { US_States } from '@/data/states';
import { Activity } from '@/types/activity';
import { makeApiRequest } from "../../../utils/api"
import { convertStringToIsoFormat } from "../../../utils/formatDate"
import { EventPayload } from '../../../utils/auth';

type ActivitiesResponse = { activities: Activity[] }
type FormErrors = Partial<Record<"activity" | "name" | "description" | "date" | "startTime" | "endTime" | "limit" | "address" | "longitude" | "latitude" | "zipCode", string>>

export default function UpdateEventForm() {
    const { eventId } = useParams()
    const { event: singleEvent, loading: singleLoading, error: singleError } = useEvent(eventId)
    const { events: allEvents } = useEvent(undefined)
    const [formEvent, setFormEvent] = useState<Event | null>(null)
    const [activities, setActivities] = useState<Activity[]>()
    const [errors, setErrors] = useState<FormErrors>({})
    const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

    useEffect(() => {
        if (singleEvent) {
            setFormEvent(singleEvent)
        }
    }, [singleEvent])

    useEffect(() => {
        // create async helper function to get activities
        const getActivities = async () => {
            try {
                let fetchActivities: ActivitiesResponse = await makeApiRequest("http://localhost:8000/activity")
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({})
        const newErrors: FormErrors = {}

        // * Add validations here
        // Ensure the name does not already exist
        const matchingNames = allEvents?.find((e) => e.name === formEvent.name)
        if (matchingNames) {
            newErrors.name = "Name Already Exists"
        }

        // Validate name's length:
        if (formEvent.name.length < 1) newErrors.name = "Name must be greater than one character"

        // Validate description length:
        if (formEvent.description.length < 1) newErrors.description = "Description must be greater than one character"

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
        if (formEvent.latitude !== null &&
            formEvent.latitude !== undefined &&
            (formEvent.latitude < -90 || formEvent.latitude > 90)) newErrors.latitude = "Please provide valid latitude"
        if (formEvent.longitude !== null &&
            formEvent.longitude !== undefined &&
            (formEvent.longitude < -180 || formEvent.longitude > 180)) newErrors.longitude = "Please provide valid longitude"

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        // Create Payload
        const payload: EventPayload = {
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
            zipCode: parseInt(formEvent.zipCode.toString(), 10),
            latitude: formEvent.latitude ? parseFloat(formEvent.latitude.toString()) : undefined,
            longitude: formEvent.longitude ? parseFloat(formEvent.longitude.toString()) : undefined,
            userId: [],
            childIDs: []
        }

        // Try to add an event
        try {
            const response: any = await makeApiRequest(`http://localhost:8000/event/${eventId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: payload
            })

            if (response) {
                console.log("Event successfully created:", response)
                setFormEvent(formEvent)
            } else {
                console.error("Failed to create event")
            }
        } catch (e) {
            throw new Error(`Unable to add event: ${e}`)
        }
    }

    const handleChangeSelectOrInputOrText = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target
        setFormEvent(prev => {
            if (!prev) return prev
            return { ...prev, [name]: value }
        })
    }

    const handleDiscard = async () => {
        setFormEvent(singleEvent)
    }

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-center mb-4">Update Event</h1>

            <form onSubmit={handleSubmit} className="space-y-5">
                <fieldset className="space-y-4">
                    {/* Activity */}
                    <div>
                        <label className="block mb-1 font-medium">
                            Activity <span className="text-rose-600">*</span>
                        </label>
                        <select
                            name="activityId"
                            value={formEvent.activityId}
                            onChange={handleChangeSelectOrInputOrText}
                            className="w-full border rounded px-3 py-2"
                        >
                            <option>Select an Activity</option>
                            {activities?.map((activity) => (
                                <option key={activity.id} value={activity.id}>
                                    {activity.name}
                                </option>
                            ))}
                        </select>
                        {errors.activity && <p className="text-sm text-red-600">{errors.activity}</p>}
                    </div>

                    {/* Name */}
                    <div>
                        <label className="block mb-1 font-medium">
                            Name <span className="text-rose-600">*</span>
                        </label>
                        <input
                            name="name"
                            placeholder="Name"
                            value={formEvent.name}
                            onChange={handleChangeSelectOrInputOrText}
                            className="w-full border rounded px-3 py-2"
                        />
                        {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block mb-1 font-medium">
                            Description <span className="text-rose-600">*</span>
                        </label>
                        <textarea
                            name="description"
                            placeholder="Description"
                            value={formEvent.description}
                            onChange={handleChangeSelectOrInputOrText}
                            maxLength={750}
                            className="w-full border rounded px-3 py-2"
                        />
                        {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
                    </div>

                    {/* Date */}
                    <div>
                        <label className="block mb-1 font-medium">
                            Date <span className="text-rose-600">*</span>
                        </label>
                        <input
                            name="date"
                            placeholder="MM/DD/YYYY"
                            value={formEvent.date}
                            onChange={handleChangeSelectOrInputOrText}
                            className="w-full border rounded px-3 py-2"
                        />
                        {errors.date && <p className="text-sm text-red-600">{errors.date}</p>}
                    </div>

                    {/* Start & End Time */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-1 font-medium">
                                Start Time <span className="text-rose-600">*</span>
                            </label>
                            <input
                                name="startTime"
                                placeholder="Start Time"
                                value={formEvent.startTime}
                                onChange={handleChangeSelectOrInputOrText}
                                className="w-full border rounded px-3 py-2"
                            />
                            {errors.startTime && <p className="text-sm text-red-600">{errors.startTime}</p>}
                        </div>
                        <div>
                            <label className="block mb-1 font-medium">
                                End Time <span className="text-rose-600">*</span>
                            </label>
                            <input
                                name="endTime"
                                placeholder="End Time"
                                value={formEvent.endTime}
                                onChange={handleChangeSelectOrInputOrText}
                                className="w-full border rounded px-3 py-2"
                            />
                            {errors.endTime && <p className="text-sm text-red-600">{errors.endTime}</p>}
                        </div>
                    </div>

                    {/* Image */}
                    <div>
                        <label className="block mb-1 font-medium">
                            Image <span className="text-rose-600">*</span>
                        </label>
                        <input
                            name="image"
                            placeholder="Image (optional)"
                            value={formEvent.image}
                            onChange={handleChangeSelectOrInputOrText}
                            className="w-full border rounded px-3 py-2"
                        />
                        {/* {errors.image && <p className="text-sm text-red-600">{errors.image}</p>} */}
                    </div>

                    {/* Limit */}
                    <div>
                        <label className="block mb-1 font-medium">
                            Participants Limit <span className="text-rose-600">*</span>
                        </label>
                        <input
                            name="limit"
                            placeholder="(e.g. 15)"
                            value={formEvent.limit}
                            onChange={handleChangeSelectOrInputOrText}
                            className="w-full border rounded px-3 py-2"
                        />
                        {errors.limit && <p className="text-sm text-red-600">{errors.limit}</p>}
                    </div>

                    {/* City */}
                    <div>
                        <label className="block mb-1 font-medium">
                            City <span className="text-rose-600">*</span>
                        </label>
                        <select
                            id="City"
                            name="City"
                            value={formEvent.city}
                            onChange={(e) => setFormEvent({ ...formEvent, city: e.target.value })}
                            className="w-full border rounded px-3 py-2"
                        >
                            {CITIES_CO.map((city) => (
                                <option key={city} value={city}>
                                    {city}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* State */}
                    <div>
                        <label className="block mb-1 font-medium">
                            State <span className="ml-1 text-xs text-gray-500">(Select One)</span>
                        </label>
                        <select
                            id="State"
                            name="State"
                            value={formEvent.state}
                            onChange={(e) => setFormEvent({ ...formEvent, state: e.target.value })}
                            className="w-full border rounded px-3 py-2"
                        >
                            {US_States.map((state) => (
                                <option key={state} value={state}>
                                    {state}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Address */}
                    <div>
                        <label className="block mb-1 font-medium">
                            Address <span className="text-rose-600">*</span>
                        </label>
                        <input
                            name="address"
                            placeholder="Address"
                            value={formEvent.address}
                            onChange={handleChangeSelectOrInputOrText}
                            className="w-full border rounded px-3 py-2"
                        />
                        {errors.address && <p className="text-sm text-red-600">{errors.address}</p>}
                    </div>

                    {/* Zipcode */}
                    <div>
                        <label className="block mb-1 font-medium">
                            Zipcode <span className="text-rose-600">*</span>
                        </label>
                        <input
                            name="zipCode"
                            placeholder="Zipcode"
                            value={formEvent.zipCode}
                            onChange={handleChangeSelectOrInputOrText}
                            required
                            className="w-full border rounded px-3 py-2"
                        />
                        {errors.zipCode && <p className="text-sm text-red-600">{errors.zipCode}</p>}
                    </div>

                    {/* Latitude & Longitude */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-1 font-medium">
                                Latitude <span className="text-rose-600">*</span>
                            </label>
                            <input
                                name="latitude"
                                placeholder="Latitude"
                                value={formEvent.latitude ?? undefined}
                                onChange={handleChangeSelectOrInputOrText}
                                required
                                className="w-full border rounded px-3 py-2"
                            />
                            {errors.latitude && <p className="text-sm text-red-600">{errors.latitude}</p>}
                        </div>
                        <div>
                            <label className="block mb-1 font-medium">
                                Longitude <span className="text-rose-600">*</span>
                            </label>
                            <input
                                name="longitude"
                                placeholder="Longitude"
                                value={formEvent.longitude ?? undefined}
                                onChange={handleChangeSelectOrInputOrText}
                                required
                                className="w-full border rounded px-3 py-2"
                            />
                            {errors.longitude && <p className="text-sm text-red-600">{errors.longitude}</p>}
                        </div>
                    </div>
                </fieldset>

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