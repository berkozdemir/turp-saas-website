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
  Microscope, Award, Stethoscope, History, Signal, Cpu, Users
} from 'lucide-react';

// --- KURUMSAL BİLGİLER ---
const COMPANY_INFO = {
    address: "Cyberpark C Blok Kat: 1 No:146 Bilkent, Çankaya / Ankara",
    phone: "+90 312 426 77 22",
    email: "info@turp.app",
    copyright: "© 2025 Turp & Omega Araştırma."
};

// --- SUPABASE AYARLARI ---
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Ortam Değişkenleri Tanımlı Değil! Lütfen Vercel'e ekleyin.");
}
const supabase = createClient(supabaseUrl, supabaseKey);

// --- MODÜL İÇERİK VERİTABANI (SUPABASE LİNKLERİ EŞLEŞTİRİLDİ) ---
const MODULE_CONTENT = {
  'survey': {
    titleKey: "mod_survey_title", icon: ClipboardList, color: "from-blue-600 to-indigo-600",
    // Link: Senior woman eye exam
    image: "https://zhljpirfyiuraeocgbep.supabase.co/storage/v1/object/public/blog-images/senior-woman-eye-exam-and-vision-for-snellen-test-2025-04-06-12-48-50-utc.jpg",
    shortKey: "mod_survey_short", heroDescKey: "mod_survey_desc",
    details: ["mod_survey_d1", "mod_survey_d2", "mod_survey_d3"],
    features: [{ t: "Dinamik Mantık", d: "mod_survey_d3" }, { t: "Zaman Damgası", d: "mod_survey_d1" }, { t: "Çoklu Dil", d: "mod_survey_d1" }, { t: "Validasyon", d: "mod_survey_d3" }]
  },
  'medication': {
    titleKey: "mod_med_title", icon: Bell, color: "from-green-500 to-emerald-700",
    // Link: A pile of pills
    image: "https://zhljpirfyiuraeocgbep.supabase.co/storage/v1/object/public/blog-images/a-pile-of-pills-in-blister-packs-close-up-2025-10-18-13-17-21-utc.jpg",
    shortKey: "mod_med_short", heroDescKey: "mod_med_desc",
    details: ["mod_med_d1", "mod_med_d2", "mod_med_d3"],
    features: [{ t: "Görsel Teyit", d: "mod_med_d1" }, { t: "Akıllı Erteleme", d: "mod_med_d2" }, { t: "Stok Takibi", d: "mod_med_d3" }, { t: "Oyunlaştırma", d: "mod_med_d1" }]
  },
  'vital': {
    titleKey: "mod_vital_title", icon: HeartPulse, color: "from-rose-500 to-red-700",
    // Link: Woman taking blood pressure
    image: "https://zhljpirfyiuraeocgbep.supabase.co/storage/v1/object/public/blog-images/woman-taking-blood-pressure-test-on-smartwatches-2025-08-11-15-24-28-utc.jpg",
    shortKey: "mod_vital_short", heroDescKey: "mod_vital_desc",
    details: ["mod_vital_d1", "mod_vital_d2", "mod_vital_d3"],
    features: [{ t: "Cihaz Entegrasyonu", d: "mod_vital_d1" }, { t: "Trend Analizi", d: "mod_vital_d3" }, { t: "Apple/Google Health", d: "mod_vital_d2" }, { t: "Veri Temizliği", d: "mod_vital_d3" }]
  },
  'appointment': {
    titleKey: "mod_appt_title", icon: Calendar, color: "from-purple-600 to-violet-800",
    // Link: Appointment consulting doctor
    image: "https://zhljpirfyiuraeocgbep.supabase.co/storage/v1/object/public/blog-images/appointment-consulting-doctor-visit-on-mobile-app-2024-11-26-02-03-22-utc.jpg",
    shortKey: "mod_appt_short", heroDescKey: "mod_appt_desc",
    details: ["mod_appt_d1", "mod_appt_d2", "mod_appt_d3"],
    features: [{ t: "Otomatik Hatırlatıcı", d: "mod_appt_d1" }, { t: "Takvim Senk.", d: "mod_appt_d2" }, { t: "Navigasyon", d: "mod_appt_d3" }, { t: "Esnek Planlama", d: "mod_appt_d3" }]
  },
  'adverse': {
    titleKey: "mod_adv_title", icon: AlertTriangle, color: "from-orange-500 to-amber-600",
    // Link: Doctor presenting report
    image: "https://zhljpirfyiuraeocgbep.supabase.co/storage/v1/object/public/blog-images/doctor-presenting-report-of-diagnosis-2025-01-09-06-41-33-utc.jpg",
    shortKey: "mod_adv_short", heroDescKey: "mod_adv_desc",
    details: ["mod_adv_d1", "mod_adv_d2", "mod_adv_d3"],
    features: [{ t: "Tek Tuşla Bildirim", d: "mod_adv_d1" }, { t: "Görsel Kanıt", d: "mod_adv_d2" }, { t: "CTCAE Derecelendirme", d: "mod_adv_d3" }, { t: "Anlık Alarm", d: "mod_adv_d3" }]
  },
  'education': {
    titleKey: "mod_edu_title", icon: BookOpen, color: "from-sky-500 to-cyan-600",
    // Link: Chairs on empty building (Eğitim/Konferans temsili)
    image: "https://zhljpirfyiuraeocgbep.supabase.co/storage/v1/object/public/blog-images/chairs-on-empty-building-2025-01-27-22-50-08-utc.jpg",
    shortKey: "mod_edu_short", heroDescKey: "mod_edu_desc",
    details: ["mod_edu_d1", "mod_edu_d2", "mod_edu_d3"],
    features: [{ t: "eConsent", d: "mod_edu_d1" }, { t: "Multimedya", d: "mod_edu_d2" }, { t: "Bilgi Sınaması", d: "mod_edu_d3" }, { t: "Canlı Kütüphane", d: "mod_edu_d3" }]
  },
  'webinar': {
    titleKey: "mod_web_title", icon: Video, color: "from-fuchsia-600 to-pink-600",
    // Link: Virtual doctor working from home
    image: "https://zhljpirfyiuraeocgbep.supabase.co/storage/v1/object/public/blog-images/virtual-doctor-working-from-home-on-a-video-call-2025-11-02-01-48-10-utc.jpg",
    shortKey: "mod_web_short", heroDescKey: "mod_web_desc",
    details: ["mod_web_d1", "mod_web_d2", "mod_web_d3"],
    features: [{ t: "Uçtan Uca Şifreleme", d: "mod_web_d1" }, { t: "Ekran Paylaşımı", d: "mod_web_d2" }, { t: "Sanal Bekleme", d: "mod_web_d3" }, { t: "Oturum Logları", d: "mod_web_d3" }]
  }
};

