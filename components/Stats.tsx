
import React from 'react';
import { useTranslation } from '../contexts/LanguageContext';

const Stats: React.FC = () => {
    const { t } = useTranslation();

    const stats = [
        `+25 ${t('stats.speakers')}`,
        `+500 ${t('stats.participants')}`,
        `2 ${t('stats.days')}`,
        `+10 ${t('stats.workshops')}`,
    ];

    // Duplicate for seamless scroll
    const marqueeItems = [...stats, ...stats];

    const animationStyles = `
        @keyframes scroll {
            from { transform: translateX(0); }
            to { transform: translateX(-100%); }
        }
        .marquee-content {
            flex-shrink: 0;
            display: flex;
            justify-content: space-around;
            gap: 2rem;
            min-width: 100%;
            animation: scroll 40s linear infinite;
        }
        .marquee:hover .marquee-content {
            animation-play-state: paused;
        }
    `;

    return (
        <section className="py-10 bg-brand-green text-white overflow-hidden">
            <style>{animationStyles}</style>
            <div className="marquee">
                <div className="marquee-content">
                    {marqueeItems.map((item, index) => (
                        <div key={index} className="flex items-center gap-4 mx-8">
                            <span className="text-3xl md:text-4xl font-bold whitespace-nowrap">{item}</span>
                            {index < stats.length - 1 && <span className="text-3xl text-white/50">•</span>}
                        </div>
                    ))}
                </div>
                 <div className="marquee-content" aria-hidden="true">
                    {marqueeItems.map((item, index) => (
                        <div key={index} className="flex items-center gap-4 mx-8">
                            <span className="text-3xl md:text-4xl font-bold whitespace-nowrap">{item}</span>
                            {index < stats.length - 1 && <span className="text-3xl text-white/50">•</span>}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Stats;
