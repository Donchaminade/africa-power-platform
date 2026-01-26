import React, { useEffect, useRef } from 'react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  title: string;
}

const VideoModal: React.FC<VideoModalProps> = ({ isOpen, onClose, videoUrl, title }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isOpen && videoUrl && videoRef.current && videoUrl.startsWith('/uploads/')) { // Only for local videos
      videoRef.current.play();
    }
  }, [isOpen, videoUrl]);

  if (!isOpen) return null;

  const isLocalVideo = videoUrl.startsWith('/uploads/');

  return (
    <div
      className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-black rounded-lg shadow-xl w-full max-w-3xl aspect-video"
        onClick={(e) => e.stopPropagation()}
      >
        {isLocalVideo ? (
          <video
            ref={videoRef}
            src={videoUrl}
            title={title}
            controls
            autoPlay
            className="w-full h-full object-cover rounded-lg"
            onEnded={onClose} // Close modal when video ends
          />
        ) : (
          <iframe
            src={`${videoUrl}?autoplay=1`} // Attempt to autoplay YouTube/Vimeo
            title={title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full object-cover rounded-lg"
          ></iframe>
        )}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white bg-black/50 rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 z-10"
          aria-label="Close video"
        >
          <i className="fas fa-times"></i>
        </button>
      </div>
    </div>
  );
};

export default VideoModal;