// --- ÇEVİRİ FONKSİYONU ---
const getModuleContentTranslated = (t) => {
    return Object.entries(MODULE_CONTENT).map(([id, data]) => ({
        id,
        title: t(data.titleKey) !== data.titleKey ? t(data.titleKey) : data.title, // Fallback kontrolü
        short: t(data.shortKey) !== data.shortKey ? t(data.shortKey) : data.short,
        heroDesc: t(data.heroDescKey) !== data.heroDescKey ? t(data.heroDescKey) : data.heroDesc,
        icon: data.icon,
        color: data.color,
        image: data.image,
        details: data.details, 
        features: data.features
    })).reduce((acc, curr) => ({ ...acc, [curr.id]: curr }), {});
};

// --- OPTİMİZE RESİM BİLEŞENİ ---
const OptimizedImage = ({ src, alt, width, height, className }) => {
  if (!src) return null;
  let optimizedSrc = src;
  // Sadece Supabase URL'lerini dönüştür
  if (src.includes('supabase.co') && src.includes('/storage/v1/object/public')) {
    optimizedSrc = src.replace('/storage/v1/object/public', '/storage/v1/render/image/public');
    const params = [];
    if (width) params.push(`width=${width}`);
    if (height) params.push(`height=${height}`);
    params.push('quality=80'); params.push('resize=contain');
    optimizedSrc += `?${params.join('&')}`;
  }
  return (<img src={optimizedSrc} alt={alt} className={className} loading="lazy" />);
};

