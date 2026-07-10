// fichier src/config/cal-events.ts
import type { CalEventConfig } from "@/types/cal";

/**
 * Liste statique des événements Cal.com disponibles.
 * Contient uniquement les données techniques non traductibles.
 * Les textes (titre, description, icône) sont dans les fichiers de traduction.
 *
 * Pour ajouter un événement :
 * 1. Créer l'événement dans app.cal.com avec le slug correspondant
 * 2. Ajouter une entrée ici et mettre à jour types/translations.ts
 * 3. translationKey cohérence avec les champs de events de BookingTranslations défini dans types/translations.ts
 * 4. Ajouter les traductions dans rendez-vous.fr.json et rendez-vous.en.json 
 */
export const CAL_EVENTS: CalEventConfig[] = [
  {
    id: "decouverte",
    slug: "30min",
    duration: 30,
    price: 30,
    currency: "EUR",
    translationKey: "event30min"
  },
  {
    id: "approfondi",
    slug: "60min",
    duration: 60,
    price: 50,
    currency: "EUR",
    translationKey: "event60min",
    isDefault: true
  }
];

/**
 * Retourne l'événement par défaut (marqué isDefault: true)
 * ou le dernier de la liste si aucun n'est marqué.
 */
export function getDefaultEvent(): CalEventConfig {
  return CAL_EVENTS.find((e) => e.isDefault) ?? CAL_EVENTS[CAL_EVENTS.length - 1];
}

/**
 * Retourne un événement par son id, ou null si introuvable.
 */
export function getEventById(id: string): CalEventConfig | null {
  return CAL_EVENTS.find((e) => e.id === id) ?? null;
}

/**
 * Retourne un événement par son slug Cal.com, ou null si introuvable.
 */
export function getEventBySlug(slug: string): CalEventConfig | null {
  return CAL_EVENTS.find((e) => e.slug === slug) ?? null;
}