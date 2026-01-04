-- Seed example admin users for testing
-- Password: 123456 (hashed with bcrypt cost=10)
--
-- NOTE: For local testing only. In production, create real admin accounts.

INSERT INTO admin_users (name, email, password_hash, role, is_active)
VALUES
    (
        'Admin User',
        'admin@turp.health',
        '$2y$10$p8z8J8pJ8pJ8pJ8pJ8pJ8pJ8pJ8pJ8pJ8pJ8pJ8pJ8pJ8pJ8pJ8pJ8p',
        'admin',
        1
    ),
    (
        'Editor User',
        'editor@turp.health',
        '$2y$10$p8z8J8pJ8pJ8pJ8pJ8pJ8pJ8pJ8pJ8pJ8pJ8pJ8pJ8pJ8pJ8pJ8pJ8p',
        'editor',
        1
    ),
    (
        'Viewer User',
        'viewer@turp.health',
        '$2y$10$p8z8J8pJ8pJ8pJ8pJ8pJ8pJ8pJ8pJ8pJ8pJ8pJ8pJ8pJ8pJ8pJ8pJ8p',
        'viewer',
        1
    )
ON DUPLICATE KEY UPDATE is_active = 1;

-- Assign admin users to turp tenant (assuming turp tenant id = 1)
INSERT INTO admin_user_tenants (user_id, tenant_id, role)
SELECT
    au.id,
    1 as tenant_id,
    au.role
FROM admin_users au
WHERE au.email IN ('admin@turp.health', 'editor@turp.health', 'viewer@turp.health')
ON DUPLICATE KEY UPDATE role = VALUES(role);

-- Assign admin to NIPT tenant (assuming nipt tenant id = 2)
INSERT INTO admin_user_tenants (user_id, tenant_id, role)
SELECT
    au.id,
    2 as tenant_id,
    'editor' as role
FROM admin_users au
WHERE au.email = 'admin@turp.health'
ON DUPLICATE KEY UPDATE role = 'editor';