// --- YARDIMCI BİLEŞEN: SSS ---
const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-slate-200 last:border-0">
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center justify-between w-full py-6 text-left focus:outline-none group">
        <span className={`text-lg font-heading font-bold transition-colors ${isOpen ? 'text-rose-600' : 'text-slate-800 group-hover:text-rose-600'}`}>{question}</span>
        {isOpen ? <ChevronUp className="text-rose-600"/> : <ChevronDown className="text-slate-400"/>}
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100 pb-6' : 'max-h-0 opacity-0'}`}><p className="text-slate-600 leading-relaxed">{answer}</p></div>
    </div>
  );
};

// --- BİLEŞEN: FOOTER ---
const Footer = ({ setView }) => {
  const { t } = useTranslation();
  return (
    <footer className="bg-slate-900 text-white pt-20 pb-10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 font-heading font-bold text-2xl text-white mb-6"><Activity size={24} className="text-rose-500"/> Turp</div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">Klinik araştırmalarda veriyi kaynağından doğrulayan, USBS onaylı yeni nesil dijital sağlık platformu.</p>
            <div className="flex gap-4"><Linkedin size={18} className="cursor-pointer hover:text-rose-500"/><Twitter size={18} className="cursor-pointer hover:text-rose-500"/><Instagram size={18} className="cursor-pointer hover:text-rose-500"/></div>
          </div>
          <div><h4 className="font-bold text-lg mb-6">Platform</h4><ul className="space-y-4 text-slate-400 text-sm"><li><button onClick={() => setView('home')} className="hover:text-white transition-colors">Ana Sayfa</button></li><li><button onClick={() => setView('blog')} className="hover:text-white transition-colors">Blog & Haberler</button></li></ul></div>
          <div><h4 className="font-bold text-lg mb-6">Kurumsal</h4><ul className="space-y-4 text-slate-400 text-sm"><li><button onClick={() => setView('about')} className="hover:text-white transition-colors">Hakkımızda</button></li><li><button onClick={() => setView('admin')} className="hover:text-white transition-colors">Partner Girişi</button></li><li><a href="#contact" className="hover:text-white transition-colors">İletişim</a></li></ul></div>
          <div><h4 className="font-bold text-lg mb-6">İletişim</h4><ul className="space-y-4 text-slate-400 text-sm"><li className="flex items-start gap-3"><MapPin size={18} className="text-rose-500 shrink-0 mt-0.5"/><span>{COMPANY_INFO.address}</span></li><li className="flex items-center gap-3"><Phone size={18} className="text-rose-500 shrink-0"/><span>{COMPANY_INFO.phone}</span></li><li className="flex items-center gap-3"><Mail size={18} className="text-rose-500 shrink-0"/><span>{COMPANY_INFO.email}</span></li></ul></div>
        </div>
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500"><p>{COMPANY_INFO.copyright}</p></div>
      </div>
    </footer>
  );
};

