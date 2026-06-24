import { useEffect, useRef, useState } from "react";
import { getCalInstance } from "@/lib/cal";
import { useCalEvents } from "@/hooks/useCalEvents";
import type { CalEventHandlers } from "@/types/cal";

interface InlineCalendarProps {
  calLink: string;
  layout?: "month_view" | "column_view" | "week_view";
  eventHandlers: CalEventHandlers;
  className?: string;
  loadingText?: string;
  errorText?: string;
  retryText?: string;
}

export function InlineCalendar({
  calLink,
  layout = "month_view",
  eventHandlers,
  className,
  loadingText = "Chargement des disponibilités...",
  errorText = "Impossible de charger le calendrier.",
  retryText = "Réessayer"
}: InlineCalendarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");
  const isInitializedRef = useRef(false);

  useCalEvents(eventHandlers);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    // Protection contre StrictMode : ne pas initialiser deux fois
    if (isInitializedRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isInitializedRef.current) {
          observer.disconnect();
          // Délai pour laisser le DOM se stabiliser après StrictMode
          setTimeout(() => {
            if (containerRef.current && document.body.contains(containerRef.current)) {
              isInitializedRef.current = true;
              loadCalendar();
            }
          }, 100);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [calLink, layout]);

  const loadCalendar = async () => {
    try {
      const cal = await getCalInstance();
      const element = containerRef.current;

      if (!element || !document.body.contains(element)) {
        console.warn("Container not in DOM, skipping initialization");
        return;
      }

      cal("inline", {
        elementOrSelector: element,
        calLink,
        layout
      });

      setStatus("loaded");
    } catch (error) {
      console.error("Cal.com loading failed:", error);
      setStatus("error");
      isInitializedRef.current = false;
    }
  };

  return (
    <div className={className}>
      <div
        ref={containerRef}
        className="min-h-[600px] w-full"
        role="application"
        aria-label="Calendrier de réservation"
      >
        {status === "loading" && (
          <div className="flex flex-col items-center justify-center gap-3 py-12 text-gray-400">
            <div
              className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"
              aria-hidden="true"
            />
            <span className="text-sm">{loadingText}</span>
          </div>
        )}
        {status === "error" && (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <p className="text-red-600">{errorText}</p>
            <button
              onClick={() => {
                isInitializedRef.current = false;
                setStatus("loading");
                loadCalendar();
              }}
              className="px-4 py-2 text-sm text-blue-600 underline hover:text-blue-800"
            >
              {retryText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}