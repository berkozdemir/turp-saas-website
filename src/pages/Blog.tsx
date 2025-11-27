// src/pages/Blog.tsx
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Calendar, ArrowRight, ImageIcon } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { fetchBlogPosts, normalizeLang } from "../lib/contentApi";
import type { BlogPost } from "../types/content";
import { OptimizedImage } from "../components/OptimizedImage";

interface BlogProps {
  // App.tsx içinden geliyor
  // any bırakıyorum ki union type ile tekrar kavga çıkmasın
  setView: (view: any) => void;
}

export const Blog: React.FC<BlogProps> = ({ setView }) => {
  const { t, i18n } = useTranslation();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const lang = normalizeLang(i18n.language);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchBlogPosts(lang);
        setPosts(data);
      } catch (err: any) {
        setError(err?.message || "Blog verisi alınırken hata oluştu.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [lang]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-rose-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500 text-sm font-medium">
            {t("blog_loading") || "Blog yükleniyor..."}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-slate-50 p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-red-100 p-6 text-center">
          <p className="text-red-600 font-bold mb-2">
            {t("blog_error_title") || "Bir hata oluştu"}
          </p>
          <p className="text-slate-500 text-sm mb-4">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <section className="bg-slate-50 py-16 md:py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-bold tracking-widest uppercase">
              {t("blog_badge") || "GÜNCEL İÇERİK"}
            </div>
            <h1 className="mt-4 font-heading text-3xl md:text-4xl font-extrabold text-slate-900">
              {t("blog_title") || "Blog & Haberler"}
            </h1>
            <p className="mt-3 text-slate-500 max-w-xl">
              {t("blog_desc") ||
                "Turp'un klinik araştırmalardaki kullanım senaryoları, yenilikler ve saha içgörüleri."}
            </p>
          </div>
        </div>

        {posts.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center text-slate-500">
            {t("blog_empty") ||
              "Henüz yayınlanmış bir içerik bulunmuyor. Yakında yeni yazılar eklenecek."}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {posts.map((post) => (
              <article
                key={post.id + post.lang}
                className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden flex flex-col hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => setView({ type: "detail", post })}
              >
                {/* Görsel */}
                {post.image_url ? (
                  <div className="h-48 w-full relative">
                    <OptimizedImage
                      src={post.image_url}
                      alt={post.title}
                      width={800}
                      height={320}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-32 bg-slate-100 w-full flex items-center justify-center text-slate-300">
                    <ImageIcon size={40} />
                  </div>
                )}

                {/* İçerik */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 text-xs font-bold text-rose-600 uppercase tracking-widest mb-3">
                    <Calendar size={14} />
                    {new Date(post.created_at).toLocaleDateString("tr-TR", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                  <h2 className="font-heading text-xl font-bold text-slate-900 mb-3 line-clamp-2">
                    {post.title}
                  </h2>

                  {/* Özet ya da body'den kısa bir preview */}
                  <div className="text-sm text-slate-600 line-clamp-3 mb-4 prose prose-sm max-w-none">
                    {post.excerpt ? (
                      <p>{post.excerpt}</p>
                    ) : (
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {post.body.slice(0, 220) + (post.body.length > 220 ? "..." : "")}
                      </ReactMarkdown>
                    )}
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-2">
                    <button className="text-sm font-bold text-rose-600 inline-flex items-center gap-2">
                      {t("blog_read_more") || "Devamını oku"}
                      <ArrowRight size={16} />
                    </button>
                    <span className="text-[10px] uppercase tracking-widest text-slate-400">
                      {post.lang.toUpperCase()}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
