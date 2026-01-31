import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../contexts/LanguageContext';
import { useSettings } from '../contexts/SettingsContext'; // Import useSettings

interface HeroProps {
    children?: React.ReactNode; // New: Allows passing child elements
}

const Hero: React.FC<HeroProps> = ({ children }) => { // Added children as prop
  const { t, language } = useTranslation();
  const { settings, isLoading: settingsLoading, error: settingsError } = useSettings(); // Get settings from context

  const calculateTimeLeft = (eventDateString: string) => {
    // Assuming eventDateString is in 'YYYY-MM-DD' format
    // Convert to a compatible Date object, e.g., 'YYYY-MM-DDTHH:mm:ss' or 'MM/DD/YYYY'
    const eventDate = new Date(`${eventDateString}T09:00:00Z`).getTime(); // Assuming 9 AM UTC
    const now = new Date().getTime();
    const difference = eventDate - now;

    let timeLeft = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(settings?.event_date || '')); // Initialize with settings date

  useEffect(() => {
    // Recalculate if settings.event_date changes
    if (settings?.event_date) {
      setTimeLeft(calculateTimeLeft(settings.event_date));
    }

    const timer = setInterval(() => {
      if (settings?.event_date) {
        setTimeLeft(calculateTimeLeft(settings.event_date));
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [settings?.event_date]); // Depend on settings.event_date

  const countdownUnits = {
      days: t('hero.countdown.days'),
      hours: t('hero.countdown.hours'),
      minutes: t('hero.countdown.minutes'),
      seconds: t('hero.countdown.seconds'),
  }

  // Display loading or error state for settings
  if (settingsLoading) {
    return <div>Chargement de la section Hero...</div>;
  }

  if (settingsError) {
    return <div>Erreur de chargement de la section Hero: {settingsError}</div>;
  }

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-black grid-bg">
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black"></div>
      <div className="max-w-7xl mx-auto px-6 py-32 relative z-10 text-center">
        <div className="mb-8">
          <span className="inline-block bg-brand-green text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <i className="fas fa-calendar-alt mr-2"></i>
            {settings?.event_date ? new Date(settings.event_date).toLocaleDateString(language) : t('hero.date_placeholder')}
            {settings?.event_venue && ` | ${settings.event_venue}`}
          </span>
        </div>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight text-white">
          {t('hero.title').split(' ')[0]} <span className="text-brand-green">{t('hero.title').split(' ').slice(1).join(' ')}</span>
        </h1>
        <h2 className="text-2xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-white via-green-300 to-white bg-clip-text text-transparent">
          {t('hero.subtitle')}
        </h2>
        <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-12">
          {t('hero.description')}
        </p>

        <div className="flex justify-center gap-4 md:gap-8 mb-12">
          {Object.entries(timeLeft).map(([unit, value]) => (
            <div key={unit} className="p-4 md:p-6 rounded-xl border border-gray-800 min-w-[80px] bg-black/30 backdrop-blur-sm">
              <span className="text-3xl md:text-5xl font-bold text-brand-green">{String(value).padStart(2, '0')}</span>
              <p className="text-xs md:text-sm text-gray-400 mt-2 capitalize">{countdownUnits[unit as keyof typeof countdownUnits]}</p>
            </div>
          ))}
        </div>

        {children} {/* New: Render children here */}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/register" className="bg-brand-green text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-green-700 transition-all hover:scale-105">
            <i className="fas fa-ticket-alt mr-2"></i>{t('hero.register_button')}
          </Link>
          <a href="#about" className="border-2 border-white text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-black transition-all">
            <i className="fas fa-info-circle mr-2"></i>{t('hero.discover_button')}
          </a>
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <i className="fas fa-chevron-down text-2xl text-gray-400"></i>
      </div>
    </section>
  );
};

export default Hero;