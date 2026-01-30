import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import ImageUpload from '../ui/ImageUpload';
import { AuthUser } from '../Dashboard';

import { API_URL } from '../../config';

interface Speaker {
  id: number;
  name: string;
  title_fr: string;
  title_en: string;
  category_fr: string;
  category_en: string;
  image_url: string;
  twitter_url?: string;
  linkedin_url?: string;
  is_active: boolean;
  display_order: number;
}

interface SpeakersManagerProps {
  authUser: AuthUser | null;
}

const SpeakersManager: React.FC<SpeakersManagerProps> = ({ authUser }) => {
    const [speakers, setSpeakers] = useState<Speaker[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSpeaker, setEditingSpeaker] = useState<Speaker | null>(null);
    const [imageUrl, setImageUrl] = useState<string>('');

    const fetchSpeakers = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/speakers`);
            if (!response.ok) throw new Error('Failed to fetch speakers');
            const data = await response.json();
            setSpeakers(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSpeakers();
    }, []);

    const openModal = (speaker: Speaker | null = null) => {
        setEditingSpeaker(speaker);
        setImageUrl(speaker?.image_url || '');
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingSpeaker(null);
        setImageUrl('');
    };

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const speakerData = Object.fromEntries(formData.entries());
        
        const payload = {
            ...speakerData,
            image_url: imageUrl, // Use the URL from the state (updated by upload)
            is_active: (speakerData.is_active === 'on' || speakerData.is_active === '1') ? 1 : 0,
            display_order: Number(speakerData.display_order)
        };

        const url = editingSpeaker ? `${API_URL}/speakers/${editingSpeaker.id}` : `${API_URL}/speakers`;
        const method = editingSpeaker ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error('Failed to save speaker');
            
            await fetchSpeakers();
            closeModal();
        } catch (err) {
            alert('Error saving speaker: ' + (err instanceof Error ? err.message : 'Unknown error'));
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this speaker?')) {
             try {
                const response = await fetch(`${API_URL}/speakers/${id}`, { method: 'DELETE' });
                if (!response.ok) throw new Error('Failed to delete speaker');
                setSpeakers(speakers.filter(s => s.id !== id));
            } catch (err) {
                alert('Error deleting speaker: ' + (err instanceof Error ? err.message : 'Unknown error'));
            }
        }
    };

    const renderContent = () => {
        if (isLoading) return <div className="text-center p-8">Loading speakers...</div>;
        if (error) return <div className="text-center p-8 text-red-500">Error: {error}</div>;
        if (speakers.length === 0) return <div className="text-center p-8">No speakers found.</div>;
        
        return (
            <table className="w-full text-left align-middle">
                <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="p-4">Image</th>
                        <th className="p-4">Name</th>
                        <th className="p-4">Title (FR)</th>
                        <th className="p-4">Active</th>
                        <th className="p-4">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {speakers.map(speaker => (
                        <tr key={speaker.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                            <td className="p-2"><img src={speaker.image_url} alt={speaker.name} className="w-12 h-12 rounded-md object-cover" /></td>
                            <td className="p-4 font-semibold">{speaker.name}</td>
                            <td className="p-4">{speaker.title_fr}</td>
                            <td className="p-4">{speaker.is_active ? 'Yes' : 'No'}</td>
                            <td className="p-4 flex gap-4">
                                <button onClick={() => openModal(speaker)} className="text-gray-500 hover:text-blue-700" title="View Details"><i className="fas fa-eye"></i></button>
                                <button onClick={() => openModal(speaker)} className="text-blue-500 hover:text-blue-700" title="Edit"><i className="fas fa-edit"></i></button>
                                <button onClick={() => handleDelete(speaker.id)} className="text-red-500 hover:text-red-700" title="Delete"><i className="fas fa-trash"></i></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Manage Speakers</h2>
                <button onClick={() => openModal()} className="bg-green-600 text-white px-5 py-2 rounded-md font-semibold hover:bg-green-700 transition">
                    <i className="fas fa-plus mr-2"></i> Add Speaker
                </button>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md overflow-x-auto">
                {renderContent()}
            </div>

            <Modal isOpen={isModalOpen} onClose={closeModal} title={editingSpeaker ? 'Edit Speaker' : 'Add Speaker'}>
                <form onSubmit={handleSave} className="space-y-4">
                    <div><label className="block text-sm font-medium mb-1">Name</label><input name="name" defaultValue={editingSpeaker?.name} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" required /></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className="block text-sm font-medium mb-1">Title (FR)</label><input name="title_fr" defaultValue={editingSpeaker?.title_fr} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" required /></div>
                      <div><label className="block text-sm font-medium mb-1">Title (EN)</label><input name="title_en" defaultValue={editingSpeaker?.title_en} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" required /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-sm font-medium mb-1">Category (FR)</label><input name="category_fr" defaultValue={editingSpeaker?.category_fr} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" required /></div>
                        <div><label className="block text-sm font-medium mb-1">Category (EN)</label><input name="category_en" defaultValue={editingSpeaker?.category_en} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" required /></div>
                    </div>
                    
                    <ImageUpload onUploadSuccess={(path) => setImageUrl(path)} initialImageUrl={imageUrl} />
                    {/* Hidden input to hold the image URL for the form data */}
                    <input type="hidden" name="image_url" value={imageUrl} />

                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-sm font-medium mb-1">LinkedIn URL</label><input name="linkedin_url" defaultValue={editingSpeaker?.linkedin_url} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" /></div>
                        <div><label className="block text-sm font-medium mb-1">Twitter URL</label><input name="twitter_url" defaultValue={editingSpeaker?.twitter_url} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" /></div>
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-sm font-medium mb-1">Display Order</label><input type="number" name="display_order" defaultValue={editingSpeaker?.display_order ?? 0} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" /></div>
                        <div className="flex items-center gap-2 pt-6"><input type="checkbox" name="is_active" defaultChecked={editingSpeaker?.is_active ?? true} className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"/><label className="text-sm font-medium">Is Active</label></div>
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

export default SpeakersManager;
