import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  tr: {
    translation: {
      // Navigasyon
      "nav_home": "Ana Sayfa",
      "nav_blog": "Blog & Haberler",
      "nav_admin": "Yönetim",
      "nav_modules": "Modüller",
      
      // Hero
      "hero_badge": "USBS Onaylı & e-Nabız Entegreli",
      "hero_title_1": "Tahminleri Değil,",
      "hero_title_2": "Gerçekleri Yönetin.",
      "hero_desc": "Klinik araştırmalarda katılımcı verilerini kaynağından doğrulayan, Türkiye'nin ilk ve tek RWE platformu.",
      "btn_demo": "Demo Talep Et",
      "btn_discover": "Platformu Keşfet",

      // Ortak
      "partners_title": "GÜVENİLEN PARTNERLERİMİZ",
      "contact_title": "Araştırmanızı Başlatın",
      "contact_desc": "Uzman ekibimiz size özel bir demo hazırlasın.",
      "form_name": "Adınız",
      "form_surname": "Soyadınız",
      "form_company": "Şirket",
      "form_email": "Kurumsal E-posta",
      "form_select": "İlgilendiğiniz Alanı Seçiniz",
      "form_send": "Gönder",
      "form_success_title": "Başvurunuz Alındı!",
      "form_success_desc": "Uzman ekibimiz en kısa sürede dönüş yapacaktır.",
      "form_new": "Yeni Talep",

      // Modüller Genel
      "modules_title": "Teknoloji ile Güçlendirilmiş Çözümler",
      "modules_desc": "Detaylı bilgi için modüllere tıklayın.",
      "module_btn_detail": "Bu Modülü Talep Et",
      "module_back": "Ana Sayfaya Dön",
      "module_why": "Neden Bu Modül?",
      "module_tech": "Teknik Özellikler",
      "module_cta_title": "Bu Modülü Projenize Ekleyin",
      "module_cta_desc": "Turp ekosistemi modülerdir. Sadece ihtiyacınız olanı kullanın.",
      "module_cta_btn": "İletişime Geçin",

      // Modül: Survey
      "mod_survey_title": "ePRO & Anket Modülü",
      "mod_survey_short": "Kağıt formları unutun. Veriyi kaynağında yakalayın.",
      "mod_survey_desc": "Katılımcıların yaşam kalitesi ölçeklerini ve semptomlarını mobil uygulama üzerinden anlık ve güvenilir toplayın.",
      "mod_survey_d1": "Recall Bias (Hatırlama Yanılgısı) sorununu ortadan kaldırır.",
      "mod_survey_d2": "FDA 21 CFR Part 11 uyumlu elektronik imza ve denetim izi.",
      "mod_survey_d3": "Dinamik dallanma mantığı (Branching Logic) ile akıllı sorular.",
      
      // Modül: Medication
      "mod_med_title": "İlaç Hatırlatma",
      "mod_med_short": "Tedavi uyumunu şansa bırakmayın.",
      "mod_med_desc": "Akıllı bildirimler ve görsel teyit sistemleri ile 'Adherence' oranlarını %90'ın üzerine çıkarın.",
      "mod_med_d1": "Hasta beyanına değil, dijital kesinliğe dayalı takip.",
      "mod_med_d2": "Hastanın yaşam döngüsüne uyumlu akıllı erteleme.",
      "mod_med_d3": "İlaç bitmeden otomatik stok ve lojistik uyarısı.",

      // Modül: Vital
      "mod_vital_title": "Vital Ölçüm & IoT",
      "mod_vital_short": "Klinik dışında kesintisiz gözlem.",
      "mod_vital_desc": "Tansiyon, şeker, nabız verilerini Apple Health, Google Fit veya Bluetooth cihazlardan otomatik çekin.",
      "mod_vital_d1": "Beyaz Önlük Hipertansiyonu etkisini elimine eder.",
      "mod_vital_d2": "BYOD (Kendi Cihazını Getir) desteği.",
      "mod_vital_d3": "Referans dışı değerlerde doktora 'Erken Uyarı'.",

      // Modül: Appointment
      "mod_appt_title": "Randevu Yönetimi",
      "mod_appt_short": "No-Show oranlarını minimize edin.",
      "mod_appt_desc": "Karmaşık protokol takvimini hastanın cebine indirin. Saha ziyaretlerini otomatik organize edin.",
      "mod_appt_d1": "Lojistik zorlukları ve unutulan randevuları engeller.",
      "mod_appt_d2": "Otomatik vizit penceresi hesaplama.",
      "mod_appt_d3": "Hastane konumu ve yol tarifi entegrasyonu.",

      // Modül: Adverse
      "mod_adv_title": "Yan Etki Bildirimi",
      "mod_adv_short": "Farmakovijilans için en hızlı yol.",
      "mod_adv_desc": "Beklenmedik durumları anında bildiren, 7/24 açık acil durum köprüsü.",
      "mod_adv_d1": "Hasta güvenliği ve etik kurallar için anlık bildirim.",
      "mod_adv_d2": "Basit semptom seçimi ile kolay kullanım.",
      "mod_adv_d3": "Ciddi Yan Etki (SAE) durumunda anında alarm.",

      // Modül: Education
      "mod_edu_title": "Eğitim & eConsent",
      "mod_edu_short": "Bilinçli hasta, başarılı araştırma.",
      "mod_edu_desc": "Onam formlarını dijitalleştirin ve hastaları interaktif videolarla eğitin.",
      "mod_edu_d1": "İmza sürecini dijital ve anlaşılır hale getirir.",
      "mod_edu_d2": "Video ve animasyonlarla protokol eğitimi.",
      "mod_edu_d3": "7/24 erişilebilir hasta kütüphanesi.",

      // Modül: Webinar
      "mod_web_title": "Webinar & Tele-Vizit",
      "mod_web_short": "Mekan bağımsız klinik araştırma.",
      "mod_web_desc": "Uygulama üzerinden güvenli, şifreli ve KVKK uyumlu görüntülü görüşme.",
      "mod_web_d1": "Tıbbi verilerin korunması için şifreli altyapı.",
      "mod_web_d2": "Doktor ekran paylaşımı ile veri gösterimi.",
      "mod_web_d3": "Denetimler için otomatik süre loglaması.",

      // Problem/Çözüm
      "prob_title": "Geleneksel Yöntemler Yetersiz",
      "prob_desc": "Manuel süreçler veri güvenilirliğini düşürürken maliyetleri artırıyor.",
      "bad_1": "Hasta beyanına dayalı, güvensiz veri.",
      "bad_2": "Manuel giriş hataları.",
      "bad_3": "Yüksek 'Drop-out' oranları.",
      "good_1": "e-Nabız ile %100 dijital doğrulama.",
      "good_2": "Anlık ve otomatik raporlama.",
      "good_3": "Akıllı bildirimlerle yüksek uyum.",

      // Stats
      "stat_1": "Daha Hızlı Hasta Alımı",
      "stat_2": "Veri Doğruluğu",
      "stat_3": "Maliyet Tasarrufu",
      "stat_4": "Gerçek Zamanlı İzleme",

      // Workflow
      "flow_title": "Süreç Nasıl İşler?",
      "flow_1_t": "Kurulum", "flow_1_d": "Sponsor paneli entegrasyonu.",
      "flow_2_t": "Davet", "flow_2_d": "Hastalara mobil uygulama linki.",
      "flow_3_t": "Onay", "flow_3_d": "Hasta e-Nabız onayı verir.",
      "flow_4_t": "Akış", "flow_4_d": "Gerçek zamanlı veri akışı başlar.",

      // FAQ
      "faq_title": "Sıkça Sorulan Sorular",
      "faq_1_q": "e-Nabız verisi için onay gerekiyor mu?",
      "faq_1_a": "Evet, KVKK gereği hastanın mobil uygulama üzerinden açık rıza vermesi zorunludur.",
      "faq_2_q": "Mevcut EDC sistemimizle entegre olur mu?",
      "faq_2_a": "Evet, Turp modern REST API ile EDC sistemleriyle konuşabilir.",
      "faq_3_q": "Hangi verileri çekebiliyoruz?",
      "faq_3_a": "Tanılar, reçeteler, radyoloji ve tahlil sonuçları."
    }
  },
  en: {
    translation: {
      "nav_home": "Home", "nav_blog": "Blog & News", "nav_admin": "Admin", "nav_modules": "Modules",
      "hero_badge": "System Verified & e-Health Integrated",
      "hero_title_1": "Manage Facts,", "hero_title_2": "Not Guesses.",
      "hero_desc": "The first and only RWE platform verifying participant data from the source for clinical trials.",
      "btn_demo": "Request Demo", "btn_discover": "Discover Platform",
      "partners_title": "TRUSTED PARTNERS",
      "contact_title": "Start Your Research", "contact_desc": "Let our expert team prepare a custom demo for you.",
      "form_name": "First Name", "form_surname": "Last Name", "form_company": "Company",
      "form_email": "Corporate Email", "form_select": "Select Area of Interest", "form_send": "Send",
      "form_success_title": "Application Received!", "form_success_desc": "Our team will contact you shortly.",
      "modules_title": "Tech-Empowered Solutions", "modules_desc": "Click modules for details.",
      "module_btn_detail": "Request Module", "module_back": "Back to Home",
      "module_why": "Why This Module?", "module_tech": "Technical Specs",
      "module_cta_title": "Add to Your Project", "module_cta_desc": "Turp is modular. Use only what you need.",
      "module_cta_btn": "Contact Us",
      
      // Modules
      "mod_survey_title": "ePRO & Survey", "mod_survey_short": "Forget paper forms. Capture data at source.",
      "mod_survey_desc": "Collect Quality of Life scales and symptoms instantly via mobile app.",
      "mod_survey_d1": "Eliminates Recall Bias.", "mod_survey_d2": "FDA 21 CFR Part 11 compliant.", "mod_survey_d3": "Smart Branching Logic.",
      
      "mod_med_title": "Medication Adherence", "mod_med_short": "Don't leave adherence to chance.",
      "mod_med_desc": "Boost adherence over 90% with smart alerts and visual confirmation.",
      "mod_med_d1": "Digital certainty instead of patient claim.", "mod_med_d2": "Smart snooze based on lifestyle.", "mod_med_d3": "Automatic stock alerts.",

      "mod_vital_title": "Vitals & IoT", "mod_vital_short": "Continuous observation outside clinic.",
      "mod_vital_desc": "Auto-fetch vitals from Apple Health, Google Fit or Bluetooth devices.",
      "mod_vital_d1": "Eliminates White Coat Hypertension.", "mod_vital_d2": "BYOD support.", "mod_vital_d3": "Early Warning for outliers.",

      "mod_appt_title": "Visit Management", "mod_appt_short": "Minimize No-Show rates.",
      "mod_appt_desc": "Digital protocol calendar in patient's pocket.",
      "mod_appt_d1": "Prevents forgotten appointments.", "mod_appt_d2": "Auto visit window calc.", "mod_appt_d3": "Navigation integration.",

      "mod_adv_title": "Adverse Events", "mod_adv_short": "Fastest way for pharmacovigilance.",
      "mod_adv_desc": "24/7 emergency bridge for reporting unexpected events.",
      "mod_adv_d1": "Instant reporting for safety.", "mod_adv_d2": "Simple symptom selection.", "mod_adv_d3": "Instant SAE alarms.",

      "mod_edu_title": "Education & eConsent", "mod_edu_short": "Informed patient, successful trial.",
      "mod_edu_desc": "Digitize consent forms and educate patients with interactive video.",
      "mod_edu_d1": "Digital and clear signing process.", "mod_edu_d2": "Video protocol training.", "mod_edu_d3": "24/7 patient library.",

      "mod_web_title": "Webinar & Tele-Visit", "mod_web_short": "Location-independent trials.",
      "mod_web_desc": "Secure, encrypted video calls via app.",
      "mod_web_d1": "Encrypted infrastructure for medical data.", "mod_web_d2": "Screen sharing for data.", "mod_web_d3": "Auto-logging for audits.",

      "prob_title": "Traditional Methods Fail", "prob_desc": "Manual processes reduce reliability and increase costs.",
      "bad_1": "Unverified, self-reported data.", "bad_2": "Manual entry errors.", "bad_3": "High Drop-out rates.",
      "good_1": "100% digital verification.", "good_2": "Instant automated reporting.", "good_3": "High adherence with smart alerts.",

      "stat_1": "Faster Recruitment", "stat_2": "Data Accuracy", "stat_3": "Cost Saving", "stat_4": "Real-Time Monitoring",

      "flow_title": "How It Works?",
      "flow_1_t": "Setup", "flow_1_d": "Sponsor panel integration.",
      "flow_2_t": "Invite", "flow_2_d": "App link sent to patients.",
      "flow_3_t": "Consent", "flow_3_d": "Patient approves data sharing.",
      "flow_4_t": "Flow", "flow_4_d": "Real-time data flow begins.",

      "faq_title": "Frequently Asked Questions",
      "faq_1_q": "Is patient consent required?", "faq_1_a": "Yes, explicit consent via mobile app is mandatory by law.",
      "faq_2_q": "Does it integrate with EDC?", "faq_2_a": "Yes, Turp communicates seamlessly via REST API.",
      "faq_3_q": "Which data can we fetch?", "faq_
