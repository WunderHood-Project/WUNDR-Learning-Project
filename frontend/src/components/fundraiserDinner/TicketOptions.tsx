import Link from "next/link";
import { DINNER_TICKET_TIERS } from "@/types/fundraiserDinner";

export default function TicketOptions() {
    return (
        <section className="py-8 md:py-16 max-w-6xl mx-auto px-4">
            <div className="mb-6 sm:mb-8 text-center">
                <h2 className="mb-2 sm:mb-3 text-2xl sm:text-3xl md:text-4xl font-bold text-wondergreen">
                    Ticket Options
                </h2>
                <div className="mx-auto h-1 w-20 sm:w-24 rounded-full bg-gradient-to-r from-wonderorange to-wonderleaf" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 mb-10">
                {DINNER_TICKET_TIERS.map((tier) => (
                    <div
                        key={tier.key}
                        className="rounded-2xl border-2 border-wonderleaf/20 bg-white p-5 md:p-6 shadow-lg flex flex-col"
                    >
                        <h3 className="text-lg md:text-xl font-bold text-wondergreen mb-1">{tier.label}</h3>
                        <p className="text-2xl font-extrabold text-wonderorange mb-3">
                            {tier.price > 0 ? `$${tier.price}` : "Free"}
                        </p>
                        <p className="text-sm text-gray-700">{tier.description}</p>
                    </div>
                ))}
            </div>

            <div className="text-center">
                <Link
                    href="/fundraiser-dinner/tickets"
                    className="inline-block py-3 px-8 rounded-full text-base font-semibold text-white text-center bg-gradient-to-r from-wondergreen to-wonderleaf hover:from-wonderleaf hover:to-wondergreen transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
                >
                    Purchase Tickets
                </Link>
            </div>
        </section>
    );
}
