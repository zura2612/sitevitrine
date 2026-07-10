// fichier src/components/LogToggle.tsx
import { useState } from "react";
import { useAuth } from "@workos-inc/authkit-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { LogIn, LogOut, Loader2 } from "lucide-react";
import { clearLastSelectedEvent } from "@/lib/last-event";
import { BOOKING_STORAGE_KEY } from "@/lib/storage-keys"; // ✅ Import centralisé

interface LogToggleProps {
  labels: {
    login: string;
    logout: string;
    loading: string;
    logoutSuccess: string; // label du toast
  };
}

export function LogToggle({ labels }: LogToggleProps) {
  const { user, isLoading, signIn, signOut } = useAuth();

  // ✅ NOUVEAU : état local pour forcer l'UI à changer immédiatement
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogin = () => { signIn(); };// pour WorkOS

  const handleLogout = async () => {
    // ✅ NOUVEAU : feedback immédiat (optimistic UI)
    setIsLoggingOut(true);

    clearLastSelectedEvent(); // Nettoie localStorage
    
    // ✅ NOUVEAU: Nettoyer sessionStorage (réservations en cours)
    // On cible spécifiquement la clé utilisée dans rendez-vous.tsx
    try {
      sessionStorage.removeItem(BOOKING_STORAGE_KEY);
    } catch (error) {
      console.warn("Echec au nettoyage de sessionStorage:", error);
    }

    try {
      // ✅ NOUVEAU : attendre la fin de la déconnexion
      await signOut();
      
      // ✅ NOUVEAU : toast de confirmation
      toast.success(labels.logoutSuccess, { duration: 4000, });
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      toast.error("Erreur lors de la déconnexion", { duration: 4000, });
    } finally {
      // ✅ NOUVEAU : réinitialiser l'état local
      // (le state user de WorkOS prendra le relais)
      setIsLoggingOut(false);
    }
    //logout({ logoutParams: { returnTo: window.location.origin } }); pour Auth0
    //signOut(); pour WorkOS
  };

  // état de chargement WorkOS
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

  // user existe ET on n'est pas en train de se déconnecter
  if (user && !isLoggingOut) {
    return (
      <>
      <Toaster position="top-right" duration={4000} />
      <button onClick={handleLogout} className="rounded-xl px-4 py-2 text-sm font-semibold hover:opacity-80 flex items-center gap-2">
        <LogOut className="h-4 w-4" />
        <span>{labels.logout}</span>
      </button>
      </>
    );
  }

  // pas de user OU en cours de déconnexion
  return (
    <>
    <Toaster position="top-right" duration={4000} />
    <button
      onClick={handleLogin}
      className="rounded-xl px-4 py-2 text-sm font-semibold hover:opacity-80 flex items-center gap-2"
      aria-label={labels.login}
    >
      <LogIn className="h-4 w-4" />
      <span>{labels.login}</span>
    </button>
    </>
  );
}