import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

interface BrandingColors {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    textPrimary: string;
    textMuted: string;
}

interface BrandingTypography {
    fontBase: string;
    fontHeading: string;
    borderRadius: string;
}

interface BrandingSocial {
    instagram?: string;
    facebook?: string;
    linkedin?: string;
    twitter?: string;
    youtube?: string;
    tiktok?: string;
    whatsapp?: string;
}

interface BrandingData {
    logo: {
        light: string | null;
        dark: string | null;
    };
    favicon: string | null;
    colors: BrandingColors;
    typography: BrandingTypography;
    social: BrandingSocial;
}

const defaultBranding: BrandingData = {
    logo: { light: null, dark: null },
    favicon: null,
    colors: {
        primary: '#6366f1',
        secondary: '#8b5cf6',
        accent: '#10b981',
        background: '#ffffff',
        textPrimary: '#1f2937',
        textMuted: '#6b7280'
    },
    typography: {
        fontBase: 'Inter',
        fontHeading: 'Inter',
        borderRadius: '0.5rem'
    },
    social: {}
};

interface BrandingContextType {
    branding: BrandingData;
    loading: boolean;
    error: string | null;
}

const BrandingContext = createContext<BrandingContextType>({
    branding: defaultBranding,
    loading: true,
    error: null
});

export const useBranding = () => useContext(BrandingContext);

interface BrandingProviderProps {
    children: ReactNode;
}

export const BrandingProvider = ({ children }: BrandingProviderProps) => {
    const [branding, setBranding] = useState<BrandingData>(defaultBranding);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBranding = async () => {
            try {
                const API_URL = import.meta.env.VITE_API_URL || '/api';
                const res = await fetch(`${API_URL}/index.php?action=get_public_branding`);
                const data = await res.json();

                if (data.success && data.data) {
                    setBranding({ ...defaultBranding, ...data.data });
                    applyBrandingToDOM(data.data);
                }
            } catch (err) {
                console.error('Failed to load branding:', err);
                setError('Failed to load branding');
            } finally {
                setLoading(false);
            }
        };

        fetchBranding();
    }, []);

    return (
        <BrandingContext.Provider value={{ branding, loading, error }}>
            {children}
        </BrandingContext.Provider>
    );
};

/**
 * Apply branding to DOM via CSS variables and favicon
 */
function applyBrandingToDOM(branding: BrandingData) {
    const root = document.documentElement;

    // Colors
    if (branding.colors) {
        root.style.setProperty('--color-primary', branding.colors.primary);
        root.style.setProperty('--color-secondary', branding.colors.secondary);
        root.style.setProperty('--color-accent', branding.colors.accent);
        root.style.setProperty('--color-background', branding.colors.background);
        root.style.setProperty('--color-text-primary', branding.colors.textPrimary);
        root.style.setProperty('--color-text-muted', branding.colors.textMuted);
    }

    // Typography
    if (branding.typography) {
        root.style.setProperty('--font-base', branding.typography.fontBase);
        root.style.setProperty('--font-heading', branding.typography.fontHeading);
        root.style.setProperty('--border-radius', branding.typography.borderRadius);
    }

    // Favicon
    if (branding.favicon) {
        let link = document.querySelector<HTMLLinkElement>("link[rel~='icon']");
        if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
        }
        link.href = branding.favicon;
    }
}

export default useBranding;
