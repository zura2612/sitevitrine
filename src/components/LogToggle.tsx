// fichier src/components/LogToggle.tsx
import { useAuth0 } from '@auth0/auth0-react';
import { User, UserCheck } from 'lucide-react';

interface LogToggleProps {
  labels?: {
    login: string;
    logout: string;
    loading: string;
  };
}

export function LogToggle({ labels }: LogToggleProps) {
  const { loginWithRedirect, logout, isAuthenticated, isLoading } = useAuth0();

  // Fallback sur les labels français si les props ne sont pas fournies
  const defaultLabels = {
    login: 'Se connecter',
    logout: 'Se déconnecter',
    loading: 'Chargement...'
  };
  
  const t = labels ?? defaultLabels;

  if (isLoading) {
    return (
      <button
        type="button"
        aria-label={t.loading}
        title={t.loading}
        className="relative grid h-9 w-9 place-items-center rounded-full hover:bg-accent transition pointer-events-auto isolate"
      >
        <User className="h-4 w-4 text-muted-foreground pointer-events-none" />
      </button>
    );
  }

  const label = isAuthenticated ? t.logout : t.login;

  return (
    <button
      type="button"
      onClick={() =>
        isAuthenticated
          ? logout({ logoutParams: { returnTo: window.location.origin } })
          : loginWithRedirect()
      }
      aria-label={label}
      title={label}
      className={`relative grid h-9 w-9 place-items-center rounded-full transition pointer-events-auto isolate ${
        isAuthenticated
          ? 'bg-green-500/10 hover:bg-green-500/20'
          : 'hover:bg-accent'
      }`}
    >
      {isAuthenticated ? (
        <UserCheck className="h-4 w-4 text-green-500 pointer-events-none" />
      ) : (
        <User className="h-4 w-4 text-slate-700 pointer-events-none" />
      )}
    </button>
  );
}