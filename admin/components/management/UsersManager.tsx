
import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';

const API_URL = 'http://localhost:4000/api';

interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'manager';
    is_active: boolean;
}

const UsersManager: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    const fetchUsers = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/users`);
            if (!response.ok) throw new Error('Failed to fetch users');
            const data = await response.json();
            setUsers(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const openModal = (user: User | null = null) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
    };

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const userData = Object.fromEntries(formData.entries());
        
        const payload: any = {
            name: userData.name,
            email: userData.email,
            role: userData.role,
            is_active: userData.is_active === 'on' ? 1 : 0,
        };

        // Only include password if it's provided
        if (userData.password) {
            payload.password = userData.password;
        }

        const url = editingUser ? `${API_URL}/users/${editingUser.id}` : `${API_URL}/users`;
        const method = editingUser ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to save user');
            }
            
            await fetchUsers();
            closeModal();
        } catch (err) {
            alert('Error saving user: ' + (err instanceof Error ? err.message : 'Unknown error'));
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                const response = await fetch(`${API_URL}/users/${id}`, { method: 'DELETE' });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to delete user');
                }
                setUsers(users.filter(u => u.id !== id));
            } catch (err) {
                alert('Error deleting user: ' + (err instanceof Error ? err.message : 'Unknown error'));
            }
        }
    };
    
    const renderContent = () => {
        if (isLoading) return <div className="text-center p-8">Loading users...</div>;
        if (error) return <div className="text-center p-8 text-red-500">Error: {error}</div>;
        if (users.length === 0) return <div className="text-center p-8">No users found.</div>;
        
        return (
            <table className="w-full text-left">
                <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="p-4">Name</th>
                        <th className="p-4">Email</th>
                        <th className="p-4">Role</th>
                        <th className="p-4">Active</th>
                        <th className="p-4">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                            <td className="p-4 font-semibold">{user.name}</td>
                            <td className="p-4">{user.email}</td>
                            <td className="p-4">
                                <span className={`px-3 py-1 text-sm rounded-full capitalize ${user.role === 'admin' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'}`}>
                                    {user.role}
                                </span>
                            </td>
                            <td className="p-4">{user.is_active ? 'Yes' : 'No'}</td>
                            <td className="p-4 flex gap-4">
                                <button onClick={() => openModal(user)} className="text-gray-500 hover:text-blue-700" title="View Details"><i className="fas fa-eye"></i></button>
                                <button onClick={() => openModal(user)} className="text-blue-500 hover:text-blue-700" title="Edit"><i className="fas fa-edit"></i></button>
                                <button onClick={() => handleDelete(user.id)} className="text-red-500 hover:text-red-700" title="Delete"><i className="fas fa-trash"></i></button>
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
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Manage Users</h2>
                <button onClick={() => openModal()} className="bg-green-600 text-white px-5 py-2 rounded-md font-semibold hover:bg-green-700 transition">
                    <i className="fas fa-plus mr-2"></i> Add User
                </button>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md overflow-x-auto">
                {renderContent()}
            </div>

            <Modal isOpen={isModalOpen} onClose={closeModal} title={editingUser ? 'Edit User' : 'Add User'}>
                <form onSubmit={handleSave} className="space-y-4">
                    <div><label className="block text-sm font-medium mb-1">Name</label><input name="name" defaultValue={editingUser?.name} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" required /></div>
                     <div><label className="block text-sm font-medium mb-1">Email</label><input type="email" name="email" defaultValue={editingUser?.email} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" required /></div>
                     <div><label className="block text-sm font-medium mb-1">Password</label><input type="password" name="password" placeholder={editingUser ? 'Leave blank to keep current password' : ''} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" required={!editingUser} /></div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Role</label>
                        <select name="role" defaultValue={editingUser?.role || 'manager'} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" required>
                            <option value="manager">Manager</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                     <div className="flex items-center gap-2">
                        <input type="checkbox" name="is_active" defaultChecked={editingUser?.is_active ?? true} className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"/>
                        <label className="text-sm font-medium">Is Active</label>
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={closeModal} className="px-5 py-2 rounded-md bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500">Cancel</button>
                        <button type="submit" className="px-5 py-2 rounded-md bg-green-600 text-white hover:bg-green-700">Save</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default UsersManager;
