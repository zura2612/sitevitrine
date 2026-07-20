// fichier src/components/Header.tsx
import { Link } from "@tanstack/react-router";
//import { useAuth0 } from "@auth0/auth0-react";
import { useAuth } from "@workos-inc/authkit-react"; 
import { ThemeToggle } from "./ThemeToggle";
import { LogToggle } from "./LogToggle";
import { LockedLink } from "./LockedLink";
import { AuthModal } from "./AuthModal";
import { Phone, Menu, X } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { usePageTranslations } from "@/hooks/usePageTranslations";
import type { HeaderTranslations } from "@/types/translations";
import { siteConfig } from "@/config/site";
import { siteStyle } from "@/config/site";
import frHeaderTranslations from "../../public/translations/header.fr.json";// on est dans src/components

const sectionStyle = "mb-1 border border-black container-narrow";
const boutonStyle = "rounded-xl px-4 py-2 text-sm font-semibold text-center tracking-wider transition hover:opacity-80";
const boutonStyleSelected = "rounded-xl px-4 py-2 text-sm font-semibold text-center text-accent-foreground bg-accent tracking-wider transition hover:opacity-80";

export function Header() {
  const [open, setOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMessage, setAuthModalMessage] = useState("");

  const { lang } = useLanguage();
  const { data:t, error } = usePageTranslations<HeaderTranslations>("header", lang);
  
  const { user, isLoading: isAuthLoading } = useAuth();
  const isAuthenticated = !!user;
  //const t = data || (frHeaderTranslations as unknown as HeaderTranslations);

  // Handlers pour le modal
  const openAuthModal = (message: string) => {
    setAuthModalMessage(message);
    setAuthModalOpen(true);
  };
  const closeAuthModal = () => { setAuthModalOpen(false); };

  // ✅ Toujours <header> comme nœud racine — évite le démontage de l'arbre enfant
  /*if (isLoading) return (
    <header className="mb-1 sticky top-0 z-100 backdrop-blur-md">
      <section className={sectionStyle}>
        <div className="flex h-16 items-center justify-between animate-pulse" />
      </section>
    </header>
  );*/

  if (error || !t) return (
    <header className="mb-1 sticky top-0 z-100 backdrop-blur-md">
      <section className={sectionStyle}>
        <p className="text-center py-4 text-destructive" role="alert">
          {error instanceof Error ? error.message : "Impossible de charger les textes de header"}
        </p>
      </section>
    </header>
  );

  // ✅ Fonction de rendu d'un label : bouton normal ou verrouillé
  const renderLabel = (
    label: HeaderTranslations["navigation"]["labels"][number],
    variant: "desktop" | "mobile"
  ) => {
    const isProtected = label.requiresAuth === true;
    const isLocked = isProtected && !isAuthLoading && !isAuthenticated;

    // Bouton verrouillé (utilisateur non connecté)
    if (isLocked) {
      const desktopClass = boutonStyle;
      const mobileClass = "rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted w-full text-left";

      return (
        <LockedLink
          key={label.to}
          label={label.bouton}
          ariaLabelLocked={label.ariaLabelLocked}
          onClick={() => {
            if (variant === "mobile") setOpen(false);
            openAuthModal(label.lockedMessage ?? "Connexion requise.");
          }}
          className={variant === "desktop" ? desktopClass : mobileClass}
        />
      );
    }

    // Bouton normal (utilisateur connecté ou lien non protégé)
    if (variant === "desktop") {
      return (
        <Link
          key={label.to}
          to={label.to}
          className={boutonStyle}
          activeOptions={{ exact: true }}
          activeProps={{ className: boutonStyleSelected }}
        >
          {label.bouton}
        </Link>
      );
    }

    return (
      <Link
        key={label.to}
        to={label.to}
        onClick={() => setOpen(false)}
        className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted"
        activeProps={{ className: `${siteStyle.boutonStyle}` }}
      >
        {label.bouton}
      </Link>
    );
  };

  // ✅ Filtre les labels : masque ceux qui nécessitent une authentification
  // si l'utilisateur n'est pas connecté (ou si Auth0 est encore en train de charger)
  /*const visibleLabels = t.navigation.labels.filter((label) => {
    if (!label.requiresAuth) return true;           // Pas de restriction → toujours visible
    if (isAuthLoading) return false;                // Auth0 en cours → masquer pour éviter le flash
    return isAuthenticated;                         // Sinon → visible seulement si connecté
  });*/

  return (
    <header className="mb-1 sticky top-0 z-100 backdrop-blur-md">
      <section className={sectionStyle}>
        <div className="flex h-16 items-center justify-between">
          {/* Logo entreprise */}
          <Link to="/" className="flex items-center gap-2 font-bold">
            {/*<span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground">
              <Zap className="h-4 w-4" /></span>*/}
            <img src="/favicon.ico" alt={`Logo ${siteConfig.entreprise}`} width={32} height={32}
              className="h-7 w-7 rounded-full object-cover"/>
            <span className="ml-2 text-base changer-couleur-effet">{siteConfig.entreprise}</span>
          </Link>

          {/* Items visibles du menu navigation selon l'état de l'authentification */}
          {/*<nav className="hidden items-center gap-1 md:flex">
            {visibleLabels.map((label) => (
              <Link
                key={label.to}
                to={label.to}
                className={boutonStyle}
                activeOptions={{ exact: true }}
                activeProps={{ className: boutonStyleSelected }}
              >
                {label.bouton}
              </Link>
            ))}
          </nav>*/}
          {/* Items du menu navigation (desktop) */}
          <nav className="hidden items-center gap-1 md:flex">
            {t.navigation.labels.map((label) => renderLabel(label, "desktop"))}
          </nav>

          {/* ex Téléphone, ex CTA, langue, jour/nuit */}
          <div className="hidden items-center gap-3 md:flex">
            {/*<a href={`tel:${siteConfig.phoneLink}`} className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
              <Phone className="h-4 w-4" /> {siteConfig.phoneNumber}
            </a>*/}
            {/*<Link to={t.navigation.cta.to} className={`${siteStyle.boutonStyle}`}>
              {t.navigation.cta.bouton}
            </Link>*/}

            <LanguageSwitcher />

            {/* ✅ Passage des traductions aux composants */}
            <ThemeToggle
              labels={{
                light: t.tooltips.themeLight,
                dark: t.tooltips.themeDark
              }}
            />
            <LogToggle
              labels={{
                login: t.tooltips.login,
                logout: t.tooltips.logout,
                logoutSuccess: t.tooltips.logoutSuccess,
                loading: t.tooltips.loading,
                connected: t.tooltips.connected
              }}
            />
          </div>

          <button
            aria-label="Menu"
            className="md:hidden rounded-full p-2 hover:bg-muted"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Menu hamburger pour mobile */}
        {open && (
          <div className="border-t border-border bg-background md:hidden">
            <div className="container-narrow flex flex-col gap-1 py-3">
              {/* Liens de navigation mobiles visibles */}
              {/* {visibleLabels.map((label) => (
                <Link
                  key={label.to}
                  to={label.to}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted"
                  activeProps={{ className: `${siteStyle.boutonStyle}` }}
                >
                  {label.bouton}
                </Link>
              ))} */}
              {/* Liens de navigation mobiles */}
              {t.navigation.labels.map((label) => renderLabel(label, "mobile"))}

              <hr className="my-2 border-muted" />

              {/*<div className="flex flex-col items-start justify-start gap-2 w-full px-3 py-1 text-left">
                <a href={`tel:${siteConfig.phoneLink}`} className="flex items-center gap-2 text-sm font-semibold text-primary">
                  <Phone className="h-4 w-4" /> {siteConfig.phoneNumber}
                </a>
                <Link to={t.navigation.cta.to}
                  onClick={() => setOpen(false)}
                  className="border border-black inline-flex rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background transition hover:opacity-90 w-fit"
                >{t.navigation.cta.bouton}</Link>
              </div>*/}

              <div className="mt-3 flex items-center gap-4 px-3">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    {t.mobileSections.language}
                  </span>
                  <LanguageSwitcher />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    {t.mobileSections.display}
                  </span>
                  <ThemeToggle
                    labels={{
                      light: t.tooltips.themeLight,
                      dark: t.tooltips.themeDark
                    }}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    {t.mobileSections.account}
                  </span>
                  <LogToggle
                    labels={{
                      login: t.tooltips.login,
                      logout: t.tooltips.logout,
                      loading: t.tooltips.loading
                    }}
                  />
                </div>
              </div>

            </div>
          </div>
        )}
      </section>

      {/* ✅ Modal d'authentification (en dehors du header pour le z-index) */}
      <AuthModal isOpen={authModalOpen} onClose={closeAuthModal}  message={authModalMessage} />
    </header>
  );
}