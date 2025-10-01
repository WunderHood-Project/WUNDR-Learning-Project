export default function OurPrograms() {
    const programs = [
        {
            icon: "/programsIcon/fishing.png",
            title: "Outdoor Discovery",
            desc: "Fishing adventures, map reading skills, and nature-based science exploration in Colorado's beautiful wilderness.",
        },
        {
            icon: "/programsIcon/tent.png",
            title: "Survival & First Aid Skills",
            desc: "Essential life skills including knot tying, shelter building, emergency preparedness, and CPR certification.",
        },
        {
            icon: "/programsIcon/salad.png",
            title: "Healthy Living & Cooking",
            desc: "Garden-to-table experiences, cooking workshops, nutrition education, and sustainable living practices.",
        },
        {
            icon: "/programsIcon/books.png",
            title: "Book & Art Club",
            desc: "Literary discussions, creative writing, sculpting, painting, and artistic expression in a supportive community.",
        },
        {
            icon: "/programsIcon/laptop.png",
            title: "Tech Evenings",
            desc: "Coding workshops, robotics, and technology exploration through partnerships with regional tech organizations.",
        },
        {
            icon: "/programsIcon/ski.png",
            title: "Adventures & Field Trips",
            desc: "Sports activities, ski days, national park visits, museum trips, and seasonal community celebrations.",
        },
    ];

    return (
        <section className="w-full py-12 sm:py-16 text-wondergreen bg-[#FAF7ED]">
            <div className="max-w-7xl mx-auto flex flex-col px-4 sm:px-6 lg:px-8">

                {/* Section heading */}
                <div className="flex flex-col items-center sm:items-start">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                        Our Programs
                    </h2>

                    {/* Decorative gradient underline */}
                    <div className="h-1 w-2/4 sm:w-1/4 bg-gradient-to-r from-wonderleaf to-wondergreen rounded-full shadow-md mb-4 mt-2" />

                    {/* Section subtitle */}
                    <p className="text-base sm:text-lg lg:text-[20px] text-gray-600 max-w-3xl text-center sm:text-left mb-8 sm:mb-10 mt-2">
                        Hands-on experiences that bring homeschool families together.
                    </p>
                </div>

                {/* Grid of program cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10">
                    {programs.map((prog) => (
                        <div
                            key={prog.title}
                            className="bg-[#f9faf7] rounded-3xl shadow-lg p-6 sm:p-6 flex flex-col items-start min-h-[220px] sm:min-h-[250px] relative overflow-hidden"
                        >
                            {/* Gradient bar at the top of each card */}
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-wondergreen to-wondersun" />

                            {/* Icon + program title */}
                            <div className="flex items-center gap-3 sm:gap-4 mb-2 mt-2 z-10">
                                <img src={prog.icon} alt="" className="w-10 h-10 sm:w-14 sm:h-14" />
                                <h3 className="text-lg sm:text-xl lg:text-[21px] font-bold text-wondergreen">
                                    {prog.title}
                                </h3>
                            </div>

                            {/* Program description */}
                            <p className="text-sm sm:text-base lg:text-lg text-gray-600 ml-2 sm:ml-4">
                                {prog.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}