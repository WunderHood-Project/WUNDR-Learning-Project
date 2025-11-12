import { useState } from "react"
import { CreateTaxReturnPayload, TaxReturnErrors } from "@/types/taxReturn"
import { makeApiRequest } from "../../../utils/api"
import { determineEnv } from "../../../utils/api"
import { useRouter } from "next/navigation"
import { isEmail } from "../../../utils/emailValidation";
import { formatUs } from "../../../utils/formatPhoneNumber";
import { normalizePhone } from "../../../utils/formatPhoneNumber";

type Props = {
    acknowledgementRequested: boolean
}

const WONDERHOOD_URL = determineEnv()

const initialTaxReturnForm = (): CreateTaxReturnPayload => ({
    acknowledgementRequested: false,
    firstName: "",
    lastName: "",
    phoneNumber: "",
    address: "",
    address2: "",
    city: "",
    state: "",
    zipCode: "",
    email: "",
    requestSent: false
})

const TaxReturnForm: React.FC<Props> = ({ acknowledgementRequested }) => {
    const [form, setForm] = useState<CreateTaxReturnPayload>(() => initialTaxReturnForm())
    const [errors, setErrors] = useState<TaxReturnErrors>({})
    const router = useRouter()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
    }

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target
        setForm(prev => ({ ...prev, phoneNumber: formatUs(value) }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrors({})
        const validationErrors: TaxReturnErrors = {}

        // Add validations here
        if (!form.firstName) validationErrors.firstName = "Please provide a first name"
        if (!form.lastName) validationErrors.lastName = "Please provide a last name"
        if (!form.email) validationErrors.email = "Please provide an email"
        if (!form.address) validationErrors.address = "Please provide an address"
        if (!form.city) validationErrors.city = "Please provide a valid city"
        if (!form.state) validationErrors.state = "Please provide a valid state"
        if (!form.zipCode) validationErrors.zipCode = "Please provide a phone number"

        if (!isEmail(form.email)) validationErrors.email = "Please provide a valid email address"
        if (form.phoneNumber && !formatUs(form.phoneNumber)) validationErrors.phoneNumber = "Please provide a valid phone number"

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
            return
        }

        // Handle submit logic here
        const payload: CreateTaxReturnPayload = {
            ...form,
            phoneNumber: normalizePhone(form.phoneNumber),
            acknowledgementRequested: Boolean(acknowledgementRequested)
        }

        const response = await makeApiRequest(`${WONDERHOOD_URL}/tax-return`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: payload
        }) as Response

        if (!response) {
            throw new Error(`Failed to record tax return credentials`)
        }

        router.push("/donate")

    }

    return (
        <div className="mt-6 flex justify-center">
            {acknowledgementRequested ? (
                <form
                    onSubmit={handleSubmit}
                    className="w-full max-w-2xl bg-amber-50 border border-amber-200 rounded-2xl shadow-sm p-6 space-y-4"
                >
                    <h2 className="text-lg font-semibold text-amber-900 mb-2">
                        Tax Return Information
                    </h2>
                    <p className="text-sm text-amber-800 mb-4">
                        Please fill out the following fields to receive your donation acknowledgement.
                    </p>

                    {/* Grid layout for form inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* First Name */}
                        <div>
                            <input
                                type="text"
                                name="firstName"
                                value={form.firstName}
                                onChange={handleChange}
                                className="w-full border border-amber-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                                placeholder="First Name"
                            />
                            {errors.firstName && (
                                <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>
                            )}
                        </div>

                        {/* Last Name */}
                        <div>
                            <input
                                type="text"
                                name="lastName"
                                value={form.lastName}
                                onChange={handleChange}
                                className="w-full border border-amber-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                                placeholder="Last Name"
                            />
                            {errors.lastName && (
                                <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>
                            )}
                        </div>

                        {/* Phone Number */}
                        <div>
                            <input
                                type="tel"
                                name="phoneNumber"
                                value={form.phoneNumber}
                                onChange={handlePhoneChange}
                                className="w-full border border-amber-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                                placeholder="Phone"
                            />
                            {errors.phoneNumber && (
                                <p className="text-red-600 text-sm mt-1">{errors.phoneNumber}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                className="w-full border border-amber-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                                placeholder="example@example.com"
                            />
                            {errors.email && (
                                <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                            )}
                        </div>

                        {/* Address */}
                        <div className="sm:col-span-2">
                            <input
                                type="text"
                                name="address"
                                value={form.address}
                                onChange={handleChange}
                                className="w-full border border-amber-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                                placeholder="Street Address"
                            />
                            {errors.address && (
                                <p className="text-red-600 text-sm mt-1">{errors.address}</p>
                            )}
                        </div>

                        {/* Secondary Address */}
                        <div className="sm:col-span-2">
                            <input
                                type="text"
                                name="address2"
                                value={form.address2}
                                onChange={handleChange}
                                className="w-full border border-amber-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                                placeholder="Secondary Address"
                            />
                            {errors.address2 && (
                                <p className="text-red-600 text-sm mt-1">{errors.address2}</p>
                            )}
                        </div>

                        {/* City */}
                        <div>
                            <input
                                type="text"
                                name="city"
                                value={form.city}
                                onChange={handleChange}
                                className="w-full border border-amber-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                                placeholder="City"
                            />
                            {errors.city && (
                                <p className="text-red-600 text-sm mt-1">{errors.city}</p>
                            )}
                        </div>

                        {/* State */}
                        <div>
                            <input
                                type="text"
                                name="state"
                                value={form.state}
                                onChange={handleChange}
                                className="w-full border border-amber-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                                placeholder="State"
                            />
                            {errors.state && (
                                <p className="text-red-600 text-sm mt-1">{errors.state}</p>
                            )}
                        </div>

                        {/* Zip Code */}
                        <div className="sm:col-span-2">
                            <input
                                type="text"
                                name="zipCode"
                                value={form.zipCode}
                                onChange={handleChange}
                                className="w-full border border-amber-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                                placeholder="Zip Code"
                            />
                            {errors.zipCode && (
                                <p className="text-red-600 text-sm mt-1">{errors.zipCode}</p>
                            )}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            // onClick={handleClick}
                            className="bg-wonderleaf text-white font-medium rounded-md py-2 px-4 hover:bg-green-700 transition"
                        >
                            Next
                        </button>
                    </div>
                </form>
            ) : (
                <div></div>
            )}
        </div>
    )
}

export default TaxReturnForm