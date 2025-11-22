// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { createClient } from '@supabase/supabase-js';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  Activity, Upload, Image as ImageIcon, Loader2, Calendar, ArrowRight, 
  ShieldCheck, Globe, Edit3, Lock, LogOut, Mail, Key, CheckCircle, 
  XCircle, Zap, Database, Smartphone, FileText, ChevronDown, ChevronUp, 
  MapPin, Phone, Linkedin, Twitter, Instagram, Send, ArrowLeft,
  Video, ClipboardList, Bell, HeartPulse, AlertTriangle, BookOpen,
  Thermometer, Bone, ActivitySquare, History, Microscope, Award, Stethoscope, 
  Cpu, Signal, Dna, ExternalLink, Calculator, DollarSign, TrendingUp, PieChart
} from 'lucide-react';

// --- MOCK IMPORTLAR VE YARDIMCI FONKSİYONLAR ---

// 1. Supabase Kurulumu
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// 2. Geo-Location Simülasyonu (utils/geo.js)
const detectLocationSettings = async () => {
  // Gerçek uygulamada burada IP-API kullanılabilir.
  // Şimdilik varsayılan dönüyoruz.
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ lang: 'tr', currency: 'TRY' });
    }, 500);
  });
};

// 3. Veri Setleri (data/content.js)
const MODULE_CONTENT = {
  'survey': { title: "ePRO & Anket", icon: ClipboardList, color: "from-blue-600 to-indigo-600", short: "Veriyi kaynağında yakalayın.", heroDesc: "Yaşam kalitesi ölçekleri ve günlük semptom takibi." },
  'medication': { title: "İlaç Takibi", icon: Bell, color: "from-green-500 to-emerald-700", short: "Tedavi uyumunu artırın.", heroDesc: "Akıllı bildirimler ve görsel teyit." },
  'vital': { title: "Vital & IoT", icon: HeartPulse, color: "from-rose-500 to-red-700", short: "Giyilebilir cihaz entegrasyonu.", heroDesc: "Tansiyon, şeker, nabız verileri." },
  'appointment': { title: "Randevu", icon: Calendar, color: "from-purple-600 to-violet-800", short: "No-Show oranlarını düşürün.", heroDesc: "Vizit hatırlatıcıları." },
  'adverse': { title: "Yan Etki", icon: AlertTriangle, color: "from-orange-500 to-amber-600", short: "Hızlı bildirim.", heroDesc: "Farmakovijilans modülü." },
};

// Çeviriye göre modül listesi getiren yardımcı
const getModuleContentTranslated = (t) => MODULE_CONTENT; 

// --- BİLEŞENLER (PAGES & COMPONENTS) ---

// FOOTER COMPONENT
const Footer = ({ setView }) => {
  const { t } = useTranslation();
  return (
    <footer className="bg-slate-900 text-white pt-20 pb-10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 text-sm">
        <div>
           <div className="flex items-center gap-2 font-bold text-2xl mb-6"><Activity className="text-rose-500"/> Turp</div>
           <p className="text-slate-400 mb-6">Geleceğin klinik araştırmaları için dijital köprü.</p>
        </div>
        <div>
            <h4 className="font-bold text-lg mb-6">Platform</h4>
            <ul className="space-y-4 text-slate-400">
                <li><button onClick={()=>setView('home')}>Ana Sayfa</button></li>
                <li><button onClick={()=>setView('blog')}>Blog</button></li>
            </ul>
        </div>
        <div>
            <h4 className="font-bold text-lg mb-6">Kurumsal</h4>
            <ul className="space-y-4 text-slate-400">
                <li><button onClick={()=>setView('about')}>Hakkımızda</button></li>
                <li><button onClick={()=>setView('admin')}>Partner Girişi</button></li>
            </ul>
        </div>
        <div>
            <h4 className="font-bold text-lg mb-6">İletişim</h4>
            <p className="text-slate-400">info@turp.app</p>
        </div>
      </div>
    </footer>
  );
};

