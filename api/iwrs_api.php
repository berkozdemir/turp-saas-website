<?php
// IWRS API
// Handles Blog, Randomization, and Inventory endpoints

// Prevent any output before JSON
ob_start();

require_once __DIR__ . '/db_connection.php';
require_once __DIR__ . '/auth_helper.php';
require_once __DIR__ . '/email_service.php';

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

// --- BLOG POSTS ---
if ($resource === 'blog_posts') {
    // GET /api/iwrs_api.php?resource=blog_posts
    if ($request_method === 'GET') {
        if ($id) {
            // Get single post by ID or Slug
            $sql = "SELECT * FROM blog_posts WHERE id = ? OR slug = ?";
            $stmt = $conn->prepare($sql);
            $stmt->execute([$id, $id]);
            $post = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($post) {
                json_response($post);
            } else {
                json_response(['error' => 'Post not found'], 404);
            }
        } else {
            // List posts
            // If admin, show all. If public, show only published.
            // Simplified: Public list always filters by published unless 'all' param is present (and authorized)

            $status_filter = "WHERE status = 'published'";
            // Check auth header for admin access to see drafts
            $headers = getallheaders();
            $auth_header = isset($headers['Authorization']) ? $headers['Authorization'] : '';

            if (!empty($auth_header)) {
                // Very basic check, proper auth_helper usage recommended for full security
                // For now, if authorized, showing all for admin dashboard
                $status_filter = "";
            }

            $sql = "SELECT * FROM blog_posts $status_filter ORDER BY created_at DESC";
            $stmt = $conn->query($sql);
            $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);
            json_response($posts);
        }
    }

    // POST /api/iwrs_api.php?resource=blog_posts (Create)
    if ($request_method === 'POST') {
        $user = require_admin_auth($conn); // Protect this endpoint

        $data = json_decode(file_get_contents('php://input'), true);
        $uuid = guidv4();

        $sql = "INSERT INTO blog_posts (id, title, slug, content, excerpt, status, featured_image, seo_title, seo_description, seo_keywords, published_at) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        $stmt = $conn->prepare($sql);
        $published_at = ($data['status'] === 'published') ? date('Y-m-d H:i:s') : null;

        try {
            $stmt->execute([
                $uuid,
                $data['title'],
                $data['slug'],
                $data['content'],
                $data['excerpt'] ?? null,
                $data['status'] ?? 'draft',
                $data['featured_image'] ?? null,
                $data['seo_title'] ?? null,
                $data['seo_description'] ?? null,
                $data['seo_keywords'] ?? null,
                $published_at
            ]);
            json_response(['id' => $uuid, 'message' => 'Blog post created'], 201);
        } catch (PDOException $e) {
            json_response(['error' => $e->getMessage()], 500);
        }
    }

    // PUT /api/iwrs_api.php?resource=blog_posts&id=UUID (Update)
    if ($request_method === 'PUT' && $id) {
        $user = require_admin_auth($conn);
        $data = json_decode(file_get_contents('php://input'), true);

        $fields = [];
        $values = [];

        foreach (['title', 'slug', 'content', 'excerpt', 'status', 'featured_image', 'seo_title', 'seo_description', 'seo_keywords'] as $field) {
            if (isset($data[$field])) {
                $fields[] = "$field = ?";
                $values[] = $data[$field];
            }
        }

        if (isset($data['status']) && $data['status'] === 'published') {
            $fields[] = "published_at = IFNULL(published_at, NOW())";
        }

        if (empty($fields)) {
            json_response(['message' => 'No changes'], 200);
        }

        $sql = "UPDATE blog_posts SET " . implode(', ', $fields) . " WHERE id = ?";
        $values[] = $id;

        $stmt = $conn->prepare($sql);
        try {
            $stmt->execute($values);
            json_response(['message' => 'Blog post updated']);
        } catch (PDOException $e) {
            json_response(['error' => $e->getMessage()], 500);
        }
    }

    // DELETE /api/iwrs_api.php?resource=blog_posts&id=UUID
    if ($request_method === 'DELETE' && $id) {
        $user = require_admin_auth($conn);
        $stmt = $conn->prepare("DELETE FROM blog_posts WHERE id = ?");
        $stmt->execute([$id]);
        json_response(['message' => 'Blog post deleted']);
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

                    send_notification_email($toEmails, $subject, $htmlBody);
                }
            } catch (Exception $e) {
                error_log("Failed to send notification email: " . $e->getMessage());
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
            $stmt = $conn->prepare("INSERT INTO contact_messages (name, email, subject, message, created_at) VALUES (?, ?, ?, ?, NOW())");
            $stmt->execute([
                $data['name'],
                $data['email'],
                $data['subject'] ?? 'Contact Form',
                $data['message']
            ]);
            json_response(['message' => 'Message sent successfully']);
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
        // TODO: Add admin authentication check here
        $stmt = $conn->query("SELECT * FROM contact_messages ORDER BY created_at DESC");
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

        $stmt = $conn->prepare("DELETE FROM contact_messages WHERE id = ?");
        $stmt->execute([$data['id']]);
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
    if ($request_method === 'GET') {
        try {
            $sql = "SELECT * FROM faqs ORDER BY sort_order ASC, created_at DESC";
            $stmt = $conn->query($sql);
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
            // Update
            $sql = "UPDATE faqs SET question=?, answer=?, language=?, category=?, sort_order=?, is_active=?, is_showcased=? WHERE id=?";
            $stmt = $conn->prepare($sql);
            $stmt->execute([
                $data['question'],
                $data['answer'],
                $data['language'] ?? 'tr',
                $data['category'] ?? 'general',
                $data['sort_order'] ?? 0,
                $data['is_active'] ?? 1,
                $data['is_showcased'] ?? 0,
                $data['id']
            ]);
            json_response(['message' => 'FAQ updated']);
        } else {
            // Create
            $sql = "INSERT INTO faqs (question, answer, language, category, sort_order, is_active, is_showcased) VALUES (?, ?, ?, ?, ?, ?, ?)";
            $stmt = $conn->prepare($sql);
            $stmt->execute([
                $data['question'],
                $data['answer'],
                $data['language'] ?? 'tr',
                $data['category'] ?? 'general',
                $data['sort_order'] ?? 0,
                $data['is_active'] ?? 1,
                $data['is_showcased'] ?? 0
            ]);
            json_response(['message' => 'FAQ created'], 201);
        }
    }

    if ($request_method === 'DELETE' && $id) {
        require_admin_auth($conn);
        $stmt = $conn->prepare("DELETE FROM faqs WHERE id = ?");
        $stmt->execute([$id]);
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

json_response(['error' => 'Resource not found'], 404);
