/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Instagram, Phone, MapPin, Globe, ArrowRight, Heart, Star, Sparkles, Hand, Scissors, Footprints, Droplets, Wind, Smile, Shirt, Gem, Baby, Play, Clock, ChevronRight } from 'lucide-react';
import { content } from '../content';
import { Language, GalleryItem } from '../types';
import { LanguageSelector } from '../components/LanguageSelector';
import { supabase } from '../lib/supabase';




// Fallback logo text if images are missing (optional helper)
const LogoFallback = ({ variant }: { variant: 'pink' | 'gold' }) => {
  return (
    <div className={`flex items-center gap-2 font-headline font-bold text-2xl tracking-wide px-3 py-1`}>
      {variant === 'pink' ? (
        <span className="text-puro-black flex items-center gap-2">
          Puro <span className="text-puro-pastelPink font-brand text-4xl mt-1">Charme</span>
        </span>
      ) : (
        <span className="text-puro-black flex items-center gap-2">
          Puro <span className="text-puro-gold font-brand text-4xl mt-1">Charme</span>
        </span>
      )}
    </div>
  );
};

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

// Custom Cursor Component
const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const mouseMove = (e: MouseEvent) => setMousePosition({ x: e.clientX, y: e.clientY });
    const mouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'BUTTON' || target.tagName === 'A' || target.closest('.cursor-pointer')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", mouseMove);
    window.addEventListener("mouseover", mouseOver);

    return () => {
      window.removeEventListener("mousemove", mouseMove);
      window.removeEventListener("mouseover", mouseOver);
    };
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 border border-puro-pastelPink rounded-full pointer-events-none z-[9999] hidden md:block"
      animate={{
        x: mousePosition.x - 16,
        y: mousePosition.y - 16,
        scale: isHovering ? 1.5 : 1,
        backgroundColor: isHovering ? "rgba(255, 91, 160, 0.1)" : "transparent",
        borderColor: isHovering ? "#FF4095" : "#FF5BA0"
      }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
    />
  );
};


// Splash Screen Component
const SplashScreen = ({ onComplete, slogan }: { onComplete: () => void; slogan: string }) => {
  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center p-4"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      onAnimationComplete={onComplete}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center text-center"
      >
        <img src="/assets/img/logo-pink.png" alt="Puro Charme" className="w-48 md:w-64 h-auto object-contain mb-4" />

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-puro-pink font-headline font-bold text-sm md:text-base tracking-[0.3em] uppercase mb-4"
        >
          Salão & Boutique
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-puro-text font-body text-sm md:text-base max-w-md mb-8 px-4"
        >
          {slogan}
        </motion.p>

        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
          className="h-1 bg-puro-pink rounded-full w-32 max-w-[200px]"
        />
      </motion.div>
    </motion.div>
  );
};