// ROI CALCULATOR PAGE (YENİ)
const ROICalculator = ({ initialCurrency }) => {
    const [patients, setPatients] = useState(100);
    const [visits, setVisits] = useState(10);
    const [cost, setCost] = useState(500);
    const currencySymbol = initialCurrency === 'TRY' ? '₺' : (initialCurrency === 'USD' ? '$' : '€');
    
    const totalTraditional = patients * visits * cost;
    const totalTurp = totalTraditional * 0.7; // %30 Tasarruf varsayımı
    const savings = totalTraditional - totalTurp;

    return (
        <div className="min-h-screen bg-slate-50 py-20 px-6 animate-in fade-in">
            <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-100 p-10">
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-rose-600"><Calculator size={32}/></div>
                    <h1 className="text-3xl font-bold text-slate-900">Yatırım Getirisi (ROI) Hesaplayıcı</h1>
                    <p className="text-slate-500 mt-2">Dijitalleşmenin maliyetlerinize etkisini hesaplayın.</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-12">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Hasta Sayısı: {patients}</label>
                            <input type="range" min="10" max="1000" value={patients} onChange={e=>setPatients(Number(e.target.value))} className="w-full accent-rose-600"/>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Hasta Başına Vizit: {visits}</label>
                            <input type="range" min="1" max="50" value={visits} onChange={e=>setVisits(Number(e.target.value))} className="w-full accent-rose-600"/>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Vizit Başına Operasyonel Maliyet ({currencySymbol}): {cost}</label>
                            <input type="number" value={cost} onChange={e=>setCost(Number(e.target.value))} className="w-full p-3 border rounded-xl"/>
                        </div>
                    </div>
                    
                    <div className="bg-slate-900 text-white rounded-2xl p-8 flex flex-col justify-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-600 rounded-full blur-3xl opacity-20"></div>
                        <h3 className="text-slate-400 font-bold uppercase tracking-wider text-sm mb-2">Tahmini Tasarruf</h3>
                        <div className="text-5xl font-extrabold text-rose-500 mb-4">{currencySymbol}{savings.toLocaleString()}</div>
                        <p className="text-sm text-slate-400 mb-6">Turp kullanımı ile operasyonel yükte ortalama %30 azalma öngörülmüştür.</p>
                        <div className="flex gap-4 text-xs font-bold">
                            <div className="bg-white/10 px-3 py-1 rounded">Geleneksel: {currencySymbol}{totalTraditional.toLocaleString()}</div>
                            <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded">Dijital: {currencySymbol}{totalTurp.toLocaleString()}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// RHEUMATOLOGY CASE STUDY PAGE (YENİ)
const RheumaCaseStudy = ({ setView }) => {
    return (
        <div className="min-h-screen bg-white animate-in slide-in-from-right">
             <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex justify-between">
                <button onClick={() => setView('home')} className="flex items-center gap-2 font-bold text-slate-600"><ArrowLeft size={20}/> Geri Dön</button>
            </div>
            
            <section className="bg-amber-50 py-20 px-6">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12">
                    <div className="flex-1">
                        <div className="inline-flex items-center gap-2 bg-amber-200 text-amber-800 px-3 py-1 rounded-full text-xs font-bold mb-6">VAKA ANALİZİ</div>
                        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Romatoid Artrit Takibinde Dijital Dönüşüm</h1>
                        <p className="text-xl text-slate-600">Hastaların sabah tutukluğunu ve eklem ağrılarını evden bildirmesi, DAS28 skorunun klinik vizit öncesi hazır olmasını nasıl sağladı?</p>
                    </div>
                    <div className="flex-1 flex justify-center"><ActivitySquare size={200} className="text-amber-600 opacity-80"/></div>
                </div>
            </section>

            <section className="py-20 px-6 max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold mb-8">Çözüm Detayları</h2>
                <div className="space-y-8">
                    <div className="flex gap-4">
                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center shrink-0 font-bold">1</div>
                        <div><h3 className="font-bold text-lg">Dijital Homunculus</h3><p className="text-slate-600">Hasta uygulama üzerindeki insan maketi üzerinde ağrıyan eklemlerini işaretler. Sistem otomatik olarak şiş ve hassas eklem sayısını hesaplar.</p></div>
                    </div>
                    <div className="flex gap-4">
                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center shrink-0 font-bold">2</div>
                        <div><h3 className="font-bold text-lg">Sabah Tutukluğu Kronometresi</h3><p className="text-slate-600">Hasta uyandığında butona basar, tutukluk geçtiğinde durdurur. Subjektif "yaklaşık 1 saat" beyanı yerine kesin süre verisi elde edilir.</p></div>
                    </div>
                </div>
            </section>
        </div>
    );
};

// HOME PAGE
const Home = ({ setView }) => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <section className="pt-32 pb-20 px-6 bg-slate-900 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20"><img src="https://images.unsplash.com/photo-1551076805-e1869033e561" className="w-full h-full object-cover"/></div>
          <div className="relative z-10 max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-1.5 rounded-full text-xs font-bold mb-8"><ShieldCheck size={14}/> USBS Onaylı</div>
              <h1 className="text-5xl md:text-7xl font-extrabold mb-8">{t('hero_title_1')} <span className="text-rose-500">{t('hero_title_2')}</span></h1>
              <p className="text-xl text-slate-300 mb-12">{t('hero_desc')}</p>
              <button onClick={()=>document.getElementById('contact').scrollIntoView()} className="bg-rose-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-rose-500 transition-all">{t('btn_demo')}</button>
          </div>
      </section>
      
      {/* Contact Form Placeholder for Scroll */}
      <section id="contact" className="py-20 bg-white text-center"><h2 className="text-3xl font-bold">İletişim</h2><p>Form burada olacak...</p></section>
    </div>
  );
};

