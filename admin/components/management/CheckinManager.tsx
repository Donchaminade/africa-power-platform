import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../config';
import { Registration } from '../../../utils/types';
import { useDebounce } from './RegistrationsManager';
import Modal from '../ui/Modal';

export const CheckinManager: React.FC = () => {
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const fetchRegistrations = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const url = new URL(`${API_URL}/registrations`);
            url.searchParams.append('limit', '9999');
            if (debouncedSearchTerm) {
                url.searchParams.append('search', debouncedSearchTerm);
            }
            const response = await axios.get(url.toString());
            const result = response.data;
            setRegistrations(result.data || []); 
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Une erreur inconnue est survenue.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRegistrations();
    }, [debouncedSearchTerm]);

    const handleCheckin = async (registrationId: number) => {
        setMessage(null);
        try {
            const response = await axios.post(`${API_URL}/checkin/${registrationId}`, {});
            const result = response.data;

            if (response.status >= 300) {
                throw new Error(result.message || 'Échec de l\'enregistrement.');
            }

            setMessage({ type: 'success', text: result.message });
            fetchRegistrations();
        } catch (err) {
            setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Une erreur inconnue est survenue lors de l\'enregistrement.' });
        }
    };

    const formatDate = (dateString: string | undefined, includeTime: boolean = false) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return "Date invalide";
            return date.toLocaleString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric', ...(includeTime && { hour: '2-digit', minute: '2-digit' }) });
        } catch (e) {
            return "Date invalide";
        }
    };
    
    const downloadFile = (blob: Blob, filename: string) => {
        const urlBlob = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = urlBlob;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
        window.URL.revokeObjectURL(urlBlob);
    };

    const handleExport = async (format: 'pdf' | 'csv', exportFilter: 'all' | 'checked' | 'not_checked') => {
        const endpoint = format === 'pdf' ? 'export_pdf' : 'export_csv';
        const filename = `inscriptions_${exportFilter}.${format}`;
        const mimeType = format === 'pdf' ? 'application/pdf' : 'text/csv;charset=utf-8;';
        
        try {
            const url = new URL(`${API_URL}/registrations`);
            url.searchParams.append(endpoint, 'true');

            if (exportFilter === 'checked') {
                url.searchParams.append('checkedIn', 'true');
            } else if (exportFilter === 'not_checked') {
                url.searchParams.append('checkedIn', 'false');
            }
            if (debouncedSearchTerm) {
                url.searchParams.append('search', debouncedSearchTerm);
            }

            const response = await axios.get(url.toString(), { responseType: 'blob' });
            
            downloadFile(new Blob([response.data], { type: mimeType }), filename);
            
            setMessage({type: 'success', text: `Export ${format.toUpperCase()} réussi !`});
        } catch (err) {
            setMessage({type: 'error', text: `Erreur lors de l\'export ${format.toUpperCase()}: ` + (err instanceof Error ? err.message : 'Erreur inconnue')});
        }
    };

    return (
        <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Gestion du Check-in</h2>
            
            {message && (
                <div className={`p-4 rounded-md mb-4 ${message.type === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'}`}>
                    {message.text}
                </div>
            )}

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Liste des Inscrits</h3>
                    <div className="flex flex-wrap items-center gap-2">
                        <input
                            type="text"
                            placeholder="Rechercher par nom, email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="px-4 py-2 rounded-md bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-brand-green focus:border-brand-green text-gray-900 dark:text-white"
                        />
                        <div className="flex gap-2 border-l pl-2">
                            <button onClick={() => handleExport('pdf', 'all')} className="bg-blue-600 text-white px-3 py-2 rounded-md font-semibold hover:bg-blue-700 transition" title="Exporter en PDF (Tous)"><i className="fas fa-file-pdf"></i></button>
                            <button onClick={() => handleExport('pdf', 'checked')} className="bg-green-600 text-white px-3 py-2 rounded-md font-semibold hover:bg-green-700 transition" title="Exporter en PDF (Checkés)"><i className="fas fa-file-pdf"></i> <i className="fas fa-check"></i></button>
                            <button onClick={() => handleExport('pdf', 'not_checked')} className="bg-yellow-600 text-white px-3 py-2 rounded-md font-semibold hover:bg-yellow-700 transition" title="Exporter en PDF (Non-checkés)"><i className="fas fa-file-pdf"></i> <i className="fas fa-times"></i></button>
                        </div>
                         <div className="flex gap-2 border-l pl-2">
                            <button onClick={() => handleExport('csv', 'all')} className="bg-blue-800 text-white px-3 py-2 rounded-md font-semibold hover:bg-blue-900 transition" title="Exporter en CSV (Tous)"><i className="fas fa-file-csv"></i></button>
                            <button onClick={() => handleExport('csv', 'checked')} className="bg-green-800 text-white px-3 py-2 rounded-md font-semibold hover:bg-green-900 transition" title="Exporter en CSV (Checkés)"><i className="fas fa-file-csv"></i> <i className="fas fa-check"></i></button>
                            <button onClick={() => handleExport('csv', 'not_checked')} className="bg-yellow-800 text-white px-3 py-2 rounded-md font-semibold hover:bg-yellow-900 transition" title="Exporter en CSV (Non-checkés)"><i className="fas fa-file-csv"></i> <i className="fas fa-times"></i></button>
                        </div>
                    </div>
                </div>
                {isLoading && <div className="text-center p-8 text-gray-500">Chargement des inscrits...</div>}
                {error && <div className="text-center p-8 text-red-500">Erreur: {error}</div>}
                {!isLoading && !error && registrations.length === 0 && <div className="text-center p-8 text-gray-500">Aucune inscription trouvée{debouncedSearchTerm ? ` pour \"${debouncedSearchTerm}\"` : ''}.</div>}

                {!isLoading && !error && registrations.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nom</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
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
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                ${reg.pass_type === 'conference' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' : 
                                                reg.pass_type === 'full' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 
                                                'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'} capitalize`}>
                                                {reg.pass_type.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{formatDate(reg.registration_date)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {reg.is_checked_in ? (
                                                <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">Oui</span>
                                            ) : (
                                                <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100">Non</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {formatDate(reg.check_in_time, true)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end gap-2">
                                                {!reg.is_checked_in && (
                                                    <button 
                                                        onClick={() => handleCheckin(reg.id!)} 
                                                        className="bg-green-600 text-white px-3 py-1 rounded-md text-sm hover:bg-green-700 transition"
                                                        title="Marquer comme Check-in"
                                                    >
                                                        <i className="fas fa-check-circle mr-1"></i> Check-in
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};
