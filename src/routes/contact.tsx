// fichier src/routes/contact.tsx
import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { useLanguage } from "@/contexts/LanguageContext";

// Imports de la logique de traduction
import { usePageTranslations } from "@/hooks/usePageTranslations";
import type { ContactTranslations } from "@/types/translations";
//import frContactTranslations from "../../src/translations/contact.fr.json";// on est dans src/routes

// import des constantes d'environnement
import { siteConfig } from "@/config/site";
import { siteStyle } from "@/config/site";

const sectionStyle = "mb-1 border border-black container-narrow";
const borderStyle = "border border-black";
const intituleZoneSaisieStyle = "text-xs font-semibold uppercase tracking-wider text-muted-foreground";
const inputBase = `w-full rounded-xl ${borderStyle} bg-background text-foreground px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary`;

const workerUrl = import.meta.env.VITE_RESEND_WORKER_URL;

export const Route = createFileRoute("/contact")({
  validateSearch: (search: Record<string, unknown>) => ({
    project: typeof search.project === 'string' ? search.project : undefined,
  }),
  head: () => ({
    meta: [
      { title: `${siteConfig.entreprise} - Contact` },
      { name: "description", content: siteConfig.headDescriptionContact },
      { name: "robots", content: "index, follow" },
      { name: "canonical", content: `${siteConfig.urlSite}/contact` },
      { property: "og:title", content: `${siteConfig.entreprise} — Contact` },
      { property: "og:description", content: siteConfig.headDescriptionBooking },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${siteConfig.urlSite}/contact` },
      { property: "og:image", content: `${siteConfig.urlSite}/public/vehicule.jpg` },
      { property: "og:site_name", content: siteConfig.entreprise },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { lang } = useLanguage();
  const { data:t, error } = usePageTranslations<ContactTranslations>("contact", lang);
  //const t = data || (frContactTranslations as unknown as ContactTranslations);
  if (error || !t)
    return <p className="text-center py-10 text-destructive" role="alert">
    {error instanceof Error ? error.message : "Impossible de charger les textes de la page contact"}</p>;

  const { project: projectFromUrl } = Route.useSearch();
  const projectFromUrlRef = useRef(projectFromUrl);
  const [isSending, setIsSending] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (t && !initialized) {
      setSelectedProject(projectFromUrlRef.current ?? t.projets.defaut);
      setInitialized(true);
    }
  }, [t, initialized]);

  const sendEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSending(true);

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    // Ajouter l'URL de la page en cours
    const enrichedData = { ...data, pageUrl: window.location.href, };
console.log("contact.tsx sendMail VITE_RESEND_WORKER_URL=",workerUrl);

    try {
      const response = await fetch(workerUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(enrichedData),
      });

      const result = await response.json() as { error?: string };

      if (response.ok) {
        toast.success(t.toast.succes);
        form.reset();
        setSelectedProject(t.projets.defaut);
      } else {
        toast.error(result.error ?? t.toast.erreur_resend);
      }
    } catch (err) {
      toast.error(t.toast.erreur_reseau);
      console.error("Erreur :", err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <main className="w-full">
      <Toaster position="top-right" duration={4000} />

      <section className={sectionStyle}>
        <div className="container-narrow flex flex-col items-center gap-10 py-5 md:grid-cols-2 md:py-10">
          <h1 className={`${siteStyle.ligne1SectionBleuStyle}`}>{t.hero.primary}</h1>
          <p className={`${siteStyle.ligne2SectionBleuStyle}`}>{t.hero.secondary}</p>
        </div>
      </section>

      <section className={sectionStyle}>
        <div className="grid">
          <form onSubmit={sendEmail} className={`w-full rounded-2xl ${borderStyle} p-2 shadow-soft md:p-4`}>
            <div className="flex justify-end mb-1">
              <p className="text-xs text-muted-foreground italic" id="required-fields-note">{t.formulaire.champ}</p>
            </div>

            <div className="grid gap-2 md:gap-4 sm:grid-cols-2 md:grid-cols-3">
              {/* champ de saisie pour le prénom nom */}
              <div>
              <label className={intituleZoneSaisieStyle}>{t.formulaire.identite}</label>
              <input name="prenomNom" type="text" required title={t.formulaire.message_tooltip} className={inputBase} />
              </div>
              {/* champ de saisie pour le téléphone */}
              <div>
              <label className={intituleZoneSaisieStyle}>{t.formulaire.telephone}</label>
              <input name="phone" type="tel" className={inputBase} />
              </div>
              {/* champ de saisie pour le courriel */}
              <div>
              <label className={intituleZoneSaisieStyle}>{t.formulaire.email}</label>
              <input name="courriel" type="email" required title={t.formulaire.message_tooltip} className={inputBase} />
              </div>
              {/* champ de saisie pour le type de demande de contact */}
              <div className="col-span-full sm:col-span-1">
                <label className={intituleZoneSaisieStyle}>{t.formulaire.projet}</label>
                <select
                  name="project"
                  className={inputBase}
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                >
                  {t.projets.labels.map((projet, index) => (
                    <option key={index} value={projet.option}>
                      {projet.option}
                    </option>
                  ))}
                </select>
              </div>
              {/* champ de saisie pour le message */}
              <div className="col-span-full">
                <label className={intituleZoneSaisieStyle}>{t.formulaire.message}</label>
                <textarea
                  name="message"
                  rows={5}
                  required
                  title={t.formulaire.message_tooltip}
                  aria-describedby="required-fields-note"
                  className={inputBase}
                  placeholder={t.formulaire.message_suggestion}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSending}
              className={`mt-4 ${siteStyle.boutonStyle} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isSending ? "Envoi en cours..." : t.formulaire.bouton}
            </button>
            <p className="mt-3 text-xs text-muted-foreground">{t.formulaire.confidentialite}</p>
          </form>
        </div>
      </section>
    </main>
  );
}

