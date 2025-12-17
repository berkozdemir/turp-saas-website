
-- 3. Diğer Tablolar (Opsiyonel ama Gelecek İçin)
CREATE TABLE IF NOT EXISTS iwrs_saas_randomization_forms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    contact_person VARCHAR(255),
    institution VARCHAR(255),
    phone VARCHAR(50),
    email VARCHAR(255),
    study_name VARCHAR(255),
    study_type VARCHAR(100),
    treatment_arms INT,
    total_participants INT,
    has_stratification BOOLEAN,
    stratification_factors TEXT,
    randomization_method VARCHAR(100),
    block_size INT,
    has_blinding BOOLEAN,
    blinding_details TEXT,
    emergency_code_opening BOOLEAN,
    inventory_integration BOOLEAN,
    reporting_preferences JSON,
    test_run BOOLEAN,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS iwrs_saas_contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
