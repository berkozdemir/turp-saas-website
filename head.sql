-- Veritabanını Seç
USE turp_saas;

-- 1. USERS Tablosu
CREATE TABLE IF NOT EXISTS iwrs_saas_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    phone VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin Kullanıcısı (Şifre: 123456)
INSERT INTO iwrs_saas_users (email, password, full_name, phone) 
VALUES ('berko@omega-cro.com.tr', '123456', 'Berk Özdemir', '5551234567');


-- 2. BLOG POSTS Tablosu
CREATE TABLE IF NOT EXISTS iwrs_saas_blog_posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    content LONGTEXT,
    excerpt TEXT,
    featured_image VARCHAR(1024),
    status VARCHAR(50) DEFAULT 'published',
    seo_title VARCHAR(255),
    seo_description TEXT,
    seo_keywords TEXT,
    published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    lang VARCHAR(10) DEFAULT 'tr'
);

