import React from "react";
import { OptimizedImage } from "../components/OptimizedImage";
import { ArrowRight, Calendar, Edit3, ImageIcon } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useEffect } from "react";
import { trackBlogView } from "../lib/analytics";

interface PostDetailProps {
  post: {
    title: string;
    content: string;
    created_at: string;
    image_url?: string | null;
    [key: string]: any;
  } | null;
  setView: (view: any) => void;
  onEdit: (post: any) => void;
}

export const PostDetail: React.FC<PostDetailProps> = ({ post, setView, onEdit }) => {
  if (!post) return null;

  // Track blog view
  useEffect(() => {
    trackBlogView(post.title, post.id);
  }, [post.id, post.title]);

  return (
    <div className="max-w-4xl mx-auto px-6 py-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={() => setView("blog")}
          className="group flex items-center gap-2 text-slate-500 hover:text-rose-600 transition-all font-heading font-semibold"
        >
          <ArrowRight size={18} className="rotate-180" /> Listeye Dön
        </button>
        <button
          onClick={() => onEdit(post)}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold transition-colors"
        >
          <Edit3 size={16} /> Düzenle
        </button>
      </div>

      <article className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        {post.image_url ? (
          <div className="h-[400px] w-full relative">
            <OptimizedImage
              src={post.image_url}
              alt={post.title}
              width={1200}
              height={400}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
          </div>
        ) : (
          <div className="h-32 bg-slate-100 w-full flex items-center justify-center text-slate-300">
            <ImageIcon size={48} />
          </div>
        )}

        <div className="p-8 md:p-12">
          <div className="flex items-center gap-3 text-sm font-bold text-rose-600 mb-4 uppercase tracking-wider">
            <Calendar size={16} />
            {new Date(post.created_at).toLocaleDateString("tr-TR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>

          <h1 className="font-heading text-3xl md:text-5xl font-extrabold mb-8 text-slate-900 leading-tight">
            {post.title}
          </h1>

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
