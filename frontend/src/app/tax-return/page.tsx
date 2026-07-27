import { Suspense } from "react";
import TaxReturnWaiver from "@/components/TaxReturn/TaxReturnPolicy";

export default function TaxReturnAcknolwedgement() {

    return (
        <>
            <Suspense>
                <TaxReturnWaiver />
            </Suspense>
        </>
    )
}