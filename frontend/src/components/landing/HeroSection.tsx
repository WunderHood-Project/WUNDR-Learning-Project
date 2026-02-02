"use client";

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
                        src="/hero.webp"
                        alt="Kids outdoors"
                        fill
                        className="object-cover object-[center_40%]"
                        priority
                        sizes="100vw"
                    />

                    {/* overlay */}
                    <div className="absolute inset-0 bg-black/10" aria-hidden="true" />

                    {/* content*/}
                    <div className="absolute inset-0 z-10 flex items-center justify-center mt-17 md:mt-16">
                        <div className="w-full max-w-7xl px-6 md:px-8 lg:px-10 text-center">
                            <h1 className="text-white font-bold leading-tight
                                            text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-6xl
                                            lg:whitespace-nowrap
                                            drop-shadow-[2px_2px_6px_rgba(0,0,0,0.8)]">
                                More than Just Homeschooling
                            </h1>

                            {/* <p className="text-white mt-3 md:mt-4
                                            text-base sm:text-lg md:text-xl lg:text-2xl
                                            max-w-3xl mx-auto
                                            drop-shadow-[1px_1px_4px_rgba(0,0,0,0.8)]">
                                <span className="hidden md:inline">
                                    Connection, adventure, and friendship for youth ages 10-18.
                                <br />
                                Serving homeschool & online learners across Colorado.

                                </span>
                            </p> */}

                            <Link href="/get-involved" className="mt-4 md:mt-8 inline-block">
                                <div className="bg-wondergreen text-white
                                                px-3 py-2 md:px-5 md:py-2 lg:px-7 lg:py-2.5
                                                rounded-lg text-sm md:text-lg lg:text-xl
                                                font-semibold shadow-lg
                                                transition-all duration-300 hover:scale-105 hover:bg-wonderleaf">
                                    Get Involved
                                </div>
                            </Link>

                            {/* Only for mob and tablet Events btn */}
                            {/* <Link href="/events" className="mt-3 block lg:hidden md:mt-4">
                                <div className="mx-auto w-[200px] md:w-[240px] max-w-full
                                                bg-white/90 text-wondergreen px-5 py-1.5 md:px-4 md:py-2 rounded-lg
                                                text-sm md:text-[17px] font-semibold shadow
                                                border border-wondergreen/30
                                                transition-all duration-300 hover:bg-white md:mb-6">
                                    View Upcoming Events
                                </div>
                            </Link> */}
                        </div>
                    </div>
                </div>
            </SwiperSlide>

            {/* Slide 2 */}
            <SwiperSlide>
                <div className="relative h-full w-full">
                    <Image
                        src="/test4.webp"
                        alt="Kids outdoors"
                        fill
                        className="object-cover object-[center_25%]"
                        sizes="100vw"
                    />

                    {/* overlay */}
                    <div className="absolute inset-0 bg-black/10" aria-hidden="true" />

                    {/* centered container */}
                    <div className="absolute inset-0 z-10 flex items-center justify-center mt-17 md:mt-16">
                        <div className="w-full max-w-7xl px-6 md:px-8 lg:px-10 text-center">
                            <h1 className="text-white font-bold leading-tight
                                        text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-6xl
                                        lg:whitespace-nowrap
                                        drop-shadow-[2px_2px_6px_rgba(0,0,0,0.8)]">
                                A Place to Belong, Explore, and Create
                            </h1>

                        {/* <p className="text-white mt-3 md:mt-4
                                    text-base sm:text-lg md:text-xl lg:text-2xl
                                    max-w-3xl mx-auto
                                    drop-shadow-[1px_1px_4px_rgba(0,0,0,0.8)]">
                            <span className="hidden md:inline">
                                For homeschoolers seeking fun, friendships, and meaningful adventures.
                            </span>
                        </p> */}

                            <Link href="/get-involved" className="mt-4 md:mt-8 inline-block">
                                <div className="bg-wondergreen text-white
                                                px-3 py-2 md:px-5 md:py-2 lg:px-7 lg:py-2.5
                                                rounded-lg text-sm md:text-lg lg:text-xl
                                                font-semibold shadow-lg
                                                transition-all duration-300 hover:scale-105 hover:bg-wonderleaf">
                                    Get Involved
                                </div>
                            </Link>

                            {/* Only for mob and tablet Events btn */}
                            {/* <Link href="/events" className="mt-3 block lg:hidden md:mt-4">
                                <div className="mx-auto w-[200px] md:w-[240px] max-w-full
                                                bg-white/90 text-wondergreen px-5 py-1.5 md:px-4 md:py-2 rounded-lg
                                                text-sm md:text-[17px] font-semibold shadow
                                                border border-wondergreen/30
                                                transition-all duration-300 hover:bg-white md:mb-6">
                                    View Upcoming Events
                                </div>
                            </Link>  */}
                        </div>
                    </div>
                </div>
            </SwiperSlide>

            {/* Slide 3 */}
            <SwiperSlide>
                <div className="relative h-full w-full">
                    <Image
                        src="/hero3.webp"
                        alt="Kids outdoors"
                        fill
                        className="object-cover object-[center_35%]"
                        sizes="100vw"
                    />

                    {/* overlay */}
                    <div className="absolute inset-0 bg-black/10" aria-hidden="true" />

                {/* centered container */}
                <div className="absolute inset-0 z-10 flex items-center justify-center mt-17 md:mt-16">
                    <div className="w-full max-w-7xl px-6 md:px-8 lg:px-10 text-center">
                        <h1 className="text-white font-bold leading-tight
                                    text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-6xl
                                    lg:whitespace-nowrap
                                    drop-shadow-[2px_2px_6px_rgba(0,0,0,0.8)]">
                        Where Teens Connect &amp; Grow
                        </h1>

                        {/* <p className="text-white mt-3 md:mt-4
                                    text-base sm:text-lg md:text-xl lg:text-2xl
                                    max-w-3xl mx-auto
                                    drop-shadow-[1px_1px_4px_rgba(0,0,0,0.8)]">
                            <span className="hidden md:inline">
                                Creative activities, new friendships, real-life experiences.
                            </span>

                        </p> */}

                            <Link href="/get-involved" className="mt-4 md:mt-8 inline-block">
                                <div className="bg-wondergreen text-white
                                                px-3 py-2 md:px-5 md:py-2 lg:px-7 lg:py-2.5
                                                rounded-lg text-sm md:text-lg lg:text-xl
                                                font-semibold shadow-lg
                                                transition-all duration-300 hover:scale-105 hover:bg-wonderleaf">
                                    Get Involved
                                </div>
                            </Link>

                            {/* Only for mob and tablet Events btn */}
                            {/* <Link href="/events" className="mt-3 block lg:hidden md:mt-4">
                                <div className="mx-auto w-[200px] md:w-[240px] max-w-full
                                                bg-white/90 text-wondergreen px-5 py-1.5 md:px-4 md:py-2 rounded-lg
                                                text-sm md:text-[17px] font-semibold shadow
                                                border border-wondergreen/30
                                                transition-all duration-300 hover:bg-white md:mb-6">
                                    View Upcoming Events
                                </div>
                            </Link> */}
                        </div>
                    </div>
                </div>
            </SwiperSlide>
        </Swiper>
    </section>
)

}
