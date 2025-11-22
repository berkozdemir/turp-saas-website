import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  tr: {
    translation: {
      // --- NAVİGASYON ---
      nav_home: "Ana Sayfa",
      nav_modules: "Modüller",
      nav_solutions: "Çözümler",
      nav_blog: "Blog",
      nav_admin: "Partner Girişi",

      // --- HERO ---
      hero_badge: "USBS Onaylı & e-Nabız Entegreli",
      hero_title_1: "Tahminleri Değil,",
      hero_title_2: "Gerçekleri Yönetin.",
      hero_desc: "Klinik araştırmalarda katılımcı verilerini kaynağından doğrulayan, Türkiye'nin ilk ve tek RWE platformu.",
      btn_demo: "Demo Talep Et",
      btn_explore: "Platformu Keşfet",

      // --- BÖLÜMLER ---
      sec_partners: "GÜVENİLEN PARTNERLERİMİZ",
      sec_modules_title: "Temel Modüller",
      sec_modules_desc: "Araştırmanızın her aşaması için özelleştirilebilir yapı taşları.",
      sec_solutions_badge: "Sektörel Uzmanlık",
      sec_solutions_title: "Tedavi Alanlarına Özel Çözümler",
      sec_solutions_desc: "Genel modüllerin ötesinde, spesifik hastalıkların takibi için geliştirilmiş dikey çözümlerimiz.",
      
      // --- HAKKIMIZDA ---
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
        card_cro_sub: "Stratejik Akıl • 1997",
        card_cro_desc: "Protokol tasarımı, etik kurul ve regülasyon yönetimi. Türkiye'nin ilk CRO'su olarak projenin yasal ve bilimsel omurgasını kuruyoruz.",
        card_care_sub: "Saha Gücü • Evde Sağlık",
        card_care_desc: "Araştırma hemşireleri ile hastayı evinde ziyaret eden, numune alan ve ilacı uygulayan operasyonel güç.",
        card_gene_sub: "Laboratuvar • Ar-Ge",
        card_gene_desc: "Kişiselleştirilmiş tıp, farmakogenetik analizler ve biyobelirteç takibi ile tedavinin genetik altyapısını çözümlüyoruz.",
        card_turp_sub: "Dijital Köprü",
        card_turp_desc: "Veriyi, hastayı ve araştırmacıyı birbirine bağlayan dijital platform. e-Nabız entegrasyonu ve yapay zeka destekli analiz.",
        method_title: "Metodolojimiz: Veriden Sinyale",
        method_1_t: "ICH-GCP",
        method_1_d: "Uluslararası Standart",
        method_2_t: "Data Science",
        method_2_d: "Gelişmiş Analitik",
        method_3_t: "Sinyal Üretme",
        method_3_d: "Anlık Uyarılar",
        method_4_t: "RWE",
        method_4_d: "Gerçek Yaşam Verisi",
        cta_title: "Projelerinizde Deneyimin Gücünü Kullanın",
        cta_btn: "Bize Ulaşın"
      },

      // --- İLETİŞİM & FOOTER ---
      contact_title: "Bize Ulaşın",
      contact_name: "Adınız",
      contact_company: "Şirket",
      contact_email: "E-posta",
      contact_btn: "Gönder",
      
      // --- FORM SEÇENEKLERİ (TÜRKÇE - DÜZELTİLDİ) ---
      form_opt_select: "İlgi Alanı Seçin",
      form_opt_rwe: "RWE / Gözlemsel Çalışma",
      form_opt_phase: "Faz Çalışması (III/IV)", // Düzeltildi
      form_opt_device: "Medikal Cihaz Takibi",
      form_opt_general: "Genel Bilgi / Diğer",

      footer_platform: "Platform",
      footer_corp: "Kurumsal",
      footer_contact: "İletişim"
    }
  },
  en: {
    translation: {
      nav_home: "Home",
      nav_modules: "Modules",
      nav_solutions: "Solutions",
      nav_blog: "Blog",
      nav_admin: "Partner Access",
      hero_badge: "USBS Approved & e-Pulse Integrated",
      hero_title_1: "Manage Facts,",
      hero_title_2: "Not Guesses.",
      hero_desc: "Turkey's first and only RWE platform validating participant data from the source for clinical trials.",
      btn_demo: "Request Demo",
      btn_explore: "Explore Platform",
      sec_partners: "TRUSTED PARTNERS",
      sec_modules_title: "Core Modules",
      sec_modules_desc: "Customizable building blocks for every stage of your research.",
      sec_solutions_badge: "Sector Expertise",
      sec_solutions_title: "Therapeutic Area Solutions",
      sec_solutions_desc: "Vertical solutions developed for tracking specific diseases beyond general modules.",
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
        card_cro_sub: "Strategic Mind • 1997",
        card_cro_desc: "Protocol design, ethics committee, and regulatory management. Establishing the legal and scientific backbone.",
        card_care_sub: "Field Force • Home Health",
        card_care_desc: "Operational force visiting patients at home, collecting samples, and administering medication with research nurses.",
        card_gene_sub: "Laboratory • R&D",
        card_gene_desc: "Deciphering the genetic infrastructure of treatment with personalized medicine, pharmacogenetic analysis, and biomarker tracking.",
        card_turp_sub: "Digital Bridge",
        card_turp_desc: "The digital platform connecting data, patients, and researchers. e-Pulse integration and AI-powered analysis.",
        method_title: "Our Methodology: From Data to Signal",
        method_1_t: "ICH-GCP",
        method_1_d: "Intl. Standard",
        method_2_t: "Data Science",
        method_2_d: "Advanced Analytics",
        method_3_t: "Signal Gen.",
        method_3_d: "Instant Alerts",
        method_4_t: "RWE",
        method_4_d: "Real World Evidence",
        cta_title: "Leverage the Power of Experience in Your Projects",
        cta_btn: "Contact Us"
      },
      contact_title: "Contact Us",
      contact_name: "Your Name",
      contact_company: "Company",
      contact_email: "E-mail",
      contact_btn: "Send",
      
      // --- FORM OPTIONS (ENGLISH - DÜZELTİLDİ) ---
      form_opt_select: "Select Interest",
      form_opt_rwe: "RWE / Observational Study",
      form_opt_phase: "Phase Study (III/IV)", // Düzeltildi
      form_opt_device: "Medical Device Tracking",
      form_opt_general: "General Info / Other",

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

      sec_partners: "值得信赖的合作伙伴",
      sec_modules_title: "核心模块",
      sec_modules_desc: "适用于您研究各个阶段的可定制构建模块。",
      sec_solutions_badge: "行业专长",
      sec_solutions_title: "治疗领域解决方案",
      sec_solutions_desc: "超越通用模块，专为特定疾病追踪开发的垂直解决方案。",

      about: {
        back_home: "返回主页",
        since: "自1997年以来",
        hero_title_1: "作为土耳其第一家CRO，",
        hero_title_2: "我们构建未来的证据。",
        hero_desc: "源于Omega Research的经验，Turp将软件视为达成科学真理的工具，而非最终目的。",
        manifesto_head_1: "不以软件为中心，",
        manifesto_head_2: "以患者为中心。",
        manifesto_quote: "收集高质量数据可加强证据等级。",
        manifesto_text: "虽然许多科技公司试图“学习”临床研究，但我们是自1997年以来规划、管理和变革这些流程的团队。数字化和物联网是按照ICH-GCP标准收集数据的工具。",
        eco_title: "我们的生态系统",
        eco_sub: "临床研究每一步的端到端专业知识。",
        card_cro_sub: "战略思维 • 1997",
        card_cro_desc: "方案设计、伦理委员会和法规管理。建立法律和科学的骨干。",
        card_care_sub: "现场力量 • 家庭健康",
        card_care_desc: "研究护士上门探访患者、采集样本并给药的运营力量。",
        card_gene_sub: "实验室 • 研发",
        card_gene_desc: "通过个性化医疗、药物基因组学分析和生物标志物追踪，破译治疗的遗传基础。",
        card_turp_sub: "数字桥梁",
        card_turp_desc: "连接数据、患者和研究人员的数字平台。e-Pulse集成和AI驱动的分析。",
        method_title: "我们的方法论：从数据到信号",
        method_1_t: "ICH-GCP",
        method_1_d: "国际标准",
        method_2_t: "数据科学",
        method_2_d: "高级分析",
        method_3_t: "信号生成",
        method_3_d: "即时警报",
        method_4_t: "RWE",
        method_4_d: "真实世界证据",
        cta_title: "在您的项目中利用经验的力量",
        cta_btn: "联系我们"
      },

      contact_title: "联系我们",
      contact_name: "您的姓名",
      contact_company: "公司",
      contact_email: "电子邮件",
      contact_btn: "发送",

      // --- FORM OPTIONS (CHINESE - DÜZELTİLDİ) ---
      form_opt_select: "选择感兴趣的领域",
      form_opt_rwe: "RWE / 观察性研究",
      form_opt_phase: "临床分期研究 (III/IV)", // Düzeltildi
      form_opt_device: "医疗器械追踪",
      form_opt_general: "一般信息 / 其他",

      footer_platform: "平台",
      footer_corp: "企业",
      footer_contact: "联系方式"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "tr", 
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
