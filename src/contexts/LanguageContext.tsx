// src/contexts/LanguageContext.tsx
import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

type Language = "fr" | "en";

type LanguageContextType = {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// ✅ Lecture localStorage synchrone, appelée une seule fois par useState
function getSavedLang(): Language {
  if (typeof window === "undefined") return "fr";
  const saved = localStorage.getItem("language");
  return saved === "fr" || saved === "en" ? saved : "fr";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  // ✅ Lazy initializer : getSavedLang est appelé une seule fois, sans déclencher de re-rendu
  const [lang, setLang] = useState<Language>(getSavedLang);

  // ✅ Uniquement la sauvegarde — plus de lecture asynchrone
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("language", lang);
    }
  }, [lang]);

  const toggleLang = () => setLang(lang === "fr" ? "en" : "fr");

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}