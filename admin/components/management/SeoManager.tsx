
import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:4000/api';

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

    useEffect(() => {
        const fetchSettings = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${API_URL}/settings`);
                if (!response.ok) throw new Error('Failed to fetch settings');
                const data = await response.json();
                
                // Filter only the keys needed for this component
                const seoData: any = {};
                Object.keys(initialSettings).forEach(key => {
                    if (data[key]) {
                        seoData[key] = data[key];
                    }
                });
                setSettings(seoData);

            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
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
        try {
            const response = await fetch(`${API_URL}/settings`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings),
            });
            if (!response.ok) throw new Error('Failed to save settings');
            alert("SEO settings saved successfully!");
        } catch (err) {
            alert('Error saving settings: ' + (err instanceof Error ? err.message : 'Unknown error'));
        } finally {
            setIsSaving(false);
        }
    };
    
    if (isLoading) {
        return <div>Loading settings...</div>;
    }
    
    if (error) {
        return <div className="text-red-500">Error: {error}</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Paramètres SEO</h2>
            </div>

            <form onSubmit={handleSave} className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                    {/* French SEO */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold border-b pb-2 border-gray-200 dark:border-gray-700">Français</h3>
                        <div>
                            <label htmlFor="seo_meta_title_fr" className="block text-sm font-medium mb-1">Méta-Titre (FR)</label>
                            <input id="seo_meta_title_fr" name="seo_meta_title_fr" value={settings.seo_meta_title_fr} onChange={handleChange} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
                        </div>
                        <div>
                            <label htmlFor="seo_meta_description_fr" className="block text-sm font-medium mb-1">Méta-Description (FR)</label>
                            <textarea id="seo_meta_description_fr" name="seo_meta_description_fr" value={settings.seo_meta_description_fr} onChange={handleChange} rows={4} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
                        </div>
                        <div>
                            <label htmlFor="seo_meta_keywords_fr" className="block text-sm font-medium mb-1">Mots-clés (FR)</label>
                            <input id="seo_meta_keywords_fr" name="seo_meta_keywords_fr" value={settings.seo_meta_keywords_fr} onChange={handleChange} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
                            <p className="text-xs text-gray-500 mt-1">Séparés par une virgule.</p>
                        </div>
                    </div>

                    {/* English SEO */}
                    <div className="space-y-6">
                         <h3 className="text-xl font-bold border-b pb-2 border-gray-200 dark:border-gray-700">English</h3>
                        <div>
                            <label htmlFor="seo_meta_title_en" className="block text-sm font-medium mb-1">Meta Title (EN)</label>
                            <input id="seo_meta_title_en" name="seo_meta_title_en" value={settings.seo_meta_title_en} onChange={handleChange} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
                        </div>
                        <div>
                            <label htmlFor="seo_meta_description_en" className="block text-sm font-medium mb-1">Meta Description (EN)</label>
                            <textarea id="seo_meta_description_en" name="seo_meta_description_en" value={settings.seo_meta_description_en} onChange={handleChange} rows={4} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
                        </div>
                        <div>
                            <label htmlFor="seo_meta_keywords_en" className="block text-sm font-medium mb-1">Keywords (EN)</label>
                            <input id="seo_meta_keywords_en" name="seo_meta_keywords_en" value={settings.seo_meta_keywords_en} onChange={handleChange} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
                             <p className="text-xs text-gray-500 mt-1">Comma-separated.</p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button type="submit" disabled={isSaving} className="bg-green-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed">
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SeoManager;
