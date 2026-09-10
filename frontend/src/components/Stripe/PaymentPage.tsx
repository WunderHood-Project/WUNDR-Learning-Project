"use client"

import { loadStripe } from "@stripe/stripe-js";
import { useSearchParams } from "next/navigation";
import { useState, useMemo } from "react";
import { EmbeddedCheckout } from "@stripe/react-stripe-js";
import { EmbeddedCheckoutProvider } from "@stripe/react-stripe-js";
import { determineEnv } from "../../../utils/api";
import { CreatePaymentPayload, PaymentFormErrors } from "../../types/payment";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
const WONDERHOOD_URL = determineEnv()

const initialPaymentForm = (donationType: "Donation" | "Sponsorship"): CreatePaymentPayload => ({
    amount: "",
    donationType
})


export default function PaymentPage() {
    // const { token } = useAuth()
    const searchParams = useSearchParams()
    const preselectedType = searchParams.get('type') === 'Sponsorship' ? 'Sponsorship' : 'Donation'
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [form, setForm] = useState<CreatePaymentPayload>(() => initialPaymentForm(preselectedType))
    const [errors, setErrors] = useState<PaymentFormErrors>({})

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
    }

    const handleTypeChange = (donationType: "Donation" | "Sponsorship") => {
        setForm(prev => ({ ...prev, donationType }))
    }

    const createSession = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrors({})
        type PaymentSessionResponse = { "client-secret": string };

        const newErrors: PaymentFormErrors = {}

        // Add validations
        const amount = Number(form?.amount)
        if (form?.amount === "" || Number.isNaN(amount)) {
            newErrors.amount = "Please enter a donation amount"
        } else if (amount < 0.50) {
            newErrors.amount = "The donation amount must be greater than 0"
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        const payload: CreatePaymentPayload = {
            ...form
        }

        try {
            const response = await fetch(`${WONDERHOOD_URL}/payments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                setErrors({ amount: "We couldn't process that donation amount. Please check it and try again." })
                return
            }

            const data: PaymentSessionResponse = await response.json();
            setClientSecret(data["client-secret"]);
        } catch {
            setErrors({ amount: "Something went wrong submitting your donation. Please try again." })
        }
    };

    const options = useMemo(() => ({ clientSecret }), [clientSecret]);

    return (
        // <>
        <form
            onSubmit={createSession}
            className="bg-amber-50 border border-amber-200 rounded-2xl shadow-sm p-6 w-full max-w-md mx-auto mt-8"
        >
            <h2 className="text-lg font-semibold text-amber-900 mb-3">
                {form.donationType === "Sponsorship" ? "Become a Sponsor" : "Make a Donation"}
            </h2>
            <p className="text-sm text-amber-800 mb-6">
                Your support helps us continue our mission. Please enter your donation amount below.
            </p>

            {/* Donation Type Toggle */}
            <div className="mb-5">
                <span className="block text-sm font-medium text-amber-900 mb-2">
                    Contribution Type
                </span>
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => handleTypeChange("Donation")}
                        className={`flex-1 rounded-md py-2 px-3 text-sm font-semibold border transition ${
                            form.donationType === "Donation"
                                ? "bg-wonderleaf text-white border-wonderleaf"
                                : "bg-white text-amber-900 border-amber-300 hover:bg-amber-100"
                        }`}
                    >
                        Donation
                    </button>
                    <button
                        type="button"
                        onClick={() => handleTypeChange("Sponsorship")}
                        className={`flex-1 rounded-md py-2 px-3 text-sm font-semibold border transition ${
                            form.donationType === "Sponsorship"
                                ? "bg-wonderleaf text-white border-wonderleaf"
                                : "bg-white text-amber-900 border-amber-300 hover:bg-amber-100"
                        }`}
                    >
                        Sponsorship
                    </button>
                </div>
            </div>

            {/* Donation Amount Field */}
            <div className="mb-5">
                <label
                    htmlFor="amount"
                    className="block text-sm font-medium text-amber-900 mb-2"
                >
                    Donation Amount ($)
                </label>
                <input
                    type="number"
                    name="amount"
                    id="amount"
                    defaultValue={form.amount}
                    onChange={handleChange}
                    className="w-40 border border-amber-300 rounded-md p-2 text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                    placeholder="0"
                    min="0.50"
                    step="any"
                    required
                />
                {errors.amount && (
                    <p className="text-red-600 text-sm mt-1">{errors.amount}</p>
                )}
            </div>

            {/* Submit or Checkout */}
            <div className="mt-6">
                {!clientSecret ? (
                    <button
                        type="submit"
                        className="bg-wonderleaf hover:bg-green-700 text-white font-medium rounded-md py-2 px-4 transition-all duration-200"
                    >
                        Proceed with Donation
                    </button>
                ) : (
                    <div className="mt-4">
                        <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
                            <EmbeddedCheckout />
                        </EmbeddedCheckoutProvider>
                    </div>
                )}
            </div>
        </form>
        // </>
    );
}
