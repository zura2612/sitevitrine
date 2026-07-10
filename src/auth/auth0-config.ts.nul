// fichier src/auth/auth0-config.ts
const domain = import.meta.env.VITE_AUTH0_DOMAIN;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
const redirect_uri = import.meta.env.VITE_AUTH0_REDIRECT_URI;

export const auth0Config = {
  domain,
  clientId,
  authorizationParams: {
    redirect_uri,
    scope: 'openid profile email',
  },
  cacheLocation: 'localstorage',
};