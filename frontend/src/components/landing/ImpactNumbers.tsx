import CountUp from 'react-countup';

const stats = [
  { value: 23, suffix: "+", label: "Families Joined" },
  { value: 100, suffix: "+", label: "Trips & Workshops Planned" },
  { value: 100, suffix: "%", label: "Real-World Learning" },
  { value: 100, suffix: "%", label: "Mission-Driven" },
  { value: 100, suffix: "%", label: "Community-Focused" },
];

export default function ImpactStats() {
  return (
    <section className="w-full pt-10 pb-7 text-wondergreen bg-[#FAF7ED] my-8">
      <div className="max-w-7xl mx-auto flex flex-col items-center px-4">
        {/* Title */}
        <h2 className="text-3xl sm:text-4xl md:text-[34px] lg:text-[36px] xl:text-[42px] font-bold mb-4 text-center leading-tight">
          Empowering Families Through Connection
        </h2>
        {/* Line horizontal */}
        <div className="mx-auto my-4 h-1 w-2/3 sm:w-1/2 rounded-full bg-gradient-to-r from-wonderleaf to-wondergreen shadow-md" />

        {/* Sub Title */}
        <div className="w-full mt-2">
          <p className="text-base md:text-base lg:text-base xl:text-xl text-gray-600 max-w-5xl mx-auto text-center leading-relaxed">
            We believe learning flourishes when families and children come together.
            <br/>
            WonderHood offers <span className="font-bold">free, real-world</span> experiences for homeschool and online learners, sparking new friendships, joyful discovery, and a sense of belonging in a vibrant community.
          </p>
        </div>


        {/* Grid */}
        <div className="
          grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5
          gap-x-8 gap-y-10
          max-w-7xl mx-auto mt-8
                ">
          {stats.map((stat, idx) => (
            <div
              key={stat.label}
              className={[
                "flex flex-col items-center px-4 sm:px-4 md:px-6",
                "lg:relative lg:pl-10",
                idx > 0
                  ? "lg:before:content-[''] lg:before:absolute lg:before:top-2 lg:before:bottom-2 lg:before:w-px lg:before:bg-green-300"
                  : "",
                idx === 1 ? "lg:before:left-[-28px]" : "lg:before:left-0",
              ].join(" ")}

            >
              <span className="text-3xl sm:text-4xl md:text-[38px] xl:text-[40px] font-bold text-wondergreen mt-2">
                <CountUp end={stat.value} duration={1.4 + idx * 0.2} suffix={stat.suffix} />
              </span>
              <div className="mt-2 text-center text-orange-400 font-medium">
                <div className="text-base sm:text-base xl:text-lg whitespace-nowrap">{stat.label}</div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
