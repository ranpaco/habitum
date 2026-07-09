import { Zap, Shield, Clock } from "lucide-react";
import {
  WhatsAppAIIcon,
  DualCurrencyIcon,
  ScanDocumentIcon,
  OmnichannelIcon,
  FinancialComplianceIcon,
  VendorManagementIcon,
} from "./GlassmorphismIcons";
import { AIDataGlow } from "./AIDataGlow";
import { useRegion } from "../context/RegionContext";
import { regionalContent } from "../config/regionalContent";

export function Features() {
  const { region } = useRegion();
  const content = regionalContent[region].features;

  const features = [
    {
      icon: region === "latam" ? WhatsAppAIIcon : OmnichannelIcon,
      title: content.feature1.title,
      description: content.feature1.description,
      benefits: content.feature1.benefits,
      color: "from-[#16A8B8] to-[#1A365D]",
    },
    {
      icon: region === "latam" ? DualCurrencyIcon : FinancialComplianceIcon,
      title: content.feature2.title,
      description: content.feature2.description,
      benefits: content.feature2.benefits,
      color: "from-emerald-500 to-teal-500",
    },
    {
      icon: region === "latam" ? ScanDocumentIcon : VendorManagementIcon,
      title: content.feature3.title,
      description: content.feature3.description,
      benefits: content.feature3.benefits,
      color: "from-[#1A365D] to-purple-600",
    },
  ];

  const additionalFeatures = region === "usa"
    ? [
        { icon: Zap, text: "Lightning-fast setup" },
        { icon: Shield, text: "Bank-level security" },
        { icon: Clock, text: "Save 60% of admin time" }
      ]
    : [
        { icon: Zap, text: "Configuración ultra-rápida" },
        { icon: Shield, text: "Seguridad nivel bancario" },
        { icon: Clock, text: "Ahorra 60% de tiempo" }
      ];

  return (
    <section id="features" className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      <AIDataGlow />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0F3460] mb-4">
            {region === "usa" ? "Everything You Need to Manage Your HOA" : "Todo lo que Necesitas para Administrar tu Condominio"}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600">
            {region === "usa" ? "Powerful features designed for modern community associations" : "Funcionalidades poderosas diseñadas para administradores modernos"}
          </p>
        </div>

        {/* Main Feature Cards */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all border border-gray-100 hover:border-[#16A8B8]/30 group"
              >
                <div className="mb-6 transform group-hover:scale-110 transition-transform">
                  <Icon className="w-20 h-20 text-[#1A365D]" />
                </div>
                
                <h3 className="text-2xl font-semibold text-[#0F3460] mb-3">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {feature.description}
                </p>

                <ul className="space-y-3">
                  {feature.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-700">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#16A8B8] to-[#1A365D] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      </div>
                      <span className="text-sm">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Additional Features Bar */}
        <div className="bg-gradient-to-br from-[#1A365D] to-[#2D3748] rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="grid sm:grid-cols-3 gap-6 sm:gap-8">
            {additionalFeatures.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="flex items-center gap-3 sm:gap-4 justify-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#16A8B8]" />
                  </div>
                  <span className="text-base sm:text-lg font-semibold text-white">{item.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}