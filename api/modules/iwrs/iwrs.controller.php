<?php
// IWRS API
// Handles Blog, Randomization, and Inventory endpoints

// Prevent any output before JSON
ob_start();

require_once __DIR__ . '/db_connection.php';
require_once __DIR__ . '/auth_helper.php';
require_once __DIR__ . '/email_service.php';
require_once __DIR__ . '/tenant_helper.php';

// Enable CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}


$request_method = $_SERVER['REQUEST_METHOD'];
$resource = $_GET['resource'] ?? '';
$id = $_GET['id'] ?? null;

// --- API LOGGING MIDDLEWARE ---
if ($resource !== 'api-logs' && $resource !== 'get-messages') { // Don't log log-fetching
    try {
        $logParams = [
            'endpoint' => $resource,
            'method' => $request_method,
            'request_data' => ($request_method === 'POST' || $request_method === 'PUT') ? file_get_contents('php://input') : json_encode($_GET),
            'ip_address' => $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0',
            'user_id' => null
        ];

        // Attempt to get user ID if authorized (without breaking flow)
        // This is a lightweight check; for full auth we rely on endpoints
        $headers = getallheaders();
        if (isset($headers['Authorization']) && preg_match('/Bearer\s(\S+)/', $headers['Authorization'], $matches)) {
            $token = $matches[1];
            // We need a separate connection or reuse one, but main conn isn't established yet in this file flow?
            // Actually it is established at line 139. We should log AFTER connection.
        }
    } catch (Exception $e) { /* Ignore log errors */
    }
}


// Helper to load env for AI Chat if DB not connected yet
function load_env_safe()
{
    $env_file = __DIR__ . '/../.env';
    if (file_exists($env_file)) {
        $lines = file($env_file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        foreach ($lines as $line) {
            if (strpos(trim($line), '#') === 0)
                continue;
            if (strpos($line, '=') !== false) {
                list($name, $value) = explode('=', $line, 2);
                $_ENV[trim($name)] = trim($value);
                putenv(trim($name) . '=' . trim($value));
            }
        }
    }
}

// --- AI CHAT (No DB Required) ---
$resource = $_GET['resource'] ?? '';
if ($resource === 'ai-chat') {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);
        $userMessage = $data['message'] ?? '';

        if (empty($userMessage)) {
            http_response_code(400);
            echo json_encode(['error' => 'Message is required']);
            exit;
        }

        load_env_safe();
        $apiKey = getenv('DEEPSEEK_API_KEY');

        if (!$apiKey) {
            // Fallback to OpenAI if DeepSeek missing
            $apiKey = getenv('OPENAI_API_KEY');
            $apiUrl = 'https://api.openai.com/v1/chat/completions';
            $model = 'gpt-4o-mini';
        } else {
            $apiUrl = 'https://api.deepseek.com/chat/completions';
            $model = 'deepseek-chat';
        }

        if (!$apiKey) {
            echo json_encode(['reply' => 'Üzgünüm, şu anda yapay zeka servisine erişemiyorum (API Key eksik).']);
            exit;
        }

        $systemPrompt = "Sen 'Lila' adında, medikal araştırmalar ve klinik çalışmalar konusunda uzmanlaşmış bir yapay zeka asistanısın. 
        Omega CRO için çalışıyorsun.
        İnsanlara nazik, profesyonel ve yardımcı bir tonda cevap veriyorsun. 
        Kullanıcıların klinik araştırmalar, IWRS sistemleri ve medikal süreçlerle ilgili sorularını yanıtla.
        Cevapların Türkçe olmalı. Kısa, öz ve anlaşılır olsun.";

        $payload = [
            'model' => $model,
            'messages' => [
                ['role' => 'system', 'content' => $systemPrompt],
                ['role' => 'user', 'content' => $userMessage]
            ],
            'temperature' => 0.7,
            'max_tokens' => 500
        ];

        $ch = curl_init($apiUrl);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'Authorization: Bearer ' . $apiKey
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode === 200) {
            $responseData = json_decode($response, true);
            $reply = $responseData['choices'][0]['message']['content'] ?? 'Cevap alınamadı.';
            echo json_encode(['reply' => $reply]);
        } else {
            echo json_encode(['reply' => 'Üzgünüm, şu anda hizmet veremiyorum.', 'debug' => $response]);
        }
    }
    exit;
}

