// fichier src/components/LockedLink.tsx
import { Lock } from "lucide-react";

interface LockedLinkProps {
  label: string;
  ariaLabelLocked?: string;
  onClick: () => void;
  className?: string;
}

/**
 * Bouton de navigation verrouillé.
 * Affiche une icône cadenas à droite du texte et une opacité réduite.
 * Au clic, déclenche l'ouverture du modal d'authentification.
 */
export function LockedLink({
  label,
  ariaLabelLocked,
  onClick,
  className = ""
}: LockedLinkProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabelLocked ?? `${label}, connexion requise`}
      className={`
        flex items-center gap-2
        rounded-xl px-4 py-2
        text-sm font-semibold text-center tracking-wider
        opacity-50
        transition hover:opacity-70
        ${className}
      `}
    >
      <span>{label}</span>
      <Lock className="h-3.5 w-3.5" aria-hidden="true" />
    </button>
  );
}