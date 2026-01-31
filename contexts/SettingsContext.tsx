import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { API_URL } from '../utils/config';

// Define the shape of our settings
interface SiteSettings {
    event_logo_url: string;
    event_date: string;
    event_venue: string;
    contact_email: string;
    contact_phone: string;
    contact_address: string;
    social_linkedin_url: string;
    social_facebook_url: string;
    social_twitter_url: string;
    event_location_google_maps_embed: string;
    speaker_form_link: string; // New
    volunteer_form_link: string; // New
    sponsor_form_link: string; // New
    seo_meta_title_fr: string;
    seo_meta_title_en: string;
    seo_meta_description_fr: string;
    seo_meta_description_en: string;
    seo_meta_keywords_fr: string;
    seo_meta_keywords_en: string;
    [key: string]: string; // For any other dynamic settings
}

// Initial dummy values for context, will be replaced by API call
const defaultSettings: SiteSettings = {
    event_logo_url: '/assets/images/logo.png',
    event_date: 'YYYY-MM-DD',
    event_venue: 'Lieu de l\'événement',
    contact_email: '',
    contact_phone: '',
    contact_address: '',
    social_linkedin_url: '',
    social_facebook_url: '',
    social_twitter_url: '',
    event_location_google_maps_embed: '',
    speaker_form_link: '', // New
    volunteer_form_link: '', // New
    sponsor_form_link: '', // New
    seo_meta_title_fr: '',
    seo_meta_title_en: '',
    seo_meta_description_fr: '',
    seo_meta_description_en: '',
    seo_meta_keywords_fr: '',
    seo_meta_keywords_en: '',
};

interface SettingsContextType {
    settings: SiteSettings;
    isLoading: boolean;
    error: string | null;
    fetchSettings: () => Promise<void>; // Function to refetch settings manually
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchSettings = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/settings`);
            if (!response.ok) {
                throw new Error('Failed to fetch settings');
            }
            const data: SiteSettings = await response.json();
            setSettings(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    return (
        <SettingsContext.Provider value={{ settings, isLoading, error, fetchSettings }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};
