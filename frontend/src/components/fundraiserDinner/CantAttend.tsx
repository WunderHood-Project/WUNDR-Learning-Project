import Link from "next/link";

export default function CantAttend() {
    return (
        <section className="py-8 md:py-16 max-w-4xl mx-auto px-4">
            <div className="mb-6 sm:mb-8 text-center">
                <h2 className="mb-2 sm:mb-3 text-2xl sm:text-3xl md:text-4xl font-bold text-wondergreen">
                    Can&rsquo;t Attend?
                </h2>
                <div className="mx-auto h-1 w-20 sm:w-24 rounded-full bg-gradient-to-r from-wonderorange to-wonderleaf" />
            </div>

            <p className="text-base sm:text-lg leading-relaxed text-center max-w-3xl mx-auto text-gray-700 mb-8">
                You can still support WonderHood Project by making a donation, becoming an event
                sponsor, contributing an item to the silent auction, donating food or supplies, or
                volunteering.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
                <Link
                    href="/donate"
                    className="w-full sm:w-auto text-center py-3 px-6 rounded-full text-base font-semibold text-white bg-gradient-to-r from-wondergreen to-wonderleaf hover:from-wonderleaf hover:to-wondergreen transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
                >
                    Make a Donation
                </Link>
                <Link
                    href="/donate?type=Sponsorship"
                    className="w-full sm:w-auto text-center py-3 px-6 rounded-full text-base font-semibold text-white bg-gradient-to-r from-wonderorange to-wondersun hover:from-wondersun hover:to-wonderorange transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
                >
                    Become a Sponsor
                </Link>
                <Link
                    href="/get-involved"
                    className="w-full sm:w-auto text-center py-3 px-6 rounded-full text-base font-semibold text-wondergreen border-2 border-wondergreen hover:bg-wondergreen/5 transition-all duration-200 active:scale-95"
                >
                    Get Involved
                </Link>
            </div>

            <div className="rounded-2xl border-2 border-wonderleaf/20 bg-white p-6 md:p-8 shadow-lg text-center">
                <h3 className="text-xl md:text-2xl font-bold text-wondergreen mb-3">Questions?</h3>
                <p className="text-sm md:text-base text-gray-700 mb-1">Please contact:</p>
                <p className="text-sm md:text-base text-gray-700 font-semibold">WonderHood team</p>
                <a
                    href="mailto:info@whproject.org"
                    rel="noopener noreferrer"
                    className="underline transition-colors duration-200 text-wonderleaf hover:text-wondergreen"
                >
                    info@whproject.org
                </a>
                <p className="text-sm md:text-base text-gray-700 font-semibold mt-4">WonderHood Project</p>
                <a
                    href="https://whproject.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline transition-colors duration-200 text-wonderleaf hover:text-wondergreen"
                >
                    https://whproject.org/
                </a>
            </div>
        </section>
    );
}
