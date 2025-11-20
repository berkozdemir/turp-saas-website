import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './i18n.ts' // Dil dosyasını yükle

// --- 1. HATA YAKALAYICI (ERROR BOUNDARY) ---
// Bu bileşen, altındaki herhangi bir bileşen patlarsa devreye girer.
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: any }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("Uygulama Hatası:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // HATA DURUMUNDA GÖSTERİLECEK EKRAN
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-900 p-6">
          <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-slate-200 text-center">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">Bir şeyler ters gitti</h2>
            <p className="text-slate-500 mb-6">Beklenmedik bir hata oluştu. Sayfayı yenilemeyi deneyin.</p>
            <div className="bg-slate-100 p-4 rounded-lg text-left mb-6 overflow-auto max-h-32">
                <code className="text-xs text-slate-600 font-mono">{this.state.error?.message || "Bilinmeyen Hata"}</code>
            </div>
            <button 
              onClick={() => window.location.reload()} 
              className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-700 transition-colors"
            >
              Sayfayı Yenile
            </button>
          </div>
        </div>
      );
    }

    return this.props.children; 
  }
}

// --- 2. YÜKLENİYOR EKRANI (SUSPENSE FALLBACK) ---
const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin"></div>
      <div className="text-slate-400 font-medium text-sm">Turp Yükleniyor...</div>
    </div>
  </div>
);

// --- 3. UYGULAMAYI BAŞLAT ---
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <React.Suspense fallback={<LoadingScreen />}>
        <App />
      </React.Suspense>
    </ErrorBoundary>
  </React.StrictMode>,
)
