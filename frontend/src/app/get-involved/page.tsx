'use client';

import Link from "next/link";
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import GradientBanner from '@/components/ui/GradientBanner';

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
        // align="center"                    
        // showOrbs={true}                  
      />

      {/* MAIN CONTENT */}
      <main className="bg-wonderbg min-h-screen pb-16">
        {/* Intro Text + CARDS */}
        <section className="py-8 md:py-12 max-w-7xl mx-auto px-4 md:px-8">
          <p
            className="
              text-[15px] leading-relaxed sm:text-lg sm:leading-8
              text-center
              max-w-[34ch] sm:max-w-4xl mx-auto
              text-gray-700
              mb-8 sm:mb-12
            "
          >
            {/* text for mob */}
            <span className="sm:hidden">
              There are many ways to get involved—support families through
              connection, creativity, and community learning. Pick the path
              that fits you.
            </span>

            {/* full text plashed + desktop */}
            <span className="hidden sm:inline">
              There are many ways to support and participate in our mission to
              empower families through connection, creativity, and
              community-based learning. Choose the path that resonates with you!
            </span>
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Volunteer */}
            <div className="group relative bg-white rounded-2xl shadow-xl p-8 flex flex-col items-start transition-all duration-300 hover:shadow-2xl hover:scale-[1.03] cursor-pointer overflow-hidden w-full">
              <div className="absolute left-0 top-0 h-2 w-full bg-wondergreen rounded-t-2xl scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left z-10" />
              <div className="flex items-center gap-4 mb-4">
                <span className="block w-16 h-16 rounded-full bg-wondergreen flex items-center justify-center text-3xl text-white shrink-0">🙋‍♀️</span>
                <h2 className="text-2xl font-bold text-wondergreen">Volunteer</h2>
              </div>
              <p className="text-base text-gray-700 mb-4">
                Share your skills and passions by leading clubs, assisting with events, or mentoring families.
              </p>
              <ul className="mb-4 space-y-1 text-base">
                <li className="flex items-center gap-2 text-gray-700"><span className="text-wondergreen">✔</span> Lead specialized clubs or workshops</li>
                <li className="flex items-center gap-2 text-gray-700"><span className="text-wondergreen">✔</span> Assist at community events</li>
                <li className="flex items-center gap-2 text-gray-700"><span className="text-wondergreen">✔</span> Mentor new homeschooling families</li>
                <li className="flex items-center gap-2 text-gray-700"><span className="text-wondergreen">✔</span> Help with outdoor activities</li>
                <li className="flex items-center gap-2 text-gray-700"><span className="text-wondergreen">✔</span> Support administrative tasks</li>
              </ul>
              <Link
                href="/volunteer"
                className="block w-full py-2 rounded-full text-lg font-bold text-white text-center
                           bg-gradient-to-r from-wondergreen to-wonderleaf shadow
                           hover:from-wonderleaf hover:to-wondergreen transition-colors"
              >
                Become a Volunteer
              </Link>
            </div>

            {/* Partnership */}
            <div className="group relative bg-white rounded-2xl shadow-xl p-8 flex flex-col items-start transition-all duration-300 hover:shadow-2xl hover:scale-[1.03] cursor-pointer overflow-hidden w-full">
              <div className="absolute left-0 top-0 h-2 w-full bg-gradient-to-r from-wonderorange to-wondersun rounded-t-2xl scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left z-10" />
              <div className="flex items-center gap-4 mb-4">
                <span className="block w-16 h-16 rounded-full bg-gradient-to-br from-wonderorange to-wondersun flex items-center justify-center text-3xl text-white shrink-0">🤝</span>
                <h2 className="text-2xl font-bold text-wondergreen">Partnership</h2>
              </div>
              <p className="text-base text-gray-700 mb-4">
                Partner with us as an organization to provide resources, venues, or educational opportunities.
              </p>
              <ul className="mb-4 space-y-1 text-base">
                <li className="flex items-center gap-2 text-gray-700"><span className="text-wondergreen">✔</span> Educational program collaboration</li>
                <li className="flex items-center gap-2 text-gray-700"><span className="text-wondergreen">✔</span> Venue partnerships for events</li>
                <li className="flex items-center gap-2 text-gray-700"><span className="text-wondergreen">✔</span> Resource and material sharing</li>
                <li className="flex items-center gap-2 text-gray-700"><span className="text-wondergreen">✔</span> Expert guest speaking</li>
                <li className="flex items-center gap-2 text-gray-700"><span className="text-wondergreen">✔</span> Community outreach programs</li>
              </ul>
              <Link
                href="/partnership"
                className="block w-full py-2 rounded-full text-lg font-bold text-white text-center
                           bg-gradient-to-r from-wonderorange to-wondersun shadow
                           hover:from-wondersun hover:to-wonderorange transition-colors"
              >
                Explore Partnership
              </Link>
            </div>

            {/* Make a Donation */}
            <div className="group relative bg-white rounded-2xl shadow-xl p-8 flex flex-col items-start transition-all duration-300 hover:shadow-2xl hover:scale-[1.03] cursor-pointer overflow-hidden w-full">
              <div className="absolute left-0 top-0 h-2 w-full bg-gradient-to-r from-wondergreen to-wonderleaf rounded-t-2xl scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left z-10" />
              <div className="flex items-center gap-4 mb-4">
                <span className="block w-16 h-16 rounded-full bg-gradient-to-br from-wondergreen to-wonderleaf flex items-center justify-center text-3xl text-white shrink-0">💝</span>
                <h2 className="text-2xl font-bold text-wondergreen">Make a Donation</h2>
              </div>
              <p className="text-base text-gray-700 mb-4">
                Support our mission with a financial contribution to help us reach more families and expand our programs.
              </p>
              <ul className="mb-4 space-y-1 text-base">
                <li className="flex items-center gap-2 text-gray-700"><span className="text-wondergreen">✔</span> Support program development</li>
                <li className="flex items-center gap-2 text-gray-700"><span className="text-wondergreen">✔</span> Provide scholarships for families</li>
                <li className="flex items-center gap-2 text-gray-700"><span className="text-wondergreen">✔</span> Fund equipment and materials</li>
                <li className="flex items-center gap-2 text-gray-700"><span className="text-wondergreen">✔</span> Enable new club creation</li>
                <li className="flex items-center gap-2 text-gray-700"><span className="text-wondergreen">✔</span> Support community events</li>
              </ul>
              <Link
                href="/support"
                className="block w-full py-2 rounded-full text-lg font-bold text-white text-center
                           bg-gradient-to-r from-wondergreen to-wonderleaf shadow
                           hover:from-wonderleaf hover:to-wondergreen transition-colors"
              >
                Donate Now
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
