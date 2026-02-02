'use client'

import LeadershipSection from "./LeadershipSection";
import ContactUsSection from "../landing/contactUsSection";

export default function AboutPageContent() {
  return (
    <>
      {/* container */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 break-words [text-wrap:balance]">

        {/* Our Story */}
        <section className="relative mt-8 sm:mt-12 md:my-16">
          {/* decorative "spots" */}
          <div className="pointer-events-none absolute -right-10 top-6 hidden h-28 w-28 rounded-full bg-wonderorange/20 blur-3xl sm:block" />
          <div className="pointer-events-none absolute -left-8 bottom-6 hidden h-24 w-24 rounded-full bg-wonderleaf/25 blur-2xl sm:block" />

          <div className="relative z-10 rounded-2xl border border-wonderleaf/30 bg-gradient-to-br from-wondersun/25 via-wonderbg to-white/90 p-5 sm:p-6 md:p-8 shadow-lg">
            <div className="mb-4 sm:mb-5 flex items-center gap-3 sm:gap-4">
              <div className="h-8 w-2 sm:h-10 sm:w-3 rounded-full bg-gradient-to-b from-wonderleaf via-wondergreen to-wonderorange shadow" />
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-wondergreen">Our Story</h2>
            </div>

            <div className="rounded-xl border border-wonderleaf/20 bg-white/60 p-4 sm:p-5 md:p-6 backdrop-blur-sm">
              <div className="space-y-3 sm:space-y-4 text-left text-base sm:text-lg leading-7 text-gray-700 text-balance">
                <p>
                  WonderHood began in Westcliffe, Colorado, and is growing to serve homeschool and online learning families statewide.
                  Many homeschool and online learners love the flexibility of learning at home but still miss steady friendships and a sense of belonging.
                  In rural communities, it can be especially hard to meet peers regularly, and screen time can start to replace real-life connection.
                </p>
                <p>
                  We create welcoming spaces where students feel supported and truly seen.
                  Through outdoor adventures, creative arts, STEAM exploration, life skills, and service projects, kids make friends, discover new interests, and grow together.
                </p>
                <p className="text-sm text-gray-500">
                  *Our pilot programming is launching in{" "}
                  <span className="font-semibold text-wondergreen">Custer County</span>, with expansion guided by partnerships and community needs.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* <div className="grid gap-5 sm:gap-8 md:gap-10 md:grid-cols-2 auto-rows-fr items-stretch"> */}
          {/* Service Area */}
          {/* <article className="flex-1 flex-col rounded-2xl border border-wonderleaf/30 bg-gradient-to-br from-wondersun/20 via-wonderbg to-white/90 p-5 sm:p-6 md:p-8 shadow-lg">
            <div className="mb-4 flex items-center gap-3 sm:gap-4">
              <div className="h-8 w-2 sm:h-10 sm:w-3 rounded-full bg-gradient-to-b from-wonderleaf via-wondergreen to-wonderorange shadow" />
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-wondergreen">Service Area</h3>
            </div>

            <div className="flex-1 rounded-xl border border-wonderleaf/20 bg-white/60 p-4 sm:p-5 md:p-6 backdrop-blur-sm">
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base md:text-lg">
                WonderHood serves homeschool and online learners across Colorado. Our pilot programming is launching in{" "}
                <span className="font-semibold text-wondergreen">Custer County (Westcliffe and surrounding areas)</span>, with expansion guided by partnerships and community needs.
              </p>

            </div>
          </article> */}

          {/* Why Child Health */}
          {/* <article className="flex-1 flex-col rounded-2xl border border-wonderleaf/30 bg-gradient-to-br from-wondersun/20 via-wonderbg to-white/90 p-5 sm:p-6 md:p-8 shadow-lg">
            <div className="mb-4 flex items-center gap-3 sm:gap-4">
              <div className="h-8 w-2 sm:h-10 sm:w-3 rounded-full bg-gradient-to-b from-wonderorange via-wondersun to-wonderleaf shadow" />
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-wonderorange">Why Child Health?</h3>
            </div>

            <div className="flex-1 rounded-xl border border-wonderleaf/20 bg-white/60 p-4 sm:p-5 md:p-6 backdrop-blur-sm">
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base md:text-lg">
               We support child well-being through connection, movement, and purpose.
               Our programs help reduce isolation, encourage healthy outdoor activity, and create positive teen leadership and service opportunities.
               We also increase access to enrichment experiences and hands-on STEAM learning – especially important for rural and online-learning youth – so kids feel connected, confident, and supported.
              </p>
            </div>
          </article>
        </div> */}

        {/* Why We Do It */}
        <section className="mt-20 sm:mt-15 mb-10 sm:mb-12 md:mb-16">
          <div className="mb-6 sm:mb-7 text-center">
            <h2 className="mb-2 text-2xl sm:text-3xl md:text-4xl font-bold text-wondergreen [text-wrap:balance]">
                Why We Do What We Do
            </h2>
            <div className="mx-auto h-1 w-20 sm:w-24 rounded-full bg-gradient-to-r from-wonderleaf to-wonderorange" />
          </div>

          <div className="grid gap-5 sm:gap-8 md:gap-10 md:grid-cols-2 auto-rows-fr items-stretch">
            {/* 1 */}
            <article className="h-full flex flex-col rounded-xl p-4 sm:p-6 bg-gradient-to-br from-wonderleaf/10 to-wondergreen/5 border-l-4 border-wonderleaf">
              <h3 className="text-lg sm:text-2xl font-semibold text-wondergreen leading-tight">
                    Connection
              </h3>
              <p className="mt-2 sm:mt-3 text-gray-700 leading-relaxed text-sm sm:text-base md:text-lg">
                    Online learners can spend long stretches learning independently. We create spaces where friendships form naturally and kids can part of a community.
              </p>
              <div className="mt-auto" />
            </article>

            {/* 2 */}
            <article className="h-full flex flex-col rounded-xl p-4 sm:p-6 bg-gradient-to-br from-wonderorange/10 to-wondersun/5 border-l-4 border-wonderorange">
              <h3 className="text-lg sm:text-2xl font-semibold text-wonderorange leading-tight">
                    Skills for Life
              </h3>
              <p className="mt-2 sm:mt-3 text-gray-700 leading-relaxed text-sm sm:text-base md:text-lg">
                 Communication, teamwork, leadership, and resilience are practiced through real projects, shared challenges, and meaningful experiences.
              </p>
              <div className="mt-auto" />
            </article>

            {/* 3 */}
            <article className="h-full flex flex-col rounded-xl p-4 sm:p-6 bg-gradient-to-br from-wondersun/20 to-wonderorange/10 border-l-4 border-wondersun">
              <h3 className="text-lg sm:text-2xl font-semibold text-wonderorange leading-tight">
                Real-world Confidence
              </h3>
              <p className="mt-2 sm:mt-3 text-gray-700 leading-relaxed text-sm sm:text-base md:text-lg">
                Trips, showcases, volunteering, and youth-led events help students try new roles, share their work, and discover what they&rsquo;re capable of.
              </p>
              <div className="mt-auto" />
            </article>

            {/* 4 */}
            <article className="h-full flex flex-col rounded-xl p-4 sm:p-6 bg-gradient-to-br from-wondergreen/10 to-wonderleaf/5 border-l-4 border-wondergreen">
              <h3 className="text-lg sm:text-2xl font-semibold text-wondergreen leading-tight">
                Healthy Choices
              </h3>
              <p className="mt-2 sm:mt-3 text-gray-700 leading-relaxed text-sm sm:text-base md:text-lg">
                Outdoor activity, movement, mentoring, and positive peer groups help youth build strong habits, reduce stress, and stay grounded as they grow.
              </p>
              <div className="mt-auto" />
            </article>
          </div>
        </section>


        {/* In planning */}
        {/* <section className="mb-10 sm:mb-12">
          <div className="rounded-2xl border-2 border-wondersun/40 bg-white p-5 sm:p-6 md:p-8 shadow-lg">
            <div className="mb-2 flex items-center gap-2 sm:gap-3">
              <span className="inline-flex items-center rounded-full bg-gradient-to-r from-wondersun to-wonderorange px-2 py-0.5 sm:px-2.5 sm:py-1 text-[11px] sm:text-xs font-semibold text-white shadow">
                In&nbsp;planning - remove!
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-wondergreen">College &amp; Career Bridge</h3>
            </div>
            <p className="text-base sm:text-lg leading-relaxed text-gray-700">
                Portfolio building, verified service hours, job-shadow days, basic application support, and mentor
                connections&mdash;so teens can explore careers and feel ready for what&rsquo;s next.
            </p>
          </div>
        </section> */}


        {/* Get Involved */}
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
              </div> */}
            {/* </Link> */}

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

        <LeadershipSection />
        <ContactUsSection />
      </div>
    </>
  );
}
