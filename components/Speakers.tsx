
import React from 'react';
import { useTranslation } from '../contexts/LanguageContext';

interface Speaker {
  name: string;
  title: string;
  category: string;
  image: string;
}

const speakers: Speaker[] = [
  { name: 'Adama Traoré', title: 'MVP, Power BI Expert', category: 'Data & Analytics', image: 'https://picsum.photos/400/500?random=10' },
  { name: 'Fatou Diop', title: 'CEO, SahelInnov', category: 'Entrepreneuriat', image: 'https://picsum.photos/400/500?random=11' },
  { name: 'David Okoro', title: 'Consultant Dynamics 365', category: 'Business Apps', image: 'https://picsum.photos/400/500?random=12' },
  { name: 'Aisha Bello', title: 'Fondatrice, Tech4Her', category: 'Impact Social', image: 'https://picsum.photos/400/500?random=13' },
];

const SpeakerCard: React.FC<{ speaker: Speaker }> = ({ speaker }) => (
  <div className="group relative rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300">
    <img src={speaker.image} alt={speaker.name} className="w-full aspect-[3/4] object-cover transition-transform duration-500 group-hover:scale-110" />
    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent opacity-80 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
      <span className="text-brand-green text-sm font-semibold">{speaker.category}</span>
      <h3 className="text-xl font-bold mt-1 text-white">{speaker.name}</h3>
      <p className="text-gray-300 text-sm">{speaker.title}</p>
      <div className="flex gap-4 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <a href="#" aria-label={`${speaker.name}'s Twitter`} className="w-8 h-8 rounded-full flex items-center justify-center bg-white/20 text-white hover:bg-brand-green transition-colors"><i className="fab fa-twitter"></i></a>
        <a href="#" aria-label={`${speaker.name}'s LinkedIn`} className="w-8 h-8 rounded-full flex items-center justify-center bg-white/20 text-white hover:bg-brand-green transition-colors"><i className="fab fa-linkedin"></i></a>
      </div>
    </div>
  </div>
);

const Speakers: React.FC = () => {
  const { t } = useTranslation();
  return (
    <section id="speakers" className="py-24 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-brand-green font-semibold text-sm tracking-widest uppercase">{t('speakers.pre_title')}</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4">
            {t('speakers.title_part1')} <span className="text-brand-green">{t('speakers.title_part2')}</span> {t('speakers.title_part3')}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-4 max-w-2xl mx-auto">
            {t('speakers.description')}
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {speakers.map((speaker, index) => <SpeakerCard key={index} speaker={speaker} />)}
        </div>
      </div>
    </section>
  );
};

export default Speakers;
