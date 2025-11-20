// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { createClient } from '@supabase/supabase-js';
import { Activity, Upload, Image as ImageIcon, Loader2, Calendar, ArrowRight, ShieldCheck, Globe } from 'lucide-react';

// --- SUPABASE AYARLARI ---
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseKey) {
  console.error("Ortam Değişkenleri Tanımlı Değil! Lütfen Vercel'e ekleyin.");
}
const supabase = createClient(supabaseUrl, supabaseKey);

// --- ANA SAYFA ---
const Home = ({ setView }) => {
  const { t } = useTranslation();
  const features = [
    { icon: ShieldCheck, title: t("feat_1_title"), desc: t("feat_1_desc") },
    { icon: Activity, title: t("feat_2_title"), desc: t("feat_2_desc") },
    { icon: Upload, title: t("feat_3_title"), desc: t("feat_3_desc") },
    { icon: Calendar, title: t("feat_4_title"), desc: t("feat_4_desc") },
    { icon: ImageIcon, title: t("feat_5_title"), desc: t("feat_5_desc") },
    { icon: Loader2, title: t("feat_6_title"), desc: t("feat_6_desc") }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 overflow-hidden">
      
      {/* HERO SECTION - GÜNCELLENDİ: SİYAH/BEYAZ KONTRAST */}
      <section className="relative pt-32 pb-40 px-6 flex items-center justify-center min-h-[70vh]">
        <div className="absolute inset-0 z-0 bg-slate-900 overflow-hidden">
          <img src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070&auto=format&fit=crop" alt="Medical Research" className="w-full h-full object-cover opacity-5 blur-sm" /> 
          <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-slate-50/70 to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur border border-green-300 text-green-700 px-4 py-1.5 rounded-full text-sm font-bold mb-8 shadow-lg">
            <ShieldCheck size={16} className='text-green-600'/>
            <span>USBS Onaylı & e-Nabız Entegreli</span>
          </div>
          
          <h1 className="font-heading text-6xl md:text-8xl font-extrabold text-slate-900 mb-6 leading-tight drop-shadow-md">
            {t("hero_title_part1")} <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-black">
              {t("hero_title_part2")}
            </span>
          </h1>
          
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-16 leading-relaxed font-sans">
            {t("hero_subtitle")}
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {/* Orijinal SİYAH CTA Butonu */}
            <button onClick={() => setView('blog')} className="flex items-center justify-center gap-2 px-10 py-4 bg-black text-white font-bold rounded-xl shadow-2xl shadow-slate-400/50 hover:bg-slate-800 transition-all transform hover:scale-[1.01]">
              {t("btn_blog_posts")} <ArrowRight size={18} />
            </button>
            <button className="flex items-center justify-center gap-2 px-10 py-4 bg-white text-slate-800 border border-slate-300 font-bold rounded-xl shadow-lg hover:bg-slate-100 transition-all">
              {t("btn_demo")}
            </button>
          </div>
        </div>
      </section>

      {/* PARTNERLER */}
      <section className="py-12 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8">{t("partner_title")}</p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            <h3 className="text-2xl font-heading font-bold text-slate-800">PharmaCo</h3>
            <h3 className="text-2xl font-heading font-bold text-slate-800">BioTech</h3>
            <h3 className="text-2xl font-heading font-bold text-slate-800">MED-DATA</h3>
          </div>
        </div>
      </section>

      {/* ÖZELLİKLER */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-heading text-4xl font-bold text-slate-900 mb-4">{t("section_title")}</h2>
          <p className="text-lg text-slate-600 font-sans">{t("section_subtitle")}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((item, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xl hover:shadow-2xl hover:border-indigo-400 transition-all duration-300 group">
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-slate-800 mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors shadow-inner">
                  {React.createElement(item.icon, { size: 24 })}
                </div>
                <h3 className="font-heading text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600 text-sm font-sans">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

// --- BLOG, ADMIN ve APP KISIMLARI DEĞİŞMEDEN DEVAM EDER ---
const Blog = () => { /* ... (önceki kod) ... */ };
const Admin = () => { /* ... (önceki kod) ... */ };
// (Blog ve Admin bileşenleri, uzunluktan dolayı burada tekrarlanmamıştır, ancak App.tsx dosyanızda önceki halini korumalıdır.)

export default function App() {
  const [view, setView] = useState('home');
  const { t, i18n } = useTranslation(); 
  const languages = [{ code: 'tr', label: 'TR' }, { code: 'en', label: 'EN' }, { code: 'zh', label: 'ZH' }];

  const changeLanguage = (lng) => { i18n.changeLanguage(lng); };

  return (
    <div className="font-sans text-slate-900 bg-slate-50 min-h-screen flex flex-col">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-heading font-bold text-2xl flex items-center gap-2 cursor-pointer" onClick={()=>setView('home')}>
            <div className="w-9 h-9 bg-black rounded-xl flex items-center justify-center text-white shadow-lg"><Activity size={20}/></div>
            Turp
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-1 bg-slate-100 p-1 rounded-full">
              <button onClick={()=>setView('home')} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${view === 'home' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}>{t("nav_home")}</button>
              <button onClick={()=>setView('blog')} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${view === 'blog' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}>{t("nav_blog")}</button>
              <button onClick={()=>setView('admin')} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${view === 'admin' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}>{t("nav_admin")}</button>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-full">
              <Globe size={18} className="text-slate-400 ml-2" />
              {languages.map((lang) => (<button key={lang.code} onClick={() => changeLanguage(lang.code)} className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${i18n.language === lang.code ? 'bg-black text-white shadow-md' : 'text-slate-500 hover:text-slate-900 hover:bg-white'}`}>{lang.label}</button>))}
            </div>
          </div>
        </div>
      </nav>
      <main className="flex-1">
        {view === 'home' && <Home setView={setView} />}
        {view === 'blog' && <Blog />}
        {view === 'admin' && <Admin />}
      </main>
      <footer className="py-8 text-center text-sm text-slate-400 bg-white border-t border-slate-100">
        &copy; 2025 Turp Sağlık Teknolojileri.
      </footer>
    </div>
  );
}
// Blog ve Admin bileşenlerinin tam kodları, App.tsx dosyanızda yukarıdaki gibi React.createElement importlarını içererek App fonksiyonunun altına eklenmiş olmalıdır.
