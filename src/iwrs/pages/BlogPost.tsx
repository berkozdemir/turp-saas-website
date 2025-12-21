import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Header } from "@/iwrs/components/Header";
import { Footer } from "@/iwrs/components/Footer";
import { Button } from "@/iwrs/components/ui/button";
import { ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { blogApi } from "@/iwrs/lib/api"; // Import local API

interface BlogPost {
  id: string;
  title: string;
  content: string;
  featured_image: string | null;
  published_at: string | null;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string | null;
}

// ... imports

export default function BlogPost() {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const fetchPost = async () => {
    try {
      if (slug) {
        const data = await blogApi.getOne(slug); // Uses slug to fetch
        setPost(data);
      }
    } catch (error) {
      console.error("Failed to fetch post:", error);
    } finally {
      setIsLoading(false);
    }
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

  return (
    <>
      <Helmet>
        <title>{post.seo_title || post.title} | Omega CRO</title>
        <meta name="description" content={post.seo_description || post.title} />
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

            <header className="mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>
              {post.published_at && (
                <p className="text-muted-foreground">
                  {new Date(post.published_at).toLocaleDateString(i18n.language === 'tr' ? 'tr-TR' : 'en-US', {
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
                  alt={post.title}
                  className="w-full h-auto object-cover"
                />
              </div>
            )}

            <div className="prose prose-lg max-w-none dark:prose-invert">
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>
          </article>
        </main>
        <Footer />
      </div>
    </>
  );
}
