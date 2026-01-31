import React from 'react';
import { Link } from 'react-router-dom';

interface Breadcrumb {
    label: string;
    path?: string; // Optional path for linking
}

interface PageHeroProps {
    title: React.ReactNode;
    subtitle?: string; // Subtitle is optional now
    breadcrumbs?: Breadcrumb[]; // Added breadcrumbs
    children?: React.ReactNode; // New: Allows passing child elements
}

const PageHero: React.FC<PageHeroProps> = ({ title, subtitle, breadcrumbs, children }) => { // Added children
    return (
        <section className="py-20 md:py-32 bg-gradient-to-br from-gray-900 to-black text-white text-center relative overflow-hidden">
            <div className="absolute inset-0 grid-bg opacity-30"></div>
            <div className="relative z-10 max-w-4xl mx-auto px-6">
                <h1 className="text-4xl md:text-6xl font-bold mb-4">{title}</h1>
                {subtitle && <p className="text-lg md:text-xl text-gray-300 mb-4">{subtitle}</p>}

                {children} {/* New: Render children here */}

                {breadcrumbs && breadcrumbs.length > 0 && (
                    <nav className="flex justify-center text-sm" aria-label="Breadcrumb">
                        <ol className="inline-flex items-center space-x-1 md:space-x-3">
                            {breadcrumbs.map((crumb, index) => (
                                <li key={index} className="inline-flex items-center">
                                    {crumb.path ? (
                                        <Link to={crumb.path} className="inline-flex items-center text-gray-300 hover:text-white dark:hover:text-brand-green">
                                            {index > 0 && (
                                                <svg className="w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                                                </svg>
                                            )}
                                            {crumb.label}
                                        </Link>
                                    ) : (
                                        <span className="ml-1 text-gray-500 md:ml-2 dark:text-gray-400">
                                            {index > 0 && (
                                                <svg className="w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                                                </svg>
                                            )}
                                            {crumb.label}
                                        </span>
                                    )}
                                </li>
                            ))}
                        </ol>
                    </nav>
                )}
            </div>
        </section>
    );
};

export default PageHero;
