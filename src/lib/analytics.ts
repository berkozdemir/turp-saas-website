/**
 * Google Analytics 4 Integration (Simplified for SPA without React Router)
 */

import { useEffect } from 'react';

declare global {
    interface Window {
        gtag?: (...args: any[]) => void;
        dataLayer?: any[];
    }
}

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

// Initialize Google Analytics
export const initGA = () => {
    if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID === 'G-XXXXXXXXXX') {
        console.warn('⚠️  Google Analytics ID bulunamadı. .env dosyasına VITE_GA_MEASUREMENT_ID ekleyin.');
        return;
    }

    // Create gtag script
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script1);

    // Initialize dataLayer
    const script2 = document.createElement('script');
    script2.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${GA_MEASUREMENT_ID}', {
      anonymize_ip: true,
      cookie_flags: 'SameSite=None;Secure'
    });
  `;
    document.head.appendChild(script2);

    console.log('✅ Google Analytics initialized:', GA_MEASUREMENT_ID);
};

// Track page view
export const trackPageView = (pageName: string, title?: string) => {
    if (!window.gtag) return;

    window.gtag('event', 'page_view', {
        page_title: title || pageName,
        page_location: window.location.href,
        page_path: window.location.pathname
    });
};

// Track custom events
export const trackEvent = (eventName: string, params?: Record<string, any>) => {
    if (!window.gtag) return;
    window.gtag('event', eventName, params);
};

// Track button clicks
export const trackButtonClick = (buttonName: string) => {
    trackEvent('button_click', { button_name: buttonName });
};

// Track form submissions
export const trackFormSubmit = (formName: string, success: boolean = true) => {
    trackEvent('form_submit', { form_name: formName, success });
};

// Track language changes
export const trackLanguageChange = (fromLang: string, toLang: string) => {
    trackEvent('language_change', { from_language: fromLang, to_language: toLang });
};

// Track blog post views
export const trackBlogView = (postTitle: string, postId?: number) => {
    trackEvent('blog_view', { post_title: postTitle, post_id: postId });
};

// Analytics Hook
export const useAnalytics = () => {
    useEffect(() => {
        initGA();
    }, []);
};

export default useAnalytics;
