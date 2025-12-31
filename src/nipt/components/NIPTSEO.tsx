import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
}

const NIPTSEO: React.FC<SEOProps> = ({ title, description, keywords, image }) => {
    const location = useLocation();
    const path = location.pathname;
    const hostname = window.location.hostname;

    // Detect Tenant
    const isWestesti = hostname.includes('westesti');
    const isTrombofili = hostname.includes('trombofili');
    const isNipt = !isWestesti && !isTrombofili;

    // --- SEO DATA MAP ---
    const seoData: Record<string, Record<string, { title: string; desc: string; keywords: string }>> = {
        nipt: {
            '/': {
                title: "NIPT Testi - Omega Genetik | %99.9 Doğruluk",
                desc: "Noninvasive Prenatal Test (NIPT) - Türkiye'nin en güvenilir fetal DNA testi. Verifi, MomGuard, Veritas testleri ile bebek sağlığını öğrenin. Hızlı sonuç, yüksek doğruluk.",
                keywords: "NIPT, fetal DNA testi, hamilelik testi, prenatal test"
            },
            '/testler': {
                title: "NIPT Testleri ve Fiyatları | Karşılaştır | Omega",
                desc: "NIPT testleri karşılaştırması: Verifi (₺1.850), MomGuard (₺1.200), Veritas (₺2.500). Hamilelik sırasında bebek genetik rahatsızlıklarını erken teşhis edin. Ücretsiz danışmanlık.",
                keywords: "NIPT tests, fetal testing, genetic screening"
            },
            '/testler/verifi': {
                title: "Verifi NIPT Testi | %99.9 Doğruluk | Omega",
                desc: "Verifi NIPT Testi - Trizomi 21, 18, 13 ve cinsiyet kromozom bozuklukları için %99,9 doğruluk. 7-10 günde sonuç. Türkiye'de en tercih edilen test. Hemen randevu alın.",
                keywords: "Verifi NIPT, trizomi testi, Down sendromu testi"
            },
            '/testler/momguard': {
                title: "MomGuard NIPT Testi | Uygun Fiyat | Omega",
                desc: "MomGuard NIPT Testi - Hamilelik sırasında anne kanından bebek genetik hastaları tespit edin. %99,8 doğruluk, 10-14 günde sonuç. Uygun fiyat, güvenilir sonuçlar.",
                keywords: "MomGuard, NIPT test, prenatal screening"
            },
            '/testler/veritas': {
                title: "Veritas NIPT Testi | Kapsamlı Analiz | Omega",
                desc: "Veritas NIPT Testi - Detaylı kromozomal analiz ve mikrodelesyon tespiti. Trizomi 21, 18, 13 + 22q11, 1p36, 15q11, 5p deletions. Kapsamlı genetic screening.",
                keywords: "Veritas NIPT, microarray, deletions, comprehensive screening"
            },
            '/nasil-calisir': {
                title: "NIPT Testi Nasıl Çalışır? | 5 Basit Adım | Omega",
                desc: "NIPT testi nasıl çalışır? 5 basit adımda anlayın: Randevu, Kan çekimi, Lab analizi, Sonuç raporlama, Doktor danışması. Güvenli, hızlı, doğru.",
                keywords: "NIPT nasıl çalışır, test prosesi, adımlar"
            },
            '/about': {
                title: "Hakkımızda - Omega Genetik | 30 Yıllık Tecrübe",
                desc: "Omega Genetik - 30 yılın deneyimi, 1000+ başarılı test, ISO sertifikalı laboratuvar. Türkiye'nin güvenilir NIPT merkezi. Doktor danışmanı, hemşire ziyareti ve sonuç yönetimi.",
                keywords: "Omega Genetik, NIPT merkezi, genetik testi, ISO sertifikalı"
            },
            '/sss': {
                title: "Sıkça Sorulan Sorular | NIPT Hakkında Her Şey",
                desc: "NIPT soruları cevaplandırılıyor: Hamilelik haftası, test güvenliği, sonuç süresi, doğruluk oranı, teknik detaylar. Eksikiz var mı? Cevapları burada bulun.",
                keywords: "NIPT FAQ, NIPT sorular, hamilelik testi sorular"
            },
            '/booking': {
                title: "Hemen NIPT Randevusu Alın | Omega Genetik",
                desc: "NIPT randevusu hemen alın - 5 dakikada basit form, ister evde ister klinikte kan çekimi, 7-10 günde sonuç. Güvenli ödeme, doktor danışması hediye.",
                keywords: "NIPT randevu, NIPT booking, test randevusu"
            },
            '/blog': {
                title: "NIPT Blog - Hamilelik ve Genetik Bilgiler",
                desc: "NIPT blog - Hamilelik, genetik test, Down sendromu, fetal gelişim hakkında yazılar. Uzman doktor makaleleri, hasta hikayeleri, sağlık ipuçları.",
                keywords: "NIPT blog, hamilelik yazıları, genetik test bilgisi"
            },
            '/iletisim': {
                title: "İletişim - Omega Genetik | Bize Ulaşın",
                desc: "Omega Genetik ile iletişime geçin: Tel: 0312 920 13 62, Email: info@nipt.tr, Whatsapp, canlı sohbet. Sorularınız, endişeleriniz ve randevu talebileri için hemen ulaşın.",
                keywords: "İletişim, destek, sorgular"
            }
        },
        westesti: {
            '/': {
                title: "Ege Bölgesi NIPT Testi - Omega West | İzmir",
                desc: "Batı bölgesinin en iyi NIPT testi - İzmir, Manisa, Denizli. Verifi ve MomGuard testleri, evde kan çekimi, 7-10 günde sonuç. Omega West ile güvenilir hamilelik testi.",
                keywords: "NIPT İzmir, NIPT Manisa, NIPT Denizli, Batı bölgesi"
            },
            '/testler': {
                title: "NIPT Testleri İzmir ve Fiyatları | Omega West",
                desc: "NIPT testleri İzmir - Verifi (₺1.850) ve MomGuard (₺1.200). Hamilelik sırasında bebek genetik hastalığı erken tespit. Batı bölgede evde kan çekimi hizmeti.",
                keywords: "NIPT İzmir, test fiyatları, Batı bölgesi"
            },
            '/testler/verifi': {
                title: "Verifi NIPT İzmir | Omega West | %99.9 Doğruluk",
                desc: "Verifi NIPT İzmir - %99,9 doğruluk, 7-10 günde sonuç. Trizomi 21, 18, 13 tespiti. İzmir, Manisa, Denizli'de hizmet. Evde kan çekimi + doktor danışması.",
                keywords: "Verifi İzmir, NIPT Manisa, NIPT Denizli"
            },
            '/booking': {
                title: "NIPT Randevusu İzmir | Hemen Al | Omega West",
                desc: "NIPT randevusu İzmir - Verifi/MomGuard testi için randevu alın. Evde kan çekimi, güvenli ödeme, 7-10 günde sonuç. Batı bölgede güvenilir NIPT merkezi.",
                keywords: "NIPT randevu İzmir, hamilelik testi booking"
            }
        },
        trombofili: {
            '/': {
                title: "Kan Pıhtılaşma Riski Testi - Omega Thrombophilia",
                desc: "Kan pıhtılaşma riski testi (Thrombophilia) - Factor V Leiden, Prothrombin G20210A, MTHFR tespiti. Genetik risk değerlendirmesi, danışmanlık, klinik rapor. Hemen test yaptırın.",
                keywords: "Thrombophilia test, Factor V Leiden, kan pıhtılaşması"
            },
            '/testler': {
                title: "Thrombophilia Testleri ve Fiyatları | Omega",
                desc: "Thrombophilia testleri - Factor V Leiden (₺500), Prothrombin (₺500), MTHFR (₺500), Komprehensif Panel (₺1.500). Kan pıhtılaşma risk tespiti, hematolog danışması.",
                keywords: "Thrombophilia tests, genetic clotting disorders"
            },
            '/testler/f5l': {
                title: "Factor V Leiden Testi | Kan Pıhtılaşma Riski",
                desc: "Factor V Leiden Testi - Kan pıhtılaşması riskini artıran genetik mutasyon tespiti. %5-10 risk artışı, TVD/PE riski. 5-7 günde genetik rapor. Uygun fiyat (₺500).",
                keywords: "Factor V Leiden, DVT, PE, genetic mutation"
            },
            '/testler/pt': {
                title: "Prothrombin G20210A Testi | Omega Thrombophilia",
                desc: "Prothrombin G20210A Testi - Genetik kan pıhtılaşma riski. Hamilelik, cerrahiden sonra, kontraseptif kullanımında risk. Klinik yorumlama ve danışmanlık.",
                keywords: "Prothrombin, genetic thrombosis risk"
            },
            '/testler/mthfr': {
                title: "MTHFR C677T Testi | Omega Thrombophilia",
                desc: "MTHFR C677T Testi - Kan pıhtılaşma riski, folat metabolizması. Homosistein seviyeleri, trombosis riski. Terapötik danışmanlık, genetik yorum.",
                keywords: "MTHFR C677T, homocysteine, genetic polymorphism"
            },
            '/testler/panel': {
                title: "Komprehensif Thrombophilia Panel | Omega",
                desc: "Komprehensif Thrombophilia Panel - Tam genetik kan pıhtılaşma taraması (F5L, PT, MTHFR + 3 marker). Kapsamlı risk değerlendirmesi, hematolog yorumu.",
                keywords: "Comprehensive thrombophilia screening, full panel"
            },
            '/danismanlik': {
                title: "Genetik Danışmanlık | Omega Thrombophilia",
                desc: "Genetik danışmanlık - Thrombophilia test sonuçlarını anlayın. Hematolog danışmanı, kişiselleştirilmiş tedavi planı, yaşam tarzı önerileri, risk yönetimi.",
                keywords: "Genetic counseling, hematology consultation"
            },
            '/booking': {
                title: "Thrombophilia Testi Randevusu | Omega",
                desc: "Thrombophilia testi randevusu - Kan pıhtılaşma risk taraması, genetik rapor, hematolog danışması. Tercih edilen test yöntemi ve randevu saati seçin.",
                keywords: "Thrombophilia booking, genetic test appointment"
            }
        }
    };

    const tenantKey = isWestesti ? 'westesti' : (isTrombofili ? 'trombofili' : 'nipt');
    const tenantData = seoData[tenantKey] || seoData.nipt;
    const pageData = tenantData[path] || tenantData['/'] || seoData.nipt['/'];

    const finalTitle = title || pageData.title;
    const finalDescription = description || pageData.desc;
    const finalKeywords = keywords || pageData.keywords;
    const finalImage = image || "https://nipt.tr/og-image.jpg"; // Default OG image

    // Schema.org Structured Data
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "MedicalBusiness",
        "name": isWestesti ? "Omega West" : (isTrombofili ? "Omega Thrombophilia" : "Omega Genetik"),
        "description": finalDescription,
        "url": `https://${hostname}${path}`,
        "telephone": "+903129201362",
        "email": "info@nipt.tr",
        "areaServed": "TR",
        "priceRange": isTrombofili ? "₺500-₺1500" : "₺1200-₺2500"
    };

    return (
        <Helmet>
            <title>{finalTitle}</title>
            <meta name="description" content={finalDescription} />
            <meta name="keywords" content={finalKeywords} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:title" content={finalTitle} />
            <meta property="og:description" content={finalDescription} />
            <meta property="og:image" content={finalImage} />
            <meta property="og:url" content={window.location.href} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={finalTitle} />
            <meta name="twitter:description" content={finalDescription} />
            <meta name="twitter:image" content={finalImage} />

            {/* Structured Data */}
            <script type="application/ld+json">
                {JSON.stringify(structuredData)}
            </script>
        </Helmet>
    );
};

export default NIPTSEO;
