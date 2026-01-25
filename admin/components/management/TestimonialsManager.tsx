
import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import { AuthUser } from '../Dashboard';

const API_URL = 'http://localhost:4000/api';

interface Testimonial {
    id: number;
    author_name: string;
    author_title_fr: string;
    author_title_en: string;
    author_image_url?: string;
    quote_fr: string;
    quote_en: string;
    display_order: number;
    is_active: boolean;
}

interface TestimonialsManagerProps {
  authUser: AuthUser | null;
}

const TestimonialsManager: React.FC<TestimonialsManagerProps> = ({ authUser }) => {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Testimonial | null>(null);

    const canManage = authUser?.role === 'admin';

    const fetchTestimonials = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/testimonials`);
            if (!response.ok) throw new Error('Failed to fetch testimonials');
            const data = await response.json();
            setTestimonials(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const openModal = (item: Testimonial | null = null) => {
        if (!canManage) return;
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
    };

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!canManage) return;

        const formData = new FormData(e.currentTarget);
        const itemData = Object.fromEntries(formData.entries());

        const payload = {
            ...itemData,
            display_order: Number(itemData.display_order),
            is_active: itemData.is_active === 'on' ? 1 : 0,
        };

        const url = editingItem ? `${API_URL}/testimonials/${editingItem.id}` : `${API_URL}/testimonials`;
        const method = editingItem ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (!response.ok) throw new Error('Failed to save testimonial');
            await fetchTestimonials();
            closeModal();
        } catch (err) {
            alert('Error saving testimonial: ' + (err instanceof Error ? err.message : 'Unknown error'));
        }
    };

    const handleDelete = async (id: number) => {
        if (!canManage) return;
        if (window.confirm('Are you sure?')) {
            try {
                const response = await fetch(`${API_URL}/testimonials/${id}`, { method: 'DELETE' });
                if (!response.ok) throw new Error('Failed to delete testimonial');
                setTestimonials(testimonials.filter(t => t.id !== id));
            } catch (err) {
                alert('Error deleting testimonial: ' + (err instanceof Error ? err.message : 'Unknown error'));
            }
        }
    };

    const renderContent = () => {
        if (isLoading) return <div className="text-center p-8">Loading testimonials...</div>;
        if (error) return <div className="text-center p-8 text-red-500">Error: {error}</div>;
        if (testimonials.length === 0) return <div className="text-center p-8">No testimonials found.</div>;

        return (
            <table className="w-full text-left">
                <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="p-4">Author</th>
                        <th className="p-4">Title (FR)</th>
                        <th className="p-4">Quote (FR)</th>
                        {canManage && <th className="p-4">Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {testimonials.map(item => (
                        <tr key={item.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                            <td className="p-4 font-semibold">{item.author_name}</td>
                            <td className="p-4">{item.author_title_fr}</td>
                            <td className="p-4 italic">"{item.quote_fr.substring(0, 50)}..."</td>
                            {canManage && (
                                <td className="p-4 flex gap-4">
                                    <button onClick={() => openModal(item)} className="text-gray-500 hover:text-blue-700" title="View Details"><i className="fas fa-eye"></i></button>
                                    <button onClick={() => openModal(item)} className="text-blue-500 hover:text-blue-700" title="Edit"><i className="fas fa-edit"></i></button>
                                    <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700" title="Delete"><i className="fas fa-trash"></i></button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Manage Testimonials</h2>
                {canManage && (
                    <button onClick={() => openModal()} className="bg-green-600 text-white px-5 py-2 rounded-md font-semibold hover:bg-green-700 transition">
                        <i className="fas fa-plus mr-2"></i> Add Testimonial
                    </button>
                )}
            </div>
             <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md overflow-x-auto">
                {renderContent()}
            </div>
            {canManage && (
                 <Modal isOpen={isModalOpen} onClose={closeModal} title={editingItem ? 'Edit Testimonial' : 'Add Testimonial'}>
                    <form onSubmit={handleSave} className="space-y-4">
                        <div><label>Author Name</label><input name="author_name" defaultValue={editingItem?.author_name} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" required/></div>
                        <div className="grid grid-cols-2 gap-4">
                           <div><label>Author Title (FR)</label><input name="author_title_fr" defaultValue={editingItem?.author_title_fr} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" required/></div>
                           <div><label>Author Title (EN)</label><input name="author_title_en" defaultValue={editingItem?.author_title_en} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" required/></div>
                        </div>
                        <div><label>Author Image URL</label><input name="author_image_url" defaultValue={editingItem?.author_image_url} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" /></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div><label>Quote (FR)</label><textarea name="quote_fr" defaultValue={editingItem?.quote_fr} rows={4} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" required/></div>
                            <div><label>Quote (EN)</label><textarea name="quote_en" defaultValue={editingItem?.quote_en} rows={4} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" required/></div>
                        </div>
                        <div><label className="block text-sm font-medium mb-1">Display Order</label><input type="number" name="display_order" defaultValue={editingItem?.display_order ?? 0} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" /></div>
                        <div className="flex items-center gap-2">
                            <input type="checkbox" name="is_active" defaultChecked={editingItem?.is_active ?? true} className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"/>
                            <label className="text-sm font-medium">Is Active</label>
                        </div>
                        <div className="flex justify-end gap-4 pt-4">
                            <button type="button" onClick={closeModal} className="px-5 py-2 rounded-md bg-gray-200 dark:bg-gray-600">Cancel</button>
                            <button type="submit" className="px-5 py-2 rounded-md bg-green-600 text-white">Save</button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
};

export default TestimonialsManager;
