import { createContext, useContext, useState, ReactNode } from "react";

export type Country = "VE" | "CO" | "CL" | "MX" | "US";
export type Region = "latam" | "usa";

interface RegionContextType {
  country: Country;
  region: Region;
  setCountry: (country: Country) => void;
}

const RegionContext = createContext<RegionContextType | undefined>(undefined);

export function RegionProvider({ children }: { children: ReactNode }) {
  const [country, setCountry] = useState<Country>("VE");

  const region: Region = country === "US" ? "usa" : "latam";

  return (
    <RegionContext.Provider value={{ country, region, setCountry }}>
      {children}
    </RegionContext.Provider>
  );
}

export function useRegion() {
  const context = useContext(RegionContext);
  if (!context) {
    throw new Error("useRegion must be used within RegionProvider");
  }
  return context;
}
