export interface CalAttendee {
  id: number;
  name: string;
  email: string;
  timeZone: string;
  locale?: string;
}

export interface CalBooking {
  id: number;
  uid: string;
  uuid: string;
  userId: number;
  eventTypeId: number;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
  createdAt: string;
  status: string;
  paid: boolean;
  videoCallUrl?: string;
  attendees: CalAttendee[];
  responses?: Record<string, unknown>;
}

export interface CalEventType {
  id: number;
  title: string;
  slug: string;
  description: string;
  length: number;
  price: number;
  currency: string;
}

export interface CalOrganizer {
  name: string;
  email: string;
  timeZone: string;
}

export interface CalBookingData {
  booking: CalBooking;
  eventType: CalEventType;
  date: string;
  duration: number;
  organizer: CalOrganizer;
  confirmed: boolean;
}

export interface CalEvent {
  type: string;
  namespace: string;
  fullType: string;
  data: CalBookingData;
}

/**
 * Configuration technique d'un événement Cal.com.
 * Contient uniquement les données non traductibles.
 */
export interface CalEventConfig {
  id: string;           // Identifiant unique (ex: "decouverte")
  slug: string;         // Slug Cal.com (ex: "30min")
  duration: number;     // Durée en minutes
  price: number;        // Prix en unité (ex: 10 pour 10€)
  currency: string;     // Devise ISO (ex: "EUR")
  translationKey: string; // Clé dans les traductions (ex: "event30min")
  isDefault?: boolean;  // Événement par défaut
}

// Alias pour compatibilité avec le code existant
export type CalBookingDetails = CalBookingData;

export interface CalEventHandlers {
  onBookingSuccess?: (data: CalBookingData) => void;
  onBookingCancel?: (data: CalBookingData) => void;
  onReschedule?: (data: CalBookingData) => void;
}