import React from 'react';
import Hero from '../components/Hero';
import Stats from '../components/Stats';
import About from '../components/About';
import Location from '../components/Location';
import Sponsors from '../components/Sponsors';
import Testimonials from '../components/Testimonials';
import { useSettings } from '../contexts/SettingsContext'; // New import

const HomePage: React.FC = () => {
  const { settings, isLoading: settingsLoading } = useSettings(); // New: Get settings and their loading state
  const sponsorText = "Votre entreprise souhaite s'associer à l'Africa Power Platform et bénéficier d'une visibilité unique auprès de professionnels ? Devenez sponsor !";
  const sponsorButton = settings.sponsor_form_link ? (
    <a 
      href={settings.sponsor_form_link} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="mt-6 inline-block bg-white text-brand-green font-bold py-3 px-8 rounded-full shadow-lg hover:bg-gray-200 transition-all duration-300 transform hover:scale-105"
    >
      Devenir Sponsor
    </a>
  ) : null;

  return (
    <main>
      <Hero>
        {/* Display button always for diagnosis */}
        <div className="mt-8 mb-12"> {/* Added margin-bottom for spacing */}
            <p className="text-lg text-gray-300 mb-4 px-4 max-w-2xl mx-auto">
                {sponsorText}
            </p>
            {sponsorButton || <p className="text-red-300">Lien Sponsor non configuré dans l'administration.</p>}
        </div>
      </Hero>
      <Stats />
      <About />
      <Location />
      <Sponsors />
      <Testimonials />
    </main>
  );
};

export default HomePage;