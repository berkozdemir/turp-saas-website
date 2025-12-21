import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
// 1. Fonksiyonu import edin
import { detectAndSetLanguage } from './i18n/config'; 

// 2. Uygulama başlarken çalıştırın
detectAndSetLanguage(); 

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)