"use client";

import Link from "next/link";
import OpenModalButton from "@/context/openModalButton";
import SignupModal from "@/components/signup/SignupModal";

export default function HowToJoin() {
  return (
    <section className="w-full py-4 md:py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 sm:mb-12 flex flex-col items-center xl:items-start">
          <div className="flex items-center gap-3 mb-3">
            {/* <div className="flex h-11 w-11 items-center justify-center rounded-full bg-wonderorange shadow-md">
              <span className="text-xl font-bold text-white">!</span>
            </div> */}
            <h2 className="text-3xl sm:text-4xl md:text-[34px] lg:text-[36px] xl:text-[40px] font-bold text-wondergreen text-center xl:text-left">
              How to Join
            </h2>
          </div>

          <div className="h-1 w-3/4 sm:w-52 bg-gradient-to-r from-wonderleaf to-wondergreen rounded-full shadow-md self-center xl:self-start" />
        </div>

        {/* Content */}
        <div className="max-auto w-full xl:mx-0">
          <p className="text-base md:text-[17px] lg:text-[20px] text-gray-700 mb-9 text-center xl:text-left xl:ml-2 -mt-6">
            Getting started is simple!
          </p>

          {/* Steps */}
          <div className="mb-12">
            <div className="space-y-5 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-10 lg:items-start">

              {/* 1 */}
              <div className="relative flex flex-col items-center text-center gap-3 lg:items-start lg:text-left">
                <div className="flex flex-col items-center gap-3 lg:flex-row lg:items-center lg:gap-4">
                  <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 lg:w-13 lg:h-13 xl:w-16 xl:h-16 rounded-full bg-wondergreen flex items-center justify-center text-white font-bold">
                    1
                  </div>

                  <p className="text-base md:text-[17px] lg:text-[17px] xl:text-[20px] text-gray-700 lg:pt-0.5">
                    Create your{" "}
                    <OpenModalButton
                      buttonText="WonderHood account"
                      modalComponent={<SignupModal />}
                      className="p-0 bg-transparent border-none font-bold text-wondergreen underline decoration-wondergreen/50 underline-offset-2 hover:decoration-wondergreen cursor-pointer"
                    />
                    .
                  </p>
                </div>
              </div>

              {/* 2 */}
              <div className="relative flex flex-col items-center text-center gap-3 lg:items-start lg:text-left">
                <div className="flex flex-col items-center gap-3 lg:flex-row lg:items-center lg:gap-4">
                  <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 lg:w-13 lg:h-13 xl:w-16 xl:h-16 rounded-full bg-wonderleaf flex items-center justify-center text-white font-bold">
                    2
                  </div>

                  <p className="text-base md:text-[17px] lg:text-[17px] xl:text-[20px] text-gray-700 lg:pt-0.5">
                    <span className="font-bold text-wondergreen">Add your child(ren)</span>{" "}
                    to complete their registration.
                  </p>
                </div>
              </div>

              {/* 3 */}
              <div className="flex flex-col items-center text-center gap-3 lg:items-start lg:text-left">
                <div className="flex flex-col items-center gap-3 lg:flex-row lg:items-center lg:gap-4">
                  <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 lg:w-13 lg:h-13 xl:w-16 xl:h-16  rounded-full bg-wonderorange flex items-center justify-center text-white font-bold">
                    3
                  </div>

                  <p className="text-base md:text-[17px] lg:text-[17px] xl:text-[20px] text-gray-700 lg:pt-0.5">
                    Choose an{" "}
                    <Link
                      href="/events"
                      className="font-bold text-wondergreen underline decoration-wondergreen/50 underline-offset-2 hover:decoration-wondergreen"
                    >
                      event
                    </Link>{" "}
                    and enroll.
                  </p>
                </div>
              </div>

            </div>
          </div>


          {/* Free banner */}
          <div className="bg-wondersun/40 border-2 border-wonderorange/30 rounded-2xl p-4  lg:p-4">
            <p className="text-base md:text-[16px] lg:text-[18px] text-gray-800 text-center">
              WonderHood events are free for families, made possible through 
              <span className="font-bold text-wondergreen"> grants, donations, </span>
              and 
              <span className="font-bold text-wondergreen"> community partners.</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
