import { ContentData } from './types';

// Shared Gallery Items
const galleryItems: any[] = [
  // --- Manicure / Pedicure ---
  {
    id: 'mp-new-1',
    type: 'post',
    url: 'https://files.zyphtech.com/wp-content/uploads/2026/02/IMG-20250925-WA0260.jpg',
    category: 'manicure_pedicure'
  },
  {
    id: 'mp-new-2',
    type: 'post',
    url: 'https://files.zyphtech.com/wp-content/uploads/2026/02/IMG-20250925-WA0254.jpg',
    category: 'manicure_pedicure'
  },
  {
    id: 'mp-new-3',
    type: 'post',
    url: 'https://files.zyphtech.com/wp-content/uploads/2026/02/IMG-20250925-WA0256.jpg',
    category: 'manicure_pedicure'
  },
  {
    id: 'mp-new-4',
    type: 'post',
    url: 'https://files.zyphtech.com/wp-content/uploads/2026/02/IMG-20250925-WA0275.jpg',
    category: 'manicure_pedicure'
  },
  {
    id: 'mp-new-5',
    type: 'post',
    url: 'https://files.zyphtech.com/wp-content/uploads/2025/12/Screenshot-2025-12-15-130728-1.png',
    category: 'manicure_pedicure'
  },
  {
    id: 'mp-new-6',
    type: 'post',
    url: 'https://files.zyphtech.com/wp-content/uploads/2025/12/Screenshot-2025-12-15-130819-1.png',
    category: 'manicure_pedicure'
  },
  {
    id: 'mp-vid-1',
    type: 'video',
    url: 'https://files.zyphtech.com/wp-content/uploads/2026/02/WhatsApp-Video-2026-02-23-at-8.05.23-PM.mp4#t=0.001',
    category: 'manicure_pedicure'
  },
  {
    id: 'mp-vid-2',
    type: 'video',
    url: 'https://files.zyphtech.com/wp-content/uploads/2026/02/WhatsApp-Video-2026-02-23-at-11.55.27-AM.mp4#t=0.001',
    category: 'manicure_pedicure'
  },
  {
    id: 'mp-vid-3',
    type: 'video',
    url: 'https://files.zyphtech.com/wp-content/uploads/2026/02/VID-20250925-WA0006.mp4#t=0.001',
    category: 'manicure_pedicure'
  },

  // --- Cabelo / Tranças ---
  {
    id: 'hair-new-1',
    type: 'post',
    url: 'https://files.zyphtech.com/wp-content/uploads/2026/02/2PlSACwgoCh721bo7pYh7_M37eu25TwrlLPh386Yzoc_plaintext_638953813653879943.jpg',
    category: 'hair'
  },
  {
    id: 'hair-new-2',
    type: 'post',
    url: 'https://files.zyphtech.com/wp-content/uploads/2026/02/IMG-20250925-WA0253.jpg',
    category: 'hair'
  },
  {
    id: 'hair-new-3',
    type: 'post',
    url: 'https://files.zyphtech.com/wp-content/uploads/2026/02/IMG-20250925-WA0259.jpg',
    category: 'hair'
  },
  {
    id: 'hair-new-4',
    type: 'post',
    url: 'https://files.zyphtech.com/wp-content/uploads/2026/02/IMG-20250925-WA0261.jpg',
    category: 'hair'
  },
  {
    id: 'hair-new-5',
    type: 'post',
    url: 'https://files.zyphtech.com/wp-content/uploads/2025/12/Screenshot-2025-12-15-131638-1.png',
    category: 'hair'
  },
  {
    id: 'hair-new-6',
    type: 'post',
    url: 'https://files.zyphtech.com/wp-content/uploads/2025/12/yMtgyx3gRim0yd-39mQJ7P-Qu6sArNf_eCiFbERpL_E_plaintext_638953813693373091.jpg',
    category: 'hair'
  },
  {
    id: 'hair-new-7',
    type: 'post',
    url: 'https://files.zyphtech.com/wp-content/uploads/2025/12/Screenshot-2025-12-15-131703.png',
    category: 'hair'
  },
  {
    id: 'hair-new-8',
    type: 'post',
    url: 'https://files.zyphtech.com/wp-content/uploads/2026/02/8kzoUOm9EstveFsQgmgILEOHhLmLwHO8_tN2vzwYBe0_plaintext_638953813662279625.jpg',
    category: 'hair'
  },

  // --- Espaço ---
  {
    id: 'space-new-1',
    type: 'post',
    url: 'https://files.zyphtech.com/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-23-at-9.27.18-PM-2.jpeg',
    category: 'space'
  },
  {
    id: 'space-new-2',
    type: 'post',
    url: 'https://files.zyphtech.com/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-23-at-9.27.17-PM-e1771943303735.jpeg',
    category: 'space'
  },
  {
    id: 'space-vid-1',
    type: 'video',
    url: 'https://files.zyphtech.com/wp-content/uploads/2026/02/WhatsApp-Video-2026-02-23-at-8.01.34-PM.mp4#t=0.001',
    category: 'space'
  },

  // --- Boutique ---
  {
    id: 'bout-new-1',
    type: 'post',
    url: 'https://files.zyphtech.com/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-23-at-9.27.18-PM-e1771943393104.jpeg',
    category: 'boutique'
  },
  {
    id: 'bout-new-2',
    type: 'post',
    url: 'https://files.zyphtech.com/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-23-at-9.27.18-PM-3-e1771943359952.jpeg',
    category: 'boutique'
  },
  {
    id: 'bout-new-3',
    type: 'post',
    url: 'https://files.zyphtech.com/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-23-at-9.27.16-PM-1.jpeg',
    category: 'boutique'
  },
  {
    id: 'bout-new-4',
    type: 'post',
    url: 'https://files.zyphtech.com/wp-content/uploads/2026/02/IMG-20250929-WA0210-e1771946334503.jpg',
    category: 'boutique'
  }
];

