// fichier src/components/AuthModal.tsx
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

/**
 * Modal d'authentification accessible.
 * - Focus trap : Tab/Shift+Tab restent dans le modal
 * - Fermeture via la croix uniquement
 * - Utilise un portail React pour éviter les problèmes de z-index
 * - Empêche le scroll du body quand ouvert
 */
export function AuthModal({ isOpen, onClose, message }: AuthModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  // Mémoriser l'élément déclencheur pour restaurer le focus à la fermeture
  useEffect(() => {
    if (isOpen) {
      triggerRef.current = document.activeElement as HTMLElement;
      // Focus sur le bouton de fermeture à l'ouverture
      setTimeout(() => closeButtonRef.current?.focus(), 0);
    } else if (triggerRef.current) {
      // Restaurer le focus à la fermeture
      triggerRef.current.focus();
      triggerRef.current = null;
    }
  }, [isOpen]);

  // Empêcher le scroll du body quand le modal est ouvert
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Focus trap : garder le focus dans le modal
  useEffect(() => {
    if (!isOpen) return;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !modalRef.current) return;

      const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        // Shift+Tab : si on est sur le premier élément, boucler vers le dernier
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab : si on est sur le dernier élément, boucler vers le premier
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener("keydown", handleTabKey);
    return () => document.removeEventListener("keydown", handleTabKey);
  }, [isOpen]);

  if (!isOpen || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      role="presentation"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        className="relative z-10 w-full max-w-sm mx-4 rounded-2xl border border-black bg-card p-6 shadow-soft"
      >
        {/* Bouton de fermeture */}
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label="Fermer"
          className="absolute top-3 right-3 rounded-full p-2 hover:bg-muted transition"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Contenu */}
        <div className="">
          {/*<h2 id="auth-modal-title" className="text-lg font-semibold mb-2">
            Accès restreint
          </h2>*/}
          <p className="text-sm text-muted-foreground">
            {message}
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
}