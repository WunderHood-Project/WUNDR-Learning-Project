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
        if (form?.amount < 0) {
            newErrors.amount = "The donation amount must be greater than 0"
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        const payload: CreatePaymentPayload = {
            ...form
        }


        // const response = await makeApiRequest(`${WONDERHOOD_URL}/payments`, {
        //     method: "POST",
        //     headers: { "Content-Type": "application/json", },
        //     body: payload
        // })

        // const data = response.json() as { "client-secret": string };
        // console.log(data["client-secret"])

        // setClientSecret(data["client-secret"]);

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
        <form onSubmit={createSession}>
            <div>
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

            </div>
        </form>
    );
}