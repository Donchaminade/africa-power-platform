import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../config';

interface Subscriber {
  id: number;
  email: string;
  subscribed_at: string;
  is_active: boolean;
}

const NewsletterManager: React.FC = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/newsletter?all=true`);
      setSubscribers(response.data);
      setError(null);
    } catch (err) {
      setError('Impossible de charger les abonnés.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet abonné ?')) {
      try {
        await axios.delete(`${API_URL}/newsletter/${id}`);
        setSubscribers(subscribers.filter(sub => sub.id !== id));
      } catch (err) {
        setError('Impossible de supprimer l\'abonné.');
        console.error(err);
      }
    }
  };

  if (loading) {
    return <div className="p-4 text-center text-gray-500">Chargement des abonnés...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500 text-center">Erreur: {error}</div>;
  }

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Gestion de la Newsletter</h2>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        {subscribers.length === 0 ? (
          <p className="p-4 text-center text-gray-500 dark:text-gray-400">Aucun abonné pour le moment.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date d'inscription</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Statut</th>
                  <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {subscribers.map((sub) => (
                  <tr key={sub.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{sub.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{new Date(sub.subscribed_at).toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {sub.is_active ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                              Actif
                          </span>
                      ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100">
                              Inactif
                          </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDelete(sub.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200"
                      >
                        <i className="fas fa-trash-alt mr-1"></i> Supprimer
                      </button>
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

export default NewsletterManager;
