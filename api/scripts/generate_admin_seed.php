<?php
/**
 * Generate SQL seed file for admin users with proper bcrypt hashes
 * Run: php generate_admin_seed.php > ../migrations/seed_admin_users.sql
 */

$password = '123456';
$passwordHash = password_hash($password, PASSWORD_BCRYPT, ['cost' => 10]);

echo "-- Seed example admin users for testing\n";
echo "-- Email: admin@turp.health, Password: 123456\n";
echo "-- Email: editor@turp.health, Password: 123456\n";
echo "-- Email: viewer@turp.health, Password: 123456\n\n";

echo "INSERT INTO admin_users (name, email, password_hash, role, is_active)\n";
echo "VALUES\n";
echo "    (\n";
echo "        'Admin User',\n";
echo "        'admin@turp.health',\n";
echo "        '$passwordHash',\n";
echo "        'admin',\n";
echo "        1\n";
echo "    ),\n";
echo "    (\n";
echo "        'Editor User',\n";
echo "        'editor@turp.health',\n";
echo "        '$passwordHash',\n";
echo "        'editor',\n";
echo "        1\n";
echo "    ),\n";
echo "    (\n";
echo "        'Viewer User',\n";
echo "        'viewer@turp.health',\n";
echo "        '$passwordHash',\n";
echo "        'viewer',\n";
echo "        1\n";
echo "    )\n";
echo "ON DUPLICATE KEY UPDATE is_active = 1;\n\n";

echo "-- Assign admin users to turp tenant (assuming turp tenant id = 1)\n";
echo "INSERT INTO admin_user_tenants (user_id, tenant_id, role)\n";
echo "SELECT\n";
echo "    au.id,\n";
echo "    1 as tenant_id,\n";
echo "    au.role\n";
echo "FROM admin_users au\n";
echo "WHERE au.email IN ('admin@turp.health', 'editor@turp.health', 'viewer@turp.health')\n";
echo "    AND au.role IN ('admin', 'editor', 'viewer')\n";
echo "ON DUPLICATE KEY UPDATE role = VALUES(role);\n\n";

echo "-- Assign admin to NIPT tenant (assuming nipt tenant id = 2)\n";
echo "INSERT INTO admin_user_tenants (user_id, tenant_id, role)\n";
echo "SELECT\n";
echo "    au.id,\n";
echo "    2 as tenant_id,\n";
echo "    'editor' as role\n";
echo "FROM admin_users au\n";
echo "WHERE au.email = 'admin@turp.health'\n";
echo "ON DUPLICATE KEY UPDATE role = 'editor';\n";
?>
