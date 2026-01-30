import React, { useState } from 'react';
import PageHero from '../components/ui/PageHero';
import { API_URL } from '../admin/config';

const PartnersPage: React.FC = () => {
    const [companyName, setCompanyName] = useState('');
    const [contactName, setContactName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [message, setMessageContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [responseMessage, setResponseMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setResponseMessage(null);

        try {
            const response = await fetch(`${API_URL}/partnership-requests`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    company_name: companyName,
                    contact_name: contactName,
                    email,
                    phone,
                    message,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to submit request.');
            }

            setResponseMessage({ type: 'success', text: 'Votre demande a été envoyée avec succès ! Nous vous contacterons bientôt.' });
            setCompanyName('');
            setContactName('');
            setEmail('');
            setPhone('');
            setMessageContent('');
        } catch (err) {
            setResponseMessage({ type: 'error', text: err instanceof Error ? err.message : 'Une erreur est survenue.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <PageHero
                title={<>Devenez <span className="text-brand-green">Partenaire</span></>}
                subtitle="Associez votre marque à l'innovation et au leadership technologique en Afrique."
            />
            <section className="py-24 bg-white dark:bg-black">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold">Pourquoi nous soutenir ?</h2>
                            <p className="text-gray-600 dark:text-gray-300">En devenant partenaire de l'Africa Power Platform, vous vous positionnez au cœur de l'écosystème technologique africain. C'est une opportunité unique de :</p>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <i className="fas fa-check-circle text-brand-green mt-1"></i>
                                    <span><strong className="text-gray-800 dark:text-white">Gagner en visibilité</strong> auprès d'une audience qualifiée de professionnels, de décideurs et de talents.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <i className="fas fa-check-circle text-brand-green mt-1"></i>
                                    <span><strong className="text-gray-800 dark:text-white">Identifier et recruter</strong> les meilleurs talents de la Power Platform en Afrique.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <i className="fas fa-check-circle text-brand-green mt-1"></i>
                                    <span><strong className="text-gray-800 dark:text-white">Démontrer votre engagement</strong> pour le développement des compétences numériques sur le continent.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <i className="fas fa-check-circle text-brand-green mt-1"></i>
                                    <span><strong className="text-gray-800 dark:text-white">Réseauter</strong> avec des leaders de l'industrie et des innovateurs.</span>
                                </li>
                            </ul>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800/50 p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
                            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Contactez-nous</h3>
                            {responseMessage && (
                                <div className={`p-4 rounded-md mb-6 ${responseMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {responseMessage.text}
                                </div>
                            )}
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nom de l'entreprise</label>
                                    <input type="text" id="companyName" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-green" />
                                </div>
                                <div>
                                    <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Votre nom</label>
                                    <input type="text" id="contactName" value={contactName} onChange={(e) => setContactName(e.target.value)} required className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-green" />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-green" />
                                </div>
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Téléphone (Optionnel)</label>
                                    <input type="tel" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-green" />
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message (Optionnel)</label>
                                    <textarea id="message" value={message} onChange={(e) => setMessageContent(e.target.value)} rows={4} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-green"></textarea>
                                </div>
                                <button type="submit" disabled={isLoading} className="w-full bg-brand-green text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-green-700 transition-all disabled:bg-gray-400">
                                    {isLoading ? 'Envoi en cours...' : 'Envoyer la demande'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default PartnersPage;
