'use client'

import { useMemo, useState } from 'react';
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



const WONDERHOOD_URL = determineEnv()

const initialEventForm = (): CreateEventPayload => ({
    activityId: "",
    name: "",
    description: "",
    notes: "",
    date: "",
    startTime: "",
    endTime: "",
    image: "",
    limit: null,
    schoolAccess: "all",
    city: "",
    state: "CO",
    address: "",
    zipCode: "",
    latitude: null,
    longitude: null
})

export default function AddEvent() {
    const dateYMD = /^\d{4}-\d{2}-\d{2}$/
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/
    const [form, setForm] = useState<CreateEventPayload>(() => initialEventForm())
    const [errors, setErrors] = useState<EventFormErrors>({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { activities } = useActivity()
    const { events } = useEvent(undefined)
    const router = useRouter()
    const todayYMD = useMemo(() => todayYMDUTC(), []);
    const { user } = useUser()
    const isPartner = user?.role === 'partner'
    const endpoint = isPartner ? `${WONDERHOOD_URL}/event/submit` : `${WONDERHOOD_URL}/event`

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

        if (name === "limit") {
            setForm(prev => ({ ...prev, [name]: value === "" ? null : parseInt(value, 10) }))
            return
        }

        if (name === "startTime" || name === "endTime") {
            setForm(prev => ({ ...prev, [name]: value === "" ? null : value }))
            return
        }

        setForm(prev => ({ ...prev, [name]: value }))
    }

    const handleDiscard = () => setForm(initialEventForm())

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
        };

        try {
            const response = await makeApiRequest(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: payload
            })

            if (response) {
                setForm(initialEventForm())
                router.replace("/events")
            }
        } catch (e) {
            throw new Error(`Unable to add event: ${e}`)
        } finally {
            setIsSubmitting(false)
        }
    }


    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-center mb-4">Add an Event Below</h1>

            <form onSubmit={handleSubmit} className="space-y-5">
                <EventFields
                    form={form}
                    errors={errors}
                    activities={activities}
                    minDate={todayYMD}
                    onChange={handleChange}
                    onImageChange={handleImageChange}
                />

                <div className="flex justify-end gap-4">
                    <button
                        type="submit" disabled={isSubmitting}
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
        </div>
    );
}
