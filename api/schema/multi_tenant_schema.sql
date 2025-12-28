-- Multi-Tenant Schema Expansion (Westesti & Trombofili)

-- 1. Tenants Expansion (Ensure columns exist - manual check usually, but safely adding if missing via procedures is hard in raw SQL, assuming distinct names for now)
-- The tenants table already exists. We will insert new tenants.

INSERT IGNORE INTO tenants (name, code, primary_domain, primary_color) VALUES 
('Omega West', 'westesti', 'westesti.com', '#0ea5e9'),
('Omega Trombofili', 'trombofili', 'trombofili.com', '#dc2626');

-- 2. Locations (Westesti)
CREATE TABLE IF NOT EXISTS locations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tenant_id INT NOT NULL,
    city VARCHAR(50) NOT NULL,
    district VARCHAR(50) NOT NULL,
    omega_care_available BOOLEAN DEFAULT FALSE,
    coverage_radius_km INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Sales Reps (Westesti)
CREATE TABLE IF NOT EXISTS sales_reps (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tenant_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    region VARCHAR(50),
    commission_percent DECIMAL(5, 2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Patient Profiles (Trombofili - Extended demographics)
CREATE TABLE IF NOT EXISTS patient_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tenant_id INT NOT NULL,
    booking_id INT, -- Can be linked later
    age INT,
    gender VARCHAR(20),
    medical_history TEXT,
    family_history TEXT,
    medications TEXT,
    smoking_status VARCHAR(50),
    pregnancy_status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Healthcare Providers (Trombofili)
CREATE TABLE IF NOT EXISTS healthcare_providers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tenant_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    specialty VARCHAR(50),
    email VARCHAR(100),
    phone VARCHAR(20),
    hospital_clinic VARCHAR(100),
    referral_code VARCHAR(50),
    discount_percent DECIMAL(5, 2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_provider_code (tenant_id, referral_code),
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Test Indications (Trombofili)
CREATE TABLE IF NOT EXISTS test_indications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tenant_id INT NOT NULL,
    booking_id INT, -- Linked to booking
    indication_type VARCHAR(100),
    details TEXT,
    urgency VARCHAR(50) DEFAULT 'routine',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Clinical Reports (Trombofili)
CREATE TABLE IF NOT EXISTS clinical_reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tenant_id INT NOT NULL,
    booking_id INT NOT NULL,
    test_type VARCHAR(50),
    sample_received_date DATE,
    analysis_complete_date DATE,
    genetic_findings TEXT,
    risk_assessment VARCHAR(50),
    clinical_interpretation TEXT,
    recommendations TEXT,
    pdf_url VARCHAR(255),
    released_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Trombofili Bookings Table (Specific structure)
-- Note: Westesti will likely use the existing `nipt_bookings` or a unified `bookings` structure.
-- For Trombofili, the fields are sufficiently different to warrant a separate table or a very wide unified table.
-- Given the "Single Shared Backend" goal, we should ideally have a `bookings` table, but `nipt_bookings` is already specific.
-- Strategy: Create `trombofili_bookings` for now to avoid breaking NIPT, and we can unify in a view later if needed.

CREATE TABLE IF NOT EXISTS trombofili_bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tenant_id INT NOT NULL,
    patient_name VARCHAR(100) NOT NULL,
    patient_email VARCHAR(100),
    patient_phone VARCHAR(20),
    patient_age INT,
    patient_gender VARCHAR(20),
    test_slug VARCHAR(50),
    indication_id INT,
    collection_method ENUM('home_visit', 'clinic', 'lab') DEFAULT 'lab',
    collection_location VARCHAR(100),
    appointment_date DATE,
    appointment_time TIME,
    healthcare_provider_id INT,
    referral_code VARCHAR(50),
    total_price DECIMAL(10, 2),
    payment_status VARCHAR(50) DEFAULT 'pending',
    booking_status VARCHAR(50) DEFAULT 'new',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    FOREIGN KEY (indication_id) REFERENCES test_indications(id) ON DELETE SET NULL,
    FOREIGN KEY (healthcare_provider_id) REFERENCES healthcare_providers(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed Data: Locations
-- We need to get the Tenant ID for 'westesti' first.
-- Since we can't do variables easily in one go across sessions, we'll do nested selects or assumptions.
-- Using nested select for inserting data.

INSERT INTO locations (tenant_id, city, district, omega_care_available, coverage_radius_km)
SELECT id, 'İzmir', 'Alsancak', TRUE, 15 FROM tenants WHERE code = 'westesti'
UNION ALL
SELECT id, 'İzmir', 'Karşıyaka', TRUE, 15 FROM tenants WHERE code = 'westesti'
UNION ALL
SELECT id, 'Manisa', 'Merkez', TRUE, 20 FROM tenants WHERE code = 'westesti'
UNION ALL
SELECT id, 'Denizli', 'Merkez', TRUE, 25 FROM tenants WHERE code = 'westesti';

-- Seed Data: Sales Reps
INSERT INTO sales_reps (tenant_id, name, email, region)
SELECT id, 'Yasin D.', 'yasin@westesti.com', 'İzmir' FROM tenants WHERE code = 'westesti'
UNION ALL
SELECT id, 'Elif K.', 'elif@westesti.com', 'Manisa' FROM tenants WHERE code = 'westesti';

-- Seed Data: Healthcare Providers
INSERT INTO healthcare_providers (tenant_id, name, specialty, hospital_clinic, discount_percent)
SELECT id, 'Prof. Dr. Mehmet Akbaş', 'Hematology', 'Ankara Hematology Clinic', 15.00 FROM tenants WHERE code = 'trombofili'
UNION ALL
SELECT id, 'Dr. Ayşe Kara', 'Cardiology', 'Istanbul Cardiac Center', 10.00 FROM tenants WHERE code = 'trombofili';
