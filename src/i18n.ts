import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Çeviri Kaynakları
const resources = {
  tr: {
    translation: {
      // --- NAVİGASYON ---
      nav_home: "Ana Sayfa",
      nav_modules: "Modüller",
      nav_solutions: "Çözümler",
      nav_blog: "Blog",
      nav_admin: "Partner Girişi",

      // --- ANA SAYFA (HERO) ---
      hero_badge: "USBS Onaylı & e-Nabız Entegreli",
      hero_title_1: "Tahminleri Değil,",
      hero_title_2: "Gerçekleri Yönetin.",
      hero_desc: "Klinik araştırmalarda katılımcı verilerini kaynağından doğrulayan, Türkiye'nin ilk ve tek RWE platformu.",
      btn_demo: "Demo Talep Et",
      btn_explore: "Platformu Keşfet",

      // --- BÖLÜM BAŞLIKLARI ---
      sec_partners: "GÜVENİLEN PARTNERLERİMİZ",
      sec_modules_title: "Temel Modüller",
      sec_modules_desc: "Araştırmanızın her aşaması için özelleştirilebilir yapı taşları.",
      sec_solutions_badge: "Sektörel Uzmanlık",
      sec_solutions_title: "Tedavi Alanlarına Özel Çözümler",
      sec_solutions_desc: "Genel modüllerin ötesinde, spesifik hastalıkların takibi için geliştirilmiş dikey çözümlerimiz.",
      
      // --- HAKKIMIZDA (ABOUT) SAYFASI ---
      about: {
        back_home: "Ana Sayfaya Dön",
        since: "1997'den Beri",
        hero_title_1: "Türkiye'nin İlk CRO'su Olarak,",
        hero_title_2: "Geleceğin Kanıtını İnşa Ediyoruz.",
        hero_desc: "Omega Araştırma deneyimiyle doğan Turp; yazılımı amaç olarak değil, bilimsel hakikate ulaşmak için bir araç olarak kullanır.",
        manifesto_head_1: "Yazılım Odaklı Değil,",
        manifesto_head_2: "Gönüllü Odaklıyız.",
        manifesto_quote: "Kaliteli veri toplamak, kanıt düzeyini güçlendirir.",
        manifesto_text: "Pek çok teknoloji firması klinik araştırmayı 'öğrenmeye' çalışırken; biz 1997'den beri bu süreçleri planlayan, yöneten ve dönüştüren ekibiz. Dijitalleşme ve IoT, ICH-GCP standartlarında veri toplamak için birer araçtır.",
        eco_title: "Gücümüzü Aldığımız Ekosistem",
        eco_sub: "Klinik araştırmanın her adımında, uçtan uca uzmanlık.",
        
        // Kartlar
        card_cro_sub: "Stratejik Akıl • 1997",
        card_cro_desc: "Protokol tasarımı, etik kurul ve regülasyon yönetimi. Türkiye'nin ilk CRO'su olarak projenin yasal ve bilimsel omurgasını kuruyoruz.",
        card_care_sub: "Saha Gücü • Evde Sağlık",
        card_care_desc: "Araştırma hemşireleri ile hastayı evinde ziyaret eden, numune alan ve ilacı uygulayan operasyonel güç.",
        card_gene_sub: "Laboratuvar • Ar-Ge",
        card_gene_desc: "Kişiselleştirilmiş tıp, farmakogenetik analizler ve biyobelirteç takibi ile tedavinin genetik altyapısını çözümlüyoruz.",
        card_turp_sub: "Dijital Köprü",
        card_turp_desc: "Veriyi, hastayı ve araştırmacıyı birbirine bağlayan dijital platform. e-Nabız entegrasyonu ve yapay zeka destekli analiz.",
        
        // Metodoloji
        method_title: "Metodolojimiz: Veriden Sinyale",
        method_1_t: "ICH-GCP",
        method_1_d: "Uluslararası Standart",
        method_2_t: "Data Science",
        method_2_d: "Gelişmiş Analitik",
        method_3_t: "Sinyal Üretme",
        method_3_d: "Anlık Uyarılar",
        method_4_t: "RWE",
        method_4_d: "Gerçek Yaşam Verisi",
        
        // CTA
        cta_title: "Projelerinizde Deneyimin Gücünü Kullanın",
        cta_btn: "Bize Ulaşın"
      },

      // --- İLETİŞİM & FOOTER ---
      contact_title: "Bize Ulaşın",
      contact_name: "Adınız",
      contact_company: "Şirket",
      contact_email: "E-posta",
      contact_select: "İlgi Alanı Seçin",
      contact_btn: "Gönder",
      footer_platform: "Platform",
      footer_corp: "Kurumsal",
      footer_contact: "İletişim"
    }
  },
  en: {
    translation: {
      // --- NAVIGATION ---
      nav_home: "Home",
      nav_modules: "Modules",
      nav_solutions: "Solutions",
      nav_blog: "Blog",
      nav_admin: "Partner Access",

      // --- HOME (HERO) ---
      hero_badge: "USBS Approved & e-Pulse Integrated",
      hero_title_1: "Manage Facts,",
      hero_title_2: "Not Guesses.",
      hero_desc: "Turkey's first and only RWE platform validating participant data from the source for clinical trials.",
      btn_demo: "Request Demo",
      btn_explore: "Explore Platform",

      // --- SECTIONS ---
      sec_partners: "TRUSTED PARTNERS",
      sec_modules_title: "Core Modules",
      sec_modules_desc: "Customizable building blocks for every stage of your research.",
      sec_solutions_badge: "Sector Expertise",
      sec_solutions_title: "Therapeutic Area Solutions",
      sec_solutions_desc: "Vertical solutions developed for tracking specific diseases beyond general modules.",

      // --- ABOUT PAGE ---
      about: {
        back_home: "Back to Home",
        since: "Since 1997",
        hero_title_1: "As Turkey's First CRO,",
        hero_title_2: "We Build Future Proof.",
        hero_desc: "Born from Omega Research experience, Turp uses software not as a goal, but as a tool to reach scientific truth.",
        manifesto_head_1: "Not Software Focused,",
        manifesto_head_2: "Patient Focused.",
        manifesto_quote: "Collecting quality data strengthens the level of evidence.",
        manifesto_text: "While many tech firms try to 'learn' clinical research; we are the team planning, managing, and transforming these processes since 1997. Digitalization and IoT are tools to collect data in ICH-GCP standards.",
        eco_title: "Our Ecosystem",
        eco_sub: "End-to-end expertise in every step of clinical research.",
        
        // Cards
        card_cro_sub: "Strategic Mind • 1997",
        card_cro_desc: "Protocol design, ethics committee, and regulatory management. Establishing the legal and scientific backbone.",
        card_care_sub: "Field Force • Home Health",
        card_care_desc: "Operational force visiting patients at home, collecting samples, and administering medication with research nurses.",
        card_gene_sub: "Laboratory • R&D",
        card_gene_desc: "Deciphering the genetic infrastructure of treatment with personalized medicine, pharmacogenetic analysis, and biomarker tracking.",
        card_turp_sub: "Digital Bridge",
        card_turp_desc: "The digital platform connecting data, patients, and researchers. e-Pulse integration and AI-powered analysis.",
        
        // Methodology
        method_title: "Our Methodology: From Data to Signal",
        method_1_t: "ICH-GCP",
        method_1_d: "Intl. Standard",
        method_2_t: "Data Science",
        method_2_d: "Advanced Analytics",
        method_3_t: "Signal Gen.",
        method_3_d: "Instant Alerts",
        method_4_t: "RWE",
        method_4_d: "Real World Evidence",
        
        // CTA
        cta_title: "Leverage the Power of Experience in Your Projects",
        cta_btn: "Contact Us"
      },

      // --- CONTACT & FOOTER ---
      contact_title: "Contact Us",
      contact_name: "Your Name",
      contact_company: "Company",
      contact_email: "E-mail",
      contact_select: "Select Interest",
      contact_btn: "Send",
      footer_platform: "Platform",
      footer_corp: "Corporate",
      footer_contact: "Contact"
    }
  },
  zh: {
    translation: {
      nav_home: "主页",
      nav_modules: "模块",
      nav_solutions: "解决方案",
      nav_blog: "博客",
      nav_admin: "合作伙伴入口",
      hero_badge: "USBS认证 & e-Pulse集成",
      hero_title_1: "管理事实，",
      hero_title_2: "而非猜测。",
      hero_desc: "土耳其首个也是唯一一个从源头验证临床试验参与者数据的RWE平台。",
      btn_demo: "申请演示",
      btn_explore: "探索平台",
      // Çince'nin geri kalanı İngilizce fallback'e düşebilir veya buraya eklenebilir.
      about: {
         back_home: "返回主页",
         since: "自1997年以来",
         hero_title_1: "作为土耳其第一家CRO，",
         hero_title_2: "我们建立未来的证据。",
         hero_desc: "源于Omega Research的经验，Turp将软件视为达成科学真理的工具，而非最终目的。",
         manifesto_head_1: "不以软件为中心，",
         manifesto_head_2: "以患者为中心。",
         eco_title: "我们的生态系统",
         cta_btn: "联系我们"
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "tr", // Başlangıç dili
    fallbackLng: "en", // Dil bulunamazsa İngilizce kullan
    interpolation: {
      escapeValue: false // React XSS koruması zaten var
    }
  });

export default i18n;
