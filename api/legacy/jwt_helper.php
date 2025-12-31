<?php
/**
 * JWT Helper for NIPT Patient Auth
 * Implements simple HS256 signing and verification
 */

function base64url_encode($data)
{
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function generate_jwt($payload, $secret = null)
{
    if (!$secret) {
        $secret = getenv('JWT_SECRET') ?: 'turp_nipt_secret_key_change_me';
    }

    $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);

    // Add expiration if not present
    if (!isset($payload['exp'])) {
        $payload['exp'] = time() + (60 * 60 * 24 * 7); // 7 days
    }

    $payload_json = json_encode($payload);

    $base64UrlHeader = base64url_encode($header);
    $base64UrlPayload = base64url_encode($payload_json);

    $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, $secret, true);
    $base64UrlSignature = base64url_encode($signature);

    return $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
}

function verify_jwt($token, $secret = null)
{
    if (!$secret) {
        $secret = getenv('JWT_SECRET') ?: 'turp_nipt_secret_key_change_me';
    }

    $parts = explode('.', $token);
    if (count($parts) != 3)
        return false;

    $header = $parts[0];
    $payload = $parts[1];
    $signature_provided = $parts[2];

    $signature = hash_hmac('sha256', $header . "." . $payload, $secret, true);
    $base64UrlSignature = base64url_encode($signature);

    if ($base64UrlSignature === $signature_provided) {
        $data = json_decode(base64_decode(strtr($payload, '-_', '+/')), true);

        // Check expiration
        if (isset($data['exp']) && $data['exp'] < time()) {
            return false;
        }

        return $data;
    }

    return false;
}
