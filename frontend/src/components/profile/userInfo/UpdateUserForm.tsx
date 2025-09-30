"use client";

import { UpdateUserPayload, User } from "@/types/user"
import React, { useEffect, useState } from "react"
import { makeApiRequest } from "../../../../utils/api"
import { e164toUS, formatUs, onlyDigitals, toE164US } from "../../../../utils/formatPhoneNumber";

type Props = {
    currUser: User | null
    onSaved: () => void
    onCancel: () => void
}

const UpdateUserForm: React.FC<Props> = ({ currUser, onSaved, onCancel }) => {
    const [form, setForm] = useState<UpdateUserPayload>({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        address: "",
        city: "",
        state: "",
        zipCode: ""
    })
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (!currUser) return
        setForm({
            firstName: currUser?.firstName ?? "",
            lastName: currUser?.lastName ?? "",
            email: currUser?.email ?? "",
            phoneNumber: e164toUS(currUser?.phoneNumber) ?? "",
            address: currUser?.address ?? "",
            city: currUser?.city ?? "",
            state: currUser?.state ?? "",
            zipCode: currUser?.zipCode != null ? String(currUser.zipCode).padStart(5, "0") : ""
        })
    }, [currUser])

    const isValid =
        !!form.firstName?.trim() &&
        !!form.lastName?.trim() &&
        !!form.email?.trim() &&
        !!form.address?.trim() &&
        !!form.city?.trim() &&
        !!form.state?.trim() &&
        form.zipCode?.length === 5

    // const updateAvatar
    const updateFirstName = (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, firstName: e.target.value }))
    const updateLastName = (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, lastName: e.target.value }))
    const updateEmail = (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, email: e.target.value }))
    const updatePhoneNumber = (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, phoneNumber: formatUs(e.target.value) }))
    const updateAddress = (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, address: e.target.value }))
    const updateCity = (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, city: e.target.value }))
    const updateState = (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, state: e.target.value }))
    const updateZipCode = (e: React.ChangeEvent<HTMLInputElement>) => {
        const digits = onlyDigitals(e.target.value).slice(0, 5)
        setForm(f => ({ ...f, zipCode: digits }))
    }

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!isValid || saving) return

        const phoneE164 = toE164US(form.phoneNumber)
        if (!phoneE164) return

        const payload: UpdateUserPayload = {
            ...form,
            phoneNumber: phoneE164,
            zipCode: String(form.zipCode).trim()
        }

        try {
            setSaving(true)
            await makeApiRequest(`http://localhost:8000/user`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: payload
            })
            onSaved()
        } catch (err) {
            console.error("update user failed", err)
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="bg-white shadow rounded-lg max-w-md mx-auto p-10">
            <form onSubmit={handleUpdate}>
                <div className="flex flex-row justify-around space-y-2">
                    <div className="flex flex-col text-center">
                        <div className="flex flex-row mb-2">
                            <input
                                type="text"
                                value={form.firstName}
                                onChange={updateFirstName}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wondergreen focus:border-transparent"
                                disabled={saving}
                            />

                            <input
                                type="text"
                                value={form.lastName}
                                onChange={updateLastName}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wondergreen focus:border-transparent"
                                disabled={saving}
                            />
                        </div>

                        <div className="mb-2">
                            <input
                                type="email"
                                value={form.email}
                                onChange={updateEmail}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wondergreen focus:border-transparent"
                                disabled={saving}
                            />
                        </div>

                        <div className="mb-2">
                            <input
                                type="tel"
                                inputMode="tel"
                                autoComplete="tel"
                                value={form.phoneNumber}
                                onChange={updatePhoneNumber}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wondergreen focus:border-transparent"
                                disabled={saving}
                            />
                        </div>

                        <input
                            type="text"
                            value={form.address}
                            onChange={updateAddress}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wondergreen focus:border-transparent"
                            disabled={saving}
                        />

                        <div className="flex flex-row">
                            <input
                                type="text"
                                value={form.city}
                                onChange={updateCity}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wondergreen focus:border-transparent"
                                disabled={saving}
                            />

                            <input
                                type="text"
                                value={form.state}
                                maxLength={2}
                                onChange={updateState}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wondergreen focus:border-transparent"
                                disabled={saving}
                            />
                        </div>

                        <div className="mb-2">
                            <input
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]{5}"
                                maxLength={5}
                                value={form.zipCode}
                                onChange={updateZipCode}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wondergreen focus:border-transparent"
                                disabled={saving}
                            />
                        </div>

                        <div>Children</div>
                        {currUser?.children?.length ? (
                            <ul className="list-disc pl-5">
                                {currUser.children.map(child => (
                                    <li key={child.id}>{child.firstName} {child.lastName}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">No children yet.</p>
                        )}

                        <button
                            type="submit"
                            disabled={!isValid || saving}
                            className="p-2 text-green-600 hover:text-green-700 disabled:text-gray-400 disabled:cursor-not-allowed"
                        >
                            Save
                        </button>
                        <button
                            type="button"
                            onClick={onCancel}
                            className="text-red-600 hover:text-red-700"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default UpdateUserForm
