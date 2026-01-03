import { useState, useEffect } from 'react';
import { fetchAPI } from '../lib/contentApi';

export interface Tenant {
    id: number;
    code: string;
    name: string;
    domain: string;
    color: string;
    logo: string | null;
}

interface TenantsCache {
    tenants: Tenant[];
    domainMap: Map<string, string>; // domain -> tenant code
    timestamp: number;
}

let tenantsCache: TenantsCache | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Fetch and cache tenant list from backend
 */
export async function fetchTenants(): Promise<Tenant[]> {
    // Return cached data if still valid
    if (tenantsCache && Date.now() - tenantsCache.timestamp < CACHE_DURATION) {
        return tenantsCache.tenants;
    }

    try {
        const response = await fetchAPI('get_tenants');

        if (response?.success && Array.isArray(response.data)) {
            const tenants: Tenant[] = response.data;

            // Build domain map
            const domainMap = new Map<string, string>();
            tenants.forEach(tenant => {
                domainMap.set(tenant.domain, tenant.code);
                // Also map without www prefix
                if (tenant.domain.startsWith('www.')) {
                    domainMap.set(tenant.domain.substring(4), tenant.code);
                }
            });

            tenantsCache = {
                tenants,
                domainMap,
                timestamp: Date.now()
            };

            // Also populate window cache for synchronous access in contentApi
            if (typeof window !== 'undefined') {
                (window as any).__TENANT_CODE_CACHE__ = Object.fromEntries(domainMap);
            }

            return tenants;
        }

        return [];
    } catch (error) {
        console.error('Failed to fetch tenants:', error);
        return [];
    }
}

/**
 * Get tenant code by domain (with caching)
 */
export async function getTenantCodeByDomain(domain: string): Promise<string> {
    await fetchTenants(); // Ensure cache is populated

    if (!tenantsCache) {
        return 'turp'; // Fallback
    }

    // Clean domain (remove www, port, protocol)
    const cleanDomain = domain
        .replace(/^(https?:\/\/)?(www\.)?/, '')
        .split(':')[0];

    return tenantsCache.domainMap.get(cleanDomain) || 'turp';
}

/**
 * React hook to fetch tenants list
 */
export function useTenants() {
    const [tenants, setTenants] = useState<Tenant[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadTenants() {
            try {
                const data = await fetchTenants();
                setTenants(data);
            } catch (err) {
                setError('Failed to load tenants');
            } finally {
                setLoading(false);
            }
        }

        loadTenants();
    }, []);

    return { tenants, loading, error };
}
