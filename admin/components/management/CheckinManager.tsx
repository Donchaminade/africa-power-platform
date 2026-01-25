import React, { useState, useEffect } from 'react';
import { API_URL } from '../../../utils/config';
import { Registration } from '../../../utils/types'; // Using the shared Registration interface
import { useDebounce } from './RegistrationsManager'; // Re-use the debounce hook

const CheckinManager: React.FC = () => {
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
            url.searchParams.append('limit', '9999'); // Fetch all for check-in management
            if (debouncedSearchTerm) {
                url.searchParams.append('search', debouncedSearchTerm);
            }
            const response = await fetch(url.toString());
            if (!response.ok) throw new Error('Failed to fetch registrations');
            const result = await response.json();
            // Assuming the backend returns the correct structure, possibly result.data
            setRegistrations(result.data || result); 
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
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
            const response = await fetch(`${API_URL}/checkin/${registrationId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Check-in failed.');
            }

            setMessage({ type: 'success', text: result.message });
            // Update the registration status in the local state or re-fetch
            fetchRegistrations(); // Re-fetch to get updated data
        } catch (err) {
            setMessage({ type: 'error', text: err instanceof Error ? err.message : 'An unknown error occurred during check-in.' });
        }
    };

    const renderContent = () => {
        if (isLoading) return <div className="text-center p-8">Chargement des inscrits...</div>;
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
                                        {!reg.is_checked_in && (
                                            <button 
                                                onClick={() => handleCheckin(reg.id!)} // Use ! for non-null assertion as id is always present for existing regs
                                                className="bg-green-600 text-white px-3 py-1 rounded-md text-sm hover:bg-green-700 transition"
                                                title="Marquer comme Check-in"
                                            >
                                                Check-in
                                            </button>
                                        )}
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
        <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Gestion du Check-in</h2>
            
            {message && (
                <div className={`p-4 rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {message.text}
                </div>
            )}

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">Liste des Inscrits</h3>
                    <input
                        type="text"
                        placeholder="Rechercher par nom, email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-4 py-2 w-64 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:ring-green-500 focus:border-green-500"
                    />
                </div>
                {renderContent()}
            </div>
        </div>
    );
};

export default CheckinManager;