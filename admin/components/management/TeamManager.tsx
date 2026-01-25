import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import ImageUpload from '../ui/ImageUpload';

const API_URL = 'http://localhost:4000/api';

interface TeamMember {
    id: number;
    name: string;
    role_fr: string;
    role_en: string;
    image_url: string;
    linkedin_url?: string;
    twitter_url?: string;
    display_order: number;
    is_active: boolean;
}

const TeamManager: React.FC = () => {
    const [team, setTeam] = useState<TeamMember[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
    const [imageUrl, setImageUrl] = useState<string>('');

    const fetchTeam = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/team`);
            if (!response.ok) throw new Error('Failed to fetch team members');
            const data = await response.json();
            setTeam(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTeam();
    }, []);

    const openModal = (member: TeamMember | null = null) => {
        setEditingMember(member);
        setImageUrl(member?.image_url || '');
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingMember(null);
        setImageUrl('');
    };

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const memberData = Object.fromEntries(formData.entries());
        
        const payload = {
            ...memberData,
            image_url: imageUrl,
            display_order: Number(memberData.display_order),
            is_active: (memberData.is_active === 'on' || memberData.is_active === '1') ? 1 : 0,
        };

        const url = editingMember ? `${API_URL}/team/${editingMember.id}` : `${API_URL}/team`;
        const method = editingMember ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (!response.ok) throw new Error('Failed to save team member');
            await fetchTeam();
            closeModal();
        } catch (err) {
            alert('Error saving member: ' + (err instanceof Error ? err.message : 'Unknown error'));
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure?')) {
            try {
                const response = await fetch(`${API_URL}/team/${id}`, { method: 'DELETE' });
                if (!response.ok) throw new Error('Failed to delete team member');
                setTeam(team.filter(m => m.id !== id));
            } catch (err) {
                alert('Error deleting member: ' + (err instanceof Error ? err.message : 'Unknown error'));
            }
        }
    };

    const renderContent = () => {
        if (isLoading) return <div className="text-center p-8">Loading team members...</div>;
        if (error) return <div className="text-center p-8 text-red-500">Error: {error}</div>;
        if (team.length === 0) return <div className="text-center p-8">No team members found.</div>;
        
        return (
            <table className="w-full text-left align-middle">
                <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="p-4">Image</th>
                        <th className="p-4">Name</th>
                        <th className="p-4">Role (FR)</th>
                        <th className="p-4">Active</th>
                        <th className="p-4">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {team.map(member => (
                        <tr key={member.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                            <td className="p-2"><img src={member.image_url} alt={member.name} className="w-12 h-12 rounded-md object-cover" /></td>
                            <td className="p-4 font-semibold">{member.name}</td>
                            <td className="p-4">{member.role_fr}</td>
                            <td className="p-4">{member.is_active ? 'Yes' : 'No'}</td>
                            <td className="p-4 flex gap-4">
                                <button onClick={() => openModal(member)} className="text-gray-500 hover:text-blue-700" title="View Details"><i className="fas fa-eye"></i></button>
                                <button onClick={() => openModal(member)} className="text-blue-500 hover:text-blue-700" title="Edit"><i className="fas fa-edit"></i></button>
                                <button onClick={() => handleDelete(member.id)} className="text-red-500 hover:text-red-700" title="Delete"><i className="fas fa-trash"></i></button>
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
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Manage Team</h2>
                <button onClick={() => openModal()} className="bg-green-600 text-white px-5 py-2 rounded-md font-semibold hover:bg-green-700 transition">
                    <i className="fas fa-plus mr-2"></i> Add Member
                </button>
            </div>
             <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md overflow-x-auto">
                {renderContent()}
            </div>
            <Modal isOpen={isModalOpen} onClose={closeModal} title={editingMember ? 'Edit Member' : 'Add Member'}>
                <form onSubmit={handleSave} className="space-y-4">
                    <div><label className="block text-sm font-medium mb-1">Name</label><input name="name" defaultValue={editingMember?.name} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" required/></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-sm font-medium mb-1">Role (FR)</label><input name="role_fr" defaultValue={editingMember?.role_fr} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" required/></div>
                        <div><label className="block text-sm font-medium mb-1">Role (EN)</label><input name="role_en" defaultValue={editingMember?.role_en} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" required/></div>
                    </div>

                    <ImageUpload onUploadSuccess={(path) => setImageUrl(path)} initialImageUrl={imageUrl} />
                    <input type="hidden" name="image_url" value={imageUrl} />

                     <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-sm font-medium mb-1">LinkedIn URL</label><input name="linkedin_url" defaultValue={editingMember?.linkedin_url} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" /></div>
                        <div><label className="block text-sm font-medium mb-1">Twitter URL</label><input name="twitter_url" defaultValue={editingMember?.twitter_url} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" /></div>
                    </div>
                    <div><label className="block text-sm font-medium mb-1">Display Order</label><input type="number" name="display_order" defaultValue={editingMember?.display_order ?? 0} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" /></div>
                    <div className="flex items-center gap-2">
                        <input type="checkbox" name="is_active" defaultChecked={editingMember?.is_active ?? true} className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"/>
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

export default TeamManager;