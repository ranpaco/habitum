import { Region } from "../context/RegionContext";

export interface RegionalContent {
  hero: {
    headline: string;
    subheadline: string;
    ctaPrimary: string;
    ctaSecondary: string;
    feature1: string;
    feature2: string;
  };
  features: {
    feature1: {
      title: string;
      description: string;
      benefits: string[];
    };
    feature2: {
      title: string;
      description: string;
      benefits: string[];
    };
    feature3: {
      title: string;
      description: string;
      benefits: string[];
    };
  };
  examples: {
    eyebrow: string;
    title: string;
    subtitle: string;
    audience1: {
      title: string;
      items: Array<{
        problem: string;
        solution: string;
      }>;
    };
    audience2: {
      title: string;
      items: Array<{
        problem: string;
        solution: string;
      }>;
    };
  };
  showcase: {
    eyebrow: string;
    title: string;
    subtitle: string;
    cards: Array<{
      title: string;
      role: string;
      before: string;
      after: string;
      imageSrc: string;
      imageAlt: string;
    }>;
    outcomesTitle: string;
    outcomes: string[];
  };
  imagery: {
    buildingType: "highrise" | "suburban";
    iconSet: "whatsapp" | "omnichannel";
  };
}

export const regionalContent: Record<Region, RegionalContent> = {
  latam: {
    hero: {
      headline: "IA para administrar condominios y responder a tus vecinos por WhatsApp.",
      subheadline:
        "Habitum digitaliza Excel, PDFs y listas en papel para que la administración cobre mejor, responda más rápido y gestione reglamentos, solicitudes y saldos desde un solo sistema.",
      ctaPrimary: "Comenzar Onboarding Gratis",
      ctaSecondary: "Solicitar Demo",
      feature1: "Sin tarjeta de crédito",
      feature2: "Prueba gratis 30 días",
    },
    features: {
      feature1: {
        title: "Asistente Inteligente 24/7",
        description: "Respuestas automáticas sobre el reglamento interno y reservas de áreas comunes directamente por WhatsApp.",
        benefits: [
          "Respuestas instantáneas a consultas de residentes",
          "Base de conocimiento de reglas y normativas",
          "Automatización de solicitudes de mantenimiento",
          "Consultas de saldo y recordatorios de pago",
        ],
      },
      feature2: {
        title: "Conciliación Multimoneda",
        description: "Procesamiento automático de transferencias, Pago Móvil y Zelle. Cuentas claras en dólares y moneda local.",
        benefits: [
          "Soporte para Zelle y Pago Móvil",
          "Procesamiento automático de recibos con OCR",
          "Actualización de tasas de cambio en tiempo real",
          "Automatización de conciliación de pagos",
        ],
      },
      feature3: {
        title: "Digitalización en 10 Minutos",
        description: "Sube tus listas de Excel o fotos de papel. Nuestra IA estructura toda la data de residentes al instante.",
        benefits: [
          "Carga masiva de residentes con un solo archivo",
          "Extracción inteligente de datos desde PDFs y fotos",
          "Validación automática de información",
          "Configuración completa en menos de 10 minutos",
        ],
      },
    },
    examples: {
      eyebrow: "Ejemplos Claros",
      title: "Qué Problemas Resolvemos en la Operación Diaria",
      subtitle: "No vendemos solo software. Resolvemos tareas repetitivas y atrasos reales para la administración y para los vecinos.",
      audience1: {
        title: "Para administradores de condominios y juntas",
        items: [
          {
            problem: "Pasas horas respondiendo por WhatsApp: \"¿cuánto debo?\", \"¿se puede tener mascotas?\", \"¿cómo reservo el salón?\"",
            solution: "Habitum responde automáticamente con base en el reglamento, el saldo y las reglas del edificio.",
          },
          {
            problem: "Te mandan comprobantes por Zelle, transferencias y Pago Móvil y luego toca revisar todo manualmente.",
            solution: "Habitum centraliza la cobranza, identifica pagos y deja una vista clara de quién pagó, cuánto falta y qué revisar.",
          },
          {
            problem: "Tus datos están en Excel, PDFs y fotos de listas impresas.",
            solution: "Habitum digitaliza unidades, propietarios, saldos y reglamentos en minutos para empezar a operar sin cargar todo a mano.",
          },
        ],
      },
      audience2: {
        title: "Para propietarios, vecinos y residentes",
        items: [
          {
            problem: "No sabes cuánto debes ni a qué cuenta pagar.",
            solution: "Pueden consultar saldo, métodos de pago y confirmación de pagos sin esperar a que la administración responda.",
          },
          {
            problem: "No consigues rápido las reglas del edificio.",
            solution: "Pueden preguntar directamente si se permiten mascotas, mudanzas, reservas, ruido o visitantes y recibir una respuesta basada en el reglamento.",
          },
          {
            problem: "Reportar una avería o hacer una solicitud implica cadenas largas de mensajes.",
            solution: "Pueden registrar solicitudes y recibir seguimiento desde un canal simple como WhatsApp.",
          },
        ],
      },
    },
    showcase: {
      eyebrow: "Escenas Operativas",
      title: "Así Se Ve el Problema Real en un Condominio",
      subtitle: "Mostramos situaciones concretas que hoy se resuelven con mensajes, papeles y seguimiento manual, y cómo Habitum las ordena.",
      cards: [
        {
          title: "Cobranza y saldos por WhatsApp",
          role: "Administración",
          before: "La administración recibe preguntas de saldo y comprobantes de pago por distintos chats, y luego revisa manualmente qué pago corresponde a qué vecino.",
          after: "Habitum centraliza saldos, pagos y seguimiento para que responder cuánto debe cada vecino deje de ser trabajo manual.",
          imageSrc: "https://images.unsplash.com/photo-1556155092-490a1ba16284?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGF0c2FwcCUyMHBob25lJTIwY2hhdHxlbnwxfHx8fDE3Nzc5MjQ0MDB8MA&ixlib=rb-4.1.0&q=80&w=1080",
          imageAlt: "Phone chat representing payment and balance questions",
        },
        {
          title: "Reglamentos que nadie consigue rápido",
          role: "Vecinos y propietarios",
          before: "Cuando alguien pregunta por mascotas, mudanzas, ruido o reservas, toca buscar el reglamento correcto entre PDFs, fotos o carpetas viejas.",
          after: "Habitum digitaliza reglamentos y responde más rápido con base en las reglas reales del edificio.",
          imageSrc: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N1bWVudHMlMjBvZmZpY2V8ZW58MXx8fHwxNzc3OTI0NDI5fDA&ixlib=rb-4.1.0&q=80&w=1080",
          imageAlt: "Documents and paperwork representing building regulations",
        },
        {
          title: "Solicitudes y averías sin seguimiento claro",
          role: "Operación diaria",
          before: "Las solicitudes entran por chat, notas de voz o llamadas, pero luego es difícil saber qué se atendió, qué falta y quién está esperando respuesta.",
          after: "Habitum ayuda a registrar, clasificar y dar seguimiento a solicitudes desde un flujo más claro para la administración y el vecino.",
          imageSrc: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbmdpbmVlciUyMGJ1aWxkaW5nJTIwbWFpbnRlbmFuY2V8ZW58MXx8fHwxNzc3OTI0NDYxfDA&ixlib=rb-4.1.0&q=80&w=1080",
          imageAlt: "Building maintenance inspection",
        },
      ],
      outcomesTitle: "Qué cambia después del onboarding",
      outcomes: [
        "Menos tiempo respondiendo preguntas repetidas",
        "Más claridad en cobranza, reglas y solicitudes",
        "Un solo sistema en vez de chats, PDFs y Excels separados",
      ],
    },
    imagery: {
      buildingType: "highrise",
      iconSet: "whatsapp",
    },
  },
  usa: {
    hero: {
      headline: "AI for HOA boards, managers, and homeowners.",
      subheadline:
        "Habitum turns spreadsheets, PDFs, and governing documents into a working HOA system for assessments, homeowner questions, rules, requests, and day-to-day board operations.",
      ctaPrimary: "Start My Free Trial",
      ctaSecondary: "Get A Custom Quote",
      feature1: "No credit card required",
      feature2: "Free 30-day trial",
    },
    features: {
      feature1: {
        title: "24/7 Smart Resident Portal",
        description: "AI-powered support via SMS, Email, and Mobile App for 24/7 resident engagement",
        benefits: [
          "Multi-channel support (SMS, Email, App)",
          "Instant answers to community guidelines",
          "Automated work order management",
          "Real-time communication hub",
        ],
      },
      feature2: {
        title: "Automated Assessment Collection",
        description: "Seamless bank integration with automated assessments and audit-ready reporting",
        benefits: [
          "Direct bank account integration (ACH)",
          "Automated HOA fee collection",
          "Real-time financial dashboards",
          "Compliance-ready audit trails",
        ],
      },
      feature3: {
        title: "Covenant Enforcement & Reporting",
        description: "AI-assisted tracking of violations and community rule enforcement",
        benefits: [
          "Vendor performance tracking and ratings",
          "Automated violation detection and notices",
          "Work order lifecycle management",
          "Community standards enforcement",
        ],
      },
    },
    examples: {
      eyebrow: "Clear Examples",
      title: "What Problems We Solve Day to Day",
      subtitle: "This is not generic HOA software. It is built for the repetitive work boards, managers, and homeowners deal with every week.",
      audience1: {
        title: "For HOA boards and management companies",
        items: [
          {
            problem: "Your team keeps answering the same questions: balance inquiries, pet rules, parking rules, architectural requests, pool access.",
            solution: "Habitum gives homeowners instant answers based on governing documents, account data, and community rules.",
          },
          {
            problem: "Assessment collections, late fees, and owner ledgers live across spreadsheets, portals, and manual follow-up.",
            solution: "Habitum centralizes owner balances and gives management a clear operating view of delinquencies, payments, and follow-up.",
          },
          {
            problem: "Board records, bylaws, minutes, and policies are hard to search when residents need answers.",
            solution: "Habitum digitizes your governing documents so the system can answer faster and route uncertain cases to human review.",
          },
        ],
      },
      audience2: {
        title: "For homeowners and residents",
        items: [
          {
            problem: "Homeowners often ask: What do I owe, which rule applies, and what do I need to submit for approval?",
            solution: "With Habitum, homeowners get clear answers about dues, rules, and approval steps in one place, based on the HOA's own documents and account data.",
          },
          {
            problem: "Submitting maintenance issues or architectural requests feels slow and unclear.",
            solution: "Habitum helps route requests, explain required documents, and reduce back-and-forth with management.",
          },
          {
            problem: "Important information is buried in emails, PDFs, and old board packets.",
            solution: "Habitum surfaces the relevant policy or rule quickly instead of forcing homeowners to search through documents manually.",
          },
        ],
      },
    },
    showcase: {
      eyebrow: "Operational Scenarios",
      title: "What the Daily HOA Problem Actually Looks Like",
      subtitle: "These are the kinds of workflows boards, managers, and homeowners deal with every week, and where Habitum fits clearly.",
      cards: [
        {
          title: "Homeowner questions keep hitting the office",
          role: "Boards and management",
          before: "Managers keep getting the same questions about dues, parking, pets, pool rules, and next steps, even when the answers already exist in the governing documents.",
          after: "Habitum turns those documents into a faster answer layer so routine homeowner questions stop becoming manual office work.",
          imageSrc: "https://images.unsplash.com/photo-1556740749-887f6717d7e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXN0b21lciUyMHNlcnZpY2UlMjBjb21wdXRlcnxlbnwxfHx8fDE3Nzc5MjQ1MTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
          imageAlt: "Management desk handling resident questions",
        },
        {
          title: "Rules and board records are buried in PDFs",
          role: "Homeowners and residents",
          before: "CC&Rs, bylaws, policies, and meeting records are often scattered across folders, old board packets, and email attachments.",
          after: "Habitum makes governing documents easier to surface so homeowners can get answers without digging through files manually.",
          imageSrc: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib2FyZCUyMG1lZXRpbmclMjBkb2N1bWVudHN8ZW58MXx8fHwxNzc3OTI0NTQxfDA&ixlib=rb-4.1.0&q=80&w=1080",
          imageAlt: "Board meeting and document review",
        },
        {
          title: "Assessments, requests, and follow-up stay fragmented",
          role: "Operations",
          before: "Owner balances, follow-up, approvals, and service requests often live across spreadsheets, portals, email threads, and manual reminders.",
          after: "Habitum gives management a more unified operating view so collections and homeowner workflows are easier to track.",
          imageSrc: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGRhc2hib2FyZHxlbnwxfHx8fDE3Nzc5MjQ1NzF8MA&ixlib=rb-4.1.0&q=80&w=1080",
          imageAlt: "Operations dashboard and financial tracking",
        },
      ],
      outcomesTitle: "What changes after onboarding",
      outcomes: [
        "Fewer repetitive homeowner questions hitting staff",
        "More visibility into dues, requests, and governing documents",
        "A clearer operating workflow for boards and managers",
      ],
    },
    imagery: {
      buildingType: "suburban",
      iconSet: "omnichannel",
    },
  },
};
