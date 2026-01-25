import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import ImageUpload from '../ui/ImageUpload';
import { AuthUser } from '../Dashboard';

const API_URL = 'http://localhost:4000/api';

interface GalleryImage {
    id: number;
    title: string;
    description?: string;
    image_url: string;
    image_date?: string;
    display_order: number;
    is_active: boolean;
}

interface GalleryManagerProps {
  authUser: AuthUser | null;
}

const GalleryManager: React.FC<GalleryManagerProps> = ({ authUser }) => {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
    const [imageUrl, setImageUrl] = useState<string>('');

    const fetchImages = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/gallery`);
            if (!response.ok) throw new Error('Failed to fetch gallery images');
            const data = await response.json();
            setImages(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchImages();
    }, []);

    const openModal = (image: GalleryImage | null = null) => {
        setEditingImage(image);
        setImageUrl(image?.image_url || '');
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingImage(null);
        setImageUrl('');
    };

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const imageData = Object.fromEntries(formData.entries());
        
        if (!imageUrl) {
            alert('Please upload an image.');
            return;
        }

        const payload = {
            ...imageData,
            image_url: imageUrl,
            is_active: (imageData.is_active === 'on' || imageData.is_active === '1') ? 1 : 0,
            display_order: Number(imageData.display_order)
        };

        const url = editingImage ? `${API_URL}/gallery/${editingImage.id}` : `${API_URL}/gallery`;
        const method = editingImage ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error('Failed to save image');
            
            await fetchImages();
            closeModal();
        } catch (err) {
            alert('Error saving image: ' + (err instanceof Error ? err.message : 'Unknown error'));
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this image?')) {
             try {
                const response = await fetch(`${API_URL}/gallery/${id}`, { method: 'DELETE' });
                if (!response.ok) throw new Error('Failed to delete image');
                setImages(images.filter(img => img.id !== id));
            } catch (err) {
                alert('Error deleting image: ' + (err instanceof Error ? err.message : 'Unknown error'));
            }
        }
    };

    const renderContent = () => {
        if (isLoading) return <div className="text-center p-8">Loading gallery...</div>;
        if (error) return <div className="text-center p-8 text-red-500">Error: {error}</div>;
        if (images.length === 0) return <div className="text-center p-8">No images found in gallery.</div>;
        
        return (
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md overflow-x-auto">
                <table className="w-full text-left align-middle">
                    <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                            <th className="p-4">Image</th>
                            <th className="p-4">Title</th>
                            <th className="p-4">Date</th>
                            <th className="p-4">Active</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {images.map(image => (
                            <tr key={image.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                <td className="p-2">
                                    <img src={image.image_url} alt={image.title} className="w-16 h-16 rounded-md object-cover" />
                                </td>
                                <td className="p-4 font-semibold">{image.title}</td>
                                <td className="p-4">{image.image_date ? new Date(image.image_date).toLocaleDateString() : 'N/A'}</td>
                                <td className="p-4">{image.is_active ? 'Yes' : 'No'}</td>
                                <td className="p-4 flex gap-4">
                                    <button onClick={() => openModal(image)} className="text-gray-500 hover:text-blue-700" title="View Details"><i className="fas fa-eye"></i></button>
                                    <button onClick={() => openModal(image)} className="text-blue-500 hover:text-blue-700" title="Edit"><i className="fas fa-edit"></i></button>
                                    <button onClick={() => handleDelete(image.id)} className="text-red-500 hover:text-red-700" title="Delete"><i className="fas fa-trash"></i></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Manage Gallery</h2>
                <button onClick={() => openModal()} className="bg-green-600 text-white px-5 py-2 rounded-md font-semibold hover:bg-green-700 transition">
                    <i className="fas fa-plus mr-2"></i> Add Image
                </button>
            </div>
            {renderContent()}
            <Modal isOpen={isModalOpen} onClose={closeModal} title={editingImage ? 'Edit Image' : 'Add Image'}>
                <form onSubmit={handleSave} className="space-y-4">
                    <div><label className="block text-sm font-medium mb-1">Title</label><input name="title" defaultValue={editingImage?.title} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" required /></div>
                    <div><label className="block text-sm font-medium mb-1">Description</label><textarea name="description" defaultValue={editingImage?.description} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"></textarea></div>
                    
                    <ImageUpload onUploadSuccess={(path) => setImageUrl(path)} initialImageUrl={imageUrl} />
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-sm font-medium mb-1">Image Date</label><input type="date" name="image_date" defaultValue={editingImage?.image_date?.split('T')[0]} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" /></div>
                        <div><label className="block text-sm font-medium mb-1">Display Order</label><input type="number" name="display_order" defaultValue={editingImage?.display_order ?? 0} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" /></div>
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="checkbox" name="is_active" defaultChecked={editingImage?.is_active ?? true} className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"/>
                        <label className="text-sm font-medium">Is Active</label>
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={closeModal} className="px-5 py-2 rounded-md bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500">Cancel</button>
                        <button type="submit" className="px-5 py-2 rounded-md bg-green-600 text-white hover:bg-green-700">Save</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default GalleryManager;
