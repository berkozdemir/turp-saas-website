import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchBlogPosts } from '../lib/contentApi';
import type { BlogPost } from '../types/content';
import { OptimizedImage } from '../components/OptimizedImage';
import { Loader2, ImageIcon, ArrowRight } from 'lucide-react';

interface BlogProps {
  setView: (view: string | { type: 'detail', post: BlogPost }) => void;
}

export const Blog = ({ setView }: BlogProps) => {
  const { t, i18n } = useTranslation();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  // Dil değiştiğinde veya bileşen yüklendiğinde veriyi çek
  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      try {
        // Mevcut dili al (örn: "tr", "en")
        const currentLang = (i18n.language?.split('-')[0] || 'tr') as any;
        const data = await fetchBlogPosts(currentLang);
        setPosts(data);
      } catch (err) {
        console.error("Blog yüklenirken hata:", err);
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, [i18n.language]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <h2 className="font-heading text-4xl md:text-5xl font-extrabold text-slate-900 mb-16 text-center">{t("nav_blog")}</h2>
      {loading ? <div className="text-center"><Loader2 className="animate-spin inline text-rose-600" /></div> : (
        <div className="grid md:grid-cols-3 gap-8">
          {posts.length === 0 && <div className="col-span-3 text-center py-20 text-slate-500">{t("blog_no_posts")}</div>}
          {posts.map(post => (
            <div key={post.id} onClick={() => setView({ type: 'detail', post: post })} className="bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer group">
              <div className="h-56 bg-slate-100 relative overflow-hidden">
                {post.image_url ? <OptimizedImage src={post.image_url} alt={post.title} width={400} height={224} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" /> : <div className="flex items-center justify-center h-full text-slate-300"><ImageIcon size={48} /></div>}
              </div>
              <div className="p-8">
                <h3 className="font-heading font-bold text-xl mb-3 line-clamp-2 text-slate-900 group-hover:text-rose-600 transition-colors">{post.title}</h3>
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900 group-hover:translate-x-2 transition-transform">{t("blog_read_more")} <ArrowRight size={16} className="text-rose-600" /></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};