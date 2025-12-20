<?php
header('Content-Type: text/plain');

$password = 'Turp2024!';
$hash = password_hash($password, PASSWORD_BCRYPT);

echo "New Hash for 'Turp2024!':\n";
echo $hash . "\n\n";

echo "SQL to run:\n";
echo "UPDATE admin_users SET password_hash = '" . $hash . "' WHERE email = 'admin@turp.health';\n";
