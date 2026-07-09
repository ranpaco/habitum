import { Check, X } from "lucide-react";
import { Button } from "./ui/button";

export function Pricing() {
  const plans = [
    {
      name: "Basic",
      subtitle: "WhatsApp Only",
      price: "49",
      period: "per month",
      description: "Perfect for small condominiums starting their digital journey",
      features: [
        { text: "24/7 AI WhatsApp Assistant", included: true },
        { text: "Basic rule queries", included: true },
        { text: "Payment reminders", included: true },
        { text: "Up to 20 units", included: true },
        { text: "Web dashboard access", included: false },
        { text: "Multicurrency payments", included: false },
        { text: "Advanced analytics", included: false },
        { text: "OCR receipt scanning", included: false }
      ],
      popular: false,
      cta: "Start Free Trial"
    },
    {
      name: "Pro",
      subtitle: "App + Dashboard",
      price: "149",
      period: "per month",
      description: "Most popular for medium-sized condominiums",
      features: [
        { text: "Everything in Basic", included: true },
        { text: "Full web dashboard access", included: true },
        { text: "Multicurrency (USD/VES) support", included: true },
        { text: "Zelle & Pago Móvil integration", included: true },
        { text: "Up to 100 units", included: true },
        { text: "Basic OCR receipt scanning", included: true },
        { text: "Advanced analytics", included: false },
        { text: "Priority support", included: false }
      ],
      popular: true,
      cta: "Start Free Trial"
    },
    {
      name: "Premium",
      subtitle: "Advanced AI Accounting",
      price: "349",
      period: "per month",
      description: "Complete solution for large properties",
      features: [
        { text: "Everything in Pro", included: true },
        { text: "Advanced AI accounting", included: true },
        { text: "Unlimited units", included: true },
        { text: "Advanced OCR receipt scanning", included: true },
        { text: "Custom integrations", included: true },
        { text: "Advanced analytics & reports", included: true },
        { text: "Priority 24/7 support", included: true },
        { text: "Dedicated account manager", included: true }
      ],
      popular: false,
      cta: "Contact Sales"
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#0F3460] mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600">
            Choose the perfect plan for your condominium size
          </p>
          <div className="mt-6">
            <span className="inline-block bg-[#16A8B8]/10 text-[#16A8B8] px-6 py-2 rounded-full font-semibold">
              All plans include 30-day free trial
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`relative rounded-3xl p-8 ${
                plan.popular 
                  ? 'bg-gradient-to-br from-[#0F3460] to-[#16A8B8] text-white shadow-2xl transform scale-105' 
                  : 'bg-white border border-gray-200 shadow-lg'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-yellow-400 text-[#0F3460] px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                    MOST POPULAR
                  </span>
                </div>
              )}

              <div className="mb-8">
                <h3 className={`text-2xl font-bold mb-1 ${plan.popular ? 'text-white' : 'text-[#0F3460]'}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm mb-6 ${plan.popular ? 'text-white/80' : 'text-gray-500'}`}>
                  {plan.subtitle}
                </p>
                
                <div className="mb-4">
                  <span className="text-5xl font-bold">${plan.price}</span>
                  <span className={`text-lg ml-2 ${plan.popular ? 'text-white/80' : 'text-gray-500'}`}>
                    /{plan.period}
                  </span>
                </div>
                
                <p className={`text-sm ${plan.popular ? 'text-white/90' : 'text-gray-600'}`}>
                  {plan.description}
                </p>
              </div>

              <Button 
                className={`w-full mb-8 ${
                  plan.popular 
                    ? 'bg-white text-[#0F3460] hover:bg-gray-100' 
                    : 'bg-[#16A8B8] text-white hover:bg-[#16A8B8]/90'
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
                        plan.popular ? 'bg-white/20' : 'bg-[#16A8B8]/20'
                      }`}>
                        <Check className={`w-3 h-3 ${plan.popular ? 'text-white' : 'text-[#16A8B8]'}`} />
                      </div>
                    ) : (
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                        plan.popular ? 'bg-white/10' : 'bg-gray-100'
                      }`}>
                        <X className={`w-3 h-3 ${plan.popular ? 'text-white/40' : 'text-gray-400'}`} />
                      </div>
                    )}
                    <span className={`text-sm ${
                      feature.included 
                        ? (plan.popular ? 'text-white' : 'text-gray-700')
                        : (plan.popular ? 'text-white/40' : 'text-gray-400')
                    }`}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-4">All plans include free updates and support</p>
          <p className="text-sm text-gray-500">
            Need a custom plan for multiple properties? <a href="#" className="text-[#16A8B8] underline">Contact our sales team</a>
          </p>
        </div>
      </div>
    </section>
  );
}
