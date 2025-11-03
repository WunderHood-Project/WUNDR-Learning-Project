// We want to create the fields for the payment form
// We want to be able to submit a payment
// We should make a call to the database to fulfill/record the payment

import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useMemo } from "react";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export function EmbeddedCheckoutWrapper({ clientSecret }: { clientSecret: string }) {
    const options = useMemo(() => ({ clientSecret }), [clientSecret]);

    return (
        <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
            <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
    );
}