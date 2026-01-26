
import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface PartnershipRequest {
  id: number;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  message: string;
  created_at: string;
}

const PartnershipManager: React.FC = () => {
  const [requests, setRequests] = useState<PartnershipRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:4000/api/partnership-requests');
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
        await axios.delete(`http://localhost:4000/api/partnership-requests/${id}`);
        setRequests(requests.filter(req => req.id !== id));
      } catch (err) {
        setError('Impossible de supprimer la demande.');
        console.error(err);
      }
    }
  };

  if (loading) {
    return <div className="p-4">Chargement des demandes...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Gestion des Demandes de Partenariat</h2>
      
      <div className="bg-white shadow rounded-lg overflow-x-auto">
        {requests.length === 0 ? (
          <p className="p-4 text-center text-gray-500">Aucune demande pour le moment.</p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entreprise</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Téléphone</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {requests.map((req) => (
                <tr key={req.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{req.company_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{req.contact_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{req.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{req.phone}</td>
                  <td className="px-6 py-4 text-sm text-gray-500"><div className="w-64 truncate">{req.message}</div></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(req.created_at).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleDelete(req.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default PartnershipManager;
