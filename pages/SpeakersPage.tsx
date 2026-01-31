import React, { useState, useEffect } from 'react';
import PageHero from '../components/ui/PageHero';
import { Speaker } from '../utils/types';
import { API_URL, UPLOADS_URL } from '../utils/config';

const SpeakerCard: React.FC<{ speaker: Speaker }> = ({ speaker }) => {
    const getFullImageUrl = (path: string) => {
        if (!path) return ''; // or a placeholder image
        if (path.startsWith('http')) return path;
        return `${UPLOADS_URL}${path}`;
    };

    return (
        <div className="group relative rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300">
            <img src={getFullImageUrl(speaker.image_url)} alt={speaker.name} className="w-full aspect-[3/4] object-cover transition-transform duration-500 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent opacity-80 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                <span className="text-brand-green text-sm font-semibold">{speaker.category_fr}</span>
                <h3 className="text-xl font-bold mt-1 text-white">{speaker.name}</h3>
                <p className="text-gray-300 text-sm">{speaker.title_fr}</p>
                <div className="flex gap-4 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    {speaker.twitter_url && (
                        <a href={speaker.twitter_url} target="_blank" rel="noopener noreferrer" aria-label={`${speaker.name}'s Twitter`} className="w-8 h-8 rounded-full flex items-center justify-center bg-white/20 text-white hover:bg-brand-green transition-colors">
                            <i className="fab fa-twitter"></i>
                        </a>
                    )}
                    {speaker.linkedin_url && (
                        <a href={speaker.linkedin_url} target="_blank" rel="noopener noreferrer" aria-label={`${speaker.name}'s LinkedIn`} className="w-8 h-8 rounded-full flex items-center justify-center bg-white/20 text-white hover:bg-brand-green transition-colors">
                            <i className="fab fa-linkedin"></i>
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};

const SpeakersPage: React.FC = () => {
    const [speakers, setSpeakers] = useState<Speaker[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSpeakers = async () => {
            try {
                const response = await fetch(`${API_URL}/speakers`);
                if (!response.ok) {
                    throw new Error('Failed to fetch speakers data.');
                }
                const data: Speaker[] = await response.json();
                setSpeakers(data.filter(s => s.is_active));
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setIsLoading(false);
            }
        };

        fetchSpeakers();
    }, []);

    return (
        <div>
            <PageHero
                title={<>Nos <span className="text-brand-green">Intervenants</span></>}
                subtitle="Découvrez les experts qui façonneront l'avenir de la technologie en Afrique."
            />
            <section className="py-24 bg-white dark:bg-black">
                <div className="max-w-7xl mx-auto px-6">
                    {isLoading && <div className="text-center">Chargement des speakers...</div>}
                    {error && <div className="text-center text-red-500">Erreur: {error}</div>}
                    
                    {!isLoading && !error && (
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {speakers.map((speaker) => <SpeakerCard key={speaker.id} speaker={speaker} />)}
                        </div>
                    )}
                    {!isLoading && !error && speakers.length === 0 && (
                        <p className="text-center text-gray-500">Les speakers pour 2026 seront bientôt annoncés.</p>
                    )}
                </div>
            </section>
        </div>
    );
};

export default SpeakersPage;
