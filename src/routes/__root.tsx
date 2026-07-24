// fichier src/routes/__root.tsx
import { HeadContent, Scripts, createRootRoute, useRouter, Outlet } from '@tanstack/react-router';
import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { Footer } from '../components/Footer';
import { Header } from  '../components/Header';
import { MaintenanceGate } from '../components/MaintenanceGate';
import { WorkOSWrapper } from '../components/WorkOSWrapper';
import { useAuth } from '@workos-inc/authkit-react';
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';
import { preloadAllTranslations, usePageTranslations } from "@/hooks/usePageTranslations";
import appCss from '../styles.css?url';
import type { NotFoundTranslations } from "../types/translations";
import { siteConfig } from "../config/site";

// ==============================================================================
// 1. LOGIQUE GLOBALE INVISIBLE
// ==============================================================================
function AppLogicSync() {
  const { lang } = useLanguage();
  const hasPreloaded = useRef(false);// Verrou anti-double appel en StrictMode

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    if (!hasPreloaded.current) {
      hasPreloaded.current = true;
      preloadAllTranslations();
    }
  }, []);

/*  useEffect(() => {
    if (typeof window !== "undefined") {
      preloadAllTranslations();
    }
  }, []);*/

  return null;
}

function AuthContextUpdater({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, isLoading } = useAuth();

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

// ==============================================================================
// 2. LAYOUT ET DOCUMENT DE BASE
// ==============================================================================

// Enveloppe HTML pure
function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

// Enveloppe d'Application (Providers, Header, Footer)
function AppLayout({ children }: { children: ReactNode }) {
  return (
    <WorkOSWrapper>
      <MaintenanceGate>
        <AuthContextUpdater>
          <LanguageProvider>
            <AppLogicSync />
            <Header />
            {children}
            <Footer />
          </LanguageProvider>
        </AuthContextUpdater>
      </MaintenanceGate>
    </WorkOSWrapper>
  );
}

// ==============================================================================
// 3. COMPOSANTS DE ROUTE (Normaux et 404)
// ==============================================================================

// Le point d'entrée principal des pages
function RootComponent() {
  return (
    <RootDocument>
      <AppLayout>
        {/* L'Outlet rendra HomePage, Contact, etc. */}
        <Outlet /> 
      </AppLayout>
    </RootDocument>
  );
}

// Contenu spécifique pour la page 404 (doit être DANS le contexte)
function NotFoundContent() {
  const { lang } = useLanguage(); // 🟢 Désormais sécurisé car appelé à l'intérieur de AppLayout !
  const { data, error } = usePageTranslations<NotFoundTranslations>("__root", lang);
    
  if (error || !data) return (
    <p className="text-center py-10 text-destructive" role="alert">
      {error instanceof Error ? error.message : "Impossible de charger les textes."}
    </p>
  );

  return (
    <div className="container-narrow py-20 text-center">
      <h1 className="text-4xl font-bold mb-4">{data.primary}</h1>
      <p className="mb-6">{data.secondary}</p>
      <button onClick={() => window.history.back()} className="px-4 py-2 bg-primary text-white rounded">
        {data.button}
      </button>
    </div>
  );
}

// La page 404 reconstituée avec son HTML et son Layout
function NotFoundComponent() {
  return (
    <RootDocument>
      <AppLayout>
        <NotFoundContent />
      </AppLayout>
    </RootDocument>
  );
}

// ==============================================================================
// 4. DÉCLARATION DE LA ROUTE
// ==============================================================================
export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { title: `${siteConfig.entreprise}` },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: "description", content: siteConfig.headDescriptionRoot },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', href: 'favicon.ico' },
    ],
  }),
  // 🟢 On utilise uniquement "component", pas de "shellComponent"
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});