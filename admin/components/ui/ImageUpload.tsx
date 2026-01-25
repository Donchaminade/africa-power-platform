import React, { useState, useCallback } from 'react';

const API_URL = 'http://localhost:4000/api';

interface ImageUploadProps {
    onUploadSuccess: (filePath: string) => void;
    initialImageUrl?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onUploadSuccess, initialImageUrl }) => {
    const [isUploading, setIsUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(initialImageUrl || null);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch(`${API_URL}/upload`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || 'Upload failed');
            }

            const result = await response.json();
            setPreview(result.filePath);
            onUploadSuccess(result.filePath);

        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setIsUploading(false);
        }
    }, [onUploadSuccess]);

    return (
        <div>
            <label className="block text-sm font-medium mb-1">Image</label>
            <div className="flex items-center gap-4">
                {preview && (
                    <img src={preview} alt="Preview" className="w-20 h-20 rounded-md object-cover" />
                )}
                <input
                    type="file"
                    name="image_file"
                    onChange={handleFileChange}
                    accept="image/png, image/jpeg, image/gif"
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                />
            </div>
            {isUploading && <p className="text-sm text-blue-500 mt-2">Uploading...</p>}
            {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
        </div>
    );
};

export default ImageUpload;
