/**
 * Admin API Client
 * 
 * This module provides a fetch wrapper that automatically includes
 * authentication token and tenant context headers.
 * 
 * Usage:
 *   import { adminFetch } from '@/lib/adminApi';
 *   const response = await adminFetch('/api/index.php?action=get_blog_posts_admin');
 */

const API_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/index\.php\/?$/, '').replace(/\/+$/, '');

interface AdminFetchOptions extends RequestInit {
    /** Skip tenant header (for tenant-agnostic endpoints) */
    skipTenant?: boolean;
}

/**
 * Fetch wrapper that automatically includes auth token and tenant headers
 */
export async function adminFetch(
    endpoint: string,
    options: AdminFetchOptions = {}
): Promise<Response> {
    const { skipTenant, ...fetchOptions } = options;

    // Get auth token from localStorage
    const sessionData = localStorage.getItem('admin_session');
    const session = sessionData ? JSON.parse(sessionData) : null;
    const token = session?.token;

    // Get current tenant from localStorage
    const tenantData = localStorage.getItem('admin_current_tenant');
    const tenant = tenantData ? JSON.parse(tenantData) : null;

    // Build headers
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(fetchOptions.headers as Record<string, string> || {})
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    // Always send tenant header for admin requests (unless explicitly skipped)
    if (!skipTenant && tenant?.id) {
        headers['X-Tenant-Id'] = String(tenant.id);
        headers['X-Tenant-Code'] = tenant.code || '';
    }

    // Build full URL
    const fullUrl = endpoint.startsWith('http')
        ? endpoint
        : `${API_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

    return fetch(fullUrl, {
        ...fetchOptions,
        headers
    });
}

/**
 * Convenience method for GET requests
 */
export async function adminGet(endpoint: string, options?: AdminFetchOptions) {
    return adminFetch(endpoint, { ...options, method: 'GET' });
}

/**
 * Convenience method for POST requests with JSON body
 */
export async function adminPost(
    endpoint: string,
    data: unknown,
    options?: AdminFetchOptions
) {
    return adminFetch(endpoint, {
        ...options,
        method: 'POST',
        body: JSON.stringify(data)
    });
}

/**
 * Helper to get tenant header for use in custom fetch calls
 */
export function getTenantHeaders(): Record<string, string> {
    const tenantData = localStorage.getItem('admin_current_tenant');
    const tenant = tenantData ? JSON.parse(tenantData) : null;

    if (tenant?.id) {
        return {
            'X-Tenant-Id': String(tenant.id),
            'X-Tenant-Code': tenant.code || ''
        };
    }

    return {};
}

/**
 * Get current admin session
 */
export function getAdminSession() {
    const sessionData = localStorage.getItem('admin_session');
    return sessionData ? JSON.parse(sessionData) : null;
}

/**
 * Get current tenant
 */
export function getCurrentTenant() {
    const tenantData = localStorage.getItem('admin_current_tenant');
    return tenantData ? JSON.parse(tenantData) : null;
}
