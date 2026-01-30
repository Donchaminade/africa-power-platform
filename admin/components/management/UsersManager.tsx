
import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import axios from 'axios'; // Import axios

import { API_URL } from '../../config';

interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'manager';
    is_active: boolean;
}

const UsersManager: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null); // For general messages

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    // State for delete confirmation modal
    const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
    const [userToDeleteId, setUserToDeleteId] = useState<number | null>(null);

    const fetchUsers = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_URL}/users`); // Changed to axios
            const data = await response.data; // Changed for axios
            setUsers(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Une erreur inconnue est survenue.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const openModal = (user: User | null = null) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
    };

    // --- Delete confirmation modal functions ---
    const openConfirmDeleteModal = (id: number) => {
        setUserToDeleteId(id);
        setIsConfirmDeleteModalOpen(true);
    };

    const closeConfirmDeleteModal = () => {
        setUserToDeleteId(null);
        setIsConfirmDeleteModalOpen(false);
    };

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const userData = Object.fromEntries(formData.entries());
        
        const payload: any = {
            name: userData.name,
            email: userData.email,
            role: userData.role,
            is_active: (e.currentTarget.elements.namedItem('is_active') as HTMLInputElement)?.checked || false, // Checkbox value
        };

        // Only include password if it's provided
        if (userData.password) {
            payload.password = userData.password;
        }

        const url = editingUser ? `${API_URL}/users/${editingUser.id}` : `${API_URL}/users`;
        const method = editingUser ? 'PUT' : 'POST';

        try {
            const response = await axios({ // Changed to axios
                method,
                url,
                data: payload,
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.status < 200 || response.status >= 300) { // Changed for axios
                throw new Error(response.data.message || 'Échec de la sauvegarde de l\'utilisateur.');
            }
            
            await fetchUsers();
            closeModal();
            setMessage({type: 'success', text: editingUser ? 'Utilisateur modifié avec succès !' : 'Utilisateur ajouté avec succès !'});
        } catch (err) {
            setMessage({type: 'error', text: 'Erreur lors de la sauvegarde de l\'utilisateur: ' + (err instanceof Error ? err.message : 'Erreur inconnue')});
        }
    };

    const confirmDeleteUser = async () => {
        if (userToDeleteId === null) return;

        try {
            const response = await axios.delete(`${API_URL}/users/${userToDeleteId}`); // Changed to axios
            if (response.status < 200 || response.status >= 300) { // Changed for axios
                throw new Error(response.data.message || 'Échec de la suppression de l\'utilisateur.');
            }
            setUsers(users.filter(u => u.id !== userToDeleteId));
            setMessage({type: 'success', text: 'Utilisateur supprimé avec succès !'});
        } catch (err) {
            setMessage({type: 'error', text: 'Erreur lors de la suppression de l\'utilisateur: ' + (err instanceof Error ? err.message : 'Erreur inconnue')});
        } finally {
            closeConfirmDeleteModal();
        }
    };
    
    const renderContent = () => {
        if (isLoading) return <div className="text-center p-8 text-gray-500">Chargement des utilisateurs...</div>;
        if (error) return <div className="text-center p-8 text-red-500">Erreur: {error}</div>;
        if (users.length === 0) return <div className="text-center p-8 text-gray-500">Aucun utilisateur trouvé.</div>;
        
        return (
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nom</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Rôle</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actif</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {users.map(user => (
                        <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-white">{user.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{user.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-3 py-1 text-sm rounded-full capitalize ${user.role === 'admin' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'}`}>
                                    {user.role}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                {user.is_active ? (
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">Oui</span>
                                ) : (
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100">Non</span>
                                )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex justify-end gap-2">
                                    <button onClick={() => openModal(user)} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200" title="Modifier">
                                        <i className="fas fa-edit"></i> Modifier
                                    </button>
                                    <button onClick={() => openConfirmDeleteModal(user.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200" title="Supprimer">
                                        <i className="fas fa-trash"></i> Supprimer
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    }

    return (
        <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Gestion des Utilisateurs</h2>
                <button onClick={() => openModal()} className="bg-brand-green text-white px-5 py-2 rounded-md font-semibold hover:bg-green-700 transition">
                    <i className="fas fa-plus mr-2"></i> Ajouter un Utilisateur
                </button>
            </div>
            {message && (
                <div className={`p-4 rounded-md mb-4 ${message.type === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'}`}>
                    {message.text}
                </div>
            )}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md overflow-x-auto">
                {renderContent()}
            </div>

            <Modal isOpen={isModalOpen} onClose={closeModal} title={editingUser ? 'Modifier l\'utilisateur' : 'Ajouter un utilisateur'}>
                <form onSubmit={handleSave} className="space-y-4">
                    <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nom</label><input name="name" defaultValue={editingUser?.name} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-brand-green focus:border-brand-green text-gray-900 dark:text-white" required /></div>
                     <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label><input type="email" name="email" defaultValue={editingUser?.email} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-brand-green focus:border-brand-green text-gray-900 dark:text-white" required /></div>
                     <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mot de passe</label><input type="password" name="password" placeholder={editingUser ? 'Laisser vide pour garder le mot de passe actuel' : ''} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-brand-green focus:border-brand-green text-gray-900 dark:text-white" required={!editingUser} /></div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rôle</label>
                        <select name="role" defaultValue={editingUser?.role || 'manager'} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-brand-green focus:border-brand-green text-gray-900 dark:text-white" required>
                            <option value="manager">Manager</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                     <div className="flex items-center gap-2">
                        <input type="checkbox" name="is_active" id="user_is_active" defaultChecked={editingUser?.is_active ?? true} className="h-4 w-4 text-brand-green focus:ring-brand-green border-gray-300 rounded"/>
                        <label htmlFor="user_is_active" className="text-sm font-medium text-gray-700 dark:text-gray-300">Est Actif</label>
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={closeModal} className="px-5 py-2 rounded-md bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-200">Annuler</button>
                        <button type="submit" className="px-5 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition-colors duration-200">
                            <i className="fas fa-save mr-2"></i> Sauvegarder
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Custom Delete Confirmation Modal */}
            <Modal isOpen={isConfirmDeleteModalOpen} onClose={closeConfirmDeleteModal} title="Confirmer la suppression">
                <div className="p-4 text-center">
                    <i className="fas fa-exclamation-triangle text-yellow-500 text-5xl mb-4"></i>
                    <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.</p>
                    <div className="flex justify-center gap-4">
                        <button onClick={closeConfirmDeleteModal} className="px-5 py-2 rounded-md bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-200">Annuler</button>
                        <button onClick={confirmDeleteUser} className="px-5 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors duration-200">
                            <i className="fas fa-trash-alt mr-2"></i> Supprimer
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default UsersManager;
