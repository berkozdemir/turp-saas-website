// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { createClient } from '@supabase/supabase-js';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Activity, Upload, Image as ImageIcon, Loader2, Calendar, ArrowRight, ShieldCheck, Globe, Edit3, CheckCircle } from 'lucide-react';

// --- SUPABASE AYARLARI ---
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseKey) { console.error("Supabase Key Eksik!"); }
const supabase = createClient(supabaseUrl, supabaseKey);

// --- 1. BİLEŞEN: POST DETAY ---
const PostDetail = ({ post, setView, onEdit }) => {
  if (!post) return null;

  return (
    <div className="max-w-4xl mx-auto px-6 py-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-8">
        <button onClick={() => setView('blog')} className="group flex items-center gap-2 text-slate-500 hover:text-rose-600 transition-all font-heading font-semibold">
          <ArrowRight size={18} className="rotate-180" /> Listeye Dön
        </button>
        
        {/* DÜZENLE BUTONU */}
        <button onClick={() => onEdit(post)} className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold transition-colors">
            <Edit3 size={16}/> Düzenle
        </button>
      </div>

      <article className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        {post.image_url ? (
           <div className="h-[400px] w-full relative">
             <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
             <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
           </div>
        ) : (
            <div className="h-32 bg-slate-100 w-full flex items-center justify-center text-slate-300"><ImageIcon size={48}/></div>
        )}

        <div className="p-8 md:p-12">
            <div className="flex items-center gap-3 text-sm font-bold text-rose-600 mb-4 uppercase tracking-wider">
              <Calendar size={16} />
              {new Date(post.created_at).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <h1 className="font-heading text-3xl md:text-5xl font-extrabold mb-8 text-slate-900 leading-tight">{post.title}</h1>
            <div className="blog-content text-lg text-slate-600 leading-relaxed">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
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
      setPosts(data || []); setLoading(false);
    };
    fetchPosts();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <h2 className="font-heading text-4xl md:text-5xl font-extrabold text-slate-900 mb-16 text-center">{t("nav_blog")}</h2>
      {loading ? <div className="text-center"><Loader2 className="animate-spin inline text-rose-600"/></div> : (
        <div className="grid md:grid-cols-3 gap-8">
          {posts.length === 0 && <div className="col-span-3 text-center py-20 text-slate-500">Henüz yazı yok.</div>}
          {posts.map(post => (
            <div key={post.id} onClick={() => setView({ type: 'detail', post: post })} className="bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer group">
              <div className="h-56 bg-slate-100 relative overflow-hidden">
                 {post.image_url ? <img src={post.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" /> : <div className="flex items-center justify-center h-full text-slate-300"><ImageIcon size={48}/></div>}
              </div>
              <div className="p-8">
                <h3 className="font-heading font-bold text-xl mb-3 line-clamp-2 text-slate-900 group-hover:text-rose-600 transition-colors">{post.title}</h3>
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900 group-hover:translate-x-2 transition-transform">Devamını Oku <ArrowRight size={16} className="text-rose-600"/></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- 3. BİLEŞEN: HOME (Aynı Kaldı) ---
const Home = ({ setView }) => {
  const { t } = useTranslation();
  const features = [{icon:ShieldCheck,title:t("feat_1_title"),desc:t("feat_1_desc")},{icon:Activity,title:t("feat_2_title"),desc:t("feat_2_desc")},{icon:Upload,title:t("feat_3_title"),desc:t("feat_3_desc")},{icon:Calendar,title:t("feat_4_title"),desc:t("feat_4_desc")},{icon:ImageIcon,title:t("feat_5_title"),desc:t("feat_5_desc")},{icon:Loader2,title:t("feat_6_title"),desc:t("feat_6_desc")}];
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <section className="relative pt-32 pb-40 px-6 flex items-center justify-center min-h-[80vh]">
        <div className="absolute inset-0 z-0 bg-slate-950 overflow-hidden">
          <img src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070" className="w-full h-full object-cover opacity-10 blur-sm" /> 
          <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-green-400 px-5 py-2 rounded-full text-sm font-bold mb-10 shadow-xl"><ShieldCheck size={16}/><span>USBS Onaylı</span></div>
          <h1 className="font-heading text-6xl md:text-8xl font-extrabold text-slate-900 mb-8 text-white">{t("hero_title_part1")} <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-indigo-500">{t("hero_title_part2")}</span></h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-16">{t("hero_subtitle")}</p>
          <div className="flex justify-center gap-5"><button onClick={()=>setView('blog')} className="px-10 py-5 bg-rose-600 text-white font-bold rounded-2xl shadow-xl hover:bg-rose-500 transition-all">{t("btn_blog_posts")}</button></div>
        </div>
      </section>
    </div>
  );
};

// --- 4. BİLEŞEN: ADMIN (DÜZENLEME ÖZELLİĞİ EKLENDİ) ---
const Admin = ({ editingPost, setEditingPost, setView }) => {
  const [form, setForm] = useState({ title: '', content: '' });
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Eğer düzenleme modundaysak formu doldur
  useEffect(() => {
    if (editingPost) {
      setForm({ title: editingPost.title, content: editingPost.content });
    } else {
      setForm({ title: '', content: '' });
    }
  }, [editingPost]);

  const handleSubmit = async (e) => {
    e.preventDefault(); setUploading(true);
    try {
      let url = editingPost ? editingPost.image_url : null;
      
      // Yeni resim seçildiyse yükle
      if (image) {
        const name = `${Date.now()}-${image.name.replace(/[^a-zA-Z0-9.]/g, '')}`;
        await supabase.storage.from('blog-images').upload(name, image);
        const { data } = supabase.storage.from('blog-images').getPublicUrl(name);
        url = data.publicUrl;
      }

      if (editingPost) {
        // GÜNCELLEME (UPDATE)
        await supabase.from('posts').update({ title: form.title, content: form.content, image_url: url }).eq('id', editingPost.id);
        alert("Yazı güncellendi!");
        setEditingPost(null); // Düzenleme modundan çık
        setView('blog'); // Bloga dön
      } else {
        // YENİ EKLEME (INSERT)
        await supabase.from('posts').insert([{ title: form.title, content: form.content, image_url: url }]);
        alert("Yazı eklendi!");
        setForm({ title: '', content: '' }); setImage(null);
      }

    } catch (err) { alert("Hata: " + err.message); }
    setUploading(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-200">
        <div className="flex justify-between items-center mb-10">
            <h2 className="font-heading text-3xl font-bold text-slate-900">
                {editingPost ? 'Yazıyı Düzenle' : 'Yeni Yazı Ekle'}
            </h2>
            {editingPost && (
                <button onClick={() => {setEditingPost(null); setForm({title:'',content:''});}} className="text-sm text-rose-600 font-bold hover:underline">
                    İptal Et / Yeni Ekle
                </button>
            )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
             <label className="block text-sm font-bold text-slate-700 mb-3 uppercase">Başlık</label>
             <input className="w-full p-4 border-2 border-slate-200 rounded-xl font-heading font-bold text-lg outline-none focus:border-rose-500" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} required />
          </div>
          <div>
             <label className="block text-sm font-bold text-slate-700 mb-3 uppercase">İçerik (Markdown)</label>
             <textarea className="w-full p-4 border-2 border-slate-200 rounded-xl font-mono text-sm min-h-[300px] outline-none focus:border-rose-500" value={form.content} onChange={e=>setForm({...form, content:e.target.value})} required />
          </div>
          <div>
             <label className="block text-sm font-bold text-slate-700 mb-3 uppercase">Görsel {editingPost && '(Değiştirmek istemiyorsanız boş bırakın)'}</label>
             <input type="file" onChange={e=>setImage(e.target.files[0])} className="block w-full text-sm text-slate-500"/>
          </div>
          <button disabled={uploading} className="w-full bg-slate-900 text-white py-5 rounded-xl font-bold text-lg hover:bg-rose-600 transition-all">
            {uploading ? 'İşleniyor...' : (editingPost ? 'Güncelle' : 'Yayınla')}
          </button>
        </form>
      </div>
    </div>
  );
};

// --- ANA UYGULAMA ---
export default function App() {
  const [view, setView] = useState('home');
  const [editingPost, setEditingPost] = useState(null); // DÜZENLEME DURUMU
  const { t, i18n } = useTranslation(); 
  const languages = [{ code: 'tr', label: 'TR' }, { code: 'en', label: 'EN' }, { code: 'zh', label: 'ZH' }];

  // Düzenleme işlemini başlatan fonksiyon
  const startEdit = (post) => {
    setEditingPost(post);
    setView('admin');
  };

  const renderView = () => {
    if (view === 'home') return <Home setView={setView} />;
    if (view === 'blog') return <Blog setView={setView} />;
    // Admin'e editingPost prop'unu gönderiyoruz
    if (view === 'admin') return <Admin editingPost={editingPost} setEditingPost={setEditingPost} setView={setView} />;
    if (typeof view === 'object' && view.type === 'detail') return <PostDetail post={view.post} setView={setView} onEdit={startEdit} />;
    return <Home setView={setView} />;
  };

  return (
    <div className="font-sans text-slate-900 bg-slate-50 min-h-screen flex flex-col">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-heading font-bold text-2xl flex items-center gap-2 cursor-pointer" onClick={()=>setView('home')}><Activity size={22} className="text-rose-600"/> Turp</div>
          <div className="flex items-center gap-3">
             <div className="flex gap-1 bg-slate-100 p-1 rounded-full">
               <button onClick={()=>{setView('home'); setEditingPost(null);}} className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${view === 'home' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-200'}`}>{t("nav_home")}</button>
               <button onClick={()=>{setView('blog'); setEditingPost(null);}} className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${view === 'blog' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-200'}`}>{t("nav_blog")}</button>
               <button onClick={()=>{setView('admin'); setEditingPost(null);}} className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${view === 'admin' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-200'}`}>{t("nav_admin")}</button>
             </div>
             <div className="flex gap-1 bg-slate-100 p-1 rounded-full">
               {languages.map((lang) => (<button key={lang.code} onClick={() => i18n.changeLanguage(lang.code)} className={`w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center ${i18n.language === lang.code ? 'bg-rose-600 text-white' : 'text-slate-400 hover:bg-slate-200'}`}>{lang.label}</button>))}
             </div>
          </div>
        </div>
      </nav>
      <main className="flex-1">{renderView()}</main>
      <footer className="py-12 text-center bg-white border-t border-slate-200 text-slate-500 text-sm">&copy; 2025 Turp Sağlık Teknolojileri.</footer>
    </div>
  );
}
