<?php
// TEMPORARY DEBUG: Force errors to display
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);

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

// Environment Variable Helper
function get_env_strict($key)
{
    $value = $_SERVER[$key] ?? $_ENV[$key] ?? getenv($key);
    return ($value === false || $value === null || trim($value) === '') ? null : trim($value);
}

// =================================================================
// MODULAR ARCHITECTURE BOOTSTRAP
// =================================================================

// 1. Core Error Handling
require_once __DIR__ . '/core/errors/error.handler.php';

// 2. Config
require_once __DIR__ . '/config/db.php';
require_once __DIR__ . '/config/cors.php';

// 3. Core Services
require_once __DIR__ . '/core/tenant/tenant.service.php';
require_once __DIR__ . '/core/auth/auth.service.php';
require_once __DIR__ . '/core/auth/auth.middleware.php';

// 4. Modules Setup (Services & Controllers)
// Blog
require_once __DIR__ . '/modules/blog/blog.service.php';
require_once __DIR__ . '/modules/blog/blog.admin.controller.php';
require_once __DIR__ . '/modules/blog/blog.public.controller.php';

// FAQ
require_once __DIR__ . '/modules/faq/faq.service.php';
require_once __DIR__ . '/modules/faq/faq.admin.controller.php';
require_once __DIR__ . '/modules/faq/faq.public.controller.php';

// Landing
require_once __DIR__ . '/modules/landing/landing.service.php';
require_once __DIR__ . '/modules/landing/landing.admin.controller.php';
require_once __DIR__ . '/modules/landing/landing.public.controller.php';

// Contact
require_once __DIR__ . '/modules/contact/contact.service.php';
require_once __DIR__ . '/modules/contact/contact.admin.controller.php';
require_once __DIR__ . '/modules/contact/contact_config.admin.controller.php';

// Legal
require_once __DIR__ . '/modules/legal/legal.service.php';
require_once __DIR__ . '/modules/legal/legal.admin.controller.php';
require_once __DIR__ . '/modules/legal/legal.public.controller.php';

// Media
require_once __DIR__ . '/modules/media/media.service.php';

// NIPT
require_once __DIR__ . '/modules/nipt/nipt.controller.php';
require_once __DIR__ . '/modules/nipt/doctors.controller.php';
require_once __DIR__ . '/modules/contact/contact.public.controller.php';
require_once __DIR__ . '/modules/auth/auth.public.controller.php';
require_once __DIR__ . '/modules/roi/roi.public.controller.php';

// 5. Initialize CORS
setup_cors();

// 6. Routing Dispatcher
$token = get_bearer_token();
$action = $_GET['action'] ?? '';

if (empty($action)) {
    http_response_code(400);
    echo json_encode(['error' => 'Action required']);
    exit;
}

// 7. Try Admin Routes
// We include admin routes if it looks like an admin action or if a token is present
require_once __DIR__ . '/routes/admin.routes.php';
if (route_admin_action($action)) {
    exit;
}

// 8. Try Public Routes
require_once __DIR__ . '/routes/public.routes.php';
if (route_public_action($action)) {
    exit;
}

// 9. Error handling
http_response_code(404);
echo json_encode(['error' => 'Action not found', 'action' => $action]);
exit;

// End of Front Controller
exit;