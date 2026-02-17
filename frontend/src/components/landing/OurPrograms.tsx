import React from "react";
import {Mountain, Paintbrush, Atom, HeartPulse, UsersRound } from "lucide-react";

type IconType = React.ComponentType<React.SVGProps<SVGSVGElement>>;

type Club = { Icon: IconType; title: string; desc: string };

const clubs: Club[] = [
  {
    Icon: Mountain,
    title: "Adventure & Outdoor Club",
    desc:
      "Builds confidence, teamwork, and a healthy love for nature. Our favorites are hiking, climbing, camping, and seasonal sports.",
  },
  {
    Icon: Paintbrush,
    title: "Arts & Expression Club",
    desc:
      "Encourages imagination, self-expression, and collaboration. We love creative writing, design, and hands-on workshops.",
  },
  {
    Icon: Atom,
    title: "STEM & Innovation Club",
    desc:
      "Where curiosity meets creativity, from coding to hands-on science experiments.",
  },
  {
    Icon: HeartPulse,
    title: "Life Skills & Wellness Club",
    desc:
      "Promotes independence, resilience, and lifelong healthy habits. Practical skill development in nutrition, mindfulness, and healthy living.",
  },
  {
    Icon: UsersRound,
    title: "Leadership & Community Building Club",
    desc:
      "Teens learn how to mentor and contribute through community service projects.",
  },
];

export default function OurPrograms() {
  return (
    <section className="w-full py-12 sm:py-12 text-wondergreen bg-[#FAF7ED] ">
      <div className="max-w-7xl mx-auto flex flex-col px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="flex flex-col items-center xl:items-start">
          <div className="w-full mb-3 flex flex-col items-center xl:flex-row xl:items-end gap-2 xl:gap-3">
            {/* Badge: top on <xl, right on xl+ */}
            <h2
              className="order-1 xl:order-1
                        text-3xl sm:text-4xl md:text-[34px] lg:text-[36px] xl:text-[40px]
                        font-bold text-center xl:text-left"
            >
              WonderHood Signature Clubs
            </h2>

            <span
            // -mt-8 xl:mt-0
              className="order-2 xl:order-2
                        text-[11px] sm:text-xs md:text-sm
                        px-3 py-2 mt-1 xl:mt-0 rounded-full
                        bg-gradient-to-br from-amber-300 via-amber-400 to-amber-300 text-amber-950
                        font-semibold tracking-wide shadow-md ring-1 ring-amber-500/35

                        "
            >
              COMING SOON
            </span>
          </div>

          {/* underline */}
          <div className="h-1 w-3/4 sm:w-2/3 bg-gradient-to-r from-wonderleaf to-wondergreen rounded-full shadow-md mb-4 mt-2" />

          <p className="text-base sm:text-lg lg:text-[20px] text-gray-600 max-w-5xl text-center sm:text-left mb-8 sm:mb-10 mt-2">
            Get ready for something new! Our upcoming WonderClubs will be <span className="font-bold">ongoing, weekly programs</span> designed to give homeschool and online learners
            a consistent space to learn, create, and connect. These year-round communities will offer deeper friendships, meaningful projects, and exciting opportunities to grow together.
          </p>
        </div>

        {/* Grid */}
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {clubs.map(({ Icon, title, desc }) => {
            const id = title.toLowerCase().replace(/\s+/g, "-");
            return (
              <li
                key={title}
                role="article"
                aria-labelledby={id}
                tabIndex={0}
                className="group relative h-full rounded-2xl bg-white ring-1 ring-wonderleaf/20 shadow-sm transition-all duration-300 ease-out
                           motion-safe:hover:-translate-y-1.5 motion-safe:hover:shadow-xl
                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wondergreen/70"
              >
                {/* top strip */}
                <div className="absolute top-0 left-0 w-full h-1.5 rounded-t-2xl bg-gradient-to-r from-wondergreen via-wonderleaf to-wondersun transition-colors duration-300 group-hover:from-wondergreen/90 group-hover:to-wondersun/90" />

                <div className="p-6 sm:p-6 min-h-[180px] sm:min-h-[200px] flex flex-col">
                  <div className="flex items-center gap-3 sm:gap-4 mb-2 mt-2">
                    {/* compact icon badge */}
                    <span className="inline-grid place-items-center w-9 h-9 sm:w-11 sm:h-11 rounded-full
                                     bg-wondersun/55 ring-1 ring-amber-400/30
                                     shadow-sm transition-transform duration-300 ease-out
                                     motion-safe:group-hover:scale-110 motion-safe:group-hover:rotate-3">
                      <Icon className="w-5 h-5 sm:w-[22px] sm:h-[22px] text-wondergreen stroke-[1.8]" />
                    </span>

                    <h3 id={id} className="text-lg sm:text-xl lg:text-[21px] font-bold text-wondergreen">
                      {title}
                    </h3>
                  </div>

                  <p className="text-sm sm:text-base lg:text-[17px] text-gray-600 ml-1 sm:ml-2">
                    {desc}
                  </p>

                  {/* We stretch the description so that the heights of the cards are aligned. */}
                  <div className="mt-auto" />
                </div>
              </li>
            );
          })}
        </ul>

        {/* Bottom of the section */}
        <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <p className="text-sm text-gray-500">
            Programs may vary by season as new local partnerships launch.
          </p>
          {/* <a href="/interest" className="text-sm font-semibold text-wondergreen underline underline-offset-4 hover:opacity-80">
            Join the interest list →
          </a> */}
        </div>

        {/* Announcement / Interest banner */}
        {/* <div
        role="note"
        className="relative mt-10 rounded-2xl px-6 py-6 sm:px-10 sm:py-7 text-white
                    bg-gradient-to-r from-wondergreen to-wonderleaf shadow-xl"
        > */}
            {/* <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full
                        bg-wondersun/20 blur-2xl"
            /> */}
            {/* <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-[auto,1fr,auto] items-center gap-3 lg:gap-6"> */}
                {/* <span className="justify-self-center lg:justify-self-start text-2xl sm:text-3xl">✨</span> */}

                {/* <div className="text-center lg:text-left">
                    <p className="font-semibold text-[17px] sm:text-lg">
                    Clubs are in planning — join the interest list.
                    </p>
                    <p className="text-white/90 text-sm sm:text-base">
                    We&aposre collecting interest and confirming partners/funding. Get updates and priority invites when pilot sessions open.
                    </p>
                </div>

                <a
                    href="mailto:hello@wonderhood.org?subject=Clubs%20Interest&body=Teen%20age%3A%20%0AClubs%20interests%3A%20"
                    className="justify-self-center lg:justify-self-end mt-4 lg:mt-0 whitespace-nowrap
                            inline-flex items-center rounded-full bg-wondersun px-4 py-2
                            text-amber-950 text-sm font-semibold shadow-md hover:brightness-95
                            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60"
                >
                    Join Interest List
                </a>
            </div> */}

        {/* </div> */}

      </div>
    </section>
  );
}
