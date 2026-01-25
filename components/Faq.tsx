import React, { useState, useEffect } from 'react';
import { useTranslation } from '../contexts/LanguageContext';
import { Faq as FaqType } from '../utils/types';
import { API_URL } from '../utils/config';

interface FaqItemProps {
  faq: FaqType;
}

const FaqItem: React.FC<FaqItemProps> = ({ faq }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { language } = useTranslation();

  const question = language === 'fr' ? faq.question_fr : faq.question_en;
  const answer = language === 'fr' ? faq.answer_fr : faq.answer_en;

  return (
    <div className="border-b border-gray-200 dark:border-gray-800">
      <button
        className="w-full flex justify-between items-center text-left py-6"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <h3 className="text-lg font-semibold">{question}</h3>
        <div className={`transform transition-transform duration-300 ${isOpen ? 'rotate-45' : 'rotate-0'}`}>
          <i className="fas fa-plus text-brand-green"></i>
        </div>
      </button>
      <div
        className="grid transition-all duration-500 ease-in-out"
        style={{
          gridTemplateRows: isOpen ? '1fr' : '0fr',
        }}
      >
        <div className="overflow-hidden">
          <p className="pb-6 text-gray-600 dark:text-gray-300 leading-relaxed">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
};

const Faq: React.FC = () => {
  const { t } = useTranslation();
  const [faqItems, setFaqItems] = useState<FaqType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
      const fetchFaqs = async () => {
          try {
              const response = await fetch(`${API_URL}/faq`);
              if (!response.ok) {
                  throw new Error('Failed to fetch FAQ data.');
              }
              const data: FaqType[] = await response.json();
              setFaqItems(data.filter(f => f.is_active));
          } catch (err) {
              setError(err instanceof Error ? err.message : 'An unknown error occurred');
          } finally {
              setIsLoading(false);
          }
      };

      fetchFaqs();
  }, []);

  return (
    <section id="faq" className="py-24 bg-gradient-to-b from-white via-gray-50 to-white dark:from-black dark:via-gray-900 dark:to-black">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-brand-green font-semibold text-sm tracking-widest uppercase">{t('faq.pre_title')}</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4">
            {t('faq.title_part1')} <span className="text-brand-green">{t('faq.title_part2')}</span>
          </h2>
           <p className="text-gray-500 dark:text-gray-400 mt-4 max-w-2xl mx-auto">
            {t('faq.description')}
          </p>
        </div>
        
        {isLoading && <div className="text-center">Chargement de la FAQ...</div>}
        {error && <div className="text-center text-red-500">Erreur: {error}</div>}

        {!isLoading && !error && (
            <div className="space-y-2">
              {faqItems.map((item) => (
                <FaqItem key={item.id} faq={item} />
              ))}
            </div>
        )}
        {!isLoading && !error && faqItems.length === 0 && (
            <p className="text-center text-gray-500">Aucune question fréquente pour le moment.</p>
        )}
      </div>
    </section>
  );
};

export default Faq;