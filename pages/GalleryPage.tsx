import React from 'react';
import Gallery from '../components/Gallery';
import PageHero from '../components/ui/PageHero';
import { useTranslation } from '../contexts/LanguageContext';

const GalleryPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div>
      <PageHero 
        title={t('gallery.page_title', 'Galerie')}
        breadcrumbs={[
          { label: t('home', 'Accueil'), path: '/' },
          { label: t('gallery.page_title', 'Galerie') }
        ]}
      />
      <Gallery />
    </div>
  );
};

export default GalleryPage;