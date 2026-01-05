<?php
// api/modules/contact/contact.public.controller.php

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../core/tenant/tenant.service.php';
require_once __DIR__ . '/contact.service.php';
require_once __DIR__ . '/../nipt/email_service.php'; // Brevo integration

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

    // ==========================================
    // General contact form submission
    // Used by /iletisim page for all tenants
    // ==========================================
    if ($action === 'submit_contact_message' && $_SERVER['REQUEST_METHOD'] === 'POST') {
        header('Content-Type: application/json');

        try {
            $raw_input = file_get_contents('php://input');
            if (!$raw_input) {
                throw new Exception('No input data received');
            }

            $data = json_decode($raw_input, true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                throw new Exception('Invalid JSON input');
            }

            // Validation
            if (empty($data['name']) || empty($data['email']) || empty($data['message'])) {
                throw new Exception('Ad, e-posta ve mesaj alanları zorunludur');
            }

            if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
                throw new Exception('Geçerli bir e-posta adresi giriniz');
            }

            $tenant_code = get_current_tenant_code();

            if (!$tenant_code) {
                $tenant_code = 'turp';
            }

            // Insert into contact_messages table using service
            $message_id = contact_create_message($tenant_code, [
                'name' => $data['name'],
                'email' => $data['email'],
                'phone' => $data['phone'] ?? null,
                'subject' => $data['subject'] ?? 'Genel İletişim',
                'message' => $data['message']
            ]);

            error_log("[Contact] New message created: ID=$message_id, Tenant=$tenant_code");

            // Send Brevo email notification to admin
            $admin_email = 'info@nipt.tr'; // Default admin email

            // Try to get admin email from contact config
            $contact_config = contact_get_config($tenant_code);
            if ($contact_config && !empty($contact_config['email'])) {
                $admin_email = $contact_config['email'];
            }

            $email_subject = "[$tenant_code] Yeni İletişim Formu Mesajı: " . ($data['subject'] ?? 'Genel');
            $email_body = "
                <h2>Yeni İletişim Formu Mesajı</h2>
                <table style='border-collapse: collapse; width: 100%;'>
                    <tr><td style='padding: 8px; border: 1px solid #ddd;'><strong>Ad Soyad:</strong></td><td style='padding: 8px; border: 1px solid #ddd;'>" . htmlspecialchars($data['name']) . "</td></tr>
                    <tr><td style='padding: 8px; border: 1px solid #ddd;'><strong>E-posta:</strong></td><td style='padding: 8px; border: 1px solid #ddd;'>" . htmlspecialchars($data['email']) . "</td></tr>
                    <tr><td style='padding: 8px; border: 1px solid #ddd;'><strong>Telefon:</strong></td><td style='padding: 8px; border: 1px solid #ddd;'>" . htmlspecialchars($data['phone'] ?? '-') . "</td></tr>
                    <tr><td style='padding: 8px; border: 1px solid #ddd;'><strong>Konu:</strong></td><td style='padding: 8px; border: 1px solid #ddd;'>" . htmlspecialchars($data['subject'] ?? 'Genel') . "</td></tr>
                    <tr><td style='padding: 8px; border: 1px solid #ddd;'><strong>Mesaj:</strong></td><td style='padding: 8px; border: 1px solid #ddd;'>" . nl2br(htmlspecialchars($data['message'])) . "</td></tr>
                </table>
                <p style='margin-top: 16px; color: #666;'>Bu mesaj " . date('d.m.Y H:i') . " tarihinde $tenant_code iletişim formu üzerinden gönderilmiştir.</p>
            ";

            try {
                $email_sent = send_notification_email($admin_email, $email_subject, $email_body);
                if ($email_sent) {
                    error_log("[Contact] Brevo notification sent to $admin_email for message ID=$message_id");
                } else {
                    error_log("[Contact] Brevo notification failed for message ID=$message_id");
                }
            } catch (Throwable $e) {
                error_log("[Contact] Brevo error: " . $e->getMessage());
                // Don't fail the request if email fails
            }

            echo json_encode([
                'success' => true,
                'message_id' => $message_id,
                'message' => 'Mesajınız başarıyla gönderildi. En kısa sürede sizinle iletişime geçeceğiz.'
            ]);
            return true;

        } catch (Exception $e) {
            http_response_code(400);
            error_log("[Contact] Error: " . $e->getMessage());
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
            return true;
        }
    }

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

            $tenant_code = get_current_tenant_code();

            // Fallback if no tenant context found (rare)
            if (!$tenant_code) {
                $tenant_code = 'turp';
            }

            // DB Insert
            $stmt = $conn->prepare("
                INSERT INTO contact_submissions 
                (name, email, phone, home_service, address, pregnancy_week, has_doctor, doctor_id, doctor_name, pricing_tier, message, tenant_id)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
                $data['message'] ?? null,
                $tenant_code
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
