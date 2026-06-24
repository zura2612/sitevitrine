// src/components/LanguageSwitcher.tsx
import { useLanguage } from "@/contexts/LanguageContext";

export function LanguageSwitcher() {
  const { lang, toggleLang } = useLanguage();
  //const label = `Passer à la langue ${lang === "fr" ? "anglaise" : "française"}`
  // Définition dynamique du label selon la langue ciblée par le bouton
  const label = lang === "fr" ? "Switch to English" : "Passer en français";
    
  return (
    <button
      onClick={toggleLang}
      aria-label={label}
      title={label}
      // "pointer-events-auto" et "isolate" pour garantir la capture du survol
      className="relative grid h-9 w-9 place-items-center rounded-full 
      transition pointer-events-auto isolate hover:bg-accent"
    >
      {lang === "fr" ? ( <img src="/flags/en.svg" alt="English" className="h-4 w-4 pointer-events-none" /> ) :
        ( <img src="/flags/fr.svg" alt="Français" className="h-4 w-4 pointer-events-none" /> )
      }
    </button>
  );
}