// Helper to generate UUID v4
function guidv4()
{
    $data = random_bytes(16);
    $data[6] = chr(ord($data[6]) & 0x0f | 0x40); // set version to 0100
    $data[8] = chr(ord($data[8]) & 0x3f | 0x80); // set bits 6-7 to 10
    return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
}

// Helper for JSON response
function json_response($data, $status = 200)
{
    // Clear any previous output (warnings, notices, whitespace)
    ob_end_clean();

    http_response_code($status);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

// Connect to DB for other resources
$conn = get_db_connection();

// --- LOGGING EXECUTION ---
if (isset($logParams)) {
    // Try to identify user
    if (isset($headers['Authorization']) && preg_match('/Bearer\s(\S+)/', $headers['Authorization'], $matches)) {
        $stmtLog = $conn->prepare("SELECT user_id FROM admin_sessions WHERE token = ?");
        $stmtLog->execute([$matches[1]]);
        if ($uid = $stmtLog->fetchColumn()) {
            $logParams['user_id'] = $uid;
        }
    }
    // redact sensitive
    if (strpos($logParams['request_data'], 'password') !== false) {
        $logParams['request_data'] = 'REDACTED';
    }

    $stmtLog = $conn->prepare("INSERT INTO api_logs (endpoint, method, request_data, ip_address, user_id, created_at) VALUES (?, ?, ?, ?, ?, NOW())");
    $stmtLog->execute([
        $logParams['endpoint'],
        $logParams['method'],
        substr($logParams['request_data'], 0, 5000), // Truncate if too long
        $logParams['ip_address'],
        $logParams['user_id']
    ]);
}

// --- HELPER: Email Logging ---
function log_email_dispatch($conn, $to, $subject, $type, $status, $error = null)
{
    try {
        $stmt = $conn->prepare("INSERT INTO email_logs (recipient_email, subject, email_type, status, error_message, sent_at) VALUES (?, ?, ?, ?, ?, NOW())");
        $stmt->execute([$to, $subject, $type, $status, $error]);
    } catch (Exception $e) {
        error_log("Log Email Failed: " . $e->getMessage());
    }
}
// --- BLOG POSTS (Multilingual Single-Row Model) ---
if ($resource === 'blog_posts') {
    $tenant_id = get_current_tenant($conn);

    // GET /api/iwrs_api.php?resource=blog_posts
    if ($request_method === 'GET') {
        if ($id) {
            // Get single post by ID or Slug
            $sql = "SELECT * FROM blog_posts WHERE (id = ? OR slug = ?) AND tenant_id = ?";
            $stmt = $conn->prepare($sql);
            $stmt->execute([$id, $id, $tenant_id]);
            $post = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($post) {
                // Public: check status
                $headers = getallheaders();
                $auth_header = isset($headers['Authorization']) ? $headers['Authorization'] : '';
                if (empty($auth_header)) {
                    if ($post['status'] !== 'published' || ($post['published_at'] && strtotime($post['published_at']) > time())) {
                        json_response(['error' => 'Post not found or not published'], 404);
                    }
                }
                json_response($post);
            } else {
                json_response(['error' => 'Post not found'], 404);
            }
        } else {
            // List posts
            $limit = $_GET['limit'] ?? 50;
            $where = ["tenant_id = ?"];
            $params = [$tenant_id];

            $headers = getallheaders();
            $auth_header = isset($headers['Authorization']) ? $headers['Authorization'] : '';

            if (empty($auth_header)) {
                $where[] = "status = 'published'";
                $where[] = "published_at <= NOW()";
            }

            $whereSql = implode(' AND ', $where);
            $sql = "SELECT * FROM blog_posts WHERE $whereSql ORDER BY published_at DESC, created_at DESC LIMIT " . intval($limit);

            $stmt = $conn->prepare($sql);
            $stmt->execute($params);
            $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);
            json_response($posts);
        }
    }

    // POST /api/iwrs_api.php?resource=blog_posts (Create)
    if ($request_method === 'POST') {
        $user = require_admin_auth($conn);
        $data = json_decode(file_get_contents('php://input'), true);
        $uuid = guidv4();

        $slug = $data['slug'] ?? '';
        $published_at = ($data['status'] === 'published' && empty($data['published_at'])) ? date('Y-m-d H:i:s') : ($data['published_at'] ?? null);

        $sql = "INSERT INTO blog_posts (
            id, tenant_id, slug,
            title_tr, excerpt_tr, content_tr,
            title_en, excerpt_en, content_en,
            title_zh, excerpt_zh, content_zh,
            status, featured_image, seo_title, seo_description, seo_keywords, published_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        $stmt = $conn->prepare($sql);
        try {
            $stmt->execute([
                $uuid,
                $tenant_id,
                $slug,
                $data['title_tr'] ?? $data['title'] ?? '',
                $data['excerpt_tr'] ?? $data['excerpt'] ?? null,
                $data['content_tr'] ?? $data['content'] ?? '',
                $data['title_en'] ?? null,
                $data['excerpt_en'] ?? null,
                $data['content_en'] ?? null,
                $data['title_zh'] ?? null,
                $data['excerpt_zh'] ?? null,
                $data['content_zh'] ?? null,
                $data['status'] ?? 'draft',
                $data['featured_image'] ?? null,
                $data['seo_title'] ?? null,
                $data['seo_description'] ?? null,
                $data['seo_keywords'] ?? null,
                $published_at
            ]);
            json_response(['id' => $uuid, 'message' => 'Post created'], 201);
        } catch (PDOException $e) {
            if ($e->getCode() == 23000) {
                json_response(['error' => 'Slug already exists'], 409);
            }
            json_response(['error' => $e->getMessage()], 500);
        }
    }

    // PUT /api/iwrs_api.php?resource=blog_posts&id=UUID (Update)
    if ($request_method === 'PUT' && $id) {
        $user = require_admin_auth($conn);
        $data = json_decode(file_get_contents('php://input'), true);

        // Security check: ensure post belongs to tenant
        $stmt = $conn->prepare("SELECT id FROM blog_posts WHERE id = ? AND tenant_id = ?");
        $stmt->execute([$id, $tenant_id]);
        if (!$stmt->fetch()) {
            json_response(['error' => 'Post not found or access denied'], 404);
        }

        $fields = [];
        $values = [];

        $allowedFields = [
            'slug',
            'title_tr',
            'excerpt_tr',
            'content_tr',
            'title_en',
            'excerpt_en',
            'content_en',
            'title_zh',
            'excerpt_zh',
            'content_zh',
            'status',
            'featured_image',
            'seo_title',
            'seo_description',
            'seo_keywords',
            'published_at'
        ];

        foreach ($allowedFields as $field) {
            if (isset($data[$field])) {
                $fields[] = "$field = ?";
                $values[] = $data[$field];
            }
        }

        // Auto-set published_at if publishing and not already set
        if (isset($data['status']) && $data['status'] === 'published' && !isset($data['published_at'])) {
            $fields[] = "published_at = IFNULL(published_at, NOW())";
        }

        if (empty($fields)) {
            json_response(['message' => 'No changes'], 200);
        }

        $sql = "UPDATE blog_posts SET " . implode(', ', $fields) . ", updated_at = NOW() WHERE id = ?";
        $values[] = $id;

        $stmt = $conn->prepare($sql);
        try {
            $stmt->execute($values);
            json_response(['message' => 'Post updated']);
        } catch (PDOException $e) {
            json_response(['error' => $e->getMessage()], 500);
        }
    }

    // DELETE /api/iwrs_api.php?resource=blog_posts&id=UUID
    if ($request_method === 'DELETE' && $id) {
        $user = require_admin_auth($conn);
        $stmt = $conn->prepare("DELETE FROM blog_posts WHERE id = ? AND tenant_id = ?");
        $stmt->execute([$id, $tenant_id]);
        if ($stmt->rowCount() > 0) {
            json_response(['message' => 'Post deleted']);
        } else {
            json_response(['error' => 'Post not found or access denied'], 404);
        }
    }
}

