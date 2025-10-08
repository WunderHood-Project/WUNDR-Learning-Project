import Image from "next/image";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

export default function Story_Mission(){

    return (
    <section className="w-full text-wondergreen bg-[#FAF7ED]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center min-h-[400px] px-4 sm:px-6 lg:px-8 py-10">
        {/* Left: Text */}
        <div className="flex flex-col justify-center">
         {/* Title and line - centered on mobile, left-aligned on desktop */}
          <div className="flex flex-col items-center md:items-start">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-wondergreen mb-4 md:mb-6 leading-tight">
              Our Story & Mission
            </h2>
            <div className="h-1 w-3/4 md:w-3/4 bg-gradient-to-r from-wonderleaf to-wondergreen rounded-full shadow-md mb-6" />
          </div>

          {/* Paragraphs - centered on mobile, left-aligned on desktop */}
          <div className="text-center md:text-left">
            <p className="text-base sm:text-lg md:text-xl mb-4 leading-relaxed">
              WonderHood was created for youth ages 10-18 who learn from home — whether through homeschooling or online school.  
              We believe that learning outside traditional classrooms can be powerful, but it can also feel isolating.
            </p>
            <p className="text-base sm:text-lg md:text-xl leading-relaxed">
              That&aposs why we build programs where teens can make friends, explore their interests, and grow through outdoor adventures, creative arts, and community projects.
            </p>
            <p className="text-base sm:text-lg md:text-xl leading-relaxed">
              We believe that learning outside traditional classrooms is powerful, but it can also feel isolating.
            </p>
          </div>
        </div>

        {/* Right: Pinned Image carousel */}
        <div className="flex h-full items-center justify-center md:justify-start lg:ml-14">
          {/* Pinned card container */}
          <div className="relative w-full max-w-[560px] lg:w-[500px]">
            {/* Pin/Thumbtack at the top */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-20">
              <div className="relative">
                {/* Pin shadow */}
                <div className="absolute inset-0 bg-gray-400/30 blur-sm rounded-full transform translate-y-1" />
                {/* Pin head */}
                <div className="relative w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-full shadow-lg border-2 border-red-700">
                  {/* Pin shine */}
                  <div className="absolute top-1 left-1 w-2 h-2 bg-white/40 rounded-full" />
                </div>
                {/* Pin needle */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2 w-0.5 h-4 bg-gradient-to-b from-gray-300 to-gray-400" />
              </div>
            </div>

            {/* Card with pinned effect */}
            <div className="
              relative
              w-full
              aspect-[5/3] sm:aspect-[16/9]
              lg:h-[300px] lg:aspect-auto
              rounded-2xl overflow-hidden 
              shadow-[0_10px_25px_rgba(0,0,0,0.15),0_20px_40px_rgba(0,0,0,0.1)]
              mt-4
              transform rotate-1 hover:rotate-0
              transition-all duration-300 ease-out
              hover:shadow-[0_15px_35px_rgba(0,0,0,0.2),0_25px_50px_rgba(0,0,0,0.15)]
              hover:scale-[1.02]
              bg-white
              border-4 border-white
            ">
              {/* Tape effect at corners */}
              <div className="absolute -top-2 -left-2 w-16 h-8 bg-yellow-100/80 transform -rotate-45 z-10 shadow-sm" 
                   style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }} />
              <div className="absolute -top-2 -right-2 w-16 h-8 bg-yellow-100/80 transform rotate-45 z-10 shadow-sm" 
                   style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }} />
              
              <Swiper
                spaceBetween={10}
                slidesPerView={1}
                loop
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                modules={[Autoplay]}
                className="w-full h-full"
              >
                {/* Slide 1 */}
                <SwiperSlide>
                  <div className="relative w-full h-full">
                    <Image
                      src="/ourStory/story1.png"
                      alt="Kids event"
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                </SwiperSlide>

                {/* Slide 2 */}
                <SwiperSlide>
                  <div className="relative w-full h-full">
                    <Image
                      src="/ourStory/story2.png"
                      alt="Kids outdoors"
                      fill
                      className="object-cover"
                    />
                  </div>
                </SwiperSlide>

                {/* Slide 3 */}
                <SwiperSlide>
                  <div className="relative w-full h-full">
                    <Image
                      src="/ourStory/story3.png"
                      alt="Indoor learning"
                      fill
                      className="object-cover"
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