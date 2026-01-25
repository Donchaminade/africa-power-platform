import React, { useState } from 'react';
import { useTranslation } from '../contexts/LanguageContext';
import { API_URL } from '../utils/config';

interface PassOption {
    value: string;
    titleKey: string;
    subtitleKey: string;
    tagKey?: string;
    featuresKeys: string[];
    price: string;
    highlighted?: boolean;
}

interface PassCardProps {
    option: PassOption;
    isSelected: boolean;
    onSelect: (value: string) => void;
}

const PassCard: React.FC<PassCardProps> = ({ option, isSelected, onSelect }) => {
    const { t } = useTranslation();
    return (
        <div 
            className={`relative flex flex-col p-6 rounded-2xl shadow-lg border-2 cursor-pointer 
                        transition-all duration-300 ease-in-out 
                        ${isSelected 
                            ? 'border-brand-green bg-gradient-to-br from-brand-green/10 to-transparent scale-105' 
                            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 hover:border-brand-green/50 hover:shadow-xl'
                        }`}
            onClick={() => onSelect(option.value)}
        >
            {option.tagKey && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-green text-white px-3 py-0.5 rounded-full text-xs font-bold shadow-md">
                    {t(option.tagKey)}
                </span>
            )}
            <div className="text-center">
                <h3 className="text-xl font-bold mb-1">{t(option.titleKey)}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">{t(option.subtitleKey)}</p>
                <div className="mb-6">
                    <span className={`text-5xl font-black ${isSelected ? 'text-brand-green' : 'text-gray-900 dark:text-white'}`}>{option.price}</span>
                </div>
            </div>
            <ul className="space-y-3 mb-8 text-left flex-grow">
                {option.featuresKeys.map((featureKey, index) => (
                    <li key={index} className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                        <i className="fas fa-check text-green-500"></i><span>{t(featureKey)}</span>
                    </li>
                ))}
            </ul>
            <button
                type="button" // Important: type="button" to prevent form submission
                className={`w-full py-3 rounded-full font-semibold transition-all duration-300
                            ${isSelected 
                                ? 'bg-brand-green text-white hover:bg-green-700' 
                                : 'border-2 border-gray-900 dark:border-white text-gray-900 dark:text-white hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-black'
                            }`}
                onClick={() => onSelect(option.value)}
            >
                {t(option.buttonKey)}
            </button>
            {isSelected && (
                <div className="absolute top-2 right-2 flex items-center justify-center w-6 h-6 rounded-full bg-brand-green text-white">
                    <i className="fas fa-check text-xs"></i>
                </div>
            )}
        </div>
    );
};

const Registration: React.FC = () => {
    const { t } = useTranslation();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [company, setCompany] = useState('');
    const [jobTitle, setJobTitle] = useState(''); // New state for jobTitle
    const [country, setCountry] = useState('');   // New state for country
    const [passType, setPassType] = useState('conference');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const passOptions: PassOption[] = [
        {
            value: 'conference',
            titleKey: 'registration.pass1_title',
            subtitleKey: 'registration.pass1_subtitle',
            featuresKeys: ['registration.pass1_feature1', 'registration.pass1_feature2', 'registration.pass1_feature3'],
            price: t('registration.price'),
            buttonKey: 'registration.pass1_button',
        },
        {
            value: 'full',
            titleKey: 'registration.pass2_title',
            subtitleKey: 'registration.pass2_subtitle',
            tagKey: 'registration.pass2_tag',
            featuresKeys: ['registration.pass2_feature1', 'registration.pass2_feature2', 'registration.pass2_feature3'],
            price: t('registration.price'),
            buttonKey: 'registration.pass2_button',
            highlighted: true,
        },
        {
            value: 'bootcamp',
            titleKey: 'registration.pass3_title',
            subtitleKey: 'registration.pass3_subtitle',
            featuresKeys: ['registration.pass3_feature1', 'registration.pass3_feature2', 'registration.pass3_feature3'],
            price: t('registration.price'),
            buttonKey: 'registration.pass3_button',
        },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);

        try {
            const response = await fetch(`${API_URL}/registrations`, { // Using /api/registrations POST endpoint
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    first_name: firstName,
                    last_name: lastName,
                    email,
                    company,
                    job_title: jobTitle, // New field
                    country: country,     // New field
                    pass_type: passType,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed.');
            }

            setMessage({ type: 'success', text: 'Inscription réussie ! Un e-mail de confirmation vous sera envoyé prochainement.' });
            // Reset form
            setFirstName('');
            setLastName('');
            setEmail('');
            setCompany('');
            setJobTitle(''); // Reset new field
            setCountry('');   // Reset new field
            setPassType('conference');

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

                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    {/* Pass Options Selection */}
                    <div className="space-y-8">
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white">1. Choisissez votre Pass</h3>
                        <div className="grid md:grid-cols-1 gap-6"> {/* Changed to 1 column for PassCard display */}
                            {passOptions.map((option) => (
                                <PassCard 
                                    key={option.value}
                                    option={option}
                                    isSelected={passType === option.value}
                                    onSelect={setPassType}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Registration Form */}
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
                            <div> {/* New field for Job Title */}
                                <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Titre du Poste (Optionnel)</label>
                                <input type="text" id="jobTitle" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} 
                                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent transition-all" />
                            </div>
                            <div> {/* New field for Country */}
                                <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pays (Optionnel)</label>
                                <input type="text" id="country" value={country} onChange={(e) => setCountry(e.target.value)} 
                                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent transition-all" />
                            </div>
                            
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-brand-green text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-green-700 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                            >
                                {isLoading ? (
                                    <>
                                        <i className="fas fa-spinner fa-spin"></i> {t('registration.register_button')}
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-ticket-alt"></i> {t('registration.register_button')}
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Registration;