// --- RANDOMIZATION FORM ---
if ($resource === 'randomization') {
    if ($request_method === 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);
        $uuid = guidv4();

        $sql = "INSERT INTO iwrs_randomizations (id, study_name, study_type, total_participants, treatment_arms, randomization_method, block_size, stratification_factors, blinding_type, reporting_preferences, contact_name, contact_email, institution)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        $stmt = $conn->prepare($sql);
        try {
            $stmt->execute([
                $uuid,
                $data['studyName'],
                $data['studyType'],
                $data['totalParticipants'],
                $data['treatmentArms'],
                $data['randomizationMethod'],
                $data['blockSize'] ?? null,
                $data['stratificationFactors'] ?? null,
                $data['blindingDetails'] ?? null,
                json_encode($data['reportingPreferences'] ?? []),
                $data['contactPerson'],
                $data['email'],
                $data['institution']
            ]);


            // Send Notification Email
            try {
                $stmtSettings = $conn->prepare("SELECT setting_value FROM site_settings WHERE setting_key = 'notification_emails'");
                $stmtSettings->execute();
                $emailSetting = $stmtSettings->fetchColumn();

                if ($emailSetting) {
                    $toEmails = array_map('trim', explode(',', $emailSetting));
                    $subject = "Yeni Randomizasyon Başvurusu: " . $data['studyName'];

                    $htmlBody = "
                    <div style='font-family: Arial, sans-serif; color: #333;'>
                        <h2 style='color: #0891b2;'>Yeni Randomizasyon Çalışması Başvurusu</h2>
                        <p><strong>Çalışma Adı:</strong> " . htmlspecialchars($data['studyName']) . "</p>
                        <p><strong>Tür:</strong> " . htmlspecialchars($data['studyType']) . "</p>
                        <p><strong>Kurum:</strong> " . htmlspecialchars($data['institution']) . "</p>
                        <p><strong>İletişim:</strong> " . htmlspecialchars($data['contactPerson']) . " (" . htmlspecialchars($data['email']) . ")</p>
                        <hr style='border: 1px solid #eee;'>
                        <h3>Protokol Detayları</h3>
                        <ul>
                            <li><strong>Katılımcı Sayısı:</strong> " . htmlspecialchars($data['totalParticipants']) . "</li>
                            <li><strong>Tedavi Kolları:</strong> " . htmlspecialchars($data['treatmentArms']) . "</li>
                            <li><strong>Randomizasyon Yöntemi:</strong> " . htmlspecialchars($data['randomizationMethod']) . "</li>
                        </ul>
                        <p style='margin-top: 20px;'>
                            <a href='https://ct.turp.health/iwrs/admin' style='background-color: #0891b2; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;'>Admin Paneline Git</a>
                        </p>
                    </div>
                    ";

                    $success = send_notification_email($toEmails, $subject, $htmlBody);
                    log_email_dispatch(
                        $conn,
                        implode(',', $toEmails),
                        $subject,
                        'randomization_notification',
                        $success ? 'sent' : 'failed',
                        $success ? null : 'API Error'
                    );
                }
            } catch (Exception $e) {
                error_log("Failed to send notification email: " . $e->getMessage());
                log_email_dispatch($conn, 'admin_list', "Randomization: " . $data['studyName'], 'randomization_notification', 'failed', $e->getMessage());
            }

            json_response(['id' => $uuid, 'message' => 'Form submitted successfully'], 201);
        } catch (PDOException $e) {
            json_response(['error' => $e->getMessage()], 500);
        }
    }
}