// --- BİLEŞEN: HAKKIMIZDA (ABOUT) ---
const About = ({ setView }) => {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div className="min-h-screen bg-white animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 px-6 py-4"><div className="max-w-7xl mx-auto flex justify-between items-center"><button onClick={() => setView('home')} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-bold transition-colors"><ArrowLeft size={20}/> Ana Sayfaya Dön</button></div></div>
      <section className="relative pt-20 pb-32 px-6 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 opacity-20"><img src="https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=2070" className="w-full h-full object-cover" alt="Lab" /></div>
        <div className="max-w-4xl mx-auto text-center relative z-10"><div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 text-white px-4 py-1.5 rounded-full text-xs font-bold mb-8 uppercase tracking-wider"><History size={14} className="text-rose-500"/> 1997'den Beri</div><h1 className="font-heading text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">Türkiye'nin İlk CRO'su Olarak,<br/> <span className="text-rose-500">Geleceğin Kanıtını İnşa Ediyoruz.</span></h1><p className="text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto">Omega Araştırma deneyimiyle doğan Turp; yazılımı amaç olarak değil, bilimsel hakikate ulaşmak için bir araç olarak kullanır.</p></div>
      </section>
      <section className="py-24 px-6 max-w-5xl mx-auto"><div className="grid md:grid-cols-2 gap-16 items-center"><div><h2 className="font-heading text-3xl font-bold text-slate-900 mb-6">Yazılım Firması Değil, <br/><span className="text-rose-600">Araştırma Firmasıyız.</span></h2><p className="text-slate-600 leading-relaxed mb-6 text-lg font-medium border-l-4 border-slate-900 pl-4">"Sizin derdinizden en iyi biz anlarız, çünkü biz de sizdeniz."</p><p className="text-slate-600 leading-relaxed mb-6">Pek çok teknoloji firması klinik araştırmayı "öğrenmeye" çalışırken; biz <strong>1997'den beri</strong> bu süreçleri yazan, yöneten ve dönüştüren ekibiz.</p><p className="text-slate-600 leading-relaxed">Dijitalleşme, IoT veya Yapay Zeka bizim için nihai amaç değildir. Bu teknolojileri, <strong>ICH-GCP</strong> prensiplerine uygun, doğrulanabilir ve yüksek kalitede veri toplamak için birer "araç" olarak kullanıyoruz.</p></div><div className="relative"><div className="absolute -inset-4 bg-gradient-to-tr from-rose-500 to-purple-600 rounded-[2rem] opacity-20 blur-xl"></div><img src="https://images.unsplash.com/photo-1579165466741-7f35e4755652?q=80&w=1000" className="relative rounded-2xl shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500 grayscale hover:grayscale-0" alt="Research Team" /></div></div></section>
      <section className="py-24 bg-slate-50 px-6"><div className="max-w-6xl mx-auto"><div className="text-center mb-16"><h2 className="font-heading text-3xl font-bold text-slate-900">Gücümüzü Aldığımız Ekosistem</h2><p className="text-slate-500 mt-2">Uçtan uca, bütünleşik klinik araştırma yönetimi.</p></div><div className="grid md:grid-cols-3 gap-8"><div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-200 hover:-translate-y-2 transition-all group"><div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-6 text-slate-700 group-hover:bg-slate-900 group-hover:text-white transition-colors"><Award size={32} /></div><h3 className="font-heading text-xl font-bold text-slate-900 mb-2">Omega CRO</h3><p className="text-xs font-bold text-rose-600 uppercase tracking-wide mb-4">Stratejik Akıl • 1997</p><p className="text-slate-600 text-sm leading-relaxed">Protokol tasarımı, etik kurul ve regülasyon yönetimi. Türkiye'nin ilk CRO'su olarak projenin yasal ve bilimsel omurgasını kuruyoruz.</p></div><div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-200 hover:-translate-y-2 transition-all group"><div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-6 text-slate-700 group-hover:bg-rose-600 group-hover:text-white transition-colors"><Stethoscope size={32} /></div><h3 className="font-heading text-xl font-bold text-slate-900 mb-2">Omega Care</h3><p className="text-xs font-bold text-rose-600 uppercase tracking-wide mb-4">Saha Gücü • Evde Sağlık</p><p className="text-slate-600 text-sm leading-relaxed">Araştırma hemşireleri ile hastayı evinde ziyaret eden, numune alan ve ilacı uygulayan operasyonel güç. Dijitalin yetmediği yerde fiziksel temas.</p></div><div className="bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-800 hover:-translate-y-2 transition-all group relative overflow-hidden"><div className="absolute top-0 right-0 w-32 h-32 bg-rose-600 rounded-full blur-3xl opacity-20"></div><div className="w-16 h-16 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center mb-6 text-white relative z-10"><Activity size={32} /></div><h3 className="font-heading text-xl font-bold text-white mb-2 relative z-10">Turp</h3><p className="text-xs font-bold text-rose-400 uppercase tracking-wide mb-4 relative z-10">Dijital Köprü</p><p className="text-slate-400 text-sm leading-relaxed relative z-10">Veriyi, hastayı ve araştırmacıyı birbirine bağlayan dijital platform. e-Nabız entegrasyonu ve yapay zeka destekli analiz.</p></div></div></div></section>
      <section className="py-20 px-6 max-w-5xl mx-auto text-center"><h2 className="font-heading text-3xl font-bold text-slate-900 mb-10">Metodolojimiz: Veriden Sinyale</h2><div className="grid grid-cols-2 md:grid-cols-4 gap-8">{[{i:Microscope, t:"ICH-GCP", d:"Uluslararası Standart"},{i:Cpu, t:"Data Science", d:"Gelişmiş Veri Analitiği"},{i:Signal, t:"Sinyal Üretme", d:"Anlık Klinik Uyarılar"},{i:Database, t:"RWE", d:"Gerçek Yaşam Verisi"}].map((item, idx) => (<div key={idx} className="flex flex-col items-center group"><div className="w-14 h-14 bg-rose-50 rounded-full flex items-center justify-center text-rose-600 mb-4">{React.createElement(item.i, {size:24})}</div><h4 className="font-bold text-slate-900">{item.t}</h4><p className="text-xs text-slate-500">{item.d}</p></div>))}</div></section>
      <section className="py-20 bg-slate-900 text-center px-6"><div className="max-w-3xl mx-auto"><h2 className="text-2xl md:text-3xl font-heading font-bold text-white mb-6">Projelerinizde Deneyimin Gücünü Kullanın</h2><p className="text-slate-400 mb-10 text-lg">Geleneksel CRO süreçlerini dijital hızla tanıştırın.</p><button onClick={() => setView('home')} className="px-8 py-3 bg-white text-slate-900 font-bold rounded-xl hover:scale-105 transition-transform">Bize Ulaşın</button></div></section>
    </div>
  );
};

