// fichier src/components/Footer.tsx
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePageTranslations } from "@/hooks/usePageTranslations";
import type { FooterTranslations } from "@/types/translations";
import { siteConfig } from "@/config/site";
//import frFooterTranslations from "../../src/translations/footer.fr.json";// on est dans src/components

const sectionStyle = "mb-1 border border-black container-narrow";
const currentYear = new Date().getFullYear();

export function Footer() {
  const { lang } = useLanguage();
  const { data:t, error } = usePageTranslations<FooterTranslations>("footer", lang);
  //const t = data || (frFooterTranslations as unknown as FooterTranslations);

  /*if (isLoading) return (
    <footer className="">
      <section className={sectionStyle}>
        <div className="flex h-16 items-center animate-pulse" />
      </section>
    </footer>
  );*/

  if (error || !t) return (
    <footer className="">
      <section className={sectionStyle}>
        <p className="text-center py-4 text-destructive" role="alert">
          {error instanceof Error ? error.message : "Impossible de charger les textes de footer"}
        </p>
      </section>
    </footer>
  );

  const iconClass = "grid h-9 w-9 place-items-center rounded-full bg-background/10 hover:bg-accent hover:text-accent-foreground transition-colors";

  return (
    <footer className="">
      <section className={sectionStyle}>
        <div className="grid py-2 md:grid-cols-4 items-start">

          {/* Zone Entreprise */}
          <div className="md:col-span-2 flex flex-col">
            <div className="flex items-center gap-2 font-bold">
              {/*<span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground">
                <Zap className="h-4 w-4" /></span>*/}
              <img src="/favicon.ico" alt={`Logo ${siteConfig.entreprise}`} width={32} height={32}
                className="h-7 w-7 rounded-full object-cover"/>
              {siteConfig.entreprise}
              <span className="text-sm font-normal">siret {siteConfig.siret}</span>
            </div>
            {/*<p className="pl-2 max-w-sm text-sm">{t.primary}</p> décalage à droite de 2 px*/}
            <p className="mt-2 max-w-sm text-sm">{t.primary}</p>
            <div className="flex gap-2 mt-2">
              <a href={siteConfig.facebookLink} aria-label="Facebook" target="_blank" rel="noopener noreferrer" className={iconClass}>
                <Facebook className="h-4 w-4" />
              </a>
              <a href={siteConfig.instagramLink} aria-label="Instagram" target="_blank" rel="noopener noreferrer" className={iconClass}>
                <Instagram className="h-4 w-4" />
              </a>
              <a href={siteConfig.linkedinLink} aria-label="Linkedin" target="_blank" rel="noopener noreferrer" className={iconClass}>
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Zone Contact */}
          <div className="md:col-span-2 md:justify-self-end flex flex-col gap-2 pr-2">
            <h4 className="text-sm font-semibold uppercase tracking-wider">{t.contact}</h4>
            <ul className="flex flex-col gap-3 text-sm">
              <li className="flex gap-2 items-center">
                <Mail aria-hidden="true" className="h-4 w-4 shrink-0" />
                <a href={`mailto:${siteConfig.email}`} className="hover:underline">{siteConfig.email}</a>
              </li>
              <li className="flex gap-2 items-center">
                <Phone aria-hidden="true" className="h-4 w-4 shrink-0" />
                <a href={`tel:${siteConfig.phoneLink}`} className="hover:underline">{siteConfig.phoneNumber}</a>
              </li>
              <li className="flex gap-2 items-center">
                <MapPin aria-hidden="true" className="h-4 w-4 shrink-0" />
                <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(siteConfig.adresse)}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {siteConfig.adresse}</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-black mt-2"></div>

        {/* Zone references legales */}
        <div className="mt-2 flex flex-col items-center justify-between gap-3 py-2 text-xs md:flex-row">
          <div className="pl-2">© {currentYear} {siteConfig.entreprise} — {t.ref.droits}</div>
          <div className="flex items-center gap-4 pr-2">
            <a href={t.ref.mentionsUrl} className="hover:underline" target="_blank" rel="noopener noreferrer">
              {t.ref.mentions}
            </a>
            <a href={t.ref.confidentialiteUrl} className="hover:underline" target="_blank" rel="noopener noreferrer">
              {t.ref.confidentialite}
            </a>
          </div>
        </div>
      </section>
    </footer>
  );
}
