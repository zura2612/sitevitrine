// fichier src/auth/workos-config.ts
console.log("workos-config.ts: VITE_WORKOS_CLIENT_ID=",import.meta.env.VITE_WORKOS_CLIENT_ID);
export const workosConfig = {
  clientId: import.meta.env.VITE_WORKOS_CLIENT_ID,
  apiHostname: import.meta.env.VITE_WORKOS_API_HOSTNAME || 'api.workos.com',
  // WorkOS gère la redirection automatiquement, mais on peut définir l'URL de base si besoin
};