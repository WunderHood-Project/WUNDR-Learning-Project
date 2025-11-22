"use client";

import HeroSection from "@/components/landing/HeroSection";
import Story_Mission from "@/components/landing/Story_Mission";
import ImpactStats from "@/components/landing/ImpactNumbers";
import OurPrograms from "@/components/landing/OurPrograms"
import TaxReturnSuccessModal from "@/components/taxReturn/TaxReturnSuccessModal";
import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useModal } from "@/context/modal";

function FunctionLandingPage() {
  const searchParams = useSearchParams()
  const modal = searchParams.get("modal")
  const { setModalContent } = useModal()

  useEffect(() => {
    if (modal === "taxReturnSuccess") {
      setModalContent(<TaxReturnSuccessModal />)
    }
  }, [modal, setModalContent])


  const VolunteerIcon = () => (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-12 h-12"
    >
      <path
        d="M24 4L28.854 16.146L42 18L32 26.708L35.416 40L24 33.292L12.584 40L16 26.708L6 18L19.146 16.146L24 4Z"
        fill="#4A7C59"
      />

      <path
        d="M24 10L26.854 18.146L35 19L29 24.708L31.416 32L24 27.292L16.584 32L19 24.708L13 19L21.146 18.146L24 10Z"
        fill="#F4A261"
      />

      <circle cx="12" cy="12" r="2" fill="#8FBC8F" />
      <circle cx="36" cy="12" r="2" fill="#8FBC8F" />
      <circle cx="8" cy="32" r="1.5" fill="#8FBC8F" />
      <circle cx="40" cy="32" r="1.5" fill="#8FBC8F" />

      <path
        d="M4 24C4 24 6 22 8 24C10 26 12 24 12 24"
        stroke="#8FBC8F"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M36 24C36 24 38 22 40 24C42 26 44 24 44 24"
        stroke="#8FBC8F"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );


  return (
    <main>
      {/* Top sections of the landing page */}
      <HeroSection />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        <ImpactStats />
        <Story_Mission />
        <OurPrograms />
      </div>
      {/* Volunteer section container */}
      <div className="mt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#f9faf7] rounded-3xl shadow-lg p-6 sm:p-8 relative overflow-hidden">

          {/* Decorative top border line (gradient bar) */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-wondergreen to-wondersun" />

          <div className="mt-2 space-y-4">
            {/* Title row: icon + heading aligned in one line */}
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 mb-2  sm:mb-0 sm:w-10 sm:h-10 flex items-center justify-center ml-2">
                <VolunteerIcon />
              </div>
              <h3 className="text-lg sm:text-xl lg:text-[21px] font-bold text-wondergreen">
                Volunteer Hours for Teens & College Students
              </h3>
            </div>

            {/* Description text under the title */}
            <div className="space-y-3">
              <p className="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed ml-4">
                WonderHood offers volunteer opportunities for high school and college students to earn
                service hours, develop leadership skills, and make a difference in the community.
              </p>
              <p className="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed ml-4">
                Interested in volunteering or starting a new club?{" "}
                <a
                  href="mailto:wonderhood.project@gmail.com"
                  className="text-wonderleaf underline hover:text-wondergreen font-medium"
                >
                  Email us!
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default function LandingPage(){
  return(
    <Suspense>
      <FunctionLandingPage />
    </Suspense>
  
  )
}