// src/lib/contentApi.ts
import type { BlogPost, LangCode, PageContent } from "../types/content";

const API_URL = import.meta.env.VITE_API_URL;
const API_SECRET = import.meta.env.VITE_API_SECRET;

// API Çekirdek Fonksiyonu
async function fetchAPI(action: string, params: Record<string, any> = {}, method: 'GET' | 'POST' = 'GET') {
  if (!API_URL) {
    console.error("VITE_API_URL tanımlı değil!");
    return null;
  }

  const url = new URL(API_URL);
  url.searchParams.append("action", action);

  if (method === 'GET') {
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "X-Api-Key": API_SECRET || ""
  };

  try {
    const response = await fetch(url.toString(), {
      method,
      headers,
      body: method === 'POST' ? JSON.stringify(params) : undefined
    });

    if (!response.ok) {
      console.error(`API Hatası: ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API Fetch Hatası:", error);
    return null;
  }
}

export const normalizeLang = (raw: string | undefined | null): LangCode => {
  const base = (raw || "tr").split("-")[0];
  if (base === "tr" || base === "en" || base === "zh") return base;
  return "en";
};

// PHP API'den gelen veriyi React uygulamamızın beklediği tipe dönüştürür
function mapPostToType(post: any, lang: LangCode): BlogPost {
  // PHP API düz veri dönüyor (content_translations yok)
  // Bu yüzden mevcut veriyi, istenen dilmiş gibi kabul ediyoruz.
  return {
    id: post.id,
    translationId: post.id, // Translation ID olarak kendi ID'sini kullanıyoruz
    slug: post.slug,
    lang: lang,
    title: post.title,
    excerpt: post.excerpt,
    body: post.content, // PHP'de 'content', React'ta 'body'
    content: post.content,
    image_url: post.image_url || post.featured_image, // Veritabanında image_url olarak geçiyor
    created_at: post.published_at || post.created_at || new Date().toISOString()
  };
}

export const fetchBlogPosts = async (lang: LangCode): Promise<BlogPost[]> => {
  // API'ye dil parametresi gönder
  const response = await fetchAPI('get_blog_posts', { lang });

  if (!response?.data) return [];

  // Status check: Sadece published olanlar
  const posts = response.data.filter((p: any) => p.status === 'published');

  return posts.map((p: any) => mapPostToType(p, lang));
};

export const fetchBlogPostBySlug = async (
  slug: string,
  lang: LangCode
): Promise<BlogPost | null> => {
  // API tarafında 'get_post_by_slug' yok, mecburen tümünü çekip buluyoruz (Optimize edilebilir)
  const posts = await fetchBlogPosts(lang);
  return posts.find(p => p.slug === slug) || null;
};

/**
 * PAGE tipi içerik: Örn. slug = "about", type = "page"
 * NOT: PHP API'da şu an 'pages' tablosu veya endpoint'i görünmüyor.
 * Geçici olarak boş dönüyoruz veya ilerde eklenebilir.
 */
export const fetchPageBySlug = async (
  slug: string,
  lang: LangCode
): Promise<PageContent | null> => {
  console.warn("API üzerinde sayfa yapısı henüz tanımlı değil. (slug: " + slug + ")");
  // Mock veya boş data
  return null;
};
