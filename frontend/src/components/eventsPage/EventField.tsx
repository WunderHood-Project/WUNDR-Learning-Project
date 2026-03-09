"use client"

import React from "react"
import { CITIES_CO } from "@/data/citiesCO"
import type { Activity } from "@/types/activity"
import type { CreateEventPayload, EventFormErrors } from '@/types/event'
import EventImagePicker from "@/components/common/EventImagePicker";


type Props = {
    form: CreateEventPayload
    errors: EventFormErrors
    activities: Activity[]
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void
    minDate?: string
    onImageChange?: (fileOrUrl: File | string | null) => void;
}

const EventFields: React.FC<Props> = ({ form, errors, activities, minDate, onChange, onImageChange, }) => {
    const handleImageChange = onImageChange ?? (() => {});

    return (
        <fieldset className="space-y-4">
            <div>
                <label className="block mb-1 font-medium">Activity <span className="text-rose-600">*</span></label>
                <select
                    name="activityId"
                    value={form.activityId}
                    onChange={onChange}
                    className="w-full border rounded px-3 py-2"
                    required
                >
                    <option value="">Select an Activity</option>
                    {activities.map((activity) => (
                        <option key={activity.id} value={activity.id}>
                            {activity.name}
                        </option>
                    ))}
                </select>
                {errors.activityId && <p className="text-sm text-red-600">{errors.activityId}</p>}
            </div>

            <div>
                <label className="block mb-1 font-medium">Name <span className="text-rose-600">*</span></label>
                <input
                    name="name"
                    placeholder="Name"
                    value={form.name}
                    onChange={onChange}
                    className="w-full border rounded px-3 py-2"
                    required
                />
                {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
            </div>

            <div>
                <label className="block mb-1 font-medium">Description <span className="text-rose-600">*</span></label>
                <textarea
                    name="description"
                    placeholder="Description"
                    value={form.description}
                    onChange={onChange}
                    maxLength={750}
                    required
                    className="w-full border rounded px-3 py-2"
                />
                {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
            </div>

            {/* Notes (optional) */}
            <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                Notes (optional)
            </label>
            <textarea
                id="notes"
                name="notes"
                value={form.notes ?? ""}
                onChange={onChange}
                rows={3}
                placeholder="What to bring, attire, special instructions..."
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-wondergreen focus:ring-wondergreen"
            />
            {errors.notes && (
                <p className="mt-1 text-sm text-red-600">{errors.notes}</p>
            )}
            </div>


            <div>
                <label className="block mb-1 font-medium">Date <span className="text-rose-600">*</span></label>
                <input
                    type='date'
                    name="date"
                    min={minDate}
                    value={form.date}
                    onChange={onChange}
                    required
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
                        value={form.startTime}
                        onChange={onChange}
                        required
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
                        value={form.endTime}
                        onChange={onChange}
                        required
                        className="w-full border rounded px-3 py-2"
                    />
                    {errors.endTime && <p className="text-sm text-red-600">{errors.endTime}</p>}
                </div>
            </div>

            <div>
                <label className="block mb-1 font-medium">Image</label>
                <EventImagePicker
                value={form.image || null}
                onChange={handleImageChange}
                />
                {errors.image && <p className="text-sm text-red-600">{errors.image}</p>}

            </div>

            <div>
                <label className="block mb-1 font-medium">Participants Limit <span className="text-rose-600">*</span></label>
                <input
                    type="number"
                    name="limit"
                    min={0}
                    max={100}
                    inputMode="numeric"
                    value={form.limit}
                    onChange={onChange}
                    required
                    className="w-full border rounded px-3 py-2"
                />
                {errors.limit && <p className="text-sm text-red-600">{errors.limit}</p>}
            </div>

            <div>
                <label className="block mb-1 font-medium">
                    Who can enroll? <span className="text-rose-600">*</span>
                </label>
                <select
                    name="schoolAccess"
                    value={form.schoolAccess}
                    onChange={onChange}
                    className="w-full border rounded px-3 py-2"
                    required
                >
                    <option value="all">All children</option>
                    <option value="homeschool_only">Homeschool only</option>
                    <option value="public_custer_only">Public school only (Custer County)</option>
                    <option value="private_custer_only">Private school only (Custer County)</option>
                </select>
                {errors.schoolAccess && <p className="text-sm text-red-600">{errors.schoolAccess}</p>}
            </div>

            <div>
                <label className="block mb-1 font-medium">City <span className="text-rose-600">*</span></label>
                <select
                    id="City"
                    name="city"
                    onChange={onChange}
                    value={form.city}
                    className="w-full border rounded px-3 py-2"
                    required
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
                    onChange={onChange}
                    value={form.state}
                    className="w-full border rounded px-3 py-2"
                    required
                >
                    <option value={"CO"}>
                        CO
                    </option>
                </select>
            </div>

            <div>
                <label className="block mb-1 font-medium">Address <span className="text-rose-600">*</span></label>
                <input
                    name="address"
                    placeholder="Address"
                    value={form.address}
                    onChange={onChange}
                    className="w-full border rounded px-3 py-2"
                    required
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
                    value={form.zipCode}
                    onChange={onChange}
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
                        value={form.latitude ?? ""}
                        onChange={onChange}
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
                        value={form.longitude ?? ""}
                        onChange={onChange}
                        className="w-full border rounded px-3 py-2"
                    />
                    {errors.longitude && <p className="text-sm text-red-600">{errors.longitude}</p>}
                </div>
            </div>
        </fieldset>
    )
}

export default EventFields
