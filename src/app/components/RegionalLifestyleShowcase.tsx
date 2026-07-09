import { CheckCircle2 } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useRegion } from "../context/RegionContext";
import { regionalContent } from "../config/regionalContent";

export function RegionalLifestyleShowcase() {
  const { region } = useRegion();
  const content = regionalContent[region].showcase;

  return (
    <section className="bg-gradient-to-b from-white to-gray-50 py-20">
      <div className="container mx-auto px-6">
        <div className="mb-14 max-w-4xl">
          <div className="inline-flex rounded-full bg-[#16A8B8]/10 px-4 py-2 text-sm font-semibold text-[#16A8B8]">
            {content.eyebrow}
          </div>
          <h2 className="mt-5 text-3xl font-bold text-[#0F3460] sm:text-4xl lg:text-5xl">
            {content.title}
          </h2>
          <p className="mt-4 text-base leading-8 text-gray-600 sm:text-lg">
            {content.subtitle}
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {content.cards.map((card) => (
            <article key={card.title} className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="aspect-[4/3]">
                <ImageWithFallback
                  src={card.imageSrc}
                  alt={card.imageAlt}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="p-6">
                <div className="inline-flex rounded-full bg-[#0F3460]/6 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#0F3460]">
                  {card.role}
                </div>
                <h3 className="mt-4 text-2xl font-semibold text-[#0F3460]">{card.title}</h3>

                <div className="mt-5 space-y-4">
                  <div className="rounded-xl border border-red-100 bg-red-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-red-700">
                      {region === "usa" ? "Before Habitum" : "Antes de Habitum"}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-gray-700">{card.before}</p>
                  </div>

                  <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                      {region === "usa" ? "With Habitum" : "Con Habitum"}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-gray-700">{card.after}</p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 rounded-2xl bg-gradient-to-r from-[#1A365D] via-[#16A8B8] to-[#1A365D] p-8 text-white shadow-xl">
          <h3 className="text-2xl font-semibold">{content.outcomesTitle}</h3>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {content.outcomes.map((outcome) => (
              <div key={outcome} className="flex items-start gap-3 rounded-xl bg-white/10 px-4 py-4 backdrop-blur-sm">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-white" />
                <p className="text-sm leading-6 text-white/92">{outcome}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

