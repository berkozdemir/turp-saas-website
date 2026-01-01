import React from "react"; // 🔹 React import eklendi
import { Toaster } from "@/iwrs/components/ui/toaster";
import { Toaster as Sonner } from "@/iwrs/components/ui/sonner";
import { TooltipProvider } from "@/iwrs/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "@/iwrs/components/ScrollToTop";

import Index from "./pages/Index";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import PersonalDataNotice from "./pages/PersonalDataNotice";
import TermsOfService from "./pages/TermsOfService";
import SecurityPolicy from "./pages/SecurityPolicy";
import IWRSMockup from "./pages/IWRSMockup";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";
import { Admin } from "@/pages/Admin";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import RandomizationForm from "./pages/RandomizationForm";
import InventorySystem from "./pages/InventorySystem";
import DataSecurity from "./pages/DataSecurity";
import FAQ from "./pages/FAQ";
import References from "./pages/References";
import AdverseEventsCall from "./pages/AdverseEventsCall";
import MedicationReminder from "./pages/MedicationReminder";
import AppointmentReminder from "./pages/AppointmentReminder";
import PatientSurvey from "./pages/PatientSurvey";
import EmergencyUnblinding from "./pages/EmergencyUnblinding";
import ContactPage from "./pages/ContactPage";
import { CookieConsentBanner } from "@/components/CookieConsentBanner";

const queryClient = new QueryClient();

const IWRSApp = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <ScrollToTop />
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
          <Route path="*" element={<NotFound />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
        <CookieConsentBanner />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default IWRSApp;
