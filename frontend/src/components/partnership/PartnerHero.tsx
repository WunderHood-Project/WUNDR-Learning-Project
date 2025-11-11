"use client";

import GradientBanner from "@/components/ui/GradientBanner";

export default function PartnerHero() {
    return (
        <GradientBanner
        size="lg"
        className="pt-7 md:pt-12 pb-3 md:pb-6"
        title={<>Partner with WonderHood</>}
        subtitle={
            <span className="block mx-auto max-w-[30ch] sm:max-w-[42ch] md:max-w-4xl
                            text-[15px] sm:text-base md:text-xl
                            leading-[1.35] md:leading-snug">
            Help youth ages 10-18 — homeschool and online learners — learn, explore,
            and thrive through shared spaces, instructors, and sponsorships.
            </span>
        }
        cta={
            <a
            href="#apply"
            className="inline-flex -mt-1.5 md:-mt-2 rounded-xl bg-wondersun text-amber-950 px-5 py-2.5
                        text-sm md:text-base font-semibold shadow-md hover:brightness-95
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/70"
            >
                Become a Partner
            </a>
        }
        />
    );
}
