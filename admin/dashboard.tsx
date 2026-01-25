
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import Dashboard from './components/Dashboard';

const AppGate: React.FC = () => {
    useEffect(() => {
        // This is a simple client-side check.
        // In a real app, you would validate a token with a backend.
        const authUser = sessionStorage.getItem('authUser');
        if (!authUser) {
            window.location.href = '/admin/index.html';
        }
    }, []);

    // Only render the dashboard if the user is "authenticated"
    if (!sessionStorage.getItem('authUser')) {
        return <div className="min-h-screen bg-gray-100 dark:bg-gray-900"></div>; // Render nothing or a loader while redirecting
    }

    return <Dashboard />;
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <AppGate />
  </React.StrictMode>
);
