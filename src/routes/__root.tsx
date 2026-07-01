// fichier src/routes/__root.tsx
import { HeadContent, Scripts, createRootRoute, useRouter } from '@tanstack/react-router';
import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { Footer } from '../components/Footer';
import { Header } from  '../components/Header';
//import { Auth0Wrapper } from '../components/Auth0Wrapper';// Hook Auth0
//import { useAuth0 } from '@auth0/auth0-react';
import { WorkOSWrapper } from '../components/WorkOSWrapper';
import { useAuth } from '@workos-inc/authkit-react';// Hook WorkOS
import { LanguageProvider, useLanguage } from '../contexts/LanguageContext';
import { preloadAllTranslations } from "../hooks/usePageTranslations";
import appCss from '../styles.css?url';
import { siteConfig } from "../config/site";
import { usePageTranslations } from "../hooks/usePageTranslations";
import type { NotFoundTranslations } from "../types/translations";

function NotFoundComponent() {
  const { lang } = useLanguage();
   // Chargement asynchrone typé manuellement
   // const { data: t, isLoading, error } = usePageTranslations<NotFoundTranslations>("__root", lang);
  const { data: t, isLoading, error } = usePageTranslations("__root", lang);
  
  if (isLoading) return <p>Chargement du contenu de NotFoundComponent...</p>;
  if (error || !t) return <p>{error instanceof Error ? error.message : "Impossible de charger les textes."}</p>;

/*  if (isLoading) return <p className="text-center py-10 animate-pulse" aria-live="polite">Chargement du contenu de NotFoundComponent...</p>;
    if (error || !t) return <p className="text-center py-10 text-destructive" role="alert">
    {error instanceof Error ? error.message : "Impossible de charger les textes."}</p>;*/

  return (
    <div className="container-narrow py-20 text-center">
      <h1 className="text-4xl font-bold mb-4">{t.primary}</h1>
      <p className="mb-6">{t.secondary}</p>
      <button onClick={() => window.history.back()} className="px-4 py-2 bg-primary text-white rounded">
        {t.button}
      </button>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { title: `${siteConfig.entreprise} - Erreur 404` },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: "description", content: siteConfig.headDescriptionRoot },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', href: 'favicon.ico' },
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: NotFoundComponent,
});

// ✅ Composant interne qui utilise useAuth en toute sécurité
function AuthContextUpdater({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, isLoading } = useAuth(); // ✅ Ici, on est sûr d'être dans le Provider

  useEffect(() => {
    if (router && router.context) {
      router.context.auth = {
        isAuthenticated: !!user,
        isLoading,
        user: user || undefined
      };
    }
  }, [user, isLoading, router]);

  return <>{children}</>;
}

function RootDocument({ children }: { children: ReactNode }) {
  useEffect(() => { 
    preloadAllTranslations(); 
  }, []);
  
  // ✅ Récupération de l'instance du router et de l'état Auth0
  /*const router = useRouter();*/
  //const { isAuthenticated, isLoading } = useAuth0();// utilisation du hook Auth0
  /*const { user, isLoading, error } = useAuth();// utilisation du hook WorkOS*/

  // ✅ Mise à jour du contexte du router à chaque changement d'état Auth0
  /*useEffect(() => {
    // Vérification de sécurité pour éviter l'erreur "Cannot set properties of undefined"
    if (router && router.context) {
      router.context.auth = {
        isAuthenticated,
        isLoading
      };
    }
  }, [isAuthenticated, isLoading, router]);*/

  return (
    <html lang="fr">
      <head>
        <HeadContent />
      </head>
      <body>
        {/* ✅ Auth0Wrapper enveloppe tout le contenu pour que useAuth0() fonctionne */}
        {/* ✅ WorkOSWrapper enveloppe tout le contenu pour que useAuth() fonctionne */}
        {/*<Auth0Wrapper>*/}
        <WorkOSWrapper>
        <AuthContextUpdater>
          <LanguageProvider>
            <Header />
            {children}
            <Footer />
          </LanguageProvider>
        </AuthContextUpdater>
        </WorkOSWrapper>
        {/*</Auth0Wrapper>*/}
        <Scripts />
      </body>
    </html>
  );
}