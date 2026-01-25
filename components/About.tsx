
import React, { useState, useRef } from 'react';
import { useTranslation } from '../contexts/LanguageContext';

const About: React.FC = () => {
  const { t } = useTranslation();
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

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
            <div className="aspect-video rounded-2xl overflow-hidden border-2 border-gray-200 dark:border-gray-800 shadow-2xl">
              <video
                ref={videoRef}
                src="https://www.w3schools.com/html/mov_bbb.mp4"
                className="w-full h-full object-cover"
                loop
                playsInline
                controls={isPlaying}
              />
              {!isPlaying && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer" onClick={handlePlay}>
                  <button
                    aria-label="Play video"
                    className="play-button-animation w-20 h-20 bg-brand-green/80 rounded-full flex items-center justify-center text-white text-2xl backdrop-blur-sm transition-transform hover:scale-110 focus:outline-none"
                  >
                    <i className="fas fa-play ml-1"></i>
                  </button>
                </div>
              )}
            </div>
             <div className="absolute -bottom-6 -left-6 bg-brand-green p-6 rounded-xl shadow-xl text-white">
                <p className="text-3xl font-bold">{t('about.badge_line1')}</p>
                <p className="text-sm">{t('about.badge_line2')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
