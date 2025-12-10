
export default function HowToJoin () {
    return (
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
                    Getting started is simple!
                </p>
                <ol className="list-decimal ml-6 mt-2 space-y-1 text-base sm:text-lg text-gray-700 leading-relaxed marker:text-wondergreen marker:font-bold">
                    <li><span className="font-bold text-wondergreen">Create your WonderHood account.</span></li>
                    <li><span className="font-bold text-wondergreen">Add your child(ren)</span> to complete their registration.</li>
                    <li><span className="font-bold text-wondergreen">Choose an event and enroll.</span></li>
                </ol>
              <p className="mt-2 text-base sm:text-lg leading-relaxed text-gray-700">
                Every WonderHood event is <span className="font-bold text-wondergreen">free to join.</span>
              </p>
            </div>

            <div className="text-center">
                <p>If you have any questions, feel free to reach out!</p>
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
    )
}
