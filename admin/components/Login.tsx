
import React, { useState } from 'react';

import { API_URL } from '../../utils/config';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Authentication failed');
            }

            sessionStorage.setItem('authUser', JSON.stringify({ name: data.name, role: data.role }));
            window.location.href = '/admin/dashboard.html';

        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const leftPanelStyle = {
        backgroundImage: `linear-gradient(to top, rgba(0, 100, 50, 0.8), rgba(0, 0, 0, 0.8)), url(https://picsum.photos/seed/loginpage/1200/900)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-800 p-4">
            <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 bg-white dark:bg-gray-900 shadow-2xl rounded-2xl overflow-hidden">
                {/* Left Panel */}
                <div style={leftPanelStyle} className="hidden md:flex flex-col items-center justify-center p-12 text-white text-center">
                    <img src="/assets/images/logo.png" alt="Logo" className="h-50 w-auto mb-6" />
                    <h1 className="text-3xl font-bold leading-tight mb-2">Africa Power Platform</h1>
                    <p className="text-lg text-gray-300">
                        Connecter, former et inspirer les leaders de la tech en Afrique.
                    </p>
                </div>

                {/* Right Panel - Form */}
                <div className="flex flex-col justify-center p-8 sm:p-12">
                    <div className="w-full">
                        <div className="md:hidden text-center mb-8">
                            <img src="/assets/images/logo.png" alt="Logo" className="h-20 w-auto mx-auto" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Admin Panel
                        </h2>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Veuillez vous connecter à votre compte.
                        </p>
                
                        <form onSubmit={handleSubmit} className="space-y-6 mt-8">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="mt-1 block w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                                    placeholder="admin@app.com"
                                />
                            </div>
                            <div className="relative">
                                <label htmlFor="password"className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="mt-1 block w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                                    placeholder="password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center text-sm leading-5"
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-gray-400`}></i>
                                </button>
                            </div>
                            {error && <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>}
                            <div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400"
                                >
                                    {isLoading ? 'Connexion...' : 'Se connecter'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
