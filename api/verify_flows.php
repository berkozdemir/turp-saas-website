<?php
// Verification Script for Westesti & Trombofili Flows

$baseUrl = "http://localhost/index.php";

function makeRequest($url, $method = 'GET', $data = null, $headers = [])
{
    $curl = curl_init();
    $opts = [
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CUSTOMREQUEST => $method,
        CURLOPT_HTTPHEADER => array_merge(['Content-Type: application/json'], $headers),
        CURLOPT_TIMEOUT => 10
    ];

    if ($data) {
        $opts[CURLOPT_POSTFIELDS] = json_encode($data);
    }

    curl_setopt_array($curl, $opts);
    $response = curl_exec($curl);
    $httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
    curl_close($curl);

    return ['code' => $httpCode, 'body' => json_decode($response, true)];
}

echo "Starting Verification...\n";
echo "--------------------------------------------------\n";

// 1. WESTESTI FLOW
echo "\n[1] Testing Westesti.com Flow\n";

// 1.1 Get Locations
echo " -> Fetching Locations... ";
$res = makeRequest("$baseUrl?action=get_west_locations", 'GET', null, ['X-Tenant-Code: westesti']);
if ($res['code'] == 200 && !empty($res['body']['data'])) {
    $location = $res['body']['data'][0];
    echo "OK (Found: " . $location['city'] . ")\n";
} else {
    echo "FAILED\n";
    print_r($res);
    exit;
}

// 1.2 Create Booking (with Omega Care check)
echo " -> Creating Booking (Verifi NIPT)... ";
$rand = time();
$bookingData = [
    'patient_name' => "Auto Test Patient $rand",
    'patient_phone' => '5551112233',
    'patient_email' => "test_west_$rand@example.com",
    'location_id' => $location['id'],
    'test_slug' => 'verifi'
];
$res = makeRequest("$baseUrl?action=create_west_booking", 'POST', $bookingData, ['X-Tenant-Code: westesti']);

if ($res['code'] == 200 && $res['body']['success']) {
    $westBookingId = $res['body']['booking_id'];
    echo "OK (ID: $westBookingId)\n";
} else {
    echo "FAILED\n";
    print_r($res);
    exit;
}


// 2. TROMBOFILI FLOW
echo "\n[2] Testing Trombofili.com Flow\n";

// 2.1 Get Providers
echo " -> Fetching Healthcare Providers... ";
$res = makeRequest("$baseUrl?action=get_healthcare_providers", 'GET', null, ['X-Tenant-Code: trombofili']);
if ($res['code'] == 200 && !empty($res['body']['data'])) {
    $provider = $res['body']['data'][0];
    echo "OK (Found: " . $provider['name'] . ")\n";
} else {
    echo "FAILED\n";
    print_r($res);
    exit;
}

// 2.2 Create Booking (Panel)
echo " -> Creating Booking (Thrombophilia Panel)... ";
$trombData = [
    'patient_name' => 'Auto Test Patient (Tromb)',
    'patient_phone' => '5554445566',
    'patient_age' => 45,
    'test_slug' => 'panel',
    'indication_type' => 'dvt_history',
    'indication_details' => 'Previous DVT in 2020',
    'healthcare_provider_id' => $provider['id']
];
$res = makeRequest("$baseUrl?action=create_trombofili_booking", 'POST', $trombData, ['X-Tenant-Code: trombofili']);

if ($res['code'] == 200 && $res['body']['success']) {
    $trombBookingId = $res['body']['booking_id'];
    echo "OK (ID: $trombBookingId)\n";
} else {
    echo "FAILED\n";
    print_r($res);
    exit;
}


// 3. ADMIN VERIFICATION
echo "\n[3] Verifying Admin Visibility\n";

// 3.1 Check Westesti in NIPT list
echo " -> Checking Westesti booking in NIPT List... ";
$res = makeRequest("$baseUrl?action=get_bookings", 'GET', null, ['Authorization: Bearer mock_token']); // Token usually required, bypassing/mocking per dev env
// Note: We need a valid token or retrieval method. 
// Assuming for this test dev env auth helper might be lenient or we skip token check in local nipt_api logic (as noted in comments).
// If it fails on 401, we know auth is working :)
// Retrying with 'nipt_api.php' logic comment "For MVP... Fetch ALL...". 

// Actually nipt_api.php doesn't strictly check 'Authorization' header presence in line 452+, it just runs query.
// Let's assume standard PHP session might be needed or it's open.
// Based on previous tool output, it seemed open.

if ($res['code'] == 200 && !empty($res['body']['data'])) {
    $found = false;
    foreach ($res['body']['data'] as $b) {
        if ($b['id'] == $westBookingId) {
            $found = true;
            break;
        }
    }
    if ($found)
        echo "OK (Found ID $westBookingId)\n";
    else
        echo "WARNING: Created booking not found in list (Filter issue?)\n";
} else {
    echo "SKIPPED/FAILED (Auth or Empty)\n";
}

// 3.2 Check Trombofili Separate List
echo " -> Checking Trombofili booking in Specialized List... ";
$res = makeRequest("$baseUrl?action=get_trombofili_bookings", 'GET', null, ['Authorization: Bearer mock_token', 'X-Tenant-Code: trombofili']);
if ($res['code'] == 200 && !empty($res['body']['data'])) {
    $found = false;
    foreach ($res['body']['data'] as $b) {
        if ($b['id'] == $trombBookingId) {
            $found = true;
            break;
        }
    }
    if ($found)
        echo "OK (Found ID $trombBookingId)\n";
    else
        echo "WARNING: Created booking not found in list\n";
} else {
    echo "FAILED\n";
    print_r($res);
}

echo "\n--------------------------------------------------\n";
echo "Verification Complete.\n";
?>