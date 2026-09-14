import { Suspense } from "react";
import PurchaseTickets from "../../../components/fundraiserDinner/PurchaseTickets";

export default function FundraiserDinnerTickets() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-wonderbg via-white to-wondersun/20">
            <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl text-center">
                    Purchase Tickets
                </h1>
                <p className="mt-4 text-lg leading-6 text-gray-600 sm:text-xl sm:leading-7 md:text-2xl md:leading-8 text-center">
                    The Heart of Ranching Fundraising Dinner
                </p>
            </div>
            <div className="flex flex-col items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
                <Suspense>
                    <PurchaseTickets />
                </Suspense>
            </div>
        </div>
    )
}
