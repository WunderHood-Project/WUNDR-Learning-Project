"use client"

import { loadStripe } from "@stripe/stripe-js";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { EmbeddedCheckout } from "@stripe/react-stripe-js";
import { EmbeddedCheckoutProvider } from "@stripe/react-stripe-js";
import { determineEnv } from "../../../utils/api";
import { CreateDinnerPaymentPayload, DinnerPaymentFormErrors, DinnerTicketTierKey, DINNER_TICKET_TIERS } from '../../types/fundraiserDinner'
import { isEmail } from "../../../utils/emailValidation";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
const WONDERHOOD_URL = determineEnv()

const initialPaymentForm = (): CreateDinnerPaymentPayload => ({
    adultQty: 0,
    childQty: 0,
    freeQty: 0,
    familyQty: 0,
    firstName: "",
    lastName: "",
    email: "",
})

export default function PurchaseTickets() {

    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [toast, setToast] = useState<string | null>(null);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const searchParams = useSearchParams()
    const router = useRouter()
    const [form, setForm] = useState<CreateDinnerPaymentPayload>(() => initialPaymentForm())
    const [errors, setErrors] = useState<DinnerPaymentFormErrors>({})

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
    }

    const handleQtyChange = (key: DinnerTicketTierKey, delta: number) => {
        setForm(prev => ({ ...prev, [key]: Math.max(0, prev[key] + delta) }))
    }

    useEffect(() => {
        const success = searchParams.get('success');
        if (success === 'dinner') setToast('Purchase was successful! Please keep a copy of your receipt for entry to the event.');
        if (success) {
            router.replace('/fundraiser-dinner/tickets', { scroll: false });
            const timer = setTimeout(() => setToast(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [searchParams, router]);

    const options = useMemo(() => ({ clientSecret: clientSecret! }), [clientSecret])

    const total = useMemo(
        () => DINNER_TICKET_TIERS.reduce((sum, tier) => sum + tier.price * form[tier.key], 0),
        [form]
    )

    const totalTickets = useMemo(
        () => DINNER_TICKET_TIERS.reduce((sum, tier) => sum + form[tier.key], 0),
        [form]
    )

    const doCheckout = async () => {
        type dinnerPaymentSessionResponse = { "client-secret": string };

        const payload: CreateDinnerPaymentPayload = {
            ...form
        }

        const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null
        const headers: Record<string, string> = { "Content-Type": "application/json" }
        if (token) headers["Authorization"] = `Bearer ${token}`

        const response = await fetch(`${WONDERHOOD_URL}/payments/dinner`, {
            method: "POST",
            headers,
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const data = await response.json().catch(() => null)
            throw new Error(data?.detail || `Failed to create payment session: ${response.statusText}`);
        }

        const data: dinnerPaymentSessionResponse = await response.json();
        setClientSecret(data["client-secret"]);
    }

    const createSession = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrors({})
        setSubmitError(null)
        const newErrors: DinnerPaymentFormErrors = {}

        if (totalTickets === 0) {
            setSubmitError("Please select at least one ticket.")
            return
        }

        if (total === 0) {
            setSubmitError("Please include at least one paid ticket.")
            return
        }

        if (!form.firstName.trim()) {
            newErrors.firstName = "First name is required"
        }

        if (!form.lastName.trim()) {
            newErrors.lastName = "Last name is required"
        }

        // Guests have no account to link the ticket to, so we need an email for their receipt
        if (!form.email) {
            newErrors.email = "Email is required"
        }

        if (form.email && !isEmail(form.email)) {
            newErrors.email = "Please enter a valid email address"
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        try {
            await doCheckout()
        } catch (err) {
            setSubmitError(err instanceof Error ? err.message : "Something went wrong. Please try again.")
        }
    }

    return (
        <form
            onSubmit={createSession}
            className="bg-amber-50 border border-amber-200 rounded-2xl shadow-sm p-6 w-full max-w-xl mx-auto mt-8"
        >

            {toast && (
                <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-xl bg-wondergreen px-6 py-3 text-white shadow-lg animate-fade-in">
                    <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm font-semibold">{toast}</span>
                    <button type="button" onClick={() => setToast(null)} className="ml-2 text-white/70 hover:text-white text-lg leading-none">×</button>
                </div>
            )}
            <h2 className="text-lg font-semibold text-amber-900 mb-3">
                Purchase Fundraiser Dinner Tickets
            </h2>
            <p className="text-sm text-amber-800 mb-6">
                Choose your tickets below. Your support helps us continue our mission.
            </p>

            {!clientSecret && (
                <>
                    <div className="space-y-4 mb-6">
                        {DINNER_TICKET_TIERS.map(tier => (
                            <div key={tier.key} className="flex items-center justify-between gap-4 border border-amber-200 rounded-xl p-3 bg-white">
                                <div>
                                    <p className="font-semibold text-amber-900">
                                        {tier.label} {tier.price > 0 ? `— $${tier.price}` : "— Free"}
                                    </p>
                                    <p className="text-xs text-amber-700">{tier.description}</p>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                    <button
                                        type="button"
                                        onClick={() => handleQtyChange(tier.key, -1)}
                                        className="w-8 h-8 rounded-full border border-amber-300 text-amber-900 font-bold hover:bg-amber-100 transition"
                                        aria-label={`Decrease ${tier.label} quantity`}
                                    >
                                        −
                                    </button>
                                    <span className="w-6 text-center font-semibold text-amber-900">{form[tier.key]}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleQtyChange(tier.key, 1)}
                                        className="w-8 h-8 rounded-full border border-amber-300 text-amber-900 font-bold hover:bg-amber-100 transition"
                                        aria-label={`Increase ${tier.label} quantity`}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mb-6 flex items-center justify-between border-t border-amber-200 pt-4">
                        <span className="font-semibold text-amber-900">Total</span>
                        <span className="text-xl font-bold text-amber-900">${total}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                        <div>
                            <label
                                htmlFor="firstName"
                                className="block text-sm font-medium text-amber-900 mb-2"
                            >
                                First Name
                            </label>
                            <input
                                type="text"
                                name="firstName"
                                id="firstName"
                                onChange={handleTextChange}
                                value={form.firstName}
                                className="w-full border border-amber-300 rounded-md p-2 text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                                placeholder="John"
                            />
                            {errors.firstName && (
                                <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="lastName"
                                className="block text-sm font-medium text-amber-900 mb-2"
                            >
                                Last Name
                            </label>
                            <input
                                type="text"
                                name="lastName"
                                id="lastName"
                                onChange={handleTextChange}
                                value={form.lastName}
                                className="w-full border border-amber-300 rounded-md p-2 text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                                placeholder="Doe"
                            />
                            {errors.lastName && (
                                <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>
                            )}
                        </div>
                    </div>

                    <div className="mb-5">
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-amber-900 mb-2"
                        >
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            onChange={handleTextChange}
                            value={form.email}
                            className="w-full border border-amber-300 rounded-md p-2 text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                            placeholder="johndoe@me.com"
                        />
                        {errors.email && (
                            <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                        )}
                    </div>

                    {submitError && (
                        <p className="text-red-600 text-sm mb-4">{submitError}</p>
                    )}

                    <div className="mt-2">
                        <button
                            type="submit"
                            className="bg-wonderleaf hover:bg-green-700 text-white font-medium rounded-md py-2 px-4 transition-all duration-200"
                        >
                            Proceed with Payment
                        </button>
                    </div>
                </>
            )}

            {clientSecret && (
                <div className="mt-4">
                    <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
                        <EmbeddedCheckout />
                    </EmbeddedCheckoutProvider>
                </div>
            )}
        </form>
    )
}
