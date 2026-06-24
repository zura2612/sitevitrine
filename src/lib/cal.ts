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

/*export function buildCalLink(eventSlug?: string): string {
  const username = import.meta.env.VITE_CAL_USERNAME;
  const event = eventSlug ?? import.meta.env.VITE_CAL_DEFAULT_EVENT;

  if (!username) {
    throw new Error("VITE_CAL_USERNAME is not defined in .env");
  }

  if (!event) {
    throw new Error("VITE_CAL_DEFAULT_EVENT is not defined in .env");
  }

  return `${username}/${event}`;
}*/