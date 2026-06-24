// fichier src/hooks/usePageTranslations.ts
import { useState, useEffect } from 'react';

// Cache pour stocker les traductions pré-chargées
const translationsCache: Record<string, Record<string, any>> = {};

// Signature générique pour conserver le typage côté appelant
export function usePageTranslations<T>(page: string, lang: string) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

useEffect(() => {
    const fetchTranslations = async () => {
        try {
        // Vérifie si les traductions sont déjà en cache
        if (translationsCache[page]?.[lang]) {
          setData(translationsCache[page][lang]);
          setIsLoading(false);
          return;
          }

        const response = await fetch(`/translations/${page}.${lang}.json`);
        if (!response.ok) { throw new Error(`Failed to load translations for ${page} (${lang})`); }
        // Cast explicite ici avec "as T"
        const json = await response.json() as T;

        // Stocke dans le cache
        if (!translationsCache[page]) { translationsCache[page] = {}; }
        translationsCache[page][lang] = json;
        setData(json);

        } catch (err) {
          setError(err instanceof Error ? err : new Error(String(err)));
        } finally {
        setIsLoading(false);
        }
    };

    fetchTranslations();
    }, [page, lang]);

//Retourne un objet au lieu d'un tableau
  return { data, isLoading, error };
}

// Fonction pour pré-charger toutes les traductions
export function preloadAllTranslations() {
  const pages = ["header", "footer", "ctaBand", "about", "services", "contact", "home"];
  const languages = ["fr", "en"];
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const dateEnvoi = new Date().toLocaleString('fr-FR');
  console.log("entrée dans preloadAllTranslations() le ",dateEnvoi);

  pages.forEach((page) => {
    if (!translationsCache[page]) { translationsCache[page] = {}; }
    languages.forEach((lang) => {
      if (!translationsCache[page][lang]) {
        // fetch(`/translations/...` pose problème
        fetch(`${baseUrl}/translations/${page}.${lang}.json`)
          .then((res) => res.json())
          .then((json) => { translationsCache[page][lang] = json; })
          .catch((err) => { console.error(`preload Echec au chargement de ${page}.${lang}.json:`, err); });
        }
    });
  });
}