const MainSite: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState<Language>('pt');
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [activeTab, setActiveTab] = useState<'salon' | 'boutique'>('salon');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activePage, setActivePage] = useState<'home' | 'privacy' | 'terms'>('home');
  const [activeSection, setActiveSection] = useState('home');
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Splash screen timer
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  // Form States
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    time: '14:00',
    service: 'Unhas Acrílicas',
    message: ''
  });
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const t = content[lang];
  const [websiteInfo, setWebsiteInfo] = useState<any>({});

  useEffect(() => {
    // Load dynamic info from Supabase
    const loadWebsiteInfo = async () => {
      const { data } = await supabase.from('website_info').select('*');
      if (data) {
        const infoMap = data.reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {});
        setWebsiteInfo(infoMap);
      }
    };
    loadWebsiteInfo();
  }, []);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus('loading');

    // Save to appointments table
    const { error } = await supabase
      .from('appointments')
      .insert([
        {
          customer_name: formData.name,
          customer_phone: formData.phone,
          service_type: formData.service,
          appointment_date: formData.date,
          appointment_time: formData.time,
          notes: formData.message,
          status: 'pendente'
        }
      ]);

    if (error) {
      console.error('Error saving appointment:', error);
      setSubmitStatus('error');
    } else {
      setSubmitStatus('success');
      setFormData({ name: '', phone: '', date: '', time: '14:00', service: t.services.salon[0].title, message: '' });
    }
  };

  // Whatsapp Button Component (New Circular Design)
  const WhatsAppButton = () => (
    <a
      href={`https://wa.me/${(websiteInfo.contact_phone || '258848920837').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(t.contact.whatsapp.message)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-[60] w-14 h-14 bg-puro-pink text-white rounded-full shadow-[0_4px_15px_rgba(255,64,149,0.3)] hover:shadow-[0_8px_25px_rgba(255,64,149,0.4)] hover:bg-[#e03882] hover:scale-105 transition-all duration-300 cursor-pointer flex items-center justify-center group"
      aria-label="Contact on WhatsApp"
      style={{ transform: 'none' }}
    >
      <div className="relative">
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 relative z-10">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
      </div>
    </a>
  );

  // Specific Icons Configuration
  const salonIcons = [Hand, Scissors, Footprints, Droplets, Wind, Smile];
  const boutiqueIcons = [Shirt, Footprints, Gem, Baby];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll Spy for Active Section
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'services', 'gallery', 'contact'];
      const scrollPosition = window.scrollY + 150; // Offset for header

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetBottom = offsetTop + element.offsetHeight;
          if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            setActiveSection(section);
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLang = () => {
    setLang(prev => prev === 'pt' ? 'en' : 'pt');
  };

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };


  const handleServiceClick = (serviceTitle: string) => {
    let category = 'all';
    const lowerTitle = serviceTitle.toLowerCase();

    if (activeTab === 'boutique') {
      category = 'boutique';
    } else if (lowerTitle.includes('pedicure')) {
      category = 'manicure_pedicure';
    } else if (lowerTitle.includes('unhas') || lowerTitle.includes('manicure') || lowerTitle.includes('acrílicas')) {
      category = 'manicure_pedicure';
    } else if (lowerTitle.includes('cabelo') || lowerTitle.includes('trança') || lowerTitle.includes('alisamento') || lowerTitle.includes('lavagem') || lowerTitle.includes('extensões')) {
      category = 'hair';
    } else if (lowerTitle.includes('rosto') || lowerTitle.includes('estética')) {
      category = 'space';
    }

    setActiveCategory(category);

    // Smooth scroll to gallery
    const gallerySection = document.getElementById('gallery');
    if (gallerySection) {
      gallerySection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="font-body text-puro-text bg-white selection:bg-puro-pastelPink selection:text-white overflow-x-hidden antialiased tracking-body">
      <AnimatePresence>
        {loading && <SplashScreen onComplete={() => { }} slogan={t.footer.desc} />}
      </AnimatePresence>

      {/* HEADER */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${isScrolled
          ? 'bg-white/95 backdrop-blur-lg shadow-soft py-3'
          : 'bg-transparent py-6'
          }`}
      >
        <div className="max-w-[1300px] mx-auto px-6 flex justify-between items-center">
          {/* LOGO */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="cursor-pointer"
            onClick={() => { setActivePage('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          >
            {/* Logo Logic - Increased Size & Smooth Crossfade */}
            <div className="relative h-16 w-64 flex items-center">
              {/* Pink Logo - Visible when NOT scrolled (Hero view) */}
              <img
                src="/assets/img/logo-pink.png"
                alt="Puro Charme Pink"
                className={`absolute top-0 left-0 h-full w-auto object-contain transition-opacity duration-200 ease-in-out ${!isScrolled ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  }`}
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />

              {/* Gold Logo - Visible when Scrolled */}
              <img
                src="/assets/img/logo-gold.png"
                alt="Puro Charme Gold"
                className={`absolute top-0 left-0 h-full w-auto object-contain transition-opacity duration-200 ease-in-out ${isScrolled ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  }`}
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />

              {/* Fallback (Hidden if images load) */}
              <div className="opacity-0 pointer-events-none absolute">
                <LogoFallback variant={isScrolled ? 'gold' : 'pink'} />
              </div>
            </div>
          </motion.div>

          {/* DESKTOP NAV */}
          <div className="hidden lg:flex items-center gap-10">
            <nav className="flex gap-8">
              {Object.entries(t.nav).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => scrollTo(key)}
                  className={`relative text-[13px] font-headline font-medium uppercase tracking-widest transition-colors hover:text-puro-pastelPink group ${activeSection === key ? 'text-puro-pastelPink' : (isScrolled ? 'text-puro-text' : 'text-puro-black')
                    }`}
                >
                  {label}
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-puro-pastelPink transition-all duration-300 ${activeSection === key ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}></span>
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-6 border-l border-gray-200/50 pl-8">
              <LanguageSelector currentLang={lang} onLanguageChange={setLang} isScrolled={isScrolled} />
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(255, 91, 160, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollTo('contact')}
                className="bg-puro-pink text-white px-8 py-3 rounded-button text-[11px] font-headline font-medium uppercase tracking-widest shadow-lg shadow-puro-pink/30 transition-all"
              >
                {t.hero.ctaPrimary}
              </motion.button>
            </div>
          </div>

          {/* MOBILE TOGGLE */}
          <div className="lg:hidden flex items-center gap-4">
            <LanguageSelector currentLang={lang} onLanguageChange={setLang} isScrolled={isScrolled} />
            <button onClick={() => setMobileMenuOpen(true)} className="text-puro-black p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-0 z-[60] bg-white flex flex-col p-6 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-16">
              <img
                src="/assets/img/logo-pink.png"
                alt="Puro Charme"
                className="h-12 w-auto object-contain"
              />
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 bg-puro-softPink rounded-full text-puro-text hover:text-puro-pink"
              >
                <X size={24} />
              </motion.button>
            </div>

            <nav className="flex flex-col gap-4 items-center w-full mt-4">
              {Object.entries(t.nav).map(([key, label]) => (
                <motion.button
                  key={key}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => scrollTo(key)}
                  className={`text-2xl font-headline font-medium transition-colors tracking-headline py-4 w-full text-center min-h-[56px] ${activeSection === key ? 'text-puro-pastelPink' : 'text-puro-black hover:text-puro-pastelPink'
                    }`}
                >
                  {label}
                </motion.button>
              ))}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => { scrollTo('contact'); setMobileMenuOpen(false); }}
                className="mt-6 w-full py-4 min-h-[56px] bg-puro-pink text-white font-headline font-medium rounded-button shadow-lg shadow-puro-pink/30"
              >
                {t.hero.ctaPrimary}
              </motion.button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT vs LEGAL PAGE */}
      {activePage === 'home' ? (
        <>
          {/* HERO SECTION */}
          <section
            id="home"
            ref={heroRef}
            className="relative min-h-[90vh] pt-36 pb-20 flex items-center overflow-hidden bg-hero-gradient"
          >
            <div className="max-w-[1300px] mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

              {/* Text Content */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-left z-10 flex flex-col items-start"
              >
                {/* NEW BADGE / PILL */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 182, 193, 0.3)", borderColor: "#FFB6C1" }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center justify-center px-7 py-2.5 mb-8 rounded-full border border-puro-pastelPink/30 bg-puro-softPink/20 backdrop-blur-sm cursor-pointer transition-colors duration-300"
                >
                  <span className="text-sm font-sans font-bold tracking-widest text-puro-pastelPink uppercase">
                    {t.hero.bullet1}
                  </span>
                </motion.div>

                {/* NEW TITLE TYPOGRAPHY */}
                <h1 className="font-sans font-bold text-[42px] sm:text-[52px] md:text-[76px] lg:text-[86px] mb-8 text-puro-black leading-[1.1] tracking-tight -ml-1">
                  Puro <span className="text-puro-pastelPink">Charme</span>
                </h1>

                {/* SUBTITLE WITH VERTICAL BAR */}
                <div className="border-l-[6px] border-puro-pink pl-6 py-1 mb-12 max-w-lg">
                  <p className="text-base md:text-lg text-gray-500 font-sans font-normal leading-relaxed tracking-wide">
                    {t.hero.subtitle}
                  </p>
                </div>

                {/* BUTTONS */}
                <div className="flex flex-col sm:flex-row items-start justify-start gap-4 w-full">
                  <motion.button
                    whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(255, 91, 160, 0.3)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => scrollTo('contact')}
                    className="w-full sm:w-auto px-8 py-4 min-h-[56px] bg-puro-pink text-white text-[13px] font-sans font-medium uppercase tracking-widest rounded-full shadow-lg shadow-puro-pink/40 hover:bg-puro-pastelPink transition-all duration-300 flex justify-center items-center"
                  >
                    {t.hero.ctaPrimary} <ArrowRight size={16} className="ml-2" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02, backgroundColor: "#FFF5F9", borderColor: "#FF5BA0", color: "#FF5BA0" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => scrollTo('services')}
                    className="w-full sm:w-auto px-8 py-4 min-h-[56px] border border-gray-200 bg-white text-gray-600 text-[13px] font-sans font-medium uppercase tracking-widest rounded-full shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center"
                  >
                    {t.hero.ctaSecondary}
                  </motion.button>
                </div>

                {/* SOCIAL PROOF */}
                <div className="mt-12 flex items-center justify-start gap-4">
                  <div className="flex -space-x-3">
                    {[1, 2, 3].map(i => (
                      <img key={i} src={`/assets/img/client-${i}.jpg`} className="w-10 h-10 rounded-full border-[2px] border-white shadow-sm object-cover" alt="Client" loading="lazy" />
                    ))}
                    <div className="w-10 h-10 rounded-full border-[2px] border-white bg-puro-pastelPink flex items-center justify-center text-[10px] font-sans font-bold text-white shadow-sm">500+</div>
                  </div>
                  <div className="text-left pl-2">
                    <div className="flex text-puro-warning text-[10px] gap-0.5">
                      <Star size={12} fill="currentColor" strokeWidth={0} />
                      <Star size={12} fill="currentColor" strokeWidth={0} />
                      <Star size={12} fill="currentColor" strokeWidth={0} />
                      <Star size={12} fill="currentColor" strokeWidth={0} />
                      <Star size={12} fill="currentColor" strokeWidth={0} />
                    </div>
                    <p className="text-[10px] font-sans font-medium text-gray-400 mt-1 uppercase tracking-wide">{t.common.clients}</p>
                  </div>
                </div>
              </motion.div>

              {/* Image Card */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                className="relative z-0"
              >
                <div className="absolute top-10 right-10 w-full h-full bg-gradient-to-tr from-puro-softPink to-white rounded-[60px] -z-10 blur-3xl opacity-80"></div>
                <div className="relative rounded-[40px] overflow-hidden shadow-soft bg-white p-2">
                  <img
                    src="/assets/img/hero-main.png"
                    alt="Puro Charme Destaque"
                    className="rounded-[36px] w-full h-[400px] lg:h-[550px] object-cover object-top hover:scale-105 transition-transform duration-1000 ease-in-out"
                  />


                </div>
              </motion.div>
            </div>
          </section>

          {/* WHY CHOOSE US */}
          <section className="py-32 bg-white relative">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="max-w-[1300px] mx-auto px-6"
            >
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="text-center font-headline font-bold tracking-headline text-2xl md:text-3xl text-puro-black mb-24"
              >
                {t.whyChoose.title}
              </motion.h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {t.whyChoose.items.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.15 }}
                    whileHover={{
                      y: -12,
                      backgroundColor: "#FFF9FB", // Subtle pinkish white
                      boxShadow: "0 25px 50px -12px rgba(255, 91, 160, 0.15)" // Softer, tinted shadow
                    }}
                    className="bg-white p-12 shadow-soft rounded-card transition-colors duration-300 border border-gray-50 flex flex-col items-start cursor-default group"
                  >
                    <div className="w-14 h-14 bg-puro-softPink rounded-2xl flex items-center justify-center mb-8 text-puro-pastelPink shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:bg-white group-hover:text-puro-pink group-hover:shadow-md">
                      {i === 0 ? <Star strokeWidth={1.5} /> : i === 1 ? <Sparkles strokeWidth={1.5} /> : <Heart strokeWidth={1.5} />}
                    </div>
                    <h3 className="font-headline font-bold text-lg mb-4 text-puro-black group-hover:text-puro-pink transition-colors duration-300">{item.title}</h3>
                    <p className="text-puro-text text-sm leading-relaxed font-body group-hover:text-gray-600 transition-colors duration-300">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </section>

          {/* ABOUT & TEAM */}
          <section id="about" className="py-32 bg-puro-softPink/30">
            <div className="max-w-[1300px] mx-auto px-6 text-center">
              <motion.div
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
                className="max-w-3xl mx-auto mb-16"
              >
                <h2 className="font-sans font-bold tracking-tight text-3xl md:text-4xl text-puro-black mb-6">{t.about.title}</h2>
                <p className="text-gray-500 leading-relaxed text-lg font-sans font-normal tracking-wide">{t.about.history}</p>
              </motion.div>

              {/* Team Title & Intro */}
              <motion.div
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
                className="max-w-3xl mx-auto mb-12"
              >
                <h2 className="font-sans font-bold tracking-tight text-3xl md:text-4xl text-puro-black mb-4">{t.team.title}</h2>
                <p className="text-gray-500 font-sans tracking-wide text-lg">{t.team.desc}</p>
              </motion.div>

              {/* Team Circles */}
              <motion.div
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
                className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16"
              >
                {t.team.members.map((member, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex flex-col items-center group cursor-pointer"
                  >
                    <div className="w-36 h-36 rounded-full overflow-hidden border-[4px] border-white shadow-card mb-4 transition-transform duration-500 group-hover:scale-105 group-hover:border-puro-pastelPink/30 group-hover:shadow-glow">
                      <img src={member.image} alt={member.name} className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                    </div>
                    <h4 className="font-headline font-medium text-lg mb-1 text-puro-black">{member.name}</h4>
                    <span className="text-[10px] font-headline font-bold text-puro-pastelPink uppercase tracking-[0.2em] mb-2">{member.role}</span>
                    <p className="text-xs text-gray-400 italic font-body">"{member.description}"</p>
                  </motion.div>
                ))}
              </motion.div>

              {/* Values Cards */}
              <motion.div
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
                className="grid grid-cols-1 md:grid-cols-3 gap-8"
              >
                <motion.div whileHover={{ scale: 1.02 }} className="bg-white px-8 py-10 rounded-card shadow-soft hover:shadow-hover transition-all text-left border-l-[4px] border-puro-pastelPink">
                  <h4 className="font-headline font-bold text-lg mb-3 text-puro-pastelPink">{t.about.mission.title}</h4>
                  <p className="text-sm text-puro-text leading-relaxed font-body">{t.about.mission.desc}</p>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} className="bg-white px-8 py-10 rounded-card shadow-soft hover:shadow-hover transition-all text-left border-l-[4px] border-puro-pastelPink">
                  <h4 className="font-headline font-bold text-lg mb-3 text-puro-pastelPink">{t.about.vision.title}</h4>
                  <p className="text-sm text-puro-text leading-relaxed font-body">{t.about.vision.desc}</p>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} className="bg-white px-8 py-10 rounded-card shadow-soft hover:shadow-hover transition-all text-left border-l-[4px] border-puro-pastelPink">
                  <h4 className="font-headline font-bold text-lg mb-3 text-puro-pastelPink">{t.about.values.title}</h4>
                  <p className="text-sm text-puro-text leading-relaxed font-body">{t.about.values.list.join(', ')}.</p>
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* SERVICES */}
          <section id="services" className="py-32 bg-white relative">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="max-w-[1300px] mx-auto px-6"
            >
              {/* Tabs */}
              <div className="flex justify-center mb-20">
                <div className="flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab('salon')}
                    className={`px-10 py-3 min-h-[44px] rounded-button text-xs font-headline font-semibold tracking-widest uppercase transition-all duration-300 ${activeTab === 'salon' ? 'bg-puro-pink text-white shadow-lg shadow-puro-pink/30' : 'bg-transparent border border-gray-200 text-gray-400 hover:border-puro-pink hover:text-puro-pink'}`}
                  >
                    {t.services.salonTitle}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab('boutique')}
                    className={`px-10 py-3 min-h-[44px] rounded-button text-xs font-headline font-semibold tracking-widest uppercase transition-all duration-300 ${activeTab === 'boutique' ? 'bg-puro-pink text-white shadow-lg shadow-puro-pink/30' : 'bg-transparent border border-gray-200 text-gray-400 hover:border-puro-pink hover:text-puro-pink'}`}
                  >
                    {t.services.boutiqueTitle}
                  </motion.button>
                </div>
              </div>



              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {(activeTab === 'salon' ? t.services.salon : t.services.boutique).map((service, i) => {
                  const icons = activeTab === 'salon' ? salonIcons : boutiqueIcons;
                  const Icon = icons[i] || Sparkles;
                  return (
                    <motion.div
                      key={i}
                      whileHover={{ y: -5, boxShadow: "0 20px 40px -5px rgba(0, 0, 0, 0.05)" }}
                      className="group bg-white rounded-card p-10 shadow-card transition-all duration-300 border border-gray-50 relative overflow-hidden cursor-default"
                    >

                      <div className="w-12 h-12 bg-puro-softPink rounded-full flex items-center justify-center text-puro-pastelPink mb-6 group-hover:bg-puro-pink group-hover:text-white transition-colors duration-300 group-hover:scale-110">
                        <Icon size={22} strokeWidth={1.5} />
                      </div>

                      <h3 className="font-headline font-bold text-lg mb-3 text-puro-black">{service.title}</h3>
                      <p className="text-sm text-gray-500 mb-8 leading-relaxed h-10 font-body">{service.description}</p>

                      <span
                        className="text-[10px] font-headline font-bold text-puro-pastelPink uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all cursor-pointer"
                        onClick={() => handleServiceClick(service.title)}
                      >
                        {t.common.seeMore} <ArrowRight size={12} />
                      </span>
                    </motion.div>
                  )
                })}
              </motion.div>

              {/* Discreet Warning Below Grid */}
              {activeTab === 'salon' && (
                <div className="mt-12 text-center">
                  <p className="text-gray-400 text-xs italic font-body bg-gray-50 inline-block px-4 py-2 rounded-full border border-gray-100">
                    {t.services.warning}
                  </p>
                </div>
              )}
            </motion.div>
          </section>

          {/* GALLERY */}
          <section id="gallery" className="py-32 bg-gray-50/50">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="max-w-[1300px] mx-auto px-6"
            >
              <div className="mb-16 flex flex-col md:flex-row justify-between items-end gap-6">
                <div className="max-w-xl">
                  <h2 className="font-headline font-bold tracking-headline text-2xl md:text-3xl text-puro-black mb-4">{t.gallery.title}</h2>
                  <p className="text-gray-500 text-base md:text-lg leading-relaxed font-body">{t.gallery.subtitle}</p>
                </div>

                {/* Filters */}
                <div className="w-full md:w-auto grid grid-cols-2 gap-3 md:flex md:gap-2">
                  {['all', 'manicure_pedicure', 'hair', 'space', 'boutique'].map(cat => (
                    <motion.button
                      key={cat}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-4 py-3 md:px-6 md:py-2 min-h-[44px] rounded-full text-[11px] md:text-[10px] font-headline font-bold uppercase tracking-widest border transition-all whitespace-nowrap flex items-center justify-center ${activeCategory === cat
                        ? 'bg-puro-pastelPink text-white border-puro-pastelPink shadow-md'
                        : 'bg-white text-gray-400 border-gray-200 hover:border-puro-pastelPink hover:text-puro-pastelPink'
                        }`}
                    >
                      {t.gallery.filters[cat as keyof typeof t.gallery.filters]}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Gallery Grid Layout */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
                {t.gallery.items.filter(item => activeCategory === 'all' || item.category === activeCategory).map((item, i) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -5 }}
                    className="relative aspect-[4/5] rounded-card overflow-hidden cursor-pointer group shadow-card border border-gray-100 bg-white"
                    onClick={() => setSelectedItem(item as GalleryItem)}
                  >
                    {/* Media Source */}
                    {item.type === 'video' ? (
                      <div className="relative w-full h-full">
                        <video
                          src={item.url}
                          className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                          muted
                          playsInline
                          preload="metadata"
                        />
                        <div className="absolute inset-0 flex items-center justify-center z-10">
                          <div className="w-12 h-12 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/50 shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:bg-puro-pink group-hover:border-puro-pink">
                            <Play size={20} className="text-white ml-1" fill="currentColor" />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <img
                        src={item.url}
                        alt="Gallery Item"
                        className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    )}

                    {/* Overlay (Hover Actions) - Only show if NOT video (video has its own play button visual) or modify to work together */}
                    {item.type !== 'video' && (
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                        <span className="text-white bg-white/20 px-6 py-2 rounded-full text-xs font-headline font-bold backdrop-blur-md border border-white/30 transform scale-0 group-hover:scale-100 transition-transform duration-300">
                          {t.gallery.action}
                        </span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Lightbox / Modal */}
            <AnimatePresence>
              {selectedItem && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSelectedItem(null)}
                  className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className="relative w-full max-w-[800px] max-h-[90vh] bg-transparent rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center"
                  >
                    <button
                      onClick={() => setSelectedItem(null)}
                      className="absolute top-4 right-4 z-50 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                    >
                      <X size={20} />
                    </button>

                    {selectedItem.type === 'video' ? (
                      <video
                        src={selectedItem.url}
                        className="w-full h-full max-h-[85vh] object-contain rounded-lg"
                        controls
                        autoPlay
                        muted
                      />
                    ) : (
                      <img
                        src={selectedItem.url}
                        alt="Gallery Full"
                        className="w-full h-full max-h-[85vh] object-contain rounded-lg"
                      />
                    )}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* CONTACT */}
          <section id="contact" className="py-32 bg-gradient-to-b from-white to-[#FFF0F5]">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="max-w-[1300px] mx-auto px-6"
            >
              <div className="rounded-[40px] shadow-soft overflow-hidden flex flex-col md:flex-row min-h-[600px] border border-gray-100">
                {/* Form Side (White/Pink) */}
                <div className="p-10 md:p-16 w-full md:w-1/2 bg-white flex flex-col justify-center">
                  <h2 className="font-headline font-semibold text-2xl md:text-3xl text-puro-black mb-4 tracking-tight">{t.contact.title}</h2>
                  <p className="font-body text-gray-400 font-light tracking-wide text-base md:text-lg mb-12">{t.contact.intro}</p>

                  {submitStatus === 'success' ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center"
                    >
                      <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                      </div>
                      <h3 className="font-headline font-bold text-lg text-green-800 mb-2">{t.contact.form.successTitle}</h3>
                      <p className="font-body text-green-700">{t.contact.form.successMessage}</p>
                      <button
                        onClick={() => setSubmitStatus('idle')}
                        className="mt-6 text-sm font-bold text-green-600 hover:text-green-800 underline uppercase tracking-widest"
                      >
                        {t.contact.form.submitNew}
                      </button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleFormSubmit} className="space-y-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="font-body text-xs font-medium uppercase tracking-[0.2em] text-gray-400 pl-1 block">{t.contact.form.name}</label>
                          <input
                            name="name"
                            value={formData.name}
                            onChange={handleFormChange}
                            className="w-full bg-puro-inputBg border border-transparent p-4 rounded-xl text-sm focus:bg-white focus:border-puro-pastelPink/30 focus:ring-4 focus:ring-puro-softPink transition-all placeholder:text-gray-300 outline-none text-puro-black font-body font-medium"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="font-body text-xs font-medium uppercase tracking-[0.2em] text-gray-400 pl-1 block">{t.contact.form.phone}</label>
                          <input
                            name="phone"
                            value={formData.phone}
                            onChange={handleFormChange}
                            className="w-full bg-puro-inputBg border border-transparent p-4 rounded-xl text-sm focus:bg-white focus:border-puro-pastelPink/30 focus:ring-4 focus:ring-puro-softPink transition-all placeholder:text-gray-300 outline-none text-puro-black font-body font-medium"
                            required
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="font-body text-xs font-medium uppercase tracking-[0.2em] text-gray-400 pl-1 block">{t.contact.form.date}</label>
                          <div className="flex gap-2">
                            <input
                              name="date"
                              type="date"
                              value={formData.date}
                              onChange={handleFormChange}
                              required
                              className="w-full bg-puro-inputBg border border-transparent p-4 rounded-xl text-sm focus:bg-white focus:border-puro-pastelPink/30 focus:ring-4 focus:ring-puro-softPink transition-all text-puro-black outline-none font-body font-medium"
                            />
                            <select
                              name="time"
                              value={formData.time}
                              onChange={handleFormChange}
                              className="w-[120px] bg-puro-inputBg border border-transparent p-4 rounded-xl text-sm focus:bg-white focus:border-puro-pastelPink/30 focus:ring-4 focus:ring-puro-softPink transition-all text-puro-black outline-none font-body font-medium"
                            >
                              {Array.from({ length: 11 }).map((_, i) => {
                                const hour = i + 9; // 9:00 to 19:00
                                return (
                                  <React.Fragment key={i}>
                                    <option value={`${hour}:00`}>{hour}:00</option>
                                    <option value={`${hour}:30`}>{hour}:30</option>
                                  </React.Fragment>
                                );
                              })}
                            </select>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="font-body text-xs font-medium uppercase tracking-[0.2em] text-gray-400 pl-1 block">{t.contact.form.service}</label>
                          <select
                            name="service"
                            value={formData.service}
                            onChange={handleFormChange}
                            className="w-full bg-puro-inputBg border border-transparent p-4 rounded-xl text-sm focus:bg-white focus:border-puro-pastelPink/30 focus:ring-4 focus:ring-puro-softPink transition-all text-puro-black outline-none appearance-none font-body font-medium"
                          >
                            {t.services.salon.map(s => <option key={s.title} value={s.title}>{s.title}</option>)}
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="font-body text-xs font-medium uppercase tracking-[0.2em] text-gray-400 pl-1 block">{t.contact.form.message}</label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleFormChange}
                          rows={3}
                          required
                          className="w-full bg-puro-inputBg border border-transparent p-4 rounded-xl text-sm focus:bg-white focus:border-puro-pastelPink/30 focus:ring-4 focus:ring-puro-softPink transition-all placeholder:text-gray-300 outline-none resize-none text-puro-black font-body font-medium"
                        ></textarea>
                      </div>

                      <motion.button
                        type="submit"
                        disabled={submitStatus === 'loading'}
                        whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(255, 91, 160, 0.25)" }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full py-5 text-white font-headline font-medium rounded-2xl shadow-lg transition-all uppercase tracking-[0.15em] text-xs mt-4 flex items-center justify-center gap-2 ${submitStatus === 'loading' ? 'bg-gray-400 cursor-not-allowed shadow-none' : 'bg-puro-pink hover:bg-puro-pastelPink shadow-puro-pink/20'}`}
                      >
                        {submitStatus === 'loading' ? (
                          <>
                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            ENVIANDO...
                          </>
                        ) : t.contact.form.submit}
                      </motion.button>
                      {submitStatus === 'error' && (
                        <motion.p
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-500 text-xs text-center font-bold uppercase mt-4 tracking-wide bg-red-50 py-3 rounded-lg border border-red-100"
                        >
                          Erro ao enviar. Por favor, tente novamente ou use o WhatsApp.
                        </motion.p>
                      )}
                    </form>
                  )}
                </div>

                {/* Info Side (Dark/Gold) */}
                <div className="bg-[#1a1a1a] text-white p-10 md:p-16 w-full md:w-1/2 flex flex-col justify-between relative overflow-hidden">
                  {/* Soft Gold Glow */}
                  <motion.div
                    animate={{ opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute top-[-50px] right-[-50px] w-80 h-80 bg-puro-gold rounded-full filter blur-[120px] pointer-events-none"
                  ></motion.div>

                  <div className="relative z-10">
                    <h3 className="font-headline font-semibold text-3xl md:text-4xl mb-12 text-white tracking-tight">{t.contact.infoTitle}</h3>

                    <div className="space-y-12">
                      <motion.div whileHover={{ x: 10 }} className="flex items-start gap-6 group cursor-default">
                        <a href={`tel:${(websiteInfo.contact_phone || '+258864252968').replace(/[^0-9+]/g, '')}`} className="bg-white/5 p-4 rounded-2xl text-puro-gold group-hover:bg-puro-gold group-hover:text-white transition-all duration-300 border border-white/10 flex items-center justify-center">
                          <Phone size={24} strokeWidth={1.5} />
                        </a>
                        <div>
                          <p className="font-headline text-[10px] font-bold uppercase tracking-[0.25em] text-puro-gold mb-3">{t.contact.info.call}</p>
                          <p className="font-body text-xl md:text-2xl font-light tracking-wide">{websiteInfo.contact_phone || '+258 84 892 0837'}</p>
                        </div>
                      </motion.div>

                      <motion.div whileHover={{ x: 10 }} className="flex items-start gap-6 group cursor-pointer">
                        <div className="bg-white/5 p-4 rounded-2xl text-puro-gold group-hover:bg-puro-gold group-hover:text-white transition-all duration-300 border border-white/10"><Instagram size={24} strokeWidth={1.5} /></div>
                        <div>
                          <p className="font-headline text-[10px] font-bold uppercase tracking-[0.25em] text-puro-gold mb-3">{t.contact.info.follow}</p>
                          <a href={websiteInfo.instagram_url || "https://instagram.com/purocharme20229"} target="_blank" className="font-body text-xl md:text-2xl hover:text-puro-gold transition-colors tracking-wide font-light">@purocharme20229</a>
                        </div>
                      </motion.div>

                      <motion.div whileHover={{ x: 10 }} className="flex items-start gap-6 group cursor-default">
                        <div className="bg-white/5 p-4 rounded-2xl text-puro-gold group-hover:bg-puro-gold group-hover:text-white transition-all duration-300 border border-white/10"><MapPin size={24} strokeWidth={1.5} /></div>
                        <div>
                          <p className="font-headline text-[10px] font-bold uppercase tracking-[0.25em] text-puro-gold mb-3">{t.contact.info.visit}</p>
                          <p className="font-body text-lg md:text-xl tracking-wide font-light">Cuamba, Niassa</p>
                          <p className="text-sm text-gray-400 mt-2 font-body font-light tracking-wide">Moçambique</p>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </section>
        </>
      ) : (
        <section className="pt-40 pb-20 min-h-[80vh] bg-white">
          <div className="max-w-4xl mx-auto px-6">
            <h1 className="font-headline font-bold text-3xl md:text-5xl text-puro-black mb-12">{activePage === 'privacy' ? t.legal.privacy.title : t.legal.terms.title}</h1>
            <div className="space-y-6 text-puro-text leading-relaxed font-body">
              {(activePage === 'privacy' ? t.legal.privacy.content : t.legal.terms.content).map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
            <button
              onClick={() => { setActivePage('home'); window.scrollTo({ top: 0, behavior: 'instant' }); }}
              className="mt-12 px-8 py-3 bg-gray-100 text-puro-black rounded-full font-headline font-semibold text-xs uppercase tracking-widest hover:bg-puro-pastelPink hover:text-white transition-colors"
            >
              Voltar / Back
            </button>
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-100 pt-20 pb-10">
        <div className="max-w-[1300px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            {/* LOGO & DESC */}
            <div className="col-span-1 md:col-span-2 lg:col-span-2 pr-8">
              <div className="mb-6">
                <img
                  src="/assets/img/logo-pink.png"
                  alt="Puro Charme"
                  onClick={() => { setActivePage('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="h-14 md:h-16 w-auto object-contain hover:opacity-100 transition-opacity cursor-pointer"
                  loading="lazy"
                />
              </div>
              <p className="text-gray-400 leading-relaxed text-sm mb-4 font-body max-w-sm">{t.footer.desc}</p>

              {/* Email Link (Simple Text) */}
              <a
                href={`mailto:${websiteInfo.contact_email || 'info@pcharme.niassa.site'}`}
                className="block text-gray-400 font-body text-sm mb-8 hover:text-puro-pink transition-colors w-fit"
              >
                {websiteInfo.contact_email || 'info@pcharme.niassa.site'}
              </a>

              <div className="flex gap-4">
                <motion.a
                  whileHover={{ scale: 1.1, backgroundColor: "#FF5BA0", color: "#ffffff", borderColor: "#FF5BA0" }}
                  href="https://wa.me/258848920837"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="w-11 h-11 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 shadow-sm transition-all duration-300"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.1, backgroundColor: "#FF5BA0", color: "#ffffff", borderColor: "#FF5BA0" }}
                  href="https://instagram.com/purocharme20229"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 shadow-sm transition-all duration-300"
                >
                  <Instagram size={18} />
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.1, backgroundColor: "#FF5BA0", color: "#ffffff", borderColor: "#FF5BA0" }}
                  href="tel:+258864252968"
                  className="w-11 h-11 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 shadow-sm transition-all duration-300"
                >
                  <Phone size={18} />
                </motion.a>
              </div>
            </div>

            {/* EXPLORE COLUMN */}
            <div className="lg:pl-8">
              <h4 className="font-headline font-bold text-xs uppercase tracking-[0.2em] mb-8 text-puro-black">{t.footer.explore}</h4>
              <ul className="space-y-4 text-sm text-gray-500 font-body font-medium">
                {Object.entries(t.nav).map(([key, label]) => (
                  <li key={key}>
                    <button
                      onClick={() => { setActivePage('home'); setTimeout(() => scrollTo(key), 100); }}
                      className="hover:text-puro-pastelPink hover:translate-x-2 transition-all duration-300 flex items-center gap-2 text-left"
                    >
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* OPENING HOURS COLUMN */}
            <div>
              <h4 className="font-headline font-bold text-xs uppercase tracking-[0.2em] mb-8 text-puro-black">{t.footer.openingHours.title}</h4>
              <ul className="space-y-4 text-sm text-gray-500 font-body font-medium">
                {t.footer.openingHours.weekdays && (
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-puro-pastelPink mt-1.5"></span>
                    {t.footer.openingHours.weekdays}
                  </li>
                )}
                {t.footer.openingHours.saturday && (
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-puro-pastelPink mt-1.5"></span>
                    {t.footer.openingHours.saturday}
                  </li>
                )}
                {t.footer.openingHours.sunday && (
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-1.5"></span>
                    {t.footer.openingHours.sunday}
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* BOTTOM FOOTER */}
          <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center text-[11px] text-gray-400 font-body tracking-wide">
            <p className="opacity-80">{t.footer.rights}</p>
            <div className="flex gap-8 mt-4 md:mt-0 opacity-80">
              <button
                onClick={() => { setActivePage('privacy'); window.scrollTo({ top: 0, behavior: 'instant' }); }}
                className="hover:text-puro-pastelPink transition-colors"
              >
                {t.legal.privacy.title}
              </button>
              <button
                onClick={() => { setActivePage('terms'); window.scrollTo({ top: 0, behavior: 'instant' }); }}
                className="hover:text-puro-pastelPink transition-colors"
              >
                {t.legal.terms.title}
              </button>
            </div>
          </div>
        </div>
      </footer>

      <CustomCursor />
      <WhatsAppButton />
    </div>
  );
};

export default MainSite;