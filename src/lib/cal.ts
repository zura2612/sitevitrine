// fichier src/lib/cal.ts
import { getCalApi } from "@calcom/embed-react";

type CalInstance = Awaited<ReturnType<typeof getCalApi>>;
let cachedInstance: CalInstance | null = null;
let initPromise: Promise<CalInstance> | null = null;

/**
 * Retourne une instance du SDK Cal.com, mise en cache.
 * Utilise un namespace pour isoler les instances.
 */
export async function getCalInstance(): Promise<CalInstance> {
  if (cachedInstance) return cachedInstance;
  if (initPromise) return initPromise;

  initPromise = getCalApi({
    namespace: "booking-inline"
  }).then((instance) => {
    cachedInstance = instance;
    return instance;
  }).catch((error) => {
    // Reset en cas d'erreur pour permettre un retry
    initPromise = null;
    throw error;
  });

  return initPromise;
}

/**
 * Construit le calLink à partir des variables d'environnement.
 */
export function buildCalLink(eventSlug: string): string {
  const username = import.meta.env.VITE_CAL_USERNAME;

  if (!username) {
    throw new Error("VITE_CAL_USERNAME is not defined in .env");
  }

  if (!eventSlug) {
    throw new Error("eventSlug is required");
  }

  return `${username}/${eventSlug}`;
}

// ✅ NOUVEAU : Interface pour les paramètres de pré-remplissage
export interface CalLinkPrefillParams {
  name?: string;
  email?: string;
}

// ✅ NOUVEAU : Fonction utilitaire qui construit le calLink avec pré-remplissage
/**
 * Construit le calLink avec les paramètres de pré-remplissage pour Cal.com.
 * 
 * @param eventSlug - Le slug de l'événement (ex: "decouverte")
 * @param prefillParams - Les paramètres de pré-remplissage (nom, email)
 * @returns L'URL complète du calLink avec les paramètres
 * 
 * @example
 * buildCalLinkWithPrefill("decouverte", { name: "Jean Dupont", email: "jean@gmail.com" })
 * Retourne: "username/decouverte?name=Jean+Dupont&email=jean%40gmail.com"
 */
export function buildCalLinkWithPrefill(
  eventSlug: string,
  prefillParams?: CalLinkPrefillParams
): string {
  // Construire le lien de base
  const baseLink = buildCalLink(eventSlug);

  // Si pas de paramètres, retourner le lien de base
  if (!prefillParams || (!prefillParams.name && !prefillParams.email)) {
    return baseLink;
  }

  // Construire les paramètres URL
  const searchParams = new URLSearchParams();

  if (prefillParams.name) {
    searchParams.set("name", prefillParams.name);
  }
  if (prefillParams.email) {
    searchParams.set("email", prefillParams.email);
  }

  // Ajouter les paramètres au lien
  const queryString = searchParams.toString();
  return `${baseLink}?${queryString}`;
}