
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios

import { API_URL } from '../../../utils/config';

interface SeoSettings {
    seo_meta_title_fr: string;
    seo_meta_title_en: string;
    seo_meta_description_fr: string;
    seo_meta_description_en: string;
    seo_meta_keywords_fr: string;
    seo_meta_keywords_en: string;
}

const initialSettings: SeoSettings = {
    seo_meta_title_fr: '',
    seo_meta_title_en: '',
    seo_meta_description_fr: '',
    seo_meta_description_en: '',
    seo_meta_keywords_fr: '',
    seo_meta_keywords_en: '',
};

const SeoManager: React.FC = () => {
    const [settings, setSettings] = useState<SeoSettings>(initialSettings);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null); // For general messages


    useEffect(() => {
        const fetchSettings = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`${API_URL}/settings`); // Changed to axios
                const data = await response.data; // Changed for axios
                
                // Filter only the keys needed for this component
                const seoData: any = {};
                Object.keys(initialSettings).forEach(key => {
                    if (data[key]) {
                        seoData[key] = data[key];
                    }
                });
                setSettings(seoData);

            } catch (err) {
                setError(err instanceof Error ? err.message : 'Une erreur inconnue est survenue.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage(null);
        try {
            const response = await axios.put(`${API_URL}/settings`, settings); // Changed to axios
            if (response.status < 200 || response.status >= 300) { // Changed for axios
                throw new Error(response.data.message || 'Échec de la sauvegarde des paramètres SEO.');
            }
            setMessage({type: 'success', text: 'Paramètres SEO sauvegardés avec succès !'});
        } catch (err) {
            setMessage({type: 'error', text: 'Erreur lors de la sauvegarde des paramètres SEO: ' + (err instanceof Error ? err.message : 'Erreur inconnue')});
        } finally {
            setIsSaving(false);
        }
    };
    
    if (isLoading) {
        return <div className="p-4 text-center text-gray-500">Chargement des paramètres SEO...</div>;
    }
    
    if (error) {
        return <div className="p-4 text-red-500 text-center">Erreur: {error}</div>;
    }

    return (
        <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Gestion des Paramètres SEO</h2>
            </div>
            {message && (
                <div className={`p-4 rounded-md mb-4 ${message.type === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'}`}>
                    {message.text}
                </div>
            )}
            <form onSubmit={handleSave} className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                    {/* French SEO */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold border-b pb-2 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white">Français</h3>
                        <div>
                            <label htmlFor="seo_meta_title_fr" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Méta-Titre (FR)</label>
                            <input id="seo_meta_title_fr" name="seo_meta_title_fr" value={settings.seo_meta_title_fr || ''} onChange={handleChange} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-brand-green focus:border-brand-green text-gray-900 dark:text-white" />
                        </div>
                        <div>
                            <label htmlFor="seo_meta_description_fr" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Méta-Description (FR)</label>
                            <textarea id="seo_meta_description_fr" name="seo_meta_description_fr" value={settings.seo_meta_description_fr || ''} onChange={handleChange} rows={4} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-brand-green focus:border-brand-green text-gray-900 dark:text-white" />
                        </div>
                        <div>
                            <label htmlFor="seo_meta_keywords_fr" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mots-clés (FR)</label>
                            <input id="seo_meta_keywords_fr" name="seo_meta_keywords_fr" value={settings.seo_meta_keywords_fr || ''} onChange={handleChange} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-brand-green focus:border-brand-green text-gray-900 dark:text-white" />
                            <p className="text-xs text-gray-500 mt-1">Séparés par une virgule.</p>
                        </div>
                    </div>

                    {/* English SEO */}
                    <div className="space-y-6">
                         <h3 className="text-xl font-bold border-b pb-2 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white">Anglais</h3>
                        <div>
                            <label htmlFor="seo_meta_title_en" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Méta-Titre (EN)</label>
                            <input id="seo_meta_title_en" name="seo_meta_title_en" value={settings.seo_meta_title_en || ''} onChange={handleChange} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-brand-green focus:border-brand-green text-gray-900 dark:text-white" />
                        </div>
                        <div>
                            <label htmlFor="seo_meta_description_en" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Méta-Description (EN)</label>
                            <textarea id="seo_meta_description_en" name="seo_meta_description_en" value={settings.seo_meta_description_en || ''} onChange={handleChange} rows={4} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-brand-green focus:border-brand-green text-gray-900 dark:text-white" />
                        </div>
                        <div>
                            <label htmlFor="seo_meta_keywords_en" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mots-clés (EN)</label>
                            <input id="seo_meta_keywords_en" name="seo_meta_keywords_en" value={settings.seo_meta_keywords_en || ''} onChange={handleChange} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-brand-green focus:border-brand-green text-gray-900 dark:text-white" />
                             <p className="text-xs text-gray-500 mt-1">Séparés par une virgule.</p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button type="submit" disabled={isSaving} className="bg-green-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed">
                        {isSaving ? (
                            <>
                                <i className="fas fa-spinner fa-spin mr-2"></i> Sauvegarde...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-save mr-2"></i> Sauvegarder les modifications
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SeoManager;
