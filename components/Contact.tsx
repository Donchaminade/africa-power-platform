
import React from 'react';
import { useTranslation } from '../contexts/LanguageContext';

const Contact: React.FC = () => {
    const { t } = useTranslation();
    return (
        <section id="contact" className="py-24 bg-gradient-to-b from-white to-gray-50 dark:from-black dark:to-gray-900">
            <div className="max-w-4xl mx-auto px-6 text-center">
                <span className="text-brand-green font-semibold text-sm tracking-widest uppercase">{t('contact.pre_title')}</span>
                <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
                    {t('contact.title_part1')} <span className="text-brand-green">{t('contact.title_part2')}</span>
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-lg mb-8">
                    {t('contact.description')}
                </p>

                <form className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
                    <input
                        type="email"
                        placeholder={t('contact.placeholder')}
                        className="flex-1 px-6 py-4 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:border-brand-green focus:outline-none transition-colors"
                    />
                    <button type="submit" className="bg-brand-green text-white px-8 py-4 rounded-full font-bold hover:bg-green-700 transition-colors whitespace-nowrap">
                        {t('contact.button')} <i className="fas fa-paper-plane ml-2"></i>
                    </button>
                </form>

                <div className="flex justify-center gap-6 mt-12">
                     <a href="#" className="w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center hover:bg-brand-green hover:text-white transition-all duration-300 hover:-translate-y-1"><i className="fab fa-linkedin-in"></i></a>
                    <a href="#" className="w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center hover:bg-brand-green hover:text-white transition-all duration-300 hover:-translate-y-1"><i className="fab fa-facebook-f"></i></a>
                    <a href="#" className="w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center hover:bg-brand-green hover:text-white transition-all duration-300 hover:-translate-y-1"><i className="fab fa-twitter"></i></a>
                </div>
            </div>
        </section>
    );
};

export default Contact;
