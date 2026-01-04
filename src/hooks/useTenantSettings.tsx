import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { fetchAPI } from '../lib/contentApi';

interface TenantSettings {
    tenant_id: string;
    tenant_name: string;
    allow_enduser_login: boolean;
    allow_enduser_signup: boolean;
}

interface TenantSettingsContextValue {
    settings: TenantSettings | null;
    loading: boolean;
    error: string | null;
}

const TenantSettingsContext = createContext<TenantSettingsContextValue>({
    settings: null,
    loading: true,
    error: null
});

export function TenantSettingsProvider({ children }: { children: ReactNode }) {
    const [settings, setSettings] = useState<TenantSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchSettings() {
            try {
                const data = await fetchAPI('get_tenant_settings');
                if (data.success) {
                    setSettings({
                        tenant_id: data.tenant_id,
                        tenant_name: data.tenant_name,
                        allow_enduser_login: data.allow_enduser_login ?? false,
                        allow_enduser_signup: data.allow_enduser_signup ?? false
                    });
                } else {
                    // API returned error, use domain-based fallback
                    const hostname = window.location.hostname;
                    const isIwrs = hostname.includes('iwrs');
                    setSettings({
                        tenant_id: isIwrs ? 'iwrs' : 'turp',
                        tenant_name: isIwrs ? 'Omega IWRS' : 'Turp Health',
                        allow_enduser_login: isIwrs, // IWRS allows enduser login
                        allow_enduser_signup: isIwrs // IWRS allows enduser signup
                    });
                }
            } catch (err) {
                setError('Ayarlar yüklenemedi');
                // Fallback for development/testing if API fails - detect domain
                const hostname = window.location.hostname;
                const isIwrs = hostname.includes('iwrs');
                setSettings({
                    tenant_id: isIwrs ? 'iwrs' : 'turp',
                    tenant_name: isIwrs ? 'Omega IWRS' : 'Turp Health',
                    allow_enduser_login: isIwrs, // IWRS allows enduser login
                    allow_enduser_signup: isIwrs // IWRS allows enduser signup
                });
            } finally {
                setLoading(false);
            }
        }
        fetchSettings();
    }, []);

    return (
        <TenantSettingsContext.Provider value={{ settings, loading, error }}>
            {children}
        </TenantSettingsContext.Provider>
    );
}

export function useTenantSettings() {
    return useContext(TenantSettingsContext);
}
