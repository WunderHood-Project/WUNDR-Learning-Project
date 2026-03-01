import type { Metadata } from "next";
import AntiDiscrimination from "@/components/policies/AntiDiscrimination";

export const metadata: Metadata = {
  title: "Anti-Discrimination Policy — WonderHood",
  description: "WonderHood’s anti-discrimination policy and how to report concerns.",
};

export default function AntiDiscriminationPolicyPage() {
  return <AntiDiscrimination />;
}