// --- CONTACT FORM ---
// --- CONTACT FORM ---
if ($resource === 'contact') {
    if ($request_method === 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);

        // Basic validation
        if (empty($data['name']) || empty($data['email']) || empty($data['message'])) {
            json_response(['error' => 'Missing required fields'], 400);
        }

        try {
            $tenant_id = get_current_tenant($conn);
            $stmt = $conn->prepare("INSERT INTO contact_messages (name, email, subject, message, tenant_id, created_at) VALUES (?, ?, ?, ?, ?, NOW())");
            $stmt->execute([
                $data['name'],
                $data['email'],
                $data['subject'] ?? 'Contact Form',
                $data['message'],
                $tenant_id
            ]);
            json_response(['message' => 'Message sent successfully']);

            // Send Notification Email
            try {
                $stmt = $conn->query("SELECT setting_value FROM site_settings WHERE setting_key = 'contact_email'");
                $contactEmail = $stmt->fetchColumn();
                if (!$contactEmail) {
                    $stmt = $conn->query("SELECT setting_value FROM site_settings WHERE setting_key = 'notification_emails'");
                    $contactEmail = $stmt->fetchColumn();
                }

                if ($contactEmail) {
                    $toEmails = explode(',', $contactEmail);
                    $subject = "İletişim Formu: " . $data['subject'];
                    $htmlBody = "<h2>Yeni İletişim Mesajı</h2>" .
                        "<p><strong>İsim:</strong> " . htmlspecialchars($data['name']) . "</p>" .
                        "<p><strong>Email:</strong> " . htmlspecialchars($data['email']) . "</p>" .
                        "<p><strong>Mesaj:</strong><br>" . nl2br(htmlspecialchars($data['message'])) . "</p>";

                    $success = send_notification_email($toEmails, $subject, $htmlBody);
                    log_email_dispatch($conn, implode(',', $toEmails), $subject, 'contact_form', $success ? 'sent' : 'failed');
                }
            } catch (Exception $e) { /* Ignore email error */
            }

        } catch (PDOException $e) {
            // If table doesn't exist, we might fail. For now, let's assume it exists or fail gracefully.
            // If it fails, we fall back to mock success to not break frontend demo, or let it fail?
            // Better to fail so we know to fix schema.
            json_response(['error' => 'Database error: ' . $e->getMessage()], 500);
        }
    }
}

