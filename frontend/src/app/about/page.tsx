'use client';

import Link from 'next/link';
import GradientBanner from '@/components/ui/GradientBanner';
import { VolunteerBadge, PartnershipBadge, DonationBadge } from '@/components/ui/BadgedIcons';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-wonderbg via-white to-wondersun/20">
      <GradientBanner
        size="md"
        title="Who We Are"
        subtitle="WonderHood connects Colorado homeschool and online learners (ages 10-18) with real friends, real adventures, and a supportive community."
      />

      {/* container */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 break-words [text-wrap:balance]">

        {/* Our Story */}
        <section className="relative my-8 sm:my-12 md:my-16">
          {/* decorative "spots" */}
          <div className="pointer-events-none absolute -right-10 top-6 hidden h-28 w-28 rounded-full bg-wonderorange/20 blur-3xl sm:block" />
          <div className="pointer-events-none absolute -left-8 bottom-6 hidden h-24 w-24 rounded-full bg-wonderleaf/25 blur-2xl sm:block" />

          <div className="relative z-10 rounded-2xl border border-wonderleaf/30 bg-gradient-to-br from-wondersun/25 via-wonderbg to-white/90 p-5 sm:p-6 md:p-8 shadow-lg">
            <div className="mb-4 sm:mb-5 flex items-center gap-3 sm:gap-4">
              <div className="h-8 w-2 sm:h-10 sm:w-3 rounded-full bg-gradient-to-b from-wonderleaf via-wondergreen to-wonderorange shadow" />
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-wondergreen">Our Story</h2>
            </div>

            <div className="rounded-xl border border-wonderleaf/20 bg-white/60 p-4 sm:p-5 md:p-6 backdrop-blur-sm">
              <div className="space-y-3 sm:space-y-4 text-base sm:text-lg leading-relaxed text-gray-700">
                <p>
                  WonderHood was started by parents and educators who saw a gap: learning at home can be rich and
                  flexible, but many youth miss daily peer connection. Screens fill the time, confidence drops, and
                  real-life communication gets harder.
                </p>
                <p>
                  We build welcoming spaces where teens belong. Through outdoor adventures, creative arts, STEM
                  projects, life-skills, and service, youth practice communication, discover new interests, form healthy
                  habits, and grow in confidence&mdash;together.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why We Do It */}
        <section className="mb-10 sm:mb-12 md:mb-16">
          <div className="mb-6 sm:mb-8 text-center">
            <h2 className="mb-2 sm:mb-3 text-2xl sm:text-3xl md:text-4xl font-bold text-wondergreen [text-wrap:balance]">
              Why We Do It?
            </h2>
            <div className="mx-auto h-1 w-20 sm:w-24 rounded-full bg-gradient-to-r from-wonderleaf to-wonderorange" />
          </div>

          <div className="grid gap-5 sm:gap-8 md:gap-10 md:grid-cols-2 auto-rows-fr items-stretch">
            {/* 1 */}
            <article className="h-full flex flex-col rounded-xl p-4 sm:p-6 bg-gradient-to-br from-wonderleaf/10 to-wondergreen/5 border-l-4 border-wonderleaf">
              <h3 className="text-lg sm:text-2xl font-semibold text-wondergreen leading-tight">
                Connection over isolation
              </h3>
              <p className="mt-2 sm:mt-3 text-gray-700 leading-relaxed text-sm sm:text-base md:text-lg">
                Home/online learners often miss everyday peer time. We make it easy to meet, bond, and keep friends.
              </p>
              <div className="mt-auto" />
            </article>

            {/* 2 */}
            <article className="h-full flex flex-col rounded-xl p-4 sm:p-6 bg-gradient-to-br from-wonderorange/10 to-wondersun/5 border-l-4 border-wonderorange">
              <h3 className="text-lg sm:text-2xl font-semibold text-wonderorange leading-tight">
                Skills for life
              </h3>
              <p className="mt-2 sm:mt-3 text-gray-700 leading-relaxed text-sm sm:text-base md:text-lg">
                Communication, teamwork, leadership, resilience&mdash;practiced in real projects, not just worksheets.
              </p>
              <div className="mt-auto" />
            </article>

            {/* 3 */}
            <article className="h-full flex flex-col rounded-xl p-4 sm:p-6 bg-gradient-to-br from-wondersun/20 to-wonderorange/10 border-l-4 border-wondersun">
              <h3 className="text-lg sm:text-2xl font-semibold text-wonderorange leading-tight">
                Real-world confidence
              </h3>
              <p className="mt-2 sm:mt-3 text-gray-700 leading-relaxed text-sm sm:text-base md:text-lg">
                Trips, showcases, volunteering, and youth-led events help teens try roles, present work, and see what they&rsquo;re capable of.
              </p>
              <div className="mt-auto" />
            </article>

            {/* 4 */}
            <article className="h-full flex flex-col rounded-xl p-4 sm:p-6 bg-gradient-to-br from-wondergreen/10 to-wonderleaf/5 border-l-4 border-wondergreen">
              <h3 className="text-lg sm:text-2xl font-semibold text-wondergreen leading-tight">
                Healthy choices
              </h3>
              <p className="mt-2 sm:mt-3 text-gray-700 leading-relaxed text-sm sm:text-base md:text-lg">
                Active time outdoors, sports and wellness, mentoring and positive peers&mdash;so teens build strong habits and avoid risky behaviors (including substance use).
              </p>
              <div className="mt-auto" />
            </article>
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
                Volunteer Hours for Teens &amp; College Students
              </h3>
            </div>
            <p className="text-sm sm:text-base md:max-w-3xl text-gray-700">
              WonderHood offers meaningful service opportunities&mdash;earn hours, develop leadership, and make a
              difference. Want to help, co-lead a club, or start something new?{' '}
              <a
                href="mailto:wonderhood.project@gmail.com"
                rel="noopener noreferrer"
                className="underline transition-colors duration-200 text-wonderleaf hover:text-wondergreen"
              >
                wonderhood.project@gmail.com
              </a>
              .
            </p>

            {/* mini safety footnote INSIDE Volunteer Hours card */}
            <div className="mt-3 flex items-start gap-2 rounded-md border border-wondergreen/15 bg-wondergreen/5 px-3 py-2 text-[12px] sm:text-[13px] leading-snug text-wondergreen">
              <span aria-hidden="true">🛡️</span>
              <span>
                <strong>Safety-first:</strong> adult volunteers are screened; programs are supervised; we teach healthy habits and
                model respectful communication.
              </span>
            </div>
          </div>
        </section>

        {/* In planning */}
        <section className="mb-10 sm:mb-12">
          <div className="rounded-2xl border-2 border-wondersun/40 bg-white p-5 sm:p-6 md:p-8 shadow-lg">
            <div className="mb-2 flex items-center gap-2 sm:gap-3">
              <span className="inline-flex items-center rounded-full bg-gradient-to-r from-wondersun to-wonderorange px-2 py-0.5 sm:px-2.5 sm:py-1 text-[11px] sm:text-xs font-semibold text-white shadow">
                In&nbsp;planning
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-wondergreen">College &amp; Career Bridge</h3>
            </div>
            <p className="text-base sm:text-lg leading-relaxed text-gray-700">
              Portfolio building, verified service hours, job-shadow days, basic application support, and mentor
              connections&mdash;so teens can explore careers and feel ready for what&rsquo;s next.
            </p>
          </div>
        </section>

        {/* How to Join */}
        <section className="relative mb-10 sm:mb-12 rounded-2xl border-2 border-wonderorange/30 bg-gradient-to-br from-wondersun/30 via-wonderbg to-white p-6 sm:p-8 md:p-12 shadow-lg">
          <div className="pointer-events-none absolute right-4 top-4 hidden h-28 w-28 rounded-full bg-wonderorange/40 blur-2xl sm:block" />
          <div className="pointer-events-none absolute left-4 bottom-4 hidden h-24 w-24 rounded-full bg-wonderleaf/40 blur-xl sm:block" />

          <div className="relative z-10">
            <div className="mb-5 sm:mb-6 flex items-center gap-3 sm:gap-4">
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-gradient-to-br from-wonderorange to-wondersun">
                <span className="text-lg sm:text-xl font-bold text-white">!</span>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-wondergreen">How to Join</h2>
            </div>

            <div className="mb-3 sm:mb-4 rounded-xl bg-white/60 p-5 sm:p-6 backdrop-blur-sm">
              <p className="text-base sm:text-lg leading-relaxed text-gray-700">
                Membership is{' '}
                <span className="rounded bg-wondersun/30 px-2 py-0.5 sm:py-1 font-bold text-wondergreen">free</span> for homeschool
                and online families with youth ages <span className="font-bold text-wonderorange">10&ndash;18</span>.
              </p>
              <p className="mt-2 text-base sm:text-lg leading-relaxed text-gray-700">
                Sign up for events, meet other families, and grow with us. Clubs are in planning&mdash;join the interest
                list or email questions anytime.
              </p>
            </div>

            <div className="text-center">
              <a
                href="mailto:wonderhood.project@gmail.com"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-wonderleaf to-wondergreen px-4 sm:px-8 py-3 sm:py-4 font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <span>✉</span>
                wonderhood.project@gmail.com
              </a>
            </div>
          </div>
        </section>

        {/* Get Involved */}
        <section className="mb-14 sm:mb-16">
          <div className="mb-6 sm:mb-8 text-center">
            <h2 className="mb-2 sm:mb-3 text-2xl sm:text-3xl md:text-4xl font-bold text-wondergreen">Get Involved</h2>
            <div className="mx-auto h-1 w-20 sm:w-24 rounded-full bg-gradient-to-r from-wonderorange to-wonderleaf" />
          </div>

          {/* items-stretch */}
          <div className="grid gap-5 sm:gap-6 md:grid-cols-3 items-stretch">
            {/* Volunteer */}
            <Link href="/volunteer" className="group block h-full">
              <div className="relative h-full cursor-pointer overflow-hidden rounded-xl border-2 border-wonderleaf/20 bg-white p-5 sm:p-6 pb-14 sm:pb-16 shadow-lg transition-colors duration-300 hover:border-wonderleaf flex flex-col">
                <div className="mb-3 sm:mb-4">
                  <VolunteerBadge className="w-12 h-12 sm:w-14 sm:h-14" />
                </div>
                <h3 className="mb-1.5 sm:mb-2 text-lg sm:text-xl font-bold text-wondergreen">Volunteer</h3>
                <p className="text-sm sm:text-base text-gray-700">Help organize events, mentor teens, or co-lead activities.</p>

                {/* safety footnote — компактнее */}
                <p className="mt-3 flex items-center gap-1 text-[12px] sm:text-xs text-wondergreen/80">
                  <span aria-hidden="true">🛡️</span>
                  Screened volunteers, supervised programs.
                </p>

                <div className="mt-auto" />

                <span className="pointer-events-none absolute bottom-3 sm:bottom-4 left-0 right-0 mx-auto select-none px-4 text-center text-sm sm:text-base text-gray-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  Thank you for bringing our community to life!
                </span>
              </div>
            </Link>

            {/* Partnership */}
            <Link href="/partnership" className="group block h-full">
              <div className="relative h-full cursor-pointer overflow-hidden rounded-xl border-2 border-wonderorange/40 bg-white p-5 sm:p-6 pb-14 sm:pb-16 shadow-lg transition-colors duration-300 hover:border-wonderorange flex flex-col">
                <div className="mb-3 sm:mb-4">
                  <PartnershipBadge className="w-12 h-12 sm:w-14 sm:h-14" />
                </div>
                <h3 className="mb-1.5 sm:mb-2 text-lg sm:text-xl font-bold text-wondergreen">Partnership</h3>
                <p className="text-sm sm:text-base text-gray-700">
                  Museums, parks, youth orgs, studios&mdash;let&rsquo;s create programs together (space, instructors, pilots).
                </p>

                <div className="mt-auto" />

                <span className="pointer-events-none absolute bottom-3 sm:bottom-4 left-0 right-0 mx-auto select-none px-4 text-center text-sm sm:text-base text-gray-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  Together we can do so much more!
                </span>
              </div>
            </Link>

            {/* Donate */}
            <Link href="/support" className="group block h-full">
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
        </section>

        {/* Contact footer */}
        <section className="mb-14 sm:mb-16">
          <div className="mx-auto max-w-4xl rounded-2xl border border-wonderleaf/20 bg-white/60 p-6 sm:p-8 text-center backdrop-blur-sm">
            <p className="mb-3 sm:mb-4 text-base sm:text-lg text-gray-600">Questions? We&rsquo;d love to hear from you!</p>
            <div className="flex flex-col items-center justify-center gap-3 sm:gap-4 sm:flex-row">
              <a
                href="mailto:wonderhood.project@gmail.com"
                rel="noopener noreferrer"
                className="font-semibold text-wonderleaf transition-colors duration-300 hover:text-wondergreen"
              >
                wonderhood.project@gmail.com
              </a>
              <span className="hidden text-gray-400 sm:block">|</span>
              <span className="text-gray-600">Follow us on social media!</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
