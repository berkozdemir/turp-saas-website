import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NIPTPortal } from "./pages/NIPTPortal";
import { BookingForm } from "./pages/BookingForm";
import { MomGuardIntro } from "./pages/MomGuardIntro";
import { VerifiIntro } from "./pages/VerifiIntro";
import { TestsList } from "./pages/TestsList";
import { About } from "./pages/About";
import { VeritasIntro } from "./pages/VeritasIntro";
import { PodcastHub } from "../pages/PodcastHub";
import { PodcastDetail } from "../pages/PodcastDetail";
import { Contact } from "../pages/Contact";
import ScrollToTop from "../iwrs/components/ScrollToTop";

// Create a client
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
});

const ContactWithNav = () => {
    const navigate = useNavigate();
    return <Contact setView={(view: any) => { if (view === 'home') navigate('/'); }} />;
};

import { PodcastPlayerProvider } from "../context/PodcastPlayerContext";
import { GlobalPodcastPlayer } from "../components/GlobalPodcastPlayer";

const NIPTApp: React.FC = () => {
    // Force refresh check
    // If running on subpath /nipt, we need to set basename
    // If running on nipt.tr, basename is /
    const isNiptPath = window.location.pathname.startsWith('/nipt');
    const basename = isNiptPath ? '/nipt' : '/';

    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter basename={basename}>
                <PodcastPlayerProvider>
                    <ScrollToTop />
                    <Routes>
                        {/* Unified Home */}
                        <Route path="/" element={<NIPTPortal />} />

                        {/* Unified Booking */}
                        <Route path="/booking" element={<BookingForm />} />

                        {/* Unified Test Details - Redirect old paths if needed, or just new structure */}
                        <Route path="/testler" element={<TestsList />} />
                        <Route path="/testler/momguard" element={<MomGuardIntro />} />
                        <Route path="/testler/verifi" element={<VerifiIntro />} />
                        <Route path="/testler/veritas" element={<VeritasIntro />} />

                        {/* Legacy/Direct Brand Access redirects to new structure or keeps working */}
                        <Route path="momguard" element={<Navigate to="/testler/momguard" replace />} />
                        <Route path="verifi" element={<Navigate to="/testler/verifi" replace />} />
                        <Route path="veritas" element={<Navigate to="/testler/veritas" replace />} />

                        <Route path="about" element={<About />} />
                        <Route path="hakkimizda" element={<About />} />
                        <Route path="hakkimizda" element={<About />} />
                        <Route path="iletisim" element={<ContactWithNav />} />

                        <Route path="podcast" element={<PodcastHub />} />
                        <Route path="podcast/:slug" element={<PodcastDetail />} />

                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                    <GlobalPodcastPlayer />
                </PodcastPlayerProvider>
            </BrowserRouter>
        </QueryClientProvider>
    );
};

export default NIPTApp;
