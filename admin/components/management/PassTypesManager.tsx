
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PassType } from '../../../utils/types';

const PassTypesManager: React.FC = () => {
  const [passTypes, setPassTypes] = useState<PassType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingPass, setEditingPass] = useState<PassType | null>(null);

  useEffect(() => {
    fetchPassTypes();
  }, []);

  const fetchPassTypes = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:4000/api/passes?all=true');
      setPassTypes(response.data);
      setError(null);
    } catch (err) {
      setError('Impossible de charger les types de pass.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (pass: PassType) => {
    setEditingPass({ ...pass });
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce type de pass ?')) {
      try {
        await axios.delete(`http://localhost:4000/api/passes/${id}`);
        fetchPassTypes();
      } catch (err) {
        setError('Impossible de supprimer le type de pass.');
        console.error(err);
      }
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (editingPass) {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const { checked } = e.target as HTMLInputElement;
            setEditingPass({ ...editingPass, [name]: checked });
        } else if (name.includes('features')) {
            const lang = name.split('_')[1];
            setEditingPass({ ...editingPass, [`features_${lang}`]: value.split('\n') });
        }
        
        else {
            setEditingPass({ ...editingPass, [name]: value });
        }
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPass) return;

    try {
      if (editingPass.id) {
        await axios.put(`http://localhost:4000/api/passes/${editingPass.id}`, editingPass);
      } else {
        await axios.post('http://localhost:4000/api/passes', editingPass);
      }
      setEditingPass(null);
      fetchPassTypes();
    } catch (err) {
      setError('Impossible de sauvegarder le type de pass.');
      console.error(err);
    }
  };
  
  const handleAddNew = () => {
    setEditingPass({
        id: 0,
        name_fr: '',
        name_en: '',
        description_fr: '',
        description_en: '',
        price_fr: '',
        price_en: '',
        features_fr: [],
        features_en: [],
        is_active: true,
        display_order: passTypes.length + 1,
        tag_fr: '',
        tag_en: '',
    });
  };

  if (loading) return <div className="p-4">Chargement...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Gestion des Types de Pass</h2>
      
      <div className="mb-6">
        <button onClick={handleAddNew} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
          Ajouter un nouveau pass
        </button>
      </div>

      {editingPass && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-xl font-bold mb-4">{editingPass.id ? 'Modifier le pass' : 'Ajouter un pass'}</h3>
          <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input type="text" name="name_fr" value={editingPass.name_fr} onChange={handleFormChange} placeholder="Nom (FR)" className="p-2 border rounded-md" />
            <input type="text" name="name_en" value={editingPass.name_en} onChange={handleFormChange} placeholder="Nom (EN)" className="p-2 border rounded-md" />
            <textarea name="description_fr" value={editingPass.description_fr} onChange={handleFormChange} placeholder="Description (FR)" className="p-2 border rounded-md md:col-span-2"></textarea>
            <textarea name="description_en" value={editingPass.description_en} onChange={handleFormChange} placeholder="Description (EN)" className="p-2 border rounded-md md:col-span-2"></textarea>
            <input type="text" name="price_fr" value={editingPass.price_fr} onChange={handleFormChange} placeholder="Prix (FR)" className="p-2 border rounded-md" />
            <input type="text" name="price_en" value={editingPass.price_en} onChange={handleFormChange} placeholder="Prix (EN)" className="p-2 border rounded-md" />
            <textarea name="features_fr" value={editingPass.features_fr.join('\n')} onChange={handleFormChange} placeholder="Avantages (FR, un par ligne)" className="p-2 border rounded-md"></textarea>
            <textarea name="features_en" value={editingPass.features_en.join('\n')} onChange={handleFormChange} placeholder="Avantages (EN, un par ligne)" className="p-2 border rounded-md"></textarea>
            <input type="text" name="tag_fr" value={editingPass.tag_fr || ''} onChange={handleFormChange} placeholder="Tag (FR)" className="p-2 border rounded-md" />
            <input type="text" name="tag_en" value={editingPass.tag_en || ''} onChange={handleFormChange} placeholder="Tag (EN)" className="p-2 border rounded-md" />
            <input type="number" name="display_order" value={editingPass.display_order} onChange={handleFormChange} placeholder="Ordre d'affichage" className="p-2 border rounded-md" />
            <div className="flex items-center gap-2">
                <input type="checkbox" name="is_active" checked={editingPass.is_active} onChange={handleFormChange} className="h-4 w-4 text-brand-green focus:ring-brand-green border-gray-300 rounded" />
                <label>Actif</label>
            </div>

            <div className="md:col-span-2 flex justify-end gap-4">
              <button type="button" onClick={() => setEditingPass(null)} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md">Annuler</button>
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Sauvegarder</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ordre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prix</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actif</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {passTypes.map(pass => (
                <tr key={pass.id}>
                  <td className="px-6 py-4">{pass.display_order}</td>
                  <td className="px-6 py-4">{pass.name_fr}</td>
                  <td className="px-6 py-4">{pass.price_fr}</td>
                  <td className="px-6 py-4">{pass.is_active ? 'Oui' : 'Non'}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleEdit(pass)} className="text-blue-600 hover:text-blue-900 mr-4">Modifier</button>
                    <button onClick={() => handleDelete(pass.id)} className="text-red-600 hover:text-red-900">Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default PassTypesManager;
