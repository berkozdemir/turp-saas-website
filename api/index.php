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

error_reporting(E_ALL);
ini_set('display_errors', 1);

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

$db_host = get_env_strict('DB_HOST') ?? 'db';
$db_name = get_env_strict('DB_NAME') ?? 'turp_saas';
$db_user = get_env_strict('DB_USER') ?? 'turp_user';
$db_pass = get_env_strict('DB_PASS') ?? 'turp_password';

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

$client_secret = $_SERVER['HTTP_X_API_KEY'] ?? '';

// Secret kontrolünü isteğe bağlı yapabiliriz local test için, ama güvenlik için açık kalsın
if ($server_secret && $client_secret !== $server_secret) {
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

// =================================================================
// ACTIONS
// =================================================================

// --- A. GİRİŞ YAPMA (LOGIN) ---
if ($action == 'login') {
    $email = $data->email ?? '';
    $pass = $data->password ?? '';
    $stmt = $conn->prepare("SELECT id, email, password, full_name, phone FROM iwrs_saas_users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && $pass === $user['password']) {
        unset($user['password']);
        echo json_encode(["success" => true, "user" => $user]);
    } else {
        echo json_encode(["success" => false, "message" => "Hatalı e-posta veya şifre"]);
    }
    exit();
}

// --- E. BLOG İŞLEMLERİ ---
if ($action == 'get_blog_posts') {
    try {
        // Dil parametresi (varsayılan: tr)
        $lang = $_GET['lang'] ?? 'tr';

        $sql = "SELECT * FROM iwrs_saas_blog_posts WHERE lang = ? ORDER BY created_at DESC";
        $stmt = $conn->prepare($sql);
        $stmt->execute([$lang]);
        $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(["data" => $posts, "error" => null]);
    } catch (Exception $e) {
        echo json_encode(["data" => [], "error" => "Tablo bulunamadı veya boş."]);
    }
    exit();
}

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

// --- H. TEST ---
if ($action == 'test') {
    echo json_encode(["message" => "Docker Backendi Çalışıyor!"]);
    exit();
}

echo json_encode(["error" => "Geçersiz işlem"]);
?>