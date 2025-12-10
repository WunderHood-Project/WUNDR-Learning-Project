import { Building2, GraduationCap, Handshake, Gift } from "lucide-react";

type Way = {
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    title: string;
    desc: string;
    bullets: string[];
};

const ways: Way[] = [
    {
        icon: Building2,
        title: "Venue Partner",
        // desc: "Host clubs and events at your location (gyms, libraries, parks, museums).",
        desc: "Offer your space for clubs and events, such as gyms, libraries, parks, musuems, or studios.",
        bullets: ["Access to space or discounted rentals", "Safety walkthrough", "Seasonal or flexible scheduling"],
    },
    {
        icon: Handshake,
        title: "Program Partner",
        // desc: "Provide instructors, workshops, and safety guidance.",
        desc: "Share your expertise through workshops, classes, and hands-on learning",
        bullets: ["Outdoor, arts, and STEM classes", "Certified instructors", "Co-branded programs"],
    },
    {
        icon: Gift,
        title: "Resource Sponsor",
        // desc: "Fund scholarships, gear, transportation, or meals.",
        desc: "Support learners through funding for scholarships, materials, transportation, or meals",
        bullets: ["Scholarships", "Equipment & support", "Bus/van support"],
    },
    {
        icon: GraduationCap,
        title: "Education Partner",
        // desc: "Co-create learning pathways, credits, and service hours.",
        desc: "Co-create learning pathways that help students grow through credits, mentorship, and real-world projects.",
        bullets: ["Credit/CE options", "Guest lectures", "Capstone or portfolio  projects"],
    },
];

export default function PartnerWays() {
    return (
        <section className="py-10 sm:py-12 lg:py-14">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header Benefits/FAQ */}
                <div className="flex flex-col items-center xl:items-start">
                    <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-extrabold text-wondergreen text-center xl:text-left">
                        {/* How We Can Partner */}
                        Ways We Can Work Together
                    </h2>
                    <div className="h-1 w-3/4 sm:w-[28%] bg-gradient-to-r from-wonderleaf to-wondergreen rounded-full shadow-md mb-6 sm:mb-8 mt-2 self-center xl:self-start" />
                </div>

                {/* Card grid */}
                <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
                    {ways.map(({ icon: Icon, title, desc, bullets }) => (
                        <li
                        key={title}
                        className="group relative overflow-hidden rounded-2xl bg-white ring-1 ring-wonderleaf/20 shadow-sm transition-all duration-300 ease-out hover:shadow-xl motion-safe:hover:-translate-y-1.5"
                        >
                        {/* top color stripe for consistency */}
                        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-wondergreen via-wonderleaf to-wondersun" />

                        <div className="p-5 sm:p-6 lg:p-6 min-h-[220px] flex flex-col">
                            <div className="flex items-center gap-3 sm:gap-4">
                                <span className="inline-grid place-items-center w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-wondersun/55 ring-1 ring-amber-400/30">
                                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-wondergreen" />
                                </span>
                                <h3 className="text-[16px] sm:text-lg lg:text-[19px] font-semibold text-wondergreen">
                                    {title}
                                </h3>
                            </div>

                            <p className="text-gray-700 mt-2 sm:mt-3 text-[15px] sm:text-base lg:text-[17px] leading-snug sm:leading-normal">
                                {desc}
                            </p>

                            <ul className="mt-3 sm:mt-4 grid gap-1.5 sm:gap-2 text-gray-700 text-[14px] sm:text-[15px] lg:text-[16px]">
                                {bullets.map((b) => (
                                    <li key={b} className="flex items-start gap-2">
                                        <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-wondergreen" />
                                        <span>{b}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* stretch it out so that the heights are equal */}
                            <div className="mt-auto" />
                        </div>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