// --- MODÜL DETAY SAYFASI ---
const ModuleDetail = ({ moduleId, setView }) => {
  const { t } = useTranslation();
  const allModules = getModuleContentTranslated(t);
  const data = allModules[moduleId];
  useEffect(() => { window.scrollTo(0, 0); }, [moduleId]);
  if (!data) return <div className="p-20 text-center">Modül bulunamadı.</div>;

  return (
    <div className="min-h-screen bg-white animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
           <button onClick={() => setView('home')} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-bold transition-colors"><ArrowLeft size={20}/> Ana Sayfaya Dön</button>
           <button onClick={() => document.getElementById('contact-module').scrollIntoView({behavior: 'smooth'})} className="px-5 py-2 bg-slate-900 text-white rounded-full text-sm font-bold hover:bg-slate-700 transition-colors shadow-lg">Bu Modülü Talep Et</button>
        </div>
      </div>
      <section className={`relative py-32 px-6 overflow-hidden flex items-center justify-center min-h-[60vh]`}>
        <div className="absolute inset-0 z-0"><OptimizedImage src={data.image} alt={data.title} width={1200} className="w-full h-full object-cover object-center" /><div className={`absolute inset-0 bg-gradient-to-r ${data.color} opacity-90 mix-blend-multiply`}></div></div>
        <div className="max-w-5xl mx-auto text-center relative z-10 text-white">
           <div className="w-24 h-24 mx-auto bg-white/20 backdrop-blur-sm border border-white/30 rounded-3xl flex items-center justify-center text-white shadow-2xl mb-8">{React.createElement(data.icon, { size: 48 })}</div>
           <h1 className="font-heading text-5xl md:text-7xl font-extrabold mb-6 drop-shadow-lg">{data.title}</h1>
           <p className="text-2xl text-white/90 font-light max-w-3xl mx-auto mb-10 leading-relaxed">{data.short}</p>
        </div>
      </section>
      <section className="py-20 px-6 max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-start">
         <div><h2 className="font-heading text-3xl font-bold text-slate-900 mb-6">{t("module_why")}</h2><p className="text-lg text-slate-600 leading-relaxed mb-8 font-medium border-l-4 border-slate-900 pl-6">{data.heroDesc}</p><div className="space-y-6">{data.details.map((detail, i) => (<div key={i} className="flex gap-4"><div className="mt-1.5 w-2 h-2 rounded-full bg-slate-900 shrink-0"></div><p className="text-slate-600 leading-relaxed">{detail}</p></div>))}</div></div>
         <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200"><h3 className="font-heading text-2xl font-bold text-slate-900 mb-8">{t("module_tech")}</h3><div className="grid gap-6">{data.features.map((feat, i) => (<div key={i} className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex items-start gap-4"><div className={`p-2 rounded-lg bg-gradient-to-br ${data.color} text-white shrink-0`}><CheckCircle size={18}/></div><div><h4 className="font-bold text-slate-900">{feat.t}</h4><p className="text-sm text-slate-500">{feat.d}</p></div></div>))}</div></div>
      </section>
      <section id="contact-module" className="py-24 bg-slate-900 text-white text-center px-6"><div className="max-w-3xl mx-auto"><h2 className="font-heading text-4xl font-bold mb-6">{t("module_cta_title")}</h2><p className="text-slate-400 mb-10 text-lg">{t("module_cta_desc")}</p><button onClick={() => setView('home')} className="px-10 py-4 bg-white text-slate-900 font-bold rounded-xl hover:scale-105 transition-transform">{t("module_cta_btn")}</button></div></section>
    </div>
  );
};

