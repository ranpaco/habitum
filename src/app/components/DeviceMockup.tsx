import { useRegion } from "../context/RegionContext";

export function DeviceMockup() {
  const { region } = useRegion();

  const desktop = region === "usa"
    ? {
        title: "HOA Operating Console",
        subtitle: "Board + management",
        metrics: [
          { label: "Open owner questions", value: "18", accent: "text-yellow-300" },
          { label: "Paid this week", value: "$42K", accent: "text-emerald-300" },
          { label: "ARB in review", value: "6", accent: "text-sky-300" },
        ],
        cards: [
          {
            title: "Questions auto-resolved",
            rows: [
              "Pet policy answered from CC&Rs",
              "Pool guest rule sent instantly",
              "Parking restriction cited with policy",
            ],
          },
          {
            title: "Owner operations",
            rows: [
              "Delinquency list prioritized",
              "Late-fee follow-up ready",
              "Board packet docs searchable",
            ],
          },
        ],
      }
    : {
        title: "Centro de Operaciones",
        subtitle: "Administracion + junta",
        metrics: [
          { label: "Consultas resueltas", value: "42", accent: "text-emerald-300" },
          { label: "Cobranza del mes", value: "94%", accent: "text-sky-300" },
          { label: "Casos por revisar", value: "7", accent: "text-yellow-300" },
        ],
        cards: [
          {
            title: "WhatsApp automatizado",
            rows: [
              "Saldo enviado al vecino",
              "Regla de mascotas respondida",
              "Reserva del salon guiada",
            ],
          },
          {
            title: "Operacion diaria",
            rows: [
              "Pagos conciliados en una cola",
              "Reglamento digitalizado",
              "Solicitudes clasificadas",
            ],
          },
        ],
      };

  const mobile = region === "usa"
    ? {
        appLabel: "Homeowner AI",
        status: "Rules + dues",
        messages: [
          {
            side: "right",
            text: "Can I keep two dogs in the community?",
            meta: "9:41 AM",
          },
          {
            side: "left",
            text: "The current pet policy allows two household pets, but dogs over 40 lbs need registration on file.",
            meta: "From rules",
            highlight: "Pet policy cited",
          },
          {
            side: "right",
            text: "What do I still owe this month?",
            meta: "9:42 AM",
          },
          {
            side: "left",
            text: "Your open balance is $285. A late fee applies after the 15th.",
            meta: "Ledger synced",
            highlight: "Assessment answer",
          },
        ],
      }
    : {
        appLabel: "Habitum AI",
        status: "WhatsApp activo",
        messages: [
          {
            side: "right",
            text: "Hola, ¿cuál es mi saldo pendiente?",
            meta: "10:30 AM",
          },
          {
            side: "left",
            text: "Tu saldo actual es $125 USD. Incluye la cuota mensual del condominio.",
            meta: "Saldo encontrado",
            highlight: "Cobranza automatizada",
          },
          {
            side: "right",
            text: "¿Se permiten mascotas en el edificio?",
            meta: "10:31 AM",
          },
          {
            side: "left",
            text: "Sí. Se permite una mascota por unidad, registrada en administración y con correa en áreas comunes.",
            meta: "Reglamento citado",
            highlight: "Respuesta por reglamento",
          },
        ],
      };

  const floatingBadges = region === "usa"
    ? [
        "Rules answered instantly",
        "Assessments organized",
        "Requests routed faster",
      ]
    : [
        "Vecinos respondidos 24/7",
        "Cobranza mas clara",
        "Reglamentos siempre a mano",
      ];

  return (
    <div className="relative mx-auto h-[620px] w-full max-w-5xl lg:h-[700px]">
      <div className="absolute right-0 top-0 w-[72%] lg:w-[66%]">
        <div className="rounded-t-[22px] bg-gradient-to-b from-gray-800 to-gray-900 p-3 shadow-2xl">
          <div className="rounded-t-[18px] bg-black p-1">
            <div className="aspect-[16/10] overflow-hidden rounded-[14px] bg-gradient-to-br from-[#12345B] via-[#1A365D] to-[#0D8EA7]">
              <div className="h-full p-5">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <p className="text-sm font-semibold text-white/70">{desktop.subtitle}</p>
                    <h3 className="text-2xl font-bold text-white">{desktop.title}</h3>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-500" />
                    <div className="h-3 w-3 rounded-full bg-yellow-500" />
                    <div className="h-3 w-3 rounded-full bg-green-500" />
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-3">
                  {desktop.metrics.map((metric) => (
                    <div key={metric.label} className="rounded-xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                      <div className="text-xs text-white/65">{metric.label}</div>
                      <div className={`mt-2 text-3xl font-bold ${metric.accent}`}>{metric.value}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 grid grid-cols-2 gap-4">
                  {desktop.cards.map((card) => (
                    <div key={card.title} className="rounded-2xl border border-white/10 bg-white/8 p-4 backdrop-blur-sm">
                      <div className="mb-4 text-sm font-semibold text-white">{card.title}</div>
                      <div className="space-y-3">
                        {card.rows.map((row) => (
                          <div key={row} className="flex items-start gap-3 rounded-xl bg-white/8 px-3 py-2.5">
                            <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#7FE8F6]" />
                            <div className="text-sm leading-5 text-white/88">{row}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 rounded-2xl border border-white/10 bg-[#0D233D]/60 px-4 py-3">
                  <div className="flex items-center justify-between text-sm text-white/80">
                    <span>{region === "usa" ? "What the board sees" : "Lo que ve la administración"}</span>
                    <span>{region === "usa" ? "Fewer manual follow-ups" : "Menos seguimiento manual"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="h-3 rounded-b-[22px] bg-gradient-to-b from-gray-700 to-gray-800 shadow-lg" />
      </div>

      <div className="absolute bottom-0 left-0 z-10 w-[45%] lg:w-[39%]">
        <div className="relative rounded-[3rem] border-[8px] border-gray-900 bg-gradient-to-b from-gray-900 to-black p-3 shadow-2xl">
          <div className="absolute left-1/2 top-0 z-20 h-7 w-32 -translate-x-1/2 rounded-b-3xl bg-black" />
          <div className="aspect-[9/19.5] overflow-hidden rounded-[2.5rem] bg-white">
            <div className="h-full bg-[#ECE5DD]">
              <div className="flex items-center gap-3 bg-[#25D366] px-4 py-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/30">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#1A365D] to-[#16A8B8]" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{mobile.appLabel}</div>
                  <div className="text-xs text-white/80">{mobile.status}</div>
                </div>
              </div>

              <div className="space-y-3 p-3 pt-5">
                {mobile.messages.map((message, index) => (
                  <div key={`${message.text}-${index}`} className={`flex ${message.side === "right" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[82%] rounded-lg px-3 py-2 shadow-sm ${
                        message.side === "right"
                          ? "rounded-tr-none bg-[#DCF8C6]"
                          : "rounded-tl-none bg-white"
                      }`}
                    >
                      <p className="text-xs leading-5 text-gray-800">{message.text}</p>
                      {message.highlight && (
                        <div className="mt-2 rounded-md bg-[#1A365D]/8 px-2 py-1 text-[10px] font-semibold text-[#1A365D]">
                          {message.highlight}
                        </div>
                      )}
                      <p className="mt-1 text-[10px] text-gray-500">{message.meta}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="absolute inset-0 -z-10 scale-105 rounded-[3rem] bg-gradient-to-br from-[#16A8B8]/30 to-[#1A365D]/30 blur-2xl" />
        </div>
      </div>

      <div className="absolute right-2 top-12 flex flex-col gap-3 lg:right-6">
        {floatingBadges.map((badge) => (
          <div key={badge} className="rounded-full border border-[#16A8B8]/20 bg-white/95 px-4 py-2 text-xs font-semibold text-[#0F3460] shadow-lg">
            {badge}
          </div>
        ))}
      </div>

      <svg className="pointer-events-none absolute inset-0 h-full w-full" style={{ zIndex: 5 }}>
        <defs>
          <linearGradient id="habitum-connection-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#16A8B8" stopOpacity="0" />
            <stop offset="50%" stopColor="#16A8B8" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#16A8B8" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M 210 430 Q 360 360 520 300"
          stroke="url(#habitum-connection-gradient)"
          strokeWidth="3"
          fill="none"
          strokeDasharray="10,5"
          className="opacity-70"
        >
          <animate attributeName="stroke-dashoffset" from="0" to="-15" dur="1s" repeatCount="indefinite" />
        </path>
      </svg>
    </div>
  );
}

