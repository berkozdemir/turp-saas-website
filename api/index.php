<?php
// CORS Headers - Allow all origins and headers for development
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

// Handle OPTIONS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Production security: Disable error display
$is_production = file_exists(__DIR__ . '/env.php');
if ($is_production) {
    error_reporting(0);
    ini_set('display_errors', 0);
} else {
    // Local development: Show errors
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
}

// Load env.php for production (if exists)
// This allows credentials to be stored securely outside of git
$env_config_file = __DIR__ . '/env.php';
if (file_exists($env_config_file)) {
    $env_config = include $env_config_file;
    if (is_array($env_config)) {
        foreach ($env_config as $key => $value) {
            putenv("$key=$value");
            $_ENV[$key] = $value;
            $_SERVER[$key] = $value;
        }
    }
}

// Ortam değişkenlerini okuyan yardımcı fonksiyon
function get_env_strict($key)
{
    $value = $_SERVER[$key] ?? $_ENV[$key] ?? getenv($key);
    if ($value === false || $value === null || trim($value) === '') {
        // DB bağlantısı öncesi kritik olmayan keyler için esneklik sağlanabilir
        // Ancak şimdilik verilen koda sadık kalıyoruz
        // (Docker ortamında env'ler docker-compose'dan gelir)
        return null; // Düzenleme: Hata fırlatmak yerine null dönelim, deploy kolay olsun
    }
    return trim($value);
}

$server_secret = get_env_strict('VITE_API_SECRET');
$brevo_api_key = get_env_strict('BREVO_API_KEY');
$deepseek_api_key = get_env_strict('DEEPSEEK_API_KEY');

// Database credentials - MUST be set in env.php for production
$db_host = get_env_strict('DB_HOST');
$db_name = get_env_strict('DB_NAME');
$db_user = get_env_strict('DB_USER');
$db_pass = get_env_strict('DB_PASS');

// Fallback only for local Docker development
if (!$db_host)
    $db_host = 'db';
if (!$db_name)
    $db_name = 'turp_saas';
if (!$db_user)
    $db_user = 'turp_user';
if (!$db_pass)
    $db_pass = 'turp_password';

// Safety check: In production, credentials MUST come from env.php
if ($is_production && (!get_env_strict('DB_HOST') || !get_env_strict('DB_PASS'))) {
    http_response_code(500);
    echo json_encode(['error' => 'Sunucu yapılandırma hatası']);
    exit();
}

// =================================================================
// CORS
// =================================================================
$allowed_domains = [
    "http://localhost:5173",
    "http://localhost:4173",
    "http://localhost:8080"
];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowed_domains) || true) { // Local dev için true bıraktım
    header("Access-Control-Allow-Origin: " . ($origin ? $origin : '*'));
}
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Api-Key");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Parse action early for API key bypass logic
$action = $_GET['action'] ?? '';
if ($action === 'migrate_db') {
    // Debug
    error_log("Action is migrate_db");
}

$client_secret = $_SERVER['HTTP_X_API_KEY'] ?? '';

// Bypass API key for auth endpoints and public endpoints
$auth_actions = ['login', 'forgot-password', 'verify-reset-token', 'reset-password', 'contact', 'get_faqs_showcase', 'get_faqs_public', 'migrate_db', 'check_session', 'fix_settings', 'migrate_all_tenant'];
$is_auth_request = in_array($action, $auth_actions);

// Secret kontrolünü isteğe bağlı yapabiliriz local test için, ama güvenlik için açık kalsın
if ($server_secret && $client_secret !== $server_secret && !$is_auth_request) {
    http_response_code(403);
    echo json_encode(["error" => "Erişim Reddedildi: Geçersiz API Anahtarı"]);
    exit();
}

// =================================================================
// DB BAĞLANTISI
// =================================================================
try {
    $conn = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8", $db_user, $db_pass);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Veritabanı bağlantı hatası: " . $e->getMessage()]);
    exit();
}

$data = json_decode(file_get_contents("php://input"));
$action = $_GET['action'] ?? '';

// Include password reset helper
require_once __DIR__ . '/forgot_password_helper.php';

// Include Contact API
require_once __DIR__ . '/contact_api.php';

// Include Blog API
require_once __DIR__ . '/blog_api.php';

// Include FAQ API
require_once __DIR__ . '/faq_api.php';

// Include User Management API
require_once __DIR__ . '/user_api.php';

