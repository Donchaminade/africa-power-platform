
import React, { useState } from 'react';
import { useTranslation } from '../contexts/LanguageContext';

interface FaqItemProps {
  question: string;
  answer: string;
}

const FaqItem: React.FC<FaqItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

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
  const faqItems = t('faq.items') as unknown as { q: string, a: string }[];

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
        <div className="space-y-2">
          {faqItems.map((item, index) => (
            <FaqItem key={index} question={item.q} answer={item.a} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faq;
