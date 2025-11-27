import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { seoData, defaultSEO } from "../data/seoConfig";

type SEOProps = {
  view: any;
};

const typedSeoData: any = seoData;
const typedDefaultSEO: any = defaultSEO;

export const SEO = ({ view }: SEOProps) => {
  const { i18n } = useTranslation();

  // 1. Dili al (tr, en, zh). 'en-US' gelirse 'en'
  const currentLang = i18n.language ? i18n.language.split("-")[0] : "tr";
  const validLang = ["tr", "en", "zh"].includes(currentLang)
    ? currentLang
    : "en";

  // 2. Sayfa anahtarını belirle
  let pageKey = "home";

  if (typeof view === "string") {
    pageKey = view;
  } else if (typeof view === "object" && view !== null) {
    if (view.type === "module") pageKey = `module-${view.id}`;
    if (view.type === "solution") pageKey = `solution-${view.id}`;
    if (view.type === "detail") pageKey = "blog"; // Blog detayları için genel
  }

  // 3. Veriyi çek (Önce sayfa, yoksa default)
  const pageSEO = typedSeoData?.[pageKey] || {};

  const title =
    pageSEO?.[validLang]?.title ??
    typedDefaultSEO?.[validLang]?.title ??
    typedDefaultSEO?.["en"]?.title ??
    "Turp Health";

  const description =
    pageSEO?.[validLang]?.description ??
    typedDefaultSEO?.[validLang]?.description ??
    typedDefaultSEO?.["en"]?.description ??
    "Turp, klinik araştırmalar ve kronik hastalık yönetimi için yeni nesil dijital sağlık platformudur.";

  const image =
    pageSEO?.[validLang]?.image ??
    typedDefaultSEO?.[validLang]?.image ??
    typedDefaultSEO?.["en"]?.image ??
    "https://turp.health/og-default.png";

  return (
    <Helmet>
      {/* HTML lang */}
      <html lang={validLang} />

      {/* Temel meta */}
      <title>{title}</title>
      <meta name="description" content={description} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:locale" content={validLang} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Turp Health" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Hreflang */}
      <link rel="alternate" href="https://turp.health/tr" hrefLang="tr" />
      <link rel="alternate" href="https://turp.health/en" hrefLang="en" />
      <link rel="alternate" href="https://turp.health/zh" hrefLang="zh" />
    </Helmet>
  );
};
