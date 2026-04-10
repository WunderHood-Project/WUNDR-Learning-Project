"use client";

import Image from "next/image";
import { FaUser } from "react-icons/fa";

type PersonGroup = "Board of Directors"
// | "Leadership & Advisors";

type Person = {
    name: string;
    title: string;
    group: PersonGroup;
    bio?: string;
    imageSrc?: string;
};

const PEOPLE: Person[] = [
// ----- Board of Directors -----
{
    name: "Dmitriy Muzhzhavlev",
    title: "Board Chair",
    group: "Board of Directors",
    bio: "Provides strategic guidance and governance oversight for WonderHood.",
    imageSrc: "/our_foto/Dmitriy.png",
},
{
    name: "Anastasiia Muzhzhavlev",
    title: "Founder, Executive Director & Frontend Developer",
    group: "Board of Directors",
    bio: "Leads WonderHood’s vision, programs, and web platform so families have a clear and friendly experience.",
    imageSrc: "/our_foto/Ana.png",
},
{
    name: "Ekaterina Golin",
    title: "Chief Financial Officer (CFO)",
    group: "Board of Directors",
    bio: "Oversees budgeting, reporting, and donor stewardship to keep programs sustainable and accessible.",
    imageSrc: "/our_foto/Kate.png",
},
{
    name: "Evgeny Aleksandrushkin",
    title: "Treasurer",
    group: "Board of Directors",
    bio: "Supports financial planning and helps ensure responsible use of WonderHood’s funds.",
    imageSrc: "/our_foto/Jenya.png",
},
{
    name: "James Kilpatrick",
    title: "Board Member",
    group: "Board of Directors",
    bio: "Offers community perspective and input on program direction and youth needs.",
    imageSrc: "/our_foto/James.png",
},
{
    name: "Heather Wingfeld",
    title: "Parent Advisor",
    group: "Board of Directors",
    bio: "Supports governance, documentation, and brings the homeschool parent perspective to planning.",
    // imageSrc: "/our_foto/Heather.png",
},

// ----- Leadership & Advisors / Founding Tech Team -----
// {
//     name: "Andrew S. Lizon",
//     title: "Founding Technical Lead, Web Platform",
//     group: "Leadership & Advisors",
//     bio: "Part of the founding tech team behind WonderHood, supporting the website, registration tools, and technical infrastructure.",
//     // imageSrc: "/our_foto/Andrew.png",
// },
// {
//     name: "Erika Brandon",
//     title: "Founding Frontend Engineer & Creative Partner",
//     group: "Leadership & Advisors",
//     bio: "Helps lead front-end development, user experience, and website storytelling so WonderHood feels warm, clear, and inspiring for families.",
//     // imageSrc: "/our_foto/Erika.png",
// },
// {
//     name: "Joshua Maxey",
//     title: "Founding Backend Engineer & Systems Advisor",
//     group: "Leadership & Advisors",
//     bio: "Supports backend architecture, APIs, and deployment so the platform stays reliable and secure.",
//     // imageSrc: "/our_foto/Joshua.png",
// },
];

const GROUPS: PersonGroup[] = ["Board of Directors"];

export default function LeadershipSection() {
    return (
        <section className="mb-14 sm:mb-16">
            <div className="mx-auto max-w-7xl rounded-2xl border border-wonderleaf/25 bg-white/70 p-6 sm:p-8 shadow-lg backdrop-blur-sm">
                {/* Header */}
                <div className="mb-4 sm:mb-5 text-center">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-wondergreen [text-wrap:balance]">
                        Governance &amp; Leadership
                    </h2>
                    <p className="mt-2 text-sm sm:text-base md:text-lg text-gray-700 max-w-3xl mx-auto">
                        WonderHood Project is led by a volunteer board of directors and a
                        small founding team who care deeply about youth and community. Together, we ensure every program is
                        safe, supportive, and true to our mission.
                    </p>
                </div>

                <div className="space-y-10">
                    {GROUPS.map((group) => {
                        const members = PEOPLE.filter((p) => p.group === group);
                        if (!members.length) return null;

                        return (
                        <div key={group}>
                            {/* group subtitle*/}
                            <h3 className="text-lg sm:text-xl font-semibold text-wondergreen mb-4 sm:mb-5">
                            {group}
                            </h3>

                            {/* grid of cards */}
                            <div className="grid gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {members.map((person) => (
                                <article
                                key={person.name}
                                className="flex flex-col items-center rounded-2xl border border-wonderleaf/25 bg-white/80 p-5 sm:p-6 text-center shadow-sm hover:shadow-md transition-shadow"
                                >
                                {/* avatar or? */}
                                <div className="relative h-24 w-24 sm:h-28 sm:w-28 mb-3 sm:mb-4">
                                    {person.imageSrc ? (
                                    <Image
                                        src={person.imageSrc}
                                        alt={person.name}
                                        fill
                                        sizes="96px"
                                        className="rounded-full object-cover border-2 border-white shadow-md bg-wonderbg/50"
                                    />
                                    ) : (
                                        <div
                                            className="h-full w-full rounded-full flex items-center justify-center border-2 border-dashed border-wonderleaf/70 bg-wonderbg/60 text-wonderleaf text-2xl sm:text-3xl font-bold shadow-md"
                                            aria-hidden="true"
                                        >
                                            <FaUser className="h-1/2 w-1/2"/>
                                        </div>
                                    )}
                                </div>

                                <h4 className="text-base sm:text-lg font-semibold text-wondergreen">
                                    {person.name}
                                </h4>
                                <p className="mt-1 text-xs sm:text-sm font-medium text-wonderorange">
                                    {person.title}
                                </p>
                                {person.bio && (
                                    <p className="mt-2 text-xs sm:text-sm text-gray-700 leading-relaxed">
                                    {person.bio}
                                    </p>
                                )}
                                </article>
                            ))}
                        </div>
                    </div>
                    );
                })}
                </div>

                <p className="mt-6 text-[11px] sm:text-xs text-gray-500 text-center">
                    Board members serve without compensation. Their time
                    and expertise help keep WonderHood accessible and focused on youth
                    wellbeing.
                </p>
            </div>
        </section>
    );
}
