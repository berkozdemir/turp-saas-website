<?php
/**
 * Geo & Language Detection Helper
 * Provides IP-based region detection and language preference detection
 */

/**
 * Get region and country from IP address
 * 
 * For development: Returns mock data
 * For production: Integrate with GeoIP service (MaxMind, ipapi.co, ip-api.com)
 * 
 * @param string $ip IP address to lookup
 * @return array ['country' => 'TR', 'region' => 'EU', 'is_eu' => true]
 */
function get_region_from_ip($ip)
{
    // Production GeoIP integration placeholder
    // Uncomment and configure for production:

    /*
    // Option 1: ip-api.com (Free, rate-limited)
    try {
        $response = file_get_contents("http://ip-api.com/json/{$ip}?fields=status,country,countryCode,continent");
        $data = json_decode($response, true);
        if ($data['status'] === 'success') {
            $is_eu = in_array($data['countryCode'], [
                'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 
                'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 
                'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'GB', 'IS', 'LI', 'NO', 'CH'
            ]);
            return [
                'country' => $data['countryCode'],
                'region' => $data['continent'] === 'Europe' ? 'EU' : $data['continent'],
                'is_eu' => $is_eu
            ];
        }
    } catch (Exception $e) {
        error_log("GeoIP lookup failed: " . $e->getMessage());
    }
    */

    /*
    // Option 2: MaxMind GeoIP2 (Paid, most accurate)
    require_once __DIR__ . '/vendor/autoload.php';
    use GeoIp2\Database\Reader;

    try {
        $reader = new Reader(__DIR__ . '/GeoLite2-Country.mmdb');
        $record = $reader->country($ip);
        $country_code = $record->country->isoCode;
        $is_eu = $record->country->isInEuropeanUnion;

        return [
            'country' => $country_code,
            'region' => $is_eu ? 'EU' : $record->continent->code,
            'is_eu' => $is_eu
        ];
    } catch (Exception $e) {
        error_log("MaxMind GeoIP2 error: " . $e->getMessage());
    }
    */

    // Development: Mock data based on IP patterns or return default
    // Check if IP looks Turkish or European for testing
    if (preg_match('/^(85\.|88\.|95\.)/', $ip)) {
        // Turkish IP range mock
        return [
            'country' => 'TR',
            'region' => 'EU',
            'is_eu' => false
        ];
    }

    // Default: Assume EU for GDPR compliance (safer default)
    return [
        'country' => 'TR',
        'region' => 'EU',
        'is_eu' => true
    ];
}

/**
 * Detect preferred language from browser or fallback
 * 
 * Priority:
 * 1. Browser Accept-Language header
 * 2. Default language parameter
 * 
 * @param string $default Default language code
 * @return string Language code (tr, en, or zh)
 */
function detect_preferred_language($default = 'tr')
{
    // Get Accept-Language header
    $accept_lang = $_SERVER['HTTP_ACCEPT_LANGUAGE'] ?? '';

    if (empty($accept_lang)) {
        return $default;
    }

    // Parse Accept-Language: "en-US,en;q=0.9,tr;q=0.8"
    // Extract primary language codes
    if (preg_match('/^(tr|en|zh)(-|;|,|$)/i', $accept_lang, $matches)) {
        return strtolower($matches[1]);
    }

    // Check anywhere in the string
    if (stripos($accept_lang, 'tr') !== false)
        return 'tr';
    if (stripos($accept_lang, 'en') !== false)
        return 'en';
    if (stripos($accept_lang, 'zh') !== false)
        return 'zh';

    return $default;
}

/**
 * Check if IP is from EU region (for GDPR requirements)
 * 
 * @param string $ip IP address
 * @return bool True if EU region
 */
function is_eu_user($ip)
{
    $geo = get_region_from_ip($ip);
    return $geo['is_eu'] ?? false;
}
