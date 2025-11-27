import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';
import { OptimizedImage } from '../components/OptimizedImage';
import { Loader2, ImageIcon, ArrowRight } from 'lucide-react';

// NEW: Blog Yazısı (Post) için tip tanımı eklendi
interface PostType {
  id: number;
  created_at: string;
  title: string;
  content: string;
  image_url: string | null;
}

// NEW: Bileşen prop'ları için tip tanımı eklendi
interface BlogProps {
  // setView, ya sadece string bir sayfa adı ya da detay sayfasına geçiş için PostType objesi alabilir
  setView: (view: string | { type: 'detail', post: PostType }) => void;
}

export const Blog = ({ setView }: BlogProps) => { // Prop tipi uygulandı
  const { t } = useTranslation();
  // State tipi PostType[] olarak açıkça belirtildi
  const [posts, setPosts] = useState<PostType[]>([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
      // Gelen veri PostType[] tipine dönüştürülerek state'e atandı (Hata 2 çözüldü)
      setPosts((data as PostType[]) || []); 
      setLoading(false);
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
            // post artık PostType tipinde olduğu için id, title, image_url güvenle erişilebilir.
            <div key={post.id} onClick={() => setView({ type: 'detail', post: post })} className="bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer group">
              <div className="h-56 bg-slate-100 relative overflow-hidden">
                 {/* OptimizedImage'a eksik olan 'alt' ve 'height' prop'ları eklendi (Hata 5 çözüldü) */}
                 {post.image_url ? <OptimizedImage src={post.image_url} alt={post.title} width={400} height={224} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" /> : <div className="flex items-center justify-center h-full text-slate-300"><ImageIcon size={48}/></div>}
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