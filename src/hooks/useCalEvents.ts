import { useEffect, useRef } from "react";
import { getCalInstance } from "@/lib/cal";
import type { CalEventHandlers, CalEvent } from "@/types/cal";

export function useCalEvents(handlers: CalEventHandlers) {
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;
  const isSetupRef = useRef(false);

  useEffect(() => {
    if (isSetupRef.current) return;

    let isMounted = true;
    let cal: Awaited<ReturnType<typeof getCalInstance>> | null = null;

    const setup = async () => {
      try {
        cal = await getCalInstance();
        if (!isMounted) return;

        isSetupRef.current = true;

        cal("on", {
          action: "bookingSuccessful",
          callback: (e: unknown) => {
            const event = e as { detail?: CalEvent };
            const data = event?.detail?.data;

            if (!data || !data.date) {
              console.error("Invalid booking data received:", data);
              return;
            }

            handlersRef.current.onBookingSuccess?.(data);
          }
        });

        cal("on", {
          action: "bookingCancelled",
          callback: (e: unknown) => {
            const event = e as { detail?: CalEvent };
            const data = event?.detail?.data;
            if (data) {
              handlersRef.current.onBookingCancel?.(data);
            }
          }
        });

        cal("on", {
          action: "rescheduleBooking",
          callback: (e: unknown) => {
            const event = e as { detail?: CalEvent };
            const data = event?.detail?.data;
            if (data) {
              handlersRef.current.onReschedule?.(data);
            }
          }
        });
      } catch (error) {
        console.error("Failed to setup Cal events:", error);
      }
    };

    setup();

    return () => {
      isMounted = false;
      if (cal && !isSetupRef.current) {
        cal("off", { action: "bookingSuccessful" });
        cal("off", { action: "bookingCancelled" });
        cal("off", { action: "rescheduleBooking" });
      }
    };
  }, []);
}