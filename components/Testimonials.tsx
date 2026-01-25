import React, { useState, useEffect } from 'react';
import { useTranslation } from '../contexts/LanguageContext';

const API_URL = 'http://localhost:4000/api';

interface Testimonial {
    id: number;
    author_name: string;
    author_title_fr: string;
    author_title_en: string;
    author_image_url?: string;
    quote_fr: string;
    quote_en: string;
}

const Testimonials: React.FC = () => {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { t, language } = useTranslation();

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const response = await fetch(`${API_URL}/testimonials?active=true`);
                if (!response.ok) throw new Error('Failed to fetch testimonials');
                const data = await response.json();
                setTestimonials(data);
            } catch (error) {
                console.error("Failed to fetch testimonials:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTestimonials();
    }, []);

    // Glassmorphism style
    const glassStyle: React.CSSProperties = {
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
    };

    if (isLoading) {
        return <div className="text-center py-24">Loading testimonials...</div>;
    }
    
    if (testimonials.length === 0) {
        return null; // Don't render the section if there are no testimonials
    }

    return (
        <section id="testimonials" className="py-24 bg-gray-900 dark:bg-black">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <span className="text-brand-green font-semibold text-sm tracking-widest uppercase">{t('testimonials.pre_title')}</span>
                    <h2 className="text-4xl md:text-5xl font-bold mt-4 text-white">
                        {t('testimonials.title')}
                    </h2>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonials.map(item => (
                        <div key={item.id} style={glassStyle} className="p-8 rounded-2xl">
                            <i className="fas fa-quote-left text-brand-green text-3xl mb-4"></i>
                            <p className="text-gray-300 mb-6 italic">
                                "{language === 'fr' ? item.quote_fr : item.quote_en}"
                            </p>
                            <div className="flex items-center gap-4">
                                {item.author_image_url && (
                                    <img src={item.author_image_url} alt={item.author_name} className="w-12 h-12 rounded-full object-cover" />
                                )}
                                <div>
                                    <h4 className="font-bold text-white">{item.author_name}</h4>
                                    <p className="text-sm text-gray-400">
                                        {language === 'fr' ? item.author_title_fr : item.author_title_en}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
