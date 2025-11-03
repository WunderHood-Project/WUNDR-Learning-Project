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
      <main className="bg-wonderbg min-h-screen pb-16">
        {/* Intro Text + CARDS */}
        <section className="py-8 md:py-16 max-w-6xl mx-auto px-4">
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
                  href="/partnership"
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
      </main>
    </div>
  );
}