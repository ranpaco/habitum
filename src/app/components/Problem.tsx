import { Clock, AlertTriangle, FileX, MessageSquareOff, CreditCard, Scale } from "lucide-react";
import { useRegion } from "../context/RegionContext";

export function Problem() {
  const { region } = useRegion();

  const problemsLatam = [
    {
      icon: MessageSquareOff,
      title: "La Administración Vive Pegada a WhatsApp",
      description: "Las mismas preguntas sobre saldo, reglas, reservas y averías llegan una y otra vez, interrumpiendo toda la operación."
    },
    {
      icon: CreditCard,
      title: "Cobranza Manual y Multimoneda",
      description: "Zelle, Pago Móvil, transferencias y efectivo terminan en conciliaciones manuales, errores y reclamos por pagos no aplicados."
    },
    {
      icon: Scale,
      title: "Reglamentos Difíciles de Consultar",
      description: "Cuando un vecino pregunta por mascotas, ruido, visitantes o mudanzas, encontrar la respuesta correcta tarda demasiado."
    }
  ];

  const problemsUSA = [
    {
      icon: Clock,
      title: "Too Much Time Spent on Repetitive Owner Questions",
      description: "Boards and managers keep answering the same questions about dues, pets, parking, amenities, and request processes."
    },
    {
      icon: AlertTriangle,
      title: "Records and Rules Are Hard to Search",
      description: "CC&Rs, bylaws, minutes, policies, and notices are scattered across PDFs, folders, email threads, and legacy systems."
    },
    {
      icon: FileX,
      title: "Assessment and Request Workflows Stay Manual",
      description: "Owner balances, delinquencies, approvals, and maintenance requests often live across spreadsheets and fragmented tools."
    }
  ];

  const problems = region === "usa" ? problemsUSA : problemsLatam;

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0F3460] mb-4">
            {region === "usa" ? "Sound Familiar?" : "¿Te Suena Familiar?"}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600">
            {region === "usa" ? "Traditional HOA management is broken. Here's why." : "La administración tradicional de condominios está quebrada. He aquí por qué."}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {problems.map((problem, index) => {
            const Icon = problem.icon;
            return (
              <div 
                key={index}
                className="bg-gray-50 rounded-2xl p-8 text-center hover:shadow-lg transition-shadow border border-gray-100"
              >
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Icon className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-xl font-semibold text-[#0F3460] mb-3">
                  {problem.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {problem.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
