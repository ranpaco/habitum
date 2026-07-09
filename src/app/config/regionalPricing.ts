import { Region } from "../context/RegionContext";
import { MessageCircle, BarChart3, Crown } from "lucide-react";

export interface PricingPlan {
  name: string;
  focus: string;
  pricePerUnit: number;
  icon: any;
  features: Array<{ text: string; included: boolean; bold?: boolean }>;
  cta: string;
  popular: boolean;
}

export interface RegionalPricing {
  header: {
    title: string;
    subtitle: string;
    monthlyLabel: string;
    yearlyLabel: string;
    saveLabel: string;
  };
  plans: PricingPlan[];
  setupFee: {
    title: string;
    description: string;
  };
  unitLabel: string;
  comparisonTitle: string;
}

export const regionalPricing: Record<Region, RegionalPricing> = {
  latam: {
    header: {
      title: "Precios transparentes para comunidades de todo tamaño.",
      subtitle: "Planes escalables diseñados para edificios de cualquier tamaño. Paga solo por lo que usas.",
      monthlyLabel: "Mensual",
      yearlyLabel: "Anual",
      saveLabel: "Ahorra 20%",
    },
    plans: [
      {
        name: "Esencial",
        focus: "La solución basada en WhatsApp para edificios pequeños.",
        pricePerUnit: 0.5,
        icon: MessageCircle,
        features: [
          { text: "Bot de WhatsApp con IA", included: true },
          { text: "Control de Deuda Básico", included: true },
          { text: "Cartelera Digital", included: true },
          { text: "1GB Almacenamiento", included: true },
          { text: "App Móvil para Vecinos", included: false },
          { text: "Dashboard Web para Administración", included: false },
          { text: "Conciliación Multimoneda", included: false },
          { text: "Conciliación Bancaria 100% IA", included: false },
        ],
        cta: "Elegir Esencial",
        popular: false,
      },
      {
        name: "Profesional",
        focus: "Transformación digital completa para condominios modernos.",
        pricePerUnit: 1.0,
        icon: BarChart3,
        features: [
          { text: "Todo lo del Plan Esencial", included: true, bold: true },
          { text: "App Móvil para Vecinos", included: true },
          { text: "Dashboard Web para Administración", included: true },
          { text: "Asistente IA de Reglamentos (RAG)", included: true },
          { text: "10GB Almacenamiento", included: true },
          { text: "Conciliación Multimoneda", included: true },
          { text: "Conciliación Bancaria 100% IA", included: false },
          { text: "Acceso API", included: false },
        ],
        cta: "Ir al Plan Pro",
        popular: true,
      },
      {
        name: "Premium IA",
        focus: "Automatización total y análisis avanzado.",
        pricePerUnit: 1.8,
        icon: Crown,
        features: [
          { text: "Todo lo del Plan Pro", included: true, bold: true },
          { text: "Conciliación Bancaria 100% IA", included: true },
          { text: "Auditoría Legal Automatizada", included: true },
          { text: "Almacenamiento Ilimitado", included: true },
          { text: "Soporte Prioritario", included: true },
          { text: "Acceso API", included: true },
          { text: "Account Manager Dedicado", included: true },
          { text: "Integraciones Personalizadas", included: true },
        ],
        cta: "Contactar Ventas",
        popular: false,
      },
    ],
    setupFee: {
      title: "Costo Único de Implementación (Setup Fee): Desde $50 USD",
      description:
        "Incluye la digitalización express de todos tus reglamentos y residentes con IA. Cero trabajo manual para tu Junta.",
    },
    unitLabel: "unidad",
    comparisonTitle: "Comparación Detallada de Características",
  },
  usa: {
    header: {
      title: "Transparent Pricing for Thriving Communities.",
      subtitle: "Scalable plans designed for buildings of all sizes. Only pay for what you use.",
      monthlyLabel: "Monthly",
      yearlyLabel: "Yearly",
      saveLabel: "Save 20%",
    },
    plans: [
      {
        name: "Essential",
        focus: "Core features for small community associations.",
        pricePerUnit: 1.5,
        icon: MessageCircle,
        features: [
          { text: "Smart Resident Portal (SMS/Email)", included: true },
          { text: "Basic Assessment Tracking", included: true },
          { text: "Digital Notice Board", included: true },
          { text: "5GB Storage", included: true },
          { text: "Homeowner Mobile App", included: false },
          { text: "Admin Web Dashboard", included: false },
          { text: "ACH Payment Integration", included: false },
          { text: "AI Bank Reconciliation", included: false },
        ],
        cta: "Start with Essential",
        popular: false,
      },
      {
        name: "Professional",
        focus: "Complete digital transformation for modern HOAs.",
        pricePerUnit: 2.5,
        icon: BarChart3,
        features: [
          { text: "Everything in Essential", included: true, bold: true },
          { text: "Homeowner Mobile App", included: true },
          { text: "Admin Web Dashboard", included: true },
          { text: "AI Covenant Assistant", included: true },
          { text: "25GB Storage", included: true },
          { text: "ACH Payment Integration", included: true },
          { text: "AI Bank Reconciliation", included: false },
          { text: "API Access", included: false },
        ],
        cta: "Go Professional",
        popular: true,
      },
      {
        name: "AI-Premium",
        focus: "Maximum automation for large managed communities.",
        pricePerUnit: 4.5,
        icon: Crown,
        features: [
          { text: "Everything in Professional", included: true, bold: true },
          { text: "AI Bank Reconciliation", included: true },
          { text: "Legal Compliance AI", included: true },
          { text: "Unlimited Storage", included: true },
          { text: "Priority Support", included: true },
          { text: "API Access", included: true },
          { text: "Dedicated Account Manager", included: true },
          { text: "Custom Integrations", included: true },
        ],
        cta: "Contact Sales",
        popular: false,
      },
    ],
    setupFee: {
      title: "One-time Onboarding Fee: $299",
      description:
        "We use AI to digitize your old records, homeowner lists, CC&Rs, and bylaws in minutes. Zero manual work for you. Minimum monthly fee: $200.",
    },
    unitLabel: "door",
    comparisonTitle: "Detailed Feature Comparison",
  },
};
