
import React from 'react';
import { useTranslation } from '../contexts/LanguageContext';

const Footer: React.FC = () => {
    const { t } = useTranslation();

    const sectionDividerStyle = {
        background: 'linear-gradient(90deg, transparent, #00A859, transparent)',
        height: '1px'
    };
    return (
        <footer className="bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 py-12">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid md:grid-cols-4 gap-12 mb-12">
                    <div>
                        <a href="#" className="flex items-center gap-2 mb-4">
                           <span className="text-xl font-bold tracking-tight">Africa Power <span className="text-brand-green">Platform</span></span>
                        </a>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                            {t('footer.tagline')}
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4">{t('footer.nav_title')}</h4>
                        <ul className="space-y-2 text-gray-500 dark:text-gray-400">
                            <li><a href="#about" className="hover:text-black dark:hover:text-white transition-colors">{t('nav.about')}</a></li>
                            <li><a href="#speakers" className="hover:text-black dark:hover:text-white transition-colors">{t('nav.speakers')}</a></li>
                            <li><a href="#program" className="hover:text-black dark:hover:text-white transition-colors">{t('nav.program')}</a></li>
                            <li><a href="#register" className="hover:text-black dark:hover:text-white transition-colors">{t('nav.register')}</a></li>
                            <li><a href="#team" className="hover:text-black dark:hover:text-white transition-colors">{t('nav.team')}</a></li>
                            <li><a href="#faq" className="hover:text-black dark:hover:text-white transition-colors">{t('nav.faq')}</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4">{t('footer.legal_title')}</h4>
                        <ul className="space-y-2 text-gray-500 dark:text-gray-400">
                            <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">{t('footer.privacy')}</a></li>
                            <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">{t('footer.terms')}</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4">{t('footer.contact_title')}</h4>
                        <ul className="space-y-2 text-gray-500 dark:text-gray-400">
                            <li><i className="fas fa-envelope mr-2 text-brand-green"></i>contact@africapowerplatform.org</li>
                            <li><i className="fas fa-phone mr-2 text-brand-green"></i>+229 68 38 01 12</li>
                            <li><i className="fas fa-map-marker-alt mr-2 text-brand-green"></i>Cotonou, Bénin</li>
                        </ul>
                    </div>
                </div>

                <div style={sectionDividerStyle} className="mb-8"></div>

                <div className="text-center">
                    <p className="text-gray-500 text-sm">
                        © {new Date().getFullYear()} {t('footer.copyright')}
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
