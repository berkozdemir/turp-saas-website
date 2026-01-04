import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NIPTPortal } from "./pages/NIPTPortal";
import { BookingForm } from "./pages/BookingForm";
import { MomGuardIntro } from "./pages/MomGuardIntro";
import { VerifiIntro } from "./pages/VerifiIntro";
import { TestsList } from "./pages/TestsList";
import { About } from "./pages/About";
import { VeritasIntro } from "./pages/VeritasIntro";
import { NIPTContact } from "./pages/NIPTContact";
import { NIPTPodcastHub } from "./pages/NIPTPodcastHub";
import { NIPTPodcastDetail } from "./pages/NIPTPodcastDetail";
import ScrollToTop from "../iwrs/components/ScrollToTop";
import { PodcastPlayerProvider } from "../context/PodcastPlayerContext";
import { GlobalPodcastPlayer } from "../components/GlobalPodcastPlayer";

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
    const isNiptPath = window.location.pathname.startsWith('/nipt');
    const basename = isNiptPath ? '/nipt' : '/';

    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter basename={basename}>
                <PodcastPlayerProvider>
                    <ScrollToTop />
                    <Routes>
                        {/* Home */}
                        <Route path="/" element={<NIPTPortal />} />

                        {/* Booking */}
                        <Route path="/booking" element={<BookingForm />} />

                        {/* Tests */}
                        <Route path="/testler" element={<TestsList />} />
                        <Route path="/testler/momguard" element={<MomGuardIntro />} />
                        <Route path="/testler/verifi" element={<VerifiIntro />} />
                        <Route path="/testler/veritas" element={<VeritasIntro />} />

                        {/* Legacy redirects */}
                        <Route path="/momguard" element={<Navigate to="/testler/momguard" replace />} />
                        <Route path="/verifi" element={<Navigate to="/testler/verifi" replace />} />
                        <Route path="/veritas" element={<Navigate to="/testler/veritas" replace />} />

                        {/* About */}
                        <Route path="/about" element={<About />} />
                        <Route path="/hakkimizda" element={<About />} />

                        {/* Contact - NIPT specific */}
                        <Route path="/iletisim" element={<NIPTContact />} />

                        {/* Podcast - NIPT specific */}
                        <Route path="/podcast" element={<NIPTPodcastHub />} />
                        <Route path="/podcast/:slug" element={<NIPTPodcastDetail />} />

                        {/* Catch all */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                    <GlobalPodcastPlayer />
                </PodcastPlayerProvider>
            </BrowserRouter>
        </QueryClientProvider>
    );
};

export default NIPTApp;

