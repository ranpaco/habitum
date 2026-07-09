import { useState } from "react";
import { Check, Zap, X } from "lucide-react";
import { Button } from "./ui/button";
import { useRegion } from "../context/RegionContext";
import { regionalPricing } from "../config/regionalPricing";

export function PricingPage() {
  const { region } = useRegion();
  const pricing = regionalPricing[region];
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");

  const plans = pricing.plans;

  const calculatePrice = (pricePerUnit: number) => {
    if (billingPeriod === "yearly") {
      return (pricePerUnit * 0.8).toFixed(2); // 20% discount
    }
    return pricePerUnit.toFixed(2);
  };

  return (
    <div id="pricing" className="bg-gradient-to-b from-gray-50 to-white">
      {/* Header Section */}
      <section className="pt-20 pb-12 text-center">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1A365D] mb-6">
            {pricing.header.title}
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
            {pricing.header.subtitle}
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-white rounded-full p-1 shadow-lg border border-gray-200">
            <button
              onClick={() => setBillingPeriod("monthly")}
              className={`px-4 sm:px-8 py-2 sm:py-3 rounded-full font-semibold text-sm sm:text-base transition-all ${
                billingPeriod === "monthly"
                  ? "bg-[#1A365D] text-white"
                  : "text-gray-600 hover:text-[#1A365D]"
              }`}
            >
              {pricing.header.monthlyLabel}
            </button>
            <button
              onClick={() => setBillingPeriod("yearly")}
              className={`px-4 sm:px-8 py-2 sm:py-3 rounded-full font-semibold text-sm sm:text-base transition-all relative ${
                billingPeriod === "yearly"
                  ? "bg-[#1A365D] text-white"
                  : "text-gray-600 hover:text-[#1A365D]"
              }`}
            >
              {pricing.header.yearlyLabel}
              <span className="absolute -top-2 -right-1 sm:-right-2 bg-[#2D3748] text-white text-xs px-2 py-1 rounded-full whitespace-nowrap">
                {pricing.header.saveLabel}
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-16">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {plans.map((plan, index) => {
              const Icon = plan.icon;
              return (
                <div
                  key={index}
                  className={`relative rounded-3xl p-8 ${
                    plan.popular
                      ? "bg-gradient-to-br from-[#1A365D] to-[#2D3748] text-white shadow-2xl transform scale-105 border-4 border-[#2D3748]"
                      : "bg-white border-2 border-gray-200 shadow-lg"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-[#1A365D] px-6 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        {region === "latam" ? "MÁS POPULAR" : "MOST POPULAR"}
                      </span>
                    </div>
                  )}

                  <div className="mb-6">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${
                      plan.popular ? "bg-white/20" : "bg-[#2D3748]/10"
                    }`}>
                      <Icon className={`w-7 h-7 ${plan.popular ? "text-white" : "text-[#2D3748]"}`} />
                    </div>
                    <h3 className={`text-3xl font-bold mb-2 ${plan.popular ? "text-white" : "text-[#1A365D]"}`}>
                      {plan.name}
                    </h3>
                    <p className={`text-sm mb-6 ${plan.popular ? "text-white/80" : "text-gray-600"}`}>
                      {plan.focus}
                    </p>

                    <div className="mb-2">
                      <span className="text-5xl font-bold">${calculatePrice(plan.pricePerUnit)}</span>
                      <span className={`text-lg ml-2 ${plan.popular ? "text-white/80" : "text-gray-500"}`}>
                        / {pricing.unitLabel} / {billingPeriod === "monthly" ? (region === "latam" ? "mes" : "month") : (region === "latam" ? "año" : "year")}
                      </span>
                    </div>
                    {billingPeriod === "yearly" && (
                      <p className={`text-sm ${plan.popular ? "text-white/70" : "text-gray-500"}`}>
                        {region === "latam" ? "Facturación anual (20% de ahorro)" : "Billed annually (20% savings)"}
                      </p>
                    )}
                  </div>

                  <Button
                    onClick={() => {
                      if (plan.cta === "Contact Sales" || plan.cta === "Contactar Ventas") {
                        window.location.hash = "demo";
                      } else {
                        window.location.hash = "onboarding";
                      }
                    }}
                    className={`w-full mb-8 ${
                      plan.popular
                        ? "bg-[#16A8B8] text-white hover:bg-[#16A8B8]/90"
                        : "bg-[#2D3748] text-white hover:bg-[#2D3748]/90"
                    }`}
                    size="lg"
                  >
                    {plan.cta}
                  </Button>

                  <ul className="space-y-4">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        {feature.included ? (
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                            plan.popular ? "bg-white/20" : "bg-[#2D3748]/20"
                          }`}>
                            <Check className={`w-3 h-3 ${plan.popular ? "text-white" : "text-[#2D3748]"}`} />
                          </div>
                        ) : (
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                            plan.popular ? "bg-white/10" : "bg-gray-100"
                          }`}>
                            <X className={`w-3 h-3 ${plan.popular ? "text-white/40" : "text-gray-400"}`} />
                          </div>
                        )}
                        <span className={`text-sm ${
                          feature.included
                            ? (plan.popular ? (feature.bold ? "text-white font-semibold" : "text-white") : (feature.bold ? "text-gray-900 font-semibold" : "text-gray-700"))
                            : (plan.popular ? "text-white/40 line-through" : "text-gray-400 line-through")
                        }`}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Setup Fee Banner */}
      <section className="pb-16">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto bg-gradient-to-r from-[#1A365D] to-[#2D3748] rounded-2xl p-8 text-white text-center shadow-xl">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Zap className="w-6 h-6 text-yellow-400" />
              <h3 className="text-2xl font-bold">{pricing.setupFee.title}</h3>
            </div>
            <p className="text-lg text-white/90">
              {pricing.setupFee.description}
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}