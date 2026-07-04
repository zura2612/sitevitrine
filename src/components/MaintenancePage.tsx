// fichier src/components/MaintenancePage.tsx
import { useState, useEffect } from "react";
import type { MaintenanceStatus } from "@/lib/maintenance";

interface MaintenancePageProps {
  status: MaintenanceStatus;
}

type Lang = "fr" | "en";

export function MaintenancePage({ status }: MaintenancePageProps) {
  const [lang, setLang] = useState<Lang>(() => {
    if (typeof window === "undefined") return "fr";
    
    const saved = localStorage.getItem("maintenance-lang") as Lang | null;
    if (saved && (saved === "fr" || saved === "en")) return saved;
    
    const browserLang = navigator.language.toLowerCase();
    return browserLang.startsWith("en") ? "en" : "fr";
  });

  useEffect(() => {
    localStorage.setItem("maintenance-lang", lang);
    document.documentElement.lang = lang;
  }, [lang]);
  // assurer la cohérence avec interface MaintenanceStatus
  const message = status.message?.[lang];
// || (lang === "fr" ? "Site en maintenance" : "Site under maintenance");
  const description = status.description?.[lang];
// || (lang === "fr" ? "Nous serons de retour bientôt." : "We'll be back soon.");

  /* 2026-12-31T18:00:00Z format valide pour Date
  const formattedEnd = status.estimatedEnd
    ? new Date(status.estimatedEnd).toLocaleString(lang === "fr" ? "fr-FR" : "en-US", {
        dateStyle: "long",
        timeStyle: "short",
      })
    : null;*/
  const formattedEnd = status.estimatedEnd?.[lang];
  //const description = status.estimatedEnd?.[lang] || (lang === "fr" ? formattedEndFr : formattedEndEn);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="text-6xl mb-4" aria-hidden="true">
          🔧
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          {message}
        </h1>

        <p className="text-gray-600 mb-6 leading-relaxed">
          {description}
        </p>

        {formattedEnd && (
          <p className="text-sm text-gray-500 mb-6">
            {lang === "fr" ? "Reprise estimée : " : "Estimated return: "}
            <span className="font-semibold">{formattedEnd}</span>
          </p>
        )}

        <div className="border-t border-gray-200 my-6" />

        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setLang("fr")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              lang === "fr"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            aria-pressed={lang === "fr"}
          >
            Français
          </button>
          <button
            onClick={() => setLang("en")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              lang === "en"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            aria-pressed={lang === "en"}
          >
            English
          </button>
        </div>
      </div>
    </div>
  );
}