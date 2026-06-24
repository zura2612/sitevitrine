// fichier src/components/Header.tsx
import { Link } from "@tanstack/react-router";
import { ThemeToggle } from "./ThemeToggle";
import { Phone, Zap, Menu, X } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { usePageTranslations } from "@/hooks/usePageTranslations";
import type { HeaderTranslations } from "@/types/translations";
import { siteConfig } from "@/config/site";
import { siteStyle } from "@/config/site";

const sectionStyle = "mb-1 border border-black container-narrow";
const boutonStyle = "rounded-xl px-4 py-2 text-sm font-semibold text-center tracking-wider transition hover:opacity-80";
const boutonStyleSelected = "rounded-xl px-4 py-2 text-sm font-semibold text-center text-accent-foreground bg-accent tracking-wider transition hover:opacity-80";

export function Header() {
  const [open, setOpen] = useState(false);
  const { lang } = useLanguage();
  const { data: t, isLoading, error } = usePageTranslations<HeaderTranslations>("header", lang);

  // ✅ Toujours <header> comme nœud racine — évite le démontage de l'arbre enfant
  if (isLoading) return (
    <header className="mb-1 sticky top-0 z-100 backdrop-blur-md">
      <section className={sectionStyle}>
        <div className="flex h-16 items-center justify-between animate-pulse" />
      </section>
    </header>
  );

  if (error || !t) return (
    <header className="mb-1 sticky top-0 z-100 backdrop-blur-md">
      <section className={sectionStyle}>
        <p className="text-center py-4 text-destructive" role="alert">
          {error instanceof Error ? error.message : "Impossible de charger les textes."}
        </p>
      </section>
    </header>
  );

  return (
    <header className="mb-1 sticky top-0 z-100 backdrop-blur-md">
      <section className={sectionStyle}>
        <div className="flex h-16 items-center justify-between">

          {/* Logo entreprise */}
          <Link to="/" className="flex items-center gap-2 font-bold">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground">
              <Zap className="h-4 w-4" />
            </span>
            <span className="text-base changer-couleur-effet">{siteConfig.entreprise}</span>
          </Link>

          {/* Items du menu navigation */}
          <nav className="hidden items-center gap-1 md:flex">
            {t.navigation.labels.map((label) => (
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
          </nav>

          {/* Téléphone, formulaire de contact, langue, jour/nuit */}
          <div className="hidden items-center gap-3 md:flex">
            <a href={`tel:${siteConfig.phoneLink}`} className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
              <Phone className="h-4 w-4" /> {siteConfig.phoneNumber}
            </a>
            <Link to={t.navigation.cta.to} className={`${siteStyle.boutonStyle}`}>
              {t.navigation.cta.bouton}
            </Link>
            <LanguageSwitcher />
            <ThemeToggle />
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

              {/* Liens de navigation mobiles */}
              {t.navigation.labels.map((label) => (
                <Link
                  key={label.to}
                  to={label.to}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted"
                  activeProps={{ className: `${siteStyle.boutonStyle}` }}
                >
                  {label.bouton}
                </Link>
              ))}

              <hr className="my-2 border-muted" />

              <div className="flex flex-col items-start justify-start gap-2 w-full px-3 py-1 text-left">
                <a href={`tel:${siteConfig.phoneLink}`} className="flex items-center gap-2 text-sm font-semibold text-primary">
                  <Phone className="h-4 w-4" /> {siteConfig.phoneNumber}
                </a>
                <Link
                  to={t.navigation.cta.to}
                  onClick={() => setOpen(false)}
                  className="border border-black inline-flex rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background transition hover:opacity-90 w-fit"
                >
                  {t.navigation.cta.bouton}
                </Link>
              </div>

              <div className="mt-3 flex items-center gap-4 px-3">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Langue</span>
                  <LanguageSwitcher />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Affichage</span>
                  <ThemeToggle />
                </div>
              </div>

            </div>
          </div>
        )}
      </section>
    </header>
  );
}