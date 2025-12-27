import { useState, useEffect } from 'react';
import { X, Cookie, Shield, Settings } from 'lucide-react';

interface ConsentConfig {
    show_banner: boolean;
    language: string;
    region: string;
    country: string;
    is_eu: boolean;
    banner_text: {
        title: string;
        description: string;
        accept_button: string;
        reject_button: string;
        manage_button: string;
    };
    legal_links: {
        privacy_policy_key?: string;
        cookie_policy_key?: string;
        terms_key?: string;
    };
}

interface ConsentPreferences {
    essential: boolean;
    analytics: boolean;
    marketing: boolean;
}

export const CookieConsentBanner = () => {
    const [visible, setVisible] = useState(false);
    const [config, setConfig] = useState<ConsentConfig | null>(null);
    const [loading, setLoading] = useState(true);
    const [showPreferences, setShowPreferences] = useState(false);
    const [preferences, setPreferences] = useState<ConsentPreferences>({
        essential: true,
        analytics: false,
        marketing: false,
    });

    useEffect(() => {
        checkAndLoadConsent();
    }, []);

    const checkAndLoadConsent = async () => {
        // Check if consent cookie exists
        const consentCookie = document.cookie
            .split('; ')
            .find(row => row.startsWith('cookie_consent='));

        if (consentCookie) {
            setLoading(false);
            // User has already consented, load their preferences
            try {
                const prefs = JSON.parse(decodeURIComponent(consentCookie.split('=')[1]));
                if (prefs.analytics) {
                    loadAnalytics();
                }
            } catch (e) {
                console.error('Failed to parse consent cookie:', e);
            }
            return;
        }

        // Fetch consent config from API
        try {
            const API_URL = import.meta.env.VITE_API_URL || '/api';
            const response = await fetch(`${API_URL}/index.php?action=get_consent_config`);
            const result = await response.json();

            if (result.success && result.data.show_banner) {
                setConfig(result.data);
                setVisible(true);
            }
        } catch (error) {
            console.error('Failed to load consent config:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = async () => {
        await saveConsent({
            essential: true,
            analytics: true,
            marketing: true,
        });
        setVisible(false);
    };

    const handleReject = async () => {
        await saveConsent({
            essential: true,
            analytics: false,
            marketing: false,
        });
        setVisible(false);
    };

    const handleSavePreferences = async () => {
        await saveConsent(preferences);
        setShowPreferences(false);
        setVisible(false);
    };

    const saveConsent = async (consent_details: ConsentPreferences) => {
        try {
            const API_URL = import.meta.env.VITE_API_URL || '/api';
            await fetch(`${API_URL}/index.php?action=save_consent`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ consent_details }),
            });

            // Set local cookie (1 year expiry)
            const expiry = new Date();
            expiry.setFullYear(expiry.getFullYear() + 1);
            document.cookie = `cookie_consent=${encodeURIComponent(JSON.stringify(consent_details))}; expires=${expiry.toUTCString()}; path=/; SameSite=Lax`;

            // Load analytics if accepted
            if (consent_details.analytics) {
                loadAnalytics();
            }
        } catch (error) {
            console.error('Failed to save consent:', error);
        }
    };

    const loadAnalytics = () => {
        // Dispatch event for analytics scripts to listen
        window.dispatchEvent(new CustomEvent('consent-analytics-enabled'));
    };

    if (loading || !visible || !config) return null;

    const { banner_text, legal_links } = config;

    if (showPreferences) {
        // Preferences Modal
        return (
            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 md:p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                            <Settings className="text-blue-600" />
                            {banner_text.manage_button}
                        </h3>
                        <button
                            onClick={() => setShowPreferences(false)}
                            className="text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <div className="space-y-4">
                        {/* Essential Cookies */}
                        <div className="flex items-start justify-between p-4 bg-slate-50 rounded-lg">
                            <div className="flex-1">
                                <h4 className="font-semibold text-slate-900 mb-1">
                                    {config.language === 'tr' ? 'Gerekli Çerezler' : config.language === 'zh' ? '必要Cookie' : 'Essential Cookies'}
                                </h4>
                                <p className="text-sm text-slate-600">
                                    {config.language === 'tr'
                                        ? 'Sitenin çalışması için gereklidir.'
                                        : config.language === 'zh'
                                            ? '网站运行所必需。'
                                            : 'Required for the site to function.'}
                                </p>
                            </div>
                            <div className="ml-4">
                                <input
                                    type="checkbox"
                                    checked={preferences.essential}
                                    disabled
                                    className="w-5 h-5 rounded border-slate-300"
                                />
                            </div>
                        </div>

                        {/* Analytics Cookies */}
                        <div className="flex items-start justify-between p-4 bg-slate-50 rounded-lg">
                            <div className="flex-1">
                                <h4 className="font-semibold text-slate-900 mb-1">
                                    {config.language === 'tr' ? 'Analitik Çerezler' : config.language === 'zh' ? '分析Cookie' : 'Analytics Cookies'}
                                </h4>
                                <p className="text-sm text-slate-600">
                                    {config.language === 'tr'
                                        ? 'Site kullanımını analiz etmek için.'
                                        : config.language === 'zh'
                                            ? '用于分析网站使用情况。'
                                            : 'Used to analyze site usage.'}
                                </p>
                            </div>
                            <div className="ml-4">
                                <input
                                    type="checkbox"
                                    checked={preferences.analytics}
                                    onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                                    className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Marketing Cookies */}
                        <div className="flex items-start justify-between p-4 bg-slate-50 rounded-lg">
                            <div className="flex-1">
                                <h4 className="font-semibold text-slate-900 mb-1">
                                    {config.language === 'tr' ? 'Pazarlama Çerezleri' : config.language === 'zh' ? '营销Cookie' : 'Marketing Cookies'}
                                </h4>
                                <p className="text-sm text-slate-600">
                                    {config.language === 'tr'
                                        ? 'Kişiselleştirilmiş reklamlar için.'
                                        : config.language === 'zh'
                                            ? '用于个性化广告。'
                                            : 'For personalized advertising.'}
                                </p>
                            </div>
                            <div className="ml-4">
                                <input
                                    type="checkbox"
                                    checked={preferences.marketing}
                                    onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                                    className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex gap-3">
                        <button
                            onClick={() => setShowPreferences(false)}
                            className="flex-1 px-4 py-3 border-2 border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors"
                        >
                            {config.language === 'tr' ? 'İptal' : config.language === 'zh' ? '取消' : 'Cancel'}
                        </button>
                        <button
                            onClick={handleSavePreferences}
                            className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg hover:shadow-lg transition-all"
                        >
                            {config.language === 'tr' ? 'Kaydet' : config.language === 'zh' ? '保存' : 'Save'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-slate-200 shadow-2xl animate-in slide-in-from-bottom duration-500">
            <div className="max-w-7xl mx-auto p-4 md:p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                    {/* Icon */}
                    <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                            <Cookie className="text-white" size={24} />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-slate-900 mb-1">
                            {banner_text.title}
                        </h3>
                        <p className="text-sm text-slate-600 mb-2">
                            {banner_text.description}
                        </p>
                        <div className="flex flex-wrap gap-2 text-xs">
                            {legal_links.cookie_policy_key && (
                                <a
                                    href={legal_links.cookie_policy_key}
                                    className="text-blue-600 hover:underline font-medium inline-flex items-center gap-1"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Shield size={12} />
                                    {config.language === 'tr' ? 'Çerez Politikası' : config.language === 'zh' ? 'Cookie政策' : 'Cookie Policy'}
                                </a>
                            )}
                            {legal_links.privacy_policy_key && (
                                <a
                                    href={legal_links.privacy_policy_key}
                                    className="text-blue-600 hover:underline font-medium"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {config.language === 'tr' ? 'Gizlilik Politikası' : config.language === 'zh' ? '隐私政策' : 'Privacy Policy'}
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto sm:flex-shrink-0">
                        <button
                            onClick={() => setShowPreferences(true)}
                            className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 font-medium transition-colors"
                        >
                            {banner_text.manage_button}
                        </button>
                        <button
                            onClick={handleReject}
                            className="px-6 py-2.5 border-2 border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors"
                        >
                            {banner_text.reject_button}
                        </button>
                        <button
                            onClick={handleAccept}
                            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg hover:shadow-lg transition-all"
                        >
                            {banner_text.accept_button}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
