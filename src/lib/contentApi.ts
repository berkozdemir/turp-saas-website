// src/lib/contentApi.ts
import type { BlogPost, LangCode, PageContent } from "../types/content";

const API_URL = import.meta.env.VITE_API_URL || '/api';
const API_SECRET = import.meta.env.VITE_API_SECRET;

// API Çekirdek Fonksiyonu
export async function fetchAPI(action: string, params: Record<string, any> = {}, method: 'GET' | 'POST' = 'GET') {
  // Build the full URL - handle both absolute and relative paths
  let baseUrl: string = API_URL;

  // Ensure index.php is at the end of the path part (before query string)
  // Remove any trailing index.php or / for a clean base
  baseUrl = baseUrl.replace(/\/index\.php\/?$/, '').replace(/\/+$/, '');

  // Use URL constructor with origin if baseUrl is still relative
  let fullUrl: string;
  if (typeof window !== 'undefined' && !baseUrl.startsWith('http')) {
    const origin = window.location.origin;
    fullUrl = `${origin}${baseUrl.startsWith('/') ? '' : '/'}${baseUrl}/index.php`;
  } else {
    fullUrl = `${baseUrl}/index.php`;
  }

  const url = new URL(fullUrl);
  url.searchParams.append("action", action);

  if (method === 'GET') {
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        url.searchParams.append(key, String(params[key]));
      }
    });
  }


  // Helper to determine tenant code from hostname for public API calls
  function getPublicTenantCode(): string {
    if (typeof window === 'undefined') return 'turp';

    const host = window.location.hostname;

    // Check for IWRS domain
    if (host.includes('iwrs.com.tr') || host.includes('iwrs')) {
      return 'iwrs';
    }

    // Default to turp for all other domains (ct.turp.health, localhost, etc.)
    return 'turp';
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "X-Api-Key": API_SECRET || "",
    "X-Tenant-Code": getPublicTenantCode() // Dynamic tenant for public API
  };

  try {
    // Cache buster
    url.searchParams.append("_t", new Date().getTime().toString());

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
  _lang: LangCode
): Promise<PageContent | null> => {
  console.warn("API üzerinde sayfa yapısı henüz tanımlı değil. (slug: " + slug + ")");
  // Mock veya boş data
  return null;
};

// Also expose to window for easier global access if needed (optional but helps with the ReferenceError)
if (typeof window !== 'undefined') {
  (window as any).fetchAPI = fetchAPI;
}

export const fetchContactConfig = async (lang: LangCode, tenantCode: string = "nipt"): Promise<any | null> => {
  const response = await fetchAPI('get_contact_config_public', { language: lang, tenant_code: tenantCode });
  if (response?.success && response.data) {
    return response.data;
  }
  return null;
};
