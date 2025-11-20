<?php
// CORS Ayarları (React uygulamanın erişebilmesi için)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Sadece POST isteklerini kabul et
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["status" => "error", "message" => "Method not allowed"]);
    exit;
}

// React'ten gelen JSON verisini al
$input = json_decode(file_get_contents("php://input"), true);

if (!$input) {
    echo json_encode(["status" => "error", "message" => "No data received"]);
    exit;
}

// --- AYARLAR ---
$resendKey = "re_UFK1m3ia_67Bt7145iE6P3fPNPHyffV9t"; // Plesk'e geçince buraya GERÇEK Resend API Key'ini yazacaksın.
$toEmail = "info@turp.app"; // Bildirim kime gidecek?
$fromEmail = "Turp <info@turp.app>"; // Gönderen kim? (Resend'de onaylı domain olmalı)

// Resend API'ye gidecek veri
$data = [
    "from" => $fromEmail,
    "to" => [$toEmail],
    "subject" => "Turp RWE Web Sitesi-Yeni Talep: " . ($input['ad_soyad'] ?? 'İsimsiz'),
    "html" => "<h3>Yeni Web Sitesi Başvurusu</h3>" .
              "<p><strong>İsim:</strong> " . ($input['ad_soyad'] ?? '-') . "</p>" .
              "<p><strong>Email:</strong> " . ($input['email'] ?? '-') . "</p>" .
              "<p><strong>Şirket:</strong> " . ($input['sirket'] ?? '-') . "</p>" .
              "<p><strong>İlgi Alanı:</strong> " . ($input['ilgi_alani'] ?? '-') . "</p>"
];

// cURL ile Resend API'ye istek at
$ch = curl_init("https://api.resend.com/emails");
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer " . $resendKey,
    "Content-Type: application/json"
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

// Sonucu React'e döndür
http_response_code($httpCode);
echo $response;
?>mail.php
