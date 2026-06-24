// fichier src/routes/about.tsx
import { createFileRoute } from "@tanstack/react-router";
import { CtaBand } from "@/components/CtaBand";
import { CheckCircle2, Heart, ShieldCheck, Users } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

// imports de la logique de traduction
import { usePageTranslations } from "@/hooks/usePageTranslations";
import type { AboutTranslations } from "@/types/translations";

// import des constantes d'environnement
import {siteConfig} from "@/config/site";
import {siteStyle}  from "@/config/site";

const sectionStyle = "mb-1 border border-black container-narrow";

// import des fichiers .jpg et .mp4
import nomVideo_1 from "@/assets/video_1.mp4";
import imgVideo_1 from "@/assets/video_1.jpg";
import imgPortrait from "@/assets/portrait.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
	  { title: `${siteConfig.entreprise} - A propos` },
    { name: "description", content: siteConfig.headDescriptionAbout },
	  { name: "robots", content: "index, follow" },
    { name: "canonical", content: `${siteConfig.urlSite}/about` },
    { property: "og:title", content: `${siteConfig.entreprise} — A propos` },
    { property: "og:description", content: siteConfig.headDescriptionAbout },
	  { property: "og:type", content: "website" },
	  { property: "og:url", content: `${siteConfig.urlSite}/about` },
	  { property: "og:image", content: `${siteConfig.urlSite}/public/vehicule.jpg` },
	  { property: "og:site_name", content: siteConfig.entreprise },
    ],
  }),
  component: AboutPage,
});


function AboutPage() {
  const { lang } = useLanguage();
  // Chargement asynchrone typé manuellement
  const { data: t, isLoading, error } = usePageTranslations<AboutTranslations>("about", lang);

  if (isLoading) return <p className="text-center py-10 animate-pulse" aria-live="polite">Chargement du contenu de AboutPage...</p>;
  if (error || !t) return <p className="text-center py-10 text-destructive" role="alert">
  {error instanceof Error ? error.message : "Impossible de charger les textes."}</p>;
  
  // Remplace les variables dynamiques (ex: {entreprise}) dans les textes traduits
  const champHeroSecondary = t.hero.secondary.replace("{entreprise}", siteConfig.entreprise);
  const champHistoireSecondary = t.histoire.secondary.replace("{entreprise}", siteConfig.entreprise)
  .replace("{nom}", siteConfig.nom);
  //console.log("AboutPage: remplacement des variables dynamiques effectué");
  
  const aboutIconMap: Record<string, React.ElementType> = {
	CheckCircle2: CheckCircle2,
	Heart: Heart,	
	ShieldCheck: ShieldCheck,
	Users: Users
  };
  
  return (
    <main className="w-full">
	  {/* HERO */}
      <section className={sectionStyle}>
        <div className="container-narrow grid gap-10 py-10 md:py-20 md:grid-cols-2 ">
          <div>
            <h1 className={`${siteStyle.ligne1SectionBleuStyle}`}>{t.hero.primary}</h1>
            <p className={`${siteStyle.ligne2SectionBleuStyle}`}>{champHeroSecondary}</p>
          </div>

          <div className="relative rounded-2xl overflow-hidden cursor-pointer group">
          {/* Vidéo */}
            <video  controls width="250"
            preload="metadata"
            className="w-full h-auto"
            poster={imgVideo_1}
            >
            <source src={nomVideo_1} type="video/mp4" />
            Votre navigateur ne supporte pas la balise vidéo.
            </video>
           </div>
		   
        </div>
      </section>
	  
      {/* histoire */}
      <section className={sectionStyle}>
        <div className="grid gap-10 py:5 md:py-10 md:grid-cols-2">
          <div>
            <h2 className={`${siteStyle.ligne1SectionBlancStyle}`}>{t.histoire.primary}</h2>
            <p className={`${siteStyle.ligne2SectionBlancStyle}`}>{champHistoireSecondary}</p>
            <br />
	    <img src={imgPortrait} alt="portrait du dirigeant" loading="lazy" decoding="async"
	    className="flex flex-col justify-end relative aspect-square w-1/2 rounded-2xl object-cover"/>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
	    {t.histoire.cartes.map(({ iconKey, title, text }) => {
            // Récupère l'icône correspondante depuis le mapping
            const Icon = aboutIconMap[iconKey];
            return (
              <div key={title} className="rounded-2xl border border-black bg-card p-5 shadow-soft">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-accent text-accent-foreground">
              <Icon className="h-4 w-4" />
              </div>
              <h3 className="mt-4 text-base font-semibold">{title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{text}</p>
              </div>
            );
            })}
          </div>
        </div>
      </section>
	  
      {/* métriques */}
      <section className={sectionStyle}>
        <div className="container-narrow grid gap-6 text-center md:grid-cols-4">
          {t.metriques.cartes.map((metric) => (
		  // Utilise le titre comme clé unique
          <div key={metric.title} className="rounded-2xl border border-black bg-card p-6 shadow-soft">
          <p className="text-3xl font-bold text-primary">{metric.valeur}</p>
          <p className="mt-1 text-sm text-muted-foreground">{metric.title}</p>
          </div>
          ))}
        </div>
      </section>

      <CtaBand />
    </main>
  );
}
