<?php
/**
 * Email Service - Brevo Integration
 * Sends password reset emails via Brevo API
 */

function send_password_reset_email($to_email, $to_name, $reset_token)
{
    $brevo_api_key = getenv('BREVO_API_KEY');
    if (!$brevo_api_key) {
        error_log('BREVO_API_KEY not configured');
        return false;
    }

    $app_base_url = getenv('APP_BASE_URL') ?? 'https://ct.turp.health';
    $reset_url = $app_base_url . "/admin/reset-password?token=" . $reset_token;

    // Generate HTML email content
    $html_content = generate_reset_email_html($reset_url, $to_name);

    // Brevo API payload
    $email_data = [
        'sender' => [
            'email' => 'noreply@turp.health',
            'name' => 'Turp Health'
        ],
        'to' => [
            ['email' => $to_email, 'name' => $to_name]
        ],
        'subject' => 'Şifre Sıfırlama - Turp Admin Panel',
        'htmlContent' => $html_content,
        'textContent' => "Merhaba,\n\nŞifre sıfırlama talebiniz alındı. Şifrenizi sıfırlamak için aşağıdaki bağlantıyı kullanın:\n\n$reset_url\n\nBu bağlantı 1 saat içinde geçerliliğini yitirecektir.\n\nEğer bu isteği siz yapmadıysanız, bu e-postayı görmezden gelebilirsiniz.\n\nSaygılarımızla,\nTurp Health Ekibi"
    ];

    // Send via Brevo API
    $ch = curl_init('https://api.brevo.com/v3/smtp/email');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'api-key: ' . $brevo_api_key,
        'Content-Type: application/json',
        'Accept: application/json'
    ]);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($email_data));

    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($http_code >= 200 && $http_code < 300) {
        return true;
    } else {
        error_log("Brevo email failed: HTTP $http_code - $response");
        return false;
    }
}




/**
 * Send a generic notification email
 * @param array|string $to_emails Single email string or array of emails
 * @param string $subject
 * @param string $html_body
 * @return boolean
 */
function send_notification_email($to_emails, $subject, $html_body)
{
    $brevo_api_key = getenv('BREVO_API_KEY');
    if (!$brevo_api_key) {
        // Try loading from env file if not in env
        $env_paths = [
            __DIR__ . '/../.env',
            __DIR__ . '/../../.env',
            __DIR__ . '/../config/.env',
        ];
        foreach ($env_paths as $env_path) {
            if (file_exists($env_path)) {
                $lines = file($env_path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
                foreach ($lines as $line) {
                    if (strpos(trim($line), 'BREVO_API_KEY=') === 0) {
                        $brevo_api_key = trim(substr($line, 14));
                        break 2;
                    }
                }
            }
        }
    }

    if (!$brevo_api_key) {
        error_log('BREVO_API_KEY not configured for notifications');
        return false;
    }

    $recipients = [];
    if (is_array($to_emails)) {
        foreach ($to_emails as $email) {
            if (filter_var(trim($email), FILTER_VALIDATE_EMAIL)) {
                $recipients[] = ['email' => trim($email)];
            }
        }
    } else {
        // Comma separated or single
        $parts = explode(',', $to_emails);
        foreach ($parts as $email) {
            if (filter_var(trim($email), FILTER_VALIDATE_EMAIL)) {
                $recipients[] = ['email' => trim($email)];
            }
        }
    }

    if (empty($recipients)) {
        error_log('No valid recipients for notification email');
        return false;
    }

    $email_data = [
        'sender' => [
            'email' => 'noreply@turp.health',
            'name' => 'Turp IWRS System'
        ],
        'to' => $recipients,
        'subject' => $subject,
        'htmlContent' => $html_body
    ];

    $ch = curl_init('https://api.brevo.com/v3/smtp/email');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'api-key: ' . $brevo_api_key,
        'Content-Type: application/json',
        'Accept: application/json'
    ]);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($email_data));

    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    return ($http_code >= 200 && $http_code < 300);
}

function generate_reset_email_html($reset_url, $name)
{
    $greeting_name = $name ? ' ' . htmlspecialchars($name) : '';
    return <<<HTML
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; color: #334155; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%); color: white; padding: 30px; border-radius: 12px 12px 0 0; text-align: center; }
        .content { background: #ffffff; padding: 40px; border: 1px solid #e2e8f0; border-top: none; }
        .button { display: inline-block; background: #0891b2; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
        .button:hover { background: #0e7490; }
        .footer { text-align: center; margin-top: 20px; font-size: 14px; color: #64748b; }
        .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px; margin: 20px 0; border-radius: 4px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="margin: 0;">🔐 Şifre Sıfırlama</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Turp Admin Panel</p>
        </div>
        <div class="content">
            <p><strong>Merhaba{$greeting_name},</strong></p>
            
            <p>Turp Admin Panel hesabınız için bir şifre sıfırlama talebi aldık.</p>
            
            <p>Şifrenizi sıfırlamak için aşağıdaki butona tıklayın:</p>
            
            <div style="text-align: center;">
                <a href="{$reset_url}" class="button">Şifremi Sıfırla</a>
            </div>
            
            <p style="font-size: 14px; color: #64748b;">
                Eğer buton çalışmıyorsa, aşağıdaki linki tarayıcınıza kopyalayabilirsiniz:<br>
                <a href="{$reset_url}" style="word-break: break-all; color: #0891b2;">{$reset_url}</a>
            </p>
            
            <div class="warning">
                <strong>⏱️ Önemli:</strong> Bu bağlantı güvenlik nedeniyle <strong>1 saat</strong> içinde geçerliliğini yitirecektir.
            </div>
            
            <div style="background: #f1f5f9; padding: 16px; border-radius: 8px; margin-top: 20px;">
                <p style="margin: 0; font-size: 14px;">
                    <strong>🔒 Güvenlik Notu:</strong><br>
                    Eğer bu şifre sıfırlama talebini siz yapmadıysanız, bu e-postayı güvenle görmezden gelebilirsiniz. Hesabınızda hiçbir değişiklik yapılmayacaktır.
                </p>
            </div>
        </div>
        <div class="footer">
            <p>Turp Health - Klinik Çalışma ve Veri Yönetimi</p>
            <p style="font-size: 12px;">© 2024 Turp Health. Tüm hakları saklıdır.</p>
        </div>
    </div>
</body>
</html>
HTML;
}
