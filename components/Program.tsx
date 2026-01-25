import React, { useState, useEffect } from 'react';
import { useTranslation } from '../contexts/LanguageContext';
import { ProgramItem } from '../utils/types';
import { API_URL } from '../utils/config';

const Program: React.FC = () => {
    const { t, language } = useTranslation();
    const [programItems, setProgramItems] = useState<ProgramItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProgram = async () => {
            try {
                const response = await fetch(`${API_URL}/program`);
                if (!response.ok) {
                    throw new Error('Failed to fetch program data.');
                }
                const data: ProgramItem[] = await response.json();
                setProgramItems(data.filter(item => item.is_active));
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProgram();
    }, []);

    const Timeline: React.FC<{ items: ProgramItem[] }> = ({ items }) => (
        <div className="relative border-l-2 border-brand-green/30 pl-8 space-y-12">
            {items.map((item) => (
                <div key={item.id} className="relative group transition-transform duration-300 hover:scale-[1.02]">
                    <div className="absolute -left-[38px] top-1 w-4 h-4 bg-brand-green rounded-full border-4 border-white dark:border-black group-hover:bg-green-400 transition-colors"></div>
                    <span className="inline-block bg-brand-green/20 text-brand-green px-3 py-1 rounded-full text-sm font-semibold mb-2">
                        {item.start_time.substring(0, 5)} - {item.end_time.substring(0, 5)}
                    </span>
                    <h4 className="text-xl font-bold flex items-center gap-3">
                        <i className={`${item.icon_class || 'fas fa-calendar-check'} text-brand-green/80 w-5 text-center`}></i>
                        <span>{language === 'fr' ? item.title_fr : item.title_en}</span>
                    </h4>
                    <p className="text-gray-500 dark:text-gray-400 mt-1 pl-10">
                        {language === 'fr' ? item.description_fr : item.description_en}
                    </p>
                </div>
            ))}
             {items.length === 0 && !isLoading && <p className="text-gray-500">Le programme pour cette journée sera bientôt disponible.</p>}
        </div>
    );

    return (
        <section id="program" className="py-24 bg-gradient-to-b from-white via-gray-50 to-white dark:from-black dark:via-gray-900 dark:to-black">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <span className="text-brand-green font-semibold text-sm tracking-widest uppercase">{t('program.pre_title')}</span>
                    <h2 className="text-4xl md:text-5xl font-bold mt-4">
                        {t('program.title')}
                    </h2>
                </div>

                {isLoading && <div className="text-center">Chargement du programme...</div>}
                {error && <div className="text-center text-red-500">Erreur: {error}</div>}

                {!isLoading && !error && (
                    <div className="grid md:grid-cols-2 gap-x-16 gap-y-8">
                        <div>
                            <h3 className="text-3xl font-bold text-center mb-8">
                                <span className="text-brand-green">{t('program.day1_title')}</span> {t('program.day1_subtitle')}
                            </h3>
                            <Timeline items={programItems.filter(i => i.day === 1)} />
                        </div>
                        <div>
                             <h3 className="text-3xl font-bold text-center mb-8">
                                <span className="text-brand-green">{t('program.day2_title')}</span> {t('program.day2_subtitle')}
                            </h3>
                            <Timeline items={programItems.filter(i => i.day === 2)} />
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Program;