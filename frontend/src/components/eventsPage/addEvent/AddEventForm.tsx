"use client"

import React from "react"
import { CITIES_CO } from "@/data/citiesCO"
import { US_States } from "@/data/states"
import type { Activity } from "@/types/activity"
import type { EventForm, EventFormErrors } from '@/types/event'


type Props = {
    form: EventForm
    errors: EventFormErrors
    activities: Activity[]
    todayYMD: string
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void
}

const AddEventForm: React.FC<Props> = ({ form, errors, activities, todayYMD, onChange }) => {

    return (
        <fieldset className="space-y-4">
            <div>
                <label className="block mb-1 font-medium">Activity <span className="text-rose-600">*</span></label>
                <select
                    name="activityId"
                    value={form.activityId}
                    onChange={onChange}
                    className="w-full border rounded px-3 py-2"
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
                    value={form.date}
                    onChange={onChange}
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
                    value={form.image}
                    onChange={onChange}
                    className="w-full border rounded px-3 py-2"
                />
            </div>

            <div>
                <label className="block mb-1 font-medium">Participants Limit <span className="text-rose-600">*</span></label>
                <input
                    name="limit"
                    placeholder="(e.g. 15)"
                    value={form.limit}
                    onChange={onChange}
                    className="w-full border rounded px-3 py-2"
                />
                {errors.limit && <p className="text-sm text-red-600">{errors.limit}</p>}
            </div>

            <div>
                <label className="block mb-1 font-medium">City <span className="text-rose-600">*</span></label>
                <select
                    id="City"
                    name="city"
                    onChange={onChange}
                    value={form.city}
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
                    onChange={onChange}
                    value={form.state}
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
                    value={form.address}
                    onChange={onChange}
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

export default AddEventForm
