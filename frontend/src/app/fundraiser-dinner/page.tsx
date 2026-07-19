import { Suspense } from "react";
import FundraiserDinnerPaymentPage from "../../components/fundraiserDinner/FundraiserDinner";

export default function FundraiserDinner() {
    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-wonderbg via-white to-wondersun/20">
                <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                        Fundraiser Dinner
                    </h1>
                    <p className="mt-4 text-lg leading-6 text-gray-600 sm:text-xl sm:leading-7 md:text-2xl md:leading-8">
                        Join us for an evening of food, fun, and fundraising!
                    </p>
                </div>
                <div className="flex flex-col items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
                    <Suspense>
                        <FundraiserDinnerPaymentPage />
                    </Suspense>
                </div>
            </div>
        </>
    )

}