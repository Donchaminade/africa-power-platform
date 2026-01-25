import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import GalleryPage from './pages/GalleryPage';
import { useTranslation } from './contexts/LanguageContext';
import { SeoSettings } from './utils/types';
import { API_URL } from './utils/config';

const App: React.FC = () => {
  const { language } = useTranslation();
  const [seoSettings, setSeoSettings] = useState<SeoSettings | null>(null);

  useEffect(() => {
    const fetchSeoSettings = async () => {
      try {
        const response = await fetch(`${API_URL}/settings`);
        if (!response.ok) {
          throw new Error('Failed to fetch SEO settings.');
        }
        const data: SeoSettings = await response.json();
        setSeoSettings(data);
      } catch (error) {
        console.error('Error fetching SEO settings:', error);
      }
    };
    fetchSeoSettings();
  }, []);

  useEffect(() => {
    if (seoSettings) {
      // Update title
      document.title = language === 'fr' ? seoSettings.seo_meta_title_fr : seoSettings.seo_meta_title_en;

      // Update meta description
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', language === 'fr' ? seoSettings.seo_meta_description_fr : seoSettings.seo_meta_description_en);

      // Update meta keywords
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute('content', language === 'fr' ? seoSettings.seo_meta_keywords_fr : seoSettings.seo_meta_keywords_en);
    }
  }, [seoSettings, language]);

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