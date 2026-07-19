import { Suspense } from "react";
import HeroSection from "@/components/landing/HeroSection";
import Story_Mission from "@/components/landing/Story_Mission";
import ImpactStats from "@/components/landing/ImpactNumbers";
import OurPrograms from "@/components/landing/OurPrograms"
import HowToJoin from "@/components/landing/HowToJoin";
import ContactUsSection from "@/components/landing/contactUsSection";
import TaxReturnModalTrigger from "@/components/landing/TaxReturnModalTrigger";

export default function LandingPage() {
  return (
    <main>
      <Suspense fallback={null}>
        <TaxReturnModalTrigger />
      </Suspense>
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
