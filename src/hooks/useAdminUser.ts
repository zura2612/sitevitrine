// fichier src/hooks/useAdminUser.ts
import { useState, useEffect } from 'react';
import { useAuth } from '@workos-inc/authkit-react';
import { getCurrentUser } from '@/lib/admin-api';

interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  emailVerified: boolean;
  metadata: {
    role?: string;
    slug?: string;
    [key: string]: any;
  };
  createdAt: string;
  lastSignInAt: string | null;
}

export function useAdminUser() {
  const { user, getAccessToken, isLoading: isAuthLoading } = useAuth();
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || isAuthLoading) {
      setIsLoading(false);
      return;
    }

    async function loadAdminUser() {
      try {
        setIsLoading(true);
        const response = await getCurrentUser(getAccessToken);
        setAdminUser(response.data);
        setError(null);
      } catch (err) {
        console.error('Erreur chargement admin user:', err);
        setError(err instanceof Error ? err.message : 'Erreur de chargement');
        setAdminUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    loadAdminUser();
  }, [user, isAuthLoading, getAccessToken]);



  // pour un projet donné metadata.role = name et metadata.slug = slug du rôle défini dans Authorization/Roles
  const isAdmin = adminUser?.metadata?.role === 'AdminSiteDev';
if(adminUser) {
console.log("hooks/useAdminUser.ts adminUser.metadata.role=", adminUser.metadata.role);
console.log("hooks/useAdminUser.ts adminUser.metadata.slug=", adminUser.metadata.slug);
console.log("hooks/useAdminUser.ts isAdmin=", isAdmin);
console.log("Détail isAdmin :", adminUser );
console.log("Détail isAdmin :", {fullAdminUser: adminUser} );
} else console.log("hooks/useAdminUser.ts adminUser=null!");

  return {
    adminUser,
    isLoading: isAuthLoading || isLoading,
    error,
    isAdmin
  };
}