import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm"

export default function PaymentPage() {

    const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

    return (
        <Elements stripe={stripePromise}>
            <CheckoutForm />
        </Elements>
    )
}