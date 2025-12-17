'use client';

import Link from "next/link";
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import GradientBanner from '@/components/ui/GradientBanner';
import { VolunteerBadge, PartnershipBadge, DonationBadge } from '@/components/ui/BadgedIcons';

export default function GetInvolved() {
  return (
    <div>
      {/* HEADER */}
      <GradientBanner
        size="lg"
        from="from-wondergreen"
        to="to-wonderleaf"
        title="Get Involved with WonderHood"
        subtitle={
          <>
            Join our community and help create meaningful learning
            <br className="hidden sm:block" />
            experiences for homeschooling families
          </>
        }
      />

      {/* MAIN CONTENT */}
      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 break-words [text-wrap:balance]">
      {/* <main className="bg-wonderbg min-h-screen pb-16"> */}
        {/* Intro Text + CARDS */}
        {/* <p className="text-base sm:text-lg leading-relaxed text-center max-w-3xl mx-auto text-gray-700 mb-12 sm:mb-16">
          There are many ways to support and participate in our mission to empower families through connection, creativity, and community-based learning. Choose the path that resonates with you!
        </p> */}



        {/* <section className="mb-14 sm:mb-16">
          <div className="mb-6 sm:mb-8 text-center">
            <h2 className="mb-2 sm:mb-3 text-2xl sm:text-3xl md:text-4xl font-bold text-wondergreen">Get Involved</h2>
            <div className="mx-auto h-1 w-20 sm:w-24 rounded-full bg-gradient-to-r from-wonderorange to-wonderleaf" />
          </div>

          <div className="grid gap-5 sm:gap-6 md:grid-cols-3 items-stretch">
            {/* Volunteer */}
            {/* <Link href="/volunteer" className="group block h-full">
              <div className="relative h-full cursor-pointer overflow-hidden rounded-xl border-2 border-wonderleaf/20 bg-white p-5 sm:p-6 pb-14 sm:pb-16 shadow-lg transition-colors duration-300 hover:border-wonderleaf flex flex-col">
                <div className="mb-3 sm:mb-4">
                  <VolunteerBadge className="w-12 h-12 sm:w-14 sm:h-14" />
                </div>
                <h3 className="mb-1.5 sm:mb-2 text-lg sm:text-xl font-bold text-wondergreen">Adult Volunteers</h3>
                <p className="text-sm sm:text-base text-gray-700">
                  Help organize events, support programs, or co-lead activities.
                </p>
                <p className="mt-3 flex items-center gap-1 text-[12px] sm:text-xs text-wondergreen/80">
                  {/* <span className='mb-4' aria-hidden="true">🛡️</span> */}
                  {/* 🛡️ All adult volunteers complete a standard screening.
                </p>
                <div className="mt-auto" />
                <span className="pointer-events-none absolute bottom-3 sm:bottom-4 left-0 right-0 mx-auto select-none px-4 text-center text-sm sm:text-base text-gray-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  Thank you for bringing our community to life!
                </span>
              </div>
            </Link> */}

            {/* Partnership */}
            {/* <Link href="/get-involved/partnership" className="group block h-full">
              <div className="relative h-full cursor-pointer overflow-hidden rounded-xl border-2 border-wonderorange/40 bg-white p-5 sm:p-6 pb-14 sm:pb-16 shadow-lg transition-colors duration-300 hover:border-wonderorange flex flex-col">
                <div className="mb-3 sm:mb-4">
                  <PartnershipBadge className="w-12 h-12 sm:w-14 sm:h-14" />
                </div>
                <h3 className="mb-1.5 sm:mb-2 text-lg sm:text-xl font-bold text-wondergreen">Partnership</h3>
                <p className="text-sm sm:text-base text-gray-700">
                    Museums, parks, youth organizations, studios&mdash;let&rsquo;s team up to create meaningful programs together. We welcome shared space, guest instructors, or pilot programs(?)/projects.
                </p>

                <div className="mt-auto" />
                <span className="pointer-events-none absolute bottom-3 sm:bottom-4 left-0 right-0 mx-auto select-none px-4 text-center text-sm sm:text-base text-gray-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  Together we can do so much more!
                </span>
              </div>
            </Link> */}

            {/* Donate */}
            {/* <Link href="/donate" className="group block h-full">
              <div className="relative h-full cursor-pointer overflow-hidden rounded-xl border-2 border-wondergreen/20 bg-white p-5 sm:p-6 pb-14 sm:pb-16 shadow-lg transition-colors duration-300 hover:border-wondergreen flex flex-col">
                <div className="mb-3 sm:mb-4">
                  <DonationBadge className="w-12 h-12 sm:w-14 sm:h-14" />
                </div>
                <h3 className="mb-1.5 sm:mb-2 text-lg sm:text-xl font-bold text-wondergreen">Donate</h3>
                <p className="mb-2 sm:mb-3 text-sm sm:text-base text-gray-700">
                  Support scholarships, gear, and safety training. Your gift is tax-deductible.
                </p>
                <span className="font-semibold text-wonderorange underline transition-colors duration-300 hover:text-wondergreen">
                  Support WonderHood &rarr;
                </span>
                <div className="mt-auto" />
                <span className="pointer-events-none absolute bottom-3 sm:bottom-4 left-0 right-0 mx-auto select-none px-4 text-center text-sm sm:text-base text-gray-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  Every gift counts&mdash;thank you for supporting WonderHood!
                </span>
              </div>
            </Link>
          </div>
        </section> */}

        <section className="py-8 md:py-16 max-w-6xl mx-auto px-4">
          {/* <div className="mb-6 sm:mb-8 text-center">
            <h2 className="mb-2 sm:mb-3 text-2xl sm:text-3xl md:text-4xl font-bold text-wondergreen">Get Involved</h2>
            <div className="mx-auto h-1 w-20 sm:w-24 rounded-full bg-gradient-to-r from-wonderorange to-wonderleaf" />
          </div> */}

          <p className="text-base sm:text-lg leading-relaxed text-center max-w-3xl mx-auto text-gray-700 mb-12 sm:mb-16">
            There are many ways to support and participate in our mission to empower families through connection, creativity, and community-based learning. Choose the path that resonates with you!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* Volunteer Card */}
            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col">
              {/* Color bar on top */}
              <div className="h-1 bg-gradient-to-r from-wondergreen to-wonderleaf"></div>

              {/* Card content */}
              <div className="p-6 md:p-8 flex flex-col h-full">
                {/* Icon */}
                {/* <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-wondergreen to-wonderleaf flex items-center justify-center mb-4 md:mb-5 shadow-lg text-2xl md:text-3xl">
                  👤
                </div> */}
                <VolunteerBadge className="w-14 h-14 md:w-16 md:h-16 mb-4 md:mb-5" />

                {/* Title */}
                <h3 className="text-xl md:text-2xl font-bold text-wondergreen mb-3">Volunteer</h3>

                {/* Description */}
                <p className="text-sm md:text-base text-gray-700 mb-4 leading-relaxed">
                  Share your skills and passions by leading clubs, assisting with events, or mentoring families.
                </p>

                {/* Checklist */}
                <ul className="space-y-2 mb-6 flex-1">
                  <li className="flex items-start gap-2 text-sm md:text-base text-gray-700">
                    <span className="text-wondergreen font-bold mt-0.5 flex-shrink-0">✓</span>
                    <span>Lead specialized clubs</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm md:text-base text-gray-700">
                    <span className="text-wondergreen font-bold mt-0.5 flex-shrink-0">✓</span>
                    <span>Assist at events</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm md:text-base text-gray-700">
                    <span className="text-wondergreen font-bold mt-0.5 flex-shrink-0">✓</span>
                    <span>Mentor families</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm md:text-base text-gray-700">
                    <span className="text-wondergreen font-bold mt-0.5 flex-shrink-0">✓</span>
                    <span>Support activities</span>
                  </li>
                </ul>

                {/* Button */}
                <Link
                  href="/volunteer"
                  className="w-full py-3 px-4 rounded-full text-base font-semibold text-white text-center bg-gradient-to-r from-wondergreen to-wonderleaf hover:from-wonderleaf hover:to-wondergreen transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
                >
                  Become a Volunteer
                </Link>
              </div>
            </div>

            {/* Partnership Card */}
            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col">
              {/* Color bar on top */}
              <div className="h-1 bg-gradient-to-r from-wonderorange to-wondersun"></div>

              {/* Card content */}
              <div className="p-6 md:p-8 flex flex-col h-full">
                {/* Icon */}
                {/* <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-wonderorange to-wondersun flex items-center justify-center mb-4 md:mb-5 shadow-lg text-2xl md:text-3xl">
                  🤝
                </div> */}
                <PartnershipBadge className="w-14 h-14 md:w-16 md:h-16 mb-4 md:mb-5" />

                {/* Title */}
                <h3 className="text-xl md:text-2xl font-bold text-wondergreen mb-3">Partnership</h3>

                {/* Description */}
                <p className="text-sm md:text-base text-gray-700 mb-4 leading-relaxed">
                  Partner with us as an organization to provide resources, venues, or educational opportunities.
                </p>

                {/* Checklist */}
                <ul className="space-y-2 mb-6 flex-1">
                  <li className="flex items-start gap-2 text-sm md:text-base text-gray-700">
                    <span className="text-wondergreen font-bold mt-0.5 flex-shrink-0">✓</span>
                    <span>Program collaboration</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm md:text-base text-gray-700">
                    <span className="text-wondergreen font-bold mt-0.5 flex-shrink-0">✓</span>
                    <span>Venue partnerships</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm md:text-base text-gray-700">
                    <span className="text-wondergreen font-bold mt-0.5 flex-shrink-0">✓</span>
                    <span>Resource sharing</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm md:text-base text-gray-700">
                    <span className="text-wondergreen font-bold mt-0.5 flex-shrink-0">✓</span>
                    <span>Guest speaking</span>
                  </li>
                </ul>

                {/* Button */}
                <Link
                  href="/get-involved/partnership"
                  className="w-full py-3 px-4 rounded-full text-base font-semibold text-white text-center bg-gradient-to-r from-wonderorange to-wondersun hover:from-wondersun hover:to-wonderorange transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
                >
                  Explore Partnership
                </Link>
              </div>
            </div>

            {/* Donate Card */}
            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col">
              {/* Color bar on top */}
              <div className="h-1 bg-gradient-to-r from-wondergreen to-wonderleaf"></div>

              {/* Card content */}
              <div className="p-6 md:p-8 flex flex-col h-full">
                {/* Icon */}
                {/* <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-wondergreen to-wonderleaf flex items-center justify-center mb-4 md:mb-5 shadow-lg text-2xl md:text-3xl">
                  💝
                </div> */}
                <DonationBadge className="w-14 h-14 md:w-16 md:h-16 mb-4 md:mb-5" />

                {/* Title */}
                <h3 className="text-xl md:text-2xl font-bold text-wondergreen mb-3">Make a Donation</h3>

                {/* Description */}
                <p className="text-sm md:text-base text-gray-700 mb-4 leading-relaxed">
                  Support our mission with a financial contribution to help us reach more families and expand programs.
                </p>

                {/* Checklist */}
                <ul className="space-y-2 mb-6 flex-1">
                  <li className="flex items-start gap-2 text-sm md:text-base text-gray-700">
                    <span className="text-wondergreen font-bold mt-0.5 flex-shrink-0">✓</span>
                    <span>Program development</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm md:text-base text-gray-700">
                    <span className="text-wondergreen font-bold mt-0.5 flex-shrink-0">✓</span>
                    <span>Family scholarships</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm md:text-base text-gray-700">
                    <span className="text-wondergreen font-bold mt-0.5 flex-shrink-0">✓</span>
                    <span>Equipment & materials</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm md:text-base text-gray-700">
                    <span className="text-wondergreen font-bold mt-0.5 flex-shrink-0">✓</span>
                    <span>New club creation</span>
                  </li>
                </ul>

                {/* Button */}
                <Link
                  href="/donate"
                  className="w-full py-3 px-4 rounded-full text-base font-semibold text-white text-center bg-gradient-to-r from-wondergreen to-wonderleaf hover:from-wonderleaf hover:to-wondergreen transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
                >
                  Donate Now
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Volunteer Hours */}
        <section className="mb-8 sm:mb-10">
          <div className="group rounded-xl border-2 border-wondergreen/20 bg-white p-4 sm:p-6 shadow-lg">
            <div className="mb-2 flex items-center gap-3 sm:gap-4">
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-gradient-to-br from-wondergreen to-wonderleaf transition-transform duration-300 group-hover:scale-110">
                <span className="text-lg sm:text-xl font-bold text-white">🌟</span>
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-wondergreen">
                Become a WonderTeen Volunteer (Ages 12-17)
              </h3>
            </div>
            <p className="text-sm sm:text-base md:max-w-4xl text-gray-700">
                Earn service hours, develop leadership skills, and make a difference. All under staff supervision, WonderTeen volunteers help at events, assist instructors, and support younger learners.
                <span className="block mt-2">Want to join? Email us at {" "}
                  <a
                    href="mailto:wonderhood.project@gmail.com"
                    rel="noopener noreferrer"
                    className="underline transition-colors duration-200 text-wonderleaf hover:text-wondergreen"
                  >
                    wonderhood.project@gmail.com
                  </a>
                  .
                </span>
            </p>

            {/* mini safety footnote */}
            {/* <div className="mt-3 flex items-start gap-2 rounded-md border border-wondergreen/15 bg-wondergreen/5 px-3 py-2 text-[12px] sm:text-[13px] leading-snug text-wondergreen">
              <span aria-hidden="true">🛡️</span>
              <span>
                <strong>Safety-first:</strong> adult volunteers are screened; programs are supervised; we teach healthy
                habits and model respectful communication.
              </span>
            </div> */}
          </div>
        </section>
      </main>
    </div>
  );
}
