// fichier src/auth/workos-config.ts
const clientId = import.meta.env.VITE_WORKOS_CLIENT_ID;
const redirectUri = import.meta.env.VITE_WORKOS_REDIRECT_URI;
const apiHostname = import.meta.env.VITE_WORKOS_API_HOSTNAME;
/*console.log("auth/workos-config.ts: VITE_WORKOS_CLIENT_ID=",clientId);
console.log("auth/workos-config.ts: VITE_WORKOS_REDIRECT_URI=",redirectUri);
console.log("auth/workos-config.ts: VITE_WORKOS_API_HOSTNAME=",apiHostname);*/

// WorkOS gère la redirection automatiquement, mais on peut définir l'URL de base si besoin
export const workosConfig = { clientId, redirectUri, apiHostname };