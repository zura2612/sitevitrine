// fichier src/hooks/useMaintenanceStatus.ts
import { useState, useEffect } from "react";
import type { MaintenanceStatus } from "@/lib/maintenance";
import {
  getCachedStatus,
  setCachedStatus,
  getFallbackMode,
} from "@/lib/maintenance";

interface UseMaintenanceStatusResult {
  status: MaintenanceStatus | null;
  isLoading: boolean;
  error: Error | null;
}

export function useMaintenanceStatus(): UseMaintenanceStatusResult {
  const [status, setStatus] = useState<MaintenanceStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchStatus() {
      // 1. Vérifier le cache local d'abord
      const cached = getCachedStatus();
      if (cached) {
        if (isMounted) {
          setStatus(cached);
          setIsLoading(false);
        }
        return;
      }

      // 2. Récupérer les URLs et le nom du site
      const workerUrl = import.meta.env.VITE_MAINTENANCE_WORKER_URL;
      const siteName = import.meta.env.VITE_SITE_NAME;
      
      if (!workerUrl) {
        console.warn("VITE_MAINTENANCE_WORKER_URL non configuré, mode normal par défaut");
        if (isMounted) {
          setStatus({ mode: "normal" });
          setIsLoading(false);
        }
        return;
      }

      if (!siteName) {
        console.warn("VITE_SITE_NAME non configuré, mode normal par défaut");
        if (isMounted) {
          setStatus({ mode: "normal" });
          setIsLoading(false);
        }
        return;
      }

      // 3. Construire l'URL avec le paramètre site
//console.log(`useMaintenanceStatus: maintenance status for site "${siteName}" from worker URL: ${workerUrl}`);
      const statusUrl = `${workerUrl}/api/status?site=${encodeURIComponent(siteName)}`;

      try {
        const response = await fetch(statusUrl, {
          method: "GET",
          headers: {
            "Accept": "application/json",
          },
          cache: "default",
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const result = await response.json();
        
        if (result.success && result.data) {
          const maintenanceStatus = result.data as MaintenanceStatus;
          
          setCachedStatus(maintenanceStatus);
          
          if (isMounted) {
            setStatus(maintenanceStatus);
            setError(null);
          }
        } else {
          throw new Error(result.error || "Invalid response");
        }
      } catch (err) {
        console.error(`Failed to fetch maintenance status for site "${siteName}":`, err);
        
        const fallback = getFallbackMode();
        
        if (isMounted) {
          setStatus(fallback);
          setError(err instanceof Error ? err : new Error("Unknown error"));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchStatus();

    return () => {
      isMounted = false;
    };
  }, []);

  return { status, isLoading, error };
}