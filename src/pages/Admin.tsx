import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { LogOut, Upload, Loader2 } from 'lucide-react';

export const Admin = ({ editingPost, setEditingPost, setView, handleLogout }) => {
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
        const fileExt = image.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('blog-images').upload(fileName, image);
        if (uploadError) throw new Error("Resim Yüklenemedi: " + uploadError.message);
        const { data } = supabase.storage.from('blog-images').getPublicUrl(fileName);
        url = data.publicUrl;
      }
      if (editingPost) {
        await supabase.from('posts').update({ title: form.title, content: form.content, image_url: url }).eq('id', editingPost.id);
        alert("Yazı güncellendi!"); setEditingPost(null); setView('blog');
      } else {
        await supabase.from('posts').insert([{ title: form.title, content: form.content, image_url: url }]);
        alert("Yazı eklendi!"); setForm({ title: '', content: '' }); setImage(null);
      }
    } catch (err) { alert("Hata: " + err.message); }
    setUploading(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <div className="flex justify-between items-center mb-8"><h2 className="font-heading text-3xl font-bold text-slate-900">Yönetim Paneli</h2><button onClick={handleLogout} className="flex items-center gap-2 text-sm font-bold text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors"><LogOut size={16}/> Çıkış Yap</button></div>
      <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-200">
        <div className="flex justify-between items-center mb-10"><div><h2 className="font-heading text-2xl font-bold text-slate-900">{editingPost ? 'Yazıyı Düzenle' : 'Yeni Yazı Ekle'}</h2><p className="text-slate-500">Markdown formatında içerik girebilirsiniz.</p></div>{editingPost && <button onClick={() => {setEditingPost(null); setForm({title:'',content:''});}} className="text-sm text-rose-600 font-bold hover:underline">İptal Et</button>}</div>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div><label className="block text-sm font-bold text-slate-700 mb-3 uppercase">Başlık</label><input className="w-full p-4 border-2 border-slate-200 rounded-xl font-heading font-bold text-lg outline-none focus:border-rose-500" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} required /></div>
          <div><label className="block text-sm font-bold text-slate-700 mb-3 uppercase">İçerik (Markdown)</label><textarea className="w-full p-4 border-2 border-slate-200 rounded-xl font-mono text-sm min-h-[300px] outline-none focus:border-rose-500" value={form.content} onChange={e=>setForm({...form, content:e.target.value})} required /></div>
          <div><label className="block text-sm font-bold text-slate-700 mb-3 uppercase">Görsel</label><div className="relative border-2 border-dashed border-slate-300 rounded-xl p-6 hover:bg-slate-50 transition-colors"><input type="file" onChange={e=>setImage(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"/><div className="flex flex-col items-center text-slate-400"><Upload size={24} className="mb-2"/><span className="text-sm font-medium">{image ? image.name : "Dosya seçmek için tıklayın"}</span></div></div></div>
          <button disabled={uploading} className="w-full bg-slate-900 text-white py-5 rounded-xl font-bold text-lg hover:bg-rose-600 transition-all">{uploading ? 'İşleniyor...' : (editingPost ? 'Güncelle' : 'Yayınla')}</button>
        </form>
      </div>
    </div>
  );
};
