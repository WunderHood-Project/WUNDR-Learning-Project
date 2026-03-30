"use client";

import HeroSection from "@/components/landing/HeroSection";
import Story_Mission from "@/components/landing/Story_Mission";
import ImpactStats from "@/components/landing/ImpactNumbers";
import OurPrograms from "@/components/landing/OurPrograms"
import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useModal } from "@/context/modal";
import TaxReturnSuccessModal from "@/components/TaxReturn/TaxReturnSuccessModal";
import HowToJoin from "@/components/landing/HowToJoin";
import ContactUsSection from "@/components/landing/contactUsSection";


function FunctionLandingPage() {
  const searchParams = useSearchParams()
  const modal = searchParams.get("modal")
  const { setModalContent } = useModal()

  useEffect(() => {
    if (modal === "taxReturnSuccess") {
      setModalContent(<TaxReturnSuccessModal />)
    }
  }, [modal, setModalContent])


  return (
    <main>
      {/* Top sections of the landing page */}
      <HeroSection />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ImpactStats />
        <Story_Mission />
        <HowToJoin />
        <OurPrograms />
        <ContactUsSection />
      </div>
    </main>
  )
}

export default function LandingPage(){
  return(
    <Suspense fallback={null}>
      <FunctionLandingPage />
    </Suspense>

  )
}
