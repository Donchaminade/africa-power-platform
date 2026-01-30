import React, { useState, useEffect } from 'react';
import { useTranslation } from '../contexts/LanguageContext';
import { Sponsor } from '../utils/types';
import { API_URL } from '../utils/config';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { Link } from 'react-router-dom';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const Sponsors: React.FC = () => {
    const { t } = useTranslation();
    const [sponsors, setSponsors] = useState<Sponsor[]>([]);
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
                setSponsors(data.filter(s => s.is_active));
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setIsLoading(false);
            }
        };

        fetchSponsors();
    }, []);

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

                {!isLoading && !error && sponsors.length > 0 && (
                    <Swiper
                        modules={[Autoplay, Pagination, Navigation]}
                        spaceBetween={0}
                        slidesPerView={2}
                        loop={true}
                        centeredSlides={true}
                        autoplay={{
                            delay: 2500,
                            disableOnInteraction: false,
                        }}
                        pagination={{ clickable: true }}
                        navigation={true}
                        breakpoints={{
                            640: {
                                slidesPerView: 3,
                                spaceBetween: 0,
                            },
                            768: {
                                slidesPerView: 4,
                                spaceBetween: 0,
                            },
                            1024: {
                                slidesPerView: 5,
                                spaceBetween: 0,
                            },
                        }}
                        className="mySwiper"
                    >
                        {
                            // Duplicate slides if there are fewer than 4 to ensure smooth looping
                            // This ensures Swiper has enough elements to create the loop effect without issues.
                            [...sponsors, ... (sponsors.length < 4 ? sponsors : []), ... (sponsors.length < 2 ? sponsors : [])].map((sponsor, index) => (
                                <SwiperSlide key={`${sponsor.id}-${index}`}>
                                    <a href={sponsor.website_url || '#'} target="_blank" rel="noopener noreferrer" className="flex justify-center items-center h-40">
                                        <img 
                                            src={sponsor.logo_url} 
                                            alt={`${sponsor.name} logo`}
                                            className="max-h-28 max-w-full object-contain"
                                        />
                                    </a>
                                </SwiperSlide>
                            ))
                        }
                    </Swiper>
                )}

                {!isLoading && !error && sponsors.length === 0 && (
                    <p className="text-center text-gray-500">Nos partenaires pour {new Date().getFullYear() + 1} seront annoncés bientôt. Contactez-nous pour rejoindre l'aventure !</p>
                )}

                <div className="text-center mt-20">
                    <Link to="/contact" className="inline-flex items-center justify-center border-2 border-brand-green text-brand-green px-8 py-3 rounded-full font-semibold hover:bg-brand-green hover:text-white transition-all duration-300 transform hover:scale-105">
                        {t('sponsors.button')} <i className="fas fa-arrow-right ml-2"></i>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Sponsors;