import React, { useState, useEffect } from 'react';
import { useTranslation } from '../contexts/LanguageContext';
import { API_URL } from '../utils/config';
import { PassType } from '../utils/types';

const RegistrationPage: React.FC = () => {
    const { t, language } = useTranslation();
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

    useEffect(() => {
        const fetchPassTypes = async () => {
            try {
                const response = await fetch(`${API_URL}/passes`);
                if (!response.ok) {
                    throw new Error('Failed to fetch pass types');
                }
                const data: PassType[] = await response.json();
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

            const response = await fetch(`${API_URL}/registrations`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    first_name: firstName,
                    last_name: lastName,
                    email,
                    company,
                    job_title: jobTitle,
                    country: country,
                    pass_type: language === 'en' ? selectedPass.name_en : selectedPass.name_fr,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed.');
            }

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
                                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent transition-all" />
                                </div>
                                <div>
                                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nom</label>
                                    <input type="text" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required 
                                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent transition-all" />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required 
                                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent transition-all" />
                            </div>
                            <div>
                                <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Entreprise (Optionnel)</label>
                                <input type="text" id="company" value={company} onChange={(e) => setCompany(e.target.value)} 
                                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent transition-all" />
                            </div>
                            <div>
                                <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Titre du Poste (Optionnel)</label>
                                <input type="text" id="jobTitle" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} 
                                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent transition-all" />
                            </div>
                            <div>
                                <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pays (Optionnel)</label>
                                <input type="text" id="country" value={country} onChange={(e) => setCountry(e.target.value)} 
                                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent transition-all" />
                            </div>
                            
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-brand-green text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-green-700 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                            >
                                {isLoading ? <><i className="fas fa-spinner fa-spin"></i> Inscription en cours...</> : <><i className="fas fa-ticket-alt"></i> S'inscrire</>}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default RegistrationPage;
