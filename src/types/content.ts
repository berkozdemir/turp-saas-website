// src/types/content.ts

export type ContentType = "post" | "page";
export type LangCode = "tr" | "en" | "zh";

export interface BlogPost {
  /** contents.id */
  id: string;
  /** content_translations.id */
  translationId: string;
  slug: string;
  lang: LangCode;

  title: string;
  excerpt: string | null;

  /** Ana içerik – Markdown body */
  body: string;

  /**
   * Eski kodla uyum için:
   * PostDetail.tsx içinde post.content kullanıyorsun.
   */
  content: string;

  /** Görsel – seo_image_url'den geliyor */
  image_url: string | null;

  created_at: string;
}

/**
 * Page tipi içerik (Hakkımızda, Gizlilik, Koşullar vb.)
 * BlogPost ile aynı alanların çoğunu taşıyor,
 * ama excerpt / image opsiyonel, daha sade.
 */
export interface PageContent {
  id: string;
  translationId: string;
  slug: string;
  lang: LangCode;

  title: string;
  body: string;
  content: string; // yine Markdown body ile eşit

  image_url: string | null; // istersen hero görsel de kullanabilirsin
  created_at: string;
}
