// fichier src/routes/rendez-vous.tsx
import { useState, useEffect, useCallback } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePageTranslations } from "@/hooks/usePageTranslations";
import type { BookingTranslations } from "@/types/translations";
import { siteConfig } from "@/config/site";
import { siteStyle } from "@/config/site";
import { CtaBand } from "@/components/CtaBand";
import { InlineCalendar } from "@/components/booking/InlineCalendar";
import { BookingConfirmation } from "@/components/booking/BookingConfirmation";
import { BookingInfo } from "@/components/booking/BookingInfo";
import { EventSelector } from "@/components/booking/EventSelector";
import { buildCalLink } from "@/lib/cal";
import { CAL_EVENTS, getDefaultEvent, getEventById } from "@/config/cal-events";
import {
  getLastSelectedEvent,
  setLastSelectedEvent
} from "@/lib/last-event";
import type { CalBookingDetails } from "@/types/cal";

const sectionStyle = "mb-1 border border-black container-narrow";
const STORAGE_KEY = "lastBooking";

type BookingStatus = "idle" | "success" | "cancelled";

// Validation manuelle des search params (sans Zod)
const validateSearch = (search: Record<string, unknown>) => {
  const event = typeof search.event === "string" ? search.event : undefined;
  return { event };
};

export const Route = createFileRoute("/rendez-vous")({
  validateSearch,
  head: () => ({
    meta: [
      { title: `${siteConfig.entreprise} - Prendre rendez-vous` },
      { name: "description", content: siteConfig.headDescriptionBooking },
      { name: "robots", content: "index, follow" },
      { name: "canonical", content: `${siteConfig.urlSite}/rendez-vous` },
      { property: "og:title", content: `${siteConfig.entreprise} — Prendre rendez-vous` },
      { property: "og:description", content: siteConfig.headDescriptionBooking },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${siteConfig.urlSite}/rendez-vous` },
      { property: "og:image", content: `${siteConfig.urlSite}/public/vehicule.jpg` },
      { property: "og:site_name", content: siteConfig.entreprise },
    ],
  }),
  component: BookingPage,
});

function BookingPage() {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const search = Route.useSearch();

  const { data: t, isLoading, error } = usePageTranslations<BookingTranslations>("rendez-vous", lang);

  const [status, setStatus] = useState<BookingStatus>("idle");
  const [lastBooking, setLastBooking] = useState<CalBookingDetails | null>(null);

  // Déterminer l'événement sélectionné :
  // 1. Paramètre URL (?event=xxx)
  // 2. Dernier événement mémorisé (localStorage)
  // 3. Événement par défaut
  const selectedEvent = (() => {
    if (search.event) {
      const fromUrl = getEventById(search.event);
      if (fromUrl) return fromUrl;
    }
    const lastEventId = getLastSelectedEvent();
    if (lastEventId) {
      const fromStorage = getEventById(lastEventId);
      if (fromStorage) return fromStorage;
    }
    return getDefaultEvent();
  })();

  // Synchroniser l'URL si aucun paramètre mais un dernier événement existe
  useEffect(() => {
    if (!search.event) {
      const lastEventId = getLastSelectedEvent();
      if (lastEventId && getEventById(lastEventId)) {
        navigate({
          to: "/rendez-vous",
          search: { event: lastEventId },
          replace: true
        });
      }
    }
  }, [search.event, navigate]);

  // Restauration de l'état après refresh (persistance session)
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const booking = JSON.parse(saved) as CalBookingDetails;
        if (booking && booking.date) {
          setLastBooking(booking);
          setStatus("success");
        } else {
          sessionStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch (error) {
      console.error("Failed to restore booking state:", error);
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const handleEventSelect = useCallback((eventId: string) => {
    // Mettre à jour l'URL
    navigate({
      to: "/rendez-vous",
      search: { event: eventId },
      replace: true
    });

    // Mémoriser dans localStorage
    setLastSelectedEvent(eventId);

    // Réinitialiser l'état de réservation
    setStatus("idle");
    setLastBooking(null);
    sessionStorage.removeItem(STORAGE_KEY);
  }, [navigate]);

  const handleBookingSuccess = useCallback((data: CalBookingDetails) => {
    setStatus((current) => {
      if (current === "success") return current;
      return "success";
    });

    setLastBooking(data);

    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.warn("Failed to persist booking:", error);
    }

    setTimeout(() => {
      document.getElementById("booking-confirmation")?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }, 300);
  }, []);

  const handleBookingCancel = useCallback(() => {
    setStatus("cancelled");
    sessionStorage.removeItem(STORAGE_KEY);
  }, []);

  const handleReschedule = useCallback((data: CalBookingDetails) => {
    setLastBooking(data);
    setStatus("success");

    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.warn("Failed to persist rescheduled booking:", error);
    }
  }, []);

  const handleNewBooking = useCallback(() => {
    setStatus("idle");
    setLastBooking(null);
    sessionStorage.removeItem(STORAGE_KEY);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleGoHome = useCallback(() => {
    navigate({ to: "/" });
  }, [navigate]);

  if (isLoading) {
    return (
      <p className="text-center py-10 animate-pulse" aria-live="polite">
        Chargement du contenu de BookingPage...
      </p>
    );
  }

  if (error || !t) {
    return (
      <p className="text-center py-10 text-destructive" role="alert">
        {error instanceof Error ? error.message : "Impossible de charger les textes."}
      </p>
    );
  }

  const calLink = buildCalLink(selectedEvent.slug);

  return (
    <main className="w-full">
      {/* HERO */}
      <section className={sectionStyle}>
        <div className="container-narrow py-10 md:py-20">
          <h1 className={`${siteStyle.ligne1SectionBleuStyle}`}>
            {t.hero.primary}
          </h1>
          <p className={`${siteStyle.ligne2SectionBleuStyle}`}>
            {t.hero.secondary}
          </p>
        </div>
      </section>

      {/* SÉLECTEUR D'ÉVÉNEMENTS (masqué après réservation) */}
      {status !== "success" && (
        <EventSelector
          events={CAL_EVENTS}
          selectedEventId={selectedEvent.id}
          onSelect={handleEventSelect}
          texts={t.events}
        />
      )}

      {/* Calendrier */}
      <section className={sectionStyle}>
        <div className="container-narrow py-10">
          {status === "success" && lastBooking && lastBooking.date ? (
            <BookingConfirmation
              booking={lastBooking}
              onNewBooking={handleNewBooking}
              onGoHome={handleGoHome}
              texts={t.confirmation}
            />
          ) : (
            <>
              {status === "cancelled" && (
                <div
                  className="mb-8 rounded-2xl border border-black bg-yellow-50 p-6 shadow-soft"
                  role="status"
                >
                  <p className="text-yellow-800">{t.annulation.message}</p>
                </div>
              )}

              <div className="rounded-2xl border border-black bg-card p-6 shadow-soft">
                <InlineCalendar
                  key={selectedEvent.id}
                  calLink={calLink}
                  layout="month_view"
                  className="w-full"
                  eventHandlers={{
                    onBookingSuccess: handleBookingSuccess,
                    onBookingCancel: handleBookingCancel,
                    onReschedule: handleReschedule
                  }}
                  loadingText={t.chargement}
                  errorText={t.erreur}
                  retryText={t.reessayer}
                />
              </div>
            </>
          )}
        </div>
      </section>

      {/* Informations */}
      <BookingInfo
        primary={t.info.primary}
        secondary={t.info.secondary}
        cartes={t.info.cartes}
      />

      <CtaBand />
    </main>
  );
}