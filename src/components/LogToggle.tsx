// fichier src/components/LogToggle.tsx
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@workos-inc/authkit-react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { LogIn, LogOut, Loader2, ChevronDown, Shield } from "lucide-react";
import { clearLastSelectedEvent } from "@/lib/last-event";
import { BOOKING_STORAGE_KEY } from "@/lib/storage-keys";
import { useAdminUser } from "@/hooks/useAdminUser";

interface LogToggleProps {
  labels: {
    login: string;
    logout: string;
    loading: string;
    logoutSuccess: string;
  };
}

// ✅ Vérification du rôle administrateur via les métadonnées WorkOS
/*const isUserAdmin = (user: any): boolean => {
  if (!user) return false;
  return (
    user?.metadata?.role === 'AdminSiteDev' && 
    user?.metadata?.slug === 'admin'
  );
};*/

export function LogToggle({ labels }: LogToggleProps) {
  //const { user, isLoading, signIn, signOut, getAccessToken } = useAuth(); //@workos-inc/authkit-react
  const { user, isLoading, signIn, signOut } = useAuth(); //@workos-inc/authkit-react
  const { adminUser, isLoading: isAdminLoading, isAdmin } = useAdminUser(); //@/hooks/useAdminUser
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

// pour débogage
/*  useEffect(() => {
    if (user) {
      console.log("Structure complète de l'utilisateur WorkOS :", JSON.stringify(user, null, 2));
      console.log("user.email :", user.email);
      //console.log("user.profile :", (user as any).profile);
    }
  }, [user]);*/

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
    setIsMenuOpen(false); // Fermer le menu immédiatement
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
  //if (isLoading || isLoggingOut) {
  if (isLoading || isLoggingOut || isAdminLoading) {
    return (
      <button disabled className="rounded-xl px-4 py-2 text-sm font-semibold opacity-50 cursor-not-allowed flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>{labels.loading}</span>
      </button>
    );
  }

  // ✅ UTILISATEUR CONNECTÉ : Afficher le prénom ou "Connecté" + Menu déroulant
  if (user) {
    const displayName = user.firstName || "Connecté";
    //const isAdmin = isUserAdmin(user);

    return (
      <div className="relative" ref={menuRef}>
        <Toaster position="top-right" duration={4000} />
        
        {/* Bouton principal */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="rounded-xl px-4 py-2 text-sm font-semibold bg-gray-100 hover:bg-gray-200 transition-colors flex items-center gap-2 border border-gray-300"
          aria-expanded={isMenuOpen}
          aria-haspopup="true"
        >
          <span>{displayName}</span>
          <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Menu déroulant (Tailwind pur) */}
        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            
            {/* Item Administrer (Conditionnel) */}
            {isAdmin && (
              <Link
                to="/admin/utilisateurs"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-100"
              >
                <Shield className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-700">Administrer</span>
              </Link>
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

  // ✅ UTILISATEUR NON CONNECTÉ : Comportement actuel
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