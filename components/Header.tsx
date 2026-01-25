import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from '../contexts/LanguageContext';
import { useSettings } from '../contexts/SettingsContext'; // Import useSettings

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useTranslation();
  const { settings, isLoading: settingsLoading, error: settingsError } = useSettings(); // Get settings from context

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#about', label: t('nav.about') },
    { href: '#speakers', label: t('nav.speakers') },
    { href: '#program', label: t('nav.program') },
    { href: '#register', label: t('nav.register') },
    { href: '#team', label: t('nav.team') },
    { href: '#gallery', label: "Galerie" }, // Added Gallery Link
    { href: '#faq', label: t('nav.faq') },
  ];

  const renderNavLinks = (isMobile = false) => navLinks.map(link => (
      <a key={link.href} href={link.href} className={`hover:text-brand-green transition-colors ${isMobile ? 'text-lg py-2' : ''}`} onClick={() => setIsMenuOpen(false)}>
          {link.label}
      </a>
  ));

  const controlButtons = (
    <div className="flex items-center gap-4">
        <button
            onClick={toggleLanguage}
            className="w-10 h-10 rounded-full flex items-center justify-center font-semibold bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle language"
        >
            {language === 'fr' ? 'EN' : 'FR'}
        </button>
        <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle theme"
        >
            {theme === 'light' ? <i className="fas fa-moon"></i> : <i className="fas fa-sun"></i>}
        </button>
    </div>
  );

  // Display loading or error state for settings
  if (settingsLoading) {
    return <div>Chargement de l'en-tête...</div>; // Or a skeleton loader
  }

  if (settingsError) {
    return <div>Erreur de chargement de l'en-tête: {settingsError}</div>; // Or a fallback header
  }

  return (
    <>
      <header
        id="navbar"
        className={`
          fixed top-4 z-50 transition-all duration-300
          w-[95%] md:w-[90%] xl:w-4/5 2xl:max-w-7xl left-1/2 -translate-x-1/2
          bg-white/80 dark:bg-black/80 backdrop-blur-lg
          rounded-full
          border border-gray-200/80 dark:border-gray-800/80
          ${isScrolled ? 'shadow-xl dark:shadow-brand-green/10' : 'shadow-lg dark:shadow-brand-green/5'}
        `}
      >
        <div className="flex items-center justify-between px-6 py-2">
          <a href="#" className="flex-shrink-0" aria-label="Africa Power Platform Home">
             {settings?.event_logo_url ? (
                 <img src={settings.event_logo_url} alt="Event Logo" className="h-10 w-auto" />
             ) : (
                 // Fallback SVG or text if logo not available
                 <svg className="h-10 w-auto" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M26 0C11.64 0 0 11.64 0 26s11.64 26 26 26 26-11.64 26-26S40.36 0 26 0zm-2 49.86C12.05 49.37 4 38.65 4 26S12.05 2.63 24 2.14v47.72zm4-47.72c11.95.49 20 11.21 20 23.86s-8.05 23.37-20 23.86V2.14z" fill="currentColor" className="text-brand-green"/>
                 </svg>
             )}
          </a>
          <div className="hidden md:flex items-center gap-8">
            {renderNavLinks()}
            <a href="#contact" className="bg-brand-green text-white px-6 py-2 rounded-full font-semibold hover:bg-green-700 transition-colors">{t('nav.contact')}</a>
            {controlButtons}
          </div>
          <button id="mobile-menu-btn" className="md:hidden text-2xl ml-4" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <i className={isMenuOpen ? "fas fa-times" : "fas fa-bars"}></i>
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div
          id="mobile-menu"
          className="
            md:hidden fixed top-24 z-40 w-[95%] left-1/2 -translate-x-1/2
            bg-white/95 dark:bg-black/95 backdrop-blur-lg
            rounded-2xl border border-gray-200/50 dark:border-gray-800/50
            shadow-xl
          "
        >
          <div className="px-6 py-4 flex flex-col items-center gap-6">
            {renderNavLinks(true)}
            <a href="#contact" className="bg-brand-green text-white w-full mt-2 px-6 py-3 rounded-full font-semibold text-center" onClick={() => setIsMenuOpen(false)}>{t('nav.contact')}</a>
            <div className="self-center pt-2">
             {controlButtons}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;