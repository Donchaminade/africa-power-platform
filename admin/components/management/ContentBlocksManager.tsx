
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../config';

interface ContentBlock {
  id: number;
  block_key: string;
  display_name: string;
  content_fr: string;
  content_en: string;
  page_section: string;
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
      const response = await axios.get(`${API_URL}/content-blocks`);
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
        await axios.delete(`${API_URL}/content-blocks/${id}`);
        fetchContentBlocks();
      } catch (err) {
        setError('Impossible de supprimer le bloc de contenu.');
        console.error(err);
      }
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (editingBlock) {
        const { name, value } = e.target;
        setEditingBlock({
            ...editingBlock,
            [name]: value,
        });
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlock) return;

    try {
      if (editingBlock.id) {
        await axios.put(`${API_URL}/content-blocks/${editingBlock.id}`, editingBlock);
      } else {
        await axios.post(`${API_URL}/content-blocks`, editingBlock);
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
        block_key: '',
        display_name: '', // Initialize display_name
        content_fr: '',
        content_en: '',
        page_section: '',
    });
  };

  if (loading) return <div className="p-4 text-center text-gray-500">Chargement des blocs de contenu...</div>;
  if (error) return <div className="p-4 text-red-500 text-center">Erreur: {error}</div>;

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Gestion des Blocs de Contenu</h2>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{editingBlock ? 'Modifier le bloc' : 'Liste des blocs de contenu'}</h3>
          <button onClick={handleAddNew} className="bg-brand-green text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors duration-200">
            <i className="fas fa-plus mr-2"></i> Ajouter un nouveau bloc
          </button>
        </div>

        {editingBlock && (
          <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-md">
            <div>
              <label htmlFor="display_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nom affichable (pour les admins)</label>
              <input type="text" name="display_name" id="display_name" value={editingBlock.display_name} onChange={handleFormChange} placeholder="Ex: Titre de la section Hero" className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white" required />
            </div>
            <div>
              <label htmlFor="block_key" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Clé du bloc (identifiant unique)</label>
              <input type="text" name="block_key" id="block_key" value={editingBlock.block_key} onChange={handleFormChange} placeholder="Clé du bloc (ex: homepage_intro_text)" className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white" required />
            </div>
            <div>
              <label htmlFor="page_section" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Section de la page</label>
              <input type="text" name="page_section" id="page_section" value={editingBlock.page_section} onChange={handleFormChange} placeholder="Section (ex: hero, about)" className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="content_fr" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Contenu (Français)</label>
              <textarea name="content_fr" id="content_fr" value={editingBlock.content_fr} onChange={handleFormChange} placeholder="Contenu en français" className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white" rows={5}></textarea>
            </div>
            <div className="md:col-span-2">
              <label htmlFor="content_en" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Contenu (Anglais)</label>
              <textarea name="content_en" id="content_en" value={editingBlock.content_en} onChange={handleFormChange} placeholder="Contenu en anglais" className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white" rows={5}></textarea>
            </div>
            
            <div className="md:col-span-2 flex justify-end gap-4">
              <button type="button" onClick={() => setEditingBlock(null)} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">Annuler</button>
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200">
                <i className="fas fa-save mr-2"></i> Sauvegarder
              </button>
            </div>
          </form>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nom Affichable</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Clé du Bloc</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Section</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {contentBlocks.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">Aucun bloc de contenu trouvé.</td>
                  </tr>
                ) : (
                  contentBlocks.map(block => (
                    <tr key={block.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{block.display_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{block.block_key}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{block.page_section}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => handleEdit(block)} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-4 transition-colors duration-200">
                          <i className="fas fa-edit mr-1"></i> Modifier
                        </button>
                        <button onClick={() => handleDelete(block.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200">
                          <i className="fas fa-trash-alt mr-1"></i> Supprimer
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ContentBlocksManager;

