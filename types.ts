/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export type Language = 'pt' | 'en';

export interface AIChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'tanya';
  timestamp: Date;
}

export interface TeamMember {
  name: string;
  role: string;
  description: string;
  image: string;
}

export interface ServiceItem {
  title: string;
  description: string;
}

export interface Artist {
  name: string;
  genre: string;
  day: string;
  image: string;
}

export interface GalleryItem {
  id: string;
  type: 'post' | 'video';
  url: string; // Used for Image Source
  category: 'manicure_pedicure' | 'hair' | 'space' | 'boutique' | 'all';
}

export interface ContentData {
  nav: {
    home: string;
    about: string;
    services: string;
    gallery: string;
    contact: string;
  };
  legal: {
    privacy: {
      title: string;
      content: string[];
    };
    terms: {
      title: string;
      content: string[];
    };
  };
  hero: {
    title: string;
    subtitle: string;
    bullet1: string;
    bullet2: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  whyChoose: {
    title: string;
    items: { title: string; desc: string }[];
  };
  about: {
    title: string;
    history: string;
    mission: { title: string; desc: string };
    vision: { title: string; desc: string };
    values: { title: string; list: string[] };
  };
  team: {
    title: string;
    desc: string;
    members: TeamMember[];
  };
  services: {
    title: string;
    salonTitle: string;
    boutiqueTitle: string;
    salon: ServiceItem[];
    boutique: ServiceItem[];
    warning: string;
  };
  gallery: {
    title: string;
    subtitle: string;
    filters: {
      all: string;
      manicure_pedicure: string;
      hair: string;
      space: string;
      boutique: string;
    };
    action: string; // "Ampliar"
    items: GalleryItem[];
  };
  contact: {
    title: string;
    intro: string; // The "Preencha os dados..." text
    whatsapp: {
      label: string;
      sublabel: string;
      message: string; // Template for the message
    };
    form: {
      name: string;
      phone: string;
      date: string;
      service: string;
      message: string;
      submit: string;
      placeholderName: string; // "Seu nome..." (optional if we want placeholders)
      selectPrompt: string; // "Selecione..."
      successTitle: string;
      successMessage: string;
      submitNew: string;
    };
    infoTitle: string;
    info: {
      call: string;
      follow: string;
      visit: string;
      email?: string;
    };
  };
  footer: {
    desc: string;
    rights: string;
    explore: string;
    newsletter: {
      title: string;
      desc: string;
      placeholder: string;
    };
    openingHours: {
      title: string;
      weekdays: string;
      saturday: string;
      sunday: string;
    };
  };
  common: {
    clients: string; // "Clientes Felizes"
    quality: string; // "Qualidade Garantida"
    seeMore: string; // "Ver Mais"
  };
}