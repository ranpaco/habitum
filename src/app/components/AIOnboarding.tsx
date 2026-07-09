import { ScanDocumentIcon } from "./GlassmorphismIcons";
import { Button } from "./ui/button";
import { Check, Upload, Zap, BarChart } from "lucide-react";
import { useRegion } from "../context/RegionContext";

export function AIOnboarding() {
  const { region } = useRegion();

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#16A8B8]/10 to-[#1A365D]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#1A365D]/10 to-[#16A8B8]/10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Visual */}
          <div className="relative">
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-12 shadow-2xl border border-gray-100">
              <ScanDocumentIcon className="w-full h-auto max-w-md mx-auto text-[#1A365D]" />
              
              {/* Floating elements - hidden on mobile */}
              <div className="hidden md:block absolute -top-6 -right-6 bg-white rounded-2xl shadow-xl p-4 border border-[#16A8B8]/20 animate-bounce">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#16A8B8] to-[#1A365D] rounded-lg flex items-center justify-center">
                    <Upload className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Upload docs</div>
                    <div className="text-sm font-bold text-[#1A365D]">Excel, PDF, Photos</div>
                  </div>
                </div>
              </div>

              <div className="hidden md:block absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 border border-[#16A8B8]/20" style={{animationDelay: '1s'}}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">AI Processing</div>
                    <div className="text-sm font-bold text-green-600">Complete in 3 min</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-[#16A8B8]/10 text-[#16A8B8] px-4 py-2 rounded-full text-sm font-semibold">
              <Zap className="w-4 h-4" />
              {region === "usa" ? "Lightning-Fast Setup" : "Configuración Ultra-Rápida"}
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0F3460] leading-tight">
              {region === "usa"
                ? <>AI Onboarding: From <span className="text-[#16A8B8]">Paper to Digital</span> in Minutes</>
                : <>Onboarding con IA: De <span className="text-[#16A8B8]">Papel a Digital</span> en Minutos</>
              }
            </h2>

            <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed">
              {region === "usa"
                ? "Stop wasting weeks manually entering data. Our AI scans your existing Excel sheets, PDFs, and even paper records to build your complete homeowner database automatically."
                : "Deja de perder semanas ingresando datos manualmente. Nuestra IA escanea tus hojas Excel, PDFs e incluso listas escritas a mano para construir tu base de datos completa de residentes automáticamente."
              }
            </p>

            <div className="space-y-4 pt-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#16A8B8] to-[#1A365D] rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-lg">1</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#0F3460] mb-1">
                    {region === "usa" ? "Upload Your Documents" : "Sube tus Documentos"}
                  </h3>
                  <p className="text-gray-600">
                    {region === "usa"
                      ? "Excel spreadsheets, PDFs, photos of paper lists, CC&Rs, community bylaws - whatever you have"
                      : "Hojas Excel, PDFs, fotos de listas en papel, reglamentos - lo que tengas"
                    }
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#16A8B8] to-[#1A365D] rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-lg">2</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#0F3460] mb-1">
                    {region === "usa" ? "AI Does the Heavy Lifting" : "La IA Hace el Trabajo Pesado"}
                  </h3>
                  <p className="text-gray-600">
                    {region === "usa"
                      ? "OCR, NLP, and smart parsing extract homeowner names, addresses, assessments, and community rules"
                      : "OCR, NLP y análisis inteligente extraen nombres de residentes, unidades, saldos y reglamentos"
                    }
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#16A8B8] to-[#1A365D] rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-lg">3</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#0F3460] mb-1">
                    {region === "usa" ? "You're Live!" : "¡Ya Estás en Vivo!"}
                  </h3>
                  <p className="text-gray-600">
                    {region === "usa"
                      ? "Review, confirm, and start managing. Your homeowners can access the portal and submit requests immediately"
                      : "Revisa, confirma y comienza a administrar. Tus residentes pueden chatear con la IA de inmediato"
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Button
                onClick={() => window.location.hash = "onboarding"}
                size="lg"
                className="bg-gradient-to-r from-[#16A8B8] to-[#1A365D] hover:from-[#16A8B8]/90 hover:to-[#1A365D]/90 text-white text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 shadow-lg hover:shadow-xl transition-all"
              >
                <BarChart className="w-5 h-5 mr-2" />
                {region === "usa" ? "Start Free Trial" : "Comenzar Prueba Gratis"}
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 pt-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-[#16A8B8] flex-shrink-0" />
                <span>{region === "usa" ? "One-time $299 setup fee" : "Costo único de $50 USD"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-[#16A8B8] flex-shrink-0" />
                <span>{region === "usa" ? "Average 3-5 minutes" : "Promedio 3-5 minutos"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
