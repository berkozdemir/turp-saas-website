-- ROI Module Schema

CREATE TABLE IF NOT EXISTS roi_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cra_monthly_salary DECIMAL(15,2),
    cra_daily_expense DECIMAL(15,2),
    trad_cra_minutes INT,
    sdc_monthly_salary DECIMAL(15,2),
    trad_sdc_minutes INT,
    investigator_fee DECIMAL(15,2),
    exam_fee DECIMAL(15,2),
    patient_travel_fee DECIMAL(15,2),
    turp_daily_license DECIMAL(15,2),
    turp_cra_minutes INT,
    turp_sdc_minutes INT,
    usd_rate DECIMAL(15,2),
    eur_rate DECIMAL(15,2)
);

-- Initial ROI Settings Data
INSERT INTO roi_settings (id, created_at, cra_monthly_salary, cra_daily_expense, trad_cra_minutes, sdc_monthly_salary, trad_sdc_minutes, investigator_fee, exam_fee, patient_travel_fee, turp_daily_license, turp_cra_minutes, turp_sdc_minutes, usd_rate, eur_rate) 
VALUES (1, '2025-11-22 15:01:31', 160000, 6000, 10, 120000, 45, 3000, 3000, 800, 69.99, 2, 15, 45, 50)
ON DUPLICATE KEY UPDATE id=id;

CREATE TABLE IF NOT EXISTS roi_leads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ad_soyad VARCHAR(255),
    email VARCHAR(255),
    telefon VARCHAR(50),
    firma VARCHAR(255),
    calisma_turu VARCHAR(100),
    faz VARCHAR(50),
    ulkeler VARCHAR(100),
    kvkk_onayi BOOLEAN DEFAULT FALSE,
    merkez_sayisi VARCHAR(50),
    gonullu_sayisi VARCHAR(50),
    calisma_suresi VARCHAR(50),
    kvkk BOOLEAN DEFAULT FALSE
);
