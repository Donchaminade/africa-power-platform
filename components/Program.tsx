
import React from 'react';
import { useTranslation } from '../contexts/LanguageContext';

const programItems = [
    { day: 1, time: "11:00 - 12:00", title: "Keynote d'Ouverture", description: "Vision et opportunités de la Power Platform en Afrique.", icon: "fas fa-bullhorn" },
    { day: 1, time: "12:00 - 13:30", title: "Panel: Transformation Digitale", description: "Cas d'usages concrets dans les services publics et l'agriculture.", icon: "fas fa-users" },
    { day: 1, time: "13:30 - 14:30", title: "Pause Déjeuner & Networking", description: "Échanges avec les speakers et participants.", icon: "fas fa-coffee" },
    { day: 1, time: "14:30 - 17:00", title: "Sessions Techniques", description: "Ateliers sur Power Apps, Power BI, et Copilot Studio.", icon: "fas fa-code" },
    { day: 2, time: "10:00 - 13:00", title: "Bootcamp: Idéation & Design", description: "Concevoir une solution low-code pour un défi local.", icon: "fas fa-lightbulb" },
    { day: 2, time: "13:00 - 14:00", title: "Pause & Mentorat", description: "Déjeuner et sessions de coaching avec des experts.", icon: "fas fa-handshake" },
    { day: 2, time: "14:00 - 16:30", title: "Bootcamp: Développement", description: "Co-création et prototypage des solutions.", icon: "fas fa-cogs" },
    { day: 2, time: "16:30 - 17:00", title: "Présentation & Clôture", description: "Démonstration des projets et remise des prix.", icon: "fas fa-trophy" }
];

const Program: React.FC = () => {
    const { t } = useTranslation();
    return (
        <section id="program" className="py-24 bg-gradient-to-b from-white via-gray-50 to-white dark:from-black dark:via-gray-900 dark:to-black">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <span className="text-brand-green font-semibold text-sm tracking-widest uppercase">{t('program.pre_title')}</span>
                    <h2 className="text-4xl md:text-5xl font-bold mt-4">
                        {t('program.title')}
                    </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-x-16 gap-y-8">
                    <div>
                        <h3 className="text-3xl font-bold text-center mb-8"><span className="text-brand-green">{t('program.day1_title')}</span> {t('program.day1_subtitle')}</h3>
                        <div className="relative border-l-2 border-brand-green/30 pl-8 space-y-12">
                            {programItems.filter(i => i.day === 1).map((item, index) => (
                                <div key={index} className="relative group transition-transform duration-300 hover:scale-[1.02]">
                                    <div className="absolute -left-[38px] top-1 w-4 h-4 bg-brand-green rounded-full border-4 border-white dark:border-black group-hover:bg-green-400 transition-colors"></div>
                                    <span className="inline-block bg-brand-green/20 text-brand-green px-3 py-1 rounded-full text-sm font-semibold mb-2">{item.time}</span>
                                    <h4 className="text-xl font-bold flex items-center gap-3">
                                        <i className={`${item.icon} text-brand-green/80 w-5 text-center`}></i>
                                        <span>{item.title}</span>
                                    </h4>
                                    <p className="text-gray-500 dark:text-gray-400 mt-1 pl-10">{item.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h3 className="text-3xl font-bold text-center mb-8"><span className="text-brand-green">{t('program.day2_title')}</span> {t('program.day2_subtitle')}</h3>
                        <div className="relative border-l-2 border-brand-green/30 pl-8 space-y-12">
                            {programItems.filter(i => i.day === 2).map((item, index) => (
                                <div key={index} className="relative group transition-transform duration-300 hover:scale-[1.02]">
                                    <div className="absolute -left-[38px] top-1 w-4 h-4 bg-brand-green rounded-full border-4 border-white dark:border-black group-hover:bg-green-400 transition-colors"></div>
                                    <span className="inline-block bg-brand-green/20 text-brand-green px-3 py-1 rounded-full text-sm font-semibold mb-2">{item.time}</span>
                                    <h4 className="text-xl font-bold flex items-center gap-3">
                                       <i className={`${item.icon} text-brand-green/80 w-5 text-center`}></i>
                                       <span>{item.title}</span>
                                    </h4>
                                    <p className="text-gray-500 dark:text-gray-400 mt-1 pl-10">{item.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Program;