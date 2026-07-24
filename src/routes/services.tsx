// fichier src/routes/services.tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import { CtaBand } from "@/components/CtaBand";
import { Baby, Brush, CheckCircle2, Droplet, Heart, Scissors } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

// Imports de la logique de traduction
import { usePageTranslations } from "@/hooks/usePageTranslations";
import type { ServicesTranslations } from "@/types/translations";
//import frServicesTranslations from "../../src/translations/services.fr.json";// on est dans src/routes

// import des constantes d'environnement
import {siteConfig} from "@/config/site";
import {siteStyle}  from "@/config/site";

const sectionStyle = "mb-1 border border-black container-narrow";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
	  { title: `${siteConfig.entreprise} - Services` },
    { name: "description", content: siteConfig.headDescriptionServices },
	  { name: "robots", content: "index, follow" },
    { name: "canonical", content: `${siteConfig.urlSite}/services` },
    { property: "og:title", content: `${siteConfig.entreprise} — Services` },
    { property: "og:description", content: siteConfig.headDescriptionServices },
    { property: "og:type", content: "website" },
    { property: "og:url", content: `${siteConfig.urlSite}/services` },
	  { property: "og:image", content: `${siteConfig.urlSite}/public/vehicule.jpg` },
	  { property: "og:site_name", content: siteConfig.entreprise },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  const { lang } = useLanguage();
  const { data:t, error } = usePageTranslations<ServicesTranslations>("services", lang);
  //const t = data || (frServicesTranslations as unknown as ServicesTranslations);
  if (error || !t)
    return <p className="text-center py-10 text-destructive" role="alert">
    {error instanceof Error ? error.message : "Impossible de charger les textes de la page services"}</p>;
  
  // Mapping des clés du JSON vers les icônes Lucide
  const servicesIconMap: Record<string, React.ElementType> = {
    Brush: Brush,
    Baby: Baby,
    Droplet: Droplet,
    CheckCircle2: CheckCircle2,
    Heart: Heart,
    Scissors: Scissors,
    };
  
  return (
    <main className="w-full">
  	  {/* HERO */}
      <section className={sectionStyle}>
        <div className="py-2 text-center md:py-4">
          <h1 className={`${siteStyle.ligne1SectionBleuStyle}`}>{t.hero.primary}</h1>
          <p className={`${siteStyle.ligne2SectionBleuStyle}`}>{t.hero.secondary}</p>
        </div>
      </section>
	  
	  {/* SERVICES */}
      <section className={sectionStyle}>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {t.services.cartes.map(({ iconKey, title, text, bouton }) => {
      // Récupère l'icône correspondante depuis le mapping
          const Icon = servicesIconMap[iconKey];
          return (
            <article key={title} className="flex flex-col gap-5 rounded-xl border border-black bg-card p-6 shadow-soft transition hover:-translate-y-0.5 hover:border-primary/40">
              <div className="">
			    <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground">
                <Icon className="h-5 w-5" />
                </div>
                <h2 className={`${siteStyle.titreVignetteStyle}`}>{title}</h2>
                <p className={`${siteStyle.ligne1VignetteStyle}`}>{text}</p>
		      </div>
             {/*<Link to="/contact" className={`mt-auto ${siteStyle.boutonStyle}`}>{bouton}</Link>*/}
	           <Link to="/contact" search={{ project: title }} // Passe title comme valeur du projet
             className="mt-auto rounded-xl py-2 px-4 text-sm font-semibold text-center text-accent-foreground bg-accent tracking-wider transition hover:opacity-80">
             {bouton}
             </Link>
            </article>
          );
        })}
        </div>
      </section>
     
      <CtaBand />
    </main>
  );
}
