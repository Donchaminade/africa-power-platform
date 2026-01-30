
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '../ui/Modal';
import ImageUpload from '../ui/ImageUpload';

import { API_URL } from '../../config';

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
            const response = await axios.get(`${API_URL}/team`);
            if (response.status !== 200) throw new Error('Failed to fetch team members');
            const data = await response.data;
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
            is_active: (e.currentTarget.elements.namedItem('is_active') as HTMLInputElement)?.checked || false,
        };

        const url = editingMember ? `${API_URL}/team/${editingMember.id}` : `${API_URL}/team`;
        const method = editingMember ? 'PUT' : 'POST';

        try {
            const response = await axios({
                method,
                url,
                data: payload,
                headers: { 'Content-Type': 'application/json' },
            });
            if (response.status < 200 || response.status >= 300) throw new Error('Failed to save team member');
            await fetchTeam();
            closeModal();
        } catch (err) {
            alert('Erreur lors de l\'enregistrement du membre: ' + (err instanceof Error ? err.message : 'Erreur inconnue'));
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce membre de l\'équipe ?')) {
            try {
                const response = await axios.delete(`${API_URL}/team/${id}`);
                if (response.status < 200 || response.status >= 300) throw new Error('Failed to delete team member');
                setTeam(team.filter(m => m.id !== id));
            } catch (err) {
                alert('Erreur lors de la suppression du membre: ' + (err instanceof Error ? err.message : 'Erreur inconnue'));
            }
        }
    };

    return (
        <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Gestion de l\'Équipe</h2>
                <button onClick={() => openModal()} className="bg-brand-green text-white px-5 py-2 rounded-md font-semibold hover:bg-green-700 transition">
                    <i className="fas fa-plus mr-2"></i> Ajouter un Membre
                </button>
            </div>
             <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md overflow-x-auto">
                {isLoading && <div className="text-center p-8 text-gray-500">Chargement des membres de l\'équipe...</div>}
                {error && <div className="text-center p-8 text-red-500">Erreur: {error}</div>}
                {!isLoading && !error && team.length === 0 && <div className="text-center p-8 text-gray-500">Aucun membre de l\'équipe trouvé.</div>}
                
                {!isLoading && !error && team.length > 0 && (
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Image</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nom</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Rôle (FR)</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Active</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {team.map(member => (
                                <tr key={member.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <img src={member.image_url} alt={member.name} className="w-12 h-12 rounded-md object-cover" />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{member.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{member.role_fr}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                      {member.is_active ? (
                                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">Oui</span>
                                      ) : (
                                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100">Non</span>
                                      )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => openModal(member)} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-4 transition-colors duration-200" title="Modifier">
                                            <i className="fas fa-edit"></i> Modifier
                                        </button>
                                        <button onClick={() => handleDelete(member.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200" title="Supprimer">
                                            <i className="fas fa-trash-alt"></i> Supprimer
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
            <Modal isOpen={isModalOpen} onClose={closeModal} title={editingMember ? 'Modifier un Membre' : 'Ajouter un Membre'}>
                <form onSubmit={handleSave} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nom</label>
                        <input name="name" defaultValue={editingMember?.name} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white" required/>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rôle (Français)</label>
                            <input name="role_fr" defaultValue={editingMember?.role_fr} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white" required/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rôle (Anglais)</label>
                            <input name="role_en" defaultValue={editingMember?.role_en} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white" required/>
                        </div>
                    </div>

                    <ImageUpload onUploadSuccess={(path) => setImageUrl(path)} initialImageUrl={imageUrl} />
                    
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">URL LinkedIn</label>
                            <input name="linkedin_url" defaultValue={editingMember?.linkedin_url} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">URL Twitter</label>
                            <input name="twitter_url" defaultValue={editingMember?.twitter_url} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ordre d\'affichage</label>
                        <input type="number" name="display_order" defaultValue={editingMember?.display_order ?? 0} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white" />
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="checkbox" name="is_active" id="member_is_active" defaultChecked={editingMember?.is_active ?? true} className="h-4 w-4 text-brand-green focus:ring-green-500 border-gray-300 rounded"/>
                        <label htmlFor="member_is_active" className="text-sm font-medium text-gray-700 dark:text-gray-300">Est Actif</label>
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={closeModal} className="px-5 py-2 rounded-md bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-200">Annuler</button>
                        <button type="submit" className="px-5 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition-colors duration-200">
                            <i className="fas fa-save mr-2"></i> Sauvegarder
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default TeamManager;
