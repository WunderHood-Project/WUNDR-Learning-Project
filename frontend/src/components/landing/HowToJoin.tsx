"use client";

import Link from "next/link";
import OpenModalButton from "@/context/openModalButton";
import SignupModal from "@/components/signup/SignupModal";

export default function HowToJoin() {
  return (
    <section className="w-full py-4 md:py-6">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-2">
        {/* Header */}
        <div className="mb-10 sm:mb-12 flex flex-col items-center xl:items-start">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-wonderorange shadow-md">
              <span className="text-xl font-bold text-white">!</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-wondergreen text-center xl:text-left">
              How to Join
            </h2>
          </div>

          <div className="h-1 w-3/4 sm:w-64 md:w-72 lg:w-73 bg-gradient-to-r from-wonderleaf to-wondergreen rounded-full shadow-md self-center xl:self-start" />
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto xl:mx-0">
          <p className="text-lg sm:text-xl text-gray-700 mb-8 text-center xl:text-left -mt-5">
            Getting started is simple!
          </p>

          {/* Steps */}
          <div className="space-y-5 mb-10">
            {/* 1 */}
            <div className="flex flex-col items-center text-center gap-3 xl:flex-row xl:items-start xl:text-left xl:gap-4">
              <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 lg:w-14 lg:h-14 xl:w-10 xl:h-10 rounded-full bg-wondergreen flex items-center justify-center text-white font-bold">
                1
              </div>
              <p className="text-lg text-gray-700 pt-0.5">
                Create your{" "}
                <OpenModalButton
                  buttonText="WonderHood account"
                  modalComponent={<SignupModal />}
                  className="p-0 bg-transparent border-none font-bold text-wondergreen underline decoration-wondergreen/50 underline-offset-2 hover:decoration-wondergreen cursor-pointer"
                />
                .
              </p>
            </div>

            {/* 2 */}
            <div className="flex flex-col items-center text-center gap-3 xl:flex-row xl:items-start xl:text-left xl:gap-4">
              <div className="flex-shrink-0 w-8 h-8 md:w-9 md:h-9 lg:w-14 lg:h-14 xl:w-10 xl:h-10 rounded-full bg-wonderleaf flex items-center justify-center text-white font-bold ">
                2
              </div>
              <p className="text-lg text-gray-700 pt-0.5">
                <span className="font-bold text-wondergreen">Add your child(ren)</span>{" "}
                to complete their registration.
              </p>
            </div>

            {/* 3 */}
            <div className="flex flex-col items-center text-center gap-3 xl:flex-row xl:items-start xl:text-left xl:gap-4">
              <div className="flex-shrink-0 w-8 h-8 md:w-9 md:h-9 lg:w-14 lg:h-14 xl:w-10 xl:h-10 rounded-full bg-wonderorange flex items-center justify-center text-white font-bold">
                3
              </div>
              <p className="text-lg text-gray-700 pt-0.5">
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

          {/* Free banner */}
          <div className="bg-wondersun/40 border-2 border-wonderorange/30 rounded-2xl p-4 md:p-5">
            <p className="text-base md:text-xl text-gray-800 text-center">
              Every WonderHood event is{" "}
              <span className="font-bold text-wondergreen">free to join.</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
