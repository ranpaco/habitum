import { FileText, Cloud, Smartphone, ArrowRight, Sparkles } from "lucide-react";
import { useRegion } from "../context/RegionContext";

export function Solution() {
  const { region } = useRegion();

  return (
    <section className="py-20 bg-gradient-to-br from-[#0F3460] via-[#1A365D] to-[#16A8B8] text-white relative overflow-hidden">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 10}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          ></div>
        ))}
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-yellow-300 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Sparkles className="w-4 h-4" />
            {region === "usa" ? "The AI Magic" : "La Magia de la IA"}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            {region === "usa" ? "From Onboarding to Optimized in Minutes" : "Onboarding Sin Fricción"}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-white/90">
            {region === "usa"
              ? "Upload your paper files, PDFs, or Excel sheets. Our AI instantly digitizes community rules, homeowner records, and accounts receivable. ZERO manual data entry."
              : "Transforma el caos de tus archivos físicos en claridad digital"
            }
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Transformation Flow */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
            {/* Paper */}
            <div className="flex-1 text-center group">
              <div className="w-28 h-28 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-4 transform group-hover:scale-110 transition-all border border-white/20 shadow-2xl">
                <FileText className="w-14 h-14 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{region === "usa" ? "Physical Paper" : "Papel Físico"}</h3>
              <p className="text-white/80 text-sm">{region === "usa" ? "Excel sheets, printed lists, handwritten notes" : "Hojas Excel, listas impresas, notas manuscritas"}</p>
            </div>

            {/* Arrow */}
            <div className="hidden md:block">
              <ArrowRight className="w-12 h-12 text-white/60 animate-pulse" />
            </div>

            {/* Cloud Processing */}
            <div className="flex-1 text-center group">
              <div className="relative w-28 h-28 bg-gradient-to-br from-[#16A8B8] to-[#1A365D] rounded-2xl flex items-center justify-center mx-auto mb-4 transform group-hover:scale-110 transition-all shadow-2xl">
                <Cloud className="w-14 h-14 text-white" />
                <div className="absolute inset-0 bg-white/20 rounded-2xl blur-xl animate-pulse"></div>
              </div>
              <h3 className="text-xl font-semibold mb-2">{region === "usa" ? "AI Processing" : "Procesamiento IA"}</h3>
              <p className="text-white/80 text-sm">{region === "usa" ? "Intelligent data extraction & validation" : "Extracción y validación inteligente de datos"}</p>
            </div>

            {/* Arrow */}
            <div className="hidden md:block">
              <ArrowRight className="w-12 h-12 text-white/60 animate-pulse" style={{animationDelay: '0.5s'}} />
            </div>

            {/* Digital Output */}
            <div className="flex-1 text-center group">
              <div className="w-28 h-28 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-4 transform group-hover:scale-110 transition-all border border-white/20 shadow-2xl">
                <Smartphone className="w-14 h-14 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{region === "usa" ? "Digital System" : "Sistema Digital"}</h3>
              <p className="text-white/80 text-sm">{region === "usa" ? "Clean, structured, ready-to-use data" : "Data limpia, estructurada y lista para usar"}</p>
            </div>
          </div>

          {/* Time Badge */}
          <div className="text-center">
            <div className="inline-block bg-white/10 backdrop-blur-md rounded-2xl px-6 sm:px-10 py-4 sm:py-6 border-2 border-white/30 shadow-2xl">
              <p className="text-xl sm:text-2xl md:text-3xl font-bold">
                {region === "usa"
                  ? <>Paper to Digital in <span className="text-yellow-300 bg-yellow-300/20 px-2 sm:px-3 py-1 rounded-lg">10 Minutes</span></>
                  : <>De Papel a Digital en <span className="text-yellow-300 bg-yellow-300/20 px-2 sm:px-3 py-1 rounded-lg">10 Minutos</span></>
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-20px) translateX(10px); }
        }
      `}</style>
    </section>
  );
}