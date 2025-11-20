import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css'; // Tailwind stillerini yükler
import './i18n.ts'; // Dil ayarlarını (TR, EN, ZH) yükler

// React uygulamasının başlangıç noktasını buluyoruz (index.html'deki <div id="root">)
const rootElement = document.getElementById('root');

if (!rootElement) {
  // Eğer root elementi bulunamazsa hata verir (Vercel'de bu olmaz ama iyi pratik)
  throw new Error("HTML dosyasında 'root' id'li element bulunamadı!");
}

// Uygulamayı DOM'a bağlıyoruz
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
