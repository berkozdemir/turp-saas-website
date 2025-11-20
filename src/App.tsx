// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { createClient } from '@supabase/supabase-js';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Activity, Upload, Image as ImageIcon, Loader2, Calendar, ArrowRight, ShieldCheck, Globe, X, Menu } from 'lucide-react';

// --- SUPABASE AYARLARI ---
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Ortam Değişkenleri Tanımlı Değil! Lütfen Vercel'e ekleyin.");
}
const supabase = createClient(supabaseUrl, supabaseKey);

// --- 1. BİLEŞEN: POST DETAY (MARKDOWN İLE) ---
const PostDetail = ({ post, setView }) => {
  if (!post) return null;

  return (
    <div className="max-w-4xl mx-auto px-6 py-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Geri Dön Butonu */}
      <button 
        onClick={() => setView('blog')} 
        className="group flex items-center gap-2 text-slate-500 hover:text-rose-600 mb-8 transition-all font-heading font-semibold"
      >
        <div className="bg-white p-2 rounded-full shadow-sm border border-slate-200 group-hover:border-rose-200 transition-colors">
           <ArrowRight size={18} className="rotate-180" />
        </div>
        Listeye Dön
      </button>

      <article className="bg-white rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        {/* Kapak Görseli */}
        {post.image_url ? (
           <div className="h-[400px] w-full relative">
             <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
             <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
           </div>
        ) : (
            <div className="h-32 bg-slate-100 w-full flex items-center justify-center text-slate-300">
                <ImageIcon size={48}/>
            </div>
        )}

        <div className="p-8 md:p-12">
            {/* Başlık ve Tarih */}
            <div className="flex items-center gap-3 text-sm font-bold text-rose-600 mb-4 uppercase tracking-wider">
              <Calendar size={16} />
              {new Date(post.created_at).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            
            <h1 className="font-heading text-3xl md:text-5xl font-extrabold mb-8 text-slate-900 leading-tight">
                {post.title}
            </h1>

            {/* Markdown İçeriği (index.css'teki .blog-content sınıfını kullanır) */}
            <div className="blog-content text-lg text-slate-600 leading-relaxed">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {post.content}
              </ReactMarkdown>
            </div>
        </div>
      </article>
    </div>
  );
};

// --- 2. BİLEŞEN: BLOG LİSTESİ ---
const Blog = ({ setView }) => {
  const { t } = useTranslation();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
      setPosts(data || []); 
      setLoading(false);
    };
    fetchPosts();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <h2 className="font-heading text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">{t("nav_blog")}</h2>
        <p className="text-slate-500 text-lg">Sektörden güncel içgörüler ve haberler.</p>
      </div>
      
      {loading ? ( 
        <div className="flex justify-center py-20">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="animate-spin text-rose-600" size={48}/>
                <span className="text-slate-400 font-medium">Yükleniyor...</span>
            </div>
        </div> 
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          {posts.length === 0 && (
            <div className="col-span-3 text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                <div className="inline-block p-4 bg-slate-50 rounded-full mb-4"><Activity size={32} className="text-slate-400"/></div>
                <p className="text-slate-500 font-medium">Henüz yazı yok. Yönetim panelinden ekleyebilirsiniz.</p>
            </div>
          )}
          
          {posts.map(post => (
            <div 
              key={post.id} 
              onClick={() => setView({ type: 'detail', post: post })} 
              className="bg-white rounded-2xl overflow-hidden shadow-lg shadow-slate-200/50 border border-slate-100 hover:shadow-2xl hover:shadow-rose-900/10 hover:-translate-y-2 transition-all duration-300 cursor-pointer group"
            >
              <div className="h-56 bg-slate-100 relative overflow-hidden">
                 {post.image_url ? (
                    <img src={post.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" alt={post.title} />
                 ) : (
                    <div className="flex items-center justify-center h-full text-slate-300"><ImageIcon size={48}/></div>
                 )}
                 <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
              </div>
              
              <div className="p-8">
                <div className="text-xs font-bold text-rose-600 mb-3 uppercase tracking-wide">
                    {new Date(post.created_at).toLocaleDateString('tr-TR')}
                </div>
                <h3 className="font-heading font-bold text-xl mb-3 line-clamp-2 text-slate-900 group-hover:text-rose-600 transition-colors leading-tight">
                    {post.title}
                </h3>
                <p className="text-slate-500 text-sm line-clamp-3 font-sans mb-6 leading-relaxed">
                    {post.content}
                </p> 
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900 group-hover:translate-x-2 transition-transform duration-300">
                    Devamını Oku <ArrowRight size={16} className="text-rose-600"/>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- 3. BİLEŞEN: ANA SAYFA ---
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
      
      {/* HERO */}
      <section className="relative pt-32 pb-40 px-6 flex items-center justify-center min-h-[80vh]">
        <div className="absolute inset-0 z-0 bg-slate-950 overflow-hidden">
          <img src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070&auto=format&fit=crop" alt="Medical Research" className="w-full h-full object-cover opacity-10 blur-sm scale-105 animate-pulse-slow" /> 
          <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-green-400 px-5 py-2 rounded-full text-sm font-bold mb-10 shadow-xl animate-fade-in-up">
            <ShieldCheck size={16}/>
            <span>USBS Onaylı & e-Nabız Entegreli</span>
          </div>
          
          <h1 className="font-heading text-6xl md:text-8xl font-extrabold text-slate-900 mb-8 leading-[0.9] drop-shadow-2xl tracking-tight">
             <span className="text-white">{t("hero_title_part1")}</span> <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-purple-500 to-indigo-500">
              {t("hero_title_part2")}
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto mb-16 leading-relaxed font-sans font-light">
            {t("hero_subtitle")}
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-5">
            <button onClick={() => setView('blog')} className="flex items-center justify-center gap-2 px-10 py-5 bg-rose-600 text-white font-bold rounded-2xl shadow-xl shadow-rose-900/30 hover:bg-rose-500 hover:-translate-y-1 transition-all transform duration-300">
              {t("btn_blog_posts")} <ArrowRight size={20} />
            </button>
            <button className="flex items-center justify-center gap-2 px-10 py-5 bg-white/10 backdrop-blur text-white border border-white/20 font-bold rounded-2xl shadow-lg hover:bg-white/20 hover:-translate-y-1 transition-all duration-300">
              {t("btn_demo")}
            </button>
          </div>
        </div>
      </section>

      {/* PARTNERLER */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-xs font-extrabold text-slate-400 uppercase tracking-[0.2em] mb-10">{t("partner_title")}</p>
          <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-40 hover:opacity-100 transition-opacity duration-500">
            <h3 className="text-3xl font-heading font-bold text-slate-900">PharmaCo</h3>
            <h3 className="text-3xl font-heading font-bold text-slate-900">BioTech</h3>
            <h3 className="text-3xl font-heading font-bold text-slate-900">MED-DATA</h3>
          </div>
        </div>
      </section>

      {/* ÖZELLİKLER */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="font-heading text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">{t("section_title")}</h2>
          <p className="text-xl text-slate-500 font-sans font-light">{t("section_subtitle")}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((item, i) => (
            <div key={i} className="bg-white p-10 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-rose-900/10 hover:border-rose-100 transition-all duration-500 group hover:-translate-y-2">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-900 mb-8 group-hover:bg-rose-600 group-hover:text-white transition-colors duration-500 shadow-sm">
                  {React.createElement(item.icon, { size: 32, strokeWidth: 1.5 })}
                </div>
                <h3 className="font-heading text-2xl font-bold text-slate-900 mb-4">{item.title}</h3>
                <p className="text-slate-500 text-base leading-relaxed font-sans">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

// --- 4. BİLEŞEN: ADMIN PANELİ ---
const Admin = () => {
  const [form, setForm] = useState({ title: '', content: '' });
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setUploading(true);
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
      alert("Yazı başarıyla eklendi!"); 
      setForm({ title: '', content: '' }); 
      setImage(null);
    } catch (err) { 
      alert("Hata: " + err.message); 
    }
    setUploading(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-200">
        <div className="flex items-center gap-4 mb-10 pb-6 border-b border-slate-100">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center">
                <Upload size={24}/>
            </div>
            <div>
                <h2 className="font-heading text-3xl font-bold text-slate-900">İçerik Yönetimi</h2>
                <p className="text-slate-500">Yeni blog yazısı veya haber ekleyin.</p>
            </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
             <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">Yazı Başlığı</label>
             <input className="w-full p-4 border-2 border-slate-200 rounded-xl focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 outline-none transition-all font-heading font-bold text-lg" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} required placeholder="Örn: RWE Çalışmalarında Yeni Dönem" />
          </div>
          <div>
             <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">
                İçerik (Markdown Destekli)
             </label>
             <div className="relative">
                <textarea className="w-full p-4 border-2 border-slate-200 rounded-xl focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 outline-none transition-all font-mono text-sm leading-relaxed min-h-[300px]" value={form.content} onChange={e=>setForm({...form, content:e.target.value})} required placeholder="# Başlık&#10;&#10;Buraya içeriği yazın. **Kalın** yazı veya liste kullanabilirsiniz." />
                <div className="absolute top-4 right-4 text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded">Markdown</div>
             </div>
          </div>
          <div>
             <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">Kapak Görseli</label>
             <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 hover:border-rose-400 transition-all cursor-pointer relative group">
                <input type="file" onChange={e=>setImage(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"/>
                <div className="flex flex-col items-center gap-2">
                    <ImageIcon size={32} className="text-slate-400 group-hover:text-rose-500 transition-colors"/>
                    <span className="text-slate-500 font-medium group-hover:text-slate-700">{image ? image.name : "Dosya seçmek için tıklayın"}</span>
                </div>
             </div>
          </div>
          <button disabled={uploading} className="w-full bg-slate-900 text-white py-5 rounded-xl font-bold text-lg hover:bg-rose-600 hover:shadow-lg hover:shadow-rose-600/30 transition-all transform active:scale-[0.98]">
            {uploading ? 'Yükleniyor...' : 'Yayınla'}
          </button>
        </form>
      </div>
    </div>
  );
};

// --- ANA UYGULAMA (ROUTING & LAYOUT) ---
export default function App() {
  const [view, setView] = useState('home');
  const { t, i18n } = useTranslation(); 
  const languages = [{ code: 'tr', label: 'TR' }, { code: 'en', label: 'EN' }, { code: 'zh', label: 'ZH' }];
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const changeLanguage = (lng) => { i18n.changeLanguage(lng); };

  const renderView = () => {
    if (view === 'home') return <Home setView={setView} />;
    if (view === 'blog') return <Blog setView={setView} />;
    if (view === 'admin') return <Admin />;
    if (typeof view === 'object' && view.type === 'detail') return <PostDetail post={view.post} setView={setView} />;
    return <Home setView={setView} />;
  };

  return (
    <div className="font-sans text-slate-900 bg-slate-50 min-h-screen flex flex-col selection:bg-rose-200 selection:text-rose-900">
      {/* NAVBAR */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-md py-3' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          
          <div className="font-heading font-bold text-2xl flex items-center gap-2 cursor-pointer group" onClick={()=>setView('home')}>
            <div className="w-10 h-10 bg-rose-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-rose-600/30 group-hover:rotate-3 transition-transform">
                <Activity size={22}/>
            </div>
            <span className={`tracking-tight ${view === 'home' && !isScrolled ? 'text-slate-900' : 'text-slate-900'}`}>Turp</span>
          </div>
          
          <div className="flex items-center gap-3 md:gap-6">
            {/* Menü Butonları */}
            <div className="flex items-center bg-white/80 backdrop-blur border border-slate-200 p-1.5 rounded-full shadow-sm">
              <button onClick={()=>setView('home')} className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${view === 'home' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}>{t("nav_home")}</button>
              <button onClick={()=>setView('blog')} className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${view === 'blog' || view?.type === 'detail' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}>{t("nav_blog")}</button>
              <button onClick={()=>setView('admin')} className={`hidden md:block px-4 py-2 rounded-full text-sm font-bold transition-all ${view === 'admin' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}>{t("nav_admin")}</button>
            </div>
            
            {/* Dil Seçimi */}
            <div className="flex items-center gap-1 bg-white/80 backdrop-blur border border-slate-200 p-1.5 rounded-full shadow-sm">
              <Globe size={16} className="text-slate-400 ml-2 hidden md:block" />
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={`w-8 h-8 rounded-full text-xs font-bold transition-all flex items-center justify-center ${i18n.language === lang.code ? 'bg-rose-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100'}`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        {renderView()}
      </main>

      <footer className="py-12 text-center bg-white border-t border-slate-200">
        <div className="flex items-center justify-center gap-2 font-heading font-bold text-xl text-slate-900 mb-4">
            <Activity size={20} className="text-rose-600"/> Turp
        </div>
        <p className="text-slate-500 text-sm">&copy; 2025 Turp Sağlık Teknolojileri. Tüm hakları saklıdır.</p>
      </footer>
    </div>
  );
}
