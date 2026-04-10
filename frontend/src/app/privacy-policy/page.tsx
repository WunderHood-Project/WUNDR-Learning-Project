import type { Metadata } from "next";
import PrivacyPolicy from "@/components/policies/PrivacyPolicy";

export const metadata: Metadata = {
  title: "Privacy Policy — WonderHood",
  description: "How WonderHood collects, uses, and protects your data.",
};

export default function PrivacyPolicyPage() {
  return <PrivacyPolicy />;
}