export const content: Record<string, ContentData> = {
  pt: {
    nav: {
      home: 'Início',
      about: 'Sobre',
      services: 'Serviços',
      gallery: 'Galeria',
      contact: 'Contacto',
    },
    hero: {
      title: 'Puro Charme',
      subtitle: 'Um espaço pensado para a mulher que valoriza o bem-estar, a elegância e um atendimento de confiança.',
      bullet1: 'SALÃO & BOUTIQUE',
      bullet2: 'Experiência Premium',
      ctaPrimary: 'Marcar Agora',
      ctaSecondary: 'Ver Serviços',
    },
    whyChoose: {
      title: 'Porquê escolher o Puro Charme?',
      items: [
        { title: 'Profissionais Experientes', desc: 'Atendimento feito com atenção, técnica e dedicação.' },
        { title: 'Produtos de Qualidade', desc: 'Trabalhamos apenas com marcas seguras e de confiança.' },
        { title: 'Ambiente Acolhedor', desc: 'Um espaço feminino, tranquilo e pensado para si.' },
      ],
    },
    about: {
      title: 'A Nossa História',
      history: 'No Puro Charme, acreditamos que beleza é confiança. Criámos um espaço pensado para cuidar, valorizar e realçar a beleza natural de cada mulher, com profissionalismo, atenção aos detalhes e um atendimento feito com carinho.',
      mission: { title: 'Missão', desc: 'Cuidar da beleza feminina com dedicação, qualidade e respeito.' },
      vision: { title: 'Visão', desc: 'Ser referência em beleza e moda em Moçambique e além-fronteiras.' },
      values: { title: 'Valores', list: ['Carinho', 'Qualidade', 'Confiança', 'Respeito'] },
    },
    team: {
      title: 'A Nossa Equipa',
      desc: 'Uma equipa dedicada, experiente e apaixonada pelo que faz. Trabalhamos com compromisso, técnica e sensibilidade para garantir resultados elegantes e uma experiência acolhedora em cada visita.',
      members: [
        { name: 'Beatriz', role: 'Fundadora & Especialista', description: 'Visão criativa e excelência em cada detalhe.', image: '/assets/img/team-1.jpg' },
        { name: 'Joaquina', role: 'Técnica de Unhas', description: 'Designs personalizados com precisão e estilo.', image: '/assets/img/team-2.jpg' },
        { name: 'Carina', role: 'Técnica de Beleza', description: 'Conforto, qualidade e resultados impecáveis.', image: '/assets/img/team-3.jpg' },
        { name: 'Danefa', role: 'Assistente de Boutique', description: 'Apoio personalizado para completar o seu look.', image: '/assets/img/team-4.jpg' },
      ],
    },
    services: {
      title: 'Os Nossos Serviços',
      salonTitle: 'Salão',
      boutiqueTitle: 'Boutique',
      warning: 'Nota: Não realizamos serviços de corte de cabelo.',
      salon: [
        { title: 'Unhas Acrílicas', description: 'Acabamento elegante e duradouro para mãos sempre bonitas.' },
        { title: 'Tranças e Extensões', description: 'Estilos modernos e clássicos para todas as ocasiões.' },
        { title: 'Manicure e Pedicure', description: 'Cuidado completo e relaxante para unhas saudáveis e tratadas.' },
        { title: 'Lavagem e Tratamento', description: 'Hidratação profunda e cuidado para cabelos mais fortes e bonitos.' },
        { title: 'Alisamento', description: 'Cabelos mais lisos, brilhantes e fáceis de cuidar.' },
        { title: 'Rosto e Estética', description: 'Limpeza e rejuvenescimento para uma pele radiante.' },
      ],
      boutique: [
        { title: 'Vestuário', description: 'Moda escolhida com bom gosto para complementar o seu estilo.' },
        { title: 'Calçado', description: 'Conforto e estilo em cada passo.' },
        { title: 'Acessórios', description: 'O toque final perfeito para o seu visual.' },
        { title: 'Moda Infantil', description: 'Estilo e conforto para os mais pequenos.' },
      ],
    },
    gallery: {
      title: 'Galeria',
      subtitle: 'Um pouco do nosso trabalho, do nosso espaço e da experiência Puro Charme.',
      filters: {
        all: 'Todos',
        manicure_pedicure: 'Manicure/Pedicure',
        hair: 'Cabelo / Tranças',
        space: 'Espaço',
        boutique: 'Boutique',
      },
      action: 'Ampliar',
      items: galleryItems,
    },
    contact: {
      title: 'Fala Connosco',
      intro: 'Estamos prontas para atender você. Entre em contacto ou faça a sua marcação.',
      whatsapp: {
        label: 'WhatsApp',
        sublabel: 'Fale Connosco',
        message: 'Olá Puro Charme. Gostaria de mais informações sobre os vossos serviços, por favor.',
      },
      form: {
        name: 'Nome',
        phone: 'Telefone',
        date: 'Data',
        service: 'Serviço',
        message: 'Mensagem',
        submit: 'Enviar pedido',
        placeholderName: '',
        selectPrompt: 'Selecione...',
        successTitle: 'Pedido enviado com sucesso!',
        successMessage: 'Entraremos em contacto via WhatsApp para confirmação.',
        submitNew: 'Enviar novo pedido',
      },
      infoTitle: 'Contactos',
      info: {
        call: 'Ligue Agora',
        follow: 'Instagram',
        visit: 'Localização',
        email: 'info@pcharme.niassa.site',

      },
    },
    footer: {
      desc: 'Um espaço pensado para a mulher que valoriza o bem-estar, a elegância e um atendimento de confiança.',
      rights: '© 2026 Puro Charme. Todos os direitos reservados.',
      explore: 'Explorar',
      newsletter: {
        title: 'Newsletter',
        desc: 'Subscreve para receberes novidades, dicas de beleza e ofertas exclusivas.',
        placeholder: 'O teu email...',
      },
      openingHours: {
        title: 'Horário',
        weekdays: 'Seg - Sáb: 08:30 - 19:00',
        saturday: 'Domingo: 09:00 - 18:00',
        sunday: '',
      },
    },
    common: {
      clients: 'Clientes Felizes',
      quality: 'Qualidade Garantida',
      seeMore: 'Ver Mais',
    },
    legal: {
      privacy: {
        title: 'Política de Privacidade',
        content: [
          'A Puro Charme valoriza a sua privacidade e compromete-se a proteger os seus dados pessoais.',
          'As informações fornecidas através do formulário de contacto ou WhatsApp são utilizadas apenas para comunicação, marcações e atendimento ao cliente. Não partilhamos dados com terceiros.',
          'Ao utilizar este website, concorda com a recolha e uso responsável das suas informações conforme descrito acima.'
        ]
      },
      terms: {
        title: 'Termos e Condições',
        content: [
          'Ao utilizar o website da Puro Charme – Salão e Boutique, concorda com os termos descritos abaixo.',
          'Os conteúdos apresentados neste site têm carácter informativo e destinam-se a facilitar o contacto e a marcação de serviços. A Puro Charme reserva-se o direito de actualizar informações, serviços e conteúdos sem aviso prévio.',
          'Todas as imagens, textos e elementos visuais pertencem à Puro Charme e não podem ser utilizados sem autorização prévia.',
          'Para qualquer esclarecimento adicional, entre em contacto connosco através dos canais oficiais disponíveis no site.'
        ]
      }
    }
  },
  en: {
    nav: {
      home: 'Home',
      about: 'About',
      services: 'Services',
      gallery: 'Gallery',
      contact: 'Contact',
    },
    hero: {
      title: 'Puro Charme',
      subtitle: 'A space designed for women who value well-being, elegance, and trusted service.',
      bullet1: 'SALON & BOUTIQUE',
      bullet2: 'Premium Experience',
      ctaPrimary: 'Book Now',
      ctaSecondary: 'View Services',
    },
    whyChoose: {
      title: 'Why choose Puro Charme?',
      items: [
        { title: 'Experienced Professionals', desc: 'Service performed with attention, technique, and dedication.' },
        { title: 'Quality Products', desc: 'We work only with safe and reliable products.' },
        { title: 'Welcoming Environment', desc: 'A feminine, peaceful space designed for you.' },
      ],
    },
    about: {
      title: 'Our History',
      history: 'At Puro Charme, we believe that beauty is confidence. We created a space designed to care for, value, and enhance the natural beauty of every woman, with professionalism, attention to detail, and service provided with affection.',
      mission: { title: 'Mission', desc: 'To care for feminine beauty with dedication, quality, and respect.' },
      vision: { title: 'Vision', desc: 'To be a reference in beauty and fashion in Mozambique and beyond.' },
      values: { title: 'Values', list: ['Affection', 'Quality', 'Trust', 'Respect'] },
    },
    team: {
      title: 'Our Team',
      desc: 'A dedicated, experienced, and passionate team. We work with commitment, technique, and sensitivity to guarantee elegant results and a welcoming experience in every visit.',
      members: [
        { name: 'Beatriz', role: 'Founder & Specialist', description: 'Creative vision and excellence in every detail.', image: '/assets/img/team-1.jpg' },
        { name: 'Joaquina', role: 'Nail Technician', description: 'Personalized designs with precision and style.', image: '/assets/img/team-2.jpg' },
        { name: 'Karina', role: 'Beauty Technician', description: 'Comfort, quality, and impeccable results.', image: '/assets/img/team-3.jpg' },
        { name: 'Danefa', role: 'Boutique Assistant', description: 'Personalized support to complete your look.', image: '/assets/img/team-4.jpg' },
      ],
    },
    services: {
      title: 'Our Services',
      salonTitle: 'Salon',
      boutiqueTitle: 'Boutique',
      warning: 'Note: We do not offer hair cutting services.',
      salon: [
        { title: 'Acrylic Nails', description: 'Elegant and durable finish for always beautiful hands.' },
        { title: 'Braids and Extensions', description: 'Modern and classic styles for all occasions.' },
        { title: 'Manicure & Pedicure', description: 'Complete and relaxing care for healthy and treated nails.' },
        { title: 'Wash & Treatment', description: 'Deep hydration and care for stronger, more beautiful hair.' },
        { title: 'Smoothing & Straightening', description: 'Smoother, shinier, and easier-to-manage hair.' },
        { title: 'Face and Aesthetics', description: 'Cleaning and rejuvenation for radiant skin.' },
      ],
      boutique: [
        { title: 'Clothing', description: 'Fashion chosen with good taste to complement your style.' },
        { title: 'Footwear', description: 'Comfort and style in every step.' },
        { title: 'Accessories', description: 'The perfect final touch for your look.' },
        { title: 'Kids Fashion', description: 'Style and comfort for the little ones.' },
      ],
    },
    gallery: {
      title: 'Gallery',
      subtitle: 'A bit of our work, our space, and the Puro Charme experience.',
      filters: {
        all: 'All',
        manicure_pedicure: 'Manicure/Pedicure',
        hair: 'Hair / Braids',
        space: 'Space',
        boutique: 'Boutique',
      },
      action: 'Expand',
      items: galleryItems,
    },
    contact: {
      title: 'Contact Us',
      intro: 'We are ready to assist you. Get in touch or make your appointment.',
      whatsapp: {
        label: 'WhatsApp',
        sublabel: 'Chat with Us',
        message: 'Hello Puro Charme. I would like more information about your services, please.',
      },
      form: {
        name: 'Name',
        phone: 'Phone',
        date: 'Date',
        service: 'Service',
        message: 'Message',
        submit: 'Send Request',
        placeholderName: '',
        selectPrompt: 'Select...',
        successTitle: 'Request sent successfully!',
        successMessage: 'We will contact you via WhatsApp to confirm.',
        submitNew: 'Send new request',
      },
      infoTitle: 'Contacts',
      info: {
        call: 'Call Now',
        follow: 'Instagram',
        visit: 'Location',
      },
    },
    footer: {
      desc: 'A space designed for women who value well-being, elegance, and trusted service.',
      rights: '© 2026 Puro Charme. All rights reserved.',
      explore: 'Explore',
      newsletter: {
        title: 'Newsletter',
        desc: 'Subscribe to receive news, beauty tips, and exclusive offers.',
        placeholder: 'Your email...',
      },
      openingHours: {
        title: 'Hours',
        weekdays: 'Mon - Sat: 08:30 - 19:00',
        saturday: 'Sunday: 09:00 - 18:00',
        sunday: '',
      },
    },
    common: {
      clients: 'Happy Clients',
      quality: 'Quality Guaranteed',
      seeMore: 'See More',
    },
    legal: {
      privacy: {
        title: 'Privacy Policy',
        content: [
          'Puro Charme respects your privacy and is committed to protecting your personal data.',
          'Information collected through the website, contact forms, or WhatsApp (such as name, contact, and message) is used exclusively to respond to your requests, make appointments, and improve service.',
          'We do not share, sell, or disclose your data to third parties.',
          'By using our website, you agree to the collection and use of information as described in this policy.',
          'For any questions regarding privacy, you can contact us through our official channels.'
        ]
      },
      terms: {
        title: 'Terms & Conditions',
        content: [
          'By accessing and using the Puro Charme – Salon & Boutique website, you agree to the following terms and conditions.',
          'All content presented (texts, images, logo, and visual identity) is the property of Puro Charme and may not be used without authorization.',
          'The information available on the site is informative and may be updated without prior notice.',
          'Appointments made through the website or WhatsApp are subject to confirmation by the Puro Charme team.',
          'Puro Charme reserves the right to update these terms whenever necessary.'
        ]
      }
    }
  },
};