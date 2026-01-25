
import React, { useState, useEffect } from 'react';
import { useTranslation } from '../contexts/LanguageContext';
import { GalleryImage } from '../utils/types';
import { API_URL } from '../utils/config';

// Modal Component for viewing a single image
const GalleryModal: React.FC<{
  image: GalleryImage;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}> = ({ image, onClose, onNext, onPrev }) => {
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNext, onPrev]);

  return (
    <div
      className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="relative" onClick={(e) => e.stopPropagation()}>
        <img
          src={image.image_url}
          alt={image.title}
          className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg"
        />
        <div className="absolute bottom-2 left-2 right-2 p-4 bg-black/50 rounded-b-lg text-white">
            <h3 className="font-bold text-lg">{image.title}</h3>
            {image.description && <p className="text-sm text-gray-300">{image.description}</p>}
        </div>
         <button onClick={onClose} className="absolute top-2 right-2 text-white bg-black/50 rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600">&times;</button>
         <button onClick={onPrev} className="absolute left-2 top-1/2 -translate-y-1/2 text-white bg-black/50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-700 text-2xl">‹</button>
         <button onClick={onNext} className="absolute right-2 top-1/2 -translate-y-1/2 text-white bg-black/50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-700 text-2xl">›</button>
      </div>
    </div>
  );
};

// Main Gallery Component
const Gallery: React.FC = () => {
    const { t } = useTranslation();
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await fetch(`${API_URL}/gallery`);
                if (!response.ok) throw new Error('Failed to fetch gallery data.');
                const data: GalleryImage[] = await response.json();
                setImages(data.filter(img => img.is_active));
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setIsLoading(false);
            }
        };
        fetchImages();
    }, []);

    const openModal = (index: number) => setSelectedImageIndex(index);
    const closeModal = () => setSelectedImageIndex(null);
    
    const handleNext = () => {
        if (selectedImageIndex !== null) {
            setSelectedImageIndex((prev) => (prev! + 1) % images.length);
        }
    };
    const handlePrev = () => {
        if (selectedImageIndex !== null) {
            setSelectedImageIndex((prev) => (prev! - 1 + images.length) % images.length);
        }
    };

    return (
        <section id="gallery" className="py-24 bg-white dark:bg-black">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <span className="text-brand-green font-semibold text-sm tracking-widest uppercase">Galerie</span>
                    <h2 className="text-4xl md:text-5xl font-bold mt-4">
                        Revivez les <span className="text-brand-green">Moments Forts</span>
                    </h2>
                     <p className="text-gray-500 dark:text-gray-400 mt-4 max-w-2xl mx-auto">
                        Explorez les souvenirs des éditions précédentes et l'énergie de notre communauté.
                    </p>
                </div>

                {isLoading && <div className="text-center">Chargement de la galerie...</div>}
                {error && <div className="text-center text-red-500">Erreur: {error}</div>}

                {!isLoading && !error && (
                     <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                        {images.map((image, index) => (
                            <div key={image.id} className="overflow-hidden rounded-lg break-inside-avoid" onClick={() => openModal(index)}>
                                <img 
                                    src={image.image_url} 
                                    alt={image.title} 
                                    className="w-full h-auto object-cover cursor-pointer transition-transform duration-300 hover:scale-105"
                                />
                            </div>
                        ))}
                    </div>
                )}
                 {!isLoading && !error && images.length === 0 && (
                    <p className="text-center text-gray-500">La galerie sera bientôt disponible.</p>
                )}
            </div>

            {selectedImageIndex !== null && (
                <GalleryModal 
                    image={images[selectedImageIndex]}
                    onClose={closeModal}
                    onNext={handleNext}
                    onPrev={handlePrev}
                />
            )}
        </section>
    );
};

export default Gallery;
