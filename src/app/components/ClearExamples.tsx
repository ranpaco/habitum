import { Building2, Home, ArrowRight } from "lucide-react";
import { useRegion } from "../context/RegionContext";
import { regionalContent } from "../config/regionalContent";

export function ClearExamples() {
  const { region } = useRegion();
  const content = regionalContent[region].examples;

  const columns = [
    {
      icon: Building2,
      title: content.audience1.title,
      items: content.audience1.items,
    },
    {
      icon: Home,
      title: content.audience2.title,
      items: content.audience2.items,
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center rounded-full bg-[#16A8B8]/10 px-4 py-2 text-sm font-semibold text-[#16A8B8]">
            {content.eyebrow}
          </div>
          <h2 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0F3460]">
            {content.title}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
            {content.subtitle}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {columns.map((column) => {
            const Icon = column.icon;

            return (
              <div key={column.title} className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#16A8B8] to-[#1A365D] text-white">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-semibold text-[#0F3460]">{column.title}</h3>
                </div>

                <div className="space-y-5">
                  {column.items.map((item, index) => (
                    <div key={index} className="rounded-xl border border-gray-100 bg-gray-50 p-5">
                      <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                        {region === "usa" ? "Typical Problem" : "Problema Típico"}
                      </p>
                      <p className="mt-2 text-base leading-7 text-[#0F3460]">
                        {item.problem}
                      </p>

                      <div className="my-3 h-px bg-gray-200" />

                      <div className="flex items-start gap-3">
                        <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#16A8B8]/10 text-[#16A8B8]">
                          <ArrowRight className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold uppercase tracking-wide text-[#16A8B8]">
                            {region === "usa" ? "How Habitum Helps" : "Cómo Ayuda Habitum"}
                          </p>
                          <p className="mt-2 text-base leading-7 text-gray-700">
                            {item.solution}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

