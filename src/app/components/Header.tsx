import { Building2 } from "lucide-react";
import { Button } from "./ui/button";
import { CountrySelector } from "./CountrySelector";
import { useRegion } from "../context/RegionContext";

export function Header() {
  const { region } = useRegion();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#0F3460] to-[#16A8B8] rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-semibold text-[#0F3460]">Habitum</span>
          </a>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-600 hover:text-[#0F3460] transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-gray-600 hover:text-[#0F3460] transition-colors">
              Pricing
            </a>
            <a href="#about" className="text-gray-600 hover:text-[#0F3460] transition-colors">
              About
            </a>
          </nav>

          {/* Country Selector & CTA */}
          <div className="flex items-center gap-2 sm:gap-4">
            <CountrySelector />
            <Button
              onClick={() => window.location.hash = "demo"}
              className="bg-[#16A8B8] hover:bg-[#16A8B8]/90 text-white px-3 sm:px-6 py-2 text-sm sm:text-base"
              size="lg"
            >
              <span className="hidden sm:inline">{region === "usa" ? "Get Custom Quote" : "Solicitar Demo"}</span>
              <span className="sm:hidden">{region === "usa" ? "Quote" : "Demo"}</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}