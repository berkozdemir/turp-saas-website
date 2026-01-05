<?php
/**
 * Email Service
 * Handles sending emails via SMTP using PHPMailer
 */

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

// Try to load PHPMailer via composer autoload
$autoload_paths = [
    __DIR__ . '/../../vendor/autoload.php',
    __DIR__ . '/../../../vendor/autoload.php',
];

require_once __DIR__ . '/../core/tenant/tenant.service.php';

$autoload_loaded = false;
foreach ($autoload_paths as $path) {
    if (file_exists($path)) {
        require_once $path;
        $autoload_loaded = true;
        break;
    }
}

if (!$autoload_loaded) {
    error_log('[Email Service] PHPMailer not found. Run: composer require phpmailer/phpmailer');
}

/**
 * Get email configuration from environment or defaults
 */
function get_email_config(): array
{
    return [
        'smtp_host' => getenv('SMTP_HOST') ?: 'smtp.gmail.com',
        'smtp_port' => getenv('SMTP_PORT') ?: 587,
        'smtp_user' => getenv('SMTP_USER') ?: '',
        'smtp_pass' => getenv('SMTP_PASS') ?: '',
        'from_email' => getenv('SMTP_FROM_EMAIL') ?: 'noreply@nipt.tr',
        'from_name' => getenv('SMTP_FROM_NAME') ?: 'Omega Genetik',
        'app_url' => getenv('APP_URL') ?: 'https://nipt.tr',
    ];
}

/**
 * Send email using PHPMailer
 *
 * @param string $to Recipient email
 * @param string $subject Email subject
 * @param string $body HTML body
 * @param string $alt_body Plain text alternative
 * @return array ['success' => bool, 'error' => string|null]
 */
function send_email(string $to, string $subject, string $body, string $alt_body = ''): array
{
    if (!class_exists('PHPMailer\PHPMailer\PHPMailer')) {
        error_log('[Email Service] PHPMailer class not found');
        return [
            'success' => false,
            'error' => 'Email service not configured. Please install PHPMailer.'
        ];
    }

    $config = get_email_config();

    // Validation
    if (empty($config['smtp_user']) || empty($config['smtp_pass'])) {
        error_log('[Email Service] SMTP credentials not configured');
        return [
            'success' => false,
            'error' => 'Email service not configured. Please set SMTP credentials.'
        ];
    }

    try {
        $mail = new PHPMailer(true);

        // Server settings
        $mail->isSMTP();
        $mail->Host = $config['smtp_host'];
        $mail->SMTPAuth = true;
        $mail->Username = $config['smtp_user'];
        $mail->Password = $config['smtp_pass'];
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = $config['smtp_port'];
        $mail->CharSet = 'UTF-8';

        // Recipients
        $mail->setFrom($config['from_email'], $config['from_name']);
        $mail->addAddress($to);

        // Content
        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body = $body;
        $mail->AltBody = $alt_body ?: strip_tags($body);

        $mail->send();

        error_log("[Email Service] Email sent successfully to: $to");
        return ['success' => true, 'error' => null];

    } catch (Exception $e) {
        error_log("[Email Service] Failed to send email: {$mail->ErrorInfo}");
        return [
            'success' => false,
            'error' => "Email could not be sent. Mailer Error: {$mail->ErrorInfo}"
        ];
    }
}

/**
 * Send verification email to user
 *
 * @param string $to Recipient email
 * @param string $name User's name
 * @param string $token Verification token
 * @param string $tenant_id Tenant identifier (for branding)
 * @return array ['success' => bool, 'error' => string|null]
 */
