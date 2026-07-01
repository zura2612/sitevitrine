// fichier src/components/LogToggle.tsx
//import { useAuth0 } from "@auth0/auth0-react";
import { useAuth } from "@workos-inc/authkit-react";
import { LogIn, LogOut, Loader2 } from "lucide-react";
import { clearLastSelectedEvent } from "@/lib/last-event";
import { BOOKING_STORAGE_KEY } from "@/lib/storage-keys"; // ✅ Import centralisé

interface LogToggleProps {
  labels: {
    login: string;
    logout: string;
    loading: string;
  };
}

export function LogToggle({ labels }: LogToggleProps) {
  //const { loginWithRedirect, logout, isAuthenticated, isLoading } = useAuth0();
  const { user, isLoading, signIn, signOut } = useAuth();

  //const handleLogin = () => { loginWithRedirect(); }; pour Auth0
  const handleLogin = () => { signIn(); };// pour WorkOS

  const handleLogout = () => {
    clearLastSelectedEvent(); // Nettoie localStorage
    
    // ✅ NOUVEAU: Nettoyer sessionStorage (réservations en cours)
    // On cible spécifiquement la clé utilisée dans rendez-vous.tsx
    try {
      sessionStorage.removeItem(BOOKING_STORAGE_KEY);
    } catch (error) {
      console.warn("Echec au nettoyage de sessionStorage:", error);
    }

    //logout({ logoutParams: { returnTo: window.location.origin } }); pour Auth0
    signOut();// pour WorkOS
  };

  if (isLoading) {
    return (
      <button
        disabled
        className="rounded-xl px-4 py-2 text-sm font-semibold opacity-50 cursor-not-allowed flex items-center gap-2"
        aria-label={labels.loading}
      >
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>{labels.loading}</span>
      </button>
    );
  }

  /*if (isAuthenticated) { pour Auth0
    return (
      <button
        onClick={handleLogout}
        className="rounded-xl px-4 py-2 text-sm font-semibold hover:opacity-80 flex items-center gap-2"
        aria-label={labels.logout}
      >
        <LogOut className="h-4 w-4" />
        <span>{labels.logout}</span>
      </button>
    );
  }*/

  if (user) { // pour WorkOS
    return (
      <button onClick={handleLogout} className="rounded-xl px-4 py-2 text-sm font-semibold hover:opacity-80 flex items-center gap-2">
        <LogOut className="h-4 w-4" />
        <span>{labels.logout}</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleLogin}
      className="rounded-xl px-4 py-2 text-sm font-semibold hover:opacity-80 flex items-center gap-2"
      aria-label={labels.login}
    >
      <LogIn className="h-4 w-4" />
      <span>{labels.login}</span>
    </button>
  );
}