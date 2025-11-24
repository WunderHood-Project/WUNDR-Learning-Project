import AboutPageContent from "../../components/about/AboutPageContent";
import GradientBanner from "@/components/ui/GradientBanner";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-wonderbg via-white to-wondersun/20">
      <GradientBanner
        size="md"
        align="center"
        title="Who We Are"
        subtitle="WonderHood helps Colorado homeschool and online learners (ages 10-18) find real friends, meaningful adventures, and a supportive community."
      />

      <AboutPageContent />
    </div>
  );
}
