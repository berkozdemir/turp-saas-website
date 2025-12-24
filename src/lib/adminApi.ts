import { getTenantHeader } from '../context/TenantContext';

const API_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Fetch wrapper that automatically includes tenant header
 */
export const tenantFetch = async (
    url: string,
    options: RequestInit = {}
): Promise<Response> => {
    const tenantHeaders = getTenantHeader();

    const mergedHeaders = {
        ...tenantHeaders,
        ...(options.headers || {}),
    };

    return fetch(url, {
        ...options,
        headers: mergedHeaders,
    });
};

/**
 * Admin API call with tenant context
 */
export const adminApi = async <T>(
    action: string,
    token: string,
    options: {
        method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
        params?: Record<string, string>;
        body?: any;
    } = {}
): Promise<T> => {
    const { method = 'GET', params = {}, body } = options;

    const url = new URL(`${API_URL}/index.php`);
    url.searchParams.set('action', action);

    Object.entries(params).forEach(([key, value]) => {
        url.searchParams.set(key, value);
    });

    const tenantHeaders = getTenantHeader();

    const fetchOptions: RequestInit = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            ...tenantHeaders,
        },
    };

    if (body && method !== 'GET') {
        fetchOptions.body = JSON.stringify(body);
    }

    const response = await fetch(url.toString(), fetchOptions);
    return response.json();
};

export default adminApi;
