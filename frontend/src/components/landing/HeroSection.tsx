import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

export default function HeroSection() {
    return (
        <section className="hero relative h-[45vh] w-full overflow-hidden">
            <Swiper
                modules={[Pagination, Autoplay]}
                pagination={{ clickable: true }}
                autoplay={{ delay: 10000, disableOnInteraction: false }}
                spaceBetween={0}
                slidesPerView={1}
                className="h-[45vh] w-full"
            >
            {/* Slide 1 */}
                <SwiperSlide>
                    <div className="relative h-full w-full">
                        <Image
                            src="/hero.png"
                            alt="Kids outdoors"
                            fill
                            className="object-cover object-[center_40%]"
                            priority
                        />
                        {/* <div className="absolute inset-0 bg-black/20" aria-hidden /> */}
                        {/* <div className="absolute inset-0 bg-white/10 z-10 pointer-events-none" /> */}
                        <div className="absolute inset-0 bg-black/1 aria-hidden" />
                        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4 mt-17 md:mt-16">
                            <h1 className="text-white font-bold leading-tight
                                        text-2xl sm:text-3xl md:text-4xl lg:text-6xl
                                        lg:whitespace-nowrap
                                        drop-shadow-[2px_2px_6px_rgba(0,0,0,0.8)]">
                                More than Just Homeschooling
                            </h1>

                            <p className="text-white mt-3 md:mt-4
                                        text-base sm:text-lg md:text-xl lg:text-2xl
                                        max-w-[90%] mx-auto
                                        drop-shadow-[1px_1px_4px_rgba(0,0,0,0.8)]">
                                Connection, adventure, and friendship for youth ages 10-18.
                            </p>

                            <Link href="/get-involved" className="mt-4 md:mt-8">
                                <div className="bg-wondergreen text-white
                                                px-3 py-2 md:px-7 md:py-3
                                                rounded-lg text-sm md:text-lg lg:text-xl
                                                font-semibold shadow-lg
                                                transition-all duration-300 hover:scale-105 hover:bg-wonderleaf">
                                    Get Involved
                                </div>
                            </Link>
                        </div>
                    </div>
                </SwiperSlide>

            {/* Slide 2 */}
            <SwiperSlide>
                <div className="relative h-full w-full">
                    <Image
                        src="/test4.png"
                        alt="Kids outdoors"
                        fill
                        className="object-cover object-[center_25%]"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/1" aria-hidden />
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4 mt-17 md:mt-16">
                        <h1 className="text-white font-bold leading-tight
                                    text-2xl sm:text-3xl md:text-4xl lg:text-6xl
                                    lg:whitespace-nowrap
                                    drop-shadow-[2px_2px_6px_rgba(0,0,0,0.8)]">
                            A Place to Belong, Explore, and Create
                        </h1>

                        <p className="text-white mt-3 md:mt-4
                                    text-base sm:text-lg md:text-xl lg:text-2xl
                                    max-w-[90%] mx-auto
                                    drop-shadow-[1px_1px_4px_rgba(0,0,0,0.8)]">
                            For homeschoolers seeking fun, friendships, and meaningful adventures.
                        </p>

                        <Link href="/get-involved" className="mt-2 md:mt-8">
                            <div className="bg-wondergreen text-white
                                            px-3 py-2 md:px-7 md:py-3
                                            rounded-lg text-sm md:text-lg lg:text-xl
                                            font-semibold shadow-lg
                                            transition-all duration-300 hover:scale-105 hover:bg-wonderleaf">
                                Get Involved
                            </div>
                        </Link>
                    </div>
                </div>
            </SwiperSlide>

            {/* Slide 3 */}
            <SwiperSlide>
                <div className="relative h-full w-full">
                    <Image
                        src="/hero3.png"
                        alt="Kids outdoors"
                        fill
                        className="object-cover object-[center_35%]"
                        priority
                    />

                    <div className="absolute inset-0 bg-black/1" aria-hidden />

                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4 mt-17 md:mt-16">
                        <h1 className="text-white font-bold leading-tight
                                    text-2xl sm:text-3xl md:text-4xl lg:text-6xl
                                    lg:whitespace-nowrap
                                    drop-shadow-[2px_2px_6px_rgba(0,0,0,0.8)]">
                            Where Homeschool Teens Connect & Grow
                        </h1>

                        <p className="text-white mt-3 md:mt-4
                                    text-base sm:text-lg md:text-xl lg:text-2xl
                                    max-w-[90%] mx-auto
                                    drop-shadow-[1px_1px_4px_rgba(0,0,0,0.8)]">
                            Creative activities, new friendships, real-life experiences.
                        </p>

                        <Link href="/get-involved" className="mt-4 md:mt-8">
                            <div className="bg-wondergreen text-white
                                            px-3 py-2 md:px-7 md:py-3
                                            rounded-lg text-sm md:text-lg lg:text-xl
                                            font-semibold shadow-lg
                                            transition-all duration-300 hover:scale-105 hover:bg-wonderleaf">
                                Get Involved
                            </div>
                        </Link>
                    </div>
                </div>
            </SwiperSlide>
            </Swiper>
        </section>
    )
}
