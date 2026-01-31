import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL, UPLOADS_URL } from '../../config';

interface MediaAsset {
  id: number;
  file_name: string;
  file_url: string;
  title_fr: string;
  title_en: string;
  alt_text_fr: string;
  alt_text_en: string;
  description_fr: string;
  description_en: string;
  type: string;
  mime_type: string;
  file_size: number;
  is_active: boolean;
  uploaded_at: string;
}

const MediaAssetsManager: React.FC = () => {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [newAssetData, setNewAssetData] = useState({
    title_fr: '', title_en: '', alt_text_fr: '', alt_text_en: '', description_fr: '', description_en: '', type: 'image', is_active: true
  });
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null); // For details modal

  useEffect(() => {
    fetchMediaAssets();
  }, []);

  const getFullAssetUrl = (path: string) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `${UPLOADS_URL}${path}`;
  };

  const fetchMediaAssets = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/media-assets`);
      setAssets(response.data);
      setError(null);
    } catch (err) {
      setError('Impossible de charger les actifs médias.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleNewAssetDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setNewAssetData({
      ...newAssetData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Veuillez sélectionner un fichier à télécharger.');
      return;
    }
    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('media_file', file);
    Object.entries(newAssetData).forEach(([key, value]) => {
      formData.append(key, String(value));
    });

    try {
      await axios.post(`${API_URL}/media-assets`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setFile(null);
      setNewAssetData({
        title_fr: '', title_en: '', alt_text_fr: '', alt_text_en: '', description_fr: '', description_en: '', type: 'image', is_active: true
      });
      fetchMediaAssets();
    } catch (err) {
      setError('Erreur lors du téléchargement de l\'actif média.');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet actif média ?')) {
      try {
        await axios.delete(`${API_URL}/media-assets/${id}`);
        fetchMediaAssets();
      } catch (err) {
        setError('Impossible de supprimer l\'actif média.');
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

  if (loading) return <div className="p-4 text-center text-gray-500">Chargement des actifs médias...</div>;
  if (error) return <div className="p-4 text-red-500 text-center">Erreur: {error}</div>;

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Gestion des Actifs Médias</h2>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Télécharger un nouvel actif</h3>
        <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fichier</label>
            <input type="file" onChange={handleFileChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-green file:text-white hover:file:bg-green-700 cursor-pointer" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
            <select name="type" value={newAssetData.type} onChange={handleNewAssetDataChange} className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="image">Image</option>
                <option value="video">Vidéo</option>
                <option value="document">Document</option>
            </select>
          </div>
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Titre (Français)</label>
              <input type="text" name="title_fr" value={newAssetData.title_fr} onChange={handleNewAssetDataChange} placeholder="Titre (FR)" className="block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Titre (Anglais)</label>
              <input type="text" name="title_en" value={newAssetData.title_en} onChange={handleNewAssetDataChange} placeholder="Titre (EN)" className="block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>
          </div>
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Texte Alt (Français)</label>
              <input type="text" name="alt_text_fr" value={newAssetData.alt_text_fr} onChange={handleNewAssetDataChange} placeholder="Texte Alt (FR)" className="block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Texte Alt (Anglais)</label>
              <input type="text" name="alt_text_en" value={newAssetData.alt_text_en} onChange={handleNewAssetDataChange} placeholder="Texte Alt (EN)" className="block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description (Français)</label>
            <textarea name="description_fr" value={newAssetData.description_fr} onChange={handleNewAssetDataChange} placeholder="Description (FR)" className="block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white" rows={2}></textarea>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description (Anglais)</label>
            <textarea name="description_en" value={newAssetData.description_en} onChange={handleNewAssetDataChange} placeholder="Description (EN)" className="block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white" rows={2}></textarea>
          </div>
          <div className="flex items-center gap-2 md:col-span-2">
            <input type="checkbox" name="is_active" id="asset_is_active" checked={newAssetData.is_active} onChange={handleNewAssetDataChange} className="h-4 w-4 text-brand-green focus:ring-brand-green border-gray-300 rounded" />
            <label htmlFor="asset_is_active" className="text-sm font-medium text-gray-700 dark:text-gray-300">Actif</label>
          </div>
          <button type="submit" disabled={uploading} className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 md:col-span-2 transition-colors duration-200">
            {uploading ? 'Téléchargement...' : <><i className="fas fa-upload mr-2"></i> Télécharger</>}
          </button>
        </form>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Liste des Actifs Médias</h3>
        {assets.length === 0 ? (
          <p className="p-4 text-center text-gray-500 dark:text-gray-400">Aucun actif média pour le moment.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Aperçu</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Titre (FR)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date d'upload</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actif</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {assets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {asset.type === 'image' && <img src={getFullAssetUrl(asset.file_url)} alt={asset.alt_text_fr} className="h-16 w-16 object-cover rounded-md" />}
                      {asset.type === 'video' && <video src={getFullAssetUrl(asset.file_url)} controls className="h-16 w-16 object-cover rounded-md" />}
                      {asset.type === 'document' && <i className="fas fa-file-alt text-4xl text-gray-400"></i>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{asset.title_fr}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{asset.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{formatDate(asset.uploaded_at)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {asset.is_active ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">Oui</span>
                      ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100">Non</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => setSelectedAsset(asset)}
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-4 transition-colors duration-200"
                        title="Voir les détails"
                      >
                        <i className="fas fa-eye"></i> Détails
                      </button>
                      <a
                        href={getFullAssetUrl(asset.file_url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-4 transition-colors duration-200"
                        title="Voir le fichier"
                      >
                        <i className="fas fa-external-link-alt"></i> Voir
                      </a>
                      <button
                        onClick={() => handleDelete(asset.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200"
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
      {selectedAsset && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-2xl">
            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Détails de l\'Actif Média</h3>
            <div className="grid grid-cols-2 gap-4 text-gray-700 dark:text-gray-300">
              <div>
                <p><strong>Nom du fichier:</strong> {selectedAsset.file_name}</p>
                <p><strong>Titre (FR):</strong> {selectedAsset.title_fr || 'N/A'}</p>
                <p><strong>Titre (EN):</strong> {selectedAsset.title_en || 'N/A'}</p>
                <p><strong>Type:</strong> {selectedAsset.type}</p>
                <p><strong>MIME Type:</strong> {selectedAsset.mime_type}</p>
                <p><strong>Taille:</strong> {(selectedAsset.file_size / 1024).toFixed(2)} KB</p>
              </div>
              <div>
                <p><strong>URL:</strong> <a href={getFullAssetUrl(selectedAsset.file_url)} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate">{selectedAsset.file_url}</a></p>
                <p><strong>Texte Alt (FR):</strong> {selectedAsset.alt_text_fr || 'N/A'}</p>
                <p><strong>Texte Alt (EN):</strong> {selectedAsset.alt_text_en || 'N/A'}</p>
                <p><strong>Actif:</strong> {selectedAsset.is_active ? 'Oui' : 'Non'}</p>
                <p><strong>Uploadé le:</strong> {formatDate(selectedAsset.uploaded_at)}</p>
              </div>
            </div>
            <div className="mt-4">
              <p><strong>Description (FR):</strong></p>
              <p className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md border border-gray-200 dark:border-gray-600 whitespace-pre-wrap">{selectedAsset.description_fr || 'N/A'}</p>
            </div>
            <div className="mt-4">
              <p><strong>Description (EN):</strong></p>
              <p className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md border border-gray-200 dark:border-gray-600 whitespace-pre-wrap">{selectedAsset.description_en || 'N/A'}</p>
            </div>
            <div className="mt-6">
                {selectedAsset.type === 'image' && <img src={getFullAssetUrl(selectedAsset.file_url)} alt={selectedAsset.alt_text_fr} className="max-w-full h-auto object-contain rounded-md border border-gray-200 dark:border-gray-700 mx-auto" />}
                {selectedAsset.type === 'video' && <video src={getFullAssetUrl(selectedAsset.file_url)} controls className="max-w-full h-auto object-contain rounded-md border border-gray-200 dark:border-gray-700 mx-auto" />}
                {selectedAsset.type === 'document' && <p className="text-center text-gray-500"><i className="fas fa-file-alt text-6xl"></i><br/>Document Preview Not Available</p>}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedAsset(null)}
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

export default MediaAssetsManager;