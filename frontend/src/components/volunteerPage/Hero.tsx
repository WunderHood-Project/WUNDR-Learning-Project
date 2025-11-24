export default function HeroVolunteer(){
    return (
        <div>
            <section className="relative bg-wondergreen bg-gradient-to-br from-wondergreen to-wonderleaf py-16 px-2 text-center text-white shadow-lg overflow-hidden">
                {/* Animated circles */}
                <div className="absolute inset-0 pointer-events-none z-0">
                    <div className="absolute inset-0 z-0 bg-emerald-700/40 mix-blend-multiply pointer-events-none" />
                    <span className="absolute top-8 left-1/4 w-6 h-6 rounded-full bg-white/10 animate-bounce-slow" />
                    <span className="absolute top-10 left-1/2 w-3 h-3 rounded-full bg-white/10 animate-bounce-slow" />
                    <span className="absolute top-12 left-20 w-3 h-3 rounded-full bg-white/10 animate-bounce-slow" />
                    <span className="absolute bottom-1/3 left-60 w-6 h-6 rounded-full bg-white/10 animate-bounce-slow" />
                    <span className="absolute top-1/3 right-12 w-4 h-4 rounded-full bg-white/15 animate-pulse-slow" />
                    <span className="absolute bottom-8 left-1/3 w-3 h-3 rounded-full bg-white/10 animate-float" />
                    <span className="absolute bottom-8 left-20 w-3 h-3 rounded-full bg-white/10 animate-bounce-slow" />
                    <span className="absolute bottom-10 right-1/3 w-5 h-5 rounded-full bg-white/10 animate-float-slow" />
                    <span className="absolute top-1/4 right-60 w-3 h-3 rounded-full bg-white/10 animate-float-slow" />
                    <span className="absolute bottom-20 right-80 w-3 h-3 rounded-full bg-white/10 animate-bounce-slow" />
                    <span className="absolute bottom-16 right-40 w-6 h-6 rounded-full bg-white/10 animate-bounce-slow" />
                    </div>
                {/* Header Content */}
                <div className="relative z-10 font-segoe">
                {/* <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg"> */}
                <h1 className="text-4xl text-xl md:text-4xl font-extrabold mb-4 drop-shadow-lg">
                    Become a WonderHood Volunteer
                </h1>
                <p className="text-base md:text-xl font-medium max-w-2xl mx-auto mb-0">
                    Help kids explore nature and creativity. Choose a one-time shift or join us regularly — every hand matters.
                </p>
                </div>
            </section>

            {/* See option btn
            <button>

            </button>

            {/* Apply to Volunteer btn */}
            {/* <button>

            </button>  */}
        </div>
    )
}