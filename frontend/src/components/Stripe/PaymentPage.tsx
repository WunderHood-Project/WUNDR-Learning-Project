"use client"

import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";
import { EmbeddedCheckout } from "@stripe/react-stripe-js";
import { useMemo } from "react";
import { EmbeddedCheckoutProvider } from "@stripe/react-stripe-js";
import { determineEnv } from "../../../utils/api";
import { makeApiRequest } from "../../../utils/api";
import { CreateDonationPayload } from "../../types/donation";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
const WONDERHOOD_URL = determineEnv()


export default function PaymentPage() {
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [amount, setAmount] = useState<string>("25")
    const [form, setForm] = useState<CreateDonationPayload>(() => "")


    const createSession = async () => {
        const response = await makeApiRequest(`${WONDERHOOD_URL}/payments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: payload
        });

        const data = await response.json();
        setClientSecret(data["client-secret"]);
    };

    const options = useMemo(() => ({ clientSecret }), [clientSecret]);

    return (
        <>
            <div className="p-4">
                <label className="block mb-2 font-semibold">Donation Amount ($)</label>
                <input
                    type="number"
                    name="Donation Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="border rounded-md p-2 w-32"
                    placeholder="0"
                />
            </div>

            <div className="mt-4">
                {!clientSecret ? (
                    <button
                        onClick={createSession}
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
        </>
    );
}