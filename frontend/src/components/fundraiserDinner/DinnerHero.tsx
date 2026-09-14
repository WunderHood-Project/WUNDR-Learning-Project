import Link from "next/link";
import GradientBanner from "@/components/ui/GradientBanner";

export default function DinnerHero() {
    return (
        <GradientBanner
            size="lg"
            from="from-wondergreen"
            to="to-wonderleaf"
            title="The Heart of Ranching Fundraising Dinner"
            subtitle={
                <>
                    Join us for a special evening supporting The Heart of Ranching—WonderHood
                    Project&rsquo;s free, hands-on educational program where local homeschool
                    students experience ranch life, learn horsemanship, agriculture, gardening,
                    homesteading, practical life skills, and much more.
                </>
            }
            cta={
                <div className="flex flex-col items-center gap-4">
                    <div className="text-center text-white font-semibold text-base sm:text-lg">
                        <p>Saturday, October 17, 2026</p>
                        <p>5:00–8:00 PM</p>
                        <p>Historic Pines Ranch</p>
                    </div>
                    <Link
                        href="/fundraiser-dinner/tickets"
                        className="inline-block rounded-full bg-white px-8 py-3 font-semibold text-wondergreen shadow-md transition hover:shadow-lg active:scale-95"
                    >
                        Get Your Tickets
                    </Link>
                </div>
            }
        />
    );
}
