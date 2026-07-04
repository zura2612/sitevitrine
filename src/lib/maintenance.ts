// fichier src/lib/maintenance.ts

export interface MaintenanceStatus {
  mode: "normal" | "maintenance";
  message?: { fr: string; en: string };
  description?: { fr: string; en: string };
  estimatedEnd?: { fr: string; en: string };
}

export interface MaintenanceApiResponse {
  success: boolean;
  site?: string;
  data?: MaintenanceStatus;
  error?: string;
}

// Durée du cache local (en ms)
export const MAINTENANCE_CACHE_DURATION = 60_000; // 60 secondes

// Clé pour le cache local
export const MAINTENANCE_CACHE_KEY = "maintenanceStatus";

interface CachedStatus {
  data: MaintenanceStatus;
  timestamp: number;
}

/**
 * Récupère le statut de maintenance depuis le cache local
 */
export function getCachedStatus(): MaintenanceStatus | null {
  if (typeof window === "undefined") return null;
  
  try {
    const cached = sessionStorage.getItem(MAINTENANCE_CACHE_KEY);
    if (!cached) return null;
    
    const { data, timestamp }: CachedStatus = JSON.parse(cached);
    
    if (Date.now() - timestamp > MAINTENANCE_CACHE_DURATION) {
      sessionStorage.removeItem(MAINTENANCE_CACHE_KEY);
      return null;
    }
    
    return data;
  } catch {
    return null;
  }
}

/**
 * Met en cache le statut de maintenance
 */
export function setCachedStatus(data: MaintenanceStatus): void {
  if (typeof window === "undefined") return;
  
  try {
    const cached: CachedStatus = {
      data,
      timestamp: Date.now(),
    };
    sessionStorage.setItem(MAINTENANCE_CACHE_KEY, JSON.stringify(cached));
  } catch {
    // Silencieux
  }
}

/**
 * Détermine le mode de fallback si le Worker est indisponible
 */
export function getFallbackMode(): MaintenanceStatus {
  const fallback = import.meta.env.VITE_MAINTENANCE_FALLBACK_MODE;
  
  if (fallback === "maintenance") {
    return {
      mode: "maintenance",
      message: {
        fr: "Service temporairement indisponible",
        en: "Service temporarily unavailable",
      },
      description: {
        fr: "Veuillez réessayer dans quelques instants.",
        en: "Please try again in a few moments.",
      },
    };
  }
  
  return { mode: "normal" };
}