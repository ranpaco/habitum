import { Region } from "../context/RegionContext";
import { Shield, Bot, DollarSign, Users } from "lucide-react";

export interface FAQCategory {
  category: string;
  icon: any;
  color: string;
  bgColor: string;
  questions: Array<{
    question: string;
    answer: string;
  }>;
}

export interface RegionalFAQ {
  title: string;
  subtitle: string;
  ctaTitle: string;
  ctaDescription: string;
  ctaButton: string;
  helpText: string;
  scheduleDemoText: string;
  emailText: string;
  categories: FAQCategory[];
}

export const regionalFAQ: Record<Region, RegionalFAQ> = {
  latam: {
    title: "Preguntas Frecuentes",
    subtitle: "Todo lo que necesitas saber sobre Habitum",
    ctaTitle: "¿Aún tienes preguntas?",
    ctaDescription: "Agenda una demo personalizada con nuestro equipo y obtén respuestas a todas tus preguntas",
    ctaButton: "Solicitar Demo",
    helpText: "¿Necesitas ayuda más personalizada?",
    scheduleDemoText: "Agenda una demo con nuestro equipo",
    emailText: "envíanos un email directamente",
    categories: [
      {
        category: "Seguridad y Privacidad",
        icon: Shield,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        questions: [
          {
            question: "¿Mis datos están seguros?",
            answer: "Absolutamente. Usamos encriptación de nivel bancario (AES-256) para todos los datos en reposo y en tránsito. Nuestra infraestructura está alojada en AWS con cumplimiento SOC 2, y realizamos auditorías de seguridad regulares. Tus datos nunca se comparten con terceros y permanecen exclusivamente tuyos."
          },
          {
            question: "¿Dónde se almacenan mis datos?",
            answer: "Todos los datos se almacenan en servidores seguros y encriptados ubicados en centros de datos de AWS con múltiples capas de redundancia. Mantenemos copias de seguridad regulares y tenemos protocolos de recuperación ante desastres para garantizar que tus datos nunca se pierdan."
          },
          {
            question: "¿Quién tiene acceso a la información de mi edificio?",
            answer: "Solo los administradores autorizados de tu condominio tienen acceso a tus datos. Nuestro equipo de soporte solo puede acceder a los datos con permiso explícito y con fines de solución de problemas. Mantenemos registros de acceso detallados para total transparencia."
          },
          {
            question: "¿Cumplimos con las leyes de privacidad de datos?",
            answer: "Sí, Habitum cumple totalmente con GDPR, LGPD (Brasil) y otras regulaciones importantes de privacidad de datos. Proporcionamos herramientas de exportación de datos, capacidades de derecho a eliminación y total transparencia en cómo manejamos la información personal."
          }
        ]
      },
      {
        category: "IA y Funcionalidad",
        icon: Bot,
        color: "text-teal-600",
        bgColor: "bg-teal-50",
        questions: [
          {
            question: "¿Cómo funciona el asistente de IA por WhatsApp?",
            answer: "Nuestro asistente de IA está entrenado en las reglas específicas, reglamentos y procedimientos comunes de tu edificio. Utiliza procesamiento de lenguaje natural para entender las preguntas de los residentes y proporciona respuestas precisas y contextuales 24/7. Puede responder consultas sobre reglas, verificar saldos, registrar solicitudes de mantenimiento y más."
          },
          {
            question: "¿Puede la IA cometer errores?",
            answer: "Si bien nuestra IA es altamente precisa (tasa de éxito del 95%+), está diseñada para escalar preguntas complejas o ambiguas a administradores humanos. Continuamente entrenamos la IA en nuevos escenarios y con tu retroalimentación para mejorar la precisión con el tiempo."
          },
          {
            question: "¿Qué es RAG (Generación Aumentada por Recuperación)?",
            answer: "RAG es una técnica avanzada de IA que permite que nuestro sistema busque en los documentos y reglamentos de tu edificio en tiempo real antes de generar respuestas. Esto garantiza que las respuestas siempre se basen en tus reglas reales, no en información genérica."
          },
          {
            question: "¿Puedo personalizar lo que la IA puede y no puede hacer?",
            answer: "¡Sí! Los administradores tienen control total sobre los permisos de la IA, plantillas de respuesta y reglas de escalamiento. Puedes establecer límites sobre qué preguntas maneja la IA automáticamente versus qué se reenvía para revisión humana."
          }
        ]
      },
      {
        category: "Pagos y Moneda",
        icon: DollarSign,
        color: "text-emerald-600",
        bgColor: "bg-emerald-50",
        questions: [
          {
            question: "¿Cómo maneja la IA diferentes monedas?",
            answer: "Nuestra IA está entrenada para reconocer y procesar pagos en múltiples monedas, específicamente USD y VES (Bolívares Venezolanos). Utiliza tasas de cambio en tiempo real, categoriza automáticamente los pagos de Zelle y Pago Móvil, y puede leer recibos usando tecnología OCR para conciliar transacciones instantáneamente."
          },
          {
            question: "¿Qué métodos de pago son compatibles?",
            answer: "Soportamos todas las plataformas de pago principales comunes en LatAm, incluidos Zelle, Pago Móvil, transferencias bancarias y pagos en efectivo. El sistema puede rastrear pagos a través de todos estos métodos en un panel unificado con soporte multimoneda."
          },
          {
            question: "¿Cómo funciona el escaneo de recibos con OCR?",
            answer: "Simplemente sube una foto de cualquier recibo de pago a través de WhatsApp o el panel web. Nuestra IA extrae automáticamente el monto, fecha, información del pagador y número de referencia, luego lo relaciona con la cuenta de residente correcta. Esto elimina la entrada manual de datos."
          },
          {
            question: "¿Pueden los residentes pagar directamente a través de la app?",
            answer: "Si bien Habitum no procesa pagos directamente (para evitar regulaciones bancarias), proporcionamos instrucciones de pago, códigos QR y detalles de cuenta a los residentes. Luego rastreamos y conciliamos automáticamente cuando se realizan los pagos a través de los canales bancarios existentes."
          }
        ]
      },
      {
        category: "Adopción y Uso",
        icon: Users,
        color: "text-purple-600",
        bgColor: "bg-purple-50",
        questions: [
          {
            question: "¿Cómo se cuentan las unidades para la facturación?",
            answer: "Una 'unidad' se refiere a cada apartamento o espacio residencial individual en tu condominio. Por ejemplo, un edificio con 50 apartamentos se facturaría por 50 unidades. Las áreas comunes, espacios de estacionamiento y unidades de almacenamiento no se cuentan por separado."
          },
          {
            question: "¿Puedo cambiar de plan?",
            answer: "¡Sí! Puedes actualizar o degradar tu plan en cualquier momento. Al actualizar, tendrás acceso inmediato a las nuevas funciones. Al degradar, los cambios surten efecto al inicio de tu próximo ciclo de facturación, y conservarás el acceso a las funciones premium hasta entonces."
          },
          {
            question: "¿Qué sucede durante el proceso de onboarding?",
            answer: "Después de la tarifa única de configuración de $50, nuestra IA digitaliza tus registros existentes (hojas Excel, listas de papel, reglamentos) en minutos. Programamos una llamada de 30 minutos para configurar tus preferencias, luego tienes un sistema completamente funcional con todos los residentes, historial de pagos y reglas cargadas."
          },
          {
            question: "¿Los residentes necesitan instalar una aplicación?",
            answer: "Para el plan Esencial, los residentes solo necesitan WhatsApp, no se requiere instalación de aplicación. Para los planes Profesional y Premium IA, los residentes pueden descargar opcionalmente nuestra aplicación móvil para funciones mejoradas, pero el acceso a WhatsApp permanece disponible para quienes lo prefieran."
          },
          {
            question: "¿Qué pasa si los residentes no usan tecnología?",
            answer: "Nuestra interfaz de WhatsApp está diseñada para ser extremadamente simple: los residentes solo envían mensajes como lo harían con un amigo. Para residentes que no son expertos en tecnología, los familiares pueden interactuar en su nombre, o los administradores pueden manejar las solicitudes manualmente a través del panel de administración."
          },
          {
            question: "¿Ofrecen capacitación y soporte?",
            answer: "¡Sí! Todos los planes incluyen capacitación completa de onboarding para administradores. Proporcionamos tutoriales en video, guías escritas y soporte por chat en vivo. Los planes premium también incluyen soporte telefónico prioritario y un gerente de cuenta dedicado."
          }
        ]
      }
    ]
  },
  usa: {
    title: "Frequently Asked Questions",
    subtitle: "Everything you need to know about Habitum",
    ctaTitle: "Still have questions?",
    ctaDescription: "Schedule a personalized demo with our team and get all your questions answered",
    ctaButton: "Get Custom Quote",
    helpText: "Need more personalized help?",
    scheduleDemoText: "Schedule a demo with our team",
    emailText: "email us directly",
    categories: [
      {
        category: "Security & Privacy",
        icon: Shield,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        questions: [
          {
            question: "Is my data secure?",
            answer: "Absolutely. We use bank-level encryption (AES-256) for all data at rest and in transit. Our infrastructure is hosted on AWS with SOC 2 compliance, and we perform regular security audits. Your data is never shared with third parties and remains exclusively yours."
          },
          {
            question: "Where is my data stored?",
            answer: "All data is stored in secure, encrypted servers located in AWS data centers with multiple redundancy layers. We maintain regular backups and have disaster recovery protocols in place to ensure your data is never lost."
          },
          {
            question: "Who has access to my community's information?",
            answer: "Only authorized board members and administrators from your HOA have access to your data. Our support team can only access data with explicit permission and for troubleshooting purposes. We maintain detailed access logs for full transparency."
          },
          {
            question: "Are we compliant with US data privacy laws?",
            answer: "Yes, Habitum is fully compliant with federal and state data privacy regulations including CCPA (California), GDPR, and other major privacy laws. We provide data export tools, right-to-deletion capabilities, and full transparency in how we handle personal information."
          }
        ]
      },
      {
        category: "AI & Functionality",
        icon: Bot,
        color: "text-teal-600",
        bgColor: "bg-teal-50",
        questions: [
          {
            question: "How does the AI resident portal work?",
            answer: "Our AI assistant is trained on your community's specific CC&Rs, bylaws, and procedures. It uses natural language processing to understand homeowner questions via SMS, email, or the mobile app, providing accurate, contextual responses 24/7. It can answer covenant queries, check account balances, file work orders, and more."
          },
          {
            question: "Can the AI make mistakes?",
            answer: "While our AI is highly accurate (96%+ success rate), it's designed to escalate complex or ambiguous questions to board members and administrators. We continuously train the AI on new scenarios and your feedback to improve accuracy over time."
          },
          {
            question: "What is RAG (Retrieval-Augmented Generation)?",
            answer: "RAG is an advanced AI technique that allows our system to search through your community's governing documents and regulations in real-time before generating answers. This ensures responses are always based on your actual CC&Rs and bylaws, not generic information."
          },
          {
            question: "Can I customize what the AI can and cannot do?",
            answer: "Yes! Board members have full control over AI permissions, response templates, and escalation rules. You can set boundaries for what questions the AI handles automatically versus what gets forwarded to human review."
          }
        ]
      },
      {
        category: "Payments & Currency",
        icon: DollarSign,
        color: "text-emerald-600",
        bgColor: "bg-emerald-50",
        questions: [
          {
            question: "How does automated assessment collection work?",
            answer: "Our system integrates directly with your HOA's bank account via ACH to automatically collect monthly assessments from homeowners. The AI tracks payment status, sends automated reminders for late payments, and generates comprehensive financial reports in real-time."
          },
          {
            question: "What payment methods are supported?",
            answer: "We support ACH bank transfers, credit card payments, and check tracking. The Professional and AI-Premium plans include automated ACH integration with major US banks. The system provides a unified dashboard to track all payment methods."
          },
          {
            question: "How does automated reconciliation work?",
            answer: "Our AI automatically matches incoming payments to homeowner accounts using bank transaction data. It reconciles discrepancies, flags issues, and generates audit-ready reports. This eliminates 95% of manual bookkeeping work."
          },
          {
            question: "Can homeowners pay directly through the portal?",
            answer: "Yes! Homeowners can set up recurring ACH payments or make one-time credit card payments directly through the resident portal. All transactions are secure, PCI-compliant, and automatically recorded in your financial dashboard."
          }
        ]
      },
      {
        category: "Adoption & Usage",
        icon: Users,
        color: "text-purple-600",
        bgColor: "bg-purple-50",
        questions: [
          {
            question: "How are 'doors' counted for billing?",
            answer: "A 'door' refers to each individual home or residential unit in your HOA or COA. For example, a community with 150 homes would be billed for 150 doors. Common areas, amenities, and clubhouses are not counted separately. Minimum monthly fee is $200."
          },
          {
            question: "Can I switch plans?",
            answer: "Yes! You can upgrade or downgrade your plan at any time. When upgrading, you'll have immediate access to new features. When downgrading, changes take effect at the start of your next billing cycle, and you'll retain access to premium features until then."
          },
          {
            question: "What happens during the onboarding process?",
            answer: "After the one-time $299 setup fee, our AI digitizes your existing records (Excel sheets, paper lists, CC&Rs, bylaws) in minutes. We schedule a 30-minute call to configure your preferences, then you have a fully working system with all homeowners, payment history, and governing documents loaded."
          },
          {
            question: "Do homeowners need to install an app?",
            answer: "For the Essential plan, homeowners can access the portal via SMS and email - no app required. For Professional and AI-Premium plans, homeowners can optionally download our mobile app for enhanced features like architectural request submissions and real-time notifications."
          },
          {
            question: "What if homeowners don't use technology?",
            answer: "Our SMS interface is designed to be extremely simple - homeowners just send text messages. For non-tech-savvy homeowners, family members can interact on their behalf, or board members can handle requests manually through the admin dashboard."
          },
          {
            question: "Do you offer training and support?",
            answer: "Yes! All plans include comprehensive onboarding training for board members and administrators. We provide video tutorials, written guides, and live chat support. Premium plans also include priority phone support and a dedicated account manager."
          }
        ]
      }
    ]
  }
};
