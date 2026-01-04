import { lazy, Suspense, useEffect } from "react";
import { Toaster } from "@/iwrs/components/ui/toaster";
import { Toaster as Sonner } from "@/iwrs/components/ui/sonner";
import { TooltipProvider } from "@/iwrs/components/ui/tooltip";
/**
 * Page: IWRS App Root
 * Route: / (iwrs.com.tr)
 * Tenant: IWRS
 * Description:
 *   - Main entry point for the IWRS tenant application.
 *   - Handles routing, layout, and global providers for IWRS.
 * Related:
 *   - Context: AuthContext, TenantContext
 */
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import ScrollToTop from "@/iwrs/components/ScrollToTop";

// Critical path - load immediately
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Lazy loaded pages
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const PersonalDataNotice = lazy(() => import("./pages/PersonalDataNotice"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const SecurityPolicy = lazy(() => import("./pages/SecurityPolicy"));
const IWRSMockup = lazy(() => import("./pages/IWRSMockup"));
const Admin = lazy(() => import("@/pages/Admin").then(m => ({ default: m.Admin })));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const RandomizationForm = lazy(() => import("./pages/RandomizationForm"));
const InventorySystem = lazy(() => import("./pages/InventorySystem"));
const DataSecurity = lazy(() => import("./pages/DataSecurity"));
const FAQ = lazy(() => import("./pages/FAQ"));
const References = lazy(() => import("./pages/References"));
const AdverseEventsCall = lazy(() => import("./pages/AdverseEventsCall"));
const MedicationReminder = lazy(() => import("./pages/MedicationReminder"));
const AppointmentReminder = lazy(() => import("./pages/AppointmentReminder"));
const PatientSurvey = lazy(() => import("./pages/PatientSurvey"));
const EmergencyUnblinding = lazy(() => import("./pages/EmergencyUnblinding"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const EndUserLogin = lazy(() => import("../pages/EndUserLogin").then(m => ({ default: m.EndUserLogin })));
const EndUserSignup = lazy(() => import("../pages/EndUserSignup").then(m => ({ default: m.EndUserSignup })));

import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { ChatInterface } from "@/components/chatbot/ChatInterface";
import { CookieConsentBanner } from "@/components/CookieConsentBanner";
import { TenantSettingsProvider } from "../hooks/useTenantSettings";
import { EndUserAuthProvider, useEndUserAuth } from "../hooks/useEndUserAuth";
import { fetchTenants } from "../hooks/useTenants";

const queryClient = new QueryClient();

// Loading fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

const IWRSApp = () => {
  // Preload tenant mapping on app init
  useEffect(() => {
    fetchTenants().catch(err => console.error('Failed to preload tenants:', err));
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <TenantSettingsProvider>
          <EndUserAuthProvider>
            <BrowserRouter>
              {/* Skip to main content link for keyboard navigation */}
              <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg focus:shadow-lg"
              >
                Ana içeriğe atla
              </a>
              <ScrollToTop />
              <main id="main-content" role="main">
                <Suspense fallback={<PageLoader />}>
                  <RoutesWrapper />
                </Suspense>
              </main>
              <CookieConsentBanner />
            </BrowserRouter>
          </EndUserAuthProvider>
        </TenantSettingsProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

const RoutesWrapper = () => {
  // We need a hook to use navigate, so we extract Routes to a component inside BrowserRouter
  const navigate = useNavigate();

  const { isAuthenticated, user } = useEndUserAuth();
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleAuthNav = (view: string | any) => {
    if (view === 'home') navigate('/');
    else if (view === 'enduser-login' || view === 'login') navigate('/login');
    else if (view === 'enduser-signup' || view === 'signup') navigate('/signup');
    else if (typeof view === 'string') navigate('/' + view);
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/iwrs" element={<IWRSMockup />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<EndUserLogin setView={handleAuthNav} />} />
        <Route path="/signup" element={<EndUserSignup setView={handleAuthNav} />} />
        <Route path="/auth" element={<EndUserLogin setView={handleAuthNav} />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/randomization" element={<RandomizationForm />} />
        <Route path="/inventory-system" element={<InventorySystem />} />
        <Route path="/data-security" element={<DataSecurity />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/references" element={<References />} />
        <Route path="/adverse-events-call" element={<AdverseEventsCall />} />
        <Route path="/medication-reminder" element={<MedicationReminder />} />
        <Route path="/appointment-reminder" element={<AppointmentReminder />} />
        <Route path="/patient-survey" element={<PatientSurvey />} />
        <Route path="/emergency-unblinding" element={<EmergencyUnblinding />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/personal-data-notice" element={<PersonalDataNotice />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/security-policy" element={<SecurityPolicy />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* FLOATING AI CHAT for Authenticated Users */}
      {isAuthenticated && (
        <>
          {/* Floating Toggle Button */}
          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-tr from-blue-600 to-purple-600 text-white rounded-full shadow-2xl hover:scale-105 hover:shadow-blue-500/30 transition-all duration-300 group"
            title="Çalışmanız için AI Randomizasyon Asistanı'nı açmak için tıklayın."
          >
            {isChatOpen ? (
              <X size={28} />
            ) : (
              <MessageCircle size={28} className="group-hover:animate-pulse" />
            )}
            {/* Tooltip on hover */}
            <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
              AI Randomizasyon Asistanı
            </div>
          </button>

          {/* Chat Panel */}
          {isChatOpen && (
            <div className="fixed bottom-24 right-6 w-[380px] max-w-[calc(100vw-48px)] z-40 animate-in slide-in-from-bottom-10 fade-in duration-300 shadow-2xl rounded-xl border border-white/20">
              <ChatInterface
                sessionId={`session-${user?.id || 'guest'}`}
                userName={user?.name || 'Kullanıcı'}
                title="AI Randomizasyon Asistanı"
                suggestions={[
                  "Randomizasyon nasıl yapılır?",
                  "Stok takibi yapabilir miyim?",
                  "Gönüllü kaydı nasıl açılır?",
                  "IWRS destek hattı nedir?"
                ]}
              />
            </div>
          )}
        </>
      )}
    </>
  );
};

export default IWRSApp;

