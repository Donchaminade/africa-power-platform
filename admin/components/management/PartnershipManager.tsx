
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../config';

interface PartnershipRequest {
  id: number;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  message: string;
  submitted_at: string; // Changed from created_at to submitted_at
}

const PartnershipManager: React.FC = () => {
  const [requests, setRequests] = useState<PartnershipRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<PartnershipRequest | null>(null); // For details modal

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/partnership-requests`);
      setRequests(response.data);
      setError(null);
    } catch (err) {
      setError('Impossible de charger les demandes.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette demande ?')) {
      try {
        await axios.delete(`${API_URL}/partnership-requests/${id}`);
        setRequests(requests.filter(req => req.id !== id));
      } catch (err) {
        setError('Impossible de supprimer la demande.');
        console.error(err);
      }
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Date invalide";
      }
      return date.toLocaleString('fr-FR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      return "Date invalide";
    }
  };

  if (loading) {
    return <div className="p-4 text-center text-gray-500">Chargement des demandes...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500 text-center">Erreur: {error}</div>;
  }

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Gestion des Demandes de Partenariat</h2>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        {requests.length === 0 ? (
          <p className="p-4 text-center text-gray-500 dark:text-gray-400">Aucune demande pour le moment.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Entreprise</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Contact</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Téléphone</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                  <th scope="col" className="relative px-6 py-3 text-right"><span className="sr-only">Actions</span>Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {requests.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{req.company_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{req.contact_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{req.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{req.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{formatDate(req.submitted_at)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => setSelectedRequest(req)}
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-4 transition-colors duration-200"
                        title="Voir les détails"
                      >
                        <i className="fas fa-eye"></i> Détails
                      </button>
                      <a
                        href={`mailto:${req.email}?subject=Regarding your partnership request with Africa Power Platform&body=${encodeURIComponent(req.message)}`}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-4 transition-colors duration-200"
                        title="Répondre par email"
                      >
                        <i className="fas fa-reply"></i> Contacter
                      </a>
                      <button
                        onClick={() => handleDelete(req.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200"
                        title="Supprimer la demande"
                      >
                        <i className="fas fa-trash-alt"></i> Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg">
            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Détails de la Demande</h3>
            <div className="space-y-2 text-gray-700 dark:text-gray-300">
              <p><strong>Nom de l'entreprise:</strong> {selectedRequest.company_name}</p>
              <p><strong>Nom du contact:</strong> {selectedRequest.contact_name}</p>
              <p><strong>Email:</strong> <a href={`mailto:${selectedRequest.email}`} className="text-blue-600 hover:underline">{selectedRequest.email}</a></p>
              <p><strong>Téléphone:</strong> {selectedRequest.phone || 'N/A'}</p>
              <p><strong>Message:</strong></p>
              <p className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md border border-gray-200 dark:border-gray-600 whitespace-pre-wrap">{selectedRequest.message || 'N/A'}</p>
              <p><strong>Soumise le:</strong> {formatDate(selectedRequest.submitted_at)}</p>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedRequest(null)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors duration-200"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartnershipManager;
