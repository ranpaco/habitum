import { Star, Quote } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useRegion } from "../context/RegionContext";

export function Trust() {
  const { region } = useRegion();

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0F3460] mb-4">
            {region === "usa"
              ? "Trusted by HOA Boards and Property Managers Across America"
              : "Confiado por Administradores de Condominios en toda LatAm"
            }
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600">
            {region === "usa"
              ? "Join hundreds of satisfied community associations"
              : "Únete a cientos de administradores satisfechos"
            }
          </p>
        </div>

        {/* Testimonial Card */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl border border-gray-100 relative">
            <Quote className="hidden sm:block absolute top-8 right-8 w-12 h-12 md:w-16 md:h-16 text-[#16A8B8]/20" />

            <div className="flex flex-col md:flex-row gap-6 sm:gap-8 items-center">
              <div className="flex-shrink-0">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1770627000564-3feb36aecbcd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMHByb2Zlc3Npb25hbCUyMHdvbWFuJTIwYWRtaW5pc3RyYXRvcnxlbnwxfHx8fDE3NzMxMTE5NDh8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Administrator testimonial"
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
              </div>

              <div className="flex-1">
                <div className="flex gap-1 mb-4 justify-center md:justify-start">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-6 leading-relaxed italic text-center md:text-left">
                  {region === "usa"
                    ? "This platform reduced my workload by 65%. The AI resident portal handles most homeowner inquiries automatically, and the automated assessment collection has increased our collection rate to 98%. I can finally focus on strategic initiatives instead of drowning in admin tasks."
                    : "Esta plataforma redujo mi carga de trabajo en un 60%. El asistente de IA por WhatsApp maneja la mayoría de las consultas de los residentes automáticamente, y el sistema de pagos multimoneda es revolucionario para nuestro edificio. Finalmente puedo concentrarme en lo que importa en lugar de ahogarme en tareas administrativas."
                  }
                </p>

                <div className="text-center md:text-left">
                  <p className="font-semibold text-[#0F3460] text-base sm:text-lg">
                    {region === "usa" ? "Jennifer Morrison" : "María Fernández"}
                  </p>
                  <p className="text-sm sm:text-base text-gray-600">
                    {region === "usa" ? "HOA Board President, Austin, TX" : "Administradora de Condominio, Caracas"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Logo Placeholder Section */}
        <div className="text-center">
          <p className="text-gray-500 mb-8">
            {region === "usa" ? "Trusted by leading condominiums" : "Confiado por condominios líderes"}
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-50">
            {[1, 2, 3, 4].map((i) => (
              <div 
                key={i}
                className="h-20 bg-gray-100 rounded-xl flex items-center justify-center border border-gray-200"
              >
                <span className="text-gray-400 font-semibold">HOA Logo {i}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid sm:grid-cols-3 gap-6 sm:gap-8">
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-[#16A8B8] mb-2">{region === "usa" ? "800+" : "500+"}</div>
            <div className="text-sm sm:text-base text-gray-600">{region === "usa" ? "Communities Managed" : "Condominios Administrados"}</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-[#16A8B8] mb-2">{region === "usa" ? "65%" : "60%"}</div>
            <div className="text-sm sm:text-base text-gray-600">{region === "usa" ? "Time Saved on Average" : "Tiempo Ahorrado en Promedio"}</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-[#16A8B8] mb-2">24/7</div>
            <div className="text-sm sm:text-base text-gray-600">{region === "usa" ? "AI Portal Available" : "Soporte IA Disponible"}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
