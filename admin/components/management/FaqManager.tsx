
import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import { AuthUser } from '../Dashboard';
import axios from 'axios'; // Import axios

import { API_URL } from '../../config';

interface Faq {
    id: number;
    question_fr: string;
    question_en: string;
    answer_fr: string;
    answer_en: string;
    category: string;
    display_order: number;
    is_active: boolean;
}

interface FaqManagerProps {
  authUser: AuthUser | null;
}

const FaqManager: React.FC<FaqManagerProps> = ({ authUser }) => {
    const [faqs, setFaqs] = useState<Faq[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null); // For general messages
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingFaq, setEditingFaq] = useState<Faq | null>(null);

    // State for delete confirmation modal
    const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
    const [faqToDeleteId, setFaqToDeleteId] = useState<number | null>(null);

    const fetchFaqs = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_URL}/faq`); // Changed to axios
            const data = await response.data; // Changed for axios
            setFaqs(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Une erreur inconnue est survenue.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchFaqs();
    }, []);

    const openModal = (faq: Faq | null = null) => {
        setEditingFaq(faq);
        setIsModalOpen(true);
    };
    
    const closeModal = () => {
        setIsModalOpen(false);
        setEditingFaq(null);
    };

    // --- Delete confirmation modal functions ---
    const openConfirmDeleteModal = (id: number) => {
        setFaqToDeleteId(id);
        setIsConfirmDeleteModalOpen(true);
    };

    const closeConfirmDeleteModal = () => {
        setFaqToDeleteId(null);
        setIsConfirmDeleteModalOpen(false);
    };

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const faqData = Object.fromEntries(formData.entries());

        const payload = {
            ...faqData,
            display_order: Number(faqData.display_order),
            is_active: (e.currentTarget.elements.namedItem('is_active') as HTMLInputElement)?.checked || false, // Checkbox value
        };

        const url = editingFaq ? `${API_URL}/faq/${editingFqa.id}` : `${API_URL}/faq`;
        const method = editingFaq ? 'PUT' : 'POST';

        try {
            const response = await axios({ // Changed to axios
                method,
                url,
                data: payload,
                headers: { 'Content-Type': 'application/json' },
            });
            if (response.status < 200 || response.status >= 300) { // Changed for axios
                throw new Error(response.data.message || 'Échec de la sauvegarde de la FAQ.');
            }
            await fetchFaqs();
            closeModal();
            setMessage({type: 'success', text: editingFaq ? 'FAQ modifiée avec succès !' : 'FAQ ajoutée avec succès !'});
        } catch (err) {
            setMessage({type: 'error', text: 'Erreur lors de la sauvegarde de la FAQ: ' + (err instanceof Error ? err.message : 'Erreur inconnue')});
        }
    };

    const confirmDeleteFaq = async () => {
        if (faqToDeleteId === null) return;

        try {
            const response = await axios.delete(`${API_URL}/faq/${faqToDeleteId}`); // Changed to axios
            if (response.status < 200 || response.status >= 300) { // Changed for axios
                throw new Error(response.data.message || 'Échec de la suppression de la FAQ.');
            }
            setFaqs(faqs.filter(f => f.id !== faqToDeleteId));
            setMessage({type: 'success', text: 'FAQ supprimée avec succès !'});
        } catch (err) {
            setMessage({type: 'error', text: 'Erreur lors de la suppression de la FAQ: ' + (err instanceof Error ? err.message : 'Erreur inconnue')});
        } finally {
            closeConfirmDeleteModal();
        }
    };

    return (
        <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Gestion de la FAQ</h2>
                <button onClick={() => openModal()} className="bg-brand-green text-white px-5 py-2 rounded-md font-semibold hover:bg-green-700 transition">
                    <i className="fas fa-plus mr-2"></i> Ajouter une FAQ
                </button>
            </div>
            {message && (
                <div className={`p-4 rounded-md mb-4 ${message.type === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'}`}>
                    {message.text}
                </div>
            )}
             <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md overflow-x-auto">
                {isLoading && <div className="text-center p-8 text-gray-500">Chargement des FAQs...</div>}
                {error && <div className="text-center p-8 text-red-500">Erreur: {error}</div>}
                {!isLoading && !error && faqs.length === 0 && <div className="text-center p-8 text-gray-500">Aucune FAQ trouvée.</div>}

                {!isLoading && !error && faqs.length > 0 && (
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Question (FR)</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Catégorie</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ordre</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Active</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {faqs.map(faq => (
                                <tr key={faq.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-white">{faq.question_fr}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{faq.category}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{faq.display_order}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                      {faq.is_active ? (
                                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">Oui</span>
                                      ) : (
                                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100">Non</span>
                                      )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => openModal(faq)} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200" title="Modifier">
                                                <i className="fas fa-edit"></i> Modifier
                                            </button>
                                            <button onClick={() => openConfirmDeleteModal(faq.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200" title="Supprimer">
                                                <i className="fas fa-trash"></i> Supprimer
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
            <Modal isOpen={isModalOpen} onClose={closeModal} title={editingFaq ? 'Modifier la FAQ' : 'Ajouter une FAQ'}>
                <form onSubmit={handleSave} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Question (Français)</label>
                            <textarea name="question_fr" defaultValue={editingFaq?.question_fr} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white" required/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Question (Anglais)</label>
                            <textarea name="question_en" defaultValue={editingFaq?.question_en} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white" required/>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Réponse (Français)</label>
                            <textarea name="answer_fr" defaultValue={editingFaq?.answer_fr} rows={4} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white" required/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Réponse (Anglais)</label>
                            <textarea name="answer_en" defaultValue={editingFaq?.answer_en} rows={4} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white" required/>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Catégorie</label>
                            <input name="category" defaultValue={editingFaq?.category} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ordre d'affichage</label>
                            <input type="number" name="display_order" defaultValue={editingFaq?.display_order ?? 0} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white" />
                        </div>
                    </div>
                     <div className="flex items-center gap-2">
                        <input type="checkbox" name="is_active" id="faq_is_active" defaultChecked={editingFaq?.is_active ?? true} className="h-4 w-4 text-brand-green focus:ring-brand-green border-gray-300 rounded"/>
                        <label htmlFor="faq_is_active" className="text-sm font-medium text-gray-700 dark:text-gray-300">Est Active</label>
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
                    <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">Êtes-vous sûr de vouloir supprimer cette FAQ ? Cette action est irréversible.</p>
                    <div className="flex justify-center gap-4">
                        <button onClick={closeConfirmDeleteModal} className="px-5 py-2 rounded-md bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-200">Annuler</button>
                        <button onClick={confirmDeleteFaq} className="px-5 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors duration-200">
                            <i className="fas fa-trash-alt mr-2"></i> Supprimer
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default FaqManager;
