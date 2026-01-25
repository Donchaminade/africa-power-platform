import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import Pagination from '../ui/Pagination';

const API_URL = 'http://localhost:4000/api';

// Custom hook for debouncing
const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => { setDebouncedValue(value); }, delay);
        return () => { clearTimeout(handler); };
    }, [value, delay]);
    return debouncedValue;
};

interface Registration {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    company?: string;
    pass_type: string;
    registration_date: string;
}

const RegistrationsManager: React.FC = () => {
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalItems, setTotalItems] = useState(0);

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

    const handleExportCsv = async () => {
        try {
            // Fetch all registrations without pagination for the export
            const response = await fetch(`${API_URL}/registrations`);
            if (!response.ok) throw new Error('Failed to fetch data for export');
            const allRegistrations = await response.json();
            
            const csv = Papa.unparse(allRegistrations.data);
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

    const renderContent = () => {
        if (isLoading) return <div className="text-center p-8">Loading registrations...</div>;
        if (error) return <div className="text-center p-8 text-red-500">Error: {error}</div>;
        if (registrations.length === 0) {
            return <div className="text-center p-8">No registrations found{debouncedSearchTerm ? ` for "${debouncedSearchTerm}"` : ''}.</div>;
        }

        return (
            <table className="w-full text-left align-middle">
                <thead className="border-b border-gray-200 dark:border-gray-700">
                    <tr>
                        <th className="p-4">Nom</th>
                        <th className="p-4">Email</th>
                        <th className="p-4">Compagnie</th>
                        <th className="p-4">Pass</th>
                        <th className="p-4">Date</th>
                        <th className="p-4 text-center">Ticket</th>
                    </tr>
                </thead>
                <tbody>
                    {registrations.map(reg => (
                        <tr key={reg.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                            <td className="p-4">{reg.first_name} {reg.last_name}</td>
                            <td className="p-4">{reg.email}</td>
                            <td className="p-4">{reg.company || 'N/A'}</td>
                            <td className="p-4"><span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 capitalize">{reg.pass_type.replace('_', ' ')}</span></td>
                            <td className="p-4">{new Date(reg.registration_date).toLocaleDateString()}</td>
                            <td className="p-4 text-center">
                                <a href={`${API_URL}/ticket/${reg.id}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700" title="Download Ticket">
                                    <i className="fas fa-download"></i>
                                </a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    }

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
                        className="px-4 py-2 w-64 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600"
                    />
                    <button onClick={handleExportCsv} className="bg-blue-600 text-white px-5 py-2 rounded-md font-semibold hover:bg-blue-700 transition">
                        <i className="fas fa-file-export mr-2"></i> Export CSV
                    </button>
                </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md overflow-x-auto">
                {renderContent()}
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            </div>
        </div>
    );
};

export default RegistrationsManager;
