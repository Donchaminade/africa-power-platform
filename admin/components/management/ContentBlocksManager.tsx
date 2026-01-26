
import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface ContentBlock {
  id: number;
  name: string;
  content_fr: string;
  content_en: string;
  type: string;
  is_active: boolean;
}

const ContentBlocksManager: React.FC = () => {
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingBlock, setEditingBlock] = useState<ContentBlock | null>(null);

  useEffect(() => {
    fetchContentBlocks();
  }, []);

  const fetchContentBlocks = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:4000/api/content-blocks');
      setContentBlocks(response.data);
      setError(null);
    } catch (err) {
      setError('Impossible de charger les blocs de contenu.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (block: ContentBlock) => {
    setEditingBlock({ ...block });
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce bloc de contenu ?')) {
      try {
        await axios.delete(`http://localhost:4000/api/content-blocks/${id}`);
        fetchContentBlocks();
      } catch (err) {
        setError('Impossible de supprimer le bloc de contenu.');
        console.error(err);
      }
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (editingBlock) {
        const { name, value, type } = e.target;
        setEditingBlock({
            ...editingBlock,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
        });
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlock) return;

    try {
      if (editingBlock.id) {
        await axios.put(`http://localhost:4000/api/content-blocks/${editingBlock.id}`, editingBlock);
      } else {
        await axios.post('http://localhost:4000/api/content-blocks', editingBlock);
      }
      setEditingBlock(null);
      fetchContentBlocks();
    } catch (err) {
      setError('Impossible de sauvegarder le bloc de contenu.');
      console.error(err);
    }
  };
  
  const handleAddNew = () => {
    setEditingBlock({
        id: 0,
        name: '',
        content_fr: '',
        content_en: '',
        type: 'text', // Default type
        is_active: true,
    });
  };

  if (loading) return <div className="p-4">Chargement...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Gestion des Blocs de Contenu</h2>
      
      <div className="mb-6">
        <button onClick={handleAddNew} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
          Ajouter un nouveau bloc
        </button>
      </div>

      {editingBlock && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-xl font-bold mb-4">{editingBlock.id ? 'Modifier le bloc' : 'Ajouter un bloc'}</h3>
          <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input type="text" name="name" value={editingBlock.name} onChange={handleFormChange} placeholder="Nom du bloc (identifiant unique)" className="p-2 border rounded-md" required />
            <select name="type" value={editingBlock.type} onChange={handleFormChange} className="p-2 border rounded-md">
                <option value="text">Texte</option>
                <option value="html">HTML</option>
                <option value="markdown">Markdown</option>
            </select>
            <textarea name="content_fr" value={editingBlock.content_fr} onChange={handleFormChange} placeholder="Contenu (FR)" className="p-2 border rounded-md md:col-span-2" rows={5}></textarea>
            <textarea name="content_en" value={editingBlock.content_en} onChange={handleFormChange} placeholder="Contenu (EN)" className="p-2 border rounded-md md:col-span-2" rows={5}></textarea>
            
            <div className="flex items-center gap-2 md:col-span-2">
                <input type="checkbox" name="is_active" checked={editingBlock.is_active} onChange={handleFormChange} className="h-4 w-4 text-brand-green focus:ring-brand-green border-gray-300 rounded" />
                <label>Actif</label>
            </div>

            <div className="md:col-span-2 flex justify-end gap-4">
              <button type="button" onClick={() => setEditingBlock(null)} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md">Annuler</button>
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Sauvegarder</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actif</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {contentBlocks.map(block => (
                <tr key={block.id}>
                  <td className="px-6 py-4">{block.name}</td>
                  <td className="px-6 py-4">{block.type}</td>
                  <td className="px-6 py-4">{block.is_active ? 'Oui' : 'Non'}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleEdit(block)} className="text-blue-600 hover:text-blue-900 mr-4">Modifier</button>
                    <button onClick={() => handleDelete(block.id)} className="text-red-600 hover:text-red-900">Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContentBlocksManager;