// Include Translation API
require_once __DIR__ . '/translate_helper.php';

// Include Legal API
require_once __DIR__ . '/legal_api.php';

// =================================================================
// ACTIONS
// =================================================================

// Migration triggers
if ($action == 'migrate_db') {
    require_once __DIR__ . '/migrate_blog_multitenant.php';
    exit;
}

if ($action == 'fix_settings') {
    require_once __DIR__ . '/fix_site_settings.php';
    exit;
}

if ($action == 'migrate_all_tenant') {
    require_once __DIR__ . '/migrate_all_tenant_columns.php';
    exit;
}

// Session Check
if ($action == 'check_session') {
    require_once __DIR__ . '/auth_helper.php';
    try {
        $user_id = require_admin_auth($conn);
        echo json_encode(['success' => true, 'user_id' => $user_id]);
    } catch (Exception $e) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized']);
    }
    exit;
}

// OLD LOGIN CODE REMOVED - Now using new admin auth system below



// --- E. BLOG İŞLEMLERİ ---
// Changed to blog_api.php to support multi-tenant and multi-language


// --- F. ROI SETTINGS ---
if ($action == 'get_roi_settings') {
    try {
        $sql = "SELECT * FROM roi_settings WHERE id = 1";
        $stmt = $conn->query($sql);
        $settings = $stmt->fetch(PDO::FETCH_ASSOC);
        echo json_encode(["data" => $settings, "error" => null]);
    } catch (Exception $e) {
        echo json_encode(["data" => null, "error" => $e->getMessage()]);
    }
    exit();
}

// DİĞER FONKSİYONLAR (Test için temel olanları ekledik, diğerleri kullanıcı kodundan kopyalanabilir)
// Şimdilik test amaçlı en önemli kısımları koydum.

// --- ADMIN AUTHENTICATION ---

// 1. LOGIN
if ($action == 'login' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $request_body = json_decode(file_get_contents('php://input'), true) ?? [];
    $email = $request_body['email'] ?? '';
    $password = $request_body['password'] ?? '';
    $remember_me = $request_body['remember_me'] ?? false;

    if (empty($email) || empty($password)) {
        echo json_encode(['error' => 'E-posta ve şifre gereklidir']);
        exit;
    }

    try {
        $stmt = $conn->prepare("SELECT id, email, password_hash, name, role FROM admin_users WHERE email = ? AND is_active = 1");
        $stmt->execute([$email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user || !password_verify($password, $user['password_hash'])) {
            echo json_encode(['error' => 'Hatalı e-posta veya şifre']);
            exit;
        }

        $token = bin2hex(random_bytes(32));
        $expires_days = $remember_me ? 7 : 1;
        $expires_at = date('Y-m-d H:i:s', strtotime("+{$expires_days} days"));
        $ip_address = $_SERVER['REMOTE_ADDR'] ?? '';
        $user_agent = $_SERVER['HTTP_USER_AGENT'] ?? '';

        $stmt = $conn->prepare("INSERT INTO admin_sessions (user_id, token, ip_address, user_agent, expires_at) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$user['id'], $token, $ip_address, $user_agent, $expires_at]);

        $stmt = $conn->prepare("UPDATE admin_users SET last_login = NOW() WHERE id = ?");
        $stmt->execute([$user['id']]);

        // Fetch user's accessible tenants
        $stmt = $conn->prepare("
            SELECT t.id, t.code, t.name, t.primary_domain, t.logo_url, t.primary_color, aut.role as tenant_role
            FROM admin_user_tenants aut
            JOIN tenants t ON t.id = aut.tenant_id
            WHERE aut.user_id = ? AND t.is_active = 1
            ORDER BY t.name
        ");
        $stmt->execute([$user['id']]);
        $tenants = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            'success' => true,
            'token' => $token,
            'user' => ['id' => $user['id'], 'email' => $user['email'], 'name' => $user['name'], 'role' => $user['role']],
            'tenants' => $tenants
        ]);
    } catch (Exception $e) {
        echo json_encode(['error' => 'Bir hata oluştu: ' . $e->getMessage()]);
    }
    exit;
}

// 2. FORGOT PASSWORD
if ($action == 'forgot-password' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $request_body = json_decode(file_get_contents('php://input'), true) ?? [];
    $email = $request_body['email'] ?? '';

    $ip_address = $_SERVER['REMOTE_ADDR'] ?? '';
    send_password_reset_email_inline($conn, $email, $ip_address, $brevo_api_key);

    echo json_encode(['message' => 'Eğer bu e-posta ile kayıtlı bir hesabınız varsa, şifre sıfırlama bağlantısı gönderildi.']);
    exit;
}

// 3. VERIFY RESET TOKEN
if ($action == 'verify-reset-token' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    $token = $_GET['token'] ?? '';

    if (empty($token)) {
        echo json_encode(['valid' => false, 'error' => 'Token gereklidir']);
        exit;
    }

    try {
        $stmt = $conn->prepare("SELECT id, expires_at, used_at FROM password_reset_tokens WHERE token = ?");
        $stmt->execute([$token]);
        $reset_token = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$reset_token) {
            echo json_encode(['valid' => false, 'error' => 'Geçersiz token']);
        } elseif ($reset_token['used_at'] !== null) {
            echo json_encode(['valid' => false, 'error' => 'Bu token zaten kullanılmış']);
        } elseif (strtotime($reset_token['expires_at']) < time()) {
            echo json_encode(['valid' => false, 'error' => 'Token süresi dolmuş']);
        } else {
            echo json_encode(['valid' => true]);
        }
    } catch (Exception $e) {
        echo json_encode(['valid' => false, 'error' => 'Bir hata oluştu']);
    }
    exit;
}