// --- DİĞER BİLEŞENLER (Login, PostDetail, Blog, Admin) ---
// Bu bileşenler aynı kalmıştır.
const Login = () => { const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [loading, setLoading] = useState(false); const [mode, setMode] = useState('login'); const [message, setMessage] = useState({ type: '', text: '' }); const handleLogin = async (e) => { e.preventDefault(); setLoading(true); setMessage({ type: '', text: '' }); const { error } = await supabase.auth.signInWithPassword({ email, password }); if (error) { setMessage({ type: 'error', text: 'Giriş başarısız: ' + error.message }); } setLoading(false); }; const handleResetPassword = async (e) => { e.preventDefault(); setLoading(true); const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin }); if (error) { setMessage({ type: 'error', text: error.message }); } else { setMessage({ type: 'success', text: 'Şifre sıfırlama gönderildi.' }); } setLoading(false); }; return ( <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6 py-20"> <div className="bg-white p-10 rounded-3xl shadow-2xl border border-slate-100 w-full max-w-md animate-in fade-in zoom-in duration-500"> <div className="text-center mb-8"> <div className="w-12 h-12 bg-rose-600 rounded-xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg"><Lock size={24} /></div> <h2 className="font-heading text-3xl font-bold text-slate-900">{mode === 'login' ? 'Yönetici Girişi' : 'Şifre Sıfırlama'}</h2> </div> {message.text && <div className={`p-4 rounded-xl mb-6 text-sm font-bold text-center ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>{message.text}</div>} <form onSubmit={mode === 'login' ? handleLogin : handleResetPassword} className="space-y-5"> <div> <label className="block text-xs font-bold text-slate-500 uppercase mb-2">E-posta</label> <div className="relative"><Mail className="absolute left-4 top-3.5 text-slate-400" size={20}/><input type="email" className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-rose-500 outline-none font-medium" value={email} onChange={(e) => setEmail(e.target.value)} required/></div> </div> {mode === 'login' && ( <div> <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Şifre</label> <div className="relative"><Key className="absolute left-4 top-3.5 text-slate-400" size={20}/><input type="password" className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-rose-500 outline-none font-medium" value={password} onChange={(e) => setPassword(e.target.value)} required/></div> </div> )} <button disabled={loading} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-rose-600 transition-all">{loading ? 'İşleniyor...' : (mode === 'login' ? 'Giriş Yap' : 'Bağlantı Gönder')}</button> </form> <div className="mt-6 text-center"><button onClick={() => {setMode(mode === 'login' ? 'reset' : 'login'); setMessage({type:'',text:''});}} className="text-sm text-slate-500 hover:text-rose-600 font-medium">{mode === 'login' ? 'Şifremi Unuttum' : 'Giriş Ekranına Dön'}</button></div> </div> </div> ); };
const PostDetail = ({ post, setView, onEdit }) => { if (!post) return null; return ( <div className="max-w-4xl mx-auto px-6 py-20 animate-in fade-in slide-in-from-bottom-4 duration-500"> <div className="flex justify-between items-center mb-8"> <button onClick={() => setView('blog')} className="group flex items-center gap-2 text-slate-500 hover:text-rose-600 transition-all font-heading font-semibold"><ArrowRight size={18} className="rotate-180" /> Listeye Dön</button> <button onClick={() => onEdit(post)} className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold transition-colors"><Edit3 size={16}/> Düzenle</button> </div> <article className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden"> {post.image_url ? (<div className="h-[400px] w-full relative"><OptimizedImage src={post.image_url} alt={post.title} width={1200} className="w-full h-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div></div>) : (<div className="h-32 bg-slate-100 w-full flex items-center justify-center text-slate-300"><ImageIcon size={48}/></div>)} <div className="p-8 md:p-12"> <div className="flex items-center gap-3 text-sm font-bold text-rose-600 mb-4 uppercase tracking-wider"><Calendar size={16} />{new Date(post.created_at).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}</div> <h1 className="font-heading text-3xl md:text-5xl font-extrabold mb-8 text-slate-900 leading-tight">{post.title}</h1> <div className="blog-content text-lg text-slate-600 leading-relaxed"><ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown></div> </div> </article> </div> ); };
const Blog = ({ setView }) => { const { t } = useTranslation(); const [posts, setPosts] = useState([]); const [loading, setLoading] = useState(true); useEffect(() => { const fetchPosts = async () => { const { data } = await supabase.from('posts').select('*').order('created_at', { ascending: false }); setPosts(data || []); setLoading(false); }; fetchPosts(); }, []); return ( <div className="max-w-7xl mx-auto px-6 py-20"> <h2 className="font-heading text-4xl md:text-5xl font-extrabold text-slate-900 mb-16 text-center">{t("nav_blog")}</h2> {loading ? <div className="text-center"><Loader2 className="animate-spin inline text-rose-600"/></div> : ( <div className="grid md:grid-cols-3 gap-8"> {posts.length === 0 && <div className="col-span-3 text-center py-20 text-slate-500">Henüz yazı yok.</div>} {posts.map(post => ( <div key={post.id} onClick={() => setView({ type: 'detail', post: post })} className="bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer group"> <div className="h-56 bg-slate-100 relative overflow-hidden">{post.image_url ? <OptimizedImage src={post.image_url} width={400} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" /> : <div className="flex items-center justify-center h-full text-slate-300"><ImageIcon size={48}/></div>}</div> <div className="p-8"><h3 className="font-heading font-bold text-xl mb-3 line-clamp-2 text-slate-900 group-hover:text-rose-600 transition-colors">{post.title}</h3><div className="flex items-center gap-2 text-sm font-bold text-slate-900 group-hover:translate-x-2 transition-transform">Devamını Oku <ArrowRight size={16} className="text-rose-600"/></div></div> </div> ))} </div> )} </div> ); };
const Admin = ({ editingPost, setEditingPost, setView, handleLogout }) => { const [form, setForm] = useState({ title: '', content: '' }); const [image, setImage] = useState(null); const [uploading, setUploading] = useState(false); useEffect(() => { if (editingPost) { setForm({ title: editingPost.title, content: editingPost.content }); } else { setForm({ title: '', content: '' }); } }, [editingPost]); const handleSubmit = async (e) => { e.preventDefault(); setUploading(true); try { let url = editingPost ? editingPost.image_url : null; if (image) { const fileExt = image.name.split('.').pop(); const fileName = `${Date.now()}.${fileExt}`; const { error: uploadError } = await supabase.storage.from('blog-images').upload(fileName, image); if (uploadError) throw new Error("Resim Yüklenemedi: " + uploadError.message); const { data } = supabase.storage.from('blog-images').getPublicUrl(fileName); url = data.publicUrl; } if (editingPost) { await supabase.from('posts').update({ title: form.title, content: form.content, image_url: url }).eq('id', editingPost.id); alert("Yazı güncellendi!"); setEditingPost(null); setView('blog'); } else { await supabase.from('posts').insert([{ title: form.title, content: form.content, image_url: url }]); alert("Yazı eklendi!"); setForm({ title: '', content: '' }); setImage(null); } } catch (err) { alert("Hata: " + err.message); } setUploading(false); }; return ( <div className="max-w-3xl mx-auto px-6 py-20"> <div className="flex justify-between items-center mb-8"> <h2 className="font-heading text-3xl font-bold text-slate-900">Yönetim Paneli</h2> <button onClick={handleLogout} className="flex items-center gap-2 text-sm font-bold text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors"><LogOut size={16}/> Çıkış Yap</button> </div> <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-200"> <div className="flex justify-between items-center mb-10"> <div><h2 className="font-heading text-2xl font-bold text-slate-900">{editingPost ? 'Yazıyı Düzenle' : 'Yeni Yazı Ekle'}</h2><p className="text-slate-500">Markdown formatında içerik girebilirsiniz.</p></div> {editingPost && <button onClick={() => {setEditingPost(null); setForm({title:'',content:''});}} className="text-sm text-rose-600 font-bold hover:underline">İptal Et</button>} </div> <form onSubmit={handleSubmit} className="space-y-8"> <div><label className="block text-sm font-bold text-slate-700 mb-3 uppercase">Başlık</label><input className="w-full p-4 border-2 border-slate-200 rounded-xl font-heading font-bold text-lg outline-none focus:border-rose-500" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} required /></div> <div><label className="block text-sm font-bold text-slate-700 mb-3 uppercase">İçerik (Markdown)</label><textarea className="w-full p-4 border-2 border-slate-200 rounded-xl font-mono text-sm min-h-[300px] outline-none focus:border-rose-500" value={form.content} onChange={e=>setForm({...form, content:e.target.value})} required /></div> <div><label className="block text-sm font-bold text-slate-700 mb-3 uppercase">Görsel</label><input type="file" onChange={e=>setImage(e.target.files[0])} className="block w-full text-sm text-slate-500"/></div> <button disabled={uploading} className="w-full bg-slate-900 text-white py-5 rounded-xl font-bold text-lg hover:bg-rose-600 transition-all">{uploading ? 'İşleniyor...' : (editingPost ? 'Güncelle' : 'Yayınla')}</button> </form> </div> </div> ); };

// --- ANA UYGULAMA ---
export default function App() {
  const [view, setView] = useState('home');
  const [editingPost, setEditingPost] = useState(null);
  const [session, setSession] = useState(null);
  const { t, i18n } = useTranslation(); 
  const languages = [{ code: 'tr', label: 'TR' }, { code: 'en', label: 'EN' }, { code: 'zh', label: 'ZH' }];
  const [isScrolled, setIsScrolled] = useState(false);
  const modules = MODULE_CONTENT;

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => { setSession(session); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => { setSession(session); });
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => { window.removeEventListener('scroll', handleScroll); subscription.unsubscribe(); };
  }, []);

  const handleLogout = async () => { await supabase.auth.signOut(); setView('home'); };
  const startEdit = (post) => { if (!session) { alert("Düzenleme yapmak için giriş yapmalısınız!"); setView('admin'); return; } setEditingPost(post); setView('admin'); };
  const renderView = () => {
    if (view === 'home') return <Home setView={setView} />;
    if (view === 'about') return <About setView={setView} />; // HAKKIMIZDA EKLENDİ
    if (view === 'blog') return <Blog setView={setView} />;
    if (view === 'admin') return session ? <Admin editingPost={editingPost} setEditingPost={setEditingPost} setView={setView} handleLogout={handleLogout} /> : <Login />;
    if (typeof view === 'object' && view.type === 'module') return <ModuleDetail moduleId={view.id} setView={setView} />;
    if (typeof view === 'object' && view.type === 'detail') return <PostDetail post={view.post} setView={setView} onEdit={startEdit} />;
    return <Home setView={setView} />;
  };

  return (
    <div className="font-sans text-slate-900 bg-slate-50 min-h-screen flex flex-col selection:bg-rose-200 selection:text-rose-900">
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-md py-3' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="font-heading font-bold text-2xl flex items-center gap-2 cursor-pointer group" onClick={()=>setView('home')}><div className="w-10 h-10 bg-rose-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-rose-600/30 group-hover:rotate-3 transition-transform"><Activity size={22}/></div><span className="tracking-tight text-slate-900">Turp</span></div>
          <div className="flex items-center gap-3 md:gap-6">
            <div className="flex items-center bg-white/80 backdrop-blur border border-slate-200 p-1.5 rounded-full shadow-sm">
              <button onClick={()=>setView('home')} className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${view === 'home' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}>{t("nav_home")}</button>
              {/* MODÜLLER DROPDOWN */}
              <div className="relative group h-full flex items-center">
                 <button className="px-4 py-2 rounded-full text-sm font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-100 flex items-center gap-1">{t("nav_modules")} <ChevronDown size={14}/></button>
                 <div className="absolute top-full left-0 w-64 pt-4 hidden group-hover:block animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
                        {Object.entries(modules).map(([key, val]) => (
                            <button key={key} onClick={() => setView({ type: 'module', id: key })} className="block w-full text-left px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 hover:text-rose-600 border-b border-slate-50 last:border-0 transition-colors">
                                {t(val.titleKey)}
                            </button>
                        ))}
                    </div>
                 </div>
              </div>
              <button onClick={()=>setView('blog')} className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${view === 'blog' || view?.type === 'detail' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}>{t("nav_blog")}</button>
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
