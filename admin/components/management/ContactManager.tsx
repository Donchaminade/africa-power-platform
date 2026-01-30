
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../config';

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  submitted_at: string;
}

const ContactManager: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null); // For details modal

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await axios.get('`${API_URL}/contact`');
      setMessages(response.data);
      setError(null);
    } catch (err) {
      setError('Impossible de charger les messages.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) {
      try {
        await axios.delete(`${API_URL}/contact/${id}`);
        setMessages(messages.filter(msg => msg.id !== id));
      } catch (err) {
        setError('Impossible de supprimer le message.');
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
    return <div className="p-4 text-center text-gray-500">Chargement des messages...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500 text-center">Erreur: {error}</div>;
  }

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Gestion des Messages de Contact</h2>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        {messages.length === 0 ? (
          <p className="p-4 text-center text-gray-500 dark:text-gray-400">Aucun message pour le moment.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nom</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Sujet</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                  <th scope="col" className="relative px-6 py-3 text-right"><span className="sr-only">Actions</span>Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {messages.map((msg) => (
                  <tr key={msg.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{msg.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{msg.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{msg.subject}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{formatDate(msg.submitted_at)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => setSelectedMessage(msg)}
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-4 transition-colors duration-200"
                        title="Voir les détails"
                      >
                        <i className="fas fa-eye"></i> Détails
                      </button>
                      <a
                        href={`mailto:${msg.email}?subject=${encodeURIComponent(msg.subject)}&body=${encodeURIComponent(msg.message)}`}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-4 transition-colors duration-200"
                        title="Répondre par email"
                      >
                        <i className="fas fa-reply"></i> Contacter
                      </a>
                      <button
                        onClick={() => handleDelete(msg.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200"
                        title="Supprimer le message"
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
      {selectedMessage && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg">
            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Détails du Message</h3>
            <div className="space-y-2 text-gray-700 dark:text-gray-300">
              <p><strong>Nom:</strong> {selectedMessage.name}</p>
              <p><strong>Email:</strong> <a href={`mailto:${selectedMessage.email}`} className="text-blue-600 hover:underline">{selectedMessage.email}</a></p>
              <p><strong>Sujet:</strong> {selectedMessage.subject}</p>
              <p><strong>Message:</strong></p>
              <p className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md border border-gray-200 dark:border-gray-600 whitespace-pre-wrap">{selectedMessage.message}</p>
              <p><strong>Reçu le:</strong> {formatDate(selectedMessage.submitted_at)}</p>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedMessage(null)}
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

export default ContactManager;
