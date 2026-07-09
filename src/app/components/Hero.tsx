import { Button } from "./ui/button";
import { Check } from "lucide-react";
import { DeviceMockup } from "./DeviceMockup";
import { AIDataGlowMinimal } from "./AIDataGlow";
import { useRegion } from "../context/RegionContext";
import { regionalContent } from "../config/regionalContent";

export function Hero() {
  const { region } = useRegion();
  const content = regionalContent[region].hero;
  const examples = regionalContent[region].examples;

  return (
    <section className="pt-32 pb-20 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
      <AIDataGlowMinimal />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Text Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#0F3460] leading-tight">
                {content.headline}
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
                {content.subheadline}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#16A8B8]">
                  {region === "usa" ? "For Boards and Management" : "Para administración y junta"}
                </p>
                <p className="mt-2 text-sm leading-6 text-[#0F3460]">
                  {examples.audience1.items[0].problem}
                </p>
                <p className="mt-3 text-sm font-medium leading-6 text-gray-600">
                  {examples.audience1.items[0].solution}
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#16A8B8]">
                  {region === "usa" ? "For Homeowners and Residents" : "Para propietarios y residentes"}
                </p>
                <p className="mt-2 text-sm leading-6 text-[#0F3460]">
                  {examples.audience2.items[0].problem}
                </p>
                <p className="mt-3 text-sm font-medium leading-6 text-gray-600">
                  {examples.audience2.items[0].solution}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                onClick={() => window.location.hash = "onboarding"}
                className="bg-[#16A8B8] hover:bg-[#16A8B8]/90 text-white text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all"
              >
                {content.ctaPrimary}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => window.location.hash = "demo"}
                className="border-[#0F3460] text-[#0F3460] hover:bg-[#0F3460] hover:text-white text-lg px-8 py-6"
              >
                {content.ctaSecondary}
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 pt-4">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-[#16A8B8] flex-shrink-0" />
                <span className="text-sm sm:text-base text-gray-600">{content.feature1}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-[#16A8B8] flex-shrink-0" />
                <span className="text-sm sm:text-base text-gray-600">{content.feature2}</span>
              </div>
            </div>
          </div>

          {/* Right - Device Mockup */}
          <div className="relative lg:scale-90 xl:scale-100">
            <DeviceMockup />
          </div>
        </div>
      </div>
    </section>
  );
}
