<?php
// Mock DB connection for verification if possible, or just check syntax.
// Since we can't easily mock DB here without credentials/env, we'll just include the file and check reflection/param types or try to call it.
// Actually, I can just check if the function signature allows it using Reflection.

require_once __DIR__ . '/../../modules/faq/faq.service.php';

try {
    $reflection = new ReflectionFunction('faq_list');
    $params = $reflection->getParameters();
    $tenantParam = $params[0];

    if ($tenantParam->hasType() && $tenantParam->getType()->getName() === 'int') {
        echo "FAIL: tenant_id is still typed as int\n";
    } else {
        echo "PASS: tenant_id is not typed as int\n";
    }
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
