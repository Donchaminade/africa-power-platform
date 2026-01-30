import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../contexts/LanguageContext';
import { useSettings } from '../contexts/SettingsContext'; // Import useSettings

const Footer: React.FC = () => {
    const { t } = useTranslation();
    const { settings, isLoading: settingsLoading, error: settingsError } = useSettings(); // Get settings from context

    const sectionDividerStyle = {
        background: 'linear-gradient(90deg, transparent, #00A859, transparent)',
        height: '1px'
    };

    // Display loading or error state for settings
    if (settingsLoading) {
        return <div>Chargement du pied de page...</div>; // Or a skeleton loader
    }

    if (settingsError) {
        return <div>Erreur de chargement du pied de page: {settingsError}</div>; // Or a fallback footer
    }

    return (
        <footer className="bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 py-12">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid md:grid-cols-4 gap-12 mb-12">
                    <div>
                        <Link to="/" className="flex items-center gap-2 mb-4">
                           <span className="text-xl font-bold tracking-tight">Africa Power <span className="text-brand-green">Platform</span></span>
                        </Link>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                            {t('footer.tagline')}
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4">{t('footer.nav_title')}</h4>
                        <ul className="space-y-2 text-gray-500 dark:text-gray-400">
                            <li><Link to="/" className="hover:text-black dark:hover:text-white transition-colors">{t('nav.about')}</Link></li>
                            <li><Link to="/speakers" className="hover:text-black dark:hover:text-white transition-colors">{t('nav.speakers')}</Link></li>
                            <li><Link to="/program" className="hover:text-black dark:hover:text-white transition-colors">{t('nav.program')}</Link></li>
                            <li><Link to="/register" className="hover:text-black dark:hover:text-white transition-colors">{t('nav.register')}</Link></li>
                            <li><Link to="/team" className="hover:text-black dark:hover:text-white transition-colors">{t('nav.team')}</Link></li>
                            <li><Link to="/faq" className="hover:text-black dark:hover:text-white transition-colors">{t('nav.faq')}</Link></li>
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
                            {settings?.contact_email && <li><i className="fas fa-envelope mr-2 text-brand-green"></i>{settings.contact_email}</li>}
                            {settings?.contact_phone && <li><i className="fas fa-phone mr-2 text-brand-green"></i>{settings.contact_phone}</li>}
                            {settings?.contact_address && <li><i className="fas fa-map-marker-alt mr-2 text-brand-green"></i>{settings.contact_address}</li>}
                        </ul>
                        <div className="flex space-x-4 mt-6">
                            {settings?.social_linkedin_url && <a href={settings.social_linkedin_url} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-brand-green"><i className="fab fa-linkedin fa-lg"></i></a>}
                            {settings?.social_facebook_url && <a href={settings.social_facebook_url} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-brand-green"><i className="fab fa-facebook fa-lg"></i></a>}
                            {settings?.social_twitter_url && <a href={settings.social_twitter_url} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-brand-green"><i className="fab fa-twitter fa-lg"></i></a>}
                        </div>
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