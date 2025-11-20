// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { createClient } from '@supabase/supabase-js';
import { Activity, Upload, Image as ImageIcon, Loader2, Calendar, ArrowRight, ShieldCheck, Globe } from 'lucide-react';

// --- SUPABASE AYARLARI (GÜVENLİK İÇİN ORTAM DEĞİŞKENLERİ KULLANILDI) ---
// Vercel'de tanımlanacak değişkenleri koddan çekiyoruz.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  // Eğer değişkenler Vercel'de tanımlı değilse hata fırlat
  console.error("Ortam Değişkenleri Tanımlı Değil! Lütfen Vercel'e ekleyin.");
  // Localde çalışmak için fallback koyulabilir, ancak Vercel için bu doğru ayardır.
}
const supabase = createClient(supabaseUrl, supabaseKey);

// --- ANA SAYFA ---
const Home = ({ setView }) => {
  const { t } = useTranslation();
  const features = [
    { icon: ShieldCheck, title: t("feat_1_title"), desc: t("feat_1_desc") },
    { icon: Activity, title: "Hasta Uyumu", desc: t("feat_2_desc") },
    { icon: Upload, title: "Real-World Data", desc: t("feat_3_desc") },
    { icon: Calendar, title: t("feat_4_title"), desc: t("feat_4_desc") },
    { icon: ImageIcon, title: t("feat_5_title"), desc: t("feat_5_desc") },
    { icon: Loader2, title: t("feat_6_title"), desc: t("feat_6_desc") }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 overflow-hidden">
      <section className="relative pt-24 pb-32 px-6 flex items-center justify-center min-h-[70vh]">
        <div className="absolute inset-0 z-0 overflow-hidden bg-slate-900">
          <img src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070&auto=format&fit=crop" alt="Medical Research" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur border border-green-200 text-green-700 px-4 py-1.5 rounded-full text-sm font-bold mb-8 shadow-sm"><ShieldCheck size={16} /><span>USBS Onaylı & e-Nabız Entegreli</span></div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 leading-tight drop-shadow-sm">
            {t("hero_title_part1")} <br className="hidden md:block"/><span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-purple-600">{t("hero_title_part2")}</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-12 font-medium">{t("hero_subtitle")}</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button onClick={() => setView('blog')} className="flex items-center gap-2 px-10 py-4 bg-rose-600 text-white font-bold rounded-full shadow-lg hover:bg-rose-700 transition-all">{t("btn_blog_posts")} <ArrowRight size={18} /></button>
            <button className="flex items-center gap-2 px-10 py-4 bg-white text-slate-800 border border-slate-200 font-bold rounded-full shadow-sm hover:bg-slate-50 transition-all">{t("btn_demo")}</button>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white border-y border-slate-100"><div className="max-w-7xl mx-auto px-6 text-center"><p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8">{t("partner_title")}</p></div></section>

      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16"><h2 className="text-4xl font-bold text-slate-900 mb-4">{t("section_title")}</h2><p className="text-lg text-slate-500">{t("section_subtitle")}</p></div>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((item, i) => (<div key={i} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-rose-200 transition-all group">
              <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center text-rose-600 mb-6 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                {React.createElement(item.icon, { size: 24 })}
              </div><h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3><p className="text-slate-500 text-sm">{item.desc}</p></div>))}
        </div>
      </section>
    </div>
  );
};

// --- BLOG BİLEŞENİ ---
const Blog = () => {
  const { t } = useTranslation();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
      setPosts(data || []); setLoading(false);
    }; fetchPosts();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <h2 className="text-3xl font-bold mb-12 text-center">{t("nav_blog")}</h2>
      {loading ? (<div className="text-center"><Loader2 className="animate-spin inline text-rose-600"/> Yükleniyor...</div>) : (
        <div className="grid md:grid-cols-3 gap-8">
          {posts.length === 0 && <div className="col-span-3 text-center text-slate-400 bg-white p-8 rounded-xl border border-dashed">Henüz yazı yok. Yönetim panelinden ekleyebilirsiniz.</div>}
          {posts.map(post => (<div key={post.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-lg transition-all">
              <div className="h-48 bg-slate-100 relative">{post.image_url ? <img src={post.image_url} className="w-full h-full object-cover" alt={post.title} /> : <div className="flex items-center justify-center h-full text-slate-300"><ImageIcon/></div>}</div>
              <div className="p-6"><h3 className="font-bold text-lg mb-2 line-clamp-2">{post.title}</h3><p className="text-slate-500 text-sm line-clamp-3">{post.content}</p></div></div>))}
        </div>
      )}
    </div>
  );
};

// --- ADMIN BİLEŞENİ ---
const Admin = () => {
  const [form, setForm] = useState({ title: '', content: '' });
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); setUploading(true);
    try {
      let url = null;
      if (image) {
        const cleanName = image.name.replace(/[^a-zA-Z0-9.]/g, '');
        const name = `${Date.now()}-${cleanName}`;
        await supabase.storage.from('blog-images').upload(name, image);
        const { data } = supabase.storage.from('blog-images').getPublicUrl(name);
        url = data.publicUrl;
      }
      await supabase.from('posts').insert([{ title: form.title, content: form.content, image_url: url }]);
      alert("Yazı başarıyla eklendi!"); setForm({ title: '', content: '' }); setImage(null);
    } catch (err) { alert("Hata: " + err.message); }
    setUploading(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-2xl font-bold mb-6">Blog Yazısı Ekle</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="block text-sm font-bold text-slate-700 mb-2">Başlık</label><input className="w-full p-3 border rounded-xl" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} required /></div>
          <div><label className="block text-sm font-bold text-slate-700 mb-2">İçerik</label><textarea className="w-full p-3 border rounded-xl" rows={5} value={form.content} onChange={e=>setForm({...form, content:e.target.value})} required /></div>
          <div><label className="block text-sm font-bold text-slate-700 mb-2">Görsel</label><input type="file" onChange={e=>setImage(e.target.files[0])} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100"/></div>
          <button disabled={uploading} className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-all">{uploading ? 'Yükleniyor...' : 'Yayınla'}</button>
        </form>
      </div>
    </div>
  );
};

// --- MAIN APP ---
export default function App() {
  const [view, setView] = useState('home');
  const { t, i18n } = useTranslation(); 
  const languages = [{ code: 'tr', label: 'TR' }, { code: 'en', label: 'EN' }, { code: 'zh', label: 'ZH' }];

  const changeLanguage = (lng) => { i18n.changeLanguage(lng); };

  return (
    <div className="font-sans text-slate-900 bg-slate-50 min-h-screen flex flex-col">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-bold text-2xl flex items-center gap-2 cursor-pointer" onClick={()=>setView('home')}>
            <div className="w-9 h-9 bg-rose-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-rose-200"><Activity size={20}/></div>
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
              {languages.map((lang) => (<button key={lang.code} onClick={() => changeLanguage(lang.code)} className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${i18n.language === lang.code ? 'bg-rose-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 hover:bg-white'}`}>{lang.label}</button>))}
            </div>
          </div>
        </div>
      </nav>
      <main className="flex-1">{view === 'home' && <Home setView={setView} />}{view === 'blog' && <Blog />}{view === 'admin' && <Admin />}</main>
      <footer className="py-8 text-center text-sm text-slate-400 bg-white border-t border-slate-100">&copy; 2025 Turp Sağlık Teknolojileri.</footer>
    </div>
  );
}
