import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import GalleryPage from './pages/GalleryPage';
import { LanguageProvider, useTranslation } from './contexts/LanguageContext'; // Ensure LanguageProvider is imported
import { SettingsProvider, useSettings } from './contexts/SettingsContext'; // Import SettingsProvider and useSettings
import { SeoSettings } from './utils/types'; // Still used for type definition, though data comes from context
import { API_URL } from './utils/config';

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <SettingsProvider>
        <AppContent />
      </SettingsProvider>
    </LanguageProvider>
  );
};

const AppContent: React.FC = () => {
  const { language } = useTranslation();
  const { settings, isLoading, error } = useSettings(); // Use settings from context

  useEffect(() => {
    if (!isLoading && !error && settings) {
      // Update title
      document.title = language === 'fr' ? settings.seo_meta_title_fr : settings.seo_meta_title_en;

      // Update meta description
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', language === 'fr' ? settings.seo_meta_description_fr : settings.seo_meta_description_en);

      // Update meta keywords
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute('content', language === 'fr' ? settings.seo_meta_keywords_fr : settings.seo_meta_keywords_en);
    }
  }, [settings, language, isLoading, error]); // Add isLoading and error to dependencies

  if (isLoading) {
    return <div>Chargement des paramètres du site...</div>;
  }

  if (error) {
    return <div>Erreur de chargement des paramètres du site : {error}</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="gallery" element={<GalleryPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;