// ABOUT PAGE (GÜNCELLENMİŞ VERSİYON)
const About = ({ setView }) => {
  const { t } = useTranslation();
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div className="min-h-screen bg-white animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
            <button onClick={() => setView('home')} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-bold transition-colors"><ArrowLeft size={20}/> {t('about.back_home') || 'Geri Dön'}</button>
        </div>
      </div>
      <section className="relative pt-20 pb-32 px-6 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 opacity-20"><img src="https://images.unsplash.com/photo-1532187863486-abf9dbad1b69" className="w-full h-full object-cover" /></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 text-white px-4 py-1.5 rounded-full text-xs font-bold mb-8 uppercase tracking-wider"><History size={14} className="text-rose-500"/> 1997'den Beri</div>
            <h1 className="font-heading text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">Türkiye'nin İlk CRO'su Olarak,<br/> <span className="text-rose-500">Geleceğin Kanıtını İnşa Ediyoruz.</span></h1>
            <p className="text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto">Omega Araştırma deneyimiyle doğan Turp; yazılımı amaç olarak değil, bilimsel hakikate ulaşmak için bir araç olarak kullanır.</p>
        </div>
      </section>
      <section className="py-24 bg-slate-50 px-6">
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16"><h2 className="font-heading text-3xl font-bold text-slate-900">Gücümüzü Aldığımız Ekosistem</h2></div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <a href="https://omegacro.com.tr" target="_blank" className="bg-white p-8 rounded-3xl shadow-lg group relative block"><ExternalLink size={16} className="absolute top-6 right-6 text-slate-300"/><Award size={32} className="text-slate-700 mb-6"/><h3 className="font-bold text-xl mb-2">Omega CRO</h3><p className="text-xs font-bold text-rose-600 uppercase mb-4">Stratejik Akıl</p><p className="text-sm text-slate-600">Protokol ve regülasyon yönetimi.</p></a>
                <a href="https://omegacare.com.tr" target="_blank" className="bg-white p-8 rounded-3xl shadow-lg group relative block"><ExternalLink size={16} className="absolute top-6 right-6 text-slate-300"/><Stethoscope size={32} className="text-slate-700 mb-6"/><h3 className="font-bold text-xl mb-2">Omega Care</h3><p className="text-xs font-bold text-rose-600 uppercase mb-4">Saha Gücü</p><p className="text-sm text-slate-600">Evde sağlık ve hemşirelik hizmetleri.</p></a>
                <a href="https://omegagenetik.com" target="_blank" className="bg-white p-8 rounded-3xl shadow-lg group relative block"><ExternalLink size={16} className="absolute top-6 right-6 text-slate-300"/><Dna size={32} className="text-slate-700 mb-6"/><h3 className="font-bold text-xl mb-2">Omega Genetik</h3><p className="text-xs font-bold text-rose-600 uppercase mb-4">Laboratuvar</p><p className="text-sm text-slate-600">Genetik ve biyobelirteç analizi.</p></a>
                <div className="bg-slate-900 p-8 rounded-3xl shadow-xl text-white relative overflow-hidden"><Activity size={32} className="mb-6"/><h3 className="font-bold text-xl mb-2">Turp</h3><p className="text-xs font-bold text-rose-400 uppercase mb-4">Dijital Köprü</p><p className="text-sm text-slate-400">Veriyi ve hastayı bağlayan platform.</p></div>
            </div>
        </div>
      </section>
    </div>
  );
};

// YARDIMCI SAYFALAR (Mock)
const Blog = () => <div className="p-20 text-center">Blog Sayfası</div>;
const PostDetail = () => <div className="p-20 text-center">Yazı Detayı</div>;
const ModuleDetail = ({moduleId}) => <div className="p-20 text-center">Modül: {moduleId}</div>;
const Admin = () => <div className="p-20 text-center">Admin Paneli</div>;
const Login = () => <div className="p-20 text-center">Giriş Yap</div>;

