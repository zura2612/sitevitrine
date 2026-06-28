// fichier src/hooks/useAuthGuard.ts
/**
 * Hook utilitaire pour vérifier l'état d'authentification Auth0
 * 
 * MODIFICATION: Création d'un hook centralisé pour éviter la duplication
 * de logique de vérification d'authentification dans les composants
 */
import { useAuth0 } from '@auth0/auth0-react';

export function useAuthGuard() {
  const { isAuthenticated, isLoading } = useAuth0();
  
  return {
    isAuthenticated,
    isLoading,
    // Helper pour savoir si on peut afficher du contenu protégé
    canAccessProtectedContent: !isLoading && isAuthenticated
  };
}