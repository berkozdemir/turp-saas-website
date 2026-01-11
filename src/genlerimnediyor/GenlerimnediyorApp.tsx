import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';

import { GNDHeader } from './components/GNDHeader';
import { GNDFooter } from './components/GNDFooter';
import HomePage from './pages/HomePage';

// Lazy load pages for code splitting
const YasamGenetigi = React.lazy(() => import('./pages/YasamGenetigi'));
const IMSPlus = React.lazy(() => import('./pages/IMSPlus'));
const EnfantGuard = React.lazy(() => import('./pages/EnfantGuard'));
const Contact = React.lazy(() => import('./pages/Contact'));
const About = React.lazy(() => import('./pages/About'));

// Loading fallback
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-white">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
  </div>
);

// 404 Page
const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-slate-900 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">Sayfa bulunamadı</p>
      <a
        href="/"
        className="inline-block bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg font-semibold transition"
      >
        Ana Sayfaya Dön
      </a>
    </div>
  </div>
);

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export const GenlerimnediyorApp: React.FC = () => {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col bg-white">
            <GNDHeader />

            <main className="flex-grow">
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/yasam-genetigi" element={<YasamGenetigi />} />
                  <Route path="/yenidogan-tarama" element={<IMSPlus />} />
                  <Route path="/enfantguard-2-0" element={<EnfantGuard />} />
                  <Route path="/iletisim" element={<Contact />} />
                  <Route path="/hakkimizda" element={<About />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </main>

            <GNDFooter />
          </div>
        </BrowserRouter>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default GenlerimnediyorApp;