// --- GET MESSAGES (Admin) ---
if ($resource === 'get-messages') {
    if ($request_method === 'GET') {
        require_admin_auth($conn);
        $tenant_id = get_current_tenant($conn);
        $stmt = $conn->prepare("SELECT * FROM contact_messages WHERE tenant_id = ? ORDER BY created_at DESC LIMIT 100");
        $stmt->execute([$tenant_id]);
        $messages = $stmt->fetchAll(PDO::FETCH_ASSOC);
        json_response($messages);
    }
}

// --- DELETE MESSAGE (Admin) ---
if ($resource === 'delete-message') {
    if ($request_method === 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);
        if (empty($data['id'])) {
            json_response(['error' => 'ID required'], 400);
        }

        $tenant_id = get_current_tenant($conn);
        $stmt = $conn->prepare("DELETE FROM contact_messages WHERE id = ? AND tenant_id = ?");
        $stmt->execute([$data['id'], $tenant_id]);
        json_response(['success' => true]);
    }
}

// --- AI CHAT ---


// --- SETTINGS (Email & Password) ---
if ($resource === 'settings') {
    $user = require_admin_auth($conn);

    if ($request_method === 'GET') {
        try {
            $stmt = $conn->prepare("SELECT setting_key, setting_value FROM site_settings");
            $stmt->execute();
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $settings = [];
            foreach ($rows as $row) {
                $settings[$row['setting_key']] = $row['setting_value'];
            }
            json_response($settings);
        } catch (Exception $e) {
            // Table might not exist yet, return defaults
            json_response(['notification_emails' => '']);
        }
    }

    if ($request_method === 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);

        try {
            // Create table if not exists
            $conn->exec("CREATE TABLE IF NOT EXISTS site_settings (
                id INT AUTO_INCREMENT PRIMARY KEY,
                setting_key VARCHAR(100) NOT NULL UNIQUE,
                setting_value TEXT,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");

            if (is_array($data)) {
                foreach ($data as $key => $value) {
                    $stmt = $conn->prepare("INSERT INTO site_settings (setting_key, setting_value) 
                        VALUES (?, ?) 
                        ON DUPLICATE KEY UPDATE setting_value = ?");
                    $stmt->execute([$key, $value, $value]);
                }
            }
            json_response(['message' => 'Settings saved']);
        } catch (Exception $e) {
            json_response(['error' => $e->getMessage()], 500);
        }
    }
}

if ($resource === 'change_password') {
    if ($request_method === 'POST') {
        $user_id = require_admin_auth_id($conn);
        $data = json_decode(file_get_contents('php://input'), true);

        if (empty($data['current_password']) || empty($data['new_password'])) {
            json_response(['error' => 'Missing fields'], 400);
        }

        // Verify current
        $stmt = $conn->prepare("SELECT password_hash FROM admin_users WHERE id = ?");
        $stmt->execute([$user_id]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user || !password_verify($data['current_password'], $user['password_hash'])) {
            json_response(['error' => 'Current password incorrect'], 400);
        }

        // Update
        $new_hash = password_hash($data['new_password'], PASSWORD_BCRYPT);
        $stmt = $conn->prepare("UPDATE admin_users SET password_hash = ? WHERE id = ?");
        $stmt->execute([$new_hash, $user_id]);

        json_response(['message' => 'Password updated']);
    }
}

// --- FAQ ---
if ($resource === 'faq') {
    $tenant_id = get_current_tenant($conn);

    if ($request_method === 'GET') {
        try {
            $stmt = $conn->prepare("SELECT * FROM faqs WHERE tenant_id = ? ORDER BY sort_order ASC, created_at DESC");
            $stmt->execute([$tenant_id]);
            $faqs = $stmt->fetchAll(PDO::FETCH_ASSOC);
            json_response($faqs);
        } catch (Exception $e) {
            json_response([]);
        }
    }

    if ($request_method === 'POST') {
        require_admin_auth($conn);
        $data = json_decode(file_get_contents('php://input'), true);

        if (empty($data['question']) || empty($data['answer'])) {
            json_response(['error' => 'Question and answer required'], 400);
        }

        // Ensure table exists
        $conn->exec("CREATE TABLE IF NOT EXISTS faqs (
            id INT AUTO_INCREMENT PRIMARY KEY,
            question TEXT NOT NULL,
            answer TEXT NOT NULL,
            language VARCHAR(10) DEFAULT 'tr',
            category VARCHAR(50) DEFAULT 'general',
            sort_order INT DEFAULT 0,
            is_active TINYINT(1) DEFAULT 1,
            is_showcased TINYINT(1) DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");

        if (isset($data['id'])) {
            // Update - with tenant isolation
            $sql = "UPDATE faqs SET question=?, answer=?, language=?, category=?, sort_order=?, is_active=?, is_showcased=? WHERE id=? AND tenant_id=?";
            $stmt = $conn->prepare($sql);
            $stmt->execute([
                $data['question'],
                $data['answer'],
                $data['language'] ?? 'tr',
                $data['category'] ?? 'general',
                $data['sort_order'] ?? 0,
                $data['is_active'] ?? 1,
                $data['is_showcased'] ?? 0,
                $data['id'],
                $tenant_id
            ]);
            json_response(['message' => 'FAQ updated']);
        } else {
            // Create - with tenant isolation
            $sql = "INSERT INTO faqs (question, answer, language, category, sort_order, is_active, is_showcased, tenant_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
            $stmt = $conn->prepare($sql);
            $stmt->execute([
                $data['question'],
                $data['answer'],
                $data['language'] ?? 'tr',
                $data['category'] ?? 'general',
                $data['sort_order'] ?? 0,
                $data['is_active'] ?? 1,
                $data['is_showcased'] ?? 0,
                $tenant_id
            ]);
            json_response(['message' => 'FAQ created'], 201);
        }
    }

    if ($request_method === 'DELETE' && $id) {
        require_admin_auth($conn);
        $tenant_id = get_current_tenant($conn);
        $stmt = $conn->prepare("DELETE FROM faqs WHERE id = ? AND tenant_id = ?");
        $stmt->execute([$id, $tenant_id]);
        json_response(['message' => 'FAQ deleted']);
    }
}

// --- AI BLOG TRANSLATION ---
if ($resource === 'ai-translate-blog') {
    if ($request_method === 'POST') {
        require_admin_auth($conn);
        require_once __DIR__ . '/translate_helper.php';

        $data = json_decode(file_get_contents('php://input'), true);
        $targetLang = $data['target_language'] ?? 'en';

        // Get DeepSeek API Key from env
        $deepseek_key = getenv('DEEPSEEK_API_KEY');
        if (!$deepseek_key && file_exists(__DIR__ . '/../.env')) {
            $lines = file(__DIR__ . '/../.env', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
            foreach ($lines as $line) {
                if (strpos(trim($line), 'DEEPSEEK_API_KEY=') === 0) {
                    $deepseek_key = trim(substr($line, 17));
                    break;
                }
            }
        }

        if (!$deepseek_key) {
            json_response(['error' => 'Configuration error: DeepSeek API Key missing'], 500);
        }

        $results = [];

        // Translate Title
        if (!empty($data['title'])) {
            $trans = translate_with_deepseek($data['title'], $targetLang, $deepseek_key);
            if (isset($trans['success']))
                $results['title'] = $trans['translation'];
        }

        // Translate Excerpt
        if (!empty($data['excerpt'])) {
            $trans = translate_with_deepseek($data['excerpt'], $targetLang, $deepseek_key);
            if (isset($trans['success']))
                $results['excerpt'] = $trans['translation'];
        }

        // Translate Content
        if (!empty($data['content'])) {
            $trans = translate_with_deepseek($data['content'], $targetLang, $deepseek_key);
            if (isset($trans['success']))
                $results['content'] = $trans['translation'];
        }

        json_response($results);
    }
}

// --- AI BLOG TRANSLATION (BATCH EN+ZH) ---
if ($resource === 'ai-translate-blog-all') {
    if ($request_method === 'POST') {
        require_admin_auth($conn);
        require_once __DIR__ . '/translate_helper.php';

        $data = json_decode(file_get_contents('php://input'), true);

        // Get DeepSeek API Key from env
        $deepseek_key = getenv('DEEPSEEK_API_KEY');
        if (!$deepseek_key && file_exists(__DIR__ . '/../.env')) {
            $lines = file(__DIR__ . '/../.env', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
            foreach ($lines as $line) {
                if (strpos(trim($line), 'DEEPSEEK_API_KEY=') === 0) {
                    $deepseek_key = trim(substr($line, 17));
                    break;
                }
            }
        }

        if (!$deepseek_key) {
            json_response(['error' => 'Configuration error: DeepSeek API Key missing'], 500);
        }

        $title_tr = $data['title_tr'] ?? '';
        $excerpt_tr = $data['excerpt_tr'] ?? '';
        $content_tr = $data['content_tr'] ?? '';

        $results = ['en' => [], 'zh' => []];

        // Translate to English
        if (!empty($title_tr)) {
            $trans = translate_with_deepseek($title_tr, 'en', $deepseek_key);
            if (isset($trans['success']))
                $results['en']['title'] = $trans['translation'];
        }
        if (!empty($excerpt_tr)) {
            $trans = translate_with_deepseek($excerpt_tr, 'en', $deepseek_key);
            if (isset($trans['success']))
                $results['en']['excerpt'] = $trans['translation'];
        }
        if (!empty($content_tr)) {
            $trans = translate_with_deepseek($content_tr, 'en', $deepseek_key);
            if (isset($trans['success']))
                $results['en']['content'] = $trans['translation'];
        }

        // Translate to Chinese
        if (!empty($title_tr)) {
            $trans = translate_with_deepseek($title_tr, 'zh', $deepseek_key);
            if (isset($trans['success']))
                $results['zh']['title'] = $trans['translation'];
        }
        if (!empty($excerpt_tr)) {
            $trans = translate_with_deepseek($excerpt_tr, 'zh', $deepseek_key);
            if (isset($trans['success']))
                $results['zh']['excerpt'] = $trans['translation'];
        }
        if (!empty($content_tr)) {
            $trans = translate_with_deepseek($content_tr, 'zh', $deepseek_key);
            if (isset($trans['success']))
                $results['zh']['content'] = $trans['translation'];
        }

        json_response($results);
    }
}

// --- AI FAQ TRANSLATION ---
if ($resource === 'ai-translate-faq') {
    if ($request_method === 'POST') {
        require_admin_auth($conn);
        require_once __DIR__ . '/translate_helper.php';

        $data = json_decode(file_get_contents('php://input'), true);
        $targetLang = $data['target_language'] ?? 'en';

        $deepseek_key = getenv('DEEPSEEK_API_KEY');
        if (!$deepseek_key && file_exists(__DIR__ . '/../.env')) {
            $lines = file(__DIR__ . '/../.env', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
            foreach ($lines as $line) {
                if (strpos(trim($line), 'DEEPSEEK_API_KEY=') === 0) {
                    $deepseek_key = trim(substr($line, 17));
                    break;
                }
            }
        }

        if (!$deepseek_key) {
            json_response(['error' => 'Configuration error: DeepSeek API Key missing'], 500);
        }

        $results = [];

        if (!empty($data['question'])) {
            $trans = translate_with_deepseek($data['question'], $targetLang, $deepseek_key);
            if (isset($trans['success']))
                $results['question'] = $trans['translation'];
        }

        if (!empty($data['answer'])) {
            $trans = translate_with_deepseek($data['answer'], $targetLang, $deepseek_key);
            if (isset($trans['success']))
                $results['answer'] = $trans['translation'];
        }

        json_response($results);
    }
}

// --- USERS MANAGEMENT ---
if ($resource === 'users') {
    // GET /users (List)
    if ($request_method === 'GET') {
        require_admin_auth($conn);
        $sql = "SELECT id, email, full_name, institution, role, is_active, last_login_at, created_at FROM users ORDER BY created_at DESC LIMIT 100";
        $stmt = $conn->query($sql);
        json_response($stmt->fetchAll(PDO::FETCH_ASSOC));
    }

    // POST /users (Register/Create)
    if ($request_method === 'POST') {
        // Optional: require admin auth to create users? Or public registration?
        // Plan says "Enable Signup flow" -> implies public or admin-led. 
        // Let's allow public for now or assume simple auth. Auth.tsx has signup tab.
        // But normally we'd want validation.

        $data = json_decode(file_get_contents('php://input'), true);
        if (empty($data['email']) || empty($data['password'])) {
            json_response(['error' => 'Email and Password required'], 400);
        }

        // Check exists
        $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$data['email']]);
        if ($stmt->fetch()) {
            json_response(['error' => 'Email already exists'], 409);
        }

        $uuid = guidv4();
        $hash = password_hash($data['password'], PASSWORD_BCRYPT);

        $stmt = $conn->prepare("INSERT INTO users (id, email, full_name, institution, role, password_hash) VALUES (?, ?, ?, ?, ?, ?)");
        try {
            $stmt->execute([
                $uuid,
                $data['email'],
                $data['full_name'] ?? '',
                $data['institution'] ?? '',
                'user', // Default role
                $hash
            ]);
            json_response(['id' => $uuid, 'message' => 'User created'], 201);
        } catch (PDOException $e) {
            json_response(['error' => $e->getMessage()], 500);
        }
    }
}

// --- API LOGS ---
if ($resource === 'api-logs') {
    if ($request_method === 'GET') {
        require_admin_auth($conn);
        $limit = $_GET['limit'] ?? 100;
        $sql = "SELECT * FROM api_logs ORDER BY created_at DESC LIMIT " . intval($limit);
        $stmt = $conn->query($sql);
        json_response($stmt->fetchAll(PDO::FETCH_ASSOC));
    }
}

// --- CONTACT INFO FORM HANDLER (Generic trigger) ---
if ($resource === 'submit-form') {
    if ($request_method === 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);
        $formName = $data['form_name'] ?? 'Unknown Form';

        // Save to DB? Maybe not needed for all, but email is required.
        // Send email to admin

        try {
            $stmt = $conn->prepare("SELECT setting_value FROM site_settings WHERE setting_key IN ('contact_email', 'notification_emails')");
            $stmt->execute();
            $settings = $stmt->fetchAll(PDO::FETCH_COLUMN); // Simplification

            // Better: get specific
            $stmt = $conn->query("SELECT setting_value FROM site_settings WHERE setting_key = 'contact_email'");
            $contactEmail = $stmt->fetchColumn();

            if (!$contactEmail) {
                // Fallback to notification emails
                $stmt = $conn->query("SELECT setting_value FROM site_settings WHERE setting_key = 'notification_emails'");
                $contactEmail = $stmt->fetchColumn();
            }

            if ($contactEmail) {
                $toEmails = explode(',', $contactEmail);
                $subject = "Form Submission: $formName";

                // Build generic body
                $htmlBody = "<h2>New Form Submission: $formName</h2><ul>";
                foreach ($data as $k => $v) {
                    if ($k !== 'form_name') {
                        $htmlBody .= "<li><strong>" . htmlspecialchars($k) . ":</strong> " . htmlspecialchars(is_string($v) ? $v : json_encode($v)) . "</li>";
                    }
                }
                $htmlBody .= "</ul>";

                $success = send_notification_email($toEmails, $subject, $htmlBody);
                log_email_dispatch($conn, implode(',', $toEmails), $subject, 'form_submission', $success ? 'sent' : 'failed');
            }

            // Also log raw request
            // (Already handled by middleware if we rely on that, but maybe we want explicit success msg)

            json_response(['message' => 'Form submitted']);

        } catch (Exception $e) {
            json_response(['error' => $e->getMessage()], 500);
        }
    }
}

json_response(['error' => 'Resource not found'], 404);
