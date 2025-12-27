<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
require_once __DIR__ . '/db_connection.php';

header('Content-Type: text/plain; charset=utf-8');
echo "=== NIPT Database Migration ===\n\n";

try {
    $conn = get_db_connection();
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // 1. nipt_patients
    echo "Creating nipt_patients...\n";
    try {
        $conn->exec("
            CREATE TABLE IF NOT EXISTS nipt_patients (
                id INT AUTO_INCREMENT PRIMARY KEY,
                tenant_id INT NOT NULL,
                email VARCHAR(255) NOT NULL,
                password_hash VARCHAR(255),
                full_name VARCHAR(255) NOT NULL,
                phone VARCHAR(20),
                date_of_birth DATE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                UNIQUE KEY unique_tenant_email (tenant_id, email),
                INDEX idx_tenant (tenant_id),
                INDEX idx_email (email)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        ");
        echo "✓ nipt_patients created/exists\n";
    } catch (PDOException $e) {
        echo "✗ nipt_patients error: " . $e->getMessage() . "\n";
    }

    // 2. nipt_bookings
    echo "Creating nipt_bookings...\n";
    try {
        $conn->exec("
            CREATE TABLE IF NOT EXISTS nipt_bookings (
                id INT AUTO_INCREMENT PRIMARY KEY,
                tenant_id INT NOT NULL,
                patient_id INT NOT NULL,
                booking_date DATE NOT NULL,
                booking_time TIME,
                sample_collection_method ENUM('courier', 'clinic') DEFAULT 'courier',
                sample_collection_address TEXT,
                clinic_location VARCHAR(255),
                status ENUM('pending', 'confirmed', 'sample_collected', 'in_lab', 'completed', 'cancelled') DEFAULT 'pending',
                kvkk_consent BOOLEAN DEFAULT FALSE,
                test_terms_consent BOOLEAN DEFAULT FALSE,
                communication_consent BOOLEAN DEFAULT FALSE,
                notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_tenant (tenant_id),
                INDEX idx_patient (patient_id),
                INDEX idx_status (status),
                INDEX idx_booking_date (booking_date),
                FOREIGN KEY (patient_id) REFERENCES nipt_patients(id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        ");
        echo "✓ nipt_bookings created/exists\n";
    } catch (PDOException $e) {
        echo "✗ nipt_bookings error: " . $e->getMessage() . "\n";
    }

    // 3. nipt_test_results
    echo "Creating nipt_test_results...\n";
    try {
        $conn->exec("
            CREATE TABLE IF NOT EXISTS nipt_test_results (
                id INT AUTO_INCREMENT PRIMARY KEY,
                tenant_id INT NOT NULL,
                patient_id INT NOT NULL,
                booking_id INT NOT NULL,
                test_date DATE,
                result_status ENUM('pending', 'processing', 'ready', 'reviewed') DEFAULT 'pending',
                pdf_filename VARCHAR(255),
                pdf_path VARCHAR(500),
                findings_summary TEXT,
                uploaded_by INT,
                uploaded_at TIMESTAMP NULL,
                reviewed_by INT,
                reviewed_at TIMESTAMP NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_tenant (tenant_id),
                INDEX idx_patient (patient_id),
                INDEX idx_booking (booking_id),
                INDEX idx_status (result_status),
                UNIQUE KEY unique_booking_result (booking_id),
                FOREIGN KEY (patient_id) REFERENCES nipt_patients(id) ON DELETE CASCADE,
                FOREIGN KEY (booking_id) REFERENCES nipt_bookings(id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        ");
        echo "✓ nipt_test_results created/exists\n";
    } catch (PDOException $e) {
        echo "✗ nipt_test_results error: " . $e->getMessage() . "\n";
    }

    // 4. nipt_consents
    echo "Creating nipt_consents...\n";
    try {
        $conn->exec("
            CREATE TABLE IF NOT EXISTS nipt_consents (
                id INT AUTO_INCREMENT PRIMARY KEY,
                tenant_id INT NOT NULL,
                patient_id INT NOT NULL,
                consent_type ENUM('kvkk', 'test_terms', 'communication') NOT NULL,
                consent_given BOOLEAN DEFAULT FALSE,
                ip_address VARCHAR(45),
                user_agent TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_tenant (tenant_id),
                INDEX idx_patient (patient_id),
                INDEX idx_type (consent_type),
                FOREIGN KEY (patient_id) REFERENCES nipt_patients(id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        ");
        echo "✓ nipt_consents created/exists\n";
    } catch (PDOException $e) {
        echo "✗ nipt_consents error: " . $e->getMessage() . "\n";
    }

    // 5. Seed Tenants
    echo "Seeding tenants...\n";
    try {
        $conn->exec("
            INSERT INTO tenants (name, code, primary_domain, logo_url, primary_color, is_active) VALUES
            ('MomGuard NIPT', 'momguard', 'nipt.tr', '/assets/logos/momguard.png', '#2563EB', TRUE),
            ('Verifi NIPT', 'verifi', 'nipt.tr', '/assets/logos/verifi.png', '#10B981', TRUE),
            ('Veritas NIPT', 'veritas', 'nipt.tr', '/assets/logos/veritas.png', '#F59E0B', TRUE)
            ON DUPLICATE KEY UPDATE name = VALUES(name), primary_domain = VALUES(primary_domain)
        ");
        echo "✓ Tenants seeded\n";
    } catch (PDOException $e) {
        echo "✗ Tenants error: " . $e->getMessage() . "\n";
    }

    echo "\n=== Verification ===\n";
    $stmt = $conn->query("SHOW TABLES LIKE 'nipt_%'");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    echo "Tables: " . implode(', ', $tables) . "\n";

    echo "\n=== Migration Complete ===\n";

} catch (Exception $e) {
    echo "\nFATAL ERROR: " . $e->getMessage() . "\n";
}
