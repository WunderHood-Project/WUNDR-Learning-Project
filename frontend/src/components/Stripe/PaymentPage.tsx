"use client"

import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";
import { EmbeddedCheckout } from "@stripe/react-stripe-js";
import { useMemo } from "react";
import { EmbeddedCheckoutProvider } from "@stripe/react-stripe-js";
import { determineEnv } from "../../../utils/api";
import { CreatePaymentPayload, PaymentFormErrors } from "../../types/payment";
// import { useAuth } from "@/context/auth";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
const WONDERHOOD_URL = determineEnv()

const initialPaymentForm = (): CreatePaymentPayload => ({
    amount: 0,
    donationType: "Donation"
})


export default function PaymentPage() {
    // const { token } = useAuth()
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [form, setForm] = useState<CreatePaymentPayload>(() => initialPaymentForm())
    const [errors, setErrors] = useState<PaymentFormErrors>({})


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
    }

    const createSession = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrors({})
        type PaymentSessionResponse = { "client-secret": string };

        const newErrors: PaymentFormErrors = {}

        // Add validations
        if (form?.amount < 0) newErrors.amount = "The donation amount must be greater than 0"

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        const payload: CreatePaymentPayload = {
            ...form
        }

        const response = await fetch(`${WONDERHOOD_URL}/payments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`Failed to create payment session: ${response.statusText}`);
        }

        const data: PaymentSessionResponse = await response.json();
        setClientSecret(data["client-secret"]);
    };

    const options = useMemo(() => ({ clientSecret }), [clientSecret]);

    return (
        // <>
            <form
                onSubmit={createSession}
                className="bg-amber-50 border border-amber-200 rounded-2xl shadow-sm p-6 w-full max-w-md mx-auto mt-8"
            >
                <h2 className="text-lg font-semibold text-amber-900 mb-3">
                    Make a Donation
                </h2>
                <p className="text-sm text-amber-800 mb-6">
                    Your support helps us continue our mission. Please enter your donation amount below.
                </p>

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
                        value={form.amount}
                        onChange={handleChange}
                        className="w-40 border border-amber-300 rounded-md p-2 text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                        placeholder="0"
                        min="1"
                        step="any"
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
