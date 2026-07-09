import { MessageCircle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Button } from "./ui/button";
import { useRegion } from "../context/RegionContext";
import { regionalFAQ } from "../config/regionalFAQ";

export function CategorizedFAQ() {
  const { region } = useRegion();
  const faq = regionalFAQ[region];
  const faqCategories = faq.categories;

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1A365D] mb-4">
              {faq.title}
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600">
              {faq.subtitle}
            </p>
          </div>

          {/* Categorized FAQs */}
          <div className="space-y-12">
            {faqCategories.map((category, categoryIndex) => {
              const CategoryIcon = category.icon;
              return (
                <div key={categoryIndex} className="space-y-4">
                  {/* Category Header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 ${category.bgColor} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <CategoryIcon className={`w-5 h-5 sm:w-6 sm:h-6 ${category.color}`} />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-[#1A365D]">
                      {category.category}
                    </h3>
                  </div>

                  {/* Questions Accordion */}
                  <Accordion type="single" collapsible className="space-y-3">
                    {category.questions.map((faq, questionIndex) => (
                      <AccordionItem
                        key={questionIndex}
                        value={`${categoryIndex}-${questionIndex}`}
                        className="bg-white rounded-xl border-2 border-[#E2E8F0] px-6 overflow-hidden hover:border-[#1A365D]/20 transition-colors"
                      >
                        <AccordionTrigger className="text-left text-[#1A365D] hover:no-underline py-5">
                          <span className="font-semibold text-base lg:text-lg pr-4">
                            {faq.question}
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-700 leading-relaxed text-base pb-5">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              );
            })}
          </div>

          {/* CTA Box */}
          <div className="mt-16 relative">
            <div className="bg-gradient-to-br from-[#1A365D] to-[#16A8B8] rounded-2xl p-6 sm:p-8 lg:p-10 text-white shadow-2xl">
              <div className="flex flex-col lg:flex-row items-center gap-6 justify-between">
                <div className="flex-1 text-center lg:text-left">
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3">
                    {faq.ctaTitle}
                  </h3>
                  <p className="text-base sm:text-lg text-white/90">
                    {faq.ctaDescription}
                  </p>
                </div>

                <div className="flex-shrink-0 w-full lg:w-auto">
                  <Button
                    onClick={() => window.location.hash = "demo"}
                    size="lg"
                    className="w-full lg:w-auto bg-white text-[#1A365D] hover:bg-white/90 text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 shadow-lg hover:shadow-xl transition-all group"
                  >
                    <MessageCircle className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                    {faq.ctaButton}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Help */}
          <div className="mt-12 text-center">
            <p className="text-gray-600">
              {faq.helpText}{" "}
              <a href="#" className="text-[#16A8B8] font-semibold hover:underline">
                {faq.scheduleDemoText}
              </a>
              {" "}o{" "}
              <a href="#" className="text-[#16A8B8] font-semibold hover:underline">
                {faq.emailText}
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
