export default function Benefits() {
    const items = [
        "Logo & link on our site and event pages",
        "Social posts and photo tags",
        "Impact report for CSR/grants",
        "Certificates & thank-you features",
        "Priority invitations to flagship programs",
    ];

    return (
        <section className="py-10 sm:py-12 lg:py-14">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* HEader */}
                <div className="flex flex-col items-center xl:items-start">
                    <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-extrabold text-wondergreen text-center xl:text-left">
                        Benefits & Recognition
                    </h2>
                    <div className="h-1 w-3/4 sm:w-[31%] bg-gradient-to-r from-wonderleaf to-wondergreen rounded-full shadow-md mb-6 sm:mb-8 mt-2 self-center xl:self-start" />
                </div>

                {/* Grid of cards */}
                <ul
                className="
                    grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
                    gap-3 sm:gap-4 lg:gap-5
                "
                >
                {items.map((t) => (
                    <li
                    key={t}
                    className="
                        group relative overflow-hidden rounded-2xl bg-white
                        ring-1 ring-wonderleaf/20 shadow-sm
                        transition-all duration-300 ease-out
                        hover:shadow-xl motion-safe:hover:-translate-y-1.5
                    "
                    >
                    {/* Upper color stripe */}
                    <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-wondergreen via-wonderleaf to-wondersun" />

                    <div className="p-4 sm:p-5 lg:p-6 flex items-start gap-3 sm:gap-3.5">
                        {/* Check icon */}
                        <span
                        className="
                            inline-grid place-items-center shrink-0
                            w-8 h-8 sm:w-9 sm:h-9 rounded-full
                            bg-wonderleaf/15 ring-1 ring-wonderleaf/30
                            transition-transform duration-300
                            group-hover:scale-110 group-hover:rotate-3
                        "
                        aria-hidden
                        >
                        <svg
                            viewBox="0 0 24 24"
                            className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-wondergreen"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2.2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M20 6L9 17l-5-5" />
                        </svg>
                        </span>

                        {/* Benefit text */}
                        <p
                        className="
                            text-[15px] sm:text-base lg:text-[17px] xl:text-[18px]
                            leading-snug sm:leading-normal text-gray-700
                        "
                        >
                        {t}
                        </p>
                    </div>
                    </li>
                ))}
                </ul>
            </div>
        </section>
    );
}
