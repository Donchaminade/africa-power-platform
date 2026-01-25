import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import Pagination from '../ui/Pagination';
import Modal from '../ui/Modal'; // Import the Modal component
import { API_URL } from "../../../utils/config";
import { Registration } from '../../../utils/types'; // Use shared Registration interface

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
            
            const response = await fetch(url.toString());
            if (!response.ok) throw new Error('Failed to fetch registrations');
            
            const result = await response.json();
            setRegistrations(result.data);
            setTotalPages(result.pagination.totalPages);
            setTotalItems(result.pagination.totalItems);
            setCurrentPage(result.pagination.currentPage);

        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
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

    // --- Modal related functions ---
    const openModal = (registration: Registration | null = null) => {
        setEditingRegistration(registration);
        setIsModalOpen(true);
    };
    
    const closeModal = () => {
        setIsModalOpen(false);
        setEditingRegistration(null);
    };

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const registrationData = Object.fromEntries(formData.entries());

        const payload = {
            ...registrationData,
            is_checked_in: registrationData.is_checked_in === 'on' ? 1 : 0, // Convert checkbox to number
        };

        const url = editingRegistration ? `${API_URL}/registrations/${editingRegistration.id}` : `${API_URL}/registrations`;
        const method = editingRegistration ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to save registration');
            }
            await fetchRegistrations(debouncedSearchTerm, currentPage); // Refresh data
            closeModal();
        } catch (err) {
            alert('Error saving registration: ' + (err instanceof Error ? err.message : 'Unknown error'));
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this registration?')) {
             try {
                const response = await fetch(`${API_URL}/registrations/${id}`, { method: 'DELETE' });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to delete registration');
                }
                setRegistrations(registrations.filter(reg => reg.id !== id));
                setTotalItems(prev => prev - 1);
                // Optionally re-fetch to adjust pagination if current page is empty
                if (registrations.length === 1 && currentPage > 1) {
                    setCurrentPage(prev => prev - 1);
                } else {
                    fetchRegistrations(debouncedSearchTerm, currentPage);
                }
            } catch (err) {
                alert('Error deleting registration: ' + (err instanceof Error ? err.message : 'Unknown error'));
            }
        }
    };

    // --- Export functions ---
    const handleExportCsv = async () => {
        try {
            const response = await fetch(`${API_URL}/registrations?limit=${totalItems}`); // Fetch all for export
            if (!response.ok) throw new Error('Failed to fetch data for export');
            const result = await response.json();
            
            // Reformat data for better CSV/Excel readability
            const dataToExport = result.data.map((reg: Registration) => ({
                'ID': reg.id,
                'Prénom': reg.first_name,
                'Nom': reg.last_name,
                'Email': reg.email,
                'Entreprise': reg.company || '',
                'Type de Pass': reg.pass_type.replace('_', ' ').toUpperCase(),
                'Date d\'inscription': reg.registration_date ? new Date(reg.registration_date).toLocaleDateString() : 'N/A',
                'Check-in': reg.is_checked_in ? 'Oui' : 'Non',
                'Heure Check-in': reg.check_in_time ? new Date(reg.check_in_time).toLocaleString() : 'N/A',
            }));

            const csv = Papa.unparse(dataToExport);
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'registrations.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            alert('Error exporting CSV: ' + (err instanceof Error ? err.message : 'Unknown error'));
        }
    };

    const handleExportPdf = async () => {
        try {
            const url = new URL(`${API_URL}/registrations/export/pdf`);
            if (debouncedSearchTerm) {
                url.searchParams.append('search', debouncedSearchTerm);
            }
            const response = await fetch(url.toString(), {
                method: 'GET',
                // Removed Content-Type application/pdf as it's not a request header for GET
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to generate PDF: ${errorText}`);
            }
            const blob = await response.blob();
            const urlBlob = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = urlBlob;
            link.setAttribute('download', 'registrations.pdf');
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
        } catch (err) {
            alert('Error exporting PDF: ' + (err instanceof Error ? err.message : 'Unknown error'));
        }
    };


    const renderContent = () => {
        if (isLoading) return <div className="text-center p-8">Chargement des inscriptions...</div>;
        if (error) return <div className="text-center p-8 text-red-500">Erreur: {error}</div>;
        if (registrations.length === 0) {
            return <div className="text-center p-8">Aucune inscription trouvée{debouncedSearchTerm ? ` pour \"${debouncedSearchTerm}\"` : ''}.</div>;
        }

        return (
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th scope="col" className="p-4 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">Nom</th>
                            <th scope="col" className="p-4 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">Email</th>
                            <th scope="col" className="p-4 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">Compagnie</th>
                            <th scope="col" className="p-4 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">Pass</th>
                            <th scope="col" className="p-4 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">Date Inscr.</th>
                            <th scope="col" className="p-4 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">Check-in</th>
                            <th scope="col" className="p-4 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">Heure Check-in</th>
                            <th scope="col" className="p-4 text-center text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {registrations.map(reg => (
                            <tr key={reg.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                <td className="p-4 whitespace-nowrap font-medium text-gray-900 dark:text-white">{reg.first_name} {reg.last_name}</td>
                                <td className="p-4 whitespace-nowrap text-gray-500 dark:text-gray-400">{reg.email}</td>
                                <td className="p-4 whitespace-nowrap text-gray-500 dark:text-gray-400">{reg.company || 'N/A'}</td>
                                <td className="p-4 whitespace-nowrap">
                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                        ${reg.pass_type === 'conference' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' : 
                                          reg.pass_type === 'full' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 
                                          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'} capitalize`}>
                                        {reg.pass_type.replace('_', ' ')}
                                    </span>
                                </td>
                                <td className="p-4 whitespace-nowrap text-gray-500 dark:text-gray-400">{reg.registration_date ? new Date(reg.registration_date).toLocaleDateString() : 'N/A'}</td>
                                <td className="p-4 whitespace-nowrap">
                                    {reg.is_checked_in ? (
                                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Oui</span>
                                    ) : (
                                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">Non</span>
                                    )}
                                </td>
                                <td className="p-4 whitespace-nowrap text-gray-500 dark:text-gray-400">
                                    {reg.check_in_time ? new Date(reg.check_in_time).toLocaleString() : 'N/A'}
                                </td>
                                <td className="p-4 whitespace-nowrap text-center text-sm font-medium">
                                    <div className="flex justify-center gap-4">
                                        <button onClick={() => openModal(reg)} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300" title="Edit Registration">
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button onClick={() => handleDelete(reg.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300" title="Delete Registration">
                                            <i className="fas fa-trash"></i>
                                        </button>
                                        <a href={`${API_URL}/ticket/${reg.id}`} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300" title="Download Ticket">
                                            <i className="fas fa-download"></i>
                                        </a>
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
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Inscriptions</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{totalItems} total inscriptions</p>
                </div>
                <div className="flex gap-4">
                    <input
                        type="text"
                        placeholder="Search by name, email, company..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-4 py-2 w-64 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:ring-green-500 focus:border-green-500"
                    />
                    <button onClick={() => openModal()} className="bg-green-600 text-white px-5 py-2 rounded-md font-semibold hover:bg-green-700 transition">
                        <i className="fas fa-plus mr-2"></i> Add Registration
                    </button>
                    <button onClick={handleExportCsv} className="bg-blue-600 text-white px-5 py-2 rounded-md font-semibold hover:bg-blue-700 transition">
                        <i className="fas fa-file-export mr-2"></i> Export CSV
                    </button>
                    <button onClick={handleExportPdf} className="bg-red-600 text-white px-5 py-2 rounded-md font-semibold hover:bg-red-700 transition">
                        <i className="fas fa-file-pdf mr-2"></i> Export PDF
                    </button>
                </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                {renderContent()}
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            </div>

            {/* Registration Add/Edit Modal */}
            <Modal isOpen={isModalOpen} onClose={closeModal} title={editingRegistration ? 'Edit Registration' : 'Add New Registration'}>
                <form onSubmit={handleSave} className="space-y-4">
                    <div><label className="block text-sm font-medium mb-1">First Name</label><input name="first_name" defaultValue={editingRegistration?.first_name} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" required /></div>
                    <div><label className="block text-sm font-medium mb-1">Last Name</label><input name="last_name" defaultValue={editingRegistration?.last_name} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" required /></div>
                    <div><label className="block text-sm font-medium mb-1">Email</label><input type="email" name="email" defaultValue={editingRegistration?.email} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" required /></div>
                    <div><label className="block text-sm font-medium mb-1">Company (Optional)</label><input name="company" defaultValue={editingRegistration?.company} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" /></div>
                    <div><label className="block text-sm font-medium mb-1">Job Title (Optional)</label><input name="job_title" defaultValue={editingRegistration?.job_title} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" /></div>
                    <div><label className="block text-sm font-medium mb-1">Country (Optional)</label><input name="country" defaultValue={editingRegistration?.country} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" /></div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Pass Type</label>
                        <select name="pass_type" defaultValue={editingRegistration?.pass_type || 'conference'} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" required>
                            <option value="conference">Conference Pass</option>
                            <option value="full">Full Pass</option>
                            <option value="bootcamp">Bootcamp Pass</option>
                        </select>
                    </div>
                    {editingRegistration && ( // Only show on edit
                        <div className="flex items-center gap-2">
                            <input type="checkbox" name="is_checked_in" defaultChecked={editingRegistration.is_checked_in || false} className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"/>
                            <label className="text-sm font-medium">Checked In</label>
                        </div>
                    )}
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={closeModal} className="px-5 py-2 rounded-md bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500">Cancel</button>
                        <button type="submit" className="px-5 py-2 rounded-md bg-green-600 text-white hover:bg-green-700">Save</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default RegistrationsManager;
