import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/iwrs/components/ui/card";
import { Badge } from "@/iwrs/components/ui/badge";
import { Header } from "@/iwrs/components/Header";
import { Footer } from "@/iwrs/components/Footer";
import { useTranslation } from "react-i18next";
import { blogApi } from "@/iwrs/lib/api"; // Import local API

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featured_image: string | null;
  published_at: string | null;
  seo_keywords: string | null;
}

// ... imports

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const data = await blogApi.getAll();
      setPosts(data || []);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-20 bg-gradient-to-br from-background via-background to-accent/10">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('blog.title')}</h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                {t('blog.subtitle')}
              </p>
            </div>

            {isLoading ? (
              <div className="text-center py-12">{t('blog.loading')}</div>
            ) : posts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">{t('blog.noPosts')}</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <Link key={post.id} to={`/blog/${post.slug}`}>
                    <Card className="h-full hover:shadow-lg transition-shadow overflow-hidden">
                      {post.featured_image && (
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={post.featured_image}
                            alt={post.title}
                            className="w-full h-full object-cover transition-transform hover:scale-105"
                          />
                        </div>
                      )}
                      <CardHeader>
                        <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                        {post.published_at && (
                          <CardDescription>
                            {new Date(post.published_at).toLocaleDateString(i18n.language === 'tr' ? 'tr-TR' : i18n.language === 'zh' ? 'zh-CN' : 'en-US', {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </CardDescription>
                        )}
                      </CardHeader>
                      <CardContent>
                        {post.excerpt && (
                          <p className="text-muted-foreground line-clamp-3 mb-4">
                            {post.excerpt}
                          </p>
                        )}
                        {post.seo_keywords && (
                          <div className="flex flex-wrap gap-2">
                            {post.seo_keywords.split(",").slice(0, 3).map((keyword, idx) => (
                              <Badge key={idx} variant="secondary">
                                {keyword.trim()}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
