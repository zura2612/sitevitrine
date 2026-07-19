// fichier src/lib/admin-api.ts

const ADMIN_WORKER_URL = import.meta.env.VITE_ADMIN_WORKER_URL;

export async function callAdminApi(
  endpoint: string,
  getAccessToken: () => Promise<string>
) {
  try {
    if (!ADMIN_WORKER_URL) {
      throw new Error("admin-api.ts: VITE_ADMIN_WORKER_URL est manquant dans le fichier .env du projet front !");
    }

    const accessToken = await getAccessToken();
    
    if (!accessToken || accessToken.length < 50) {
      throw new Error('admin-api.ts: Non authentifié : le token d\'accès est manquant ou invalide');
    }

    // ✅ NOUVEAU : Décoder le payload du JWT pour voir son contenu
    try {
      const base64Url = accessToken.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join('')
      );
      const payload = JSON.parse(jsonPayload);
      /*console.log("🔍 PAYLOAD DU JWT:", payload);
      console.log("🔍 Audience (aud):", payload.aud);
      console.log("🔍 Expiration (exp):", new Date(payload.exp * 1000).toLocaleString());*/
    } catch (e) {
      console.warn("admin-api.ts: Impossible de décoder le JWT", e);
    }

    const fullUrl = `${ADMIN_WORKER_URL}${endpoint}`;
    //console.log(`[Admin API] Appel vers : ${fullUrl}`);

    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const rawText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(rawText);
      } catch {
        errorData = { error: `admin-api.ts: Réponse non-JSON (Status ${response.status}) : ${rawText.substring(0, 150)}...` };
      }
      
      if (response.status === 401) {
        console.error("admin-api.ts Le worker a rejeté le token. Détail :", errorData);
        throw new Error('admin-api.ts Session expirée ou token invalide, veuillez vous reconnecter');
      } 
      throw new Error(errorData.error || `admin-api.ts: Erreur API: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error(`admin-api.ts: Échec critique sur ${endpoint}:`, error);
    throw error;
  }
}

export async function getCurrentUser(getAccessToken: () => Promise<string>) {
  return callAdminApi('/api/me', getAccessToken);
}