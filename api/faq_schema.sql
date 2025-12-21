-- FAQ Table Schema
-- Run this SQL on the database to create the faqs table

CREATE TABLE IF NOT EXISTS faqs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question VARCHAR(500) NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(100) DEFAULT 'Genel',
    language ENUM('tr', 'en', 'zh') DEFAULT 'tr',
    is_showcased BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_active_showcased (is_active, is_showcased),
    INDEX idx_language (language),
    INDEX idx_sort_order (sort_order)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Seed initial FAQs (migrated from hardcoded homepage)
INSERT INTO faqs (question, answer, category, language, is_showcased, is_active, sort_order) VALUES
('e-Nabız verisi için onay gerekiyor mu?', 'Evet, KVKK gereği e-Nabız entegrasyonu için hastanın açık rızası alınır. TURP platformu, tüm hasta onaylarını dijital ortamda kayıt altına alarak, araştırmacıların ve sponsorların uyumluluk yükümlülüklerini kolaylaştırır.', 'Genel', 'tr', 1, 1, 1),
('Mevcut EDC sistemimizle entegre olur mu?', 'Evet, REST API üzerinden entegre olur. TURP platformu mevcut EDC sistemlerinizle (Medidata, Veeva, Oracle Clinical vb.) sorunsuz entegrasyon sağlar. Veri akışı ve senkronizasyon otomatik olarak gerçekleşir.', 'Teknik', 'tr', 1, 1, 2),
('Hangi verileri çekebiliyoruz?', 'Tanılarla (ICD-10), reçeteler, laboratuvar sonuçları, vital bulgular, aşı kayıtları ve hastane yatış bilgileri dahil olmak üzere kapsamlı sağlık verilerine erişilebilir. Tüm veriler protokol gereksinimlerine göre filtrelenebilir.', 'Genel', 'tr', 1, 1, 3);
