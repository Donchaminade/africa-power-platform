import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios
import { API_URL } from '../../../utils/config';
import ImageUpload from '../ui/ImageUpload'; // Assuming you have an ImageUpload component

interface SiteSettings {
    event_logo_url: string;
    event_date: string; // YYYY-MM-DD format
    event_venue: string;
    registration_start_date: string; // New
    registration_end_date: string; // New
    about_video_url: string; // New
    // Add other settings you want to manage
    [key: string]: string; // For other dynamic settings
}

const SettingsManager: React.FC = () => {
    const [settings, setSettings] = useState<SiteSettings | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false); // New state for saving status
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null); // For general messages

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_URL}/settings`); // Changed to axios
            const data: SiteSettings = await response.data; // Changed for axios
            
            // Ensure date is in YYYY-MM-DD format for input type="date"
            if (data.event_date && data.event_date.includes('T')) {
                data.event_date = data.event_date.split('T')[0];
            }
            if (data.registration_start_date && data.registration_start_date.includes('T')) {
                data.registration_start_date = data.registration_start_date.split('T')[0];
            }
            if (data.registration_end_date && data.registration_end_date.includes('T')) {
                data.registration_end_date = data.registration_end_date.split('T')[0];
            }
            // Initialize about_video_url if null/undefined
            if (!data.about_video_url) {
                data.about_video_url = ''; 
            }
            setSettings(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Une erreur inconnue est survenue.');
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
        setIsSaving(true);
        try {
            const response = await axios.put(`${API_URL}/settings`, settings); // Changed to axios

            if (response.status < 200 || response.status >= 300) { // Changed for axios
                throw new Error(response.data.message || 'Échec de la sauvegarde des paramètres.');
            }

            setMessage({ type: 'success', text: 'Paramètres mis à jour avec succès !' });
        } catch (err) {
            setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Une erreur inconnue est survenue.' });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="text-center p-8 text-gray-500">Chargement des paramètres...</div>;
    if (error) return <div className="text-center p-8 text-red-500">Erreur: {error}</div>;

    return (
        <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Gestion des Paramètres du Site</h2>

            {message && (
                <div className={`p-4 rounded-md mb-4 ${message.type === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'}`}>
                    {message.text}
                </div>
            )}

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <form onSubmit={handleSaveSettings} className="space-y-6">
                    <div>
                        <label htmlFor="event_logo_url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Logo de l\'événement</label>
                        <div className="mt-1 flex items-center">
                            {settings?.event_logo_url && (
                                <img src={settings.event_logo_url} alt="Logo de l\'événement" className="h-16 w-16 object-contain mr-4 rounded" />
                            )}
                            <ImageUpload 
                                onUploadSuccess={handleImageUploadSuccess} 
                                uploadPath="/uploads/settings" // Specific path for settings images
                                currentImageUrl={settings?.event_logo_url}
                            />
                        </div>
                        <input
                            type="text"
                            name="event_logo_url"
                            id="event_logo_url"
                            value={settings?.event_logo_url || ''}
                            onChange={handleInputChange}
                            className="mt-2 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-green focus:border-brand-green sm:text-sm dark:bg-gray-700 dark:text-gray-200"
                            placeholder="URL du logo de l\'événement"
                        />
                    </div>

                    <div>
                        <label htmlFor="event_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date de l\'événement</label>
                        <input
                            type="date"
                            name="event_date"
                            id="event_date"
                            value={settings?.event_date || ''}
                            onChange={handleInputChange}
                            className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-brand-green focus:border-brand-green text-gray-900 dark:text-white"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="event_venue" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Lieu de l\'événement</label>
                        <input
                            type="text"
                            name="event_venue"
                            id="event_venue"
                            value={settings?.event_venue || ''}
                            onChange={handleInputChange}
                            className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-brand-green focus:border-brand-green text-gray-900 dark:text-white"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="registration_start_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date de début des inscriptions</label>
                            <input
                                type="date"
                                name="registration_start_date"
                                id="registration_start_date"
                                value={settings?.registration_start_date || ''}
                                onChange={handleInputChange}
                                className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-brand-green focus:border-brand-green text-gray-900 dark:text-white"
                            />
                        </div>
                        <div>
                            <label htmlFor="registration_end_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date de fin des inscriptions</label>
                            <input
                                type="date"
                                name="registration_end_date"
                                id="registration_end_date"
                                value={settings?.registration_end_date || ''}
                                onChange={handleInputChange}
                                className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-brand-green focus:border-brand-green text-gray-900 dark:text-white"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="about_video_url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">URL de la vidéo "À Propos" (YouTube Embed)</label>
                        <input
                            type="text"
                            name="about_video_url"
                            id="about_video_url"
                            value={settings?.about_video_url || ''}
                            onChange={handleInputChange}
                            className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-brand-green focus:border-brand-green text-gray-900 dark:text-white"
                            placeholder="Ex: https://www.youtube.com/embed/your_video_id"
                        />
                    </div>
                    
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green disabled:opacity-50"
                        >
                            {isSaving ? (
                                <>
                                    <i className="fas fa-spinner fa-spin mr-2"></i> Sauvegarde...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-save mr-2"></i> Sauvegarder les Paramètres
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SettingsManager;