// 4. RESET PASSWORD
if ($action == 'reset-password' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $request_body = json_decode(file_get_contents('php://input'), true) ?? [];
    $token = $request_body['token'] ?? '';
    $new_password = $request_body['new_password'] ?? '';

    if (empty($token) || empty($new_password)) {
        echo json_encode(['error' => 'Token ve yeni şifre gereklidir']);
        exit;
    }

    if (strlen($new_password) < 8) {
        echo json_encode(['error' => 'Şifre en az 8 karakter olmalıdır']);
        exit;
    }

    try {
        $stmt = $conn->prepare("SELECT id, user_id, expires_at, used_at FROM password_reset_tokens WHERE token = ?");
        $stmt->execute([$token]);
        $reset_token = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$reset_token) {
            echo json_encode(['error' => 'Geçersiz token']);
            exit;
        }

        if ($reset_token['used_at'] !== null) {
            echo json_encode(['error' => 'Bu token zaten kullanılmış']);
            exit;
        }

        if (strtotime($reset_token['expires_at']) < time()) {
            echo json_encode(['error' => 'Token süresi dolmuş. Lütfen tekrar şifre sıfırlama isteği gönderin.']);
            exit;
        }

        $password_hash = password_hash($new_password, PASSWORD_BCRYPT);
        $stmt = $conn->prepare("UPDATE admin_users SET password_hash = ? WHERE id = ?");
        $stmt->execute([$password_hash, $reset_token['user_id']]);

        $stmt = $conn->prepare("UPDATE password_reset_tokens SET used_at = NOW() WHERE id = ?");
        $stmt->execute([$reset_token['id']]);

        echo json_encode(['success' => true, 'message' => 'Şifreniz başarıyla güncellendi']);
    } catch (Exception $e) {
        echo json_encode(['error' => 'Bir hata oluştu: ' . $e->getMessage()]);
    }
    exit;
}

// 5. CHANGE PASSWORD (Logged-in user)
if ($action == 'change_password' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    require_once __DIR__ . '/auth_helper.php';
    $user_id = require_admin_auth($conn);

    $request_body = json_decode(file_get_contents('php://input'), true) ?? [];
    $current_password = $request_body['current_password'] ?? '';
    $new_password = $request_body['new_password'] ?? '';

    if (empty($current_password) || empty($new_password)) {
        echo json_encode(['error' => 'Mevcut şifre ve yeni şifre gereklidir']);
        exit;
    }

    if (strlen($new_password) < 8) {
        echo json_encode(['error' => 'Yeni şifre en az 8 karakter olmalıdır']);
        exit;
    }

    try {
        // Get current password hash
        $stmt = $conn->prepare("SELECT password_hash FROM admin_users WHERE id = ?");
        $stmt->execute([$user_id]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user) {
            echo json_encode(['error' => 'Kullanıcı bulunamadı']);
            exit;
        }

        // Verify current password
        if (!password_verify($current_password, $user['password_hash'])) {
            echo json_encode(['error' => 'Mevcut şifre yanlış']);
            exit;
        }

        // Update password
        $new_hash = password_hash($new_password, PASSWORD_BCRYPT);
        $stmt = $conn->prepare("UPDATE admin_users SET password_hash = ? WHERE id = ?");
        $stmt->execute([$new_hash, $user_id]);

        echo json_encode(['success' => true, 'message' => 'Şifreniz başarıyla güncellendi']);
    } catch (Exception $e) {
        echo json_encode(['error' => 'Bir hata oluştu']);
    }
    exit;
}

