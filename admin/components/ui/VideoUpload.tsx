import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../config';

interface VideoUploadProps {
    onUploadSuccess: (videoUrl: string) => void;
    currentVideoUrl?: string;
    uploadPath?: string; // Optional: specific path on the server to upload to
}

const VideoUpload: React.FC<VideoUploadProps> = ({ onUploadSuccess, currentVideoUrl, uploadPath = '/uploads' }) => {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setError(null);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setError('Veuillez sélectionner une vidéo à télécharger.');
            return;
        }

        const formData = new FormData();
        formData.append('video', file);
        formData.append('uploadPath', uploadPath); // Pass the desired upload path

        setUploading(true);
        setProgress(0);
        setError(null);

        try {
            const response = await axios.post(`${API_URL}/media-assets/upload-video`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        setProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
                    }
                },
            });

            if (response.status === 200 && response.data.videoUrl) {
                onUploadSuccess(response.data.videoUrl);
                setFile(null);
                postMessage({ type: 'success', text: 'Vidéo téléchargée avec succès !' });
            } else {
                throw new Error(response.data.message || 'Échec du téléchargement de la vidéo.');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Une erreur inconnue est survenue lors du téléchargement.');
            postMessage({ type: 'error', text: 'Échec du téléchargement de la vidéo: ' + (err instanceof Error ? err.message : 'Erreur inconnue') });
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 space-y-4 bg-white dark:bg-gray-800">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Télécharger une vidéo</label>
            
            {currentVideoUrl && (
                <div className="mb-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Vidéo actuelle :</p>
                    <video controls src={currentVideoUrl} className="max-w-full h-auto rounded-md border border-gray-200 dark:border-gray-700"></video>
                </div>
            )}

            <input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-900 dark:text-gray-200
                           file:mr-4 file:py-2 file:px-4
                           file:rounded-md file:border-0
                           file:text-sm file:font-semibold
                           file:bg-brand-green file:text-white
                           hover:file:bg-green-700"
            />
            {file && (
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleUpload}
                        disabled={uploading}
                        className="flex-shrink-0 bg-blue-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        {uploading ? <i className="fas fa-spinner fa-spin mr-2"></i> : <i className="fas fa-upload mr-2"></i>}
                        {uploading ? `Téléchargement (${progress}%)` : 'Démarrer le téléchargement'}
                    </button>
                    {uploading && (
                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                        </div>
                    )}
                </div>
            )}
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
    );
};

export default VideoUpload;
