import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { useRegion, Country } from "../context/RegionContext";

const countries = [
  { code: "VE" as Country, name: "Venezuela", flag: "🇻🇪" },
  { code: "CO" as Country, name: "Colombia", flag: "🇨🇴" },
  { code: "CL" as Country, name: "Chile", flag: "🇨🇱" },
  { code: "MX" as Country, name: "Mexico", flag: "🇲🇽" },
  { code: "US" as Country, name: "United States", flag: "🇺🇸" },
];

export function CountrySelector() {
  const { country, setCountry } = useRegion();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedCountry = countries.find((c) => c.code === country);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 hover:border-[#16A8B8] transition-colors bg-white"
      >
        <span className="text-xl">{selectedCountry?.flag}</span>
        <span className="hidden sm:inline text-sm font-medium text-[#0F3460]">
          {selectedCountry?.code}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-lg shadow-2xl border border-gray-100 py-2 z-50">
          {countries.map((c) => (
            <button
              key={c.code}
              onClick={() => {
                setCountry(c.code);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${
                c.code === country ? "bg-[#16A8B8]/5 border-l-4 border-[#16A8B8]" : ""
              }`}
            >
              <span className="text-2xl">{c.flag}</span>
              <div className="text-left flex-1">
                <div className="font-medium text-[#0F3460]">{c.name}</div>
                <div className="text-xs text-gray-500">{c.code}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
