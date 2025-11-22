"use client";

import GradientBanner from "@/components/ui/GradientBanner";
import ContactSection from "@/components/contact/ContactSection";

export default function ContactPage() {
  
  return (
    <main className="min-h-screen bg-gradient-to-br from-wonderbg via-white to-wondersun/20">
      <GradientBanner
      size="md"
      align="center"
      title="Contact WonderHood"
      subtitle={
        <>
          {/* mobile */}
          <span className="md:hidden">
            We’d love to hear from you!
          </span>

          {/* desktop/tablet*/}
          <span className="hidden md:inline">
            We’d love to hear from you — whether you’re a homeschooling parent,
            volunteer, or community partner with questions about our programs,
            events, or support opportunities.
          </span>
        </>
      }
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <ContactSection />
      </div>
      
    </main>
  );
}
