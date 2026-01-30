
import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from '../contexts/LanguageContext';
import { API_URL } from '../utils/config';
import axios from 'axios';
import VideoModal from './VideoModal'; // Import VideoModal

interface SiteSettings {
    about_video_url?: string;
    [key: string]: any;
}

const AboutComponent: React.FC = () => {
  const { t } = useTranslation();
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [settings, setSettings] = useState<SiteSettings>({});
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

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

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };
  
  const animationStyle = `
    @keyframes pulse {
      0% {
        transform: scale(1);
        box-shadow: 0 0 0 0 rgba(0, 168, 89, 0.7);
      }
      70% {
        transform: scale(1.1);
        box-shadow: 0 0 0 25px rgba(0, 168, 89, 0);
      }
      100% {
        transform: scale(1);
        box-shadow: 0 0 0 0 rgba(0, 168, 89, 0);
      }
    }
    .play-button-animation {
      animation: pulse 2s infinite;
    }
  `;

  return (
    <section id="about" className="py-24 bg-gradient-to-b from-white via-gray-50 to-white dark:from-black dark:via-gray-900 dark:to-black">
       <style>{animationStyle}</style>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-brand-green font-semibold text-sm tracking-widest uppercase">{t('about.pre_title')}</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
              {t('about.title_part1')} <span className="text-brand-green">{t('about.title_part2')}</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-6">
              {t('about.p1')}
            </p>
            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-8">
              {t('about.p2_part1')} <strong className="text-gray-900 dark:text-white">{t('about.p2_strong1')}</strong> {t('about.p2_part2')} <strong className="text-gray-900 dark:text-white">{t('about.p2_strong2')}</strong>{t('about.p2_part3')}
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-800/50 px-4 py-3 rounded-lg">
                <i className="fas fa-lightbulb text-brand-green text-xl"></i>
                <span>{t('about.tag1')}</span>
              </div>
              <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-800/50 px-4 py-3 rounded-lg">
                <i className="fas fa-users text-brand-green text-xl"></i>
                <span>{t('about.tag2')}</span>
              </div>
              <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-800/50 px-4 py-3 rounded-lg">
                <i className="fas fa-rocket text-brand-green text-xl"></i>
                <span>{t('about.tag3')}</span>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-video rounded-2xl overflow-hidden border-2 border-gray-200 dark:border-gray-800 shadow-2xl relative flex items-center justify-center">
              {loadingSettings ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-500">Chargement de la vidéo...</div>
              ) : settings.about_video_url ? (
                <>
                  {/* Thumbnail / Placeholder */}
                  <div 
                    className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center cursor-pointer relative"
                    onClick={() => setIsVideoModalOpen(true)}
                  > {/* You might want a proper thumbnail here if available. For now, a generic play icon on a dark background */}
                    <i className="fas fa-play-circle text-brand-green text-7xl relative z-10 play-button-animation"></i>
                    {/* Optional: if there's an image for the video thumbnail, use it here */}
                    {/* <img src="URL_TO_VIDEO_THUMBNAIL" alt="Video Thumbnail" className="absolute inset-0 w-full h-full object-cover"/> */}
                    <div className="absolute inset-0 bg-black opacity-40 hover:opacity-20 transition-opacity"></div>
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-500">Vidéo non disponible</div>
              )}
            </div>
             <div className="absolute -bottom-6 -left-6 bg-brand-green p-6 rounded-xl shadow-xl text-white"><i className="fas fa-certificate text-white text-3xl"></i>
             
                <p className="text-5xl font-bold leading-none">{settings.event_edition_number} </p>
                <p className="text-sm leading-none">Édition</p>
            </div>
          </div>
                    </div>
                </div>
                {settings.about_video_url && (
                    <VideoModal
                        isOpen={isVideoModalOpen}
                        onClose={() => setIsVideoModalOpen(false)}
                        videoUrl={settings.about_video_url}
                        title={t('about.video_title')} // Assuming a translation key for video title
                    />
                )}
            </section>
          );
        };
export { AboutComponent as default };