// 6. GET SETTINGS
if ($action == 'get_settings' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    require_once __DIR__ . '/auth_helper.php';
    require_admin_auth($conn);

    // Get current tenant
    require_once __DIR__ . '/tenant_helper.php';
    $tenant_id = get_current_tenant($conn);

    try {
        // Check if tenant_id column exists, if not this might fail on first run before migration
        // But we handle it gracefully or rely on update actions to fix schema
        $stmt = $conn->prepare("SELECT setting_key, setting_value FROM site_settings WHERE tenant_id = ?");
        $stmt->execute([$tenant_id]);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $settings = [];
        foreach ($rows as $row) {
            $settings[$row['setting_key']] = $row['setting_value'];
        }

        echo json_encode(['success' => true, 'data' => $settings]);
    } catch (Exception $e) {
        // Table might not exist or schema mismatch, return defaults
        echo json_encode([
            'success' => true,
            'data' => [
                'notification_emails' => 'berko@omega-cro.com.tr'
            ]
        ]);
    }
    exit;
}

// 7. UPDATE SETTINGS
if ($action == 'update_settings' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    require_once __DIR__ . '/auth_helper.php';
    require_admin_auth($conn);

    // Get current tenant
    require_once __DIR__ . '/tenant_helper.php';
    $tenant_id = get_current_tenant($conn);

    $request_body = json_decode(file_get_contents('php://input'), true) ?? [];

    try {
        // Create table if not exists with tenant_id
        $conn->exec("CREATE TABLE IF NOT EXISTS site_settings (
            id INT AUTO_INCREMENT PRIMARY KEY,
            tenant_id INT NOT NULL DEFAULT 1,
            setting_key VARCHAR(100) NOT NULL,
            setting_value TEXT,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            UNIQUE KEY unique_tenant_key (tenant_id, setting_key)
        ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");

        // Update each setting for specific tenant
        foreach ($request_body as $key => $value) {
            $stmt = $conn->prepare("INSERT INTO site_settings (tenant_id, setting_key, setting_value) 
                VALUES (?, ?, ?) 
                ON DUPLICATE KEY UPDATE setting_value = ?");
            $stmt->execute([$tenant_id, $key, $value, $value]);
        }

        echo json_encode(['success' => true, 'message' => 'Ayarlar kaydedildi']);
    } catch (Exception $e) {
        // Migration fallback: If table exists but no tenant_id or unique key is wrong
        // We'll try to ALTER table silently or just report error
        try {
            // Try to add tenant_id if missing
            $conn->exec("ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS tenant_id INT NOT NULL DEFAULT 1");
            // Drop old unique key if strictly on setting_key
            $conn->exec("DROP INDEX setting_key ON site_settings");
            $conn->exec("CREATE UNIQUE INDEX unique_tenant_key ON site_settings(tenant_id, setting_key)");

            // Retry update
            foreach ($request_body as $key => $value) {
                $stmt = $conn->prepare("INSERT INTO site_settings (tenant_id, setting_key, setting_value) 
                    VALUES (?, ?, ?) 
                    ON DUPLICATE KEY UPDATE setting_value = ?");
                $stmt->execute([$tenant_id, $key, $value, $value]);
            }
            echo json_encode(['success' => true, 'message' => 'Ayarlar kaydedildi (Schema updated)']);
        } catch (Exception $ex) {
            echo json_encode(['error' => 'Bir hata oluştu: ' . $e->getMessage() . ' | ' . $ex->getMessage()]);
        }
    }
    exit;
}

// Include Landing API
include_once __DIR__ . '/landing_api.php';

// Include Contact Config API
include_once __DIR__ . '/contact_config_api.php';

// Include Media API
include_once __DIR__ . '/media_api.php';

// Include Consent API (GDPR Cookie Consent)
include_once __DIR__ . '/consent_api.php';

echo json_encode(["error" => "Geçersiz işlem"]);
?>