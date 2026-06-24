import type { CalBookingData } from "@/types/cal";

interface BookingConfirmationProps {
  booking: CalBookingData;
  onNewBooking: () => void;
  onGoHome: () => void;
  texts: {
    title: string;
    message: string;
    emailSent: string;
    newBooking: string;
    goHome: string;
  };
}

export function BookingConfirmation({
  booking,
  onNewBooking,
  onGoHome,
  texts
}: BookingConfirmationProps) {
  // Protection : vérifier que les données essentielles existent
  if (!booking || !booking.date || !booking.eventType) {
    console.error("BookingConfirmation: données de réservation invalides", booking);
    return (
      <div className="rounded-2xl border border-black bg-yellow-50 p-6 mb-8 shadow-soft">
        <p className="text-yellow-800">
          Impossible d'afficher les détails de la réservation.
        </p>
      </div>
    );
  }

  const formattedDate = new Date(booking.date).toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

  // Extraction sécurisée des données
  const eventTitle = booking.eventType.title;
  // Le premier attendee est généralement le booker
  const attendeeEmail = booking.booking.attendees?.[0]?.email ?? "votre adresse email";

  const message = texts.message
    .replace("{eventType}", eventTitle)
    .replace("{date}", formattedDate);

  const emailSent = texts.emailSent.replace("{email}", attendeeEmail);

  return (
    <div
      id="booking-confirmation"
      className="rounded-2xl border border-black bg-green-50 p-6 mb-8 shadow-soft"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start gap-4">
        <svg
          className="w-6 h-6 text-green-600 flex-shrink-0 mt-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-green-900 mb-2">
            {texts.title}
          </h3>
          <p className="text-green-800 mb-2">{message}</p>
          <p className="text-green-700 text-sm mb-4">{emailSent}</p>

          {/* Lien visio si disponible */}
          {booking.booking.videoCallUrl && (
            <p className="text-green-700 text-sm mb-4">
              Lien de visioconférence :{" "}
              <a
                href={booking.booking.videoCallUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-semibold"
              >
                Rejoindre la réunion
              </a>
            </p>
          )}

          <div className="flex flex-wrap gap-3">
            <button
              onClick={onNewBooking}
              className="px-4 py-2 bg-white border border-green-300 text-green-700 rounded-md hover:bg-green-50 transition-colors"
            >
              {texts.newBooking}
            </button>
            <button
              onClick={onGoHome}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              {texts.goHome}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}