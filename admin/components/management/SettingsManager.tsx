import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios
import { API_URL } from '../../config';
import ImageUpload from '../ui/ImageUpload'; // Assuming you have an ImageUpload component
import VideoUpload from '../ui/VideoUpload'; // Import VideoUpload component
import { useTranslation } from '../../../contexts/LanguageContext'; // Import useTranslation

interface SiteSettings {
    event_logo_url: string;
    event_date: string; // YYYY-MM-DD format
    event_venue: string;
    registration_start_date: string; // New
    registration_end_date: string; // New
    about_video_url: string; // New
    event_edition_number: string; // New
    event_speakers_count: string; // New Stat
    event_participants_count: string; // New Stat
    event_days_count: string; // New Stat
    event_workshops_count: string; // New Stat
    speaker_form_link: string; // New
    volunteer_form_link: string; // New
    sponsor_form_link: string; // New
    // Add other settings you want to manage
    [key: string]: string; // For other dynamic settings
}

const SettingsManager: React.FC = () => {
    const { t } = useTranslation(); // Initialize useTranslation
    const [settings, setSettings] = useState<SiteSettings | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false); // New state for saving status
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null); // For general messages
    const [isFormVisible, setIsFormVisible] = useState(false); // New state for form visibility
    const [originalSettings, setOriginalSettings] = useState<SiteSettings | null>(null); // To revert changes on cancel
    const [dynamicSettings, setDynamicSettings] = useState<{ key: string, value: string }[]>([]); // New state for dynamic settings

    useEffect(() => {
        fetchSettings();
    }, []);

    // Define fixed settings keys
    const fixedSettingKeys = [
        'event_logo_url', 'event_date', 'event_venue', 'registration_start_date', 
        'registration_end_date', 'about_video_url', 'event_edition_number',
        'event_speakers_count', 'event_participants_count', 'event_days_count',
        'event_workshops_count', 'speaker_form_link', 'volunteer_form_link', 'sponsor_form_link',
        'contact_email', 'contact_phone', 'contact_address',
        'social_linkedin_url', 'social_facebook_url', 'social_twitter_url',
        'event_location_google_maps_embed',
        // SEO settings keys
        'seo_meta_title_fr', 'seo_meta_title_en',
        'seo_meta_description_fr', 'seo_meta_description_en',
        'seo_meta_keywords_fr', 'seo_meta_keywords_en',
    ];

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
            // Initialize event_edition_number if null/undefined
            if (!data.event_edition_number) {
                data.event_edition_number = ''; 
            }
            // Initialize new stat fields if null/undefined
            if (!data.event_speakers_count) {
                data.event_speakers_count = '';
            }
            if (!data.event_participants_count) {
                data.event_participants_count = '';
            }
            if (!data.event_days_count) {
                data.event_days_count = '';
            }
            if (!data.event_workshops_count) {
                data.event_workshops_count = '';
            }
            if (!data.speaker_form_link) {
                data.speaker_form_link = '';
            }
            if (!data.volunteer_form_link) {
                data.volunteer_form_link = '';
            }
            if (!data.sponsor_form_link) {
                data.sponsor_form_link = '';
            }
            // Initialize other fixed settings
            if (!data.contact_email) data.contact_email = '';
            if (!data.contact_phone) data.contact_phone = '';
            if (!data.contact_address) data.contact_address = '';
            if (!data.social_linkedin_url) data.social_linkedin_url = '';
            if (!data.social_facebook_url) data.social_facebook_url = '';
            if (!data.social_twitter_url) data.social_twitter_url = '';
            if (!data.event_location_google_maps_embed) data.event_location_google_maps_embed = '';
            if (!data.seo_meta_title_fr) data.seo_meta_title_fr = '';
            if (!data.seo_meta_title_en) data.seo_meta_title_en = '';
            if (!data.seo_meta_description_fr) data.seo_meta_description_fr = '';
            if (!data.seo_meta_description_en) data.seo_meta_description_en = '';
            if (!data.seo_meta_keywords_fr) data.seo_meta_keywords_fr = '';
            if (!data.seo_meta_keywords_en) data.seo_meta_keywords_en = '';


            const dynamic = Object.entries(data)
                .filter(([key]) => !fixedSettingKeys.includes(key))
                .map(([key, value]) => ({ key, value: String(value) }));

            setSettings(data);
            setOriginalSettings(data); // Save original settings to revert
            setDynamicSettings(dynamic);
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
             
                 const handleVideoUploadSuccess = (videoUrl: string) => {
                     setSettings(prev => prev ? { ...prev, about_video_url: videoUrl } : null);
                     setMessage({ type: 'success', text: 'Vidéo téléchargée avec succès ! N\'oubliez pas de sauvegarder les paramètres.' });
                 };
             
                // New: Handle dynamic settings changes
                const handleDynamicSettingChange = (index: number, field: 'key' | 'value', newValue: string) => {
                    setDynamicSettings(prev => {
                        const newDynamicSettings = [...prev];
                        newDynamicSettings[index] = { ...newDynamicSettings[index], [field]: newValue };
                        return newDynamicSettings;
                    });
                };

                // New: Add a new dynamic setting field
                const handleAddDynamicField = () => {
                    setDynamicSettings(prev => [...prev, { key: '', value: '' }]);
                };

                // New: Remove a dynamic setting field
                const handleRemoveDynamicField = (index: number) => {
                    setDynamicSettings(prev => prev.filter((_, i) => i !== index));
                };

                 const handleSaveSettings = async (e: React.FormEvent) => {
                     e.preventDefault();
                     if (!settings) return;
             
                     setMessage(null);
                     setIsSaving(true);
                     try {
                        // Combine fixed and dynamic settings
                        const combinedSettings: { [key: string]: string } = { ...settings };
                        dynamicSettings.forEach(dynamic => {
                            if (dynamic.key.trim() !== '') { // Only add if key is not empty
                                combinedSettings[dynamic.key] = dynamic.value;
                            }
                        });

                         const response = await axios.put(`${API_URL}/settings`, combinedSettings); // Send combined settings
             
                         if (response.status < 200 || response.status >= 300) { // Changed for axios
                             throw new Error(response.data.message || 'Échec de la sauvegarde des paramètres.');
                         }
             
                         setMessage({ type: 'success', text: 'Paramètres mis à jour avec succès !' });
             setIsFormVisible(false); // New: Close form on successful save
                     } catch (err) {
                                     setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Une erreur inconnue est survenue.' });
                                 } finally {
                                     setIsSaving(false);
                                 }
                             };
                         
                             const handleCancelEdit = () => {
                                 setSettings(originalSettings); // Revert to original settings
                                 setIsFormVisible(false); // Hide the form
                                 setMessage(null); // Clear any messages
                             };
                                      
                             if (isLoading) return <div className="text-center p-8 text-gray-500">Chargement des paramètres...</div>;                 if (error) return <div className="text-center p-8 text-red-500">Erreur: {error}</div>;
             
                 return (
                     <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Gestion des Paramètres du Site</h2>
                {!isFormVisible && (
                    <button onClick={() => setIsFormVisible(true)} className="bg-brand-green text-white px-5 py-2 rounded-md font-semibold hover:bg-green-700 transition">
                        <i className="fas fa-edit mr-2"></i> Modifier les Paramètres
                    </button>
                )}
            </div>
             
                         {message && (
                             <div className={`p-4 rounded-md mb-4 ${message.type === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'}`}>
                                 {message.text}
                             </div>
                         )}
             
            {isFormVisible && (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
                    <form onSubmit={handleSaveSettings} className="space-y-6">
                        <div>
                            <label htmlFor="event_logo_url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('settings.event_logo_url')}</label>
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
                                className="mt-2 block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-brand-green focus:border-brand-green text-gray-900 dark:text-white"
                                placeholder="URL du logo de l\'événement"
                            />
                        </div>

                        <div>
                            <label htmlFor="event_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('settings.event_date')}</label>
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
                            <label htmlFor="event_venue" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('settings.event_venue')}</label>
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

                        <div>
                            <label htmlFor="event_edition_number" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('settings.event_edition_number')}</label>
                            <input
                                type="text"
                                name="event_edition_number"
                                id="event_edition_number"
                                value={settings?.event_edition_number || ''}
                                onChange={handleInputChange}
                                className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-brand-green focus:border-brand-green text-gray-900 dark:text-white"
                                placeholder="Ex: 1ère édition"
                            />
                        </div>

                        {/* New fields for form links */}
                        <div>
                            <label htmlFor="speaker_form_link" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Lien formulaire Speaker</label>
                            <input
                                type="url"
                                name="speaker_form_link"
                                id="speaker_form_link"
                                value={settings?.speaker_form_link || ''}
                                onChange={handleInputChange}
                                className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-brand-green focus:border-brand-green text-gray-900 dark:text-white"
                                placeholder="URL du formulaire Speaker"
                            />
                        </div>
                        <div>
                            <label htmlFor="volunteer_form_link" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Lien formulaire Volontaire</label>
                            <input
                                type="url"
                                name="volunteer_form_link"
                                id="volunteer_form_link"
                                value={settings?.volunteer_form_link || ''}
                                onChange={handleInputChange}
                                className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-brand-green focus:border-brand-green text-gray-900 dark:text-white"
                                placeholder="URL du formulaire Volontaire"
                            />
                        </div>
                        <div>
                            <label htmlFor="sponsor_form_link" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Lien formulaire Sponsor</label>
                            <input
                                type="url"
                                name="sponsor_form_link"
                                id="sponsor_form_link"
                                value={settings?.sponsor_form_link || ''}
                                onChange={handleInputChange}
                                className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-brand-green focus:border-brand-green text-gray-900 dark:text-white"
                                placeholder="URL du formulaire Sponsor"
                            />
                        </div>
                        {/* End new fields for form links */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="registration_start_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('settings.registration_start_date')}</label>
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
                                <label htmlFor="registration_end_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('settings.registration_end_date')}</label>
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

                        {/* Section for dynamic settings */}
                        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                            <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Autres Paramètres Personnalisés</h3>
                            {dynamicSettings.length === 0 && (
                                <p className="text-gray-500 dark:text-gray-400 mb-4">
                                    Aucun paramètre personnalisé ajouté. Cliquez sur le bouton "+" pour en ajouter.
                                </p>
                            )}
                            <div className="space-y-4">
                                {dynamicSettings.map((dynamic, index) => (
                                    <div key={index} className="flex flex-col md:flex-row gap-2">
                                        <input
                                            type="text"
                                            value={dynamic.key}
                                            onChange={(e) => handleDynamicSettingChange(index, 'key', e.target.value)}
                                            className="w-full md:w-1/3 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-green text-gray-900 dark:text-white"
                                            placeholder="Clé (ex: my_custom_setting)"
                                        />
                                        <input
                                            type="text"
                                            value={dynamic.value}
                                            onChange={(e) => handleDynamicSettingChange(index, 'value', e.target.value)}
                                            className="w-full md:w-2/3 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-green text-gray-900 dark:text-white"
                                            placeholder="Valeur"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveDynamicField(index)}
                                            className="p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <button
                                type="button"
                                onClick={handleAddDynamicField}
                                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition flex items-center"
                            >
                                <i className="fas fa-plus mr-2"></i> Ajouter un paramètre personnalisé
                            </button>
                        </div>
                        {/* End section for dynamic settings */}

                        {/* Nouvelle section pour les statistiques de l'événement */}
                        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                            <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Statistiques de l\'événement</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="event_speakers_count" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('settings.event_speakers_count')}</label>
                                    <input
                                        type="text"
                                        name="event_speakers_count"
                                        id="event_speakers_count"
                                        value={settings?.event_speakers_count || ''}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-brand-green focus:border-brand-green text-gray-900 dark:text-white"
                                        placeholder="Ex: +25"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="event_participants_count" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('settings.event_participants_count')}</label>
                                    <input
                                        type="text"
                                        name="event_participants_count"
                                        id="event_participants_count"
                                        value={settings?.event_participants_count || ''}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-brand-green focus:border-brand-green text-gray-900 dark:text-white"
                                        placeholder="Ex: +500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="event_days_count" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('settings.event_days_count')}</label>
                                    <input
                                        type="text"
                                        name="event_days_count"
                                        id="event_days_count"
                                        value={settings?.event_days_count || ''}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-brand-green focus:border-brand-green text-gray-900 dark:text-white"
                                        placeholder="Ex: 2"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="event_workshops_count" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('settings.event_workshops_count')}</label>
                                    <input
                                        type="text"
                                        name="event_workshops_count"
                                        id="event_workshops_count"
                                        value={settings?.event_workshops_count || ''}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-brand-green focus:border-brand-green text-gray-900 dark:text-white"
                                        placeholder="Ex: +10"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Label for VideoUpload component */}
                        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('settings.about_video_url')}</label>
                            <VideoUpload
                                onUploadSuccess={handleVideoUploadSuccess}
                                currentVideoUrl={settings?.about_video_url}
                                uploadPath="/uploads/settings"
                            />
                        </div>
                        

                        <div className="flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={handleCancelEdit}
                                className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green disabled:opacity-50"
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
            )}
            {!isFormVisible && (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mt-8">
                    <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Paramètres Actuels (Récapitulatif)</h3>
                    {settings && (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Clé</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Valeur</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {Object.entries(settings).map(([key, value]) => (
                                        <tr key={key}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{t(`settings.${key}`) || key}</td>
                                            <td className="px-6 py-4 break-words text-sm text-gray-500 dark:text-gray-400">{String(value)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    {!settings && <p className="text-center text-gray-500">Aucun paramètre chargé.</p>}
                </div>
            )}
        </div>
    );
}



export default SettingsManager