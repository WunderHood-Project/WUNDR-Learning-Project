"use client";

import { User } from "@/types/user"
import React, { useEffect, useMemo, useState } from "react"
import { makeApiRequest } from "../../../../utils/api"
import { e164toUS, formatUs, onlyDigitals, toE164US } from "../../../../utils/formatPhoneNumber";
import { determineEnv } from "../../../../utils/api";

const WONDERHOOD_URL = determineEnv()

type Props = {
    currUser: User | null
    onSaved: () => void
    onCancel: () => void
}

const UpdateUserForm: React.FC<Props> = ({ currUser, onSaved, onCancel }) => {
    // const [avatar, setAvatar] = useState<string>("")
    const [firstName, setFirstName] = useState<string>("")
    const [lastName, setLastName] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [phoneNumber, setPhoneNumber] = useState<string>("")
    const [address, setAddress] = useState<string>("")
    const [city, setCity] = useState<string>("")
    const [state, setState] = useState<string>("")
    const [zipCode, setZipCode] = useState<string>("")
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        // setAvatar(currUser?.avatar ?? "")
        setFirstName(currUser?.firstName ?? "")
        setLastName(currUser?.lastName ?? "")
        setEmail(currUser?.email ?? "")
        setPhoneNumber(e164toUS(currUser?.phoneNumber) ?? "")
        setAddress(currUser?.address ?? "")
        setCity(currUser?.city ?? "")
        setState(currUser?.state ?? "")
        setZipCode(currUser?.zipCode != null ? String(currUser.zipCode).padStart(5, "0") : "")
    }, [currUser])

    const isValid = useMemo(() => {
        const ok =
            !!firstName?.trim() &&
            !!lastName?.trim() &&
            !!email?.trim() &&
            !!address?.trim() &&
            !!city?.trim() &&
            !!state?.trim() &&
            zipCode?.length === 5

        return ok
    }, [firstName, lastName, email, address, city, state, zipCode?.length])

    // const updateAvatar
    const updateFirstName = (e: React.ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)
    const updateLastName = (e: React.ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)
    const updateEmail = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)
    const updatePhoneNumber = (e: React.ChangeEvent<HTMLInputElement>) => setPhoneNumber(formatUs(e.target.value))
    const updateAddress = (e: React.ChangeEvent<HTMLInputElement>) => setAddress(e.target.value)
    const updateCity = (e: React.ChangeEvent<HTMLInputElement>) => setCity(e.target.value)
    const updateState = (e: React.ChangeEvent<HTMLInputElement>) => setState(e.target.value)
    const updateZipCode = (e: React.ChangeEvent<HTMLInputElement>) => {
        const digits = onlyDigitals(e.target.value).slice(0, 5)
        setZipCode(digits)
    }

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!isValid || saving) return

        const phoneE164 = toE164US(phoneNumber)
        if (!phoneE164) return

        const payload = {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim(),
            phoneNumber: phoneE164,
            address: address.trim(),
            city: city.trim(),
            state: state.trim(),
            zipCode: String(zipCode).trim()
        }

        try {
            setSaving(true)
            await makeApiRequest(`${WONDERHOOD_URL}/user`, {
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
                    {/* {currUser?.avatar ? (
                        <img className='h-24 w-24 rounded-full object-cover' src={currUser.avatar} alt={`Profile Image of ${currUser.firstName}`}/>
                    ): (
                        <img className='h-24 w-24' src="./profile-picture.png" alt="Default profile"/>
                    )} */}

                    <div className="flex flex-col text-center">
                        <div className="flex flex-row mb-2">
                            <input
                                type="text"
                                value={firstName}
                                onChange={updateFirstName}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wondergreen focus:border-transparent"
                                disabled={saving}
                            />

                            <input
                                type="text"
                                value={lastName}
                                onChange={updateLastName}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wondergreen focus:border-transparent"
                                disabled={saving}
                            />
                        </div>

                        <div className="mb-2">
                            <input
                                type="email"
                                value={email}
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
                                value={phoneNumber}
                                onChange={updatePhoneNumber}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wondergreen focus:border-transparent"
                                disabled={saving}
                            />
                        </div>

                        <input
                            type="text"
                            value={address}
                            onChange={updateAddress}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wondergreen focus:border-transparent"
                            disabled={saving}
                        />

                        <div className="flex flex-row">
                            <input
                                type="text"
                                value={city}
                                onChange={updateCity}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wondergreen focus:border-transparent"
                                disabled={saving}
                            />

                            <input
                                type="text"
                                value={state}
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
                                value={zipCode}
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
