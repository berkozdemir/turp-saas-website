import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  // --- TÜRKÇE (TR) ---
  tr: {
    translation: {
      // --- NAVİGASYON ---
      "nav_home": "Ana Sayfa",
      "nav_blog": "Blog & Haberler",
      "nav_admin": "Yönetim",
      "nav_modules": "Modüller",
      "nav_solutions": "Senaryolar",
      "nav_faq": "SSS",
      "nav_about": "Hakkımızda",

      // --- HERO ---
      "hero_badge": "USBS Onaylı & e-Nabız Entegreli",
      "hero_title_1": "Tahminleri Değil,",
      "hero_title_2": "Gerçekleri Yönetin.",
      "hero_desc": "Klinik araştırmalarda katılımcı verilerini kaynağından doğrulayan, Türkiye'nin ilk ve tek RWE platformu.",
      "btn_demo": "Demo Talep Et",
      "btn_discover": "Maliyet Avantajınızı Görün",

      // --- ORTAK ---
      "partners_title": "GÜVENİLEN PARTNERLERİMİZ",
      "sec_partners": "GÜVENİLEN PARTNERLERİMİZ",

      // --- İLETİŞİM FORMU ---
      "contact_title": "Araştırmanızı Başlatın",
      "contact_desc": "Uzman ekibimiz size özel bir demo hazırlasın.",
      "form_name": "Adınız",
      "form_surname": "Soyadınız",
      "form_company": "Şirket",
      "form_email": "Kurumsal E-posta",
      "form_phone": "Telefon",
      "form_centers": "Merkez Sayısı",
      "form_volunteers": "Gönüllü Sayısı",
      "form_duration": "Çalışma Süresi (Ay)",
      "form_type": "Çalışma Türü",
      "form_phase": "Çalışma Fazı",
      "form_countries": "Hedef Ülkeler",
      "form_select": "Seçiniz",
      "form_opt_select": "İlgi Alanı Seçin",
      "form_opt_rwe": "RWE / Gözlemsel Çalışma",
      "form_opt_phase": "Faz Çalışması (III/IV)",
      "form_opt_device": "Medikal Cihaz Takibi",
      "form_opt_general": "Genel Bilgi / Diğer",
      "form_kvkk": "KVKK / Aydınlatma Metni'ni okudum, onaylıyorum.",
      "form_send": "Gönder",
      "form_message": "Mesajınız...",
      "form_consent_text": "Kişisel verilerimin KVKK kapsamında işlenmesini ve tarafıma geri dönüş yapılmasını kabul ediyorum.",
      "form_consent_error": "Lütfen KVKK metnini onaylayınız.",
      "form_success_title": "Başvurunuz Alındı!",
      "form_success_desc": "Uzman ekibimiz en kısa sürede dönüş yapacaktır.",
      "form_new": "Yeni Talep",
      "form_kvkk_alert": "Lütfen KVKK metnini onaylayın.",
      "contact_btn": "Gönder",
      "contact_name": "Adınız",
      "contact_company": "Şirket",
      "contact_email": "E-posta",
      "contact_select": "İlgi Alanı Seçin",

      // --- MODÜLLER GENEL ---
      "modules_title": "Teknoloji ile Güçlendirilmiş Çözümler",
      "modules_desc": "Detaylı bilgi için modüllere tıklayın.",
      "sec_modules_title": "Temel Modüller",
      "sec_modules_desc": "Araştırmanızın her aşaması için özelleştirilebilir yapı taşları.",
      "module_btn_detail": "Bu Modülü Talep Et",
      "module_back": "Ana Sayfaya Dön",
      "module_why": "Neden Bu Modül?",
      "module_tech": "Teknik Özellikler",
      "module_cta_title": "Bu Modülü Projenize Ekleyin",
      "module_cta_desc": "Turp ekosistemi modülerdir. Sadece ihtiyacınız olanı kullanın.",
      "module_cta_btn": "İletişime Geçin",

      // --- SEKTÖREL ÇÖZÜMLER ---
      "sec_solutions_badge": "Sektörel Uzmanlık",
      "sec_solutions_title": "Tedavi Alanlarına Özel Çözümler",
      "sec_solutions_desc": "Genel modüllerin ötesinde, spesifik hastalıkların takibi için geliştirilmiş dikey çözümlerimiz.",

      // --- MODÜLLER DETAY ---
      "mod_survey_title": "ePRO & Anket Modülü", "mod_survey_short": "Kağıt formları unutun. Veriyi kaynağında yakalayın.", "mod_survey_desc": "Katılımcıların yaşam kalitesi ölçeklerini ve semptomlarını mobil uygulama üzerinden anlık ve güvenilir toplayın.", "mod_survey_d1": "Recall Bias (Hatırlama Yanılgısı) sorununu ortadan kaldırır.", "mod_survey_d2": "FDA 21 CFR Part 11 uyumlu elektronik imza ve denetim izi.", "mod_survey_d3": "Dinamik dallanma mantığı (Branching Logic) ile akıllı sorular.",

      "mod_med_title": "İlaç Hatırlatma", "mod_med_short": "Tedavi uyumunu şansa bırakmayın.", "mod_med_desc": "Akıllı bildirimler ve görsel teyit sistemleri ile 'Adherence' oranlarını %90'ın üzerine çıkarın.", "mod_med_d1": "Hasta beyanına değil, dijital kesinliğe dayalı takip.", "mod_med_d2": "Hastanın yaşam döngüsüne uyumlu akıllı erteleme.", "mod_med_d3": "İlaç bitmeden otomatik stok ve lojistik uyarısı.",

      "mod_vital_title": "Vital Ölçüm & IoT", "mod_vital_short": "Klinik dışında kesintisiz gözlem.", "mod_vital_desc": "Tansiyon, şeker, nabız verilerini Apple Health, Google Fit veya Bluetooth cihazlardan otomatik çekin.", "mod_vital_d1": "Beyaz Önlük Hipertansiyonu etkisini elimine eder.", "mod_vital_d2": "BYOD (Kendi Cihazını Getir) desteği.", "mod_vital_d3": "Referans dışı değerlerde doktora 'Erken Uyarı'.",

      "mod_appt_title": "Randevu Yönetimi", "mod_appt_short": "No-Show oranlarını minimize edin.", "mod_appt_desc": "Karmaşık protokol takvimini hastanın cebine indirin. Saha ziyaretlerini otomatik organize edin.", "mod_appt_d1": "Lojistik zorlukları ve unutulan randevuları engeller.", "mod_appt_d2": "Otomatik vizit penceresi hesaplama.", "mod_appt_d3": "Hastane konumu ve yol tarifi entegrasyonu.",

      "mod_adv_title": "Yan Etki Bildirimi", "mod_adv_short": "Farmakovijilans için en hızlı yol.", "mod_adv_desc": "Beklenmedik durumları anında bildiren, 7/24 açık acil durum köprüsü.", "mod_adv_d1": "Hasta güvenliği ve etik kurallar için anlık bildirim.", "mod_adv_d2": "Basit semptom seçimi ile kolay kullanım.", "mod_adv_d3": "Ciddi Yan Etki (SAE) durumunda anında alarm.",

      "mod_edu_title": "Eğitim & eConsent", "mod_edu_short": "Bilinçli hasta, başarılı araştırma.", "mod_edu_desc": "Onam formlarını dijitalleştirin ve hastaları interaktif videolarla eğitin.", "mod_edu_d1": "İmza sürecini dijital ve anlaşılır hale getirir.", "mod_edu_d2": "Video ve animasyonlarla protokol eğitimi.", "mod_edu_d3": "7/24 erişilebilir hasta kütüphanesi.",

      "mod_web_title": "Webinar & Tele-Vizit", "mod_web_short": "Mekan bağımsız klinik araştırma.", "mod_web_desc": "Uygulama üzerinden güvenli, şifreli ve KVKK uyumlu görüntülü görüşme.", "mod_web_d1": "Tıbbi verilerin korunması için şifreli altyapı.", "mod_web_d2": "Doktor ekran paylaşımı ile veri gösterimi.", "mod_web_d3": "Denetimler için otomatik süre loglaması.",

      // --- ANA SAYFA BÖLÜMLERİ ---
      "prob_title": "Geleneksel Yöntemler Yetersiz", "prob_desc": "Manuel süreçler veri güvenilirliğini düşürürken maliyetleri artırıyor.",
      "bad_1": "Hasta beyanına dayalı, güvensiz veri.", "bad_2": "Manuel giriş hataları.", "bad_3": "Yüksek 'Drop-out' oranları.",
      "good_1": "e-Nabız ile %100 dijital doğrulama.", "good_2": "Anlık ve otomatik raporlama.", "good_3": "Akıllı bildirimlerle yüksek uyum.",

      "stat_1": "Daha Hızlı Hasta Alımı", "stat_2": "Veri Doğruluğu", "stat_3": "Maliyet Tasarrufu", "stat_4": "Gerçek Zamanlı İzleme",

      "flow_title": "Süreç Nasıl İşler?",
      "flow_1_t": "Kurulum", "flow_1_d": "Sponsor paneli entegrasyonu.",
      "flow_2_t": "Davet", "flow_2_d": "Hastalara mobil uygulama linki.",
      "flow_3_t": "Onay", "flow_3_d": "Hasta e-Nabız onayı verir.",
      "flow_4_t": "Akış", "flow_4_d": "Gerçek zamanlı veri akışı başlar.",

      "faq_title": "Sıkça Sorulan Sorular",
      "faq_1_q": "e-Nabız verisi için onay gerekiyor mu?", "faq_1_a": "Evet, KVKK gereği hastanın mobil uygulama üzerinden açık rıza vermesi zorunludur.",
      "faq_2_q": "Mevcut EDC sistemimizle entegre olur mu?", "faq_2_a": "Evet, Turp modern REST API ile EDC sistemleriyle konuşabilir.",
      "faq_3_q": "Hangi verileri çekebiliyoruz?", "faq_3_a": "Tanılar, reçeteler, radyoloji ve tahlil sonuçları.",

      // BLOG
      "blog_no_posts": "Henüz yazı yok.",
      "blog_read_more": "Devamını Oku",

      // --- HAKKIMIZDA (ABOUT) ---
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
        card_gene_desc: "Kişiselleştirilmiş tıp, sitogenetik, moleküler ve farmakogenetik analizler ve biyobelirteç takibi ile tedavinin genetik altyapısını çözümlüyoruz.",
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

      // --- FOOTER ---
      "footer_platform": "Platform",
      "footer_corp": "Kurumsal",
      "footer_contact": "İletişim",

      // --- ROI HESAPLAYICI ---
      "roi_badge": "Gelişmiş Maliyet Analizi",
      "roi_title": "Yatırım Getirisi (ROI)",
      "roi_desc": "Saha operasyonlarını dijitalleştirerek elde edeceğiniz devasa tasarrufu hesaplayın.",
      "roi_scope_title": "Çalışma Kapsamı",
      "roi_patient_count": "Gönüllü Sayısı",
      "roi_visit_count": "Vizit Sayısı",
      "roi_duration": "Süre (Ay)",
      "roi_settings_title": "Maliyet Varsayımları",
      "roi_trad_times": "Geleneksel Süreler (Dk)",
      "roi_cra": "CRA",
      "roi_sdc": "SDC",
      "roi_turp_times": "Turp ile Süreler (Dk)",
      "roi_salaries": "Maaş & Giderler",
      "roi_cra_monthly": "CRA Aylık",
      "roi_cra_daily": "CRA Harcırah",
      "roi_sdc_monthly": "SDC Aylık",
      "roi_others": "Diğer Giderler (Vizit Başı)",
      "roi_breakdown_title": "Saha & Hasta Giderleri",
      "roi_item_inv": "Araştırıcı Ödemesi",
      "roi_item_inst": "Kurum Ödemesi",
      "roi_item_vol": "Gönüllü Ödemesi",
      "roi_travel_fee": "Hasta Yol",
      "roi_license": "Turp Lisans (Gün)",
      "roi_saving_title": "Tahmini Toplam Tasarruf",
      "roi_profitable": "Daha Karlı",
      "roi_loss": "Maliyet Artışı",
      "roi_result_desc": "Dijitalleşme ile saha görevlilerinin zamanını %90'a varan oranda boşa çıkarmak, lisans maliyetini kat kat amorti eder.",
      "roi_trad_label": "Geleneksel",
      "roi_trad_sub": "Mevcut Durum",
      "roi_turp_label": "Turp Yöntemi",
      "roi_turp_sub": "Yeni Nesil",
      "roi_total": "Toplam",

      // --- FAQ SAYFASI ---
      "faq_page": {
        "help_center": "Yardım Merkezi",
        "title": "Sıkça Sorulan Sorular",
        "subtitle": "TURP platformu hakkında merak ettiklerinizi burada bulabilirsiniz.",
        "search_placeholder": "Soru ara...",
        "all_categories": "Tüm Kategoriler",
        "loading": "Yükleniyor...",
        "no_results": "Aramanızla eşleşen soru bulunamadı.",
        "no_faqs": "Henüz SSS eklenmemiş."
      },

      // --- RHEUMA CASE STUDY ---
      "case_rheuma": {
        "back_home": "Ana Sayfaya Dön",
        "badge": "Romatoloji Hibrit Model",
        "title": "Romatoloji Kayıt Sistemi Projesi",
        "desc": "Romatoid Artrit (RA) ve Ankilozan Spondilit (AS) hastalarında, hastane vizitlerini dijitalleştirerek hekim zamanından %45 tasarruf sağlayan hibrit izlem modeli.",
        "problem_title": "Mevcut Sorun",
        "problem_1_t": "Kısıtlı Poliklinik Süresi",
        "problem_1_d": "Hekimler, 45 dakikalık vizit süresinin büyük kısmını anket doldurmaya harcıyor.",
        "problem_2_t": "Recall Bias (Hatırlama Yanılgısı)",
        "problem_2_d": "Hasta, doktora o anki durumunu anlatıyor; iki hafta önceki ağrısını hatırlayamıyor.",
        "solution_badge": "Turp Çözümü",
        "solution_title": "Dijital Entegrasyon",
        "solution_desc": "Hasta hastaneye gelmeden 48 saat önce tüm ölçekleri evinden doldurur. Hekim, hasta odaya girdiğinde veriyi hazır bulur.",
        "solution_metric": "%75 Daha Hızlı",
        "flow_title": "Hibrit Vizit Akışı",
        "flow_1_t": "1. Evde Başlangıç", "flow_1_d": "T-48 Saat kala hastaya anket bildirimi gider.",
        "flow_2_t": "2. ePRO Veri Girişi", "flow_2_d": "Hasta HAQ, BASDAI gibi ölçekleri evinde doldurur.",
        "flow_3_t": "3. Sinyal Analizi", "flow_3_d": "Sistem skorları hesaplar, risk varsa hekimi uyarır.",
        "flow_4_t": "4. Odaklı Vizit", "flow_4_d": "Hekim sadece fizik muayeneye odaklanır.",
        "stats_title": "Ölçümlenen Değer",
        "stat_time_title": "Hekim Zaman Kullanımı",
        "stat_time_trad": "Geleneksel (40 dk)", "stat_time_trad_input": "Veri Girişi: 20dk",
        "stat_time_turp": "Turp Modeli (15 dk)", "stat_time_turp_input": "Veri Girişi: 0dk",
        "stat_time_desc": "Anket yükü kalktığı için vizit süresi %65 azalır.",
        "stat_data_title": "Veri Doğruluğu",
        "stat_data_paper": "Kağıt (%70)", "stat_data_turp": "Turp (%98)",
        "stat_data_desc": "Dijital validasyon sayesinde hatalı veri girişi engellenir.",
        "cta_title": "Bu Modeli Çalışmanızda Uygulayın",
        "cta_btn": "Maliyet Analizi Yap"
      }
    }
  },

  // --- İNGİLİZCE (EN) ---
  en: {
    translation: {
      // NAVIGATION
      "nav_home": "Home",
      "nav_blog": "Blog & News",
      "nav_admin": "Admin",
      "nav_modules": "Modules",
      "nav_solutions": "Solutions",
      "nav_faq": "FAQ",
      "nav_about": "About",

      // HERO
      "hero_badge": "USBS Approved & e-Pulse Integrated",
      "hero_title_1": "Manage Facts,",
      "hero_title_2": "Not Guesses.",
      "hero_desc": "The first and only RWE platform verifying participant data from the source for clinical trials.",
      "btn_demo": "Request Demo",
      "btn_explore": "See Your Cost Advantage",
      "btn_discover": "See Your Cost Advantage",

      // COMMON
      "partners_title": "TRUSTED PARTNERS",
      "sec_partners": "TRUSTED PARTNERS",

      // CONTACT FORM
      "contact_title": "Start Your Research",
      "contact_desc": "Let our expert team prepare a custom demo for you.",
      "form_name": "First Name",
      "form_surname": "Last Name",
      "form_company": "Company",
      "form_email": "Corporate Email",
      "form_phone": "Phone",
      "form_centers": "Number of Centers",
      "form_volunteers": "Number of Volunteers",
      "form_duration": "Study Duration (Months)",
      "form_type": "Study Type",
      "form_phase": "Study Phase",
      "form_countries": "Target Countries",
      "form_select": "Select",
      "form_opt_select": "Select Interest",
      "form_opt_rwe": "RWE / Observational",
      "form_opt_int": "Interventional",
      "form_opt_phase": "Phase Study (III/IV)",
      "form_opt_device": "Medical Device Tracking",
      "form_opt_general": "General Info / Other",
      "form_kvkk": "I have read and accept the Privacy Policy.",
      "form_send": "Start Calculation",
      "form_message": "Your message...",
      "form_consent_text": "I consent to the processing of my personal data and being contacted regarding my inquiry.",
      "form_consent_error": "Please accept the privacy policy.",
      "form_success_title": "Application Received!",
      "form_success_desc": "Our team will contact you shortly.",
      "form_new": "New Request",
      "form_kvkk_alert": "Please accept the Privacy Policy.",
      "contact_btn": "Send",
      "contact_name": "Your Name",
      "contact_company": "Company",
      "contact_email": "E-mail",
      "contact_select": "Select Interest",

      // MODULES GENERAL
      "modules_title": "Tech-Empowered Solutions",
      "modules_desc": "Click modules for details.",
      "sec_modules_title": "Core Modules",
      "sec_modules_desc": "Customizable building blocks for every stage of your research.",
      "module_btn_detail": "Request Module",
      "module_back": "Back to Home",
      "module_why": "Why This Module?",
      "module_tech": "Technical Specs",
      "module_cta_title": "Add to Your Project",
      "module_cta_desc": "Turp is modular. Use only what you need.",
      "module_cta_btn": "Contact Us",

      // SOLUTIONS
      "sec_solutions_badge": "Sector Expertise",
      "sec_solutions_title": "Therapeutic Area Solutions",
      "sec_solutions_desc": "Vertical solutions developed for tracking specific diseases beyond general modules.",

      // MODULES DETAIL
      "mod_survey_title": "ePRO & Survey", "mod_survey_short": "Forget paper forms.", "mod_survey_desc": "Collect Quality of Life scales instantly.",
      "mod_survey_d1": "Eliminates Recall Bias.", "mod_survey_d2": "FDA 21 CFR Part 11 compliant.", "mod_survey_d3": "Smart Branching Logic.",

      "mod_med_title": "Medication Adherence", "mod_med_short": "Smart tracking system.", "mod_med_desc": "Boost adherence with smart alerts.",
      "mod_med_d1": "Digital certainty.", "mod_med_d2": "Smart snooze.", "mod_med_d3": "Stock alerts.",

      "mod_vital_title": "Vitals & IoT", "mod_vital_short": "Continuous observation.", "mod_vital_desc": "Auto-fetch vitals from devices.",
      "mod_vital_d1": "Eliminates White Coat Hypertension.", "mod_vital_d2": "BYOD support.", "mod_vital_d3": "Early Warning.",

      "mod_appt_title": "Visit Management", "mod_appt_short": "Minimize No-Show rates.", "mod_appt_desc": "Digital protocol calendar.",
      "mod_appt_d1": "Prevents forgotten appointments.", "mod_appt_d2": "Auto visit window.", "mod_appt_d3": "Navigation integration.",

      "mod_adv_title": "Adverse Events", "mod_adv_short": "Fastest pharmacovigilance.", "mod_adv_desc": "24/7 emergency bridge.",
      "mod_adv_d1": "Instant reporting.", "mod_adv_d2": "Visual proof.", "mod_adv_d3": "Instant SAE alarms.",

      "mod_edu_title": "Education & eConsent", "mod_edu_short": "Informed patient.", "mod_edu_desc": "Digitize consent forms.",
      "mod_edu_d1": "Digital signing.", "mod_edu_d2": "Video training.", "mod_edu_d3": "24/7 library.",

      "mod_web_title": "Webinar & Tele-Visit", "mod_web_short": "Location-independent.", "mod_web_desc": "Secure video calls.",
      "mod_web_d1": "Encrypted infrastructure.", "mod_web_d2": "Screen sharing.", "mod_web_d3": "Auto-logging.",

      // HOME SECTIONS
      "prob_title": "Traditional Methods Fail", "prob_desc": "Manual processes reduce reliability.",
      "bad_1": "Unverified data.", "bad_2": "Manual errors.", "bad_3": "High Drop-out.",
      "good_1": "100% digital verification.", "good_2": "Automated reporting.", "good_3": "High adherence.",

      "stat_1": "Faster Recruitment", "stat_2": "Data Accuracy", "stat_3": "Cost Saving", "stat_4": "Real-Time Monitoring",

      "flow_title": "How It Works?",
      "flow_1_t": "Setup", "flow_1_d": "Sponsor integration.",
      "flow_2_t": "Invite", "flow_2_d": "App link sent.",
      "flow_3_t": "Consent", "flow_3_d": "Patient approves.",
      "flow_4_t": "Flow", "flow_4_d": "Data flow begins.",

      "faq_title": "Frequently Asked Questions",
      "faq_1_q": "Is consent required?", "faq_1_a": "Yes, explicit consent is mandatory.",
      "faq_2_q": "Integrate with EDC?", "faq_2_a": "Yes, seamless API integration.",
      "faq_3_q": "Which data?", "faq_3_a": "Diagnoses, prescriptions, labs.",

      // BLOG
      "blog_no_posts": "No posts yet.",
      "blog_read_more": "Read More",

      // ABOUT
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

      // FOOTER
      "footer_platform": "Platform",
      "footer_corp": "Corporate",
      "footer_contact": "Contact",

      // ROI
      "roi_badge": "Advanced Cost Analysis",
      "roi_title": "Return on Investment (ROI)",
      "roi_desc": "Calculate savings by digitizing field operations.",
      "roi_scope_title": "Study Scope",
      "roi_patient_count": "Subjects", "roi_visit_count": "Visits", "roi_duration": "Duration (Months)",
      "roi_settings_title": "Cost Assumptions",
      "roi_trad_times": "Traditional Times (Min)",
      "roi_cra": "CRA", "roi_sdc": "SDC",
      "roi_turp_times": "Turp Times (Min)",
      "roi_salaries": "Salaries & Expenses",
      "roi_cra_monthly": "CRA Monthly", "roi_cra_daily": "CRA Expenses", "roi_sdc_monthly": "SDC Monthly",
      "roi_others": "Other Expenses (Per Visit)",
      "roi_breakdown_title": "Site & Patient Costs",
      "roi_item_inv": "Investigator Fee",
      "roi_item_inst": "Institution Fee",
      "roi_item_vol": "Volunteer Payment",
      "roi_travel_fee": "Patient Travel",
      "roi_license": "Turp License (Day)",
      "roi_saving_title": "Estimated Total Savings",
      "roi_profitable": "More Profitable", "roi_loss": "Cost Increase",
      "roi_result_desc": "Digitization reduces field staff time by 90%, covering license costs.",
      "roi_trad_label": "Traditional", "roi_trad_sub": "Current State",
      "roi_turp_label": "Turp Method", "roi_turp_sub": "Next Generation",
      "roi_total": "Total",

      // --- FAQ PAGE ---
      "faq_page": {
        "help_center": "Help Center",
        "title": "Frequently Asked Questions",
        "subtitle": "Find answers to your questions about the TURP platform here.",
        "search_placeholder": "Search questions...",
        "all_categories": "All Categories",
        "loading": "Loading...",
        "no_results": "No questions found matching your search.",
        "no_faqs": "No FAQs added yet."
      },

      // --- RHEUMA CASE STUDY ---
      "case_rheuma": {
        "back_home": "Back to Home",
        "badge": "Rheumatology Hybrid Model",
        "title": "Rheumatology Registry System Project",
        "desc": "A hybrid monitoring model for Rheumatoid Arthritis (RA) and Ankylosing Spondylitis (AS) patients that saves 45% of physician time by digitizing hospital visits.",
        "problem_title": "Current Problem",
        "problem_1_t": "Limited Outpatient Time",
        "problem_1_d": "Physicians spend most of the 45-minute visit filling out surveys.",
        "problem_2_t": "Recall Bias",
        "problem_2_d": "Patients describe their current state but cannot remember pain from two weeks ago.",
        "solution_badge": "Turp Solution",
        "solution_title": "Digital Integration",
        "solution_desc": "Patients fill out all scales from home 48 hours before coming to the hospital. Data is ready when the patient enters the room.",
        "solution_metric": "75% Faster",
        "flow_title": "Hybrid Visit Flow",
        "flow_1_t": "1. Start at Home", "flow_1_d": "Patient receives notification 48H prior.",
        "flow_2_t": "2. ePRO Entry", "flow_2_d": "Patient fills HAQ, BASDAI scales at home.",
        "flow_3_t": "3. Signal Analysis", "flow_3_d": "System calculates scores, alerts physician if risk exists.",
        "flow_4_t": "4. Focused Visit", "flow_4_d": "Physician focuses only on physical examination.",
        "stats_title": "Measured Value",
        "stat_time_title": "Physician Time Usage",
        "stat_time_trad": "Traditional (40 min)", "stat_time_trad_input": "Data Entry: 20min",
        "stat_time_turp": "Turp Model (15 min)", "stat_time_turp_input": "Data Entry: 0min",
        "stat_time_desc": "Visit time reduced by 65% as survey burden is removed.",
        "stat_data_title": "Data Accuracy",
        "stat_data_paper": "Paper (70%)", "stat_data_turp": "Turp (98%)",
        "stat_data_desc": "Incorrect data entry is prevented thanks to digital validation.",
        "cta_title": "Apply This Model to Your Study",
        "cta_btn": "Run Cost Analysis"
      }
    }
  },

  // --- ÇİNCE (ZH) ---
  zh: {
    translation: {
      // NAVIGATION
      "nav_home": "首页",
      "nav_blog": "博客",
      "nav_admin": "管理",
      "nav_modules": "模块",
      "nav_solutions": "解决方案",
      "nav_faq": "常见问题",
      "nav_about": "关于我们",

      // HERO
      "hero_badge": "系统认证 & 电子健康集成",
      "hero_title_1": "管理事实，",
      "hero_title_2": "而非猜测。",
      "hero_desc": "首个从源头验证临床试验参与者数据的 RWE 平台。",
      "btn_demo": "申请演示",
      "btn_explore": "查看您的成本优势",
      "btn_discover": "查看您的成本优势",

      // COMMON
      "partners_title": "值得信赖的合作伙伴",
      "sec_partners": "值得信赖的合作伙伴",

      // CONTACT FORM
      "contact_title": "开始您的研究",
      "contact_desc": "让我们的专家团队为您准备定制演示。",
      "form_name": "名字",
      "form_surname": "姓氏",
      "form_company": "公司",
      "form_email": "企业邮箱",
      "form_phone": "电话",
      "form_centers": "中心数量",
      "form_volunteers": "志愿者数量",
      "form_duration": "研究持续时间（月）",
      "form_type": "研究类型",
      "form_phase": "研究阶段",
      "form_countries": "目标国家",
      "form_select": "选择",
      "form_opt_select": "选择感兴趣的领域",
      "form_opt_rwe": "RWE / 观察性",
      "form_opt_int": "干预性",
      "form_opt_phase": "临床分期研究 (III/IV)",
      "form_opt_device": "医疗器械追踪",
      "form_opt_general": "一般信息 / 其他",
      "form_kvkk": "我已阅读并接受隐私政策。",
      "form_send": "开始计算",
      "form_message": "您的留言...",
      "form_consent_text": "我同意处理我的个人数据并就我的咨询与我联系。",
      "form_consent_error": "请接受隐私政策。",
      "form_success_title": "申请已收到！",
      "form_success_desc": "我们的团队将尽快与您联系。",
      "form_new": "新要求",
      "form_kvkk_alert": "请接受隐私政策。",
      "contact_btn": "发送",
      "contact_name": "您的姓名",
      "contact_company": "公司",
      "contact_email": "电子邮件",
      "contact_select": "选择感兴趣的领域",

      // MODULES
      "modules_title": "技术赋能解决方案",
      "modules_desc": "点击模块了解详情。",
      "sec_modules_title": "核心模块",
      "sec_modules_desc": "适用于您研究各个阶段的可定制构建模块。",
      "module_btn_detail": "申请此模块",
      "module_back": "返回首页",
      "module_why": "为什么选择此模块？",
      "module_tech": "技术规格",
      "module_cta_title": "添加到您的项目",
      "module_cta_desc": "Turp 是模块化的。",
      "module_cta_btn": "联系我们",

      // SOLUTIONS
      "sec_solutions_badge": "行业专长",
      "sec_solutions_title": "治疗领域解决方案",
      "sec_solutions_desc": "超越通用模块，专为特定疾病追踪开发的垂直解决方案。",

      // MODULES DETAIL
      "mod_survey_title": "ePRO & 问卷", "mod_survey_short": "忘记纸质表格。", "mod_survey_desc": "即时收集生活质量量表。",
      "mod_survey_d1": "消除回忆偏差。", "mod_survey_d2": "符合 FDA 21 CFR Part 11。", "mod_survey_d3": "智能分支逻辑。",

      "mod_med_title": "药物依从性", "mod_med_short": "智能追踪。", "mod_med_desc": "通过智能提醒提高依从性。",
      "mod_med_d1": "数字确定性。", "mod_med_d2": "智能贪睡。", "mod_med_d3": "库存警报。",

      "mod_vital_title": "生命体征 & 物联网", "mod_vital_short": "持续观察。", "mod_vital_desc": "自动获取生命体征。",
      "mod_vital_d1": "消除白大衣高血压。", "mod_vital_d2": "支持 BYOD。", "mod_vital_d3": "早期预警。",

      "mod_appt_title": "访视管理", "mod_appt_short": "减少缺席。", "mod_appt_desc": "数字日历。",
      "mod_appt_d1": "防止忘记。", "mod_appt_d2": "自动访视窗口。", "mod_appt_d3": "导航集成。",

      "mod_adv_title": "不良事件", "mod_adv_short": "最快途径。", "mod_adv_desc": "24/7 紧急桥梁。",
      "mod_adv_d1": "即时报告。", "mod_adv_d2": "视觉证据。", "mod_adv_d3": "SAE 警报。",

      "mod_edu_title": "教育 & 同意", "mod_edu_short": "知情的患者。", "mod_edu_desc": "数字化同意书。",
      "mod_edu_d1": "数字签署。", "mod_edu_d2": "视频培训。", "mod_edu_d3": "资料库。",

      "mod_web_title": "网络研讨会", "mod_web_short": "无地点限制。", "mod_web_desc": "安全视频通话。",
      "mod_web_d1": "加密基础设施。", "mod_web_d2": "屏幕共享。", "mod_web_d3": "自动记录。",

      // HOME SECTIONS
      "prob_title": "传统方法失效", "prob_desc": "手动流程降低可靠性。",
      "bad_1": "未验证数据。", "bad_2": "手动错误。", "bad_3": "高脱落率。",
      "good_1": "100% 数字验证。", "good_2": "自动报告。", "good_3": "高依从性。",

      "stat_1": "更快的招募", "stat_2": "数据准确性", "stat_3": "成本节省", "stat_4": "实时监控",

      "flow_title": "工作原理？", "flow_1_t": "设置", "flow_1_d": "集成。", "flow_2_t": "邀请", "flow_2_d": "发送链接。", "flow_3_t": "同意", "flow_3_d": "批准共享。", "flow_4_t": "流程", "flow_4_d": "数据流开始。",

      "faq_title": "常见问题", "faq_1_q": "需要同意吗？", "faq_1_a": "是的，必须明确同意。", "faq_2_q": "与 EDC 集成？", "faq_2_a": "是的，通过 API。", "faq_3_q": "哪些数据?", "faq_3_a": "诊断、处方、结果。",

      // BLOG
      "blog_no_posts": "暂无文章",
      "blog_read_more": "阅读更多",

      // ABOUT
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

      // FOOTER
      "footer_platform": "平台",
      "footer_corp": "企业",
      "footer_contact": "联系方式",

      // ROI
      "roi_badge": "高级成本分析",
      "roi_title": "投资回报率 (ROI)",
      "roi_desc": "计算数字化带来的节省。",
      "roi_scope_title": "研究范围",
      "roi_patient_count": "受试者数", "roi_visit_count": "访视数", "roi_duration": "持续时间（月）",
      "roi_settings_title": "成本假设",
      "roi_trad_times": "传统时间（分）",
      "roi_cra": "CRA", "roi_sdc": "SDC",
      "roi_turp_times": "Turp 时间（分）",
      "roi_salaries": "薪资",
      "roi_cra_monthly": "CRA 月薪", "roi_cra_daily": "CRA 津贴", "roi_sdc_monthly": "SDC 月薪",
      "roi_others": "其他费用",
      "roi_breakdown_title": "现场和患者费用",
      "roi_item_inv": "研究者费用",
      "roi_item_inst": "机构费用",
      "roi_item_vol": "志愿者费用",
      "roi_travel_fee": "差旅",
      "roi_license": "Turp 许可（天）",
      "roi_saving_title": "预计总节省",
      "roi_profitable": "更有利", "roi_loss": "成本增加",
      "roi_result_desc": "数字化释放 90% 时间。",
      "roi_trad_label": "传统", "roi_trad_sub": "当前",
      "roi_turp_label": "Turp 方法", "roi_turp_sub": "新一代",
      "roi_total": "总计",

      // --- FAQ PAGE ---
      "faq_page": {
        "help_center": "帮助中心",
        "title": "常见问题",
        "subtitle": "在此处找到有关 TURP 平台的问题的答案。",
        "search_placeholder": "搜索问题...",
        "all_categories": "所有类别",
        "loading": "加载中...",
        "no_results": "未找到匹配的问题。",
        "no_faqs": "尚未添加常见问题解答。"
      },

      // --- RHEUMA CASE STUDY ---
      "case_rheuma": {
        "back_home": "返回主页",
        "badge": "风湿病混合模型",
        "title": "风湿病登记系统项目",
        "desc": "一种针对类风湿性关节炎 (RA) 和强直性脊柱炎 (AS) 患者的混合监测模型，通过数字化医院就诊节省 45% 的医生时间。",
        "problem_title": "当前问题",
        "problem_1_t": "门诊时间有限",
        "problem_1_d": "医生将 45 分钟就诊时间的大部分用于填写问卷。",
        "problem_2_t": "回忆偏差",
        "problem_2_d": "患者描述当前的状况，但无法回忆两周前的疼痛。",
        "solution_badge": "Turp 解决方案",
        "solution_title": "数字集成",
        "solution_desc": "患者在来医院前 48 小时在家填写所有量表。患者进入房间时数据已准备就绪。",
        "solution_metric": "快 75%",
        "flow_title": "混合就诊流程",
        "flow_1_t": "1. 在家开始", "flow_1_d": "患者提前 48 小时收到通知。",
        "flow_2_t": "2. ePRO 输入", "flow_2_d": "患者在家填写 HAQ, BASDAI 量表。",
        "flow_3_t": "3. 信号分析", "flow_3_d": "系统计算分数，如果有风险则提醒医生。",
        "flow_4_t": "4. 专注就诊", "flow_4_d": "医生只专注于体检。",
        "stats_title": "测量价值",
        "stat_time_title": "医生时间使用",
        "stat_time_trad": "传统 (40 分钟)", "stat_time_trad_input": "数据输入: 20分钟",
        "stat_time_turp": "Turp 模型 (15 分钟)", "stat_time_turp_input": "数据输入: 0分钟",
        "stat_time_desc": "由于消除了调查负担，就诊时间减少了 65%。",
        "stat_data_title": "数据准确性",
        "stat_data_paper": "纸质 (70%)", "stat_data_turp": "Turp (98%)",
        "stat_data_desc": "通过数字验证防止错误的数据输入。",
        "cta_title": "将此模型应用于您的研究",
        "cta_btn": "运行成本分析"
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "tr",
    ns: ["translation"],
    defaultNS: "translation",
    keySeparator: false,
    interpolation: { escapeValue: false }
  });

export default i18n;
