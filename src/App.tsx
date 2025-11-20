// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { createClient } from '@supabase/supabase-js';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Activity, Upload, Image as ImageIcon, Loader2, Calendar, ArrowRight, ShieldCheck, Globe, Edit3, Lock, LogOut, Mail, Key } from 'lucide-react';

// --- SUPABASE AYARLARI ---
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseKey) { console.error("Supabase Key Eksik!"); }
const supabase = createClient(supabaseUrl, supabaseKey);

// --- 1. BİLEŞEN: GİRİŞ YAP (LOGIN) ---
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('login');
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleLogin = async (e) => {
    e.preventDefault(); setLoading(true); setMessage({ type: '', text: '' });
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setMessage({ type: 'error', text: 'Giriş başarısız: ' + error.message }); } 
    setLoading(false);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault(); setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin });
    if (error) { setMessage({ type: 'error', text: error.message }); } 
    else { setMessage({ type: 'success', text: 'Şifre sıfırlama bağlantısı gönderildi.' }); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6 py-20">
      <div className="bg-white p-10 rounded-3xl shadow-2xl border border-slate-100 w-full max-w-md animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-rose-600 rounded-xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg"><Lock size={24} /></div>
          <h2 className="font-heading text-3xl font-bold text-slate-900">{mode === 'login' ? 'Yönetici Girişi' : 'Şifre Sıfırlama'}</h2>
        </div>
        {message.text && <div className={`p-4 rounded-xl mb-6 text-sm font-bold text-center ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>{message.text}</div>}
        <form onSubmit={mode === 'login' ? handleLogin : handleResetPassword} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">E-posta</label>
            <div className="relative"><Mail className="absolute left-4 top-3.5 text-slate-400" size={20}/><input type="email" className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-rose-500 outline-none font-medium" value={email} onChange={(e) => setEmail(e.target.value)} required/></div>
          </div>
          {mode === 'login' && (
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Şifre</label>
              <div className="relative"><Key className="absolute left-4 top-3.5 text-slate-400" size={20}/><input type="password" className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-rose-500 outline-none font-medium" value={password} onChange={(e) => setPassword(e.target.value)} required/></div>
            </div>
          )}
          <button disabled={loading} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-rose-600 transition-all">{loading ? 'İşleniyor...' : (mode === 'login' ? 'Giriş Yap' : 'Bağlantı Gönder')}</button>
        </form>
        <div className="mt-6 text-center"><button onClick={() => {setMode(mode === 'login' ? 'reset' : 'login'); setMessage({type:'',text:''});}} className="text-sm text-slate-500 hover:text-rose-600 font-medium">{mode === 'login' ? 'Şifremi Unuttum' : 'Giriş Ekranına Dön'}</button></div>
      </div>
    </div>
  );
};

// --- 2. BİLEŞEN: POST DETAY ---
const PostDetail = ({ post, setView, onEdit }) => {
  if (!post) return null;
  return (
    <div className="max-w-4xl mx-auto px-6 py-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-8">
        <button onClick={() => setView('blog')} className="group flex items-center gap-2 text-slate-500 hover:text-rose-600 transition-all font-heading font-semibold"><ArrowRight size={18} className="rotate-180" /> Listeye Dön</button>
        <button onClick={() => onEdit(post)} className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold transition-colors"><Edit3 size={16}/> Düzenle</button>
      </div>
      <article className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        {post.image_url ? (<div className="h-[400px] w-full relative"><img src={post.image_url} alt={post.title} className="w-full h-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div></div>) : (<div className="h-32 bg-slate-100 w-full flex items-center justify-center text-slate-300"><ImageIcon size={48}/></div>)}
        <div className="p-8 md:p-12">
            <div className="flex items-center gap-3 text-sm font-bold text-rose-600 mb-4 uppercase tracking-wider"><Calendar size={16} />{new Date(post.created_at).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            <h1 className="font-heading text-3xl md:text-5xl font-extrabold mb-8 text-slate-900 leading-tight">{post.title}</h1>
            <div className="blog-content text-lg text-slate-600 leading-relaxed"><ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown></div>
        </div>
      </article>
    </div>
  );
};

// --- 3. BİLEŞEN: BLOG LİSTESİ ---
const Blog = ({ setView }) => {
  const { t } = useTranslation();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchPosts = async () => { const { data } = await supabase.from('posts').select('*').order('created_at', { ascending: false }); setPosts(data || []); setLoading(false); }; fetchPosts();
  }, []);
  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <h2 className="font-heading text-4xl md:text-5xl font-extrabold text-slate-900 mb-16 text-center">{t("nav_blog")}</h2>
      {loading ? <div className="text-center"><Loader2 className="animate-spin inline text-rose-600"/></div> : (
        <div className="grid md:grid-cols-3 gap-8">
          {posts.length === 0 && <div className="col-span-3 text-center py-20 text-slate-500">Henüz yazı yok.</div>}
          {posts.map(post => (
            <div key={post.id} onClick={() => setView({ type: 'detail', post: post })} className="bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer group">
              <div className="h-56 bg-slate-100 relative overflow-hidden">{post.image_url ? <img src={post.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" /> : <div className="flex items-center justify-center h-full text-slate-300"><ImageIcon size={48}/></div>}</div>
              <div className="p-8"><h3 className="font-heading font-bold text-xl mb-3 line-clamp-2 text-slate-900 group-hover:text-rose-600 transition-colors">{post.title}</h3><div className="flex items-center gap-2 text-sm font-bold text-slate-900 group-hover:translate-x-2 transition-transform">Devamını Oku <ArrowRight size={16} className="text-rose-600"/></div></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- 4. BİLEŞEN: HOME ---
const Home = ({ setView }) => {
  const { t } = useTranslation();
  const features = [{icon:ShieldCheck,title:t("feat_1_title"),desc:t("feat_1_desc")},{icon:Activity,title:t("feat_2_title"),desc:t("feat_2_desc")},{icon:Upload,title:t("feat_3_title"),desc:t("feat_3_desc")},{icon:Calendar,title:t("feat_4_title"),desc:t("feat_4_desc")},{icon:ImageIcon,title:t("feat_5_title"),desc:t("feat_5_desc")},{icon:Loader2,title:t("feat_6_title"),desc:t("feat_6_desc")}];
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <section className="relative pt-32 pb-40 px-6 flex items-center justify-center min-h-[80vh]">
        <div className="absolute inset-0 z-0 bg-slate-950 overflow-hidden"><img src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070" className="w-full h-full object-cover opacity-10 blur-sm" /><div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-transparent"></div></div>
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-green-400 px-5 py-2 rounded-full text-sm font-bold mb-10 shadow-xl"><ShieldCheck size={16}/><span>USBS Onaylı</span></div>
          <h1 className="font-heading text-6xl md:text-8xl font-extrabold text-slate-900 mb-8 text-white">{t("hero_title_part1")} <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-indigo-500">{t("hero_title_part2")}</span></h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-16">{t("hero_subtitle")}</p>
          <div className="flex justify-center gap-5"><button onClick={()=>setView('blog')} className="px-10 py-5 bg-rose-600 text-white font-bold rounded-2xl shadow-xl hover:bg-rose-500 transition-all">{t("btn_blog_posts")}</button></div>
        </div>
      </section>
      <section className="py-16 bg-white border-y border-slate-200"><div className="max-w-7xl mx-auto px-6 text-center"><p className="text-xs font-extrabold text-slate-400 uppercase tracking-[0.2em] mb-10">{t("partner_title")}</p><div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-40 hover:opacity-100 transition-opacity duration-500"><h3 className="text-3xl font-heading font-bold text-slate-900">PharmaCo</h3><h3 className="text-3xl font-heading font-bold text-slate-900">BioTech</h3><h3 className="text-3xl font-heading font-bold text-slate-900">MED-DATA</h3></div></div></section>
      <section className="py-32 px-6 max-w-7xl mx-auto"><div className="text-center max-w-3xl mx-auto mb-20"><h2 className="font-heading text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">{t("section_title")}</h2><p className="text-xl text-slate-500">{t("section_subtitle")}</p></div><div className="grid md:grid-cols-3 gap-8">{features.map((item, i) => (<div key={i} className="bg-white p-10 rounded-3xl border border-slate-100 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all group"><div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-900 mb-8 group-hover:bg-rose-600 group-hover:text-white transition-colors shadow-sm">{React.createElement(item.icon, { size: 32 })}</div><h3 className="font-heading text-2xl font-bold text-slate-900 mb-4">{item.title}</h3><p className="text-slate-500 text-base leading-relaxed">{item.desc}</p></div>))}</div></section>
    </div>
  );
};

// --- 5. BİLEŞEN: ADMIN ---
const Admin = ({ editingPost, setEditingPost, setView, handleLogout }) => {
  const [form, setForm] = useState({ title: '', content: '' });
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (editingPost) { setForm({ title: editingPost.title, content: editingPost.content }); } 
    else { setForm({ title: '', content: '' }); }
  }, [editingPost]);

  const handleSubmit = async (e) => {
    e.preventDefault(); setUploading(true);
    try {
      let url = editingPost ? editingPost.image_url : null;
      
      if (image) {
        // Dosya adını güvenli hale getiriyoruz (Tarih + Uzantı)
        const fileExt = image.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        
        // Yükleme işlemini yap ve hatayı kontrol et
        const { error: uploadError } = await supabase.storage.from('blog-images').upload(fileName, image);
        if (uploadError) throw new Error("Resim Yüklenemedi: " + uploadError.message);

        // Public URL al
        const { data } = supabase.storage.from('blog-images').getPublicUrl(fileName);
        url = data.publicUrl;
      }

      if (editingPost) {
        const { error } = await supabase.from('posts').update({ title: form.title, content: form.content, image_url: url }).eq('id', editingPost.id);
        if(error) throw error;
        alert("Yazı başarıyla güncellendi!"); setEditingPost(null); setView('blog');
      } else {
        const { error } = await supabase.from('posts').insert([{ title: form.title, content: form.content, image_url: url }]);
        if(error) throw error;
        alert("Yazı başarıyla eklendi!"); setForm({ title: '', content: '' }); setImage(null);
      }
    } catch (err) { alert("Hata: " + err.message); }
    setUploading(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <div className="flex justify-between items-center mb-8">
         <h2 className="font-heading text-3xl font-bold text-slate-900">Yönetim Paneli</h2>
         <button onClick={handleLogout} className="flex items-center gap-2 text-sm font-bold text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors"><LogOut size={16}/> Çıkış Yap</button>
      </div>
      <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-200">
        <div className="flex justify-between items-center mb-10">
            <div><h2 className="font-heading text-2xl font-bold text-slate-900">{editingPost ? 'Yazıyı Düzenle' : 'Yeni Yazı Ekle'}</h2><p className="text-slate-500">Markdown formatında içerik girebilirsiniz.</p></div>
            {editingPost && <button onClick={() => {setEditingPost(null); setForm({title:'',content:''});}} className="text-sm text-rose-600 font-bold hover:underline">İptal Et</button>}
        </div>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div><label className="block text-sm font-bold text-slate-700 mb-3 uppercase">Başlık</label><input className="w-full p-4 border-2 border-slate-200 rounded-xl font-heading font-bold text-lg outline-none focus:border-rose-500" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} required /></div>
          <div><label className="block text-sm font-bold text-slate-700 mb-3 uppercase">İçerik (Markdown)</label><textarea className="w-full p-4 border-2 border-slate-200 rounded-xl font-mono text-sm min-h-[300px] outline-none focus:border-rose-500" value={form.content} onChange={e=>setForm({...form, content:e.target.value})} required /></div>
          <div>
              <label className="block text-sm font-bold text-slate-700 mb-3 uppercase">Görsel</label>
              <div className="relative border-2 border-dashed border-slate-300 rounded-xl p-6 hover:bg-slate-50 transition-colors">
                <input type="file" onChange={e=>setImage(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"/>
                <div className="flex flex-col items-center text-slate-400"><Upload size={24} className="mb-2"/><span className="text-sm font-medium">{image ? image.name : "Dosya seçmek için tıklayın"}</span></div>
              </div>
          </div>
          <button disabled={uploading} className="w-full bg-slate-900 text-white py-5 rounded-xl font-bold text-lg hover:bg-rose-600 transition-all">{uploading ? 'İşleniyor...' : (editingPost ? 'Güncelle' : 'Yayınla')}</button>
        </form>
      </div>
    </div>
  );
};

// --- ANA UYGULAMA ---
export default function App() {
  const [view, setView] = useState('home');
  const [editingPost, setEditingPost] = useState(null);
  const [session, setSession] = useState(null);
  const { t, i18n } = useTranslation(); 
  const languages = [{ code: 'tr', label: 'TR' }, { code: 'en', label: 'EN' }, { code: 'zh', label: 'ZH' }];
  const [isScrolled, setIsScrolled] = useState(false);

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
    if (view === 'blog') return <Blog setView={setView} />;
    if (view === 'admin') return session ? <Admin editingPost={editingPost} setEditingPost={setEditingPost} setView={setView} handleLogout={handleLogout} /> : <Login />;
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
              <button onClick={()=>setView('blog')} className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${view === 'blog' || view?.type === 'detail' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}>{t("nav_blog")}</button>
              <button onClick={()=>setView('admin')} className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${view === 'admin' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}>{session ? <Lock size={14} className="text-green-400"/> : <Lock size={14}/>} {t("nav_admin")}</button>
            </div>
            <div className="flex items-center gap-1 bg-white/80 backdrop-blur border border-slate-200 p-1.5 rounded-full shadow-sm"><Globe size={16} className="text-slate-400 ml-2 hidden md:block" />{languages.map((lang) => (<button key={lang.code} onClick={() => i18n.changeLanguage(lang.code)} className={`w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center ${i18n.language === lang.code ? 'bg-rose-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-200'}`}>{lang.label}</button>))}</div>
          </div>
        </div>
      </nav>
      <main className="flex-1">{renderView()}</main>
      <footer className="py-12 text-center bg-white border-t border-slate-200"><div className="flex items-center justify-center gap-2 font-heading font-bold text-xl text-slate-900 mb-4"><Activity size={20} className="text-rose-600"/> Turp</div><p className="text-slate-500 text-sm">&copy; 2025 Turp Sağlık Teknolojileri.</p></footer>
    </div>
  );
}
