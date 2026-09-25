import { LandingHeader } from "@/components/support/landing/landing-header";
import { HeroSection } from "@/components/support/landing/hero-section";
import { FeaturesSection } from "@/components/support/landing/features-section";
import { HowItWorksSection } from "@/components/support/landing/how-it-works-section";
import { IntegrationSection } from "@/components/support/landing/integration-section";
import { CTASection } from "@/components/support/landing/cta-section";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <LandingHeader />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <IntegrationSection />
      <CTASection />
    </div>
  );
}
