"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type ExploreLanguage = "zh" | "ja" | "en";

type ExploreLanguageContextValue = {
  language: ExploreLanguage;
  setLanguage: (language: ExploreLanguage) => void;
};

const ExploreLanguageContext = createContext<ExploreLanguageContextValue | null>(null);

export default function ExploreLanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<ExploreLanguage>("zh");

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem("explore-language");
    if (savedLanguage === "zh" || savedLanguage === "ja" || savedLanguage === "en") {
      setLanguage(savedLanguage);
    }
  }, []);

  const updateLanguage = (nextLanguage: ExploreLanguage) => {
    setLanguage(nextLanguage);
    window.localStorage.setItem("explore-language", nextLanguage);
  };

  return <ExploreLanguageContext.Provider value={{ language, setLanguage: updateLanguage }}>{children}</ExploreLanguageContext.Provider>;
}

export function useExploreLanguage() {
  const context = useContext(ExploreLanguageContext);
  if (!context) throw new Error("useExploreLanguage must be used within ExploreLanguageProvider");
  return context;
}
