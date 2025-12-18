<?php
// Forgot Password Email Sending Helper
// Included by index.php for forgot-password action

function send_password_reset_email_inline($conn, $email, $ip_address, $brevo_api_key)
{
    // Rate limiting check
    $one_hour_ago = date('Y-m-d H:i:s', strtotime('-1 hour'));

    $stmt = $conn->prepare("SELECT COUNT(*) as count FROM password_reset_tokens WHERE ip_address = ? AND created_at > ?");
    $stmt->execute([$ip_address, $one_hour_ago]);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($result['count'] >= 3) {
        return true; // Rate limited but don't reveal it
    }

    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        return true; // Invalid but don't reveal it
    }

    try {
        // Check if user exists
        $stmt = $conn->prepare("SELECT id, email, name FROM admin_users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user) {
            return true; // User doesn't exist but don't reveal it
        }

        // Generate secure token
        $token = bin2hex(random_bytes(32));
        $expires_at = date('Y-m-d H:i:s', strtotime('+1 hour'));

        // Store token
        $stmt = $conn->prepare("INSERT INTO password_reset_tokens (user_id, token, expires_at, ip_address) VALUES (?, ?, ?, ?)");
        $stmt->execute([$user['id'], $token, $expires_at, $ip_address]);

        // Send email via Brevo
        $reset_url = "http://localhost:5173/admin/reset-password?token=" . $token;

        $html_email = '
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
                <div style="background:linear-gradient(135deg,#0891b2 0%,#0e7490 100%);color:white;padding:30px;text-align:center">
                    <h1 style="margin:0">🔐 Şifre Sıfırlama</h1>
                    <p style="margin:10px 0 0 0">Turp Admin Panel</p>
                </div>
                <div style="padding:40px;background:white">
                    <p><strong>Merhaba,</strong></p>
                    <p>Turp Admin Panel hesabınız için bir şifre sıfırlama talebi aldık.</p>
                    <p>Şifrenizi sıfırlamak için aşağıdaki butona tıklayın:</p>
                    <div style="text-align:center;margin:30px 0">
                        <a href="' . $reset_url . '" style="background:#0891b2;color:white;padding:14px 32px;text-decoration:none;border-radius:8px;display:inline-block;font-weight:600">Şifremi Sıfırla</a>
                    </div>
                    <p style="font-size:14px;color:#64748b">
                        Link: <a href="' . $reset_url . '">' . $reset_url . '</a>
                    </p>
                    <div style="background:#fef3c7;border-left:4px solid #f59e0b;padding:12px;margin:20px 0">
                        <strong>⏱️ Önemli:</strong> Bu bağlantı <strong>1 saat</strong> içinde geçerliliğini yitirecektir.
                    </div>
                </div>
            </div>';

        if ($brevo_api_key) {
            $ch = curl_init('https://api.brevo.com/v3/smtp/email');
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                'api-key: ' . $brevo_api_key,
                'Content-Type: application/json'
            ]);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
                'sender' => ['email' => 'noreply@turp.health', 'name' => 'Turp Health'],
                'to' => [['email' => $user['email'], 'name' => $user['name'] ?? 'Kullanıcı']],
                'subject' => 'Şifre Sıfırlama - Turp Admin Panel',
                'htmlContent' => $html_email
            ]));
            $response = curl_exec($ch);
            $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);

            error_log("Password reset email sent: HTTP $http_code");
        }

        return true;
    } catch (Exception $e) {
        error_log("Forgot password error: " . $e->getMessage());
        return true; // Don't reveal errors
    }
}
