import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

const SITE_NAME = 'Genlerim Ne Diyor?';
const SITE_DOMAIN = 'genlerimnediyor.com';
const DEFAULT_IMAGE = '/public/images/Genlerim Ne Diyor Logo Final.jpg';

// SEO metadata for each page
const seoData: Record<string, SEOProps> = {
  '/': {
    title: 'Genlerim Ne Diyor? - Genetik Test Platformu',
    description:
      'Genetik testleri ile kendi genetik yapınızı öğrenin. Yaşam genetiği, yenidoğan taraması ve hamilelik öncesi testleri. Uzman danışmanlık ile sağlıklı yaşam rehberi alın.',
    keywords: 'genetik test, yaşam genetiği, yenidoğan taraması, NIPT, hamilelik, genetik danışmanlık',
    type: 'website',
  },
  '/yasam-genetigi': {
    title: 'Yaşam Genetiği Testi - 47 Özellik Analizi | Genlerim Ne Diyor?',
    description:
      'Yaşam Genetiği testi ile 47 genetik özelliğinizi analiz edin. Beslenme, egzersiz, vitamin metabolizması ve kişisel özellikleri öğrenin. Uzman danışmanlık dahil.',
    keywords:
      'yaşam genetiği, genetik test, beslenme genetiği, kişisel genetik analiz, epigenetik, vitamin metabolizması',
    type: 'article',
  },
  '/yenidogan-tarama': {
    title: 'IMSPlus Yenidoğan Tarama Testi | Genlerim Ne Diyor?',
    description:
      'IMSPlus testi ile yenidoğan döneminde 27 genetik hastalık taraması yapın. Erken tanı, erken müdahale imkanı. Metabolik hastalıklar ve işitme kaybı tespiti.',
    keywords: 'yenidoğan taraması, IMSPlus, genetik hastalık, metabolik tarama, çocuk sağlığı, erken tanı',
    type: 'article',
  },
  '/enfantguard-2-0': {
    title: 'EnfantGuard 2.0 - 250+ Hastalık Taraması | Genlerim Ne Diyor?',
    description:
      'EnfantGuard 2.0 ile yenidoğanda 250+ geliştimsel bozukluk ve kromozomal anomali taraması. Otizm, öğrenme güçlüğü, mikrodelesyon sendromları.',
    keywords:
      'EnfantGuard, yenidoğan, genetik tarama, gelişimsel bozukluk, otizm, NGS sekanslama, çocuk sağlığı',
    type: 'article',
  },
  '/iletisim': {
    title: 'İletişim | Genlerim Ne Diyor?',
    description: 'Genetik testlerimiz hakkında bilgi almak ve randevu almak için bize ulaşın. Ankara merkezli laboratuvarımıza telefonla, e-mail veya forma yazarak iletişim kurabilirsiniz.',
    keywords: 'iletişim, randevu, bilgi talep, genetik test danışmanlığı',
    type: 'contact',
  },
  '/hakkimizda': {
    title: 'Hakkımızda | Genlerim Ne Diyor?',
    description:
      'Genlerim Ne Diyor?, Omega Araştırma bünyesinde 2018\'den beri faaliyet gösteren ruhsatlı genetik laboratuvarı tarafından sunulan bir hizmettir.',
    keywords: 'Omega Araştırma, genetik laboratuvarı, sağlık, araştırma, bilim',
    type: 'website',
  },
};

export const GNDSEO: React.FC<{ page?: string; customData?: SEOProps }> = ({
  page = '/',
  customData,
}) => {
  // Get page-specific SEO data or use custom data
  const data = customData || seoData[page] || seoData['/'];
  const title = data.title || `${SITE_NAME}`;
  const description =
    data.description ||
    'Genetik testleri ile kendi genetik yapınızı öğrenin. Sağlıklı yaşam rehberi alın.';
  const url = `https://${SITE_DOMAIN}${page}`;
  const image = data.image || DEFAULT_IMAGE;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={data.keywords || 'genetik, test, sağlık'} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="utf-8" />
      <meta name="language" content="Turkish" />
      <meta name="author" content={SITE_NAME} />
      <meta name="robots" content="index, follow" />

      {/* Canonical URL */}
      <link rel="canonical" href={url} />

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={data.type || 'website'} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="tr_TR" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#FF3B4A" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

      {/* Structured Data (JSON-LD) */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'MedicalBusiness',
          name: SITE_NAME,
          description: description,
          url: `https://${SITE_DOMAIN}`,
          logo: image,
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'Piri Reis Caddesi No:2/4 AnkaJob Beytepe',
            addressLocality: 'Ankara',
            addressRegion: 'TR',
            postalCode: '06810',
            addressCountry: 'TR',
          },
          telephone: '+90-312-920-1-362',
          email: 'nipttesti@omega-gen.com',
          sameAs: ['https://instagram.com/nipttesti'],
          priceRange: '$$',
        })}
      </script>
    </Helmet>
  );
};

export default GNDSEO;
