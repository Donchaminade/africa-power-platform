import React, { useState } from 'react';
import axios from 'axios';
import { useTranslation } from '../contexts/LanguageContext';
import { Link } from 'react-router-dom';

const Contact: React.FC = () => {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus('sending');
        try {
            await axios.post('http://localhost/africa-power-platform/api/newsletter', { email });
            setStatus('success');
            setEmail('');
        } catch (error) {
            setStatus('error');
        }
    };

    return (
        <section id="contact" className="py-24 bg-gradient-to-b from-white to-gray-50 dark:from-black dark:to-gray-900">
            <div className="max-w-4xl mx-auto px-6 text-center">
                <span className="text-brand-green font-semibold text-sm tracking-widest uppercase">{t('newsletter.pre_title')}</span>
                <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
                    {t('newsletter.title_part1')} <span className="text-brand-green">{t('newsletter.title_part2')}</span>
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-lg mb-8">
                    {t('newsletter.description')}
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t('newsletter.placeholder')}
                        required
                        className="flex-1 px-6 py-4 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:border-brand-green focus:outline-none transition-colors"
                    />
                    <button type="submit" disabled={status === 'sending'} className="bg-brand-green text-white px-8 py-4 rounded-full font-bold hover:bg-green-700 transition-colors whitespace-nowrap disabled:opacity-50">
                        {status === 'sending' ? t('newsletter.sending') : t('newsletter.button')} <i className="fas fa-paper-plane ml-2"></i>
                    </button>
                </form>
                {status === 'success' && <p className="text-green-500 mt-4">{t('newsletter.success')}</p>}
                {status === 'error' && <p className="text-red-500 mt-4">{t('newsletter.error')}</p>}

                <p className="mt-8 text-gray-600 dark:text-gray-400">
                    {t('contact.have_question')}{' '}
                    <Link to="/contact" className="text-brand-green hover:underline font-semibold">
                        {t('contact.contact_us')}
                    </Link>
                </p>
            </div>
        </section>
    );
};

export default Contact;