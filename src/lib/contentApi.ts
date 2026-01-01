// src/lib/contentApi.ts
import type { BlogPost, LangCode, PageContent } from "../types/content";

const API_URL = import.meta.env.VITE_API_URL || '/api';
const API_SECRET = import.meta.env.VITE_API_SECRET;

// API Çekirdek Fonksiyonu
async function fetchAPI(action: string, params: Record<string, any> = {}, method: 'GET' | 'POST' = 'GET') {
  // Build the full URL - handle both absolute and relative paths
  let baseUrl: string;
  if (API_URL.startsWith('http://') || API_URL.startsWith('https://')) {
    baseUrl = API_URL;
  } else {
    // Relative path - build full URL from window.location.origin
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    baseUrl = `${origin}${API_URL.startsWith('/') ? '' : '/'}${API_URL}`;
  }

  // Ensure we have /index.php in the path
  if (!baseUrl.includes('index.php')) {
    baseUrl = `${baseUrl}${baseUrl.endsWith('/') ? '' : '/'}index.php`;
  }

  const url = new URL(baseUrl);
  url.searchParams.append("action", action);

  if (method === 'GET') {
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "X-Api-Key": API_SECRET || "",
    "X-Tenant-Code": "turp" // Explicitly set tenant for public API calls
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
  // Multilingual: pick the right language field with fallback to Turkish
  const getLocalizedField = (field: string) => {
    const value = post[`${field}_${lang}`];
    return value || post[`${field}_tr`] || '';
  };

  return {
    id: post.id,
    translationId: post.id,
    slug: post.slug,
    lang: lang,
    title: getLocalizedField('title'),
    excerpt: getLocalizedField('excerpt'),
    body: getLocalizedField('content'),
    content: getLocalizedField('content'),
    image_url: post.image_url || post.featured_image,
    created_at: post.published_at || post.created_at || new Date().toISOString()
  };
}

export const fetchBlogPosts = async (lang: LangCode): Promise<BlogPost[]> => {
  // API now returns all posts with all language fields
  const response = await fetchAPI('get_blog_posts', {});

  if (!response?.data) return [];

  // Status check: Only published posts
  const posts = response.data.filter((p: any) => p.status === 'published');

  return posts.map((p: any) => mapPostToType(p, lang));
};

export const fetchBlogPostBySlug = async (
  slug: string,
  lang: LangCode
): Promise<BlogPost | null> => {
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

export const fetchContactConfig = async (lang: LangCode, tenantCode: string = "nipt"): Promise<any | null> => {
  const response = await fetchAPI('get_contact_config', { language: lang, tenant: tenantCode });
  if (response?.success && response.data) {
    return response.data;
  }
  return null;
};
