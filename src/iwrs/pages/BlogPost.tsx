import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Header } from "@/iwrs/components/Header";
import { Footer } from "@/iwrs/components/Footer";
import { Button } from "@/iwrs/components/ui/button";
import { ArrowLeft, Info } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { blogApi } from "@/iwrs/lib/api";

interface BlogPostData {
  id: string;
  slug: string;
  title_tr: string;
  title_en: string | null;
  title_zh: string | null;
  content_tr: string;
  content_en: string | null;
  content_zh: string | null;
  featured_image: string | null;
  published_at: string | null;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string | null;
}

export default function BlogPost() {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();
  const [post, setPost] = useState<BlogPostData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFallback, setIsFallback] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug, i18n.language]);

  const fetchPost = async () => {
    try {
      if (slug) {
        const data = await blogApi.getOne(slug);
        setPost(data);

        // Check if we're using fallback content
        const lang = i18n.language === 'zh' ? 'zh' : (i18n.language === 'en' ? 'en' : 'tr');
        if (lang !== 'tr' && data) {
          const hasTranslation = data[`title_${lang}` as keyof BlogPostData] && data[`content_${lang}` as keyof BlogPostData];
          setIsFallback(!hasTranslation);
        } else {
          setIsFallback(false);
        }
      }
    } catch (error) {
      console.error("Failed to fetch post:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Get localized content with fallback to Turkish
  const getLocalizedField = (field: 'title' | 'content') => {
    if (!post) return '';
    const lang = i18n.language === 'zh' ? 'zh' : (i18n.language === 'en' ? 'en' : 'tr');
    const value = post[`${field}_${lang}` as keyof BlogPostData] as string | null;
    return value || (post[`${field}_tr` as keyof BlogPostData] as string) || '';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p>{t('blogPost.loading')}</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">{t('blogPost.notFound')}</h1>
            <Link to="/blog">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('blogPost.backToBlog')}
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const title = getLocalizedField('title');
  const content = getLocalizedField('content');

  return (
    <>
      <Helmet>
        <title>{post.seo_title || title} | Omega CRO</title>
        <meta name="description" content={post.seo_description || title} />
        {post.seo_keywords && <meta name="keywords" content={post.seo_keywords} />}
      </Helmet>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-12 bg-gradient-to-br from-background via-background to-accent/10">
          <article className="container mx-auto px-4 max-w-4xl">
            <Link to="/blog" className="inline-block mb-6">
              <Button variant="ghost">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('blogPost.backToBlog')}
              </Button>
            </Link>

            {isFallback && (
              <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2 text-amber-700 text-sm">
                <Info size={16} />
                {i18n.language === 'en'
                  ? 'This content is shown in Turkish. English translation is not available yet.'
                  : '此内容以土耳其语显示。中文翻译尚不可用。'}
              </div>
            )}

            <header className="mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
              {post.published_at && (
                <p className="text-muted-foreground">
                  {new Date(post.published_at).toLocaleDateString(i18n.language === 'tr' ? 'tr-TR' : i18n.language === 'zh' ? 'zh-CN' : 'en-US', {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              )}
            </header>

            {post.featured_image && (
              <div className="mb-8 rounded-lg overflow-hidden">
                <img
                  src={post.featured_image}
                  alt={title}
                  className="w-full h-auto object-cover"
                />
              </div>
            )}

            <div className="prose prose-lg max-w-none dark:prose-invert">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          </article>
        </main>
        <Footer />
      </div>
    </>
  );
}
