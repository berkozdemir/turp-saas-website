import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  tr: {
    translation: {
      "nav_home": "Ana Sayfa", "nav_blog": "Blog & Haberler", "nav_admin": "Yönetim", "nav_modules": "Modüller",
      "hero_badge": "USBS Onaylı & e-Nabız Entegreli",
      "hero_title_1": "Tahminleri Değil,", "hero_title_2": "Gerçekleri Yönetin.",
      "hero_desc": "Klinik araştırmalarda katılımcı verilerini kaynağından doğrulayan, Türkiye'nin ilk ve tek RWE platformu.",
      "btn_demo": "Demo Talep Et", "btn_discover": "Platformu Keşfet",
      "partners_title": "GÜVENİLEN PARTNERLERİMİZ",
      
      // İletişim Formu
      "contact_title": "Araştırmanızı Başlatın", "contact_desc": "Uzman ekibimiz size özel bir demo hazırlasın.",
      "form_name": "Adınız", "form_surname": "Soyadınız", "form_company": "Şirket",
      "form_email": "Kurumsal E-posta", "form_select": "İlgilendiğiniz Alanı Seçiniz",
      "form_opt_rwe": "RWE / Gözlemsel Çalışma",
      "form_opt_phase": "Faz Çalışması (III/IV)",
      "form_opt_device": "Medikal Cihaz Takibi",
      "form_send": "Gönder",
      "form_success_title": "Başvurunuz Alındı!", "form_success_desc": "Uzman ekibimiz en kısa sürede dönüş yapacaktır.",
      "form_new": "Yeni Talep",

      // Modüller
      "modules_title": "Teknoloji ile Güçlendirilmiş Çözümler", "modules_desc": "Detaylı bilgi için modüllere tıklayın.",
      "module_btn_detail": "Bu Modülü Talep Et", "module_back": "Ana Sayfaya Dön",
      "module_why": "Neden Bu Modül?", "module_tech": "Teknik Özellikler",
      "module_cta_title": "Bu Modülü Projenize Ekleyin", "module_cta_desc": "Turp ekosistemi modülerdir. Sadece ihtiyacınız olanı kullanın.", "module_cta_btn": "İletişime Geçin",
      
      "mod_survey_title": "ePRO & Anket Modülü", "mod_survey_short": "Kağıt formları unutun. Veriyi kaynağında yakalayın.", "mod_survey_desc": "Katılımcıların yaşam kalitesi ölçeklerini ve semptomlarını mobil uygulama üzerinden anlık ve güvenilir toplayın.",
      "mod_survey_d1": "Recall Bias sorununu ortadan kaldırır.", "mod_survey_d2": "FDA 21 CFR Part 11 uyumlu.", "mod_survey_d3": "Dinamik dallanma mantığı.",
      
      "mod_med_title": "İlaç Hatırlatma", "mod_med_short": "Tedavi uyumunu şansa bırakmayın.", "mod_med_desc": "Akıllı bildirimler ve görsel teyit sistemleri ile 'Adherence' oranlarını artırın.",
      "mod_med_d1": "Dijital kesinliğe dayalı takip.", "mod_med_d2": "Akıllı erteleme.", "mod_med_d3": "Otomatik stok uyarısı.",

      "mod_vital_title": "Vital Ölçüm & IoT", "mod_vital_short": "Klinik dışında kesintisiz gözlem.", "mod_vital_desc": "Tansiyon, şeker, nabız verilerini cihazlardan otomatik çekin.",
      "mod_vital_d1": "Beyaz Önlük etkisini elimine eder.", "mod_vital_d2": "BYOD desteği.", "mod_vital_d3": "Erken Uyarı sistemi.",

      "mod_appt_title": "Randevu Yönetimi", "mod_appt_short": "No-Show oranlarını minimize edin.", "mod_appt_desc": "Karmaşık protokol takvimini hastanın cebine indirin.",
      "mod_appt_d1": "Lojistik zorlukları engeller.", "mod_appt_d2": "Otomatik vizit penceresi.", "mod_appt_d3": "Navigasyon entegrasyonu.",

      "mod_adv_title": "Yan Etki Bildirimi", "mod_adv_short": "Farmakovijilans için en hızlı yol.", "mod_adv_desc": "Beklenmedik durumları anında bildiren acil durum köprüsü.",
      "mod_adv_d1": "Anlık bildirim.", "mod_adv_d2": "Görsel kanıt.", "mod_adv_d3": "SAE alarmı.",

      "mod_edu_title": "Eğitim & eConsent", "mod_edu_short": "Bilinçli hasta, başarılı araştırma.", "mod_edu_desc": "Onam formlarını dijitalleştirin ve hastaları eğitin.",
      "mod_edu_d1": "Dijital imza süreci.", "mod_edu_d2": "Video eğitimleri.", "mod_edu_d3": "7/24 kütüphane.",

      "mod_web_title": "Webinar & Tele-Vizit", "mod_web_short": "Mekan bağımsız klinik araştırma.", "mod_web_desc": "Güvenli, şifreli ve KVKK uyumlu görüntülü görüşme.",
      "mod_web_d1": "Şifreli altyapı.", "mod_web_d2": "Ekran paylaşımı.", "mod_web_d3": "Otomatik loglama.",

      "prob_title": "Geleneksel Yöntemler Yetersiz", "prob_desc": "Manuel süreçler veri güvenilirliğini düşürür.",
      "bad_1": "Güvensiz veri.", "bad_2": "Manuel hatalar.", "bad_3": "Yüksek drop-out.",
      "good_1": "Dijital doğrulama.", "good_2": "Otomatik raporlama.", "good_3": "Yüksek uyum.",

      "stat_1": "Daha Hızlı Hasta Alımı", "stat_2": "Veri Doğruluğu", "stat_3": "Maliyet Tasarrufu", "stat_4": "Gerçek Zamanlı İzleme",

      "flow_title": "Süreç Nasıl İşler?",
      "flow_1_t": "Kurulum", "flow_1_d": "Sponsor paneli entegrasyonu.",
      "flow_2_t": "Davet", "flow_2_d": "Hastalara mobil uygulama linki.",
      "flow_3_t": "Onay", "flow_3_d": "Hasta e-Nabız onayı verir.",
      "flow_4_t": "Akış", "flow_4_d": "Gerçek zamanlı veri akışı başlar.",

      "faq_title": "Sıkça Sorulan Sorular",
      "faq_1_q": "Onay gerekiyor mu?", "faq_1_a": "Evet, KVKK gereği hastanın açık rızası zorunludur.",
      "faq_2_q": "EDC ile entegre mi?", "faq_2_a": "Evet, Turp modern REST API kullanır.",
      "faq_3_q": "Hangi veriler?", "faq_3_a": "Tanılar, reçeteler, tahlil sonuçları.",

      // ROI Hesaplayıcı
      "roi_badge": "Gelişmiş Maliyet Analizi",
      "roi_title": "Yatırım Getirisi (ROI)",
      "roi_desc": "Saha operasyonlarını dijitalleştirerek elde edeceğiniz devasa tasarrufu hesaplayın.",
      "roi_scope_title": "Çalışma Kapsamı",
      "roi_patient_count": "Gönüllü Sayısı",
      "roi_visit_count": "Vizit Sayısı",
      "roi_duration": "Süre (Ay)",
      "roi_settings_title": "Maliyet Varsayımları",
      "roi_trad_times": "Geleneksel Süreler (Dk)",
      "roi_cra": "CRA", "roi_sdc": "SDC",
      "roi_turp_times": "Turp ile Süreler (Dk)",
      "roi_salaries": "Maaş & Giderler",
      "roi_cra_monthly": "CRA Aylık", "roi_cra_daily": "CRA Harcırah", "roi_sdc_monthly": "SDC Aylık",
      "roi_others": "Diğer Giderler",
      "roi_inv_fee": "Araştırıcı", "roi_exam_fee": "Muayene", "roi_travel_fee": "Hasta Yol",
      "roi_license": "Turp Lisans (Gün)",
      "roi_saving_title": "Tahmini Toplam Tasarruf",
      "roi_profitable": "Daha Karlı", "roi_loss": "Maliyet Artışı",
      "roi_result_desc": "Dijitalleşme ile saha görevlilerinin zamanını %90'a varan oranda boşa çıkarmak, lisans maliyetini kat kat amorti eder.",
      "roi_trad_label": "Geleneksel", "roi_trad_sub": "Mevcut Durum",
      "roi_turp_label": "Turp Yöntemi", "roi_turp_sub": "Yeni Nesil",
      "roi_total": "Toplam"
    }
  },
  en: {
    translation: {
      "nav_home": "Home", "nav_blog": "Blog & News", "nav_admin": "Admin", "nav_modules": "Modules",
      "hero_badge": "System Verified & e-Health Integrated",
      "hero_title_1": "Manage Facts,", "hero_title_2": "Not Guesses.",
      "hero_desc": "The first and only RWE platform verifying participant data from the source.",
      "btn_demo": "Request Demo", "btn_discover": "Discover Platform",
      "partners_title": "TRUSTED PARTNERS",
      
      "contact_title": "Start Your Research", "contact_desc": "Let our expert team prepare a custom demo.",
      "form_name": "First Name", "form_surname": "Last Name", "form_company": "Company",
      "form_email": "Corporate Email", "form_select": "Select Area of Interest",
      "form_opt_rwe": "RWE / Observational Study",
      "form_opt_phase": "Phase Study (III/IV)",
      "form_opt_device": "Medical Device Tracking",
      "form_send": "Send",
      "form_success_title": "Application Received!", "form_success_desc": "Our team will contact you shortly.",
      "form_new": "New Request",

      "modules_title": "Tech-Empowered Solutions", "modules_desc": "Click modules for details.",
      "module_btn_detail": "Request Module", "module_back": "Back to Home",
      "module_why": "Why This Module?", "module_tech": "Technical Specs",
      "module_cta_title": "Add to Your Project", "module_cta_desc": "Turp is modular. Use only what you need.", "module_cta_btn": "Contact Us",
      
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

      "roi_badge": "Advanced Cost Analysis",
      "roi_title": "Return on Investment (ROI)",
      "roi_desc": "Calculate the massive savings by digitizing field operations.",
      "roi_scope_title": "Study Scope",
      "roi_patient_count": "Subject Count",
      "roi_visit_count": "Visit Count",
      "roi_duration": "Duration (Months)",
      "roi_settings_title": "Cost Assumptions",
      "roi_trad_times": "Traditional Times (Min)",
      "roi_cra": "CRA", "roi_sdc": "SDC",
      "roi_turp_times": "Times with Turp (Min)",
      "roi_salaries": "Salaries & Expenses",
      "roi_cra_monthly": "CRA Monthly", "roi_cra_daily": "CRA Per Diem", "roi_sdc_monthly": "SDC Monthly",
      "roi_others": "Other Expenses",
      "roi_inv_fee": "Investigator", "roi_exam_fee": "Examination", "roi_travel_fee": "Patient Travel",
      "roi_license": "Turp License (Day)",
      "roi_saving_title": "Estimated Total Savings",
      "roi_profitable": "More Profitable", "roi_loss": "Cost Increase",
      "roi_result_desc": "Digitization frees up 90% of field staff time, paying off license costs.",
      "roi_trad_label": "Traditional", "roi_trad_sub": "Current State",
      "roi_turp_label": "Turp Method", "roi_turp_sub": "Next Generation",
      "roi_total": "Total"
    }
  },
  zh: {
    translation: {
      "nav_home": "首页", "nav_blog": "博客", "nav_admin": "管理", "nav_modules": "模块",
      "hero_badge": "系统认证 & 电子健康集成",
      "hero_title_1": "管理事实，", "hero_title_2": "而非猜测。",
      "hero_desc": "首个从源头验证临床试验参与者数据的 RWE 平台。",
      "btn_demo": "申请演示", "btn_discover": "探索平台",
      "partners_title": "值得信赖的合作伙伴",
      
      "contact_title": "开始您的研究", "contact_desc": "让我们的专家团队为您准备定制演示。",
      "form_name": "名字", "form_surname": "姓氏", "form_company": "公司",
      "form_email": "企业邮箱", "form_select": "选择感兴趣的领域",
      "form_opt_rwe": "RWE / 观察性研究",
      "form_opt_phase": "阶段研究 (III/IV)",
      "form_opt_device": "医疗器械追踪",
      "form_send": "发送",
      "form_success_title": "申请已收到！", "form_success_desc": "我们的团队将尽快与您联系。",
      "form_new": "新要求",

      "modules_title": "技术赋能解决方案", "modules_desc": "点击模块了解详情。",
      "module_btn_detail": "申请此模块", "module_back": "返回首页",
      "module_why": "为什么选择此模块？", "module_tech": "技术规格",
      "module_cta_title": "添加到您的项目", "module_cta_desc": "Turp 是模块化的。", "module_cta_btn": "联系我们",

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

      "prob_title": "传统方法失效", "prob_desc": "手动流程降低可靠性。",
      "bad_1": "未验证数据。", "bad_2": "手动错误。", "bad_3": "高脱落率。",
      "good_1": "100% 数字验证。", "good_2": "自动报告。", "good_3": "高依从性。",

      "stat_1": "更快的招募", "stat_2": "数据准确性", "stat_3": "成本节省", "stat_4": "实时监控",

      "flow_title": "工作原理？",
      "flow_1_t": "设置", "flow_1_d": "集成。",
      "flow_2_t": "邀请", "flow_2_d": "发送链接。",
      "flow_3_t": "同意", "flow_3_d": "批准共享。",
      "flow_4_t": "流程", "flow_4_d": "数据流开始。",

      "faq_title": "常见问题",
      "faq_1_q": "需要同意吗？", "faq_1_a": "是的，必须明确同意。",
      "faq_2_q": "与 EDC 集成？", "faq_2_a": "是的，通过 API。",
      "faq_3_q": "哪些数据？", "faq_3_a": "诊断、处方、结果。",

      "roi_badge": "高级成本分析",
      "roi_title": "投资回报率 (ROI)",
      "roi_desc": "计算数字化带来的节省。",
      "roi_scope_title": "研究范围",
      "roi_patient_count": "受试者数",
      "roi_visit_count": "访视数",
      "roi_duration": "持续时间（月）",
      "roi_settings_title": "成本假设",
      "roi_trad_times": "传统时间（分）",
      "roi_cra": "CRA", "roi_sdc": "SDC",
      "roi_turp_times": "Turp 时间（分）",
      "roi_salaries": "薪资",
      "roi_cra_monthly": "CRA 月薪", "roi_cra_daily": "CRA 津贴", "roi_sdc_monthly": "SDC 月薪",
      "roi_others": "其他费用",
      "roi_inv_fee": "研究者", "roi_exam_fee": "检查", "roi_travel_fee": "差旅",
      "roi_license": "Turp 许可（天）",
      "roi_saving_title": "预计总节省",
      "roi_profitable": "更有利", "roi_loss": "成本增加",
      "roi_result_desc": "数字化释放 90% 时间。",
      "roi_trad_label": "传统", "roi_trad_sub": "当前",
      "roi_turp_label": "Turp 方法", "roi_turp_sub": "新一代",
      "roi_total": "总计"
    }
  }
};

i18n.use(LanguageDetector).use(initReactI18next).init({ resources, fallbackLng: "tr", ns: ["translation"], defaultNS: "translation", keySeparator: false, interpolation: { escapeValue: false } });
export default i18n;
