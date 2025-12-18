<?php
// Admin Authentication Helper

function require_admin_auth($conn)
{
    // Get headers (handle Apache/Nginx differences if needed, but getallheaders usually works in standard PHP setups)
    if (!function_exists('getallheaders')) {
        $headers = [];
        foreach ($_SERVER as $name => $value) {
            if (substr($name, 0, 5) == 'HTTP_') {
                $headers[str_replace(' ', '-', ucwords(strtolower(str_replace('_', ' ', substr($name, 5)))))] = $value;
            }
        }
    } else {
        $headers = getallheaders();
    }

    $auth_header = $headers['Authorization'] ?? $headers['authorization'] ?? '';

    if (!preg_match('/Bearer\s(\S+)/', $auth_header, $matches)) {
        http_response_code(401);
        echo json_encode(['error' => 'Yetkilendirme gerekli (Token eksik)']);
        exit;
    }

    $token = $matches[1];

    $stmt = $conn->prepare("SELECT user_id, expires_at FROM admin_sessions WHERE token = ?");
    $stmt->execute([$token]);
    $session = $stmt->fetch(PDO::FETCH_ASSOC);

    // Check if session exists and is not expired
    if (!$session) {
        http_response_code(401);
        echo json_encode(['error' => 'Geçersiz oturum']);
        exit;
    }

    if (strtotime($session['expires_at']) < time()) {
        http_response_code(401);
        echo json_encode(['error' => 'Oturum süresi dolmuş']);
        exit;
    }

    // Update last activity? Optional. 
    // For now just return user_id
    return $session['user_id'];
}
