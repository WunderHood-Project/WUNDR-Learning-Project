import { Suspense } from "react";
import PaymentPage from "@/components/Stripe/PaymentPage";


export default function Donate() {

    return (
        <Suspense>
            <PaymentPage />
        </Suspense>
    )
}
