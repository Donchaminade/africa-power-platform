
import React from 'react';
import { useTranslation } from '../contexts/LanguageContext';

const SponsorLogos = [
    { name: "Microsoft", logo: "https://logo.clearbit.com/microsoft.com" },
    { name: "MTN", logo: "https://logo.clearbit.com/mtn.com" },
    { name: "Orange", logo: "https://logo.clearbit.com/orange.com" },
    { name: "Cofina", logo: "https://logo.clearbit.com/groupcofina.com" },
    { name: "Moov Africa", logo: "https://logo.clearbit.com/moov.africa" },
    { name: "ISOCEL", logo: "https://logo.clearbit.com/isoceltelecom.com" },
    { name: "Google", logo: "https://logo.clearbit.com/google.com" },
    { name: "Meta", logo: "https://logo.clearbit.com/meta.com" },
];

const Sponsors: React.FC = () => {
    const { t } = useTranslation();

    // Duplicate logos for a seamless, continuous loop from right to left.
    const logoList = [...SponsorLogos, ...SponsorLogos];

    // Self-contained animation styles.
    const animationStyles = `
        @keyframes scroll-left {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
        }
        .animate-scroll-left {
            animation: scroll-left 40s linear infinite; /* Slower and smoother animation */
        }
        .group:hover .animate-scroll-left {
            animation-play-state: paused;
        }
        @media (prefers-reduced-motion) {
          .animate-scroll-left {
            animation: none;
          }
        }
    `;

    return (
        <section className="py-24 bg-white dark:bg-black">
            <style>{animationStyles}</style>
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <span className="text-brand-green font-semibold text-sm tracking-widest uppercase">{t('sponsors.pre_title')}</span>
                    <h2 className="text-4xl md:text-5xl font-bold mt-4">
                        {t('sponsors.title_part1')} <span className="text-brand-green">{t('sponsors.title_part2')}</span>
                    </h2>
                </div>

                <div className="group relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]">
                    <div className="animate-scroll-left flex w-max">
                        {logoList.map((logo, index) => (
                             <div key={`${logo.name}-${index}`} className="h-24 w-60 flex-shrink-0 flex items-center justify-center p-4"> {/* Increased width for better spacing */}
                                <img 
                                    src={logo.logo} 
                                    alt={`${logo.name} logo`} 
                                    className="max-h-12 md:max-h-16 w-auto object-contain grayscale hover:grayscale-0 opacity-60 hover:opacity-100 hover:scale-110 transition-all duration-300" /* Responsive height */
                                />
                             </div>
                        ))}
                    </div>
                </div>

                <div className="text-center mt-16">
                    <a href="#contact" className="border-2 border-brand-green text-brand-green px-8 py-3 rounded-full font-semibold hover:bg-brand-green hover:text-white transition-all">
                        {t('sponsors.button')} <i className="fas fa-arrow-right ml-2"></i>
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Sponsors;
