<?php
// Shared Email Helper using Brevo API

function send_email_via_brevo($api_key, $to_email, $to_name, $subject, $html_content)
{
    if (empty($api_key)) {
        error_log("Brevo API key is missing");
        return false;
    }

    $url = 'https://api.brevo.com/v3/smtp/email';
    $data = [
        'sender' => ['email' => 'noreply@turp.health', 'name' => 'Turp Health'],
        'to' => [['email' => $to_email, 'name' => $to_name]],
        'subject' => $subject,
        'htmlContent' => $html_content
    ];

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'api-key: ' . $api_key,
        'Content-Type: application/json'
    ]);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));

    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    if ($errno = curl_errno($ch)) {
        $error_msg = curl_error($ch);
        error_log("Brevo cURL Error: " . $error_msg);
    }

    curl_close($ch);

    $success = ($http_code >= 200 && $http_code < 300);

    if (!$success) {
        error_log("Brevo API Error (HTTP $http_code): " . $response);
    } else {
        error_log("Brevo API Success (HTTP $http_code)");
    }

    return $success;
}
