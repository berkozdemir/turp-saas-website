-- =============================================
-- SEED: Chatbot Knowledge Index for IWRS Tenant
-- Run this on the live database to populate the chatbot's knowledge base.
-- =============================================

-- Index static content for IWRS (randomization, features, etc.)
INSERT INTO chatbot_knowledge_index (tenant_id, source_type, source_id, title, content, language, metadata) VALUES
('iwrs', 'static', NULL, 'IWRS Nedir?', 
'IWRS (Interactive Web Response System), klinik araştırmalarda hasta randomizasyonu, ilaç dağıtımı ve stok yönetimi için kullanılan web tabanlı bir sistemdir. Omega CRO tarafından geliştirilmiştir ve GCP (Good Clinical Practice) standartlarına uygundur.', 
'tr', '{"type": "general"}'),

('iwrs', 'static', NULL, 'Randomizasyon Nasıl Yapılır?',
'Randomizasyon süreci şu adımları içerir:
1. Araştırmacı IWRS sistemine giriş yapar.
2. Hasta bilgileri ve uygunluk kriterleri girişi yapılır.
3. Sistem otomatik olarak hasta randomizasyon kodu oluşturur.
4. Tedavi kolu belirlenir ve araştırmacıya bildirilir.
5. Kapanmamış körleme durumunda, ilaç bilgisi görüntülenir.',
'tr', '{"type": "randomization"}'),

('iwrs', 'static', NULL, 'Stok Takibi',
'IWRS sistemi üzerinden merkez bazlı ilaç stok takibi yapılabilir. Stok seviyeleri gerçek zamanlı olarak izlenir ve minimum stok seviyesine ulaşıldığında otomatik uyarılar gönderilir.',
'tr', '{"type": "inventory"}'),

('iwrs', 'static', NULL, 'Acil Durum Körleme Kaldırma',
'Acil durumlarda, yetkili kişiler IWRS sistemi üzerinden hasta körleme bilgisine erişebilir. Bu işlem loglanır ve sponsor''a bildirilir. Emergency Unblinding özelliği 7/24 kullanılabilir.',
'tr', '{"type": "emergency"}'),

('iwrs', 'static', NULL, 'Veri Güvenliği',
'IWRS sistemi, 21 CFR Part 11 uyumlu güvenlik standartlarını karşılar. Tüm veriler şifrelenir, audit trail tutulur ve yetkilendirme rolleri ile erişim kontrolü sağlanır.',
'tr', '{"type": "security"}'),

('iwrs', 'static', NULL, 'Destek ve İletişim',
'IWRS sistemi için teknik destek Omega CRO ekibi tarafından sağlanmaktadır. Destek taleplerinizi iwrs.com.tr/contact sayfasından veya info@omega-cro.com.tr adresinden iletebilirsiniz.',
'tr', '{"type": "support"}'),

('iwrs', 'static', NULL, 'Hasta Hatırlatma Servisleri',
'IWRS sistemi, hastalara ilaç hatırlatma, randevu hatırlatma ve anket gönderimi gibi hizmetler sunar. Bu servisler SMS ve e-posta kanalları üzerinden çalışır.',
'tr', '{"type": "patient_services"}');

-- Verify the seed
SELECT COUNT(*) as iwrs_knowledge_count FROM chatbot_knowledge_index WHERE tenant_id = 'iwrs';
