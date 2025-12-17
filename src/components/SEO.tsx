import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { seoData, defaultSEO } from "../data/seoConfig";

type SEOProps = {
  view: any;
  post?: any; // Blog post için
};

const typedSeoData: any = seoData;
const typedDefaultSEO: any = defaultSEO;

const SITE_URL = "https://turp.health";

export const SEO = ({ view, post }: SEOProps) => {
  const { i18n } = useTranslation();

  // 1. Dili al
  const currentLang = i18n.language ? i18n.language.split("-")[0] : "tr";
  const validLang = ["tr", "en", "zh"].includes(currentLang) ? currentLang : "en";

  // 2. Sayfa anahtarını belirle
  let pageKey = "home";
  let isBlogPost = false;

  if (typeof view === "string") {
    pageKey = view;
  } else if (typeof view === "object" && view !== null) {
    if (view.type === "module") pageKey = `module-${view.id}`;
    if (view.type === "solution") pageKey = `solution-${view.id}`;
    if (view.type === "detail") {
      pageKey = "blog";
      isBlogPost = true;
    }
  }

  // 3. SEO verilerini çek
  const pageSEO = typedSeoData?.[pageKey] || {};

  // Blog post için dinamik SEO
  let title = pageSEO?.[validLang]?.title ?? typedDefaultSEO?.[validLang]?.title ?? "Turp Health";
  let description = pageSEO?.[validLang]?.description ?? typedDefaultSEO?.[validLang]?.description ?? "Turp, klinik araştırmalar için dijital sağlık platformu.";
  let image = pageSEO?.[validLang]?.image ?? typedDefaultSEO?.[validLang]?.image ?? `${SITE_URL}/og-default.png`;

  if (isBlogPost && post) {
    title = `${post.title} | Turp Health`;
    description = post.excerpt || post.content?.substring(0, 160) || description;
    image = post.image_url ? `${SITE_URL}${post.image_url}` : image;
  }

  // 4. Canonical URL
  const canonicalPath = pageKey === "home" ? "" : `/${pageKey}`;
  const canonical = `${SITE_URL}${canonicalPath}`;

  // 5. Schema.org JSON-LD
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    "name": "Turp Health",
    "url": SITE_URL,
    "logo": `${SITE_URL}/logo.png`,
    "description": "Klinik araştırmalar ve kronik hastalık yönetimi için dijital platform",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "TR"
    }
  };

  const blogPostSchema = isBlogPost && post ? {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.excerpt,
    "image": image,
    "datePublished": post.created_at,
    "author": {
      "@type": "Organization",
      "name": "Turp Health"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Turp Health",
      "logo": {
        "@type": "ImageObject",
        "url": `${SITE_URL}/logo.png`
      }
    }
  } : null;

  return (
    <Helmet>
      {/* HTML lang */}
      <html lang={validLang} />

      {/* Temel meta */}
      <title>{title}</title>
      <meta name="description" content={description} />

      {/* Robots */}
      <meta name="robots" content="index, follow, max-image-preview:large" />

      {/* Canonical */}
      <link rel="canonical" href={canonical} />

      {/* Open Graph */}
      <meta property="og:type" content={isBlogPost ? "article" : "website"} />
      <meta property="og:locale" content={validLang} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={canonical} />
      <meta property="og:site_name" content="Turp Health" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Hreflang */}
      <link rel="alternate" href={`${SITE_URL}/tr${canonicalPath}`} hrefLang="tr" />
      <link rel="alternate" href={`${SITE_URL}/en${canonicalPath}`} hrefLang="en" />
      <link rel="alternate" href={`${SITE_URL}/zh${canonicalPath}`} hrefLang="zh" />
      <link rel="alternate" href={`${SITE_URL}${canonicalPath}`} hrefLang="x-default" />

      {/* Schema.org JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>

      {blogPostSchema && (
        <script type="application/ld+json">
          {JSON.stringify(blogPostSchema)}
        </script>
      )}
    </Helmet>
  );
};
