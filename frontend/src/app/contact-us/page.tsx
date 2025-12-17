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
          <span>
            We’d love to hear from you!
          </span>
      }
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <ContactSection />
      </div>

    </main>
  );
}
