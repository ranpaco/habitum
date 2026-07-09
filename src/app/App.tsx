import { useState, useEffect } from "react";
import { LandingPage } from "./pages/LandingPage";
import { OnboardingFlow } from "./components/onboarding/OnboardingFlow";
import { Dashboard } from "./components/Dashboard";
import { DemoFlow } from "./components/DemoFlow";
import { RegionProvider } from "./context/RegionContext";

export default function App() {
  const [currentPage, setCurrentPage] = useState<"landing" | "onboarding" | "dashboard" | "demo">("landing");

  // Simple hash-based routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1).split("?")[0]; // Remove # and query params
      if (hash === "onboarding") {
        setCurrentPage("onboarding");
      } else if (hash === "dashboard") {
        setCurrentPage("dashboard");
      } else if (hash === "demo") {
        setCurrentPage("demo");
      } else {
        setCurrentPage("landing");
      }
    };

    handleHashChange(); // Check initial hash
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  let content;
  if (currentPage === "onboarding") {
    content = <OnboardingFlow />;
  } else if (currentPage === "dashboard") {
    content = <Dashboard />;
  } else if (currentPage === "demo") {
    content = <DemoFlow />;
  } else {
    content = <LandingPage />;
  }

  return <RegionProvider>{content}</RegionProvider>;
}
