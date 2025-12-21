import { useState, useEffect } from "react";
import { Save, Loader2, BarChart3, Search, Globe, AlertTriangle, CheckCircle } from "lucide-react";

interface AdminAnalyticsSeoProps {
    token: string;
}

interface AnalyticsSettings {
    ga_measurement_id: string;
    gtm_id: string;
    extra_head_html: string;
    extra_body_html: string;
}

interface GlobalSeoSettings {
    site_name: string;
    default_title: string;
    default_description: string;
    default_og_image: string;
    default_language: string;
}

export const AdminAnalyticsSeo = ({ token }: AdminAnalyticsSeoProps) => {
    const [activeTab, setActiveTab] = useState<'analytics' | 'seo'>('analytics');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Analytics state
    const [analytics, setAnalytics] = useState<AnalyticsSettings>({
        ga_measurement_id: '',
        gtm_id: '',
        extra_head_html: '',
        extra_body_html: ''
    });

    // SEO state
    const [seo, setSeo] = useState<GlobalSeoSettings>({
        site_name: 'TURP Clinical Trials',
        default_title: 'TURP - Klinik Araştırma Platformu',
        default_description: 'e-Nabız entegrasyonu ile klinik araştırmalarda veri toplama platformu',
        default_og_image: '',
        default_language: 'tr'
    });

    const API_URL = import.meta.env.VITE_API_URL || "/api";

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await fetch(`${API_URL}/index.php?action=get_settings`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await response.json();

                if (data.success && data.data) {
                    if (data.data.analytics) {
                        try {
                            const parsed = JSON.parse(data.data.analytics);
                            setAnalytics(prev => ({ ...prev, ...parsed }));
                        } catch (e) { }
                    }
                    if (data.data.global_seo) {
                        try {
                            const parsed = JSON.parse(data.data.global_seo);
                            setSeo(prev => ({ ...prev, ...parsed }));
                        } catch (e) { }
                    }
                }
            } catch (err) {
                console.error("Settings fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, [token, API_URL]);

    const handleSaveAnalytics = async () => {
        setSaving(true);
        setMessage(null);

        try {
            const response = await fetch(`${API_URL}/index.php?action=update_settings`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ analytics: JSON.stringify(analytics) })
            });
            const data = await response.json();

            if (data.success) {
                setMessage({ type: 'success', text: 'Analytics ayarları kaydedildi.' });
            } else {
                setMessage({ type: 'error', text: data.error || 'Kaydetme başarısız' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Bağlantı hatası' });
        } finally {
            setSaving(false);
        }
    };

    const handleSaveSeo = async () => {
        setSaving(true);
        setMessage(null);

        try {
            const response = await fetch(`${API_URL}/index.php?action=update_settings`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ global_seo: JSON.stringify(seo) })
            });
            const data = await response.json();

            if (data.success) {
                setMessage({ type: 'success', text: 'SEO ayarları kaydedildi.' });
            } else {
                setMessage({ type: 'error', text: data.error || 'Kaydetme başarısız' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Bağlantı hatası' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
                <Loader2 className="animate-spin mx-auto mb-2 text-slate-400" size={32} />
                <p className="text-slate-500">Ayarlar yükleniyor...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Tabs */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="flex border-b border-slate-200">
                    <button
                        onClick={() => setActiveTab('analytics')}
                        className={`flex-1 px-6 py-4 text-center font-medium transition-colors flex items-center justify-center gap-2 ${activeTab === 'analytics'
                                ? 'bg-rose-50 text-rose-700 border-b-2 border-rose-500'
                                : 'text-slate-500 hover:bg-slate-50'
                            }`}
                    >
                        <BarChart3 size={20} />
                        Analytics
                    </button>
                    <button
                        onClick={() => setActiveTab('seo')}
                        className={`flex-1 px-6 py-4 text-center font-medium transition-colors flex items-center justify-center gap-2 ${activeTab === 'seo'
                                ? 'bg-rose-50 text-rose-700 border-b-2 border-rose-500'
                                : 'text-slate-500 hover:bg-slate-50'
                            }`}
                    >
                        <Search size={20} />
                        SEO
                    </button>
                </div>

                {/* Message */}
                {message && (
                    <div className={`mx-6 mt-6 p-4 rounded-xl flex items-center gap-2 ${message.type === 'success'
                            ? 'bg-green-50 text-green-700 border border-green-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                        {message.type === 'success' ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
                        {message.text}
                    </div>
                )}

                {/* Analytics Tab */}
                {activeTab === 'analytics' && (
                    <div className="p-6 space-y-6">
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
                            <AlertTriangle className="text-amber-600 flex-shrink-0" size={20} />
                            <div className="text-sm text-amber-800">
                                <strong>Uyarı:</strong> Sadece güvenilir kaynaklardan script ekleyin.
                                Yanlış kod site güvenliğini tehlikeye atabilir. KVKK/GDPR uyumluluğuna dikkat edin.
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Google Analytics Measurement ID
                            </label>
                            <input
                                type="text"
                                className="w-full p-3 border border-slate-200 rounded-xl focus:border-rose-500 outline-none"
                                value={analytics.ga_measurement_id}
                                onChange={e => setAnalytics({ ...analytics, ga_measurement_id: e.target.value })}
                                placeholder="G-XXXXXXXXXX"
                            />
                            <p className="text-xs text-slate-400 mt-1">Google Analytics 4 ölçüm kimliği. Örn: G-ABC123XYZ</p>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Google Tag Manager ID (Opsiyonel)
                            </label>
                            <input
                                type="text"
                                className="w-full p-3 border border-slate-200 rounded-xl focus:border-rose-500 outline-none"
                                value={analytics.gtm_id}
                                onChange={e => setAnalytics({ ...analytics, gtm_id: e.target.value })}
                                placeholder="GTM-XXXXXXX"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Ek Head HTML (Opsiyonel)
                            </label>
                            <textarea
                                className="w-full p-3 border border-slate-200 rounded-xl focus:border-rose-500 outline-none font-mono text-sm h-24"
                                value={analytics.extra_head_html}
                                onChange={e => setAnalytics({ ...analytics, extra_head_html: e.target.value })}
                                placeholder="<!-- Meta pikseller, chat widget'ları vb. -->"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Ek Body Sonu HTML (Opsiyonel)
                            </label>
                            <textarea
                                className="w-full p-3 border border-slate-200 rounded-xl focus:border-rose-500 outline-none font-mono text-sm h-24"
                                value={analytics.extra_body_html}
                                onChange={e => setAnalytics({ ...analytics, extra_body_html: e.target.value })}
                                placeholder="<!-- Body sonuna eklenecek scriptler -->"
                            />
                        </div>

                        <button
                            onClick={handleSaveAnalytics}
                            disabled={saving}
                            className="px-6 py-3 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                            {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                            {saving ? 'Kaydediliyor...' : 'Analytics Ayarlarını Kaydet'}
                        </button>
                    </div>
                )}

                {/* SEO Tab */}
                {activeTab === 'seo' && (
                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">
                                    Site Adı
                                </label>
                                <input
                                    type="text"
                                    className="w-full p-3 border border-slate-200 rounded-xl focus:border-rose-500 outline-none"
                                    value={seo.site_name}
                                    onChange={e => setSeo({ ...seo, site_name: e.target.value })}
                                    placeholder="TURP Clinical Trials"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                                    <Globe size={14} /> Varsayılan Dil
                                </label>
                                <select
                                    className="w-full p-3 border border-slate-200 rounded-xl focus:border-rose-500 outline-none bg-white"
                                    value={seo.default_language}
                                    onChange={e => setSeo({ ...seo, default_language: e.target.value })}
                                >
                                    <option value="tr">Türkçe</option>
                                    <option value="en">English</option>
                                    <option value="zh">中文</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Varsayılan Sayfa Başlığı
                            </label>
                            <input
                                type="text"
                                className="w-full p-3 border border-slate-200 rounded-xl focus:border-rose-500 outline-none"
                                value={seo.default_title}
                                onChange={e => setSeo({ ...seo, default_title: e.target.value })}
                                placeholder="TURP - Klinik Araştırma Platformu"
                            />
                            <p className="text-xs text-slate-400 mt-1">{seo.default_title.length}/60 karakter (önerilen: 50-60)</p>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Varsayılan Meta Açıklama
                            </label>
                            <textarea
                                className="w-full p-3 border border-slate-200 rounded-xl focus:border-rose-500 outline-none h-24"
                                value={seo.default_description}
                                onChange={e => setSeo({ ...seo, default_description: e.target.value })}
                                placeholder="Site açıklaması..."
                            />
                            <p className="text-xs text-slate-400 mt-1">{seo.default_description.length}/160 karakter (önerilen: 150-160)</p>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Varsayılan OG Image URL
                            </label>
                            <input
                                type="url"
                                className="w-full p-3 border border-slate-200 rounded-xl focus:border-rose-500 outline-none"
                                value={seo.default_og_image}
                                onChange={e => setSeo({ ...seo, default_og_image: e.target.value })}
                                placeholder="https://ct.turp.health/og-image.jpg"
                            />
                            <p className="text-xs text-slate-400 mt-1">Sosyal medya paylaşımlarında görünecek görsel (1200x630px önerilir)</p>
                        </div>

                        <button
                            onClick={handleSaveSeo}
                            disabled={saving}
                            className="px-6 py-3 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                            {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                            {saving ? 'Kaydediliyor...' : 'SEO Ayarlarını Kaydet'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
