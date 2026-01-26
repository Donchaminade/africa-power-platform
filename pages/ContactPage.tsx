import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PageHero from '../components/ui/PageHero';
import { useTranslation } from '../contexts/LanguageContext';
import { API_URL } from '../utils/config';

interface SiteSettings {
    contact_email?: string;
    contact_phone?: string;
    contact_address?: string;
    [key: string]: any;
}

const ContactPage: React.FC = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState('');
  const [settings, setSettings] = useState<SiteSettings>({});
  const [loadingSettings, setLoadingSettings] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
        try {
            const response = await axios.get(`${API_URL}/settings`);
            setSettings(response.data);
        } catch (error) {
            console.error("Failed to fetch settings:", error);
        } finally {
            setLoadingSettings(false);
        }
    };
    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const response = await axios.post(`${API_URL}/contact`, formData);
      if (response.status === 201) {
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      }
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      <PageHero title={t('contact.page_title')} subtitle={t('contact.page_subtitle')} />
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="prose prose-lg text-gray-600 dark:text-gray-300">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">{t('contact.form_title')}</h2>
            <p>{t('contact.form_description')}</p>
            <div className="mt-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t('contact.info_title')}</h3>
              {loadingSettings ? (
                <p>Chargement des informations de contact...</p>
              ) : (
                <>
                    <p><strong>{t('contact.info_email_label')}:</strong> <a href={`mailto:${settings.contact_email}`} className="text-brand-green hover:underline">{settings.contact_email}</a></p>
                    <p><strong>{t('contact.info_phone_label')}:</strong> {settings.contact_phone}</p>
                    <p><strong>{t('contact.info_address_label')}:</strong> {settings.contact_address}</p>
                </>
              )}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="sr-only">{t('contact.form_name')}</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={t('contact.form_name')}
                  required
                  className="block w-full shadow-sm py-3 px-4 placeholder-gray-500 focus:ring-brand-green focus:border-brand-green border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <label htmlFor="email" className="sr-only">{t('contact.form_email')}</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t('contact.form_email')}
                  required
                  className="block w-full shadow-sm py-3 px-4 placeholder-gray-500 focus:ring-brand-green focus:border-brand-green border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <label htmlFor="subject" className="sr-only">{t('contact.form_subject')}</label>
                <input
                  type="text"
                  name="subject"
                  id="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder={t('contact.form_subject')}
                  required
                  className="block w-full shadow-sm py-3 px-4 placeholder-gray-500 focus:ring-brand-green focus:border-brand-green border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <label htmlFor="message" className="sr-only">{t('contact.form_message')}</label>
                <textarea
                  name="message"
                  id="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={t('contact.form_message')}
                  required
                  className="block w-full shadow-sm py-3 px-4 placeholder-gray-500 focus:ring-brand-green focus:border-brand-green border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                ></textarea>
              </div>
              <div>
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-brand-green hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green disabled:opacity-50"
                >
                  {status === 'sending' ? t('contact.form_sending') : t('contact.form_send_button')}
                </button>
              </div>
              {status === 'success' && <p className="text-green-500">{t('contact.form_success')}</p>}
              {status === 'error' && <p className="text-red-500">{t('contact.form_error')}</p>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;