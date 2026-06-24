// src/types/translation.ts

// pour function NotFoundComponent()
export interface NotFoundTranslations {
  primary: string;
  secondary: string;
  button: string;
} 

// pour function HomePage()
export interface HomeTranslations {
  hero: {primaryBefore: string; primaryAccent: string; primaryAfter: string; secondary: string; photo: string;};
  trustbar: {items: Array<{iconKey: string; label: string;}>;};
  pourquoi: { title: string; primary: string; secondary: string;
    cartes: Array<{ iconKey: string; title: string; text: string; }>;};
  processus: { title: string; primary: string;
      cartes: Array<{ num: string; title: string; text: string; }>;};
  realisations: { title: string; primary: string;
    cartes: Array<{ srcKey: string; title: string; location: string; }>;};
  temoignages: { title: string; primary: string;
    cartes: Array<{ name: string; date: string; text: string; }>;};
  faq: { title: string; primary: string; secondary: string;
    questions: Array<{ question: string; answer: string; }>;};
}

// pour function AboutPage()
export interface AboutTranslations {
  hero: {primary: string; secondary: string;};
  histoire: {primary: string; secondary: string;
    cartes: Array<{iconKey: string;title: string;text: string; }>;};
  metriques: {cartes: Array<{valeur: string;title: string; }>;};
}

// pour function ServicesPage()
export interface ServicesTranslations {
  hero: {primary: string;secondary: string;};
  services: {
    cartes: Array<{ iconKey: string; title: string; text: string; bouton: string; }>; };
}

// pour function ContactPage()
export interface ContactTranslations {
  hero: { primary: string; secondary: string; };
  projets: { defaut: string; labels: Array<{ option: string; }>; };
  formulaire: { champ: string; identite: string; telephone: string; email: string; projet: string;
    message: string; message_suggestion: string; message_tooltip: string;
    bouton: string; confidentialite: string };
  toast: { succes: string; erreur_resend: string; erreur_reseau: string };
}

// pour function BookingPage()
export interface BookingTranslations {
  hero: {
    primary: string;
    secondary: string;
  };
  info: {
    primary: string;
    secondary: string;
    cartes: Array<{
      iconKey: string;
      title: string;
      text: string;
    }>;
  };
  events: {
    sectionTitle: string;
    sectionSubtitle: string;
    beforePrice: string;
    price: string;
    free: string;
    duration: string;
    selectButton: string;
    selected: string;
    event30min: { iconKey: string; title: string; description: string; };
    event60min: { iconKey: string; title: string; description: string; };
    event90min: { iconKey: string; title: string; description: string; };
  };
  confirmation: {
    title: string;
    message: string;
    emailSent: string;
    newBooking: string;
    goHome: string;
  };
  annulation: {
    message: string;
  };
  chargement: string;
  erreur: string;
  reessayer: string;
}


// pour function CtaBand()
export interface CtaBandTranslations {
  hero: { title: string; primary: string; secondary: string; bouton: string };
}

// pour function Header()
export interface HeaderTranslations {
  navigation: {
    labels: Array<{ bouton: string; to: string }>;
    cta: { bouton: string; to: string };
  };
}

// pour function Footer()
export interface FooterTranslations {
  primary: string;
  contact: string;
  ref: { droits: string; mentions: string; mentionsUrl: string; confidentialite: string; confidentialiteUrl: string };
}