import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';

const API_URL = 'http://localhost:4000/api';

interface Sponsor {
    id: number;
    name: string;
    logo_url: string;
    website_url?: string; // Optional
    tier: 'platinum' | 'gold' | 'silver' | 'community';
    display_order: number;
    is_active: boolean;
}

const SponsorsManager: React.FC = () => {
    const [sponsors, setSponsors] = useState<Sponsor[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSponsor, setEditingSponsor] = useState<Sponsor | null>(null);

    const fetchSponsors = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/sponsors`);
            if (!response.ok) {
                throw new Error('Failed to fetch sponsors');
            }
            const data = await response.json();
            setSponsors(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSponsors();
    }, []);

    const openModal = (sponsor: Sponsor | null = null) => {
        setEditingSponsor(sponsor);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingSponsor(null);
    };

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const sponsorData = Object.fromEntries(formData.entries());

        const payload = {
            ...sponsorData,
            display_order: Number(sponsorData.display_order),
            is_active: sponsorData.is_active === 'on' ? 1 : 0, // Checkbox value
        };
        
        const url = editingSponsor
            ? `${API_URL}/sponsors/${editingSponsor.id}`
            : `${API_URL}/sponsors`;
            
        const method = editingSponsor ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('Failed to save sponsor');
            }
            
            await fetchSponsors();
            closeModal();
        } catch (err) {
            alert('Error saving sponsor: ' + (err instanceof Error ? err.message : 'Unknown error'));
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure?')) {
            try {
                const response = await fetch(`${API_URL}/sponsors/${id}`, { method: 'DELETE' });
                if (!response.ok) {
                    throw new Error('Failed to delete sponsor');
                }
                setSponsors(sponsors.filter(s => s.id !== id));
            } catch (err) {
                alert('Error deleting sponsor: ' + (err instanceof Error ? err.message : 'Unknown error'));
            }
        }
    };

    const renderContent = () => {
        if (isLoading) return <div className="text-center p-8">Loading sponsors...</div>;
        if (error) return <div className="text-center p-8 text-red-500">Error: {error}</div>;
        if (sponsors.length === 0) return <div className="text-center p-8">No sponsors found.</div>;

        return (
            <table className="w-full text-left">
                <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="p-4">Name</th>
                        <th className="p-4">Tier</th>
                        <th className="p-4">Website</th>
                        <th className="p-4">Active</th>
                        <th className="p-4">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {sponsors.map(sponsor => (
                        <tr key={sponsor.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                            <td className="p-4 font-semibold">{sponsor.name}</td>
                            <td className="p-4 capitalize">{sponsor.tier}</td>
                            <td className="p-4"><a href={sponsor.website_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{sponsor.website_url}</a></td>
                            <td className="p-4">{sponsor.is_active ? 'Yes' : 'No'}</td>
                            <td className="p-4 flex gap-4">
                                <button onClick={() => openModal(sponsor)} className="text-gray-500 hover:text-blue-700" title="View Details"><i className="fas fa-eye"></i></button>
                                <button onClick={() => openModal(sponsor)} className="text-blue-500 hover:text-blue-700" title="Edit"><i className="fas fa-edit"></i></button>
                                <button onClick={() => handleDelete(sponsor.id)} className="text-red-500 hover:text-red-700" title="Delete"><i className="fas fa-trash"></i></button>
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
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Manage Sponsors</h2>
                <button onClick={() => openModal()} className="bg-green-600 text-white px-5 py-2 rounded-md font-semibold hover:bg-green-700 transition">
                    <i className="fas fa-plus mr-2"></i> Add Sponsor
                </button>
            </div>
             <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md overflow-x-auto">
                {renderContent()}
            </div>
            <Modal isOpen={isModalOpen} onClose={closeModal} title={editingSponsor ? 'Edit Sponsor' : 'Add Sponsor'}>
                <form onSubmit={handleSave} className="space-y-4">
                    <div><label className="block text-sm font-medium mb-1">Name</label><input name="name" defaultValue={editingSponsor?.name} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" required/></div>
                    <div><label className="block text-sm font-medium mb-1">Logo URL</label><input name="logo_url" defaultValue={editingSponsor?.logo_url} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" required/></div>
                    <div><label className="block text-sm font-medium mb-1">Website URL</label><input name="website_url" defaultValue={editingSponsor?.website_url} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" /></div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Tier</label>
                        <select name="tier" defaultValue={editingSponsor?.tier} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" required>
                            <option value="platinum">Platinum</option>
                            <option value="gold">Gold</option>
                            <option value="silver">Silver</option>
                            <option value="community">Community</option>
                        </select>
                    </div>
                    <div><label className="block text-sm font-medium mb-1">Display Order</label><input type="number" name="display_order" defaultValue={editingSponsor?.display_order} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" required/></div>
                    <div className="flex items-center gap-2">
                        <input type="checkbox" name="is_active" defaultChecked={editingSponsor?.is_active} className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"/>
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

export default SponsorsManager;