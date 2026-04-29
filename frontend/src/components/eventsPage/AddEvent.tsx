'use client'

import { useMemo, useState, useEffect } from 'react';
import { makeApiRequest } from '../../../utils/api';
import { CreateEventPayload, EventFormErrors } from '@/types/event';
// import { convertStringToIsoFormat, toYMDLocal } from '../../../utils/formatDate';
import { useRouter } from 'next/navigation';
import { useEvent } from '../../../hooks/useEvent';
import { determineEnv } from '../../../utils/api';
import { useUser } from '../../../hooks/useUser';
import { parseFloatOrNull } from '../../../utils/parseHelpers';
import EventFields from './EventField';
import { useActivity } from '../../../hooks/useActivity';
// import { fileToDataUrl } from '../../../utils/image/fileToDataUrl';
import { compressImage } from '../../../utils/image/compressImage';
import { ymdToIsoNoShift, todayYMDUTC } from '../../../utils/formatDate';
import AddProgramForm from "../Programs/AddProgramForm";


const WONDERHOOD_URL = determineEnv()

const initialEventForm = (): CreateEventPayload => ({
    activityId: "",
    name: "",
    description: "",
    notes: "",
    date: "",
    startTime: null,
    endTime: null,
    image: "",
    limit: null,
    schoolAccess: "all",
    city: "",
    state: "CO",
    address: "",
    zipCode: "",
    label: "wonderhood",
    latitude: null,
    longitude: null,
    ageMin: null,
    ageMax: null,
})

