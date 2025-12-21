<?php
// Admin Authentication Helper

function require_admin_auth($conn)
{
    // Get Authorization header with multiple fallback methods
    // This handles Apache CGI, mod_php, Nginx, and various hosting environments

    $auth_header = '';

    // Method 1: Check $_SERVER directly (works in most cases)
    if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
        $auth_header = $_SERVER['HTTP_AUTHORIZATION'];
    }
    // Method 2: Apache mod_rewrite sometimes uses REDIRECT_HTTP_AUTHORIZATION
    elseif (isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
        $auth_header = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
    }
    // Method 3: Try getallheaders() function
    elseif (function_exists('getallheaders')) {
        $headers = getallheaders();
        // Case-insensitive check
        foreach ($headers as $key => $value) {
            if (strtolower($key) === 'authorization') {
                $auth_header = $value;
                break;
            }
        }
    }
    // Method 4: Try apache_request_headers() 
    elseif (function_exists('apache_request_headers')) {
        $headers = apache_request_headers();
        foreach ($headers as $key => $value) {
            if (strtolower($key) === 'authorization') {
                $auth_header = $value;
                break;
            }
        }
    }
    // Method 5: Manual $_SERVER parsing for CGI environments
    else {
        foreach ($_SERVER as $name => $value) {
            if (substr($name, 0, 5) == 'HTTP_') {
                $header_name = str_replace(' ', '-', ucwords(strtolower(str_replace('_', ' ', substr($name, 5)))));
                if (strtolower($header_name) === 'authorization') {
                    $auth_header = $value;
                    break;
                }
            }
        }
    }

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
