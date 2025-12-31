<?php
// NIPT Tenant Helper - Stub
// This file provides tenant-related helper functions for the NIPT module

function get_current_tenant($conn)
{
    // Default to 'nipt' tenant for now
    return 'nipt';
}

function get_tenant_id_by_code($conn, $code)
{
    $stmt = $conn->prepare("SELECT id FROM tenants WHERE code = ?");
    $stmt->execute([$code]);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    return $result ? $result['id'] : null;
}
