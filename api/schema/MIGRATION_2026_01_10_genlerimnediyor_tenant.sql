-- =============================================
-- MIGRATION: Add Genlerimnediyor Tenant
-- Date: 2026-01-10
-- Description: Complete tenant setup with branding, landing, contact, and FAQ configs
-- Brand Colors: Red (#FF3B4A), Navy (#1F2847)
-- =============================================

-- ========================================
-- 1. INSERT TENANT RECORD
-- ========================================
INSERT INTO `tenants` (
    `code`,
    `name`,
    `primary_domain`,
    `logo_url`,
    `primary_color`,
    `is_active`,
    `allow_enduser_login`,
    `allow_enduser_signup`
) VALUES (
    'genlerimnediyor',
    'Genlerim Ne Diyor?',
    'genlerimnediyor.com',
    '/public/images/Genlerim Ne Diyor Logo Final.jpg',
    '#FF3B4A',
    1,
    0,
    0
);

-- Get the tenant_id for use in subsequent queries
SET @tenant_id = LAST_INSERT_ID();

-- ========================================
-- 2. INSERT BRANDING CONFIG
-- ========================================
INSERT INTO `branding_configs` (
    `tenant_id`,
    `logo_light_url`,
    `logo_dark_url`,
    `favicon_url`,
    `primary_color`,
    `secondary_color`,
    `accent_color`,
    `background_color`,
    `text_color_primary`,
    `text_color_muted`,
    `font_family_base`,
    `font_family_heading`,
    `instagram_url`,
    `facebook_url`,
    `linkedin_url`,
    `whatsapp_url`
) VALUES (
    @tenant_id,
    '/public/images/Genlerim Ne Diyor Logo Final.jpg',
    '/public/images/Genlerim Ne Diyor Logo Final.jpg',
    '/favicon.ico',
    '#FF3B4A',
    '#1F2847',
    '#00D4FF',
    '#FFFFFF',
    '#1F2847',
    '#A0AEC0',
    'Inter',
    'Inter',
    'https://instagram.com/nipttesti',
    NULL,
    NULL,
    'https://wa.me/903129201362'
);

-- ========================================
-- 3. INSERT LANDING CONFIG (Turkish)
-- ========================================
INSERT INTO `landing_configs` (
    `tenant_id`,
    `language`,

    -- Hero Section
    `hero_title`,
    `hero_title_line2`,
    `hero_subtitle`,
    `hero_badge`,
    `hero_cta_text`,
    `hero_cta_link`,
    `hero_image_url`,
    `hero_bg_gradient_from`,
    `hero_bg_gradient_to`,

    -- Features Section
    `features_title`,
    `features_json`,

    -- Stats Section
    `stats_json`,

    -- Testimonials Section
    `testimonials_json`,

    -- CTA Section
    `cta_title`,
    `cta_description`,
    `cta_button_text`,
    `cta_button_link`,

    `is_active`
) VALUES (
    @tenant_id,
    'tr',

    -- Hero
    'Genlerim Ne Diyor?',
    NULL,
    'Beslenmeden zihinsel gelişime, sağlıklı bir yaşam ve ebeveynlik için genetik riskleri erkenden keşfet, geleceğini planla.',
    '🧬 Genetik Danışmanlık Dahil',
    'Test Siparişi Ver',
    '/iletisim',
    '/public/images/hero-family.jpg',
    '#FF3B4A',
    '#1F2847',

    -- Features
    'Test Kategorilerimiz',
    JSON_ARRAY(
        JSON_OBJECT(
            'icon', 'Dna',
            'title', 'Yaşam Genetiği',
            'description', '47 farklı özellik analizi ile beslenmeden spora, ciltten zihinsel sağlığa kadar kapsamlı genetik haritanızı çıkarın.',
            'link', '/yasam-genetigi'
        ),
        JSON_OBJECT(
            'icon', 'Heart',
            'title', 'Gebelik & Evlilik Öncesi',
            'description', 'Taşıyıcılık testleri ile genetik uyumunuzu öğrenin, sağlıklı bir gelecek için bilinçli kararlar alın.',
            'link', '/tarama-testleri'
        ),
        JSON_OBJECT(
            'icon', 'Baby',
            'title', 'Yenidoğan Tarama',
            'description', 'IMSPlus ve EnfantGuard 2.0 ile bebeğinizin metabolik ve genetik sağlığını erkenden kontrol edin.',
            'link', '/yenidogan-tarama'
        )
    ),

    -- Stats
    JSON_ARRAY(
        JSON_OBJECT('label', 'Analiz Edilen Test', 'value', '10.000+'),
        JSON_OBJECT('label', 'Mutlu Aile', 'value', '5.000+'),
        JSON_OBJECT('label', 'Genetik Özellik', 'value', '47+'),
        JSON_OBJECT('label', 'Doğruluk Oranı', 'value', '%99.9')
    ),

    -- Testimonials
    JSON_ARRAY(
        JSON_OBJECT(
            'name', 'Ayşe K.',
            'role', 'Yaşam Genetiği Testi',
            'content', 'Test sonuçları sayesinde beslenme alışkanlıklarımı değiştirdim ve kendimi çok daha iyi hissediyorum.',
            'rating', 5
        ),
        JSON_OBJECT(
            'name', 'Mehmet Y.',
            'role', 'Evlilik Öncesi Test',
            'content', 'Evlenmeden önce genetik uyumumuzu öğrenmek bize büyük bir huzur verdi.',
            'rating', 5
        ),
        JSON_OBJECT(
            'name', 'Zeynep D.',
            'role', 'IMSPlus Testi',
            'content', 'Bebeğimizin sağlığı hakkında erken bilgi sahibi olmak çok değerliydi.',
            'rating', 5
        )
    ),

    -- CTA
    'Genetik Haritanızı Keşfedin',
    'Uzman genetik danışmanlarımızla görüşün, size en uygun testi seçin ve sağlıklı bir geleceğe adım atın.',
    'Hemen İletişime Geç',
    '/iletisim',

    1
);

-- ========================================
-- 4. INSERT CONTACT CONFIG (Turkish)
-- ========================================
INSERT INTO `contact_configs` (
    `tenant_id`,
    `language`,
    `contact_title`,
    `contact_subtitle`,
    `address_line1`,
    `address_line2`,
    `city`,
    `country`,
    `phone`,
    `whatsapp`,
    `email`,
    `support_email`,
    `sales_email`,
    `working_hours`,
    `is_active`
) VALUES (
    @tenant_id,
    'tr',
    'Bize Ulaşın',
    'Genetik testlerimiz ve danışmanlık hizmetlerimiz hakkında bilgi almak için bizimle iletişime geçin.',
    'Piri Reis Caddesi No:2/4',
    'AnkaJob Beytepe',
    'Çankaya/Ankara',
    'Türkiye',
    '+90 312 920 1 362',
    '+90 312 920 1 362',
    'nipttesti@omega-gen.com',
    'nipttesti@omega-gen.com',
    'nipttesti@omega-gen.com',
    'Pazartesi - Cuma: 09:00 - 18:00',
    1
);

-- ========================================
-- 5. INSERT INITIAL FAQs
-- ========================================
INSERT INTO `faqs` (
    `tenant_id`,
    `page_slug`,
    `language`,
    `question`,
    `answer`,
    `order_index`,
    `is_active`
) VALUES
-- Homepage FAQs
(@tenant_id, 'home', 'tr', 'Genetik testler nasıl yapılır?', 'Genetik testlerimiz basit bir ağız içi sürüntü örneği veya kan örneği ile yapılır. Numune alımı sonrası laboratuvarımızda NGS (Yeni Nesil Sekanslama) teknolojisi ile analiz edilir.', 1, 1),
(@tenant_id, 'home', 'tr', 'Test sonuçları ne kadar sürede gelir?', 'Test türüne göre değişmekle birlikte genellikle 10-21 iş günü içinde sonuçlarınız hazır olur. Acil durumlar için hızlı sonuç seçeneklerimiz mevcuttur.', 2, 1),
(@tenant_id, 'home', 'tr', 'Genetik danışmanlık hizmeti nedir?', 'Uzman genetik danışmanlarımız test sonuçlarınızı detaylı şekilde yorumlar, sizinle paylaşır ve sonuçlarınıza göre öneriler sunar. Bu hizmet testlerimize dahildir.', 3, 1),
(@tenant_id, 'home', 'tr', 'Testler güvenli midir?', 'Tüm testlerimiz Sağlık Bakanlığı ruhsatlı laboratuvarımızda uluslararası standartlarda yapılır. Numune alımı tamamen güvenli ve ağrısızdır.', 4, 1),
(@tenant_id, 'home', 'tr', 'Hangi şehirlerde hizmet veriyorsunuz?', 'Türkiye genelinde hizmet vermekteyiz. Ankara merkezli laboratuvarımıza numune gönderimi veya şahsen gelme imkanınız vardır.', 5, 1),

-- Yaşam Genetiği FAQs
(@tenant_id, 'yasam-genetigi', 'tr', 'Yaşam Genetiği testi 47 özelliği nasıl değerlendiriyor?', 'Test, beslenme, egzersiz, cilt, saç, vitamin metabolizması, kafein hassasiyeti ve diğer pek çok özelliği genetik seviyede analiz ederek size kişiselleştirilmiş rehberlik sunar.', 1, 1),
(@tenant_id, 'yasam-genetigi', 'tr', 'Sonuçlardan sonra neler yapılır?', 'Sonuçlarınız epigenetik uzmanlarımız tarafından değerlendirilir ve size özel yaşam rehberi hazırlanır. Bu rehbere uyulması durumunda daha sağlıklı bir yaşam tarzı elde edebilirsiniz.', 2, 1),

-- IMSPlus FAQs
(@tenant_id, 'yenidogan-tarama', 'tr', 'IMSPlus testi ne kadar güvenli?', 'IMSPlus tamamen güvenli ve risksiz bir tarama testidir. Topuk kanı veya kordon kanı ile yapılır. %99.9 doğruluk oranına sahiptir.', 1, 1),
(@tenant_id, 'yenidogan-tarama', 'tr', 'Erken tanı neden önemlidir?', 'Yenidoğan döneminde tespit edilen genetik hastalıklar erken müdahale ile kontrol altına alınabilir ve ciddi sorunlar önlenebilir.', 2, 1),

-- EnfantGuard FAQs
(@tenant_id, 'enfantguard-2-0', 'tr', 'EnfantGuard 2.0 kaç hastalığı tarar?', 'EnfantGuard 2.0, 250''den fazla geliştimsel bozukluk ve kromozomal anomaliyi tarar. IMSPlus''tan çok daha kapsamlıdır.', 1, 1),
(@tenant_id, 'enfantguard-2-0', 'tr', 'Otizm ve öğrenme güçlükleri riski belirlenir mi?', 'Evet. EnfantGuard 2.0 otizm spektrum bozukluğu, ADHD ve öğrenme güçlükleri ile ilişkili genetik risk faktörlerini analiz eder.', 2, 1);

-- ========================================
-- 6. VERIFICATION QUERIES (Run after migration)
-- ========================================
-- SELECT * FROM tenants WHERE code = 'genlerimnediyor';
-- SELECT * FROM branding_configs WHERE tenant_id = (SELECT id FROM tenants WHERE code = 'genlerimnediyor');
-- SELECT * FROM landing_configs WHERE tenant_id = (SELECT id FROM tenants WHERE code = 'genlerimnediyor');
-- SELECT * FROM contact_configs WHERE tenant_id = (SELECT id FROM tenants WHERE code = 'genlerimnediyor');
-- SELECT COUNT(*) FROM faqs WHERE tenant_id = (SELECT id FROM tenants WHERE code = 'genlerimnediyor');

-- =============================================
-- END OF MIGRATION
-- =============================================
