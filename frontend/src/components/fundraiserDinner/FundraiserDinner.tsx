"use client"

import { loadStripe } from "@stripe/stripe-js";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { EmbeddedCheckout } from "@stripe/react-stripe-js";
import { EmbeddedCheckoutProvider } from "@stripe/react-stripe-js";
import { determineEnv } from "../../../utils/api";
import { CreateDinnerPaymentPayload, DinnerPaymentFormErrors } from '../../types/fundraiserDinner'
import { useUser } from "../../../hooks/useUser";
import { useModal } from "@/context/modal";
import LoginModal from "../login/LoginModal";
import DinnerAuthPrompt from "./DinnerAuthPrompt";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
const WONDERHOOD_URL = determineEnv()
const TICKET_PRICE = 25
const initialPaymentForm = (): CreateDinnerPaymentPayload => ({
    email: ""
})

export default function FundraiserDinnerPaymentPage() {

    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [toast, setToast] = useState<string | null>(null);
    const searchParams = useSearchParams()
    const { user } = useUser()
    const { setModalContent, closeModal } = useModal()
    const router = useRouter()
    const [form, setForm] = useState<CreateDinnerPaymentPayload>(() => initialPaymentForm())
    const [errors, setErrors] = useState<DinnerPaymentFormErrors>({})

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
    }

    useEffect(() => {
        const success = searchParams.get('success');
        if (success === 'dinner') setToast('Fundraiser dinner ticket purchased successfully!');
        if (success) {
            router.replace('/fundraiser-dinner', { scroll: false });
            const timer = setTimeout(() => setToast(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [searchParams, router]);

    const options = useMemo(() => ({ clientSecret: clientSecret! }), [clientSecret])

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
            throw new Error(`Failed to create payment session: ${response.statusText}`);
        }

        const data: dinnerPaymentSessionResponse = await response.json();
        setClientSecret(data["client-secret"]);
    }

    const createSession = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrors({})
        const newErrors: DinnerPaymentFormErrors = {}

        // Guests have no account to link the ticket to, so we need an email for their receipt
        if (!user && !form.email) {
            newErrors.email = "Email is required so we can send your receipt"
        }

        // Return if there are validation errors
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        if (!user) {
            setModalContent(
                <DinnerAuthPrompt
                    onClose={closeModal}
                    onLogin={() => setModalContent(<LoginModal />)}
                    onGuest={() => {
                        closeModal()
                        doCheckout()
                    }}
                />
            )
            return
        }

        await doCheckout()
    }

    return (
        <form
            onSubmit={createSession}
            className="bg-amber-50 border border-amber-200 rounded-2xl shadow-sm p-6 w-full max-w-md mx-auto mt-8"
        >

            {toast && (
                <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-xl bg-wondergreen px-6 py-3 text-white shadow-lg animate-fade-in">
                    <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm font-semibold">{toast}</span>
                    <button onClick={() => setToast(null)} className="ml-2 text-white/70 hover:text-white text-lg leading-none">×</button>
                </div>
            )}
            <h2 className="text-lg font-semibold text-amber-900 mb-3">
                Purchase a fundraiser dinner ticket
            </h2>
            <p className="text-sm text-amber-800 mb-6">
                Your support helps us continue our mission. Please enter your info below.
            </p>

            {/* Ticket price is fixed server-side */}
            <div className="mb-5">
                <span className="block text-sm font-medium text-amber-900 mb-2">
                    Ticket Price
                </span>
                <p className="text-amber-900 font-semibold">${TICKET_PRICE}</p>
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
                    onChange={handleChange}
                    defaultValue={form.email}
                    className="w-40 border border-amber-300 rounded-md p-2 text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                    placeholder="johndoe@me.com"
                />
                {errors.email && (
                    <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                )}

            </div>

            {/* Submit or Checkout */}
            <div className="mt-6">
                {!clientSecret ? (
                    <button
                        type="submit"
                        className="bg-wonderleaf hover:bg-green-700 text-white font-medium rounded-md py-2 px-4 transition-all duration-200"
                    >
                        Proceed with Payment
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
    )
}