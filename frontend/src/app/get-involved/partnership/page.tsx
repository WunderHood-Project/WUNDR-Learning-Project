import PartnerHero from "@/components/partnership/PartnerHero";
import PartnerWays from "@/components/partnership/PartnerWays";
import Benefits from "@/components/partnership/Benefits";
import PartnerForm from "@/components/partnership/PartnerForm";
import PartnerFAQ from "@/components/partnership/PartnerFAQ";

export const dynamic = "force-static";

export default function PartnershipPage() {
    return (
        <main className="bg-[#FAF7ED] text-wondergreen">
            <PartnerHero />
            <PartnerWays />
            <Benefits />
            <PartnerForm />
            <PartnerFAQ />
        </main>
    );
}
