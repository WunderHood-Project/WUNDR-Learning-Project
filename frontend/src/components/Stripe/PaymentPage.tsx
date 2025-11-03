"use client"

import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";
import { EmbeddedCheckout } from "@stripe/react-stripe-js";
import { useMemo } from "react";
import { EmbeddedCheckoutProvider } from "@stripe/react-stripe-js";
import { determineEnv } from "../../../utils/api";
import { makeApiRequest } from "../../../utils/api";
import { CreatePaymentPayload, PaymentFormErrors } from "../../types/payment";
import { isEmail } from "../../../utils/emailValidation";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
const WONDERHOOD_URL = determineEnv()

const initialPaymentForm = (): CreatePaymentPayload => ({
    amount: 0,
    email: "",
    donationType: "Donation"
})


export default function PaymentPage() {
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

        const newErrors: PaymentFormErrors = {}

        // Add validations
        if (form?.amount < 0) {
            newErrors.amount = "The donation amount must be greater than 0"
        }

        if (!isEmail(form?.email)) {
            newErrors.email = "Please enter a valid email address"
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        const payload: CreatePaymentPayload = {
            ...form
        }


        const response = await makeApiRequest(`${WONDERHOOD_URL}/payments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: payload
        }) as Response;

        const data = await response.json();

        setClientSecret(data["client-secret"]);
    };

    const options = useMemo(() => ({ clientSecret }), [clientSecret]);

    return (
        <form onSubmit={createSession}>
            <div>
                <label className="block mb-2 font-semibold">Donation Amount ($)</label>
                <input
                    type="number"
                    name="amount"
                    value={form.amount}
                    onChange={handleChange}
                    className="border rounded-md p-2 w-32"
                    placeholder="0"
                />
                {errors.amount && <p className="text-red-500 text-sm">{errors.amount}</p>}
            </div>

            <div>
                <label className="block mb-2 font-semibold">Email</label>
                <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="border rounded-md p-2 w-64"
                    placeholder="you@example.com"
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>

            <div className="mt-4">
                {!clientSecret ? (
                    <button
                        type="submit"
                        className="btn-primary border rounded-md bg-wonderleaf px-2 py-1 text-white"
                    >
                        Proceed with Donation
                    </button>
                ) : (
                    <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
                        <EmbeddedCheckout />
                    </EmbeddedCheckoutProvider>
                )}
            </div>
        </form>
    );
}