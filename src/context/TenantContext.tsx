import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface Tenant {
    id: number;
    code: string;
    name: string;
    primary_domain: string;
    logo_url?: string;
    primary_color?: string;
    tenant_role: string;
}

interface TenantContextType {
    currentTenant: Tenant | null;
    availableTenants: Tenant[];
    setCurrentTenant: (tenant: Tenant) => void;
    setAvailableTenants: (tenants: Tenant[]) => void;
    switchTenant: (tenantCode: string) => void;
    clearTenantContext: () => void;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

const TENANT_STORAGE_KEY = 'admin_current_tenant';
const TENANTS_LIST_KEY = 'admin_available_tenants';

// Debug logging for tenant operations
const debugLog = (action: string, data?: any) => {
    if (import.meta.env.DEV || localStorage.getItem('DEBUG_TENANT') === 'true') {
        console.log(`[TenantContext] ${action}`, data || '');
    }
};

export const TenantProvider = ({ children }: { children: ReactNode }) => {
    const [currentTenant, setCurrentTenantState] = useState<Tenant | null>(() => {
        const stored = localStorage.getItem(TENANT_STORAGE_KEY);
        return stored ? JSON.parse(stored) : null;
    });
    const [availableTenants, setAvailableTenantsState] = useState<Tenant[]>(() => {
        const stored = localStorage.getItem(TENANTS_LIST_KEY);
        return stored ? JSON.parse(stored) : [];
    });

    const setCurrentTenant = useCallback((tenant: Tenant) => {
        debugLog('setCurrentTenant called', { tenant, previousTenant: currentTenant });
        setCurrentTenantState(tenant);
        localStorage.setItem(TENANT_STORAGE_KEY, JSON.stringify(tenant));
        debugLog('localStorage updated', { key: TENANT_STORAGE_KEY, value: tenant });
    }, [currentTenant]);

    const setAvailableTenants = useCallback((tenants: Tenant[]) => {
        setAvailableTenantsState(tenants);
        localStorage.setItem(TENANTS_LIST_KEY, JSON.stringify(tenants));
    }, []);

    const switchTenant = useCallback((tenantCode: string) => {
        const tenant = availableTenants.find(t => t.code === tenantCode);
        if (tenant) {
            setCurrentTenant(tenant);
        }
    }, [availableTenants, setCurrentTenant]);

    const clearTenantContext = useCallback(() => {
        setCurrentTenantState(null);
        setAvailableTenantsState([]);
        localStorage.removeItem(TENANT_STORAGE_KEY);
        localStorage.removeItem(TENANTS_LIST_KEY);
    }, []);

    return (
        <TenantContext.Provider value={{
            currentTenant,
            availableTenants,
            setCurrentTenant,
            setAvailableTenants,
            switchTenant,
            clearTenantContext
        }}>
            {children}
        </TenantContext.Provider>
    );
};

export const useTenant = () => {
    const context = useContext(TenantContext);
    if (context === undefined) {
        throw new Error('useTenant must be used within a TenantProvider');
    }
    return context;
};

// Helper to get tenant header for API calls
export const getTenantHeader = (): Record<string, string> => {
    const stored = localStorage.getItem(TENANT_STORAGE_KEY);
    if (stored) {
        const tenant = JSON.parse(stored);
        return {
            'X-Tenant-Id': String(tenant.id || ''),
            'X-Tenant-Code': tenant.code || ''
        };
    }
    return {};
};
