import { useState, useEffect } from 'react';
import {
    Palette, Type, Share2, Image, Save, RotateCcw,
    Instagram, Facebook, Linkedin, Twitter, Youtube, MessageCircle
} from 'lucide-react';
import { fetchAPI } from '../../lib/contentApi';

interface BrandingConfig {
    logo_light_url: string | null;
    logo_dark_url: string | null;
    favicon_url: string | null;
    primary_color: string;
    secondary_color: string;
    accent_color: string;
    background_color: string;
    text_color_primary: string;
    text_color_muted: string;
    font_family_base: string;
    font_family_heading: string;
    border_radius: string;
    instagram_url: string | null;
    facebook_url: string | null;
    linkedin_url: string | null;
    x_twitter_url: string | null;
    youtube_url: string | null;
    tiktok_url: string | null;
    whatsapp_url: string | null;
}

const defaultBranding: BrandingConfig = {
    logo_light_url: null,
    logo_dark_url: null,
    favicon_url: null,
    primary_color: '#6366f1',
    secondary_color: '#8b5cf6',
    accent_color: '#10b981',
    background_color: '#ffffff',
    text_color_primary: '#1f2937',
    text_color_muted: '#6b7280',
    font_family_base: 'Inter',
    font_family_heading: 'Inter',
    border_radius: '0.5rem',
    instagram_url: null,
    facebook_url: null,
    linkedin_url: null,
    x_twitter_url: null,
    youtube_url: null,
    tiktok_url: null,
    whatsapp_url: null
};

const fontOptions = [
    'Inter', 'Roboto', 'Nunito', 'Open Sans', 'Poppins',
    'Lato', 'Montserrat', 'Source Sans Pro', 'Raleway', 'Ubuntu'
];

const presets = {
    clinical: {
        primary_color: '#1e3a5f',
        secondary_color: '#4a6fa5',
        accent_color: '#e63946',
        background_color: '#f8fafc',
        text_color_primary: '#1e293b',
        text_color_muted: '#64748b'
    },
    modern: {
        primary_color: '#6366f1',
        secondary_color: '#8b5cf6',
        accent_color: '#10b981',
        background_color: '#ffffff',
        text_color_primary: '#1f2937',
        text_color_muted: '#6b7280'
    },
    omega: {
        primary_color: '#1a365d',
        secondary_color: '#2d4a6f',
        accent_color: '#dc2626',
        background_color: '#f7f8fa',
        text_color_primary: '#0f172a',
        text_color_muted: '#64748b'
    }
};

