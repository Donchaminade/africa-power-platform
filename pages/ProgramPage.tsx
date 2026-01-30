import React, { useState, useEffect } from 'react';
import PageHero from '../components/ui/PageHero';
import { ProgramItem } from '../utils/types';
import { API_URL } from '../admin/config';

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
                    <span>{item.title_fr}</span>
                </h4>
                <p className="text-gray-500 dark:text-gray-400 mt-1 pl-10">
                    {item.description_fr}
                </p>
            </div>
        ))}
         {items.length === 0 && <p className="text-gray-500">Le programme pour cette journée sera bientôt disponible.</p>}
    </div>
);

const ProgramPage: React.FC = () => {
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

    return (
        <div>
            <PageHero
                title={<>Programme de l'<span className="text-brand-green">Événement</span></>}
                subtitle="Deux jours d'apprentissage, d'inspiration et de networking."
            />
            <section className="py-24 bg-white dark:bg-black">
                <div className="max-w-7xl mx-auto px-6">
                    {isLoading && <div className="text-center">Chargement du programme...</div>}
                    {error && <div className="text-center text-red-500">Erreur: {error}</div>}

                    {!isLoading && !error && (
                        <div className="grid md:grid-cols-2 gap-x-16 gap-y-8">
                            <div>
                                <h3 className="text-3xl font-bold text-center mb-8">
                                    <span className="text-brand-green">Jour 1:</span> Conférence
                                </h3>
                                <Timeline items={programItems.filter(i => i.day === 1)} />
                            </div>
                            <div>
                                 <h3 className="text-3xl font-bold text-center mb-8">
                                    <span className="text-brand-green">Jour 2:</span> Bootcamp
                                </h3>
                                <Timeline items={programItems.filter(i => i.day === 2)} />
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default ProgramPage;
