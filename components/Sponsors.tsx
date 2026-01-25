import React, { useState, useEffect } from 'react';
import { useTranslation } from '../contexts/LanguageContext';
import { Sponsor } from '../utils/types';
import { API_URL } from '../utils/config';

type SponsorsByTier = {
    platinum: Sponsor[];
    gold: Sponsor[];
    silver: Sponsor[];
    community: Sponsor[];
};

// --- Helper Components for clarity ---

const SponsorCard: React.FC<{ sponsor: Sponsor; className?: string; imgClass?: string }> = ({ sponsor, className = '', imgClass = '' }) => (
    <a href={sponsor.website_url || '#'} target="_blank" rel="noopener noreferrer" className={`group relative flex justify-center items-center rounded-xl p-6 transition-all duration-300 transform hover:scale-105 ${className}`}>
        <img 
            src={sponsor.logo_url} 
            alt={`${sponsor.name} logo`}
            className={`object-contain transition-all duration-300 group-hover:filter-none ${imgClass}`}
        />
        {/* Optional: Add a subtle overlay or border on hover */}
        <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-brand-green/50 transition-all duration-300"></div>
    </a>
);

const ScrollingLogos: React.FC<{ logos: Sponsor[] }> = ({ logos }) => {
    if (logos.length === 0) return null;
    const logoList = [...logos, ...logos];

    const animationStyles = `
        @keyframes scroll-left {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
        }
        .animate-scroll-left {
            animation: scroll-left 60s linear infinite; /* Slower animation for more control */
        }
        .scrolling-container:hover .animate-scroll-left {
            animation-play-state: paused;
        }
    `;

    return (
        <div className="scrolling-container relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)] dark:[mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]">
             <style>{animationStyles}</style>
            <div className="animate-scroll-left flex w-max items-center">
                {logoList.map((logo, index) => (
                     <div key={`${logo.name}-${index}`} className="h-24 w-48 flex-shrink-0 flex items-center justify-center p-4">
                        <img 
                            src={logo.logo_url} 
                            alt={`${logo.name} logo`} 
                            className="max-h-10 w-auto object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                        />
                     </div>
                ))}
            </div>
        </div>
    );
}

// --- Main Sponsors Component ---

const Sponsors: React.FC = () => {
    const { t } = useTranslation();
    const [sponsors, setSponsors] = useState<SponsorsByTier>({ platinum: [], gold: [], silver: [], community: [] });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

     useEffect(() => {
        const fetchSponsors = async () => {
            try {
                const response = await fetch(`${API_URL}/sponsors`);
                if (!response.ok) {
                    throw new Error('Failed to fetch sponsors data.');
                }
                const data: Sponsor[] = await response.json();
                
                const activeSponsors = data.filter(s => s.is_active);

                const byTier = activeSponsors.reduce((acc, sponsor) => {
                    const tier = sponsor.tier;
                    if (!acc[tier]) {
                        acc[tier] = [];
                    }
                    acc[tier].push(sponsor);
                    return acc;
                }, {} as Partial<SponsorsByTier>);

                setSponsors({
                    platinum: byTier.platinum || [],
                    gold: byTier.gold || [],
                    silver: byTier.silver || [],
                    community: byTier.community || [],
                });

            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setIsLoading(false);
            }
        };

        fetchSponsors();
    }, []);

    const hasSponsors = sponsors.platinum.length > 0 || sponsors.gold.length > 0 || sponsors.silver.length > 0 || sponsors.community.length > 0;

    return (
        <section id="sponsors" className="py-24 bg-gray-50 dark:bg-gray-900/50">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <span className="text-brand-green font-semibold text-sm tracking-widest uppercase">{t('sponsors.pre_title')}</span>
                    <h2 className="text-4xl md:text-5xl font-bold mt-4 text-gray-900 dark:text-white">
                        {t('sponsors.title_part1')} <span className="text-brand-green">{t('sponsors.title_part2')}</span>
                    </h2>
                </div>

                {isLoading && <div className="text-center">Chargement des partenaires...</div>}
                {error && <div className="text-center text-red-500">Erreur: {error}</div>}

                {!isLoading && !error && !hasSponsors && (
                    <p className="text-center text-gray-500">Nos partenaires pour 2026 seront annoncés bientôt. Contactez-nous pour rejoindre l'aventure !</p>
                )}

                {!isLoading && !error && hasSponsors && (
                    <>
                        {/* Platinum Tier */}
                        {sponsors.platinum.length > 0 && (
                            <div className="mb-20">
                                <h3 className="text-center text-3xl font-extrabold text-brand-yellow mb-8 tracking-wide">PLATINUM PARTNERS</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-center">
                                    {sponsors.platinum.map(sponsor => <SponsorCard key={sponsor.id} sponsor={sponsor} className="bg-white dark:bg-gray-800/60 shadow-xl dark:shadow-brand-green/20" imgClass="h-24 grayscale-0" />)}
                                </div>
                            </div>
                        )}

                        {/* Gold Tier */}
                        {sponsors.gold.length > 0 && (
                            <div className="mb-20">
                                <h3 className="text-center text-2xl font-bold text-yellow-500 mb-8 border-b-2 border-yellow-300/50 pb-2 max-w-xl mx-auto">GOLD PARTNERS</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto items-center">
                                    {sponsors.gold.map(sponsor => <SponsorCard key={sponsor.id} sponsor={sponsor} className="bg-white/70 dark:bg-gray-800/40 shadow-md" imgClass="max-h-16 grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100" />)}
                                </div>
                            </div>
                        )}

                         {/* Silver Tier */}
                         {sponsors.silver.length > 0 && (
                            <div className="mb-20">
                                <h3 className="text-center text-xl font-semibold text-gray-600 dark:text-gray-400 mb-8 border-b border-gray-300/50 pb-2 max-w-md mx-auto">SILVER PARTNERS</h3>
                                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-w-5xl mx-auto items-center">
                                    {sponsors.silver.map(sponsor => <SponsorCard key={sponsor.id} sponsor={sponsor} className="bg-white/50 dark:bg-gray-800/20" imgClass="max-h-12 grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100" />)}
                                </div>
                            </div>
                        )}

                        {/* Community & Tech Partners */}
                        {sponsors.community.length > 0 && (
                             <div className="mt-20">
                                <h3 className="text-center text-lg font-semibold text-gray-600 dark:text-gray-400 mb-8">COMMUNITY & TECHNICAL PARTNERS</h3>
                                <ScrollingLogos logos={sponsors.community} />
                            </div>
                        )}
                    </>
                )}

                <div className="text-center mt-20">
                    <a href="#contact" className="inline-flex items-center justify-center border-2 border-brand-green text-brand-green px-8 py-3 rounded-full font-semibold hover:bg-brand-green hover:text-white transition-all duration-300 transform hover:scale-105">
                        {t('sponsors.button')} <i className="fas fa-arrow-right ml-2"></i>
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Sponsors;