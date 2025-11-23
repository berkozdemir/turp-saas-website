import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './i18n.ts' 
import { HelmetProvider } from 'react-helmet-async';


// --- 1. HATA YAKALAYICI (KOD HATALARI İÇİN) ---
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: any }> {
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
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Uygulama Hatası</h2>
            <p className="text-slate-500 mb-6">Beklenmedik bir sorun oluştu.</p>
            <div className="bg-slate-100 p-3 rounded text-left text-xs font-mono text-red-600 overflow-auto max-h-32 mb-6">
                {this.state.error?.message || "Bilinmeyen Hata"}
            </div>
            <button onClick={() => window.location.reload()} className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800">Yenile</button>
          </div>
        </div>
      );
    }
    return this.props.children; 
  }
}

// --- 2. YÜKLENİYOR EKRANI ---
const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-slate-200 border-t-rose-600 rounded-full animate-spin"></div>
      <div className="text-slate-400 font-medium text-sm tracking-wide">SİSTEM YÜKLENİYOR...</div>
    </div>
  </div>
);

// --- 3. SUPABASE BAĞLANTISINI KONTROL ET ---
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const rootElement = document.getElementById('root');

if (!rootElement) throw new Error("Root elementi bulunamadı!");

// EĞER ANAHTARLAR YOKSA: HATA EKRANI BAS (App.tsx hiç çalışmaz)
if (!supabaseUrl || !supabaseKey) {
  ReactDOM.createRoot(rootElement).render(
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-6">
      <div className="max-w-lg w-full bg-white p-10 rounded-3xl shadow-2xl text-center">
        <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" x2="12" y1="2" y2="12"/></svg>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Veritabanı Bağlantı Hatası</h1>
        <p className="text-slate-500 text-lg mb-8 leading-relaxed">
          Supabase bağlantı anahtarları bulunamadı veya hatalı.
          Lütfen Vercel panelindeki <strong>Environment Variables</strong> ayarlarını kontrol edin.
        </p>
        <div className="bg-slate-100 p-4 rounded-xl text-left text-sm font-mono text-slate-600 border border-slate-200">
            <p className="mb-2 font-bold">Eksik Değişkenler:</p>
            <ul className="list-disc list-inside space-y-1">
                {!supabaseUrl && <li className="text-red-600">VITE_SUPABASE_URL</li>}
                {!supabaseKey && <li className="text-red-600">VITE_SUPABASE_ANON_KEY</li>}
            </ul>
        </div>
      </div>
    </div>
  );
} else {
  // HER ŞEY YOLUNDAYSA: UYGULAMAYI BAŞLAT
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ErrorBoundary>
        <React.Suspense fallback={<LoadingScreen />}>
          <App />
        </React.Suspense>
      </ErrorBoundary>
    </React.StrictMode>,
  );
}
