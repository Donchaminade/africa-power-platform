import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import ImageUpload from '../ui/ImageUpload';
import axios from 'axios'; // Import axios

import { API_URL } from '../../../utils/config';

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
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null); // For general messages

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSponsor, setEditingSponsor] = useState<Sponsor | null>(null);
    const [uploadedLogoUrl, setUploadedLogoUrl] = useState<string>('');

    // State for delete confirmation modal
    const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
    const [sponsorToDeleteId, setSponsorToDeleteId] = useState<number | null>(null);

    const fetchSponsors = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_URL}/sponsors`); // Changed to axios
            const data = await response.data; // Changed for axios
            setSponsors(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Une erreur inconnue est survenue.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSponsors();
    }, []);

    const openModal = (sponsor: Sponsor | null = null) => {
        setEditingSponsor(sponsor);
        setUploadedLogoUrl(sponsor?.logo_url || ''); // Initialize uploadedLogoUrl
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingSponsor(null);
        setUploadedLogoUrl(''); // Reset uploadedLogoUrl on close
    };

    // --- Delete confirmation modal functions ---
    const openConfirmDeleteModal = (id: number) => {
        setSponsorToDeleteId(id);
        setIsConfirmDeleteModalOpen(true);
    };

    const closeConfirmDeleteModal = () => {
        setSponsorToDeleteId(null);
        setIsConfirmDeleteModalOpen(false);
    };

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const sponsorData = Object.fromEntries(formData.entries());

        const payload = {
            ...sponsorData,
            logo_url: uploadedLogoUrl, // Use the URL from the state (updated by ImageUpload)
            display_order: Number(sponsorData.display_order),
            is_active: (e.currentTarget.elements.namedItem('is_active') as HTMLInputElement)?.checked || false, // Checkbox value
        };
        
        // Basic validation: ensure logo_url is not empty
        if (!uploadedLogoUrl) {
            setMessage({type: 'error', text: 'Veuillez télécharger un logo pour le sponsor.'});
            return;
        }
        
        const url = editingSponsor
            ? `${API_URL}/sponsors/${editingSponsor.id}`
            : `${API_URL}/sponsors`;
            
        const method = editingSponsor ? 'PUT' : 'POST';

        try {
            const response = await axios({ // Changed to axios
                method,
                url,
                data: payload,
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.status < 200 || response.status >= 300) { // Changed for axios
                throw new Error(response.data.message || 'Échec de la sauvegarde du sponsor.');
            }
            
            await fetchSponsors();
            closeModal();
            setMessage({type: 'success', text: editingSponsor ? 'Sponsor modifié avec succès !' : 'Sponsor ajouté avec succès !'});
        } catch (err) {
            setMessage({type: 'error', text: 'Erreur lors de la sauvegarde du sponsor: ' + (err instanceof Error ? err.message : 'Erreur inconnue')});
        }
    };

    const confirmDeleteSponsor = async () => {
        if (sponsorToDeleteId === null) return;

        try {
            const response = await axios.delete(`${API_URL}/sponsors/${sponsorToDeleteId}`); // Changed to axios
            if (response.status < 200 || response.status >= 300) { // Changed for axios
                throw new Error(response.data.message || 'Échec de la suppression du sponsor.');
            }
            setSponsors(sponsors.filter(s => s.id !== sponsorToDeleteId));
            setMessage({type: 'success', text: 'Sponsor supprimé avec succès !'});
        } catch (err) {
            setMessage({type: 'error', text: 'Erreur lors de la suppression du sponsor: ' + (err instanceof Error ? err.message : 'Erreur inconnue')});
        } finally {
            closeConfirmDeleteModal();
        }
    };

    const renderContent = () => {
        if (isLoading) return <div className="text-center p-8 text-gray-500">Chargement des sponsors...</div>;
        if (error) return <div className="text-center p-8 text-red-500">Erreur: {error}</div>;
        if (sponsors.length === 0) return <div className="text-center p-8 text-gray-500">Aucun sponsor trouvé.</div>;

        return (
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nom</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Logo</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tier</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Site Web</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actif</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {sponsors.map(sponsor => (
                        <tr key={sponsor.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-white">{sponsor.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <img src={sponsor.logo_url} alt={sponsor.name} className="h-10 w-auto object-contain" />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 capitalize">{sponsor.tier}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-500 dark:text-blue-400">
                                {sponsor.website_url ? <a href={sponsor.website_url} target="_blank" rel="noopener noreferrer" className="hover:underline">Voir le site</a> : 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                {sponsor.is_active ? (
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">Oui</span>
                                ) : (
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100">Non</span>
                                )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex justify-end gap-2">
                                    <button onClick={() => openModal(sponsor)} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200" title="Modifier">
                                        <i className="fas fa-edit"></i> Modifier
                                    </button>
                                    <button onClick={() => openConfirmDeleteModal(sponsor.id!)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200" title="Supprimer">
                                        <i className="fas fa-trash"></i> Supprimer
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    return (
        <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Gestion des Sponsors</h2>
                <button onClick={() => openModal()} className="bg-brand-green text-white px-5 py-2 rounded-md font-semibold hover:bg-green-700 transition">
                    <i className="fas fa-plus mr-2"></i> Ajouter un Sponsor
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
            <Modal isOpen={isModalOpen} onClose={closeModal} title={editingSponsor ? 'Modifier le Sponsor' : 'Ajouter un Sponsor'}>
                <form onSubmit={handleSave} className="space-y-4">
                    <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nom</label><input name="name" defaultValue={editingSponsor?.name} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-brand-green focus:border-brand-green text-gray-900 dark:text-white" required/></div>
                    <ImageUpload 
                        onUploadSuccess={setUploadedLogoUrl} 
                        initialImageUrl={uploadedLogoUrl} 
                    />
                    <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">URL du Site Web</label><input name="website_url" defaultValue={editingSponsor?.website_url} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-brand-green focus:border-brand-green text-gray-900 dark:text-white" /></div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Niveau</label>
                        <select name="tier" defaultValue={editingSponsor?.tier} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-brand-green focus:border-brand-green text-gray-900 dark:text-white" required>
                            <option value="platinum">Platinum</option>
                            <option value="gold">Gold</option>
                            <option value="silver">Silver</option>
                            <option value="community">Community</option>
                        </select>
                    </div>
                    <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ordre d'affichage</label><input type="number" name="display_order" defaultValue={editingSponsor?.display_order} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-brand-green focus:border-brand-green text-gray-900 dark:text-white" required/></div>
                    <div className="flex items-center gap-2">
                        <input type="checkbox" name="is_active" id="sponsor_is_active" defaultChecked={editingSponsor?.is_active} className="h-4 w-4 text-brand-green focus:ring-brand-green border-gray-300 rounded"/>
                        <label htmlFor="sponsor_is_active" className="text-sm font-medium text-gray-700 dark:text-gray-300">Est Actif</label>
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
                    <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">Êtes-vous sûr de vouloir supprimer ce sponsor ? Cette action est irréversible.</p>
                    <div className="flex justify-center gap-4">
                        <button onClick={closeConfirmDeleteModal} className="px-5 py-2 rounded-md bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-200">Annuler</button>
                        <button onClick={confirmDeleteSponsor} className="px-5 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors duration-200">
                            <i className="fas fa-trash-alt mr-2"></i> Supprimer
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default SponsorsManager;