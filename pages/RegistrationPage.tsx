import React, { useState, useEffect } from 'react';
import { useTranslation } from '../contexts/LanguageContext';
import { PassType } from '../utils/types';
import { useSettings } from '../contexts/SettingsContext';
import axios from 'axios';
import Modal from '../components/ui/Modal';
import { API_URL } from '../utils/config';

const RegistrationPage: React.FC = () => {
    const { t, language } = useTranslation();
    const { settings, isLoading: isLoadingSettings, error: settingsError } = useSettings();

    // Form fields state
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [company, setCompany] = useState('');
    const [jobTitle, setJobTitle] = useState('');
    const [country, setCountry] = useState('');
    const [passTypeId, setPassTypeId] = useState<number | null>(null);

    // UI and status state
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [passTypes, setPassTypes] = useState<PassType[]>([]);
    const [registrationStatus, setRegistrationStatus] = useState<'open' | 'closed' | 'closing_soon' | 'not_yet_open'>('closed');
    const [daysRemaining, setDaysRemaining] = useState<number | null>(null);

    // Modal and download state
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [ticketId, setTicketId] = useState<number | null>(null);
    const [downloadStatus, setDownloadStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [downloadMessage, setDownloadMessage] = useState('');

    useEffect(() => {
        const fetchPassTypes = async () => {
            try {
                const response = await axios.get(`${API_URL}/passes`);
                if (response.status !== 200) {
                    throw new Error('Failed to fetch pass types');
                }
                const data: PassType[] = response.data;
                const activePasses = data.filter(p => p.is_active);
                setPassTypes(activePasses);
                if (activePasses.length > 0) {
                    setPassTypeId(activePasses[0].id);
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
            today.setHours(0, 0, 0, 0);

            const startDate = settings.registration_start_date ? new Date(settings.registration_start_date) : null;
            if (startDate) startDate.setHours(0, 0, 0, 0);

            const endDate = settings.registration_end_date ? new Date(settings.registration_end_date) : null;
            if (endDate) endDate.setHours(23, 59, 59, 999);

            if (startDate && endDate) {
                if (today < startDate) {
                    setRegistrationStatus('not_yet_open');
                } else if (today > endDate) {
                    setRegistrationStatus('closed');
                } else {
                    const diffTime = endDate.getTime() - today.getTime();
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    setDaysRemaining(diffDays);
                    setRegistrationStatus(diffDays <= 7 ? 'closing_soon' : 'open');
                }
            } else {
                setRegistrationStatus('closed');
            }
        }
    }, [settings, isLoadingSettings]);

    const resetFormAndState = () => {
        setFirstName('');
        setLastName('');
        setEmail('');
        setCompany('');
        setJobTitle('');
        setCountry('');
        setTicketId(null);
        setMessage(null);
        setDownloadStatus('idle');
    };

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
            if (!selectedPass) throw new Error('Invalid pass type selected.');

            const response = await axios.post(`${API_URL}/registrations`, {
                first_name: firstName,
                last_name: lastName,
                email,
                company,
                job_title: jobTitle,
                country,
                pass_type: language === 'en' ? selectedPass.name_en : selectedPass.name_fr,
            });

            if (response.status !== 201) {
                throw new Error(response.data.message || 'Registration failed.');
            }
            
            // Set ticket ID and show modal, but DO NOT reset the form here.
            setTicketId(response.data.id);
            setShowSuccessModal(true);
            setDownloadStatus('idle');
            
        } catch (err) {
            const errorMessage = (err as any).response?.data?.message || (err instanceof Error ? err.message : 'Une erreur inconnue est survenue.');
            setMessage({ type: 'error', text: errorMessage });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownloadTicket = async () => {
        if (!ticketId) {
            setDownloadStatus('error');
            setDownloadMessage('Erreur : ID de ticket non trouvé.');
            return;
        }
        setDownloadStatus('loading');
        setDownloadMessage('Préparation du ticket...');

        try {
            window.open(`${API_URL}/ticket.php?id=${ticketId}`, '_blank');
            setDownloadStatus('success');
            setDownloadMessage('Téléchargement réussi ! Cette fenêtre se fermera automatiquement.');

            setTimeout(() => {
                setShowSuccessModal(false);
                resetFormAndState(); // Reset everything after auto-close
            }, 2000);

        } catch (err) {
            console.error('Erreur lors du téléchargement du ticket:', err);
            setDownloadStatus('error');
            setDownloadMessage('Échec du téléchargement. Veuillez réessayer.');
        }
    };
    
    const handleCloseModal = () => {
        setShowSuccessModal(false);
        resetFormAndState(); // Reset everything on manual close
    };

    const isFormDisabled = registrationStatus !== 'open' && registrationStatus !== 'closing_soon';

    const renderModalContent = () => {
        switch (downloadStatus) {
            case 'loading':
                return (
                    <div className="p-4 text-center">
                        <i className="fas fa-spinner fa-spin text-brand-green text-5xl mb-4"></i>
                        <p className="text-lg text-gray-700 dark:text-gray-300">{downloadMessage}</p>
                    </div>
                );
            case 'success':
                return (
                    <div className="p-4 text-center">
                        <i className="fas fa-check-circle text-green-500 text-5xl mb-4"></i>
                        <p className="text-lg text-gray-700 dark:text-gray-300">{downloadMessage}</p>
                    </div>
                );
            case 'error':
                return (
                    <div className="p-4 text-center">
                        <i className="fas fa-exclamation-triangle text-red-500 text-5xl mb-4"></i>
                        <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">{downloadMessage}</p>
                        <div className="flex justify-center gap-4">
                            <button onClick={handleDownloadTicket} className="bg-brand-green text-white px-5 py-2 rounded-md font-semibold hover:bg-green-700 transition">
                                <i className="fas fa-redo mr-2"></i> Réessayer
                            </button>
                            <button onClick={handleCloseModal} className="px-5 py-2 rounded-md bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500 transition">
                                Fermer
                            </button>
                        </div>
                    </div>
                );
            case 'idle':
            default:
                return (
                    <div className="p-4 text-center">
                        <i className="fas fa-check-circle text-green-500 text-5xl mb-4"></i>
                        <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">{t('registration.success_modal_message')}</p>
                        <div className="flex justify-center gap-4">
                            <button onClick={handleDownloadTicket} disabled={!ticketId} className="bg-brand-green text-white px-5 py-2 rounded-md font-semibold hover:bg-green-700 transition disabled:opacity-50">
                                <i className="fas fa-ticket-alt mr-2"></i> {t('registration.button_my_ticket')}
                            </button>
                            <button onClick={handleCloseModal} className="px-5 py-2 rounded-md bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500 transition">
                                {t('registration.button_quit')}
                            </button>
                        </div>
                    </div>
                );
        }
    };

    return (
        <section id="register" className="py-24 bg-gradient-to-br from-white to-gray-100 dark:from-black dark:to-gray-900">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <span className="text-brand-green font-semibold text-sm tracking-widest uppercase">{t('registration.pre_title')}</span>
                    <h2 className="text-4xl md:text-5xl font-bold mt-4">{t('registration.title')}</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-4 max-w-2xl mx-auto">{t('registration.description')}</p>
                </div>
                
                {isLoadingSettings && <p className="text-center text-gray-500 mb-4">Chargement des paramètres d'inscription...</p>}
                {settingsError && <p className="text-center text-red-500 mb-4">Erreur: {settingsError}</p>}
                
                {!isLoadingSettings && !settingsError && (
                    <>
                        {registrationStatus === 'not_yet_open' && <div className="p-4 rounded-md mb-8 max-w-2xl mx-auto bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300"><i className="fas fa-info-circle mr-2"></i>Les inscriptions ouvriront le {new Date(settings.registration_start_date!).toLocaleDateString('fr-FR')}.</div>}
                        {registrationStatus === 'closed' && <div className="p-4 rounded-md mb-8 max-w-2xl mx-auto bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300"><i className="fas fa-exclamation-triangle mr-2"></i>Les inscriptions sont maintenant closes.</div>}
                        {registrationStatus === 'closing_soon' && daysRemaining !== null && <div className="p-4 rounded-md mb-8 max-w-2xl mx-auto bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300"><i className="fas fa-exclamation-circle mr-2"></i>Dépêchez-vous ! Les inscriptions se clôturent dans {daysRemaining} jour(s) !</div>}
                    </>
                )}

                {message && <div className={`p-4 rounded-md mb-8 max-w-xl mx-auto ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{message.text}</div>}

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
                                                <input type="radio" name="passType" value={pass.id} checked={passTypeId === pass.id} onChange={() => setPassTypeId(pass.id)} className="h-5 w-5 text-brand-green focus:ring-brand-green border-gray-300" disabled={isFormDisabled} />
                                            </td>
                                            <td className="p-4 font-semibold">
                                                {language === 'fr' ? pass.name_fr : pass.name_en}
                                                {pass.tag_fr && <span className="ml-2 text-xs bg-brand-green text-white px-2 py-0.5 rounded-full">{language === 'fr' ? pass.tag_fr : pass.tag_en}</span>}
                                                <p className="font-normal text-sm text-gray-500">{language === 'fr' ? pass.description_fr : pass.description_en}</p>
                                            </td>
                                            <td className="p-4">
                                                <ul className="space-y-1">{(language === 'fr' ? pass.features_fr : pass.features_en).map((feature, index) => (<li key={index} className="text-sm flex items-center gap-2"><i className="fas fa-check-circle text-green-500 text-xs"></i><span>{feature}</span></li>))}</ul>
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
                                    <input type="text" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent transition-all" disabled={isFormDisabled} />
                                </div>
                                <div>
                                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nom</label>
                                    <input type="text" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent transition-all" disabled={isFormDisabled} />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent transition-all" disabled={isFormDisabled} />
                            </div>
                            <div>
                                <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Entreprise (ou Etudiant?)</label>
                                <input type="text" id="company" value={company} onChange={(e) => setCompany(e.target.value)} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent transition-all" disabled={isFormDisabled} />
                            </div>
                            <div>
                                <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Profession (Optionnel)</label>
                                <input type="text" id="jobTitle" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent transition-all" disabled={isFormDisabled} />
                            </div>
                            <div>
                                <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pays</label>
                                <input type="text" id="country" value={country} onChange={(e) => setCountry(e.target.value)} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent transition-all" disabled={isFormDisabled} />
                            </div>
                            
                            <button type="submit" disabled={isLoading || isFormDisabled} className="w-full bg-brand-green text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-green-700 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl">
                                {isLoading ? <><i className="fas fa-spinner fa-spin"></i> Inscription en cours...</> : <><i className="fas fa-ticket-alt"></i> S'inscrire</>}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <Modal isOpen={showSuccessModal} onClose={handleCloseModal} title={t('registration.success_modal_title')}>
                {renderModalContent()}
            </Modal>
        </section>
    );
};

export default RegistrationPage;
