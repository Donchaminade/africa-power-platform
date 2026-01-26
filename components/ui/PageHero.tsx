import React from 'react';

interface PageHeroProps {
    title: React.ReactNode;
    subtitle: string;
}

const PageHero: React.FC<PageHeroProps> = ({ title, subtitle }) => {
    return (
        <section className="py-20 md:py-32 bg-gradient-to-br from-gray-900 to-black text-white text-center relative overflow-hidden">
            <div className="absolute inset-0 grid-bg opacity-30"></div>
            <div className="relative z-10 max-w-4xl mx-auto px-6">
                <h1 className="text-4xl md:text-6xl font-bold mb-4">{title}</h1>
                <p className="text-lg md:text-xl text-gray-300">{subtitle}</p>
            </div>
        </section>
    );
};

export default PageHero;
