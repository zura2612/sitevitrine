// fichier src/routes/_protected/rendez-vous.tsx
import { useState, useEffect, useCallback } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePageTranslations } from "@/hooks/usePageTranslations";
import type { BookingTranslations } from "@/types/translations";
import { siteConfig } from "@/config/site";
import { siteStyle } from "@/config/site";
//import { CtaBand } from "@/components/CtaBand";
import { InlineCalendar } from "@/components/booking/InlineCalendar";
import { BookingConfirmation } from "@/components/booking/BookingConfirmation";
import { BookingInfo } from "@/components/booking/BookingInfo";
import { EventSelector } from "@/components/booking/EventSelector";
//import { buildCalLink } from "@/lib/cal";
import { buildCalLinkWithPrefill } from "@/lib/cal";
import { CAL_EVENTS, getDefaultEvent, getEventById } from "@/config/cal-events";
import { getLastSelectedEvent, setLastSelectedEvent } from "@/lib/last-event";
import type { CalBookingDetails } from "@/types/cal";
import { BOOKING_STORAGE_KEY } from "@/lib/storage-keys"; // ✅ Import centralisé
import { useAuth } from "@workos-inc/authkit-react"; // ✅ Import WorkOS

const sectionStyle = "mb-1 border border-black container-narrow";
type BookingStatus = "idle" | "success" | "cancelled";

// Validation manuelle des search params (sans Zod)
const validateSearch = (search: Record<string, unknown>) => {
  const event = typeof search.event === "string" ? search.event : undefined;
  return { event };
};

export const Route = createFileRoute("/_protected/rendez-vous")({
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

  // ✅ 1. APPEL DE TOUS LES HOOKS EN DÉBUT DE COMPOSANT (Règle d'or React)
  const { data: t, isLoading: isTransLoading, error } = usePageTranslations<BookingTranslations>("rendez-vous", lang);
  // ✅ Hook WorkOS : user est null si non connecté
  const { user, isLoading: isAuthLoading } = useAuth();
  const isAuthenticated = !!user;
  
  const [status, setStatus] = useState<BookingStatus>("idle");
  const [lastBooking, setLastBooking] = useState<CalBookingDetails | null>(null);

  // Logique de sélection d'événement (déterministe, pas de hook ici)
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

  // Effets
  useEffect(() => {
    if (!search.event) {
      const lastEventId = getLastSelectedEvent();
      if (lastEventId && getEventById(lastEventId)) {
        navigate({
          //to: "/_protected/rendez-vous",
          to: "/rendez-vous",
          search: { event: lastEventId },
          replace: true
        });
      }
    }
  }, [search.event, navigate]);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(BOOKING_STORAGE_KEY);
      if (saved) {
        const booking = JSON.parse(saved) as CalBookingDetails;
        if (booking && booking.date) {
          setLastBooking(booking);
          setStatus("success");
        } else {
          sessionStorage.removeItem(BOOKING_STORAGE_KEY);
        }
      }
    } catch (error) {
      console.error("Echec à la récupération de l'état de la réservation:", error);
      sessionStorage.removeItem(BOOKING_STORAGE_KEY);
    }
  }, []);

  const handleEventSelect = useCallback((eventId: string) => {
    navigate({
      //to: "/_protected/rendez-vous",
      to: "/rendez-vous",
      search: { event: eventId },
      replace: true
    });
    setLastSelectedEvent(eventId);
    setStatus("idle");
    setLastBooking(null);
    sessionStorage.removeItem(BOOKING_STORAGE_KEY);
  }, [navigate]);

  const handleBookingSuccess = useCallback((data: CalBookingDetails) => {
    setStatus((current) => {
      if (current === "success") return current;
      return "success";
    });
    setLastBooking(data);
    try {
      sessionStorage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.warn("Echec pour enregistrer l'état de la réservation:", error);
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
    sessionStorage.removeItem(BOOKING_STORAGE_KEY);
  }, []);

  const handleReschedule = useCallback((data: CalBookingDetails) => {
    setLastBooking(data);
    setStatus("success");
    try {
      sessionStorage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.warn("Echec pour enregistrer la réservation modifiée:", error);
    }
  }, []);

  const handleNewBooking = useCallback(() => {
    setStatus("idle");
    setLastBooking(null);
    sessionStorage.removeItem(BOOKING_STORAGE_KEY);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleGoHome = useCallback(() => {
    navigate({ to: "/" });
  }, [navigate]);

  // ✅ 2. VÉRIFICATIONS ET RETOURS CONDITIONNELS APRÈS LES HOOKS
  
  // Chargement global (Auth0-WorkOS ou Traductions)
  if (isAuthLoading || isTransLoading) {
    return (
      <p className="text-center py-10 animate-pulse" aria-live="polite">
        Chargement...
      </p>
    );
  }

  // Erreur de traduction
  if (error || !t) {
    return (
      <main className="w-full">
        <section className={sectionStyle}>
          <p className="text-center py-4 text-destructive" role="alert">
            {error instanceof Error ? error.message : "Impossible de charger les textes."}
          </p>
        </section>
      </main>
    );
  }

  // Non authentifié
  if (!isAuthenticated) {
    return (
      <div className="container-narrow py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">{t.auth.title}</h2>
        <p className="text-muted-foreground mb-6">{t.auth.message}</p>
        <button
          onClick={() => navigate({ to: "/" })}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
        >
          {t.auth.button}
        </button>
      </div>
    );
  }

  // ✅ 3. RENDU PRINCIPAL
  //const calLink = buildCalLink(selectedEvent.slug);
  // Récupérer les informations de l'utilisateur WorkOS
  const userName = user?.firstName && user?.lastName 
    ? `${user.firstName} ${user.lastName}`
    : user?.firstName || user?.lastName || undefined;
  
  const userEmail = user?.email || undefined;

  // ✅ Utiliser la nouvelle fonction utilitaire
  const calLink = buildCalLinkWithPrefill(selectedEvent.slug, {
    name: userName,
    email: userEmail,
  });

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
      
    </main>
  );
}