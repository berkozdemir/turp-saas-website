<?php
require_once 'api/config/db.php';
$conn = get_db_connection();
$stmt = $conn->prepare('SELECT * FROM endusers WHERE email = ?');
$stmt->execute(['test@iwrs.com.tr']);
$users = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($users, JSON_PRETTY_PRINT);

