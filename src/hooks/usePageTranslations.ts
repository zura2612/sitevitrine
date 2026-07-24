// fichier src/hooks/usePageTranslations.ts
import { useState, useEffect } from 'react';

// Importation statique des fichiers français pour court-circuiter le réseau
/*import frHeader from "../../public/translations/header.fr.json";
import frFooter from "../../public/translations/footer.fr.json";
import frCtaBand from "../../public/translations/ctaBand.fr.json";
import frAbout from "../../public/translations/about.fr.json";
import frContact from "../../public/translations/contact.fr.json";
import frHome from "../../public/translations/home.fr.json";
import frRendezVous from "../../public/translations/rendez-vous.fr.json";
import frServices from "../../public/translations/services.fr.json";*/

// 🟢 MODIFICATION : On demande à Vite de lire dynamiquement mais immédiatement (eager) les fichiers .fr.json du dossier src/translations
// Cela contourne l'interdiction d'importation directe tout en intégrant les données au build.
//const frFiles = import.meta.glob('/public/translations/*.fr.json', { eager: true });
const frFiles = import.meta.glob('/src/translations/*.fr.json', { eager: true });

// Fonction utilitaire pour extraire proprement les données lues par Vite
const getFrData = (pageName: string) => {
  // Les clés dans frFiles ressemblent à : "/src/translations/home.fr.json"
  const key = `/src/translations/${pageName}.fr.json`;
  const fileContent = frFiles[key] as any;
  // Vite exporte le JSON sous une clé "default"
  return fileContent ? fileContent.default : null;
};

// Cache pour stocker les traductions pré-chargées
// On initialise directement le cache avec les données FR pour éviter l'asynchrone
const translationsCache: Record<string, Record<string, any>> = {
  __root: { fr: getFrData('__root') },
  header: { fr: getFrData('header') },
  footer: { fr: getFrData('footer') },
  ctaBand: { fr: getFrData('ctaBand') },
  about: { fr: getFrData('about') },
  contact: { fr: getFrData('contact') },
  home: { fr: getFrData('home') },
  "rendez-vous": { fr: getFrData('rendez-vous') },
  services: { fr: getFrData('services') }
};

// Cache pour stocker les traductions pré-chargées
//const translationsCache: Record<string, Record<string, any>> = {};

// Signature générique pour conserver le typage côté appelant
export function usePageTranslations<T>(page: string, lang: string) {
  const cachedData = translationsCache[page]?.[lang];
  const [data, setData] = useState<T | null>((cachedData as T) || null);
  const [isLoading, setIsLoading] = useState(!cachedData); 
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

        // Sécurité pour le serveur de build (SSG) : pas de fetch hors du navigateur
        if (typeof window === "undefined") return;

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
  const pages = ["header", "footer", "ctaBand", "about", "contact", "home", "rendez-vous", "services"];
  const languages = ["en"];
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const dateEnvoi = new Date().toLocaleString('fr-FR');
  console.log("entrée dans preloadAllTranslations() le ", dateEnvoi);

// Sécurité indispensable pour éviter que le serveur Node de TanStack ne tente de lancer des fetch globaux au build
  if (typeof window === "undefined") return;

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