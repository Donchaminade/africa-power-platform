
import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import { AuthUser } from '../Dashboard';

const API_URL = 'http://localhost:4000/api';

interface ProgramItem {
    id: number;
    day: number;
    start_time: string;
    end_time: string;
    title_fr: string;
    title_en: string;
    description_fr?: string;
    description_en?: string;
    icon_class?: string;
}

interface ProgramManagerProps {
  authUser: AuthUser | null;
}

const ProgramManager: React.FC<ProgramManagerProps> = ({ authUser }) => {
    const [programItems, setProgramItems] = useState<ProgramItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<ProgramItem | null>(null);

    const fetchProgramItems = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/program`);
            if (!response.ok) {
                throw new Error('Failed to fetch program items');
            }
            const data = await response.json();
            setProgramItems(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProgramItems();
    }, []);

    const openModal = (item: ProgramItem | null = null) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
    };

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const itemData = Object.fromEntries(formData.entries());

        const url = editingItem
            ? `${API_URL}/program/${editingItem.id}`
            : `${API_URL}/program`;
        
        const method = editingItem ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...itemData, day: Number(itemData.day) }),
            });

            if (!response.ok) {
                throw new Error('Failed to save program item');
            }
            
            await fetchProgramItems();
            closeModal();
        } catch (err) {
            alert('Error saving item: ' + (err instanceof Error ? err.message : 'Unknown error'));
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure?')) {
            try {
                const response = await fetch(`${API_URL}/program/${id}`, { method: 'DELETE' });
                if (!response.ok) {
                    throw new Error('Failed to delete item');
                }
                setProgramItems(programItems.filter(p => p.id !== id));
            } catch (err) {
                alert('Error deleting item: ' + (err instanceof Error ? err.message : 'Unknown error'));
            }
        }
    };

    const renderContent = () => {
        if (isLoading) return <div className="text-center p-8">Loading program...</div>;
        if (error) return <div className="text-center p-8 text-red-500">Error: {error}</div>;
        if (programItems.length === 0) return <div className="text-center p-8">No program items found.</div>;

        return (
             <table className="w-full text-left">
                <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="p-4">Day</th>
                        <th className="p-4">Time</th>
                        <th className="p-4">Title (FR)</th>
                        <th className="p-4">Title (EN)</th>
                        <th className="p-4">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {programItems.sort((a,b) => a.day - b.day || a.start_time.localeCompare(b.start_time)).map(item => (
                        <tr key={item.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                            <td className="p-4">{item.day}</td>
                            <td className="p-4">{item.start_time.substring(0,5)} - {item.end_time.substring(0,5)}</td>
                            <td className="p-4 font-semibold">{item.title_fr}</td>
                            <td className="p-4">{item.title_en}</td>
                            <td className="p-4 flex gap-4">
                                <button onClick={() => openModal(item)} className="text-gray-500 hover:text-blue-700" title="View Details"><i className="fas fa-eye"></i></button>
                                <button onClick={() => openModal(item)} className="text-blue-500 hover:text-blue-700" title="Edit"><i className="fas fa-edit"></i></button>
                                <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700" title="Delete"><i className="fas fa-trash"></i></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Manage Program</h2>
                <button onClick={() => openModal()} className="bg-green-600 text-white px-5 py-2 rounded-md font-semibold hover:bg-green-700 transition">
                    <i className="fas fa-plus mr-2"></i> Add Program Item
                </button>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md overflow-x-auto">
                {renderContent()}
            </div>
            <Modal isOpen={isModalOpen} onClose={closeModal} title={editingItem ? 'Edit Item' : 'Add Item'}>
                 <form onSubmit={handleSave} className="space-y-4">
                    <div><label className="block text-sm font-medium mb-1">Day</label><input type="number" name="day" defaultValue={editingItem?.day} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" required/></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-sm font-medium mb-1">Start Time</label><input type="time" name="start_time" defaultValue={editingItem?.start_time} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" required/></div>
                        <div><label className="block text-sm font-medium mb-1">End Time</label><input type="time" name="end_time" defaultValue={editingItem?.end_time} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" required/></div>
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-sm font-medium mb-1">Title (FR)</label><input name="title_fr" defaultValue={editingItem?.title_fr} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" required/></div>
                        <div><label className="block text-sm font-medium mb-1">Title (EN)</label><input name="title_en" defaultValue={editingItem?.title_en} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" required/></div>
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-sm font-medium mb-1">Description (FR)</label><textarea name="description_fr" defaultValue={editingItem?.description_fr} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"></textarea></div>
                        <div><label className="block text-sm font-medium mb-1">Description (EN)</label><textarea name="description_en" defaultValue={editingItem?.description_en} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"></textarea></div>
                    </div>
                    <div><label className="block text-sm font-medium mb-1">Icon Class (e.g. fas fa-bullhorn)</label><input name="icon_class" defaultValue={editingItem?.icon_class} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"/></div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={closeModal} className="px-5 py-2 rounded-md bg-gray-200 dark:bg-gray-600">Cancel</button>
                        <button type="submit" className="px-5 py-2 rounded-md bg-green-600 text-white">Save</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default ProgramManager;
