import React from 'react';
import { Helmet } from 'react-helmet-async';
import { seoData, defaultSEO } from '../data/seoConfig';
import { useTranslation } from 'react-i18next';

export const SEO = ({ view }) => {
  const { i18n } = useTranslation();
  
  // 1. Mevcut Dili Algıla (tr, en, zh). Desteklenmeyen bir dilse 'en' yap.
  // i18n.language bazen 'en-US' gibi gelebilir, sadece ilk kısmı alıyoruz.
  const currentLang = i18n.language ? i18n.language.split('-')[0] : 'tr';
  const validLang = ['tr', 'en', 'zh'].includes(currentLang) ? currentLang : 'en';

  // 2. Sayfa Anahtarını Belirle
  let pageKey = 'home';
  if (typeof view === 'string') {
    pageKey = view;
  } else if (typeof view === 'object') {
    if (view.type === 'module') pageKey = `module-${view.id}`;
    if (view.type === 'solution') pageKey = `solution-${view.id}`;
    if (view.type === 'detail') pageKey = 'blog'; // Blog detayları için şimdilik genel
  }

  // 3. Veriyi Çek (Önce sayfaya bak, yoksa default'a git)
  const pageSEO = seoData[pageKey] || {};
  
  // İlgili dilde veri var mı? Yoksa İngilizceye düş (Fallback)
  const title = pageSEO[validLang]?.title || defaultSEO[validLang]?.title || defaultSEO['en'].title;
  const description = pageSEO[validLang]?.description || defaultSEO[validLang]?.description || defaultSEO['en'].description;
  const image = pageSEO[validLang]?.image || defaultSEO[validLang]?.image || defaultSEO['en'].image;

  return (
    <Helmet>
      {/* HTML Dil Etiketi */}
      <html lang={validLang} />
      
      {/* Temel Meta Etiketleri */}
      <title>{title}</title>
      <meta name="description" content={description} />
      
      {/* Open Graph (Facebook, LinkedIn, WhatsApp) */}
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
      
      {/* Alternatif Dil Linkleri (Hreflang - SEO için kritik) */}
      <link rel="alternate" href="https://turp.health/tr" hrefLang="tr" />
      <link rel="alternate" href="https://turp.health/en" hrefLang="en" />
      <link rel="alternate" href="https://turp.health/zh" hrefLang="zh" />
    </Helmet>
  );
};
