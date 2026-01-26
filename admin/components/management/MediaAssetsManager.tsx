
import React, { useState, useEffect } from 'react';
import axios from 'axios';

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

  useEffect(() => {
    fetchMediaAssets();
  }, []);

  const fetchMediaAssets = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:4000/api/media-assets');
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
      await axios.post('http://localhost:4000/api/media-assets', formData, {
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
        await axios.delete(`http://localhost:4000/api/media-assets/${id}`);
        fetchMediaAssets();
      } catch (err) {
        setError('Impossible de supprimer l\'actif média.');
        console.error(err);
      }
    }
  };

  if (loading) return <div className="p-4">Chargement des actifs médias...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Gestion des Actifs Médias</h2>
      
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h3 className="text-xl font-bold mb-4">Télécharger un nouvel actif</h3>
        <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Fichier</label>
            <input type="file" onChange={handleFileChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-green file:text-white hover:file:bg-green-700" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <select name="type" value={newAssetData.type} onChange={handleNewAssetDataChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
                <option value="image">Image</option>
                <option value="video">Vidéo</option>
                <option value="document">Document</option>
            </select>
          </div>
          <input type="text" name="title_fr" value={newAssetData.title_fr} onChange={handleNewAssetDataChange} placeholder="Titre (FR)" className="p-2 border rounded-md" />
          <input type="text" name="title_en" value={newAssetData.title_en} onChange={handleNewAssetDataChange} placeholder="Titre (EN)" className="p-2 border rounded-md" />
          <input type="text" name="alt_text_fr" value={newAssetData.alt_text_fr} onChange={handleNewAssetDataChange} placeholder="Texte Alt (FR)" className="p-2 border rounded-md" />
          <input type="text" name="alt_text_en" value={newAssetData.alt_text_en} onChange={handleNewAssetDataChange} placeholder="Texte Alt (EN)" className="p-2 border rounded-md" />
          <textarea name="description_fr" value={newAssetData.description_fr} onChange={handleNewAssetDataChange} placeholder="Description (FR)" className="p-2 border rounded-md" rows={2}></textarea>
          <textarea name="description_en" value={newAssetData.description_en} onChange={handleNewAssetDataChange} placeholder="Description (EN)" className="p-2 border rounded-md" rows={2}></textarea>
          <div className="flex items-center gap-2">
            <input type="checkbox" name="is_active" checked={newAssetData.is_active} onChange={handleNewAssetDataChange} className="h-4 w-4 text-brand-green focus:ring-brand-green border-gray-300 rounded" />
            <label className="text-sm font-medium text-gray-700">Actif</label>
          </div>
          <button type="submit" disabled={uploading} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 md:col-span-2">
            {uploading ? 'Téléchargement...' : 'Télécharger'}
          </button>
        </form>
      </div>

      <div className="bg-white shadow rounded-lg overflow-x-auto">
        {assets.length === 0 ? (
          <p className="p-4 text-center text-gray-500">Aucun actif média pour le moment.</p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aperçu</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Titre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">URL</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actif</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {assets.map((asset) => (
                <tr key={asset.id}>
                  <td className="px-6 py-4">
                    {asset.type === 'image' && <img src={asset.file_url} alt={asset.alt_text_fr} className="h-16 w-16 object-cover rounded-md" />}
                    {asset.type === 'video' && <video src={asset.file_url} controls className="h-16 w-16 object-cover rounded-md" />}
                    {asset.type === 'document' && <i className="fas fa-file-alt text-4xl text-gray-400"></i>}
                  </td>
                  <td className="px-6 py-4">{asset.title_fr}</td>
                  <td className="px-6 py-4">{asset.type}</td>
                  <td className="px-6 py-4"><a href={asset.file_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Voir</a></td>
                  <td className="px-6 py-4">{asset.is_active ? 'Oui' : 'Non'}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleDelete(asset.id)} className="text-red-600 hover:text-red-900">Supprimer</button>
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

export default MediaAssetsManager;
