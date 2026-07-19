// fichier src/routes/admin.utilisateurs.tsx
import { createFileRoute, redirect } from '@tanstack/react-router';
import { useAuth } from '@workos-inc/authkit-react';
import { useAdminUser } from '@/hooks/useAdminUser';
import { useEffect, useState } from 'react';
import { Loader2, ShieldAlert, UserCheck, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

//taille maximale de la page affichée définie dans admin-worker/src/routes/users.ts
const DEFAULT_PAGE_SIZE = 20;
const baseUrl = import.meta.env.VITE_ADMIN_WORKER_URL;

export const Route = createFileRoute('/admin/utilisateurs')({
  component: AdminUsersPage,
});

interface UserData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  metadata?: {role?: string;};
  createdAt: string;
}

interface PaginationMeta {
  before: string | null;
  after: string | null;
  hasBefore: boolean;
  hasMore: boolean;
}

function AdminUsersPage() {
  const { user, isLoading, getAccessToken } = useAuth();
  const { adminUser, isAdmin, isLoading: isAdminLoading } = useAdminUser();
  const [usersList, setUsersList] = useState<UserData[]>([]);
  const [isFetchingUsers, setIsFetchingUsers] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // États pour gérer la pagination par curseur
  const [pagination, setPagination] = useState<PaginationMeta>({
    before: null,
    after: null,
    hasBefore: false,
    hasMore: false,
  });
  const [currentCursor, setCurrentCursor] = useState<{ type: 'after' | 'before' | 'init'; value: string | null }>({
    type: 'init',
    value: null
  });

  // ========================================================
  // 1. FETCH DES UTILISATEURS AVEC PAGINATION
  // ========================================================
  useEffect(() => {
    async function fetchUsers() {
      setIsFetchingUsers(true);
      setFetchError(null);
      try {
        const token = await getAccessToken();
        // Construction de l'URL avec les jetons after ou before si applicables
        let url = `${baseUrl}/api/users?limit=${DEFAULT_PAGE_SIZE}`;
        if (currentCursor.type === 'after' && currentCursor.value) {
          url += `&after=${currentCursor.value}`;
        } else if (currentCursor.type === 'before' && currentCursor.value) {
          url += `&before=${currentCursor.value}`;
        }
        
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`Erreur serveur: ${response.status}`);
        }

        const result = await response.json();
        setUsersList(result.data || []);
        
        if (result.pagination) {
          setPagination(result.pagination);
        }
      } catch (err: any) {
        console.error("Erreur lors de la récupération des utilisateurs:", err);
        setFetchError("Impossible de charger la liste des utilisateurs.");
      } finally {
        setIsFetchingUsers(false);
      }
    }

    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin, getAccessToken, currentCursor]);

  // Actions des boutons
  const handleNextPage = () => {
    if (pagination.after) {
      setCurrentCursor({ type: 'after', value: pagination.after });
    }
  };

  const handlePrevPage = () => {
    if (pagination.before) {
      setCurrentCursor({ type: 'before', value: pagination.before });
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const token = await getAccessToken();
      const response = await fetch('${baseUrl}/api/users/export', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) throw new Error();

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `export_utilisateurs_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success("Exportation réussie !");
    } catch (err) {
      toast.error("Échec de l'exportation.");
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading || isAdminLoading || adminUser === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-gray-500 text-sm">Vérification de vos droits d'accès...</p>
      </div>
    );
  }

  if (!user || !isAdmin) {
    throw redirect({ to: '/' });
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      {/* En-tête */}
      <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-5">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <UserCheck className="h-6 w-6 text-blue-600" />
            Administration des utilisateurs
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Connecté avec le rôle <strong className="text-blue-700">{adminUser?.metadata?.role}</strong> ({user.email})
          </p>
        </div>
      </div>

      {/* Barre d'actions */}
      <div className="flex justify-end mb-4">
        <button
          onClick={handleExport}
          disabled={isExporting || isFetchingUsers || usersList.length === 0}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-sm transition-colors"
        >
          {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          <span>Exporter la liste (.csv)</span>
        </button>
      </div>

      {/* Contenu principal */}
      {isFetchingUsers ? (
        <div className="flex flex-col items-center justify-center py-12 gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-gray-500 text-sm">Chargement des utilisateurs...</p>
        </div>
      ) : fetchError ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-800 flex items-center gap-3">
          <ShieldAlert className="h-5 w-5 text-red-600" />
          <span>{fetchError}</span>
        </div>
      ) : (
        <>
          {/* Tableau */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-4">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <th className="px-6 py-4">Nom</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Rôle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                {usersList.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-10 text-center text-gray-400 italic">Aucun utilisateur.</td>
                  </tr>
                ) : (
                  usersList.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">{u.firstName} {u.lastName}</td>
                      <td className="px-6 py-4 text-gray-500">{u.email}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {u.metadata?.role || 'inconnu'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* 🛠️ Boutons de pagination sous le tableau */}
          <div className="flex items-center justify-between border border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-xl shadow-sm">
            <div className="text-sm text-gray-500">
              Affichage de <span className="font-medium">{usersList.length}</span> utilisateur(s)
            </div>
            <div className="flex gap-2">
              <button
                onClick={handlePrevPage}
                disabled={!pagination.hasBefore || isFetchingUsers}
                className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
                Précédent
              </button>
              <button
                onClick={handleNextPage}
                disabled={!pagination.hasMore || isFetchingUsers}
                className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Suivant
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </main>
  );
}