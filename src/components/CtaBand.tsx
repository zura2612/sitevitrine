// fichier src/components/site/CtaBand.tsx
import { Link } from "@tanstack/react-router";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePageTranslations } from "@/hooks/usePageTranslations";
import type { CtaBandTranslations } from "@/types/translations";
import { siteStyle } from "@/config/site";

const sectionStyle = "mb-1 border border-black container-narrow";

export function CtaBand() {
  const { lang } = useLanguage();
  const { data: t, isLoading, error } = usePageTranslations<CtaBandTranslations>("ctaBand", lang);

  // ✅ Toujours <section> comme nœud racine
  if (isLoading) return (
    <section className={sectionStyle}>
      <div className="flex h-16 items-center animate-pulse" />
    </section>
  );

  if (error || !t) return (
    <section className={sectionStyle}>
      <p className="text-center py-4 text-destructive" role="alert">
        {error instanceof Error ? error.message : "Impossible de charger les textes."}
      </p>
    </section>
  );

  return (
    <section className={sectionStyle}>
      <div className="flex flex-col items-center gap-6 py-5 text-center md:py-10">
        <span className={`${siteStyle.titreSectionBleuStyle}`}>{t.hero.title}</span>
        <h2 className={`${siteStyle.ligne1SectionBleuStyle}`}>{t.hero.primary}</h2>
        <p className={`${siteStyle.ligne2SectionBleuStyle}`}>{t.hero.secondary}</p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link to="/contact" className={`${siteStyle.boutonStyle}`}>
            {t.hero.bouton}
          </Link>
        </div>
      </div>
    </section>
  );
}