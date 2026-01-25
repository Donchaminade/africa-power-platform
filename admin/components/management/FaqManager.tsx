
import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import { AuthUser } from '../Dashboard';

const API_URL = 'http://localhost:4000/api';

interface Faq {
    id: number;
    question_fr: string;
    question_en: string;
    answer_fr: string;
    answer_en: string;
    category: string;
    display_order: number;
    is_active: boolean;
}

interface FaqManagerProps {
  authUser: AuthUser | null;
}

const FaqManager: React.FC<FaqManagerProps> = ({ authUser }) => {
    const [faqs, setFaqs] = useState<Faq[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingFaq, setEditingFaq] = useState<Faq | null>(null);

    const fetchFaqs = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/faq`);
            if (!response.ok) throw new Error('Failed to fetch FAQs');
            const data = await response.json();
            setFaqs(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchFaqs();
    }, []);

    const openModal = (faq: Faq | null = null) => {
        setEditingFaq(faq);
        setIsModalOpen(true);
    };
    
    const closeModal = () => {
        setIsModalOpen(false);
        setEditingFaq(null);
    };

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const faqData = Object.fromEntries(formData.entries());

        const payload = {
            ...faqData,
            display_order: Number(faqData.display_order),
            is_active: faqData.is_active === 'on' ? 1 : 0,
        };

        const url = editingFaq ? `${API_URL}/faq/${editingFaq.id}` : `${API_URL}/faq`;
        const method = editingFaq ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (!response.ok) throw new Error('Failed to save FAQ');
            await fetchFaqs();
            closeModal();
        } catch (err) {
            alert('Error saving FAQ: ' + (err instanceof Error ? err.message : 'Unknown error'));
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure?')) {
            try {
                const response = await fetch(`${API_URL}/faq/${id}`, { method: 'DELETE' });
                if (!response.ok) throw new Error('Failed to delete FAQ');
                setFaqs(faqs.filter(f => f.id !== id));
            } catch (err) {
                alert('Error deleting FAQ: ' + (err instanceof Error ? err.message : 'Unknown error'));
            }
        }
    };

    const renderContent = () => {
        if (isLoading) return <div className="text-center p-8">Loading FAQs...</div>;
        if (error) return <div className="text-center p-8 text-red-500">Error: {error}</div>;
        if (faqs.length === 0) return <div className="text-center p-8">No FAQs found.</div>;

        return (
            <table className="w-full text-left">
                <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="p-4">Question (FR)</th>
                        <th className="p-4">Question (EN)</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Active</th>
                        <th className="p-4">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {faqs.map(faq => (
                        <tr key={faq.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                            <td className="p-4 font-semibold">{faq.question_fr}</td>
                            <td className="p-4">{faq.question_en}</td>
                            <td className="p-4">{faq.category}</td>
                            <td className="p-4">{faq.is_active ? 'Yes' : 'No'}</td>
                            <td className="p-4 flex gap-4">
                                <button onClick={() => openModal(faq)} className="text-gray-500 hover:text-blue-700" title="View Details"><i className="fas fa-eye"></i></button>
                                <button onClick={() => openModal(faq)} className="text-blue-500 hover:text-blue-700" title="Edit"><i className="fas fa-edit"></i></button>
                                <button onClick={() => handleDelete(faq.id)} className="text-red-500 hover:text-red-700" title="Delete"><i className="fas fa-trash"></i></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Manage FAQ</h2>
                <button onClick={() => openModal()} className="bg-green-600 text-white px-5 py-2 rounded-md font-semibold hover:bg-green-700 transition">
                    <i className="fas fa-plus mr-2"></i> Add FAQ
                </button>
            </div>
             <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md overflow-x-auto">
                {renderContent()}
            </div>
            <Modal isOpen={isModalOpen} onClose={closeModal} title={editingFaq ? 'Edit FAQ' : 'Add FAQ'}>
                <form onSubmit={handleSave} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-sm font-medium mb-1">Question (FR)</label><textarea name="question_fr" defaultValue={editingFaq?.question_fr} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" required/></div>
                        <div><label className="block text-sm font-medium mb-1">Question (EN)</label><textarea name="question_en" defaultValue={editingFaq?.question_en} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" required/></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-sm font-medium mb-1">Answer (FR)</label><textarea name="answer_fr" defaultValue={editingFaq?.answer_fr} rows={4} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" required/></div>
                        <div><label className="block text-sm font-medium mb-1">Answer (EN)</label><textarea name="answer_en" defaultValue={editingFaq?.answer_en} rows={4} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" required/></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-sm font-medium mb-1">Category</label><input name="category" defaultValue={editingFaq?.category} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" /></div>
                        <div><label className="block text-sm font-medium mb-1">Display Order</label><input type="number" name="display_order" defaultValue={editingFaq?.display_order ?? 0} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" /></div>
                    </div>
                     <div className="flex items-center gap-2">
                        <input type="checkbox" name="is_active" defaultChecked={editingFaq?.is_active ?? true} className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"/>
                        <label className="text-sm font-medium">Is Active</label>
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={closeModal} className="px-5 py-2 rounded-md bg-gray-200 dark:bg-gray-600">Cancel</button>
                        <button type="submit" className="px-5 py-2 rounded-md bg-green-600 text-white">Save</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default FaqManager;
