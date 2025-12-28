<?php
// NIPT API Handler
// Handles Patient Auth, Bookings, and Results for NIPT Platform

require_once __DIR__ . '/tenant_helper.php';
require_once __DIR__ . '/auth_helper.php';
require_once __DIR__ . '/jwt_helper.php';
require_once __DIR__ . '/email_service.php';

// Helper to validate NIPT tenant access
function validate_nipt_tenant($conn)
{
    $tenant_id = get_current_tenant($conn);
    // Verify this is a NIPT tenant
    $stmt = $conn->prepare("SELECT code FROM tenants WHERE id = ?");
    $stmt->execute([$tenant_id]);
    $tenant = $stmt->fetch(PDO::FETCH_ASSOC);

    $nipt_codes = ['momguard', 'verifi', 'veritas', 'nipt'];

    // For now, allow development if tenant logic is strictly enforced elsewhere, 
    // but ideally we check if it is one of the NIPT brands.
    if ($tenant && in_array($tenant['code'], $nipt_codes)) {
        return $tenant_id;
    }

    // If we are on the main portal domain/path, tenant might not be set yet for generic actions,
    // but for bookings we usually need a specific tenant context.
    return $tenant_id;
}

// --- ACTIONS ---

// 0. Setup NIPT Schema (Temporary/Admin Action)
if ($action == 'setup_nipt_schema') {
    try {
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // 1. nipt_patients
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

        // 2. nipt_bookings
        $conn->exec("
            CREATE TABLE IF NOT EXISTS nipt_bookings (
                id INT AUTO_INCREMENT PRIMARY KEY,
                tenant_id INT NOT NULL,
                patient_id INT NOT NULL,
                booking_date DATE NOT NULL,
                booking_time TIME,
                sample_collection_method ENUM('courier', 'clinic', 'home_care') DEFAULT 'courier',
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

        // 3. nipt_test_results
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

        // 4. nipt_consents
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

        // 5. Referral Codes (Doctor/Partner System)
        $conn->exec("
            CREATE TABLE IF NOT EXISTS referral_codes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                code VARCHAR(50) NOT NULL UNIQUE,
                doctor_name VARCHAR(255),
                sales_rep_id INT, -- Link to admin_users if needed
                discount_percent DECIMAL(5,2) DEFAULT 0.00,
                usage_count INT DEFAULT 0,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_code (code)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        ");

        // 6. Service Regions (Logistics / Home Care Availability)
        $conn->exec("
            CREATE TABLE IF NOT EXISTS service_regions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                city VARCHAR(100) NOT NULL,
                district VARCHAR(100), -- If null, covers whole city
                is_active_for_home_care BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE KEY unique_region (city, district)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        ");

        // 7. Update nipt_bookings for Referrals if not exists
        try {
            $conn->exec("ALTER TABLE nipt_bookings ADD COLUMN referral_code_id INT DEFAULT NULL");
            $conn->exec("ALTER TABLE nipt_bookings ADD CONSTRAINT fk_booking_referral FOREIGN KEY (referral_code_id) REFERENCES referral_codes(id) ON DELETE SET NULL");
        } catch (Exception $e) {
            // Column likely exists
        }

        // 7b. Update sample_collection_method ENUM for Home Care
        try {
            $conn->exec("ALTER TABLE nipt_bookings MODIFY COLUMN sample_collection_method ENUM('courier', 'clinic', 'home_care') DEFAULT 'courier'");
        } catch (Exception $e) {
            // Ignore if fails or already set
        }

        // 8. Seed Tenants
        $conn->exec("
            INSERT INTO tenants (name, code, primary_domain, logo_url, primary_color, is_active) VALUES
            ('MomGuard NIPT', 'momguard', 'nipt.tr', '/assets/logos/momguard.png', '#2563EB', TRUE),
            ('Verifi NIPT', 'verifi', 'nipt.tr', '/assets/logos/verifi.png', '#10B981', TRUE),
            ('Veritas NIPT', 'veritas', 'nipt.tr', '/assets/logos/veritas.png', '#F59E0B', TRUE)
            ON DUPLICATE KEY UPDATE name = VALUES(name), primary_domain = VALUES(primary_domain)
        ");

        // 8b. Assign NIPT Tenants to ALL Admin Users
        // Ensure all admins have access to these new tenants
        $conn->exec("
            INSERT IGNORE INTO admin_user_tenants (user_id, tenant_id, role)
            SELECT u.id, t.id, 'admin' 
            FROM admin_users u
            CROSS JOIN tenants t 
            WHERE t.code IN ('momguard', 'verifi', 'veritas')
        ");

        // 9. Seed Demo Data (Referrals & Regions)
        $conn->exec("
            INSERT IGNORE INTO referral_codes (code, doctor_name, discount_percent) VALUES 
            ('DRALI10', 'Dr. Ali Veli', 5.00),
            ('DRAYSE5', 'Dr. Ayşe Yılmaz', 5.00),
            ('OMEGA2025', 'Omega Kampanya', 10.00)
        ");

        $conn->exec("
            INSERT IGNORE INTO service_regions (city, district, is_active_for_home_care) VALUES 
            ('İSTANBUL', NULL, TRUE),
            ('ANKARA', NULL, TRUE),
            ('İZMİR', NULL, TRUE),
            ('BURSA', NULL, TRUE),
            ('ANTALYA', NULL, TRUE),
            ('ADANA', NULL, TRUE)
        ");

        echo json_encode(['success' => true, 'message' => 'NIPT Schema upgraded with Logistics & Referrals']);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
    exit;
}

// 1. NIPT Patient Registration
if ($action == 'nipt_register' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $tenant_id = validate_nipt_tenant($conn);
        $data = json_decode(file_get_contents('php://input'), true);

        // Validation
        if (empty($data['email']) || empty($data['password']) || empty($data['full_name'])) {
            throw new Exception('Missing required fields');
        }

        // Check existing
        $stmt = $conn->prepare("SELECT id FROM nipt_patients WHERE email = ? AND tenant_id = ?");
        $stmt->execute([$data['email'], $tenant_id]);
        if ($stmt->fetch()) {
            throw new Exception('Email already registered for this test type');
        }

        // Hash password
        $password_hash = password_hash($data['password'], PASSWORD_DEFAULT);

        // Insert
        $stmt = $conn->prepare("
            INSERT INTO nipt_patients (tenant_id, email, password_hash, full_name, phone, date_of_birth)
            VALUES (?, ?, ?, ?, ?, ?)
        ");

        $stmt->execute([
            $tenant_id,
            $data['email'],
            $password_hash,
            $data['full_name'],
            $data['phone'] ?? null,
            $data['date_of_birth'] ?? null
        ]);

        $user_id = $conn->lastInsertId();

        // Generate Token
        $token = generate_jwt([
            'user_id' => $user_id,
            'email' => $data['email'],
            'tenant_id' => $tenant_id,
            'role' => 'patient'
        ]);

        echo json_encode([
            'success' => true,
            'token' => $token,
            'user' => [
                'id' => $user_id,
                'email' => $data['email'],
                'full_name' => $data['full_name']
            ]
        ]);

    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode(['error' => $e->getMessage()]);
    }
    exit;
}

// 2. NIPT Login
if ($action == 'nipt_login' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $tenant_id = validate_nipt_tenant($conn);
        $data = json_decode(file_get_contents('php://input'), true);

        if (empty($data['email']) || empty($data['password'])) {
            throw new Exception('Email and password required');
        }

        $stmt = $conn->prepare("SELECT * FROM nipt_patients WHERE email = ? AND tenant_id = ?");
        $stmt->execute([$data['email'], $tenant_id]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user || !password_verify($data['password'], $user['password_hash'])) {
            throw new Exception('Invalid credentials');
        }

        $token = generate_jwt([
            'user_id' => $user['id'],
            'email' => $user['email'],
            'tenant_id' => $tenant_id,
            'role' => 'patient'
        ]);

        echo json_encode([
            'success' => true,
            'token' => $token,
            'user' => [
                'id' => $user['id'],
                'email' => $user['email'],
                'full_name' => $user['full_name']
            ]
        ]);

    } catch (Exception $e) {
        http_response_code(401);
        echo json_encode(['error' => $e->getMessage()]);
    }
    exit;
}

// 3. Create Booking
if ($action == 'create_booking' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $tenant_id = validate_nipt_tenant($conn);
        $data = json_decode(file_get_contents('php://input'), true);

        // Helper: Find or Create Patient Logic could be here, or assume patient is logged in.
        // For guest checkout flow, we might create patient implicitly.

        // Assuming Guest Flow for MVP (Create patient or use existing by email)
        if (empty($data['patient_info']['email'])) {
            throw new Exception('Patient email required');
        }

        $email = $data['patient_info']['email'];

        // Find patient
        $stmt = $conn->prepare("SELECT id FROM nipt_patients WHERE email = ? AND tenant_id = ?");
        $stmt->execute([$email, $tenant_id]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        $patient_id = $user ? $user['id'] : null;

        if (!$patient_id) {
            // Create new patient (auto-generated password or null)
            $stmt = $conn->prepare("
                INSERT INTO nipt_patients (tenant_id, email, full_name, phone, date_of_birth)
                VALUES (?, ?, ?, ?, ?)
            ");
            $stmt->execute([
                $tenant_id,
                $email,
                $data['patient_info']['full_name'],
                $data['patient_info']['phone'] ?? null,
                $data['patient_info']['date_of_birth'] ?? null
            ]);
            $patient_id = $conn->lastInsertId();
        }

        // Handle Referral Code & Discount
        $referral_id = null;
        if (!empty($data['referral_code'])) {
            $code = strtoupper(trim($data['referral_code']));
            $stmt = $conn->prepare("SELECT id FROM referral_codes WHERE code = ? AND is_active = 1");
            $stmt->execute([$code]);
            $ref = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($ref) {
                $referral_id = $ref['id'];
                // Update usage
                $conn->prepare("UPDATE referral_codes SET usage_count = usage_count + 1 WHERE id = ?")->execute([$referral_id]);
            }
        }

        // Create Booking
        // Check if referral_code_id column exists (it should from Agent 1)
        // But to be safe if migration failed, we might wrap in try catch or check schema.
        // Assuming schema is up to date since we ran setup.

        $stmt = $conn->prepare("
            INSERT INTO nipt_bookings 
            (tenant_id, patient_id, booking_date, booking_time, sample_collection_method, sample_collection_address, clinic_location, status, kvkk_consent, test_terms_consent, referral_code_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?)
        ");

        $stmt->execute([
            $tenant_id,
            $patient_id,
            $data['date'],
            $data['time'] ?? '09:00:00',
            $data['location_type'] ?? 'courier',
            $data['address'] ?? null,
            $data['clinic_id'] ?? null,
            (int) ($data['consents']['kvkk'] ?? 0),
            (int) ($data['consents']['terms'] ?? 0),
            $referral_id
        ]);

        $booking_id = $conn->lastInsertId();

        // Send Email (Mock for now, or use email_service)
        // send_booking_confirmation($email, $booking_id);

        echo json_encode([
            'success' => true,
            'message' => 'Booking created successfully',
            'booking_id' => $booking_id,
            'referral_applied' => $referral_id ? true : false
        ]);

    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode(['error' => $e->getMessage()]);
    }
    exit;
}


// 4. Validate Referral Code
if ($action == 'validate_referral' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $data = json_decode(file_get_contents('php://input'), true);
        $code = strtoupper(trim($data['code'] ?? ''));

        if (empty($code)) {
            throw new Exception('Code required');
        }

        $stmt = $conn->prepare("SELECT id, code, doctor_name, discount_percent FROM referral_codes WHERE code = ? AND is_active = 1");
        $stmt->execute([$code]);
        $referral = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($referral) {
            echo json_encode([
                'valid' => true,
                'code' => $referral['code'],
                'doctor_name' => $referral['doctor_name'],
                'discount_percent' => (float) $referral['discount_percent']
            ]);
        } else {
            echo json_encode(['valid' => false, 'message' => 'Geçersiz veya süresi dolmuş kod']);
        }
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode(['error' => $e->getMessage()]);
    }
    exit;
}

// 6. Admin: Get Bookings List
if ($action == 'get_bookings' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        // Admin or Tenant Context Check (For now allow all authenticated admins)
        // Ideally we check require_admin_auth() here if not handled by router
        // Assuming this is called with admin token header which is validated by middleware or here?
        // For MVP in this file: we rely on validate_nipt_tenant or just fetch all for the tenant context.

        // Fetch ALL NIPT bookings regardless of selected tenant context in Admin Panel
        // This satisfies the user request to have a single view without switching sites.
        $sql = "
            SELECT 
                b.*,
                p.full_name as patient_name,
                p.phone as patient_phone,
                p.email as patient_email,
                pk.code as referral_code,
                pk.doctor_name as referrer_name,
                t.name as tenant_name
            FROM nipt_bookings b
            JOIN nipt_patients p ON b.patient_id = p.id
            JOIN tenants t ON b.tenant_id = t.id
            LEFT JOIN referral_codes pk ON b.referral_code_id = pk.id
            WHERE t.code IN ('momguard', 'verifi', 'veritas', 'westesti') OR t.code = 'nipt'
        ";

        $params = [];

        if ($status) {
            $sql .= " AND b.status = ?";
            $params[] = $status;
        }

        if ($date) {
            $sql .= " AND b.booking_date = ?";
            $params[] = $date;
        }

        if (!empty($_GET['search'])) {
            $search = "%" . $_GET['search'] . "%";
            $sql .= " AND (p.full_name LIKE ? OR p.phone LIKE ? OR b.id LIKE ?)";
            $params[] = $search;
            $params[] = $search;
            $params[] = $search;
        }

        // Pagination
        $limit = isset($_GET['limit']) ? (int) $_GET['limit'] : 50;
        $offset = isset($_GET['offset']) ? (int) $_GET['offset'] : 0;

        $sql .= " ORDER BY b.booking_date DESC, b.booking_time ASC LIMIT $limit OFFSET $offset";

        $stmt = $conn->prepare($sql);
        $stmt->execute($params);
        $bookings = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode(['success' => true, 'data' => $bookings]);

    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode(['error' => $e->getMessage()]);
    }
    exit;
}

// 7. Admin: Update Booking Status
if ($action == 'update_booking_status' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $data = json_decode(file_get_contents('php://input'), true);

        if (empty($data['id']) || empty($data['status'])) {
            throw new Exception('ID and Status required');
        }

        $valid_statuses = ['pending', 'confirmed', 'sample_collected', 'in_lab', 'completed', 'cancelled'];
        if (!in_array($data['status'], $valid_statuses)) {
            throw new Exception('Invalid status');
        }

        $stmt = $conn->prepare("UPDATE nipt_bookings SET status = ? WHERE id = ?");
        $stmt->execute([$data['status'], $data['id']]);

        // TODO: Trigger Email notification based on status (e.g. 'confirmed', 'completed')

        echo json_encode(['success' => true, 'message' => 'Status updated']);

    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode(['error' => $e->getMessage()]);
    }
    exit;
}


