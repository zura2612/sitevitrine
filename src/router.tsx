// fichier src/router.tsx
import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

// ✅ 1. Définition du type de notre contexte global pour auth0
/*export interface RouterContext {
  auth: {
    isAuthenticated: boolean;
    isLoading: boolean;
  };
}*/

// ✅ Définition du type de notre contexte global pour WorkOS
export interface RouterContext {
  auth: {
    isAuthenticated: boolean;
    isLoading: boolean;
    user?: {
      id: string;
      email?: string;
      firstName?: string;
      lastName?: string;
    };
  };
}

// ✅ 2. Création du router avec un contexte initial
export function getRouter() {
  const router = createTanStackRouter({
    routeTree,
    // Initialisation obligatoire pour éviter que context soit undefined
    context: {
      auth: {
        isAuthenticated: false,
        isLoading: true,
      },
    } as RouterContext,
    scrollRestoration: true,
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
  })
  return router
}

// ✅ 3. Déclaration du module pour étendre les types de TanStack Router
declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
  
  // ✅ C'est ici qu'on dit à TS que le contexte a cette forme pour auth0
  /*interface ContextOptions {
    auth: {
      isAuthenticated: boolean;
      isLoading: boolean;
    };
  }*/
  // le contexte a cette forme pour workos
  interface ContextOptions {
    auth: {
      isAuthenticated: boolean;
      isLoading: boolean;
      user?: any;
    };
  }

}