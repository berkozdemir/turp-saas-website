<?php
/**
 * Email Test Endpoint
 * Run this file directly or via API to test Brevo email integration
 * 
 * Usage: php test_email.php berkozdemir@gmail.com
 * Or via browser: /api/test_email.php?to=berkozdemir@gmail.com
 */

// Prevent execution in production - remove this check when testing
if (getenv('APP_ENV') === 'production' && !isset($_GET['force'])) {
    die('Test emails disabled in production. Add ?force=1 to override.');
}

require_once __DIR__ . '/core/utils/email.service.php';

// Debug: Check if API key is accessible
// First try env.php (Plesk pattern)
$env_php_path = __DIR__ . '/env.php';
$brevo_key = null;

echo "🔍 Debug Info:\n";
echo "  - Looking for env.php at: $env_php_path\n";

if (file_exists($env_php_path)) {
    echo "  - env.php exists: YES\n";
    require_once $env_php_path;

    // Check if it's a constant or environment variable
    if (defined('BREVO_API_KEY')) {
        $brevo_key = BREVO_API_KEY;
        echo "  - BREVO_API_KEY (constant): " . substr($brevo_key, 0, 15) . "...\n";
    } else {
        $brevo_key = getenv('BREVO_API_KEY');
        echo "  - BREVO_API_KEY via getenv(): " . ($brevo_key ? substr($brevo_key, 0, 15) . '...' : 'NOT SET') . "\n";
    }
} else {
    echo "  - env.php exists: NO\n";
    $brevo_key = getenv('BREVO_API_KEY');
    echo "  - Fallback getenv('BREVO_API_KEY'): " . ($brevo_key ? substr($brevo_key, 0, 15) . '...' : 'NOT SET') . "\n";
}

if (!$brevo_key) {
    die("\n❌ ERROR: BREVO_API_KEY not found anywhere!\n");
}

echo "  ✅ API Key found!\n\n";

// Get recipient email
$to_email = $argv[1] ?? $_GET['to'] ?? null;

if (!$to_email) {
    die("Usage: php test_email.php <email> OR ?to=<email>\n");
}

if (!filter_var($to_email, FILTER_VALIDATE_EMAIL)) {
    die("Invalid email address: $to_email\n");
}

// Generate test email HTML
$test_html = <<<HTML
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: system-ui, sans-serif; line-height: 1.6; color: #334155; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; border-radius: 12px; text-align: center; }
        .content { background: #f8fafc; padding: 30px; border-radius: 0 0 12px 12px; }
        .success { background: #d1fae5; border-left: 4px solid #10b981; padding: 16px; margin: 20px 0; border-radius: 4px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>✅ Test Maili Başarılı!</h1>
        <p>Brevo SMTP Entegrasyonu Çalışıyor</p>
    </div>
    <div class="content">
        <div class="success">
            <strong>🎉 Tebrikler!</strong><br>
            Brevo email entegrasyonunuz doğru şekilde yapılandırılmış.
        </div>
        
        <p><strong>Gönderim Detayları:</strong></p>
        <ul>
            <li>📧 Alıcı: {$to_email}</li>
            <li>🕐 Tarih: {date('Y-m-d H:i:s')}</li>
            <li>🌐 Sunucu: {gethostname()}</li>
        </ul>
        
        <p style="margin-top: 30px; font-size: 14px; color: #64748b;">
            Bu bir test mailidir. Gerçek kullanıcılara gönderilmemiştir.
        </p>
    </div>
</body>
</html>
HTML;

// Attempt to send
echo "📧 Sending test email to: $to_email\n";

$result = send_notification_email(
    $to_email,
    '🧪 Brevo Test - ' . date('H:i:s'),
    $test_html
);

if ($result) {
    echo "✅ SUCCESS! Test email sent to $to_email\n";
    echo "Check your inbox (and spam folder).\n";

    if (isset($_SERVER['HTTP_HOST'])) {
        header('Content-Type: application/json');
        echo json_encode(['success' => true, 'message' => "Test email sent to $to_email"]);
    }
} else {
    echo "❌ FAILED! Could not send email.\n";
    echo "Check:\n";
    echo "  1. BREVO_API_KEY environment variable is set\n";
    echo "  2. Sender email is verified in Brevo\n";
    echo "  3. Check PHP error logs for details\n";

    if (isset($_SERVER['HTTP_HOST'])) {
        header('Content-Type: application/json');
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Email delivery failed']);
    }
}
