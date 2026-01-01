<?php
// api/modules/contact/contact.public.controller.php

// Handled by index.php
// Temporarily disabled to prevent path issues

function ensure_contact_submissions_table($conn): void
{
    $conn->exec("
        CREATE TABLE IF NOT EXISTS contact_submissions (
            id INT AUTO_INCREMENT PRIMARY KEY,
            tenant_id VARCHAR(50) NOT NULL DEFAULT 'nipt',
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            phone VARCHAR(50),
            message TEXT,
            home_service TINYINT DEFAULT 0,
            address TEXT,
            pregnancy_week INT,
            has_doctor TINYINT DEFAULT 0,
            doctor_id INT,
            doctor_name VARCHAR(255),
            pricing_tier VARCHAR(50) DEFAULT 'direct',
            status VARCHAR(50) DEFAULT 'new',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_tenant (tenant_id),
            INDEX idx_status (status),
            INDEX idx_created (created_at DESC)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");
}

function handle_contact_public($action)
{
    // Silence output to prevent non-JSON data
    error_reporting(E_ALL);
    ini_set('display_errors', 0); // Do not echo errors to stdout

    if ($action === 'submit_nipt_contact' && $_SERVER['REQUEST_METHOD'] === 'POST') {
        header('Content-Type: application/json');

        try {
            global $conn;
            if (!isset($conn)) {
                $conn = get_db_connection();
            }

            // Ensure table exists
            ensure_contact_submissions_table($conn);

            $raw_input = file_get_contents('php://input');
            if (!$raw_input) {
                throw new Exception('No input data received');
            }

            $data = json_decode($raw_input, true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                throw new Exception('Invalid JSON input');
            }

            // Validation
            if (empty($data['name']) || empty($data['email']) || empty($data['phone']) || empty($data['pregnancy_week'])) {
                throw new Exception('Missing required fields: name, email, phone, or pregnancy_week');
            }

            // Logic
            $pricing_tier = 'direct';
            $has_doctor = !empty($data['has_doctor']);
            $doctor_id = !empty($data['doctor_id']) ? $data['doctor_id'] : null;
            $doctor_name = !empty($data['doctor_name']) ? $data['doctor_name'] : null;

            if ($has_doctor && ($doctor_id || $doctor_name)) {
                $pricing_tier = 'doctor_referral';
            }

            // DB Insert
            $stmt = $conn->prepare("
                INSERT INTO contact_submissions 
                (name, email, phone, home_service, address, pregnancy_week, has_doctor, doctor_id, doctor_name, pricing_tier, message, tenant_id)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'nipt')
            ");

            $result = $stmt->execute([
                $data['name'],
                $data['email'],
                $data['phone'],
                !empty($data['home_service']) ? 1 : 0,
                $data['address'] ?? null,
                $data['pregnancy_week'],
                $has_doctor ? 1 : 0,
                $doctor_id,
                $doctor_name,
                $pricing_tier,
                $data['message'] ?? null
            ]);

            if (!$result) {
                throw new Exception("Database insert failed: " . implode(", ", $stmt->errorInfo()));
            }

            $id = $conn->lastInsertId();

            echo json_encode(['success' => true, 'id' => $id]);
            return true;

        } catch (Exception $e) {
            http_response_code(400); // Bad Request
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
            return true;
        }
    }

    if ($action === 'get_contact_config_public') {
        $tenant_code = get_current_tenant_code();
        $config = contact_get_config($tenant_code);

        if ($config) {
            // Decode JSON fields if they exist
            if (isset($config['social_links_json'])) {
                $config['social_links'] = json_decode($config['social_links_json'], true);
            }
            echo json_encode(['success' => true, 'data' => $config]);
        } else {
            echo json_encode(['success' => true, 'data' => null]);
        }
        return true;
    }

    return false;
}
