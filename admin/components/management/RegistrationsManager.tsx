import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import Pagination from '../ui/Pagination';
import Modal from '../ui/Modal'; // Import the Modal component
import { API_URL } from "../../../utils/config";
import { Registration } from '../../../utils/types'; // Use shared Registration interface
import axios from 'axios'; // Import axios

// Custom hook for debouncing
export const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => { setDebouncedValue(value); }, delay);
        return () => { clearTimeout(handler); };
    }, [value, delay]);
    return debouncedValue;
};

const RegistrationsManager: React.FC = () => {
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalItems, setTotalItems] = useState(0);

    // Modal state for Add/Edit
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRegistration, setEditingRegistration] = useState<Registration | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null); // Added this line

    // State for delete confirmation modal
    const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
    const [registrationToDeleteId, setRegistrationToDeleteId] = useState<number | null>(null);

    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const fetchRegistrations = async (search: string, page: number) => {
        setIsLoading(true);
        setError(null);
        try {
            const url = new URL(`${API_URL}/registrations`);
            url.searchParams.append('page', page.toString());
            url.searchParams.append('limit', '10');
            if (search) {
                url.searchParams.append('search', search);
            }
            
            const response = await axios.get(url.toString()); // Changed to axios
            const result = await response.data; // Changed for axios
            
            setRegistrations(result.data);
            setTotalPages(result.pagination.totalPages);
            setTotalItems(result.pagination.totalItems);
            setCurrentPage(result.pagination.currentPage);

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Une erreur inconnue est survenue lors du chargement des inscriptions.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearchTerm]);

    useEffect(() => {
        fetchRegistrations(debouncedSearchTerm, currentPage);
    }, [debouncedSearchTerm, currentPage]);

    const handlePageChange = (page: number) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleDownloadTicket = async (registrationId: number) => {
        if (!registrationId) {
            setMessage({ type: 'error', text: 'Aucun ID d\'inscription disponible pour le téléchargement du ticket.' });
            return;
        }
        try {
            const response = await axios.get(`${API_URL}/ticket/${registrationId}`, {
                responseType: 'blob', // Important for downloading files
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `ticket-${registrationId}.pdf`); // Or whatever filename you want
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(url); // Clean up the URL

            setMessage({ type: 'success', text: 'Le ticket a été téléchargé avec succès !' });
        } catch (err) {
            console.error('Erreur lors du téléchargement du ticket:', err);
            setMessage({ type: 'error', text: 'Échec du téléchargement du ticket. Veuillez réessayer.' });
        }
    };

    // --- Modal related functions (Add/Edit) ---
    const openModal = (registration: Registration | null = null) => {
        setEditingRegistration(registration);
        setIsModalOpen(true);
    };
    
    const closeModal = () => {
        setIsModalOpen(false);
        setEditingRegistration(null);
    };

    // --- Delete confirmation modal functions ---
    const openConfirmDeleteModal = (id: number) => {
        setRegistrationToDeleteId(id);
        setIsConfirmDeleteModalOpen(true);
    };

    const closeConfirmDeleteModal = () => {
        setRegistrationToDeleteId(null);
        setIsConfirmDeleteModalOpen(false);
    };

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const registrationData = Object.fromEntries(formData.entries());

        const payload = {
            ...registrationData,
            is_checked_in: (e.currentTarget.elements.namedItem('is_checked_in') as HTMLInputElement)?.checked || false, // Checkbox value
        };

        const url = editingRegistration ? `${API_URL}/registrations/${editingRegistration.id}` : `${API_URL}/registrations`;
        const method = editingRegistration ? 'PUT' : 'POST';

        try {
            const response = await axios({ // Changed to axios
                method,
                url,
                data: payload,
                headers: { 'Content-Type': 'application/json' },
            });
            if (response.status < 200 || response.status >= 300) { // Changed for axios
                throw new Error(response.data.message || 'Échec de la sauvegarde de l\'inscription.');
            }
            await fetchRegistrations(debouncedSearchTerm, currentPage); // Refresh data
            closeModal();
            setMessage({type: 'success', text: editingRegistration ? 'Inscription modifiée avec succès !' : 'Inscription ajoutée avec succès !'});
        } catch (err) {
            setMessage({type: 'error', text: 'Erreur lors de la sauvegarde de l\'inscription: ' + (err instanceof Error ? err.message : 'Erreur inconnue')});
        }
    };

    const confirmDeleteRegistration = async () => {
        if (registrationToDeleteId === null) return;

        try {
            const response = await axios.delete(`${API_URL}/registrations/${registrationToDeleteId}`); // Changed to axios
            if (response.status < 200 || response.status >= 300) { // Changed for axios
                throw new Error(response.data.message || 'Échec de la suppression de l\'inscription.');
            }
            setRegistrations(registrations.filter(reg => reg.id !== registrationToDeleteId));
            setTotalItems(prev => prev - 1);
            // Optionally re-fetch to adjust pagination if current page is empty
            if (registrations.length === 1 && currentPage > 1) {
                setCurrentPage(prev => prev - 1);
            } else {
                fetchRegistrations(debouncedSearchTerm, currentPage);
            }
            setMessage({type: 'success', text: 'Inscription supprimée avec succès !'});
        } catch (err) {
            setMessage({type: 'error', text: 'Erreur lors de la suppression de l\'inscription: ' + (err instanceof Error ? err.message : 'Erreur inconnue')});
        } finally {
            closeConfirmDeleteModal();
        }
    };

    // --- Export functions ---
    const handleExportCsv = async () => {
        try {
            const response = await axios.get(`${API_URL}/registrations?limit=${totalItems}`); // Changed to axios
            const result = await response.data; // Changed for axios
            
            // Reformat data for better CSV/Excel readability
            const dataToExport = result.data.map((reg: Registration) => ({
                'ID': reg.id,
                'Prénom': reg.first_name,
                'Nom': reg.last_name,
                'Email': reg.email,
                'Entreprise': reg.company || '',
                'Titre du Poste': reg.job_title || '',
                'Pays': reg.country || '',
                'Type de Pass': reg.pass_type.replace('_', ' ').toUpperCase(),
                'Date d\'inscription': reg.registration_date ? new Date(reg.registration_date).toLocaleDateString('fr-FR') : 'N/A',
                'Check-in': reg.is_checked_in ? 'Oui' : 'Non',
                'Heure Check-in': reg.check_in_time ? new Date(reg.check_in_time).toLocaleString('fr-FR') : 'N/A',
            }));

            const csv = Papa.unparse(dataToExport, {
                header: true,
                delimiter: ';' // Use semicolon for better Excel compatibility in French locales
            });
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'inscriptions.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setMessage({type: 'success', text: 'Export CSV réussi !'});
        } catch (err) {
            setMessage({type: 'error', text: 'Erreur lors de l\'export CSV: ' + (err instanceof Error ? err.message : 'Erreur inconnue')});
        }
    };

    const handleExportPdf = async () => {
        try {
            const url = new URL(`${API_URL}/registrations/export/pdf`);
            if (debouncedSearchTerm) {
                url.searchParams.append('search', debouncedSearchTerm);
            }
            const response = await axios.get(url.toString(), { responseType: 'blob' }); // Changed to axios
            
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const urlBlob = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = urlBlob;
            link.setAttribute('download', 'inscriptions.pdf');
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
            setMessage({type: 'success', text: 'Export PDF réussi !'});
        } catch (err) {
            setMessage({type: 'error', text: 'Erreur lors de l\'export PDF: ' + (err instanceof Error ? err.message : 'Erreur inconnue')});
        }
    };

    const renderContent = () => {
        if (isLoading) return <div className="text-center p-8 text-gray-500">Chargement des inscriptions...</div>;
        if (error) return <div className="text-center p-8 text-red-500">Erreur: {error}</div>;
        if (registrations.length === 0) {
            return <div className="text-center p-8 text-gray-500">Aucune inscription trouvée{debouncedSearchTerm ? ` pour \"${debouncedSearchTerm}\"` : ''}.</div>;
        }

        return (
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nom</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Compagnie</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Pass</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date Inscr.</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Check-in</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Heure Check-in</th>
                            <th scope="col" className="relative px-6 py-3 text-right"><span className="sr-only">Actions</span>Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {registrations.map(reg => (
                            <tr key={reg.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-white">{reg.first_name} {reg.last_name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{reg.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{reg.company || 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                        ${reg.pass_type === 'conference' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' : 
                                          reg.pass_type === 'full' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 
                                          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'} capitalize`}>
                                        {reg.pass_type.replace('_', ' ')}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{reg.registration_date ? new Date(reg.registration_date).toLocaleDateString('fr-FR') : 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    {reg.is_checked_in ? (
                                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">Oui</span>
                                    ) : (
                                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100">Non</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    {reg.check_in_time ? new Date(reg.check_in_time).toLocaleString('fr-FR') : 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => openModal(reg)} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200" title="Modifier l'inscription">
                                            <i className="fas fa-edit"></i> Modifier
                                        </button>
                                        <button onClick={() => openConfirmDeleteModal(reg.id!)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200" title="Supprimer l'inscription">
                                            <i className="fas fa-trash"></i> Supprimer
                                        </button>
                                        <button onClick={() => handleDownloadTicket(reg.id!)} className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 transition-colors duration-200" title="Télécharger le billet">
                                            <i className="fas fa-download"></i> Billet
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Inscriptions</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{totalItems} inscriptions</p>
                </div>
                <div className="flex gap-4">
                    <input
                        type="text"
                        placeholder="Rechercher par nom, email, entreprise..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-4 py-2 w-64 rounded-md bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-brand-green focus:border-brand-green text-gray-900 dark:text-white"
                    />
                    <button onClick={() => openModal()} className="bg-brand-green text-white px-5 py-2 rounded-md font-semibold hover:bg-green-700 transition">
                        <i className="fas fa-plus mr-2"></i> Ajouter une Inscription
                    </button>
                    <button onClick={handleExportCsv} className="bg-blue-600 text-white px-5 py-2 rounded-md font-semibold hover:bg-blue-700 transition">
                        <i className="fas fa-file-export mr-2"></i> Exporter CSV
                    </button>
                    <button onClick={handleExportPdf} className="bg-red-600 text-white px-5 py-2 rounded-md font-semibold hover:bg-red-700 transition">
                        <i className="fas fa-file-pdf mr-2"></i> Exporter PDF
                    </button>
                </div>
            </div>
            {message && (
                <div className={`p-4 rounded-md mb-4 ${message.type === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'}`}>
                    {message.text}
                </div>
            )}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                {renderContent()}
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            </div>

            {/* Registration Add/Edit Modal */}
            <Modal isOpen={isModalOpen} onClose={closeModal} title={editingRegistration ? 'Modifier l\'inscription' : 'Ajouter une nouvelle inscription'}>
                <form onSubmit={handleSave} className="space-y-4">
                    <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prénom</label><input name="first_name" defaultValue={editingRegistration?.first_name} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-brand-green focus:border-brand-green text-gray-900 dark:text-white" required /></div>
                    <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nom</label><input name="last_name" defaultValue={editingRegistration?.last_name} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-brand-green focus:border-brand-green text-gray-900 dark:text-white" required /></div>
                    <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label><input type="email" name="email" defaultValue={editingRegistration?.email} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-brand-green focus:border-brand-green text-gray-900 dark:text-white" required /></div>
                    <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Entreprise (Optionnel)</label><input name="company" defaultValue={editingRegistration?.company} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-brand-green focus:border-brand-green text-gray-900 dark:text-white" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Titre du Poste (Optionnel)</label><input name="job_title" defaultValue={editingRegistration?.job_title} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-brand-green focus:border-brand-green text-gray-900 dark:text-white" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pays (Optionnel)</label><input name="country" defaultValue={editingRegistration?.country} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-brand-green focus:border-brand-green text-gray-900 dark:text-white" /></div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type de Pass</label>
                        <select name="pass_type" defaultValue={editingRegistration?.pass_type || 'conference'} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-brand-green focus:border-brand-green text-gray-900 dark:text-white" required>
                            <option value="conference">Pass Conférence</option>
                            <option value="full">Pass Complet</option>
                            <option value="bootcamp">Pass Bootcamp</option>
                        </select>
                    </div>
                    {editingRegistration && ( // Only show on edit
                        <div className="flex items-center gap-2">
                            <input type="checkbox" name="is_checked_in" id="reg_is_checked_in" defaultChecked={editingRegistration.is_checked_in || false} className="h-4 w-4 text-brand-green focus:ring-brand-green border-gray-300 rounded"/>
                            <label htmlFor="reg_is_checked_in" className="text-sm font-medium text-gray-700 dark:text-gray-300">Enregistré</label>
                        </div>
                    )}
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
                    <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">Êtes-vous sûr de vouloir supprimer cette inscription ? Cette action est irréversible.</p>
                    <div className="flex justify-center gap-4">
                        <button onClick={closeConfirmDeleteModal} className="px-5 py-2 rounded-md bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-200">Annuler</button>
                        <button onClick={confirmDeleteRegistration} className="px-5 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors duration-200">
                            <i className="fas fa-trash-alt mr-2"></i> Supprimer
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default RegistrationsManager;
