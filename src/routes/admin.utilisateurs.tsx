// fichier src/routes/admin.utilisateurs.tsx
import { createFileRoute, redirect } from '@tanstack/react-router';
import { useAuth } from '@workos-inc/authkit-react';
import { useAdminUser } from '@/hooks/useAdminUser';
import { useEffect, useState } from 'react';
import { Loader2, ShieldAlert, UserCheck } from 'lucide-react';

export const Route = createFileRoute('/admin/utilisateurs')({
  component: AdminUsersPage,
});

interface UserData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role?: string;
  createdAt: string;
}

function AdminUsersPage() {
  const { user, isLoading, getAccessToken } = useAuth();
  const { adminUser, isAdmin, isLoading: isAdminLoading } = useAdminUser();
  const [usersList, setUsersList] = useState<UserData[]>([]);
  const [isFetchingUsers, setIsFetchingUsers] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // ========================================================
  // 1. TOUS LES HOOKS EN PREMIER (Règle d'or de React)
  // ========================================================
  useEffect(() => {
    async function fetchUsers() {
      setIsFetchingUsers(true);
      setFetchError(null);
      try {
        const token = await getAccessToken();
        const response = await fetch('http://localhost:8789/api/users', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`Erreur serveur: ${response.status}`);
        }

        const result = await response.json();
        // S'adapte si ton worker renvoie { success: true, data: [...] } ou directement le tableau
        setUsersList(result.data || result);
      } catch (err: any) {
        console.error("Erreur lors de la récupération des utilisateurs:", err);
        setFetchError("Impossible de charger la liste des utilisateurs.");
      } finally {
        setIsFetchingUsers(false);
      }
    }

    // On ne lance le fetch que si l'utilisateur est confirmé comme admin
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin, getAccessToken]);

  // ========================================================
  // 2. ÉTATS DE CHARGEMENT (Pare-feu contre les redirections à froid)
  // ========================================================
  // On bloque l'affichage tant qu'on n'a pas la confirmation d'adminUser par le Worker
  if (isLoading || isAdminLoading || adminUser === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-gray-500 text-sm">Vérification de vos droits d'accès...</p>
      </div>
    );
  }

  // ========================================================
  // 3. SÉCURITÉ ET REDIRECTION (Évaluée seulement après chargement)
  // ========================================================
  if (!user || !isAdmin) {
    throw redirect({ to: '/' });
  }

  // ========================================================
  // 4. RENDU DE LA PAGE D'ADMINISTRATION
  // ========================================================
  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      {/* En-tête de page */}
      <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <UserCheck className="h-6 w-6 text-blue-600" />
            Administration des utilisateurs
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Connecté en tant que : <strong className="text-blue-700">{adminUser?.metadata?.role || 'Admin'}</strong> ({user.email})
          </p>
        </div>
      </div>

      {/* Contenu dynamique (Chargement du tableau / Erreurs / Liste) */}
      {isFetchingUsers ? (
        <div className="flex flex-col items-center justify-center py-12 gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-gray-500 text-sm">Récupération de la liste des comptes...</p>
        </div>
      ) : fetchError ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-800 flex items-center gap-3">
          <ShieldAlert className="h-5 w-5 text-red-600" />
          <span>{fetchError}</span>
        </div>
      ) : (
        /* Tableau scannable des utilisateurs */
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <th className="px-6 py-4">Nom</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Rôle</th>
                <th className="px-6 py-4">ID de l'utilisateur</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
              {usersList.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-gray-400 italic">
                    Aucun utilisateur trouvé.
                  </td>
                </tr>
              ) : (
                usersList.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {u.firstName || '—'} {u.lastName || ''}
                    </td>
                    <td className="px-6 py-4 text-gray-500">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        u.role === 'AdminSiteDev' || u.role === 'admin'
                          ? 'bg-blue-50 text-blue-700 border border-blue-100'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {u.role || 'Utilisateur'}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-gray-400">{u.id}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}