import React, { useState, useEffect } from 'react';
import { API_URL } from '../../../utils/config';
import ImageUpload from '../ui/ImageUpload'; // Assuming you have an ImageUpload component

interface SiteSettings {
    event_logo_url: string;
    event_date: string; // YYYY-MM-DD format
    event_venue: string;
    // Add other settings you want to manage
    [key: string]: string; // For other dynamic settings
}

const SettingsManager: React.FC = () => {
    const [settings, setSettings] = useState<SiteSettings | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/settings`);
            if (!response.ok) throw new Error('Failed to fetch settings');
            const data: SiteSettings = await response.json();
            // Ensure date is in YYYY-MM-DD format for input type="date"
            if (data.event_date && data.event_date.includes('T')) {
                data.event_date = data.event_date.split('T')[0];
            }
            setSettings(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setSettings(prev => prev ? { ...prev, [name]: value } : null);
    };

    const handleImageUploadSuccess = (imageUrl: string) => {
        setSettings(prev => prev ? { ...prev, event_logo_url: imageUrl } : null);
        setMessage({ type: 'success', text: 'Logo téléchargé avec succès. N\'oubliez pas de sauvegarder les paramètres.' });
    };

    const handleSaveSettings = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!settings) return;

        setMessage(null);
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/settings`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to save settings');
            }

            setMessage({ type: 'success', text: 'Paramètres mis à jour avec succès !' });
        } catch (err) {
            setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Une erreur inconnue est survenue.' });
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return <div className="text-center p-8">Chargement des paramètres...</div>;
    if (error) return <div className="text-center p-8 text-red-500">Erreur: {error}</div>;

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Gestion des Paramètres du Site</h2>

            {message && (
                <div className={`p-4 rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {message.text}
                </div>
            )}

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <form onSubmit={handleSaveSettings} className="space-y-6">
                    <div>
                        <label htmlFor="event_logo_url" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Logo de l\'événement</label>
                        <div className="mt-1 flex items-center">
                            {settings?.event_logo_url && (
                                <img src={settings.event_logo_url} alt="Event Logo" className="h-16 w-16 object-contain mr-4 rounded" />
                            )}
                            <ImageUpload 
                                onUploadSuccess={handleImageUploadSuccess} 
                                uploadPath="/uploads/settings" // Specific path for settings images
                                currentImageUrl={settings?.event_logo_url}
                            />
                        </div>
                        {/* Fallback to text input if ImageUpload is not functional or for direct URL */}
                        <input
                            type="text"
                            name="event_logo_url"
                            id="event_logo_url"
                            value={settings?.event_logo_url || ''}
                            onChange={handleInputChange}
                            className="mt-2 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm dark:bg-gray-700 dark:text-gray-200"
                            placeholder="URL du logo de l\'événement"
                        />
                    </div>

                    <div>
                        <label htmlFor="event_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date de l\'événement</label>
                        <input
                            type="date"
                            name="event_date"
                            id="event_date"
                            value={settings?.event_date || ''}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm dark:bg-gray-700 dark:text-gray-200"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="event_venue" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Lieu de l\'événement</label>
                        <input
                            type="text"
                            name="event_venue"
                            id="event_venue"
                            value={settings?.event_venue || ''}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm dark:bg-gray-700 dark:text-gray-200"
                            required
                        />
                    </div>
                    
                    {/* Add other settings fields here if needed */}

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            <i className="fas fa-save mr-2"></i> Sauvegarder les Paramètres
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SettingsManager;