export const AdminBrandingSettings = () => {
    const [config, setConfig] = useState<BrandingConfig>(defaultBranding);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        loadBranding();
    }, []);

    const loadBranding = async () => {
        try {
            const res = await fetchAPI('get_branding');
            if (res.success && res.data) {
                setConfig({ ...defaultBranding, ...res.data });
            }
        } catch (err) {
            console.error('Failed to load branding:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage(null);
        try {
            const res = await fetchAPI('save_branding', {
                method: 'POST',
                body: JSON.stringify(config)
            });
            if (res.success) {
                setMessage({ type: 'success', text: 'Branding ayarları kaydedildi!' });
            } else {
                setMessage({ type: 'error', text: res.error || 'Kaydetme başarısız' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Bağlantı hatası' });
        } finally {
            setSaving(false);
        }
    };

    const applyPreset = (preset: keyof typeof presets) => {
        setConfig({ ...config, ...presets[preset] });
    };

    const updateField = (field: keyof BrandingConfig, value: string | null) => {
        setConfig({ ...config, [field]: value });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Branding & Social</h1>
                    <p className="text-slate-500">Logo, renkler, fontlar ve sosyal medya ayarları</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setConfig(defaultBranding)}
                        className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                        <RotateCcw size={16} /> Sıfırla
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2 disabled:opacity-50"
                    >
                        <Save size={16} /> {saving ? 'Kaydediliyor...' : 'Kaydet'}
                    </button>
                </div>
            </div>

            {message && (
                <div className={`mb-4 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Form */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Logo & Favicon */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                            <Image size={20} /> Logo & Favicon
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Logo (Açık Arkaplan)</label>
                                <input
                                    type="text"
                                    value={config.logo_light_url || ''}
                                    onChange={(e) => updateField('logo_light_url', e.target.value || null)}
                                    placeholder="/media/logo.png"
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                {config.logo_light_url && (
                                    <img src={config.logo_light_url} alt="Logo" className="mt-2 h-10 object-contain" />
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Logo (Koyu Arkaplan)</label>
                                <input
                                    type="text"
                                    value={config.logo_dark_url || ''}
                                    onChange={(e) => updateField('logo_dark_url', e.target.value || null)}
                                    placeholder="/media/logo-dark.png"
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Favicon</label>
                                <input
                                    type="text"
                                    value={config.favicon_url || ''}
                                    onChange={(e) => updateField('favicon_url', e.target.value || null)}
                                    placeholder="/media/favicon.ico"
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Colors */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                            <Palette size={20} /> Renkler
                        </h2>
                        <div className="flex flex-wrap gap-2 mb-4">
                            <button onClick={() => applyPreset('clinical')} className="px-3 py-1 text-sm bg-slate-100 rounded-full hover:bg-slate-200">
                                Klinik Preset
                            </button>
                            <button onClick={() => applyPreset('modern')} className="px-3 py-1 text-sm bg-slate-100 rounded-full hover:bg-slate-200">
                                Modern Preset
                            </button>
                            <button onClick={() => applyPreset('omega')} className="px-3 py-1 text-sm bg-slate-100 rounded-full hover:bg-slate-200">
                                Omega Genetik Preset
                            </button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {[
                                { key: 'primary_color', label: 'Ana Renk' },
                                { key: 'secondary_color', label: 'İkincil Renk' },
                                { key: 'accent_color', label: 'Vurgu Rengi' },
                                { key: 'background_color', label: 'Arkaplan' },
                                { key: 'text_color_primary', label: 'Metin (Ana)' },
                                { key: 'text_color_muted', label: 'Metin (Soluk)' }
                            ].map((item) => (
                                <div key={item.key}>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">{item.label}</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="color"
                                            value={config[item.key as keyof BrandingConfig] as string}
                                            onChange={(e) => updateField(item.key as keyof BrandingConfig, e.target.value)}
                                            className="w-10 h-10 rounded border border-slate-300 cursor-pointer"
                                        />
                                        <input
                                            type="text"
                                            value={config[item.key as keyof BrandingConfig] as string}
                                            onChange={(e) => updateField(item.key as keyof BrandingConfig, e.target.value)}
                                            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Typography */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                            <Type size={20} /> Tipografi
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Ana Font</label>
                                <select
                                    value={config.font_family_base}
                                    onChange={(e) => updateField('font_family_base', e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                >
                                    {fontOptions.map((f) => (
                                        <option key={f} value={f}>{f}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Başlık Fontu</label>
                                <select
                                    value={config.font_family_heading}
                                    onChange={(e) => updateField('font_family_heading', e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                >
                                    {fontOptions.map((f) => (
                                        <option key={f} value={f}>{f}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Border Radius</label>
                                <input
                                    type="text"
                                    value={config.border_radius}
                                    onChange={(e) => updateField('border_radius', e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                                    placeholder="0.5rem"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Social Links */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                            <Share2 size={20} /> Sosyal Medya
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { key: 'instagram_url', label: 'Instagram', icon: Instagram },
                                { key: 'facebook_url', label: 'Facebook', icon: Facebook },
                                { key: 'linkedin_url', label: 'LinkedIn', icon: Linkedin },
                                { key: 'x_twitter_url', label: 'X (Twitter)', icon: Twitter },
                                { key: 'youtube_url', label: 'YouTube', icon: Youtube },
                                { key: 'whatsapp_url', label: 'WhatsApp', icon: MessageCircle }
                            ].map((item) => (
                                <div key={item.key}>
                                    <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                                        <item.icon size={16} /> {item.label}
                                    </label>
                                    <input
                                        type="url"
                                        value={config[item.key as keyof BrandingConfig] as string || ''}
                                        onChange={(e) => updateField(item.key as keyof BrandingConfig, e.target.value || null)}
                                        placeholder={`https://${item.label.toLowerCase()}.com/...`}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column - Preview */}
                <div className="lg:col-span-1">
                    <div className="sticky top-6">
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="p-4 border-b border-slate-200">
                                <h3 className="font-semibold text-slate-900">Canlı Önizleme</h3>
                            </div>

                            {/* Mini Header Preview */}
                            <div
                                className="p-4"
                                style={{ backgroundColor: config.primary_color }}
                            >
                                <div className="flex items-center justify-between">
                                    {config.logo_light_url ? (
                                        <img src={config.logo_light_url} alt="Logo" className="h-6 brightness-0 invert" />
                                    ) : (
                                        <div className="text-white font-bold" style={{ fontFamily: config.font_family_heading }}>
                                            Logo
                                        </div>
                                    )}
                                    <div className="flex gap-2">
                                        <div className="w-12 h-2 bg-white/30 rounded"></div>
                                        <div className="w-12 h-2 bg-white/30 rounded"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Mini Hero Preview */}
                            <div
                                className="p-6"
                                style={{ backgroundColor: config.background_color }}
                            >
                                <h4
                                    className="text-lg font-bold mb-2"
                                    style={{ color: config.text_color_primary, fontFamily: config.font_family_heading }}
                                >
                                    Örnek Başlık
                                </h4>
                                <p
                                    className="text-sm mb-4"
                                    style={{ color: config.text_color_muted, fontFamily: config.font_family_base }}
                                >
                                    Bu bir örnek açıklama metnidir.
                                </p>
                                <button
                                    className="px-4 py-2 text-white text-sm font-medium"
                                    style={{
                                        backgroundColor: config.accent_color,
                                        borderRadius: config.border_radius
                                    }}
                                >
                                    Buton
                                </button>
                            </div>

                            {/* Mini Footer Preview */}
                            <div
                                className="p-4"
                                style={{ backgroundColor: config.primary_color }}
                            >
                                <div className="flex justify-center gap-3">
                                    {config.instagram_url && <Instagram size={16} className="text-white/80" />}
                                    {config.facebook_url && <Facebook size={16} className="text-white/80" />}
                                    {config.linkedin_url && <Linkedin size={16} className="text-white/80" />}
                                    {config.x_twitter_url && <Twitter size={16} className="text-white/80" />}
                                    {!config.instagram_url && !config.facebook_url && !config.linkedin_url && !config.x_twitter_url && (
                                        <span className="text-white/50 text-xs">Sosyal linkler ekleyin</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminBrandingSettings;
