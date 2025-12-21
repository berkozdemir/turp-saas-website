import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./i18n.ts";
import { HelmetProvider } from "react-helmet-async";
import { NotificationProvider } from "./components/NotificationProvider";
import { ConfirmProvider } from "./components/ConfirmProvider";

// Basit ErrorBoundary
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: any }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("Kritik Hata:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
          <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-red-100 text-center">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              ⚠️
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Uygulama Hatası
            </h2>
            <p className="text-slate-500 mb-6">
              Beklenmedik bir sorun oluştu.
            </p>
            <div className="bg-slate-100 p-3 rounded text-left text-xs font-mono text-red-600 overflow-auto max-h-32 mb-6">
              {this.state.error?.message || "Bilinmeyen Hata"}
            </div>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800"
            >
              Yenile
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found!");
}

import IWRSApp from "./iwrs/IWRSApp";
import { initTurpI18n } from "./i18n";
import { initIwrsI18n } from "./iwrs/i18n/config";

// --- TENANT DETERMINATION LOGIC ---
const hostname = window.location.hostname;
const searchParams = new URLSearchParams(window.location.search);
const appParam = searchParams.get('app');

// 1. Update Persistence
if (appParam === 'iwrs') {
  localStorage.setItem('turp_app_mode', 'iwrs');
} else if (appParam === 'turp') {
  localStorage.setItem('turp_app_mode', 'turp');
}

// 2. Read state
const savedMode = localStorage.getItem('turp_app_mode');
const isIwrsDomain = hostname === 'iwrs.com.tr' || hostname === 'iwrs.localhost' || hostname.includes('iwrs.');
const isIwrs = isIwrsDomain || appParam === 'iwrs' || savedMode === 'iwrs';

// 3. Initialize correct i18n
if (isIwrs) {
  document.title = "Omega IWRS";
  initIwrsI18n();
} else {
  initTurpI18n();
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      {isIwrs ? (
        <IWRSApp />
      ) : (
        <HelmetProvider>
          <NotificationProvider>
            <ConfirmProvider>
              <App />
            </ConfirmProvider>
          </NotificationProvider>
        </HelmetProvider>
      )}
    </ErrorBoundary>
  </React.StrictMode>
);
