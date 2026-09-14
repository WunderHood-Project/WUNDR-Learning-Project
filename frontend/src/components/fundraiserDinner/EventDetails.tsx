const EXPECTATIONS = [
    "A hearty dinner featuring traditional Western favorites",
    "Live music by Jimmy Cantwell",
    "A silent auction featuring artwork and crafts created by THOR students, along with other donated items",
    "A short presentation about WonderHood Project and The Heart of Ranching Program",
    "A video and slideshow highlighting our programs and community",
    "Opportunities to support the program, volunteer, or become a sponsor",
];

export default function EventDetails() {
    return (
        <section className="py-8 md:py-16 max-w-4xl mx-auto px-4">
            <div className="mb-6 sm:mb-8 text-center">
                <h2 className="mb-2 sm:mb-3 text-2xl sm:text-3xl md:text-4xl font-bold text-wondergreen">
                    An Evening for Our Community
                </h2>
                <div className="mx-auto h-1 w-20 sm:w-24 rounded-full bg-gradient-to-r from-wonderorange to-wonderleaf" />
            </div>

            <p className="text-base sm:text-lg leading-relaxed text-center max-w-3xl mx-auto text-gray-700 mb-10">
                Spend an evening with us enjoying a delicious dinner, live music, and time together
                as a community.
            </p>

            <div className="rounded-2xl border-2 border-wonderleaf/20 bg-white p-6 md:p-8 shadow-lg">
                <h3 className="text-xl md:text-2xl font-bold text-wondergreen mb-4">What to Expect</h3>
                <ul className="space-y-3">
                    {EXPECTATIONS.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm md:text-base text-gray-700">
                            <span className="text-wondergreen font-bold mt-0.5 flex-shrink-0">✓</span>
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
