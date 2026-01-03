import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useTenantSettings } from './useTenantSettings';

export interface EndUser {
    id: number | string;
    email: string;
    name: string;
    phone?: string;
    // Add flexible properties for Supabase or other auth providers if needed
    [key: string]: any;
}

interface EndUserAuthContextValue {
    user: EndUser | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string; email_not_verified?: boolean; email?: string }>;
    signup: (data: SignupData) => Promise<{ success: boolean; error?: string; message?: string }>;
    logout: () => void;
    isAuthenticated: boolean;
    verifyEmail: (token: string) => Promise<{ success: boolean; error?: string; message?: string }>;
    resendVerification: (email: string) => Promise<{ success: boolean; error?: string; message?: string }>;
}

interface SignupData {
    email: string;
    password: string;
    name: string;
    phone?: string;
}

const EndUserAuthContext = createContext<EndUserAuthContextValue | null>(null);

const API_URL = import.meta.env.VITE_API_URL || '/api';

export function EndUserAuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<EndUser | null>(null);
    const [loading, setLoading] = useState(true);
    const { settings } = useTenantSettings();

    // Check existing token on mount
    useEffect(() => {
        const token = localStorage.getItem('enduser_token');
        if (token) {
            verifyToken(token);
        } else {
            setLoading(false);
        }
    }, []);

    async function verifyToken(token: string) {
        try {
            const res = await fetch(`${API_URL}/index.php?action=enduser_me`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success && data.user) {
                setUser(data.user);
            } else {
                localStorage.removeItem('enduser_token');
            }
        } catch {
            localStorage.removeItem('enduser_token');
        } finally {
            setLoading(false);
        }
    }

    async function login(email: string, password: string) {
        if (!settings?.allow_enduser_login) {
            return { success: false, error: 'Bu site için giriş aktif değil' };
        }

        try {
            const res = await fetch(`${API_URL}/index.php?action=enduser_login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();

            if (data.success && data.token) {
                localStorage.setItem('enduser_token', data.token);
                setUser(data.user);
                return { success: true };
            }
            // Return all error details including email_not_verified flag
            return {
                success: false,
                error: data.error || 'Giriş başarısız',
                email_not_verified: data.email_not_verified,
                email: data.email
            };
        } catch {
            return { success: false, error: 'Bağlantı hatası' };
        }
    }

    async function signup(signupData: SignupData) {
        if (!settings?.allow_enduser_signup) {
            return { success: false, error: 'Bu site için kayıt aktif değil' };
        }

        try {
            const res = await fetch(`${API_URL}/index.php?action=enduser_signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(signupData)
            });
            const data = await res.json();

            // DON'T auto-login - user must verify email first
            if (data.success) {
                return {
                    success: true,
                    message: data.message || 'Kayıt başarılı! Lütfen e-postanızı kontrol edin.'
                };
            }
            return { success: false, error: data.error || 'Kayıt başarısız' };
        } catch {
            return { success: false, error: 'Bağlantı hatası' };
        }
    }

    async function verifyEmail(token: string) {
        try {
            const res = await fetch(`${API_URL}/index.php?action=enduser_verify_email&token=${encodeURIComponent(token)}`);
            const data = await res.json();
            return data;
        } catch {
            return { success: false, error: 'Bağlantı hatası' };
        }
    }

    async function resendVerification(email: string) {
        try {
            const res = await fetch(`${API_URL}/index.php?action=enduser_resend_verification`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await res.json();
            return data;
        } catch {
            return { success: false, error: 'Bağlantı hatası' };
        }
    }

    function logout() {
        const token = localStorage.getItem('enduser_token');
        if (token) {
            fetch(`${API_URL}/index.php?action=enduser_logout`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
        }
        localStorage.removeItem('enduser_token');
        setUser(null);
    }

    return (
        <EndUserAuthContext.Provider value={{
            user,
            loading,
            login,
            signup,
            logout,
            isAuthenticated: !!user,
            verifyEmail,
            resendVerification
        }}>
            {children}
        </EndUserAuthContext.Provider>
    );
}

export function useEndUserAuth() {
    const context = useContext(EndUserAuthContext);
    if (!context) {
        throw new Error('useEndUserAuth must be used within EndUserAuthProvider');
    }
    return context;
}
