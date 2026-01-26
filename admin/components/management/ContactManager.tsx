
import React, { useState, useEffect } from 'react';
import axios from 'axios';

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

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:4000/api/contact');
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
        await axios.delete(`http://localhost:4000/api/contact/${id}`);
        setMessages(messages.filter(msg => msg.id !== id));
      } catch (err) {
        setError('Impossible de supprimer le message.');
        console.error(err);
      }
    }
  };

  if (loading) {
    return <div className="p-4">Chargement des messages...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Gestion des Messages de Contact</h2>
      
      <div className="bg-white shadow rounded-lg overflow-x-auto">
        {messages.length === 0 ? (
          <p className="p-4 text-center text-gray-500">Aucun message pour le moment.</p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sujet</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {messages.map((msg) => (
                <tr key={msg.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{msg.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{msg.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{msg.subject}</td>
                  <td className="px-6 py-4 text-sm text-gray-500"><div className="w-64 truncate">{msg.message}</div></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(msg.submitted_at).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleDelete(msg.id)}
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

export default ContactManager;
