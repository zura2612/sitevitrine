// fichier src/routes/_protected.tsx
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_protected')({
  // ajout de path indiquant que c'est un pathless layout
  path: '',
  beforeLoad: async ({ context }) => {
    // On attend qu'Auth0 ait fini de charger
    if (context.auth.isLoading) {
      return; 
    }
    // rediriger si non authentifié
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: '/',
        search: { auth_required: 'true' }
      });
    }
  },
});