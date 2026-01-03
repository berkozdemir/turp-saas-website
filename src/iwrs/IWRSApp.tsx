import { lazy, Suspense } from "react";
import { Toaster } from "@/iwrs/components/ui/toaster";
import { Toaster as Sonner } from "@/iwrs/components/ui/sonner";
import { TooltipProvider } from "@/iwrs/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

import { CookieConsentBanner } from "@/components/CookieConsentBanner";

const queryClient = new QueryClient();

// Loading fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

const IWRSApp = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
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
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/iwrs" element={<IWRSMockup />} />
              <Route path="/admin" element={<Admin />} />
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
          </Suspense>
        </main>
        <CookieConsentBanner />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default IWRSApp;