export default function AddEvent() {
    const dateYMD = /^\d{4}-\d{2}-\d{2}$/
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/
    const [form, setForm] = useState<CreateEventPayload>(() => initialEventForm())
    const [errors, setErrors] = useState<EventFormErrors>({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    // const { activities } = useActivity()
    // const selectedActivity = activities.find((a) => a.id === form.activityId)
    // const isProgramSelected = selectedActivity?.name === "Enrichment Programs"
    const { activities } = useActivity()
    const [createType, setCreateType] = useState<'event' | 'program' | null>(null)
    const eventActivity = activities.find((a) => a.name === 'Events')
    const { events } = useEvent(undefined)
    const router = useRouter()
    const todayYMD = useMemo(() => todayYMDUTC(), []);
    const { user } = useUser()
    const isPartner = user?.role === 'partner'
    const endpoint = isPartner ? `${WONDERHOOD_URL}/event/submit` : `${WONDERHOOD_URL}/event`

    // Reactively set activityId for events once activities have loaded,
    // in case the user clicked "Event" before the activities fetch resolved.
    useEffect(() => {
        if (createType === 'event' && eventActivity?.id && !form.activityId) {
            setForm(prev => ({
                ...prev,
                activityId: eventActivity.id
            }))
        }
    }, [createType, eventActivity])


    // Sets which creation flow the user wants to use.
    // For events, we auto-fill the default Events activityId so the event payload
    // remains compatible with the existing backend expectations.
    const handleSelectType = (type: 'event' | 'program') => {
        setCreateType(type)

        if (type === 'event') {
            setForm(prev => ({
                ...prev,
                activityId: eventActivity?.id ?? ''
            }))
        }
    }

    const handleImageChange = async (fileOrUrl: File | string | null) => {
        if (fileOrUrl instanceof File) {
            // Compress file to ±1600×1200, WebP/0.8
            const dataUrl = await compressImage(fileOrUrl, {
                maxWidth: 1600,
                maxHeight: 1200,
                quality: 0.8,
                type: 'image/webp',
            });
            setForm(prev => ({ ...prev, image: dataUrl }));
        } else {
            setForm(prev => ({ ...prev, image: fileOrUrl ?? '' }));
        }
    };


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target

        if (name === "latitude" || name === "longitude") {
            setForm(prev => ({ ...prev, [name]: parseFloatOrNull(value) }))
            return
        }

        if (name === "limit" || name === "ageMin" || name === "ageMax") {
            setForm(prev => ({ ...prev, [name]: value === "" ? null : parseInt(value, 10) }))
            return
        }

        if (name === "startTime" || name === "endTime") {
            setForm(prev => ({ ...prev, [name]: value === "" ? null : value }))
            return
        }

        setForm(prev => ({ ...prev, [name]: value }))
    }

    const handleDiscard = () => router.push('/events')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return
        setIsSubmitting(true)
        setErrors({})
        const newErrors: EventFormErrors = {}

        // Ensure the name does not already exist
        const matchingNames = events?.find((e) => e.name === form.name)
        if (matchingNames) newErrors.name = "Name Already Exists"

        // Validate name's length:
        if (form.name.length < 1) newErrors.name = "Name must be greater than one character"

        // Validate description length:
        if (form.description.length <= 1) newErrors.description = "Description must be greater than one character"

        // Validate description notes
        if (form.notes && form.notes.length < 2) newErrors.notes = "Notes must be at least 2 characters";

        // Validate date format:
        if (!dateYMD.test(form.date)) newErrors.date = "Please pick a valid date"

        // Validate time formats (only if provided):
        if (form.startTime != null && !timeRegex.test(form.startTime)) newErrors.startTime = "Please provide HH:mm"
        if (form.endTime != null && !timeRegex.test(form.endTime)) newErrors.endTime = "Please provide HH:mm"

        // Validate participant LIMIT:
        if (form.limit != null && form.limit > 100) newErrors.limit = "There must be less than 100 participants"
        if (form.limit != null && form.limit < 0) newErrors.limit = "There must be at least 0 participants"

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

        const payload: CreateEventPayload = {
            ...form,
            date: ymdToIsoNoShift(form.date),
            label: isPartner ? 'partner' : form.label,
        };

        console.log("Submitting event with payload:", payload) // Debug log to check payload before submission

        try {
            const response = await makeApiRequest(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: payload
            })

            if (response) {
                setForm(initialEventForm())
                router.replace(isPartner ? "/events?success=event" : "/events")
            }
        } catch (e) {
            throw new Error(`Unable to add event: ${e}`)
        } finally {
            setIsSubmitting(false)
        }
    }


    return (
        <div className="relative max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            {createType === null && (
                <div className="space-y-8">
                    <div className="text-center pt-2">
                        <h1 className="text-3xl font-bold text-wondergreen">What would you like to create?</h1>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={() => handleSelectType('event')}
                            className="group rounded-2xl border border-gray-200 p-6 text-left hover:border-wondergreen hover:bg-wondergreen/5 transition-all duration-200"
                        >
                            <div className="w-10 h-10 rounded-xl bg-wondergreen/10 flex items-center justify-center mb-4 group-hover:bg-wondergreen/20 transition-colors">
                                <svg className="w-5 h-5 text-wondergreen" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h2 className="text-base font-semibold text-wondergreen mb-1">Event</h2>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                A one-time activity — workshop, outing, outdoor adventure, or class.
                            </p>
                        </button>

                        <button
                            type="button"
                            onClick={() => handleSelectType('program')}
                            className="group rounded-2xl border border-gray-200 p-6 text-left hover:border-wondergreen hover:bg-wondergreen/5 transition-all duration-200"
                        >
                            <div className="w-10 h-10 rounded-xl bg-wondergreen/10 flex items-center justify-center mb-4 group-hover:bg-wondergreen/20 transition-colors">
                                <svg className="w-5 h-5 text-wondergreen" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <h2 className="text-base font-semibold text-wondergreen mb-1">Enrichment Program</h2>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                A multi-week program with recurring sessions.
                            </p>
                        </button>
                    </div>

                    <div className="flex justify-center pt-2">
                        <button
                            type="button"
                            onClick={() => router.push('/events')}
                            className="px-6 py-2.5 rounded-xl text-sm text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-all duration-200"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {createType === 'event' && (
                <>
                    <div className="mb-4">
                        <button
                            type="button"
                            onClick={() => {
                                setCreateType(null)
                                setForm(initialEventForm())
                                setErrors({})
                            }}
                            className="text-sm text-gray-600 hover:text-gray-900 underline mb-2"
                        >
                            ← Back
                        </button>

                        <h1 className="text-2xl font-bold text-center">Add an Event</h1>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <EventFields
                            form={form}
                            errors={errors}
                            minDate={todayYMD}
                            onChange={handleChange}
                            onImageChange={handleImageChange}
                        />

                        <div className="flex justify-end gap-4">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-wondergreen hover:bg-wonderleaf text-white px-4 py-2 rounded-md"
                            >
                                {isPartner ? "Submit for Approval" : "Add Event"}
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
                </>
            )}

            {createType === 'program' && (
                <>
                    <div className="mb-4">
                        <button
                            type="button"
                            onClick={() => setCreateType(null)}
                            className="text-sm text-gray-600 hover:text-gray-900 underline mb-2"
                        >
                            ← Back
                        </button>
                    </div>

                    <AddProgramForm />
                </>
            )}
        </div>
    )
}
