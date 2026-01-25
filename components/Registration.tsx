
import React from 'react';
import { useTranslation } from '../contexts/LanguageContext';

const Registration: React.FC = () => {
    const { t } = useTranslation();
    return (
        <section id="register" className="py-24 bg-white dark:bg-black">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <span className="text-brand-green font-semibold text-sm tracking-widest uppercase">{t('registration.pre_title')}</span>
                    <h2 className="text-4xl md:text-5xl font-bold mt-4">
                        {t('registration.title')}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-4 max-w-2xl mx-auto">
                        {t('registration.description')}
                    </p>
                </div>
                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {/* Pass Conférence */}
                    <div className="rounded-2xl p-8 border border-gray-200 dark:border-gray-800 transition-all duration-300 hover:border-brand-green bg-gray-50 dark:bg-gray-900/50 hover:-translate-y-2 hover:shadow-xl dark:hover:shadow-brand-green/10">
                        <h3 className="text-xl font-bold mb-2">{t('registration.pass1_title')}</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">{t('registration.pass1_subtitle')}</p>
                        <div className="mb-6"><span className="text-5xl font-black">{t('registration.price')}</span></div>
                        <ul className="space-y-3 mb-8 text-left">
                            <li className="flex items-center gap-3"><i className="fas fa-check text-green-500"></i><span>{t('registration.pass1_feature1')}</span></li>
                            <li className="flex items-center gap-3"><i className="fas fa-check text-green-500"></i><span>{t('registration.pass1_feature2')}</span></li>
                            <li className="flex items-center gap-3"><i className="fas fa-check text-green-500"></i><span>{t('registration.pass1_feature3')}</span></li>
                        </ul>
                        <button className="w-full py-3 border-2 border-gray-900 dark:border-white rounded-full font-semibold hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-all">{t('registration.pass1_button')}</button>
                    </div>
                    {/* Pass Complet */}
                    <div className="rounded-2xl p-8 border-2 border-brand-green relative transition-all duration-300 transform md:scale-105 bg-gray-50 dark:bg-gray-900 hover:scale-110 hover:shadow-2xl dark:hover:shadow-brand-green/25">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-green text-white px-4 py-1 rounded-full text-sm font-bold">{t('registration.pass2_tag')}</div>
                        <h3 className="text-xl font-bold mb-2">{t('registration.pass2_title')}</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">{t('registration.pass2_subtitle')}</p>
                        <div className="mb-6"><span className="text-5xl font-black text-brand-green">{t('registration.price')}</span></div>
                        <ul className="space-y-3 mb-8 text-left">
                           <li className="flex items-center gap-3"><i className="fas fa-check text-green-500"></i><span>{t('registration.pass2_feature1')}</span></li>
                           <li className="flex items-center gap-3"><i className="fas fa-check text-green-500"></i><span>{t('registration.pass2_feature2')}</span></li>
                           <li className="flex items-center gap-3"><i className="fas fa-check text-green-500"></i><span>{t('registration.pass2_feature3')}</span></li>
                        </ul>
                        <button className="w-full py-3 bg-brand-green text-white rounded-full font-semibold hover:bg-green-700 transition-all">{t('registration.pass2_button')}</button>
                    </div>
                    {/* Pass Bootcamp */}
                    <div className="rounded-2xl p-8 border border-gray-200 dark:border-gray-800 transition-all duration-300 hover:border-brand-green bg-gray-50 dark:bg-gray-900/50 hover:-translate-y-2 hover:shadow-xl dark:hover:shadow-brand-green/10">
                        <h3 className="text-xl font-bold mb-2">{t('registration.pass3_title')}</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">{t('registration.pass3_subtitle')}</p>
                        <div className="mb-6"><span className="text-5xl font-black">{t('registration.price')}</span></div>
                        <ul className="space-y-3 mb-8 text-left">
                             <li className="flex items-center gap-3"><i className="fas fa-check text-green-500"></i><span>{t('registration.pass3_feature1')}</span></li>
                             <li className="flex items-center gap-3"><i className="fas fa-check text-green-500"></i><span>{t('registration.pass3_feature2')}</span></li>
                             <li className="flex items-center gap-3"><i className="fas fa-check text-green-500"></i><span>{t('registration.pass3_feature3')}</span></li>
                        </ul>
                        <button className="w-full py-3 border-2 border-gray-900 dark:border-white rounded-full font-semibold hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-all">{t('registration.pass3_button')}</button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Registration;