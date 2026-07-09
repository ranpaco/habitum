import { Button } from "./ui/button";
import { ArrowRight, Calendar } from "lucide-react";
import { useRegion } from "../context/RegionContext";

export function CTABanner() {
  const { region } = useRegion();

  return (
    <section className="py-20 bg-gradient-to-r from-[#1A365D] via-[#0F3460] to-[#1A365D] relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#16A8B8] rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#00A3BF] rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            {region === "usa"
              ? "Ready to Transform Your HOA Management?"
              : "¿Listo para Transformar la Administración de Tu Condominio?"
            }
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            {region === "usa"
              ? "Join hundreds of board members and property managers who have already saved 20+ hours per week with Habitum's AI-powered platform."
              : "Únete a cientos de administradores que ya han ahorrado más de 20 horas semanales con la plataforma de IA de Habitum."
            }
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-stretch sm:items-center mb-8">
            <Button
              onClick={() => window.location.hash = "onboarding"}
              size="lg"
              className="bg-white text-[#1A365D] hover:bg-white/90 text-base sm:text-lg px-6 sm:px-10 py-4 sm:py-6 shadow-2xl hover:shadow-3xl transition-all group"
            >
              {region === "usa" ? "Start Free Trial" : "Comenzar Prueba Gratis"}
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>

            <Button
              onClick={() => window.location.hash = "demo"}
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-[#1A365D] text-base sm:text-lg px-6 sm:px-10 py-4 sm:py-6 transition-all group"
            >
              <Calendar className="w-5 h-5 mr-2" />
              {region === "usa" ? "Get Custom Quote" : "Solicitar Demo"}
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-white/80 text-sm">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>{region === "usa" ? "No credit card required" : "Sin tarjeta de crédito"}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>{region === "usa" ? "Setup in under 5 minutes" : "Configuración en menos de 5 minutos"}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>{region === "usa" ? "Cancel anytime" : "Cancela cuando quieras"}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
