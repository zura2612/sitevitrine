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

export function LanguageProvider({ children }: { children: ReactNode }) {
  // 🟢 1. On initialise toujours par défaut à "fr" pour garantir une correspondance parfaite 
  // entre le rendu du serveur (SSR) et le premier rendu du client (Hydratation).
  const [lang, setLang] = useState<Language>("fr");

  // 🟢 2. On récupère la préférence utilisateur depuis le localStorage uniquement 
  // après que le composant est monté dans le navigateur (côté client).
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("language");
      if (saved === "fr" || saved === "en") {
        setLang(saved);
      }
    }
  }, []);

  // 🟢 3. On sauvegarde dans le localStorage à chaque modification de la langue
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