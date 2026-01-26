
import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import { AuthUser } from '../Dashboard';
import axios from 'axios'; // Import axios

const API_URL = 'http://localhost:4000/api';

interface Testimonial {
    id: number;
    author_name: string;
    author_title_fr: string;
    author_title_en: string;
    author_image_url?: string;
    quote_fr: string;
    quote_en: string;
    display_order: number;
    is_active: boolean;
}

interface TestimonialsManagerProps {
  authUser: AuthUser | null;
}

const TestimonialsManager: React.FC<TestimonialsManagerProps> = ({ authUser }) => {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null); // For general messages

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Testimonial | null>(null);

    // State for delete confirmation modal
    const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
    const [itemToDeleteId, setItemToDeleteId] = useState<number | null>(null);


    const canManage = authUser?.role === 'admin';

    const fetchTestimonials = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_URL}/testimonials`); // Changed to axios
            const data = await response.data; // Changed for axios
            setTestimonials(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Une erreur inconnue est survenue.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const openModal = (item: Testimonial | null = null) => {
        if (!canManage) return;
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
    };

    // --- Delete confirmation modal functions ---
    const openConfirmDeleteModal = (id: number) => {
        setItemToDeleteId(id);
        setIsConfirmDeleteModalOpen(true);
    };

    const closeConfirmDeleteModal = () => {
        setItemToDeleteId(null);
        setIsConfirmDeleteModalOpen(false);
    };

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!canManage) return;

        const formData = new FormData(e.currentTarget);
        const itemData = Object.fromEntries(formData.entries());

        const payload = {
            ...itemData,
            display_order: Number(itemData.display_order),
            is_active: (e.currentTarget.elements.namedItem('is_active') as HTMLInputElement)?.checked || false, // Checkbox value
        };

        const url = editingItem ? `${API_URL}/testimonials/${editingItem.id}` : `${API_URL}/testimonials`;
        const method = editingItem ? 'PUT' : 'POST';

        try {
            const response = await axios({ // Changed to axios
                method,
                url,
                data: payload,
                headers: { 'Content-Type': 'application/json' },
            });
            if (response.status < 200 || response.status >= 300) { // Changed for axios
                throw new Error(response.data.message || 'Échec de la sauvegarde du témoignage.');
            }
            await fetchTestimonials();
            closeModal();
            setMessage({type: 'success', text: editingItem ? 'Témoignage modifié avec succès !' : 'Témoignage ajouté avec succès !'});
        } catch (err) {
            setMessage({type: 'error', text: 'Erreur lors de la sauvegarde du témoignage: ' + (err instanceof Error ? err.message : 'Erreur inconnue')});
        }
    };

    const confirmDeleteItem = async () => {
        if (!canManage || itemToDeleteId === null) return;

        try {
            const response = await axios.delete(`${API_URL}/testimonials/${itemToDeleteId}`); // Changed to axios
            if (response.status < 200 || response.status >= 300) { // Changed for axios
                throw new Error(response.data.message || 'Échec de la suppression du témoignage.');
            }
            setTestimonials(testimonials.filter(t => t.id !== itemToDeleteId));
            setMessage({type: 'success', text: 'Témoignage supprimé avec succès !'});
        } catch (err) {
            setMessage({type: 'error', text: 'Erreur lors de la suppression du témoignage: ' + (err instanceof Error ? err.message : 'Erreur inconnue')});
        } finally {
            closeConfirmDeleteModal();
        }
    };

    const renderContent = () => {
        if (isLoading) return <div className="text-center p-8 text-gray-500">Chargement des témoignages...</div>;
        if (error) return <div className="text-center p-8 text-red-500">Erreur: {error}</div>;
        if (testimonials.length === 0) return <div className="text-center p-8 text-gray-500">Aucun témoignage trouvé.</div>;

        return (
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Image</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Auteur</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Titre (FR)</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Citation (FR)</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actif</th>
                        {canManage && <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>}
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {testimonials.map(item => (
                        <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                            <td className="px-6 py-4 whitespace-nowrap">
                                {item.author_image_url ? (
                                    <img src={item.author_image_url} alt={item.author_name} className="w-10 h-10 rounded-full object-cover" />
                                ) : (
                                    <i className="fas fa-user-circle text-4xl text-gray-400"></i> // Placeholder icon
                                )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-white">{item.author_name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{item.author_title_fr}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 italic">"{item.quote_fr.substring(0, 50)}..."</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                {item.is_active ? (
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">Oui</span>
                                ) : (
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100">Non</span>
                                )}
                            </td>
                            {canManage && (
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => openModal(item)} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200" title="Modifier">
                                            <i className="fas fa-edit"></i> Modifier
                                        </button>
                                        <button onClick={() => openConfirmDeleteModal(item.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200" title="Supprimer">
                                            <i className="fas fa-trash"></i> Supprimer
                                        </button>
                                    </div>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    }

    return (
        <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Gestion des Témoignages</h2>
                {canManage && (
                    <button onClick={() => openModal()} className="bg-brand-green text-white px-5 py-2 rounded-md font-semibold hover:bg-green-700 transition">
                        <i className="fas fa-plus mr-2"></i> Ajouter un Témoignage
                    </button>
                )}
            </div>
            {message && (
                <div className={`p-4 rounded-md mb-4 ${message.type === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'}`}>
                    {message.text}
                </div>
            )}
             <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md overflow-x-auto">
                {renderContent()}
            </div>
            {canManage && (
                 <Modal isOpen={isModalOpen} onClose={closeModal} title={editingItem ? 'Modifier le Témoignage' : 'Ajouter un Témoignage'}>
                    <form onSubmit={handleSave} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nom de l'Auteur</label>
                            <input name="author_name" defaultValue={editingItem?.author_name} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-brand-green focus:border-brand-green text-gray-900 dark:text-white" required/>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Titre de l'Auteur (Français)</label>
                                <input name="author_title_fr" defaultValue={editingItem?.author_title_fr} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-brand-green focus:border-brand-green text-gray-900 dark:text-white" required/>
                           </div>
                           <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Titre de l'Auteur (Anglais)</label>
                                <input name="author_title_en" defaultValue={editingItem?.author_title_en} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-brand-green focus:border-brand-green text-gray-900 dark:text-white" required/>
                           </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">URL de l'Image de l'Auteur</label>
                            <input name="author_image_url" defaultValue={editingItem?.author_image_url} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-brand-green focus:border-brand-green text-gray-900 dark:text-white" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Citation (Français)</label>
                                <textarea name="quote_fr" defaultValue={editingItem?.quote_fr} rows={4} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-brand-green focus:border-brand-green text-gray-900 dark:text-white" required/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Citation (Anglais)</label>
                                <textarea name="quote_en" defaultValue={editingItem?.quote_en} rows={4} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-brand-green focus:border-brand-green text-gray-900 dark:text-white" required/>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ordre d'affichage</label>
                            <input type="number" name="display_order" defaultValue={editingItem?.display_order ?? 0} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-brand-green focus:border-brand-green text-gray-900 dark:text-white" />
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="checkbox" name="is_active" id="testimonial_is_active" defaultChecked={editingItem?.is_active ?? true} className="h-4 w-4 text-brand-green focus:ring-brand-green border-gray-300 rounded"/>
                            <label htmlFor="testimonial_is_active" className="text-sm font-medium text-gray-700 dark:text-gray-300">Est Actif</label>
                        </div>
                        <div className="flex justify-end gap-4 pt-4">
                            <button type="button" onClick={closeModal} className="px-5 py-2 rounded-md bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-200">Annuler</button>
                            <button type="submit" className="px-5 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition-colors duration-200">
                                <i className="fas fa-save mr-2"></i> Sauvegarder
                            </button>
                        </div>
                    </form>
                </Modal>
            )}

            {/* Custom Delete Confirmation Modal */}
            <Modal isOpen={isConfirmDeleteModalOpen} onClose={closeConfirmDeleteModal} title="Confirmer la suppression">
                <div className="p-4 text-center">
                    <i className="fas fa-exclamation-triangle text-yellow-500 text-5xl mb-4"></i>
                    <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">Êtes-vous sûr de vouloir supprimer ce témoignage ? Cette action est irréversible.</p>
                    <div className="flex justify-center gap-4">
                        <button onClick={closeConfirmDeleteModal} className="px-5 py-2 rounded-md bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-200">Annuler</button>
                        <button onClick={confirmDeleteItem} className="px-5 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors duration-200">
                            <i className="fas fa-trash-alt mr-2"></i> Supprimer
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default TestimonialsManager;
