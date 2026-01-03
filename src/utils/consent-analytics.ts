/**
 * Analytics utility with consent-aware loading
 * Ensures Google Analytics only loads if user has given consent
 */

const isDev = import.meta.env.DEV;

export const getConsentPreferences = () => {
    const cookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('cookie_consent='));

    if (!cookie) {
        return { essential: true, analytics: false, marketing: false };
    }

    try {
        return JSON.parse(decodeURIComponent(cookie.split('=')[1]));
    } catch {
        return { essential: true, analytics: false, marketing: false };
    }
};

/**
 * Load Google Analytics script if consent is given
 */
export const loadGoogleAnalytics = () => {
    const GA_ID = import.meta.env.VITE_GA_ID;
    if (!GA_ID) {
        isDev && console.log('[Analytics] No GA_ID configured');
        return;
    }

    // Check consent
    const consent = getConsentPreferences();
    if (!consent.analytics) {
        isDev && console.log('[Analytics] Analytics blocked by user consent');
        return;
    }

    // Check if already loaded
    if (window.dataLayer && window.dataLayer.length > 0) {
        isDev && console.log('[Analytics] Already loaded');
        return;
    }

    isDev && console.log('[Analytics] Loading Google Analytics...');

    // Load GA script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
        window.dataLayer!.push(args);
    }
    (window as any).gtag = gtag;

    gtag('js', new Date());
    gtag('config', GA_ID, {
        anonymize_ip: true, // GDPR compliance
        cookie_flags: 'SameSite=None;Secure'
    });

    isDev && console.log('[Analytics] Google Analytics loaded successfully');
};

/**
 * Initialize analytics with consent check
 * Call this on app initialization
 */
export const initAnalytics = () => {
    // Try to load immediately if consent exists
    loadGoogleAnalytics();

    // Listen for consent updates
    window.addEventListener('consent-analytics-enabled', () => {
        isDev && console.log('[Analytics] Consent granted, loading analytics...');
        loadGoogleAnalytics();
    });
};

// Declare global types
declare global {
    interface Window {
        dataLayer?: any[];
        gtag?: (...args: any[]) => void;
    }
}

