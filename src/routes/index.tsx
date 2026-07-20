// fichier src/routes/index.tsx
import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Award, Clock, Lightbulb, PlugZap, ShieldCheck, Star } from "lucide-react";
import { CtaBand } from "@/components/CtaBand";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useLanguage } from "@/contexts/LanguageContext";

// Imports de la logique de traduction
import { usePageTranslations } from "@/hooks/usePageTranslations";
import type { HomeTranslations } from "@/types/translations";
import frHomeTranslations from "../../public/translations/home.fr.json";// on est dans src/routes

// import des images
import imgVehicule from "@/assets/vehicule.jpg";
import imgRealisation_1 from "@/assets/realisation_1.jpg";
import imgRealisation_2 from "@/assets/realisation_2.jpg";
import imgRealisation_3 from "@/assets/realisation_3.jpg";

// import des constantes d'environnement
import {siteConfig} from "@/config/site";
import {siteStyle}  from "@/config/site";

const sectionStyle = "mb-1 border border-black container-narrow";
const texteSectionStyle = "text-center";

//export const Route = createFileRoute("/")({
export const Route = createFileRoute('/') ({
  head: () => ({
    meta: [
      { title: `${siteConfig.entreprise} - Accueil` },
      { name: "description", content: siteConfig.headDescriptionHome },
      { name: "robots", content: "index, follow" },
      { name: "canonical", content: `${siteConfig.urlSite}` },
      { property: "og:title", content: `${siteConfig.entreprise} — Accueil` },
      { property: "og:description", content: siteConfig.headDescriptionBooking },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${siteConfig.urlSite}` },
      { property: "og:image", content: `${siteConfig.urlSite}/public/vehicule.jpg` },
      { property: "og:site_name", content: siteConfig.entreprise },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { lang } = useLanguage();
  const { data:t, error } = usePageTranslations<HomeTranslations>("home", lang);
  //const t = data || (frHomeTranslations as unknown as HomeTranslations);
  if (error || !t)
    return <p className="text-center py-10 text-destructive" role="alert">
    {error instanceof Error ? error.message : "Impossible de charger les textes de la page home"}</p>;
  
  // assurer la cohérence entre les icones des home.xx.json, les icones importées et homeIconMap
  const homeIconMap: Record<string, React.ElementType> = {
    Award: Award,
    Clock: Clock,
    Lightbulb: Lightbulb,
    PlugZap: PlugZap,
    ShieldCheck: ShieldCheck
  };
	
  // Mapping des clés du JSON vers les images importées
  const realisationsImages: Record<string, string> = {
    "realisation_1.jpg": imgRealisation_1,
    "realisation_2.jpg": imgRealisation_2,
    "realisation_3.jpg": imgRealisation_3
  };

  return (
    <main className="w-full">
      {/* HERO */}
      <section className={sectionStyle}>
        <div className="grid text-center gap-10 py-2 md:grid-cols-2 md:py-4">
          <div>
            <h1 className="text-2xl font-bold text-destructive">
              Attention site de démonstration uniquement!
            </h1>
            <h1 className={`${siteStyle.ligne1SectionBleuStyle}`}>
				{t.hero.primaryBefore}<span className="text-accent">{t.hero.primaryAccent}</span>{t.hero.primaryAfter}
            </h1>
            <div className={`pl-2 ${siteStyle.ligne2SectionBleuStyle}`}>
              {t.hero.secondary.replace("{entreprise}", siteConfig.entreprise)}
            </div>
          </div>

          <div className="relative">
		    <div className="absolute -inset-4 rounded-[28px] bg-accent/20 blur-2xl"/>
            <img src={`${imgVehicule}`}  alt="véhicule de l'entreprise" loading="lazy" decoding="async"
			      className="relative aspect-square w-full rounded-2xl object-cover"/>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className={sectionStyle}>
        <div className="container-narrow grid grid-cols-2 gap-6 py-8 text-center md:grid-cols-4">
           {t.trustbar.items.map(({ iconKey, label }) => {
           const Icon = homeIconMap[iconKey];
           return (
	     <div key={label} className="flex items-center justify-center gap-2 text-sm font-medium text-foreground/80">
               <Icon className="h-4 w-4 text-primary" /> {label}
             </div> );
		  })}
        </div>
      </section>

      {/* POURQUOI */}
      <section className={sectionStyle}>
        <div className={`${texteSectionStyle}`}>
          <p className={`${siteStyle.titreSectionBlancStyle}`}>{t.pourquoi.title}</p>
          <h2 className={`${siteStyle.ligne1SectionBlancStyle}`}>
            {t.pourquoi.primary}
          </h2>
          <p className={`pl-2 ${siteStyle.ligne2SectionBlancStyle}`}>{t.pourquoi.secondary}</p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
		  {t.pourquoi.cartes.map(({ iconKey, title, text }) => {
           const Icon = homeIconMap[iconKey];
           return (
		    <div key={title} className="rounded-2xl border border-black bg-card p-6 shadow-soft transition hover:-translate-y-0.5 hover:border-primary/30">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className={`${siteStyle.titreVignetteStyle}`}>{title}</h3>
              <p className={`${siteStyle.ligne1VignetteStyle}`}>{text}</p>
            </div> );
		  })}
        </div>
      </section>
      
      {/* PROCESSUS */}
      <section className={sectionStyle}>
        <div className={`${texteSectionStyle}`}>
          <p className={`${siteStyle.titreSectionBlancStyle}`}>{t.processus.title}</p>
          <h2 className={`${siteStyle.ligne1SectionBlancStyle}`}>{t.processus.primary}</h2>
        </div>

        <div className="relative mt-12 flex flex-col gap-8 md:flex-row md:items-stretch">
		  {t.processus.cartes.map((step,i) => (
            <div key={step.num} className="relative flex-1">
              <div className="rounded-2xl border border-black bg-card p-6 shadow-soft">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                    {step.num}
                  </span>
                  <h3 className={`${siteStyle.titreVignetteStyle}`}>{step.title}</h3>
                </div>
                <p className={`${siteStyle.ligne1VignetteStyle}`}>{step.text}</p>
              </div>
              {i < t.processus.cartes.length -1 && (
                <ArrowRight className="absolute -right-7 top-1/2 hidden h-6 w-6 -translate-y-1/2 text-black md:block" />
              )}
            </div>
		  ))}
        </div>
      </section>
     
      {/* REALISATIONS */}
	  <section className={sectionStyle}>
	    <div className={`${texteSectionStyle}`}>
            <p className={`${siteStyle.titreSectionBlancStyle}`}>{t.realisations.title}</p>
            <h2 className={`${siteStyle.ligne1SectionBlancStyle}`}>{t.realisations.primary}</h2>
        </div>
        
		<div className="relative mt-12 grid gap-8 md:grid-cols-3">
         {t.realisations.cartes.map((p) => {
           // Récupère l'image correspondante depuis le mapping
           const imgSrc = realisationsImages[p.srcKey];
		   // Vérifie que l'image existe (fallback si nécessaire)
           if (!imgSrc) {
            console.warn(`Image non trouvée pour la clé : ${p.srcKey}`);
            return null;
           }
           return (
		    <figure key={p.title} className={`group relative overflow-hidden rounded-2xl border border-black`} >
              <img src={imgSrc} alt={p.title} className="aspect-square w-full object-cover transition duration-500 group-hover:scale-105" />
              <figcaption className="absolute inset-x-3 bottom-3 rounded-xl bg-background/95 px-3 py-2 text-xs">
                <p className="font-semibold">{p.title}</p>
                <p className="text-muted-foreground">{p.location}</p>
              </figcaption>
            </figure> );
		  })}
        </div>
      </section>

      {/* TEMOIGNAGES */}
      <section className={sectionStyle}>
		  <div className={`${texteSectionStyle}`}>
            <p className={`${siteStyle.titreSectionBlancStyle}`}>{t.temoignages.title}</p>
            <h2 className={`${siteStyle.ligne1SectionBlancStyle}`}>{t.temoignages.primary}</h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {t.temoignages.cartes.map((item) => (
              <article key={item.name} className="flex flex-col rounded-2xl border border-black bg-card p-6 shadow-soft">
                {/* Étoiles (5 étoiles pleines) */}
				<div className="flex items-center gap-1 text-accent">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
				{/* Texte du témoignage */}
                <p className={`${siteStyle.ligne1VignetteStyle}`}>"{item.text}”</p>
		        <div className="mt-auto flex items-end gap-3">
                  <div>
                    <p className={`${siteStyle.ligne1VignetteStyle} font-semibold`}>{item.name}</p>
                    <p className={`${siteStyle.ligne1VignetteStyle}`}>{item.date}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
      </section>

      {/* FAQ */}
      <section className={sectionStyle}>
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr]">
          <div>
            <p className={`pl-2 ${siteStyle.titreSectionBlancStyle}`}>{t.faq.title}</p>
            <h2 className={`pl-2 ${siteStyle.ligne1SectionBlancStyle}`}>{t.faq.primary}</h2>
			      <p className={`pl-2 ${siteStyle.ligne2SectionBlancStyle}`}>{t.faq.secondary}</p>
		      </div>

          <Accordion type="single" collapsible className="w-full">
            {t.faq.questions.map((faqItem, index) => (
              <AccordionItem key={faqItem.question} value={`item-${index}`} className="border-border">
                <AccordionTrigger className="text-left text-base font-semibold hover:no-underline">{faqItem.question}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">{faqItem.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <CtaBand />
    </main>
  );
}
