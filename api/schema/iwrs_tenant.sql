-- Add IWRS tenant to the tenants table
INSERT INTO tenants (id, name, domain, is_active) 
VALUES ('iwrs', 'Omega IWRS', 'iwrs.com.tr', 1)
ON DUPLICATE KEY UPDATE domain = VALUES(domain);

-- Optionally add tenant_id column to existing tables if not covered by multi_tenant_schema.sql
-- (Assuming multi_tenant_schema.sql was already run)
