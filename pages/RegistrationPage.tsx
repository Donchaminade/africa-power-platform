import React, { useState, useEffect } from 'react';
import { useTranslation } from '../contexts/LanguageContext';
import { API_URL } from '../utils/config';
import { PassType } from '../utils/types';
import { useSettings } from '../contexts/SettingsContext'; // Import useSettings
import axios from 'axios'; // Ensure axios is imported
import Modal from '../components/ui/Modal'; // Import the Modal component

const RegistrationPage: React.FC = () => {
    const { t, language } = useTranslation();
    const { settings, isLoading: isLoadingSettings, error: settingsError } = useSettings(); // Get settings from context

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [company, setCompany] = useState('');
    const [jobTitle, setJobTitle] = useState('');
    const [country, setCountry] = useState('');
    const [passTypeId, setPassTypeId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [passTypes, setPassTypes] = useState<PassType[]>([]);

    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showAlertModal, setShowAlertModal] = useState(false);
    const [ticketId, setTicketId] = useState<number | null>(null);
    const [hasDownloadedTicket, setHasDownloadedTicket] = useState(false);

    const [registrationStatus, setRegistrationStatus] = useState<'open' | 'closed' | 'closing_soon' | 'not_yet_open'>('closed');
    const [daysRemaining, setDaysRemaining] = useState<number | null>(null);

    useEffect(() => {
        const fetchPassTypes = async () => {
            try {
                const response = await axios.get(`${API_URL}/passes`); // Changed to axios
                if (response.status !== 200) {
                    throw new Error('Failed to fetch pass types');
                }
                const data: PassType[] = await response.data;
                setPassTypes(data);
                if (data.length > 0) {
                    setPassTypeId(data[0].id); // Select the first pass by default
                }
            } catch (error) {
                console.error(error);
                setMessage({ type: 'error', text: 'Impossible de charger les types de pass.' });
            }
        };
        fetchPassTypes();
    }, []);

    useEffect(() => {
        if (!isLoadingSettings && settings) {
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Normalize today's date

            const startDate = settings.registration_start_date ? new Date(settings.registration_start_date) : null;
            if (startDate) startDate.setHours(0, 0, 0, 0);

            const endDate = settings.registration_end_date ? new Date(settings.registration_end_date) : null;
            if (endDate) endDate.setHours(23, 59, 59, 999); // End of the day

            if (startDate && endDate) {
                if (today < startDate) {
                    setRegistrationStatus('not_yet_open');
                } else if (today > endDate) {
                    setRegistrationStatus('closed');
                } else {
                    const diffTime = endDate.getTime() - today.getTime();
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    setDaysRemaining(diffDays);

                    if (diffDays <= 7) { // Alert if 7 days or less remaining
                        setRegistrationStatus('closing_soon');
                    } else {
                        setRegistrationStatus('open');
                    }
                }
            } else {
                setRegistrationStatus('closed'); // Default if dates are not set
            }
        }
    }, [settings, isLoadingSettings]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passTypeId === null) {
            setMessage({ type: 'error', text: 'Veuillez sélectionner un type de pass.' });
            return;
        }
        setIsLoading(true);
        setMessage(null);

        try {
            const selectedPass = passTypes.find(p => p.id === passTypeId);
            if (!selectedPass) {
                throw new Error('Invalid pass type selected.');
            }

            const response = await axios.post(`${API_URL}/registrations`, { // Changed to axios
                first_name: firstName,
                last_name: lastName,
                email,
                company,
                job_title: jobTitle,
                country: country,
                pass_type: language === 'en' ? selectedPass.name_en : selectedPass.name_fr,
            });

            const data = await response.data; // Changed for axios

            if (response.status !== 201) { // Changed for axios
                throw new Error(data.message || 'Registration failed.');
            }

            // --- Trigger success modal and store ticket ID ---
            setTicketId(data.id); // Assuming backend returns { id: ... }
            setShowSuccessModal(true);
            setHasDownloadedTicket(false); // Reset for new registration
            // --- End trigger success modal ---

            setMessage({ type: 'success', text: 'Inscription réussie ! Un e-mail de confirmation vous sera envoyé prochainement.' });
            setFirstName('');
            setLastName('');
            setEmail('');
            setCompany('');
            setJobTitle('');
            setCountry('');
        } catch (err) {
            setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Une erreur inconnue est survenue lors de l\'inscription.' });
        } finally {
            setIsLoading(false);
        }
    };

    const isFormDisabled = registrationStatus !== 'open' && registrationStatus !== 'closing_soon';

    // --- Modal related functions ---
    const handleDownloadTicket = async () => {
        if (!ticketId) {
            setMessage({ type: 'error', text: 'Aucun ticket ID disponible pour le téléchargement.' });
            return;
        }
        console.log("Downloading ticket for ID:", ticketId); // Added for diagnosis
        try {
            const response = await axios.get(`${API_URL}/ticket/${ticketId}`, {
                responseType: 'blob', // Important for downloading files
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `ticket-${ticketId}.pdf`); // Or whatever filename you want
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(url); // Clean up the URL

            setHasDownloadedTicket(true);
            setMessage({ type: 'success', text: 'Votre ticket a été téléchargé avec succès !' });
        } catch (err) {
            console.error('Erreur lors du téléchargement du ticket:', err);
            setMessage({ type: 'error', text: 'Échec du téléchargement du ticket. Veuillez réessayer.' });
        }
    };

    const handleCloseSuccessModal = () => {
        if (!hasDownloadedTicket) {
            setShowAlertModal(true); // Show alert if ticket not downloaded
        } else {
            setShowSuccessModal(false); // Close success modal directly
            // Optionally clear form and message after full closure
            setMessage(null);
            setTicketId(null);
        }
    };

    const handleCloseAlertModal = () => {
        setShowAlertModal(false);
        setShowSuccessModal(false); // Close both modals
        setMessage(null);
        setTicketId(null);
        // Reset form fields
        setFirstName(''); setLastName(''); setEmail(''); setCompany(''); setJobTitle(''); setCountry('');
    };

    const handleReturnToSuccessModal = () => {
        setShowAlertModal(false); // Hide alert, return to success modal
    };

    // --- End modal related functions ---

    return (
        <section id="register" className="py-24 bg-gradient-to-br from-white to-gray-100 dark:from-black dark:to-gray-900">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <span className="text-brand-green font-semibold text-sm tracking-widest uppercase">{t('registration.pre_title')}</span>
                    <h2 className="text-4xl md:text-5xl font-bold mt-4">
                        {t('registration.title')}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-4 max-w-2xl mx-auto">
                        {t('registration.description')}
                    </p>
                </div>
                
                {isLoadingSettings && <p className="text-center text-gray-500 mb-4">Chargement des paramètres d'inscription...</p>}
                {settingsError && <p className="text-center text-red-500 mb-4">Erreur de chargement des paramètres d'inscription: {settingsError}</p>}

                {!isLoadingSettings && !settingsError && (
                    <>
                        {registrationStatus === 'not_yet_open' && (
                            <div className="p-4 rounded-md mb-8 max-w-2xl mx-auto bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                                <i className="fas fa-info-circle mr-2"></i> Les inscriptions ouvriront le {new Date(settings.registration_start_date).toLocaleDateString('fr-FR')}.
                            </div>
                        )}
                        {registrationStatus === 'closed' && (
                            <div className="p-4 rounded-md mb-8 max-w-2xl mx-auto bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300">
                                <i className="fas fa-exclamation-triangle mr-2"></i> Les inscriptions sont maintenant closes.
                            </div>
                        )}
                        {registrationStatus === 'closing_soon' && daysRemaining !== null && (
                            <div className="p-4 rounded-md mb-8 max-w-2xl mx-auto bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300">
                                <i className="fas fa-exclamation-circle mr-2"></i> Dépêchez-vous ! Les inscriptions se clôturent dans {daysRemaining} jour(s) !
                            </div>
                        )}
                    </>
                )}

                {message && (
                    <div className={`p-4 rounded-md mb-8 max-w-xl mx-auto ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {message.text}
                    </div>
                )}

                <div className="grid lg:grid-cols-3 gap-12 items-start">
                    <div className="lg:col-span-2 space-y-8">
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white">1. Choisissez votre Pass</h3>
                        <div className="overflow-x-auto bg-white dark:bg-gray-800/50 p-4 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-gray-200 dark:border-gray-700">
                                        <th className="p-4"></th>
                                        <th className="p-4">Pass</th>
                                        <th className="p-4">Avantages</th>
                                        <th className="p-4">Prix</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {passTypes.map((pass) => (
                                        <tr key={pass.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                            <td className="p-4">
                                                <input
                                                    type="radio"
                                                    name="passType"
                                                    value={pass.id}
                                                    checked={passTypeId === pass.id}
                                                    onChange={() => setPassTypeId(pass.id)}
                                                    className="h-5 w-5 text-brand-green focus:ring-brand-green border-gray-300"
                                                    disabled={isFormDisabled}
                                                />
                                            </td>
                                            <td className="p-4 font-semibold">
                                                {language === 'fr' ? pass.name_fr : pass.name_en}
                                                {pass.tag_fr && <span className="ml-2 text-xs bg-brand-green text-white px-2 py-0.5 rounded-full">{language === 'fr' ? pass.tag_fr : pass.tag_en}</span>}
                                                <p className="font-normal text-sm text-gray-500">{language === 'fr' ? pass.description_fr : pass.description_en}</p>
                                            </td>
                                            <td className="p-4">
                                                <ul className="space-y-1">
                                                {(language === 'fr' ? pass.features_fr : pass.features_en).map((feature, index) => (
                                                    <li key={index} className="text-sm flex items-center gap-2">
                                                        <i className="fas fa-check-circle text-green-500 text-xs"></i>
                                                        <span>{feature}</span>
                                                    </li>
                                                ))}
                                                </ul>
                                            </td>
                                            <td className="p-4 font-bold text-lg">{language === 'fr' ? pass.price_fr : pass.price_en}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800/50 p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">2. Vos Informations</h3>
                        <form onSubmit={handleSubmit} className="space-y-6">
                             <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prénom</label>
                                    <input type="text" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required 
                                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent transition-all"
                                        disabled={isFormDisabled} />
                                </div>
                                <div>
                                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nom</label>
                                    <input type="text" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required 
                                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent transition-all"
                                        disabled={isFormDisabled} />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required 
                                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent transition-all"
                                    disabled={isFormDisabled} />
                            </div>
                            <div>
                                <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Entreprise (Optionnel)</label>
                                <input type="text" id="company" value={company} onChange={(e) => setCompany(e.target.value)} 
                                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent transition-all"
                                    disabled={isFormDisabled} />
                            </div>
                            <div>
                                <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Titre du Poste (Optionnel)</label>
                                <input type="text" id="jobTitle" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} 
                                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent transition-all"
                                    disabled={isFormDisabled} />
                            </div>
                            <div>
                                <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pays (Optionnel)</label>
                                <input type="text" id="country" value={country} onChange={(e) => setCountry(e.target.value)} 
                                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent transition-all"
                                    disabled={isFormDisabled} />
                            </div>
                            
                            <button
                                type="submit"
                                disabled={isLoading || isFormDisabled}
                                className="w-full bg-brand-green text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-green-700 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                            >
                                {isLoading ? <><i className="fas fa-spinner fa-spin"></i> Inscription en cours...</> : <><i className="fas fa-ticket-alt"></i> S'inscrire</>}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Success Modal */}
            <Modal isOpen={showSuccessModal} onClose={handleCloseSuccessModal} title={t('registration.success_modal_title')} icon="fas fa-check-circle text-green-500">
                <div className="p-4 text-center">
                    <i className="fas fa-check-circle text-green-500 text-5xl mb-4"></i>
                    <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">{t('registration.success_modal_message')}</p>
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={handleDownloadTicket}
                            className="bg-brand-green text-white px-5 py-2 rounded-md font-semibold hover:bg-green-700 transition"
                            disabled={!ticketId}
                        >
                            <i className="fas fa-ticket-alt mr-2"></i> {t('registration.button_my_ticket')}
                        </button>
                        <button
                            onClick={handleCloseSuccessModal}
                            className="px-5 py-2 rounded-md bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500 transition"
                        >
                            {t('registration.button_quit')}
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Alert Modal (if user tries to quit without downloading ticket) */}
            <Modal isOpen={showAlertModal} onClose={handleCloseAlertModal} title={t('registration.alert_modal_title')} icon="fas fa-exclamation-triangle text-yellow-500">
                <div className="p-4 text-center">
                    <i className="fas fa-exclamation-triangle text-yellow-500 text-5xl mb-4"></i>
                    <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">{t('registration.alert_modal_message')}</p>
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={handleReturnToSuccessModal}
                            className="bg-brand-green text-white px-5 py-2 rounded-md font-semibold hover:bg-green-700 transition"
                        >
                            <i className="fas fa-arrow-left mr-2"></i> {t('registration.button_return')}
                        </button>
                        <button
                            onClick={handleCloseAlertModal}
                            className="px-5 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
                        >
                            <i className="fas fa-times mr-2"></i> {t('registration.button_quit_anyway')}
                        </button>
                    </div>
                </div>
            </Modal>
        </section>
    );
};

export default RegistrationPage;