function send_verification_email(string $to, string $name, string $token, int $tenant_id = 3): array
{
    $config = get_email_config();
    $verify_url = $config['app_url'] . "/verify-email?token=" . urlencode($token);

    // Resolve tenant for branding
    $tenant = get_tenant_by_id($tenant_id);
    $tenant_code = $tenant ? $tenant['code'] : 'nipt'; // Default to nipt if not found (legacy fallback)

    // Determine branding based on tenant
    $is_iwrs = ($tenant_code === 'iwrs');
    $brand_name = $is_iwrs ? 'Omega IWRS' : ($tenant['name'] ?? 'Omega Genetik');
    $primary_color = $tenant['primary_color'] ?? ($is_iwrs ? '#6366f1' : '#1a365d');

    // Load email template
    $template_path = __DIR__ . '/../templates/emails/verification.html';
    if (file_exists($template_path)) {
        $body = file_get_contents($template_path);
        // Replace placeholders
        $body = str_replace('{{NAME}}', htmlspecialchars($name), $body);
        $body = str_replace('{{VERIFY_URL}}', htmlspecialchars($verify_url), $body);
        $body = str_replace('{{BRAND_NAME}}', htmlspecialchars($brand_name), $body);
        $body = str_replace('{{PRIMARY_COLOR}}', $primary_color, $body);
        $body = str_replace('{{YEAR}}', date('Y'), $body);
    } else {
        // Fallback inline template
        $body = <<<HTML
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Doğrulama</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f5f5f5;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td align="center" style="padding: 40px 40px 20px 40px; background: linear-gradient(135deg, $primary_color 0%, #2c5282 100%); border-radius: 12px 12px 0 0;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">$brand_name</h1>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px;">
                            <h2 style="margin: 0 0 20px 0; color: #1a202c; font-size: 24px; font-weight: 600;">Merhaba $name,</h2>
                            <p style="margin: 0 0 20px 0; color: #4a5568; font-size: 16px; line-height: 1.6;">
                                Hesabınızı oluşturduğunuz için teşekkür ederiz! Devam etmek için lütfen e-posta adresinizi doğrulayın.
                            </p>
                            <p style="margin: 0 0 30px 0; color: #4a5568; font-size: 16px; line-height: 1.6;">
                                Aşağıdaki butona tıklayarak hesabınızı aktifleştirebilirsiniz:
                            </p>

                            <!-- CTA Button -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center">
                                <tr>
                                    <td style="border-radius: 8px; background: linear-gradient(135deg, $primary_color 0%, #2c5282 100%);">
                                        <a href="$verify_url" target="_blank" style="display: inline-block; padding: 16px 40px; font-size: 16px; font-weight: 600; color: #ffffff; text-decoration: none; border-radius: 8px;">
                                            E-posta Adresimi Doğrula
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <p style="margin: 30px 0 0 0; padding: 20px 0 0 0; border-top: 1px solid #e2e8f0; color: #718096; font-size: 14px; line-height: 1.6;">
                                Eğer yukarıdaki buton çalışmazsa, aşağıdaki linki kopyalayıp tarayıcınıza yapıştırabilirsiniz:
                            </p>
                            <p style="margin: 10px 0 0 0; color: #3182ce; font-size: 13px; word-break: break-all;">
                                $verify_url
                            </p>

                            <p style="margin: 30px 0 0 0; padding: 20px; background-color: #fef3c7; border-left: 4px solid #f59e0b; color: #92400e; font-size: 14px; line-height: 1.6; border-radius: 4px;">
                                <strong>⚠️ Güvenlik Uyarısı:</strong> Bu e-posta doğrulama isteğini siz yapmadıysanız, bu mesajı görmezden gelebilirsiniz.
                            </p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding: 30px; background-color: #f7fafc; border-radius: 0 0 12px 12px; text-align: center;">
                            <p style="margin: 0 0 10px 0; color: #718096; font-size: 14px;">
                                © {{YEAR}} $brand_name. Tüm hakları saklıdır.
                            </p>
                            <p style="margin: 0; color: #a0aec0; font-size: 12px;">
                                Bu otomatik bir e-postadır, lütfen yanıtlamayın.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
HTML;
        $body = str_replace('$primary_color', $primary_color, $body);
        $body = str_replace('$brand_name', htmlspecialchars($brand_name), $body);
        $body = str_replace('$name', htmlspecialchars($name), $body);
        $body = str_replace('$verify_url', htmlspecialchars($verify_url), $body);
        $body = str_replace('{{YEAR}}', date('Y'), $body);
    }

    $subject = "E-posta Adresinizi Doğrulayın - $brand_name";
    $alt_body = "Merhaba $name,\n\nHesabınızı oluşturduğunuz için teşekkür ederiz!\n\nLütfen e-posta adresinizi doğrulamak için aşağıdaki linke tıklayın:\n$verify_url\n\nTeşekkürler,\n$brand_name";

    return send_email($to, $subject, $body, $alt_body);
}

/**
 * Send password reset email for SMTP (legacy/fallback)
 */
function send_password_reset_email_smtp(string $to, string $name, string $token, int $tenant_id = 3): array
{
    $config = get_email_config();
    $reset_url = $config['app_url'] . "/reset-password?token=" . urlencode($token);

    // Resolve tenant for branding
    $tenant = get_tenant_by_id($tenant_id);
    $tenant_code = $tenant ? $tenant['code'] : 'nipt';

    $brand_name = ($tenant_code === 'iwrs') ? 'Omega IWRS' : ($tenant['name'] ?? 'Omega Genetik');

    $subject = "Şifre Sıfırlama Talebi - $brand_name";
    $body = "Merhaba $name, şifre sıfırlama linkiniz: $reset_url";

    return send_email($to, $subject, $body);
}
