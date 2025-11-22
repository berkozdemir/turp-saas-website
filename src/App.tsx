// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Activity, Globe, ChevronDown, Lock } from 'lucide-react';
import { supabase } from './lib/supabase';
import { MODULE_CONTENT, getModuleContentTranslated } from './data/content';
import { Footer } from './components/Footer';
import { detectLocationSettings } from './utils/geo'; // YENİ DEDEKTiFİMİZ

// SAYFALARI IMPORT ET
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Blog } from './pages/Blog';
import { PostDetail } from './pages/PostDetail';
import { ModuleDetail } from './pages/ModuleDetail';
import { Admin } from './pages/Admin';
import { Login } from './pages/Login';
import { ROICalculator } from './pages/ROICalculator';

export default function App() {
  const [view, setView] = useState('home');
  const [editingPost, setEditingPost] = useState(null);
  const [session, setSession] = useState(null);
  const [globalCurrency, setGlobalCurrency] = useState('USD'); // Varsayılan USD olsun, algılayınca değişecek
  
  const { t, i18n } = useTranslation(); 
  const languages = [{ code: 'tr', label: 'TR' }, { code: 'en', label: 'EN' }, { code: 'zh', label: 'ZH' }];
  const [isScrolled, setIsScrolled] = useState(false);
  const modules = getModuleContentTranslated(t);

  useEffect(() => {
    // 1. OTURUM KONTROLÜ
    supabase.auth.getSession().then(({ data: { session } }) => { setSession(session); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => { setSession(session); });
    
    // 2. SCROLL KONTROLÜ
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);

    // 3. OTOMATİK KONUM VE DİL ALGILAMA (YENİ KISIM)
    const initLocalization = async () => {
      const settings = await detectLocationSettings();
      
      // Dili değiştir (Eğer zaten o dilde değilse)
      if (i18n.language !== settings.lang) {
        i18n.changeLanguage(settings.lang);
      }
      // Para birimini ayarla (ROI Hesaplayıcı bunu kullanacak)
      setGlobalCurrency(settings.currency);
    };
    
    // Uygulama açılınca bir kere çalıştır
    initLocalization();

    return () => { window.removeEventListener('scroll', handleScroll); subscription.unsubscribe(); };
  }, []); 

  const handleLogout = async () => { await supabase.auth.signOut(); setView('home'); };
  const startEdit = (post) => { if (!session) { alert("Giriş yapmalısınız!"); setView('admin'); return; } setEditingPost(post); setView('admin'); };

  const renderView = () => {
    if (view === 'home') return <Home setView={setView} />;
    if (view === 'about') return <About setView={setView} />;
    if (view === 'blog') return <Blog setView={setView} />;
    
    // ROI HESAPLAYICIYA PARA BİRİMİNİ GÖNDERİYORUZ 👇
    if (view === 'roi') return <ROICalculator initialCurrency={globalCurrency} />;
    
    if (view === 'admin') return session ? <Admin editingPost={editingPost} setEditingPost={setEditingPost} setView={setView} handleLogout={handleLogout} /> : <Login />;
    if (typeof view === 'object' && view.type === 'module') return <ModuleDetail moduleId={view.id} setView={setView} />;
    if (typeof view === 'object' && view.type === 'detail') return <PostDetail post={view.post} setView={setView} onEdit={startEdit} />;
    return <Home setView={setView} />;
  };

  return (
    <div className="font-sans text-slate-900 bg-slate-50 min-h-screen flex flex-col selection:bg-rose-200 selection:text-rose-900">
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-md py-3' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="font-heading font-bold text-2xl flex items-center gap-2 cursor-pointer group" onClick={()=>setView('home')}>
            <div className="w-10 h-10 bg-rose-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-rose-600/30 group-hover:rotate-3 transition-transform"><Activity size={22}/></div>
            <span className="tracking-tight text-slate-900">Turp</span>
          </div>
          <div className="flex items-center gap-3 md:gap-6">
            <div className="flex items-center bg-white/80 backdrop-blur border border-slate-200 p-1.5 rounded-full shadow-sm">
              <button onClick={()=>setView('home')} className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${view === 'home' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}>{t("nav_home")}</button>
              
              <div className="relative group h-full flex items-center">
                 <button className="px-4 py-2 rounded-full text-sm font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-100 flex items-center gap-1">{t("nav_modules")} <ChevronDown size={14}/></button>
                 <div className="absolute top-full left-0 w-64 pt-4 hidden group-hover:block animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
                        {Object.entries(modules).map(([key, val]) => (
                            <button key={key} onClick={() => setView({ type: 'module', id: key })} className="block w-full text-left px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 hover:text-rose-600 border-b border-slate-50 last:border-0 transition-colors">
                                {val.title}
                            </button>
                        ))}
                    </div>
                 </div>
              </div>

              <button onClick={()=>setView('roi')} className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${view === 'roi' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}>ROI</button>
              <button onClick={()=>setView('blog')} className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${view === 'blog' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}>{t("nav_blog")}</button>
              <button onClick={()=>setView('about')} className={`hidden md:block px-4 py-2 rounded-full text-sm font-bold transition-all ${view === 'about' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}>Hakkımızda</button>
              
              <button onClick={()=>setView('admin')} className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${view === 'admin' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}>
                  {session ? <Lock size={14} className="text-green-400"/> : <Lock size={14}/>} {t("nav_admin")}
              </button>
            </div>
            <div className="flex items-center gap-1 bg-white/80 backdrop-blur border border-slate-200 p-1.5 rounded-full shadow-sm"><Globe size={16} className="text-slate-400 ml-2 hidden md:block" />{languages.map((lang) => (<button key={lang.code} onClick={() => i18n.changeLanguage(lang.code)} className={`w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center ${i18n.language === lang.code ? 'bg-rose-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-200'}`}>{lang.label}</button>))}</div>
          </div>
        </div>
      </nav>

      <main className="flex-1">{renderView()}</main>
      <Footer setView={setView} />
    </div>
  );
}
