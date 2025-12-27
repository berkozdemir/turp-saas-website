import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NIPTPortal } from './pages/NIPTPortal';

// Create a client
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
});

const NIPTApp: React.FC = () => {
    // If running on subpath /nipt, we need to set basename
    // If running on nipt.tr, basename is /
    const isNiptPath = window.location.pathname.startsWith('/nipt');
    const basename = isNiptPath ? '/nipt' : '/';

    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter basename={basename}>
                <Routes>
                    <Route path="/" element={<NIPTPortal />} />
                    {/* Tenant Routes will go here */}
                    <Route path="/momguard/*" element={<div>MomGuard Page (Coming Soon)</div>} />
                    <Route path="/verifi/*" element={<div>Verifi Page (Coming Soon)</div>} />
                    <Route path="/veritas/*" element={<div>Veritas Page (Coming Soon)</div>} />

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    );
};

export default NIPTApp;
