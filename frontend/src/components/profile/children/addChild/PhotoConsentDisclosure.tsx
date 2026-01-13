import React from "react";
import { PHOTO_CONSENT_VERSION } from "@/constants/policies";

export default function PhotoConsentDisclosure() {
  return (
    <details className="mt-2 rounded-lg bg-amber-50 border border-amber-200 open:ring-1 open:ring-amber-300">
      <summary className="cursor-pointer select-none px-3 py-2 text-sm font-medium text-amber-900">
        Read full Photo & Media Consent (v{PHOTO_CONSENT_VERSION})
      </summary>

      <div className="px-3 pb-3 pt-1 text-sm leading-relaxed text-amber-900">
        <p className="mb-2">
          By checking “I agree,” I, as the parent/guardian, grant WonderHood (a 501(c)(3) nonprofit)
          permission to photograph and/or record my child during WonderHood programs and events, and
          to use those images or short videos to share program highlights on WonderHood&apos;s website
          and social media (e.g., Facebook, Instagram, LinkedIn).
        </p>
        <p className="mb-2">
          No images will be sold. No compensation is provided. Personally identifying information
          (e.g., full name) will not be posted with images without separate explicit permission.
        </p>
        <p>
          I may withdraw consent at any time by emailing
          {" "}<b>info@whproject.org</b>. WonderHood will stop future use and make
          reasonable efforts to remove prior posts within its control. This consent is voluntary and
          not a condition of participation (where allowed by program rules). This consent is governed
          by the laws of Colorado.
        </p>
      </div>
    </details>
  );
}
