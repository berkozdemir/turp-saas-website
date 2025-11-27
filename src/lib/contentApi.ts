// src/lib/contentApi.ts
import { supabase } from "./supabase";
import type { BlogPost, LangCode, PageContent } from "../types/content";

export const normalizeLang = (raw: string | undefined | null): LangCode => {
  const base = (raw || "tr").split("-")[0];
  if (base === "tr" || base === "en" || base === "zh") return base;
  return "en";
};

export const fetchBlogPosts = async (lang: LangCode): Promise<BlogPost[]> => {
  const { data, error } = await supabase
    .from("contents")
    .select(
      `
      id,
      slug,
      type,
      created_at,
      image_url,
      content_translations!inner (
        id,
        lang,
        title,
        excerpt,
        body,
        seo_image_url
      )
    `
    )
    .eq("type", "post")
    .eq("status", "published")
    .eq("content_translations.lang", lang)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("fetchBlogPosts error:", error);
    throw error;
  }

  if (!data) return [];

  return data.map((row: any) => {
    const tr = Array.isArray(row.content_translations)
      ? row.content_translations[0]
      : row.content_translations;

    const body = tr?.body || "";

    const post: BlogPost = {
      id: row.id,
      translationId: tr.id,
      slug: row.slug,
      lang: tr.lang as LangCode,
      title: tr.title,
      excerpt: tr.excerpt ?? null,
      body,
      content: body,
      image_url: tr.seo_image_url ?? null,
      created_at: row.created_at,
    };

    return post;
  });
};

export const fetchBlogPostBySlug = async (
  slug: string,
  lang: LangCode
): Promise<BlogPost | null> => {
  const { data, error } = await supabase
    .from("contents")
    .select(
      `
      id,
      slug,
      created_at,
      content_translations!inner (
        id,
        lang,
        title,
        excerpt,
        body,
        seo_image_url
      )
    `
    )
    .eq("type", "post")
    .eq("status", "published")
    .eq("slug", slug)
    .eq("content_translations.lang", lang)
    .single();

  if (error) {
    console.error("fetchBlogPostBySlug error:", error);
    return null;
  }

  if (!data) return null;

  const tr = Array.isArray(data.content_translations)
    ? data.content_translations[0]
    : data.content_translations;

  const body = tr?.body || "";

  return {
    id: data.id,
    translationId: tr.id,
    slug: data.slug,
    lang: tr.lang as LangCode,
    title: tr.title,
    excerpt: tr.excerpt ?? null,
    body,
    content: body,
    image_url: tr.seo_image_url ?? null,
    created_at: data.created_at,
  };
};

/**
 * PAGE tipi içerik: Örn. slug = "about", type = "page"
 */
export const fetchPageBySlug = async (
  slug: string,
  lang: LangCode
): Promise<PageContent | null> => {
  const { data, error } = await supabase
    .from("contents")
    .select(
      `
      id,
      slug,
      created_at,
      content_translations!inner (
        id,
        lang,
        title,
        body,
        seo_image_url
      )
    `
    )
    .eq("type", "page")
    .eq("status", "published")
    .eq("slug", slug)
    .eq("content_translations.lang", lang)
    .single();

  if (error) {
    console.error("fetchPageBySlug error:", error);
    return null;
  }

  if (!data) return null;

  const tr = Array.isArray(data.content_translations)
    ? data.content_translations[0]
    : data.content_translations;

  const body = tr?.body || "";

  const page: PageContent = {
    id: data.id,
    translationId: tr.id,
    slug: data.slug,
    lang: tr.lang as LangCode,
    title: tr.title,
    body,
    content: body,
    image_url: tr.seo_image_url ?? null,
    created_at: data.created_at,
  };

  return page;
};
