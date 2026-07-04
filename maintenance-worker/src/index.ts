// fichier maintenance-worker/src/index.ts
// Worker Cloudflare qui expose une API de statut de maintenance
// Le statut est stocké dans les variables d'environnement du Worker
// Le site demandeur est identifié via le paramètre ?site=nomsite

export interface Env {
  // Variables d'environnement contenant la config JSON de chaque site
  // Ex: MAINTENANCE_CONFIG_NOMSITE='{"mode":"normal","message":{...}}'
  [key: string]: string | undefined;
}

interface SiteMaintenanceStatus {
  mode: "normal" | "maintenance";
  message?: { fr: string; en: string };
  description?: { fr: string; en: string };
  estimatedEnd?: { fr: string; en: string } | null;
}

interface ApiResponse {
  success: boolean;
  site?: string;
  data?: SiteMaintenanceStatus;
  error?: string;
}

const DEFAULT_CACHE_SECONDS = 60;

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (url.pathname === "/api/status") {
      return handleStatusRequest(url, env, corsHeaders);
    }

    if (url.pathname === "/api/sites") {
      return handleListSitesRequest(env, corsHeaders);
    }

    if (url.pathname === "/" || url.pathname === "") {
      return new Response(
        JSON.stringify({
          service: "maintenance-worker",
          version: "1.0.0",
          endpoints: ["/api/status?site=<site_name>", "/api/sites"],
        }),
        {
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    return new Response(
      JSON.stringify({ success: false, error: "Not found" }),
      {
        status: 404,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  },
};

async function handleStatusRequest(
  url: URL,
  env: Env,
  corsHeaders: Record<string, string>
): Promise<Response> {
  const siteName = url.searchParams.get("site");
  
  if (!siteName) {
    return jsonResponse(
      {
        success: false,
        error: "Le paramètre 'site' est manquant. Usage: /api/status?site=<site_name>",
      },
      corsHeaders,
      10,
      400
    );
  }

  try {
    // ✅ Lire la variable d'environnement correspondant au site
    // Convention : MAINTENANCE_CONFIG_<NOM_DU_SITE_EN_MAJUSCULES>
    const envVarName = `MAINTENANCE_CONFIG_${siteName.toUpperCase()}`;
    const configJson = env[envVarName];
    
    if (!configJson || typeof configJson !== "string") {
      // Site non configuré → mode normal par défaut
      return jsonResponse(
        {
          success: true,
          site: siteName,
          data: { mode: "normal" },
        },
        corsHeaders,
        DEFAULT_CACHE_SECONDS
      );
    }

    // Parser le JSON
    const siteData = JSON.parse(configJson) as SiteMaintenanceStatus;
    return jsonResponse(
      {
        success: true,
        site: siteName,
        data: siteData,
      },
      corsHeaders,
      DEFAULT_CACHE_SECONDS
    );
  } catch (error) {
    console.error(`Erreur de lecture du statut normal ou maintenance pour le site "${siteName}":`, error);
    
    return jsonResponse(
      {
        success: false,
        site: siteName,
        error: "impossible de lire le statut du site normal ou maintenance",
        data: { mode: "normal" },
      },
      corsHeaders,
      10,
      500
    );
  }
}

async function handleListSitesRequest(
  env: Env,
  corsHeaders: Record<string, string>
): Promise<Response> {
  try {
    const sites: Array<{ name: string; mode: string }> = [];
    
    // Parcourir toutes les variables d'environnement
    for (const [key, value] of Object.entries(env)) {
      if (key.startsWith("MAINTENANCE_CONFIG_") && typeof value === "string") {
        try {
          const siteName = key.replace("MAINTENANCE_CONFIG_", "").toLowerCase();
          const config = JSON.parse(value) as SiteMaintenanceStatus;
          sites.push({
            name: siteName,
            mode: config.mode,
          });
        } catch {
          // Ignorer les variables mal formées
        }
      }
    }

    return jsonResponse(
      { success: true, sites },
      corsHeaders,
      DEFAULT_CACHE_SECONDS
    );
  } catch (error) {
    console.error("Error listing sites:", error);
    return jsonResponse(
      { success: false, error: "Failed to list sites", sites: [] },
      corsHeaders,
      10,
      500
    );
  }
}

function jsonResponse(
  data: ApiResponse | Record<string, unknown>,
  corsHeaders: Record<string, string>,
  cacheSeconds: number,
  status: number = 200
): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": `public, max-age=${cacheSeconds}`,
      ...corsHeaders,
    },
  });
}