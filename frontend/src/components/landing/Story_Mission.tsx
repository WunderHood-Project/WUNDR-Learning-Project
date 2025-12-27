import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

export default function Story_Mission() {
  return (
    <section className="w-full text-wondergreen bg-[#FAF7ED]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-2 xl:gap-12 items-center min-h-[400px] px-4 sm:px-6 lg:px-8 py-10 -mt-10">

        {/* Left: Text */}
        <div className="flex flex-col justify-center">
          <div className="flex flex-col items-center xl:items-start">
            <h2
              className="
                font-bold text-wondergreen leading-tight text-center xl:text-left
                text-3xl sm:text-4xl md:text-[34px] lg:text-[36px] xl:text-[40px]
                md:whitespace-nowrap xl:whitespace-normal
                mb-4 md:mb-5
              "
            >
              Our Story &amp; Mission
            </h2>

            {/* Color line */}
            <div className="h-1 w-48 sm:w-64 md:w-72 lg:w-80 bg-gradient-to-r from-wonderleaf to-wondergreen rounded-full shadow-md mb-6 self-center xl:self-start" />
          </div>

          {/* Text center */}
          <div className="text-center xl:text-left">
            <p className="leading-relaxed text-base sm:text-lg md:text-[17px] lg:text-[20px] xl:text-xl mb-4">
              WonderHood was created for Colorado home-learning students ages 10-18 who need connection as much as education.
              Our current pilot programming is launching in Custer County (Westcliffe and surrounding areas), with expansion guided by partnerships and community needs.
              Learning outside traditional classrooms can be empowering, but it can also feel isolating.
            </p>
            <p className="leading-relaxed text-base sm:text-lg md:text-[17px] lg:text-[20px] xl:text-xl">
              Our events give learners a place to belong. Each experience is individually offered and families can enroll in the opportunities that excite them most. Through outdoor adventures, creative arts, and community projects, students build friendships, explore interests, and grow in confidence.
            </p>
          </div>
        </div>

        {/* Right: pinned image carousel */}
        <div className="flex h-full items-center justify-center xl:justify-start mt-12 xl:mt-4">
          <div className="relative w-full max-w-[720px] sm:max-w-[580px] lg:max-w-[580px] xl:max-w-[480px] xl:w-[460px]">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-20">
              <div className="relative">
                <div className="absolute inset-0 bg-gray-400/30 blur-sm rounded-full translate-y-1" />
                <div className="relative w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-full shadow-lg border-2 border-red-700">
                  <div className="absolute top-1 left-1 w-2 h-2 bg-white/40 rounded-full" />
                </div>
                <div className="absolute top-6 left-1/2 -translate-x-1/2 w-0.5 h-4 bg-gradient-to-b from-gray-300 to-gray-400" />
              </div>
            </div>

            {/* Card */}
            <div
              className="
                relative w-full
                aspect-[5/3] sm:aspect-[16/9] xl:h-[300px] xl:aspect-auto
                rounded-2xl overflow-hidden
                shadow-[0_10px_25px_rgba(0,0,0,0.15),0_20px_40px_rgba(0,0,0,0.1)]
                mt-4 transform rotate-1 hover:rotate-0
                transition-all duration-300 ease-out
                hover:shadow-[0_15px_35px_rgba(0,0,0,0.2),0_25px_50px_rgba(0,0,0,0.15)]
                hover:scale-[1.02] bg-white border-4 border-white
              "
            >
              {/* tape */}
              <div className="absolute -top-2 -left-2 w-16 h-8 bg-yellow-100/80 -rotate-45 z-10 shadow-sm" />
              <div className="absolute -top-2 -right-2 w-16 h-8 bg-yellow-100/80 rotate-45 z-10 shadow-sm" />

              <Swiper
                spaceBetween={10}
                slidesPerView={1}
                loop
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                modules={[Autoplay]}
                className="w-full h-full"
              >
                <SwiperSlide>
                  <div className="relative w-full h-full">
                    <Image
                      src="/ourStory/story1.webp"
                      alt="Kids event"
                      fill
                      className="object-cover"
                      priority
                      sizes="(max-width: 1280px) 100vw, 560px"
                    />
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="relative w-full h-full">
                    <Image
                      src="/ourStory/story2.webp"
                      alt="Kids outdoors"
                      fill
                      className="object-cover"
                      sizes="(max-width: 1280px) 100vw, 560px"
                    />
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="relative w-full h-full">
                    <Image
                      src="/ourStory/story3.webp"
                      alt="Indoor learning"
                      fill
                      className="object-cover"
                      sizes="(max-width: 1280px) 100vw, 560px"
                    />
                  </div>
                </SwiperSlide>
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
