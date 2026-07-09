import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { RegionalLifestyleShowcase } from "../components/RegionalLifestyleShowcase";
import { Problem } from "../components/Problem";
import { ClearExamples } from "../components/ClearExamples";
import { Solution } from "../components/Solution";
import { AIOnboarding } from "../components/AIOnboarding";
import { Features } from "../components/Features";
import { Trust } from "../components/Trust";
import { PricingPage } from "../components/PricingPage";
import { CategorizedFAQ } from "../components/CategorizedFAQ";
import { CTABanner } from "../components/CTABanner";
import { Footer } from "../components/Footer";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <ClearExamples />
        <RegionalLifestyleShowcase />
        <Problem />
        <Solution />
        <AIOnboarding />
        <Features />
        <Trust />
        <PricingPage />
        <CategorizedFAQ />
        <CTABanner />
      </main>
      <Footer />
    </div>
  );
}
