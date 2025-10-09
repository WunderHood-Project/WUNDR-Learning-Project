import CountUp from 'react-countup';

const stats = [
  { value: 23, suffix: "+", label: "Families Joined" },
  { value: 10, suffix: "+", label: "Events Organized" },
  { value: 10, suffix: "+", label: "Ongoing Clubs" },
  { value: 100, suffix: "+", label: "Workshops & Trips" },

  { value: 100, suffix: "%", label: "Smiles Created" },
];

export default function ImpactStats() {
  return (
    <section className="w-full py-10 text-wondergreen bg-[#FAF7ED] mt-8">
      <div className="max-w-7xl mx-auto flex flex-col items-center px-4">
        {/* Title */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-center leading-tight">
          Empowering Families Through Connection
        </h2>
        {/* Line horizontal */}
        <div className="mx-auto my-4 h-1 w-2/3 sm:w-1/2 rounded-full bg-gradient-to-r from-wonderleaf to-wondergreen shadow-md" />

        {/* Sub Title */}
        <div className="w-full mt-2">
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-5xl mx-auto text-center leading-relaxed">
            We believe that learning flourishes when children and families come together.
            <br className="hidden sm:block"/>
            WonderHood connects homeschool and online learners through real experiences, new friendships, and joyful discovery — helping them feel part of a vibrant community.
          </p>
        </div>

        {/* Grid */}
        <div className="
          grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 
          gap-6 sm:gap-8 md:gap-10
          max-w-7xl mx-auto mt-8 
          md:divide-x md:divide-green-300
        ">
          {stats.map((stat, idx) => (
            <div key={stat.label} className="flex flex-col items-center px-4 sm:px-6">
              <span className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-bold text-wondergreen mt-2">
                <CountUp end={stat.value} duration={1.4 + idx * 0.2} suffix={stat.suffix} />
              </span>
              <span className="mt-2 text-sm sm:text-base md:text-lg text-orange-400 font-medium text-center">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

