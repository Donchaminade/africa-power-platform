
import React from 'react';
import { useTranslation } from '../contexts/LanguageContext';

const Location: React.FC = () => {
    const { t } = useTranslation();
    return (
        <section className="py-24 bg-gradient-to-b from-white via-gray-50 to-white dark:from-black dark:via-gray-900 dark:to-black">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div>
                        <span className="text-brand-green font-semibold text-sm tracking-widest uppercase">{t('location.pre_title')}</span>
                        <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
                            {t('location.title_part1')} <span className="text-brand-green">{t('location.title_part2')}</span>
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-8">
                            {t('location.description')}
                        </p>
                        <div className="space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-brand-green/10 dark:bg-brand-green/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <i className="fas fa-map-marker-alt text-brand-green text-xl"></i>
                                </div>
                                <div>
                                    <h4 className="font-semibold">{t('location.address_title')}</h4>
                                    <p className="text-gray-500 dark:text-gray-400">{t('location.address_value')}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                 <div className="w-12 h-12 bg-brand-green/10 dark:bg-brand-green/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <i className="fas fa-car text-brand-green text-xl"></i>
                                </div>
                                <div>
                                    <h4 className="font-semibold">{t('location.access_title')}</h4>
                                    <p className="text-gray-500 dark:text-gray-400">{t('location.access_value')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 h-96">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.111833544525!2d2.404550615349471!3d6.379200995386005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x10249df1b9e54865%3A0x6b3589b389f1d24a!2sPalais%20des%20Congr%C3%A8s%20de%20Cotonou!5e0!3m2!1sfr!2sfr!4v1672522600000"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen={true}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade">
                        </iframe>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Location;
