// fichier src/components/LogToggle.tsx
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@workos-inc/authkit-react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { LogIn, LogOut, Loader2, ChevronDown, Shield, BarChart3 } from "lucide-react";
import { clearLastSelectedEvent } from "@/lib/last-event";
import { BOOKING_STORAGE_KEY } from "@/lib/storage-keys";
import { useAdminUser } from "@/hooks/useAdminUser";

interface LogToggleProps {
  labels: {
    login: string;
    logout: string;
    loading: string;
    logoutSuccess: string;
    connected: string;
  };
}

const boutonConnectedStyle = "rounded-xl px-4 py-2 text-sm font-semibold text-center tracking-wider transition hover:opacity-80";

export function LogToggle({ labels }: LogToggleProps) {
  const { user, isLoading, signIn, signOut } = useAuth();
  const { adminUser, isLoading: isAdminLoading, isAdmin } = useAdminUser();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Fermer le menu si on clique en dehors
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogin = () => {
    signIn();
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setIsMenuOpen(false);
    clearLastSelectedEvent();
    
    try {
      sessionStorage.removeItem(BOOKING_STORAGE_KEY);
      await signOut();
      toast.success(labels.logoutSuccess, { duration: 4000 });
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      toast.error("Erreur lors de la déconnexion", { duration: 4000 });
    } finally {
      setIsLoggingOut(false);
    }
  };

  // État de chargement
  if (isLoading || isLoggingOut || isAdminLoading) {
    return (
      <button disabled className="rounded-xl px-4 py-2 text-sm font-semibold opacity-50 cursor-not-allowed flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>{labels.loading}</span>
      </button>
    );
  }

  // ✅ UTILISATEUR CONNECTÉ
  if (user) {
    const displayName = user.firstName || labels.connected;
   
    return (
      <div className="relative" ref={menuRef}>
        <Toaster position="top-right" duration={4000} />
        
        {/* Bouton principal */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={boutonConnectedStyle}
          aria-expanded={isMenuOpen}
          aria-haspopup="true"
        >
          <span>{displayName}</span>
          <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Menu déroulant */}
        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            
            {/* ✅ Menu Administrer scindé en deux si isAdmin */}
            {isAdmin && (
              <>
                <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider bg-gray-50 border-b border-gray-100">
                  Administration
                </div>
                
                {/* Lien vers la gestion des utilisateurs */}
                <Link
                  to="/admin/utilisateurs"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Shield className="h-4 w-4 text-blue-600" />
                  <span>Utilisateurs</span>
                </Link>

                {/* Lien vers la page des statistiques */}
                <Link
                  to="/admin/statistiques"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-100"
                >
                  <BarChart3 className="h-4 w-4 text-blue-600" />
                  <span>Statistiques</span>
                </Link>
              </>
            )}

            {/* Item Se déconnecter */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
            >
              <LogOut className="h-4 w-4" />
              <span>{labels.logout}</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  // ✅ UTILISATEUR NON CONNECTÉ
  return (
    <>
      <Toaster position="top-right" duration={4000} />
      <button
        onClick={handleLogin}
        className="rounded-xl px-4 py-2 text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-2"
        aria-label={labels.login}
      >
        <LogIn className="h-4 w-4" />
        <span>{labels.login}</span>
      </button>
    </>
  );
}