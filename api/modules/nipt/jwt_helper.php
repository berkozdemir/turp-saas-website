<?php
// NIPT JWT Helper - Stub
// This file provides JWT helper functions for the NIPT module

function nipt_create_jwt($payload, $secret = 'nipt_secret_key')
{
    $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
    $payload['iat'] = time();
    $payload['exp'] = time() + 86400; // 24 hours
    $payload = json_encode($payload);

    $base64UrlHeader = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
    $base64UrlPayload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($payload));

    $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, $secret, true);
    $base64UrlSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));

    return $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
}

function nipt_verify_jwt($token, $secret = 'nipt_secret_key')
{
    $parts = explode('.', $token);
    if (count($parts) !== 3)
        return false;

    list($header, $payload, $signature) = $parts;

    $validSignature = hash_hmac('sha256', $header . "." . $payload, $secret, true);
    $validBase64UrlSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($validSignature));

    if ($signature !== $validBase64UrlSignature)
        return false;

    $payloadData = json_decode(base64_decode(str_replace(['-', '_'], ['+', '/'], $payload)), true);

    if (isset($payloadData['exp']) && $payloadData['exp'] < time())
        return false;

    return $payloadData;
}
