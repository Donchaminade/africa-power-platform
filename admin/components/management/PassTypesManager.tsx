
import React, { useState, useEffect } from 'react';
import { API_URL } from '../../config';
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

      const response = await axios.get(`${API_URL}/passes?all=true`);

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

        await axios.delete(`${API_URL}/passes/${id}`);

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

        await axios.put(`${API_URL}/passes/${editingPass.id}`, editingPass);

      } else {

        await axios.post(`${API_URL}/passes`, editingPass);

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



  if (loading) return <div className="p-4 text-center text-gray-500">Chargement des types de pass...</div>;

  if (error) return <div className="p-4 text-red-500 text-center">Erreur: {error}</div>;



  return (

    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">

      <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Gestion des Types de Pass</h2>

      

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">

        <div className="flex justify-between items-center mb-4">

          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{editingPass ? 'Modifier le pass' : 'Liste des types de pass'}</h3>

          <button onClick={handleAddNew} className="bg-brand-green text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors duration-200">

            <i className="fas fa-plus mr-2"></i> Ajouter un nouveau pass

          </button>

        </div>



        {editingPass && (

          <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-md">

            <div>

              <label htmlFor="name_fr" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nom (Français)</label>

              <input type="text" name="name_fr" id="name_fr" value={editingPass.name_fr} onChange={handleFormChange} placeholder="Nom du pass (FR)" className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white" required />

            </div>

            <div>

              <label htmlFor="name_en" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nom (Anglais)</label>

              <input type="text" name="name_en" id="name_en" value={editingPass.name_en} onChange={handleFormChange} placeholder="Nom du pass (EN)" className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white" required />

            </div>

            <div className="md:col-span-2">

              <label htmlFor="description_fr" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description (Français)</label>

              <textarea name="description_fr" id="description_fr" value={editingPass.description_fr} onChange={handleFormChange} placeholder="Description (FR)" className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white" rows={3}></textarea>

            </div>

            <div className="md:col-span-2">

              <label htmlFor="description_en" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description (Anglais)</label>

              <textarea name="description_en" id="description_en" value={editingPass.description_en} onChange={handleFormChange} placeholder="Description (EN)" className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white" rows={3}></textarea>

            </div>

            <div>

              <label htmlFor="price_fr" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Prix (Français)</label>

              <input type="text" name="price_fr" id="price_fr" value={editingPass.price_fr} onChange={handleFormChange} placeholder="Prix (FR)" className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />

            </div>

            <div>

              <label htmlFor="price_en" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Prix (Anglais)</label>

              <input type="text" name="price_en" id="price_en" value={editingPass.price_en} onChange={handleFormChange} placeholder="Prix (EN)" className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />

            </div>

            <div className="md:col-span-2">

              <label htmlFor="features_fr" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Avantages (Français, un par ligne)</label>

              <textarea name="features_fr" id="features_fr" value={editingPass.features_fr.join('\n')} onChange={handleFormChange} placeholder="Avantage 1&#10;Avantage 2" className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white" rows={3}></textarea>

            </div>

            <div className="md:col-span-2">

              <label htmlFor="features_en" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Avantages (Anglais, un par ligne)</label>

              <textarea name="features_en" id="features_en" value={editingPass.features_en.join('\n')} onChange={handleFormChange} placeholder="Feature 1&#10;Feature 2" className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white" rows={3}></textarea>

            </div>

            <div>

              <label htmlFor="tag_fr" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tag (Français)</label>

              <input type="text" name="tag_fr" id="tag_fr" value={editingPass.tag_fr || ''} onChange={handleFormChange} placeholder="Tag (FR)" className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />

            </div>

            <div>

              <label htmlFor="tag_en" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tag (Anglais)</label>

              <input type="text" name="tag_en" id="tag_en" value={editingPass.tag_en || ''} onChange={handleFormChange} placeholder="Tag (EN)" className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />

            </div>

            <div>

              <label htmlFor="display_order" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Ordre d'affichage</label>

              <input type="number" name="display_order" id="display_order" value={editingPass.display_order} onChange={handleFormChange} placeholder="Ordre d'affichage" className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />

            </div>

            <div className="flex items-center gap-2">

                <input type="checkbox" name="is_active" id="is_active" checked={editingPass.is_active} onChange={handleFormChange} className="h-4 w-4 text-brand-green focus:ring-brand-green border-gray-300 rounded" />

                <label htmlFor="is_active" className="text-sm font-medium text-gray-700 dark:text-gray-300">Actif</label>

            </div>



            <div className="md:col-span-2 flex justify-end gap-4 mt-6">

              <button type="button" onClick={() => setEditingPass(null)} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">Annuler</button>

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

                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ordre</th>

                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nom (FR)</th>

                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Prix (FR)</th>

                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tag (FR)</th>

                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actif</th>

                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>

                </tr>

              </thead>

              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">

                {passTypes.length === 0 ? (

                  <tr>

                    <td colSpan={6} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-center">Aucun type de pass trouvé.</td>

                  </tr>

                ) : (

                  passTypes.map(pass => (

                    <tr key={pass.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">

                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{pass.display_order}</td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{pass.name_fr}</td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{pass.price_fr}</td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{pass.tag_fr}</td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm">

                        {pass.is_active ? (

                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">Oui</span>

                        ) : (

                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100">Non</span>

                        )}

                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">

                        <button onClick={() => handleEdit(pass)} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-4 transition-colors duration-200">

                          <i className="fas fa-edit mr-1"></i> Modifier

                        </button>

                        <button onClick={() => handleDelete(pass.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200">

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



export default PassTypesManager;


