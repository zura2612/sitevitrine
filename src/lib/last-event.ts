// fichier src/lib/last-event.ts
import { LAST_EVENT_KEY } from "@/lib/storage-keys"; // localStorage
//const LAST_EVENT_KEY = "lastSelectedEvent";

/**
 * Récupère l'identifiant du dernier événement sélectionné.
 * Retourne null si aucun n'est mémorisé ou si localStorage est indisponible.
 */
export function getLastSelectedEvent(): string | null {
  try {
    return localStorage.getItem(LAST_EVENT_KEY);
  } catch {
    return null;
  }
}

/**
 * Mémorise l'identifiant du dernier événement sélectionné.
 * Échec silencieux si localStorage est indisponible.
 */
export function setLastSelectedEvent(eventId: string): void {
  try {
    localStorage.setItem(LAST_EVENT_KEY, eventId);
  } catch {
    // Silencieux
  }
}

/**
 * Supprime la mémorisation du dernier événement.
 */
export function clearLastSelectedEvent(): void {
  try {
    localStorage.removeItem(LAST_EVENT_KEY);
  } catch {
    // Silencieux
  }
}