// --- ANA APP COMPONENT (SİZİN İSTEDİĞİNİZ YAPI) ---
export default function App() {
  // --- STATE YÖNETİMİ ---
  const [view, setView] = useState('home'); 
  const [editingPost, setEditingPost] = useState(null); 
  const [session, setSession] = useState(null); 
  const [globalCurrency, setGlobalCurrency] = useState('TRY'); 
  const [isScrolled, setIsScrolled] = useState(false); 

  // i18n
  const { t, i18n } = useTranslation(); 
  const languages = [{ code: 'tr', label: 'TR' }, { code: 'en', label: 'EN' }, { code: 'zh', label: 'ZH' }];
  const modules = getModuleContentTranslated(t);

  // --- EFFECTLER ---
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => { setSession(session); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => { setSession(session); });
    
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);

    const initLocalization = async () => {
      const settings = await detectLocationSettings();
      if (i18n.language !== settings.lang) { i18n.changeLanguage(settings.lang); }
      setGlobalCurrency(settings.currency);
    };
    initLocalization();

    return () => { 
        window.removeEventListener('scroll', handleScroll); 
        subscription.unsubscribe(); 
    };
  }, []);

  // --- HANDLERS ---
  const handleLogout = async () => { await supabase.auth.signOut(); setView('home'); };
  const startEdit = (post) => { if (!session) { alert("Giriş yapmalısınız!"); setView('admin'); return; } setEditingPost(post); setView('admin'); };
  const changeLanguage = (lng) => { i18n.changeLanguage(lng); };

  // --- ROUTER ---
  const renderView = () => {
    switch (view) {
        case 'home': return <Home setView={setView} />;
        case 'about': return <About setView={setView} />;
        case 'blog': return <Blog setView={setView} />;
        case 'roi': return <ROICalculator initialCurrency={globalCurrency} />;
        case 'case-rheuma': return <RheumaCaseStudy setView={setView} />;
        case 'admin': return session ? <Admin editingPost={editingPost} setEditingPost={setEditingPost} setView={setView} handleLogout={handleLogout} /> : <Login />;
        default:
            if (typeof view === 'object') {
                if (view.type === 'module') return <ModuleDetail moduleId={view.id} setView={setView} />;
                if (view.type === 'detail') return <PostDetail post={view.post} setView={setView} onEdit={startEdit} />;
            }
            return <Home setView={setView} />;
    }
  };

  return (
    <div className="font-sans text-slate-900 bg-slate-50 min-h-screen flex flex-col selection:bg-rose-200 selection:text-rose-900">
      
      {/* NAVBAR */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-md py-3' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          
          {/* Logo */}
          <div className="font-heading font-bold text-2xl flex items-center gap-2 cursor-pointer group" onClick={()=>setView('home')}>
            <div className="w-10 h-10 bg-rose-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-rose-600/30 group-hover:rotate-3 transition-transform">
                <Activity size={22}/>
            </div>
            <span className="tracking-tight text-slate-900">Turp</span>
          </div>
          
          {/* Menü */}
          <div className="flex items-center gap-3 md:gap-6">
            <div className="flex items-center bg-white/80 backdrop-blur border border-slate-200 p-1.5 rounded-full shadow-sm">
              <button onClick={()=>setView('home')} className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${view === 'home' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}>{t("nav_home")}</button>
              
              {/* Modüller Dropdown */}
              <div className="relative group h-full flex items-center">
                 <button className="px-4 py-2 rounded-full text-sm font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-100 flex items-center gap-1">{t("nav_modules")} <ChevronDown size={14}/></button>
                 <div className="absolute top-full left-0 w-64 pt-4 hidden group-hover:block animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
                        {Object.entries(modules).map(([key, val]) => (
                            <button key={key} onClick={() => setView({ type: 'module', id: key })} className="block w-full text-left px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 hover:text-rose-600 border-b border-slate-50 last:border-0 transition-colors">{val.title}</button>
                        ))}
                    </div>
                 </div>
              </div>

              <button onClick={()=>setView('roi')} className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${view === 'roi' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}>ROI</button>
              <button onClick={()=>setView('case-rheuma')} className={`hidden lg:flex items-center gap-1 px-4 py-2 rounded-full text-sm font-bold transition-all ${view === 'case-rheuma' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}><FileText size={14}/> Senaryolar</button>
              <button onClick={()=>setView('about')} className={`hidden md:block px-4 py-2 rounded-full text-sm font-bold transition-all ${view === 'about' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}>Hakkımızda</button>
              
              {session && (<button onClick={()=>setView('admin')} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${view === 'admin' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}><Lock size={14} className="text-green-400"/> {t("nav_admin")}</button>)}
            </div>

            {/* Dil */}
            <div className="flex items-center gap-1 bg-white/80 backdrop-blur border border-slate-200 p-1.5 rounded-full shadow-sm">
                <Globe size={16} className="text-slate-400 ml-2 hidden md:block" />
                {languages.map((lang) => (
                    <button key={lang.code} onClick={() => changeLanguage(lang.code)} className={`w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center transition-all ${i18n.language === lang.code ? 'bg-rose-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-200'}`}>{lang.label}</button>
                ))}
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1">{renderView()}</main>
      <Footer setView={setView} />
    </div>
  );
}
