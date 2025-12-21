import { useState, useEffect } from "react";
import { ArrowLeft, Save, Sparkles, RotateCcw, FolderOpen } from "lucide-react";
import { MediaPickerDialog } from "../../components/MediaPickerDialog";

interface LandingConfig {
    id?: number;
    language: string;
    hero_title: string; // Legacy
    hero_title_line1: string;
    hero_title_line2: string;
    hero_subtitle: string;
    hero_badge: string;
    primary_cta_label: string;
    primary_cta_url: string;
    secondary_cta_label: string;
    secondary_cta_url: string;
    hero_image_url: string;
    background_style: string;
    is_active: boolean;
    // Line 1 styling
    hero_line1_use_gradient_text: boolean;
    hero_line1_solid_color: string;
    hero_line1_gradient_from: string;
    hero_line1_gradient_to: string;
    hero_line1_gradient_angle: number;
    // Line 2 styling
    hero_line2_use_gradient_text: boolean;
    hero_line2_solid_color: string;
    hero_line2_gradient_from: string;
    hero_line2_gradient_to: string;
    hero_line2_gradient_angle: number;
    // Gradient background fields
    hero_use_gradient_background: boolean;
    hero_gradient_bg_from: string;
    hero_gradient_bg_to: string;
    hero_gradient_bg_angle: number;
}

interface AdminLandingEditorProps {
    editId: number | null;
    onBack: () => void;
}

const defaultConfig: LandingConfig = {
    language: "tr",
    hero_title: "",
    hero_title_line1: "",
    hero_title_line2: "",
    hero_subtitle: "",
    hero_badge: "",
    primary_cta_label: "",
    primary_cta_url: "",
    secondary_cta_label: "",
    secondary_cta_url: "",
    hero_image_url: "",
    background_style: "default",
    is_active: true,
    // Line 1 defaults (solid white)
    hero_line1_use_gradient_text: false,
    hero_line1_solid_color: "#FFFFFF",
    hero_line1_gradient_from: "#4F46E5",
    hero_line1_gradient_to: "#22C55E",
    hero_line1_gradient_angle: 90,
    // Line 2 defaults (gradient)
    hero_line2_use_gradient_text: true,
    hero_line2_solid_color: "#EC4899",
    hero_line2_gradient_from: "#EC4899",
    hero_line2_gradient_to: "#8B5CF6",
    hero_line2_gradient_angle: 90,
    // Gradient background defaults
    hero_use_gradient_background: false,
    hero_gradient_bg_from: "#1E293B",
    hero_gradient_bg_to: "#0F172A",
    hero_gradient_bg_angle: 180,
};


export const AdminLandingEditor = ({ editId, onBack }: AdminLandingEditorProps) => {
    const [config, setConfig] = useState<LandingConfig>(defaultConfig);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [aiLoading, setAiLoading] = useState(false);
    const [showMediaPicker, setShowMediaPicker] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL || "/api";

    useEffect(() => {
        if (editId) {
            fetchConfig();
        }
    }, [editId]);

    const fetchConfig = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("admin_token");
            const response = await fetch(
                `${API_URL}/index.php?action=get_landing_config_detail&id=${editId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const data = await response.json();
            if (data.success && data.data) {
                setConfig({
                    ...defaultConfig,
                    ...data.data,
                    is_active: Boolean(data.data.is_active),
                    hero_use_gradient_text: Boolean(data.data.hero_use_gradient_text),
                    hero_use_gradient_background: Boolean(data.data.hero_use_gradient_background),
                });
            }
        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!config.hero_title.trim()) {
            alert("Hero başlığı zorunludur.");
            return;
        }

        setSaving(true);
        try {
            const token = localStorage.getItem("admin_token");
            const response = await fetch(`${API_URL}/index.php?action=save_landing_config`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ...config,
                    id: editId,
                }),
            });
            const data = await response.json();
            if (data.success) {
                onBack();
            } else {
                alert(data.error || "Kayıt başarısız");
            }
        } catch (err) {
            console.error("Save error:", err);
            alert("Bir hata oluştu");
        } finally {
            setSaving(false);
        }
    };

    const handleAISuggest = async () => {
        const description = prompt("Markanızı veya ürününüzü kısaca tanımlayın:");
        if (!description) return;

        setAiLoading(true);
        try {
            const token = localStorage.getItem("admin_token");
            const response = await fetch(`${API_URL}/index.php?action=translate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    text: `Bu tanıma göre etkileyici bir hero başlığı ve alt başlık öner (JSON formatında title ve subtitle olarak döndür): ${description}`,
                    target_language: config.language === "en" ? "English" : config.language === "zh" ? "Chinese" : "Turkish",
                }),
            });
            const data = await response.json();
            if (data.translated_text) {
                try {
                    const parsed = JSON.parse(data.translated_text);
                    if (parsed.title) setConfig((prev) => ({ ...prev, hero_title: parsed.title }));
                    if (parsed.subtitle) setConfig((prev) => ({ ...prev, hero_subtitle: parsed.subtitle }));
                } catch {
                    // If not JSON, use as title
                    setConfig((prev) => ({ ...prev, hero_title: data.translated_text }));
                }
            }
        } catch (err) {
            console.error("AI error:", err);
        } finally {
            setAiLoading(false);
        }
    };

    const getBackgroundClass = () => {
        switch (config.background_style) {
            case "light": return "bg-slate-100";
            case "dark": return "bg-slate-900 text-white";
            case "gradient": return "bg-gradient-to-br from-rose-600 to-purple-700 text-white";
            default: return "bg-white";
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-slate-500">Yükleniyor...</div>;
    }

    return (
        <>
            <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onBack}
                            className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800">
                                {editId ? "Yapılandırmayı Düzenle" : "Yeni Yapılandırma"}
                            </h2>
                            <p className="text-slate-500">Hero bölümü ayarları</p>
                        </div>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors disabled:opacity-50"
                    >
                        <Save size={20} />
                        {saving ? "Kaydediliyor..." : "Kaydet"}
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Form */}
                    <div className="space-y-6">
                        {/* Language & Status */}
                        <div className="bg-white rounded-xl border border-slate-200 p-6">
                            <h3 className="font-semibold text-slate-800 mb-4">Genel Ayarlar</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-1">Dil</label>
                                    <select
                                        value={config.language}
                                        onChange={(e) => setConfig({ ...config, language: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                                    >
                                        <option value="tr">🇹🇷 Türkçe</option>
                                        <option value="en">🇬🇧 English</option>
                                        <option value="zh">🇨🇳 中文</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-1">Arka Plan</label>
                                    <select
                                        value={config.background_style}
                                        onChange={(e) => setConfig({ ...config, background_style: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                                    >
                                        <option value="default">Varsayılan</option>
                                        <option value="light">Açık</option>
                                        <option value="dark">Koyu</option>
                                        <option value="gradient">Gradient</option>
                                    </select>
                                </div>
                            </div>
                            <div className="mt-4">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={config.is_active}
                                        onChange={(e) => setConfig({ ...config, is_active: e.target.checked })}
                                        className="w-4 h-4 text-rose-500 rounded"
                                    />
                                    <span className="text-sm text-slate-600">Aktif (Bu dil için ana yapılandırma olarak kullan)</span>
                                </label>
                            </div>
                        </div>

                        {/* Hero Content */}
                        <div className="bg-white rounded-xl border border-slate-200 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-slate-800">Hero İçerik</h3>
                                <button
                                    onClick={handleAISuggest}
                                    disabled={aiLoading}
                                    className="flex items-center gap-1 px-3 py-1.5 text-sm text-purple-600 hover:bg-purple-50 rounded-lg transition-colors disabled:opacity-50"
                                >
                                    <Sparkles size={16} />
                                    {aiLoading ? "Düşünüyor..." : "AI Öner"}
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-1">Badge (Üst Etiket)</label>
                                    <input
                                        type="text"
                                        value={config.hero_badge}
                                        onChange={(e) => setConfig({ ...config, hero_badge: e.target.value })}
                                        placeholder="Örn: USBS Onaylı & e-Nabız Entegreli"
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-1">Başlık - Satır 1 *</label>
                                    <input
                                        type="text"
                                        value={config.hero_title_line1}
                                        onChange={(e) => setConfig({ ...config, hero_title_line1: e.target.value, hero_title: e.target.value })}
                                        placeholder="Ana başlık - birinci satır"
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-1">Başlık - Satır 2</label>
                                    <input
                                        type="text"
                                        value={config.hero_title_line2}
                                        onChange={(e) => setConfig({ ...config, hero_title_line2: e.target.value })}
                                        placeholder="Ana başlık - ikinci satır (opsiyonel)"
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-1">Alt Başlık</label>
                                    <textarea
                                        value={config.hero_subtitle}
                                        onChange={(e) => setConfig({ ...config, hero_subtitle: e.target.value })}
                                        placeholder="Açıklama metni"
                                        rows={3}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg resize-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-1">Hero Görsel URL</label>
                                    <input
                                        type="text"
                                        value={config.hero_image_url}
                                        onChange={(e) => setConfig({ ...config, hero_image_url: e.target.value })}
                                        placeholder="/images/hero.jpg"
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowMediaPicker(true)}
                                        className="mt-2 w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                                    >
                                        <FolderOpen size={16} />
                                        Medya Kütüphanesinden Seç
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* CTAs */}
                        <div className="bg-white rounded-xl border border-slate-200 p-6">
                            <h3 className="font-semibold text-slate-800 mb-4">CTA Butonları</h3>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-600 mb-1">Birincil Buton Metni</label>
                                        <input
                                            type="text"
                                            value={config.primary_cta_label}
                                            onChange={(e) => setConfig({ ...config, primary_cta_label: e.target.value })}
                                            placeholder="Demo Talep Et"
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-600 mb-1">Birincil Buton URL</label>
                                        <input
                                            type="text"
                                            value={config.primary_cta_url}
                                            onChange={(e) => setConfig({ ...config, primary_cta_url: e.target.value })}
                                            placeholder="#contact"
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-600 mb-1">İkincil Buton Metni</label>
                                        <input
                                            type="text"
                                            value={config.secondary_cta_label}
                                            onChange={(e) => setConfig({ ...config, secondary_cta_label: e.target.value })}
                                            placeholder="Daha Fazla Bilgi"
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-600 mb-1">İkincil Buton URL</label>
                                        <input
                                            type="text"
                                            value={config.secondary_cta_url}
                                            onChange={(e) => setConfig({ ...config, secondary_cta_url: e.target.value })}
                                            placeholder="#features"
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Styling Section */}
                        <div className="bg-white rounded-xl border border-slate-200 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-slate-800">Stil Ayarları</h3>
                                <button
                                    onClick={() => setConfig({
                                        ...config,
                                        hero_line1_use_gradient_text: false,
                                        hero_line1_solid_color: "#FFFFFF",
                                        hero_line1_gradient_from: "#4F46E5",
                                        hero_line1_gradient_to: "#22C55E",
                                        hero_line1_gradient_angle: 90,
                                        hero_line2_use_gradient_text: true,
                                        hero_line2_solid_color: "#EC4899",
                                        hero_line2_gradient_from: "#EC4899",
                                        hero_line2_gradient_to: "#8B5CF6",
                                        hero_line2_gradient_angle: 90,
                                        hero_use_gradient_background: false,
                                        hero_gradient_bg_from: "#1E293B",
                                        hero_gradient_bg_to: "#0F172A",
                                        hero_gradient_bg_angle: 180,
                                    })}
                                    className="flex items-center gap-1 px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-50 rounded-lg transition-colors"
                                >
                                    <RotateCcw size={14} />
                                    Varsayılana Dön
                                </button>
                            </div>

                            {/* Line 1 Styling */}
                            <div className="mb-6 p-4 bg-slate-50 rounded-lg">
                                <h4 className="font-medium text-slate-700 mb-3">Satır 1 Stili</h4>
                                <label className="flex items-center gap-2 mb-3">
                                    <input
                                        type="checkbox"
                                        checked={config.hero_line1_use_gradient_text}
                                        onChange={(e) => setConfig({ ...config, hero_line1_use_gradient_text: e.target.checked })}
                                        className="w-4 h-4 text-rose-500 rounded"
                                    />
                                    <span className="text-sm text-slate-600">Gradient Kullan</span>
                                </label>
                                {config.hero_line1_use_gradient_text ? (
                                    <div className="grid grid-cols-3 gap-3">
                                        <div>
                                            <label className="block text-xs text-slate-500 mb-1">Başlangıç</label>
                                            <input type="color" value={config.hero_line1_gradient_from}
                                                onChange={(e) => setConfig({ ...config, hero_line1_gradient_from: e.target.value })}
                                                className="w-full h-10 rounded border border-slate-200 cursor-pointer" />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-slate-500 mb-1">Bitiş</label>
                                            <input type="color" value={config.hero_line1_gradient_to}
                                                onChange={(e) => setConfig({ ...config, hero_line1_gradient_to: e.target.value })}
                                                className="w-full h-10 rounded border border-slate-200 cursor-pointer" />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-slate-500 mb-1">Açı ({config.hero_line1_gradient_angle}°)</label>
                                            <input type="range" min="0" max="360" value={config.hero_line1_gradient_angle}
                                                onChange={(e) => setConfig({ ...config, hero_line1_gradient_angle: parseInt(e.target.value) })}
                                                className="w-full h-10" />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="max-w-[150px]">
                                        <label className="block text-xs text-slate-500 mb-1">Düz Renk</label>
                                        <input type="color" value={config.hero_line1_solid_color}
                                            onChange={(e) => setConfig({ ...config, hero_line1_solid_color: e.target.value })}
                                            className="w-full h-10 rounded border border-slate-200 cursor-pointer" />
                                    </div>
                                )}
                            </div>

                            {/* Line 2 Styling */}
                            <div className="mb-6 p-4 bg-slate-50 rounded-lg">
                                <h4 className="font-medium text-slate-700 mb-3">Satır 2 Stili</h4>
                                <label className="flex items-center gap-2 mb-3">
                                    <input
                                        type="checkbox"
                                        checked={config.hero_line2_use_gradient_text}
                                        onChange={(e) => setConfig({ ...config, hero_line2_use_gradient_text: e.target.checked })}
                                        className="w-4 h-4 text-rose-500 rounded"
                                    />
                                    <span className="text-sm text-slate-600">Gradient Kullan</span>
                                </label>
                                {config.hero_line2_use_gradient_text ? (
                                    <div className="grid grid-cols-3 gap-3">
                                        <div>
                                            <label className="block text-xs text-slate-500 mb-1">Başlangıç</label>
                                            <input type="color" value={config.hero_line2_gradient_from}
                                                onChange={(e) => setConfig({ ...config, hero_line2_gradient_from: e.target.value })}
                                                className="w-full h-10 rounded border border-slate-200 cursor-pointer" />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-slate-500 mb-1">Bitiş</label>
                                            <input type="color" value={config.hero_line2_gradient_to}
                                                onChange={(e) => setConfig({ ...config, hero_line2_gradient_to: e.target.value })}
                                                className="w-full h-10 rounded border border-slate-200 cursor-pointer" />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-slate-500 mb-1">Açı ({config.hero_line2_gradient_angle}°)</label>
                                            <input type="range" min="0" max="360" value={config.hero_line2_gradient_angle}
                                                onChange={(e) => setConfig({ ...config, hero_line2_gradient_angle: parseInt(e.target.value) })}
                                                className="w-full h-10" />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="max-w-[150px]">
                                        <label className="block text-xs text-slate-500 mb-1">Düz Renk</label>
                                        <input type="color" value={config.hero_line2_solid_color}
                                            onChange={(e) => setConfig({ ...config, hero_line2_solid_color: e.target.value })}
                                            className="w-full h-10 rounded border border-slate-200 cursor-pointer" />
                                    </div>
                                )}
                            </div>

                            {/* Background Styling */}
                            <div className="p-4 bg-slate-50 rounded-lg">
                                <label className="flex items-center gap-2 mb-3">
                                    <input
                                        type="checkbox"
                                        checked={config.hero_use_gradient_background}
                                        onChange={(e) => setConfig({ ...config, hero_use_gradient_background: e.target.checked })}
                                        className="w-4 h-4 text-rose-500 rounded"
                                    />
                                    <span className="font-medium text-slate-700">Gradient Arka Plan</span>
                                </label>
                                {config.hero_use_gradient_background && (
                                    <div className="grid grid-cols-3 gap-3">
                                        <div>
                                            <label className="block text-xs text-slate-500 mb-1">Başlangıç</label>
                                            <input type="color" value={config.hero_gradient_bg_from}
                                                onChange={(e) => setConfig({ ...config, hero_gradient_bg_from: e.target.value })}
                                                className="w-full h-10 rounded border border-slate-200 cursor-pointer" />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-slate-500 mb-1">Bitiş</label>
                                            <input type="color" value={config.hero_gradient_bg_to}
                                                onChange={(e) => setConfig({ ...config, hero_gradient_bg_to: e.target.value })}
                                                className="w-full h-10 rounded border border-slate-200 cursor-pointer" />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-slate-500 mb-1">Açı ({config.hero_gradient_bg_angle}°)</label>
                                            <input type="range" min="0" max="360" value={config.hero_gradient_bg_angle}
                                                onChange={(e) => setConfig({ ...config, hero_gradient_bg_angle: parseInt(e.target.value) })}
                                                className="w-full h-10" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Preview */}
                    <div className="lg:sticky lg:top-6 h-fit">
                        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
                                <h3 className="font-semibold text-slate-800">Önizleme</h3>
                            </div>
                            <div
                                className={`p-8 min-h-[400px] ${getBackgroundClass()}`}
                                style={config.hero_use_gradient_background ? {
                                    background: `linear-gradient(${config.hero_gradient_bg_angle}deg, ${config.hero_gradient_bg_from}, ${config.hero_gradient_bg_to})`,
                                    color: 'white'
                                } : undefined}
                            >
                                {config.hero_badge && (
                                    <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm mb-4 border border-white/30">
                                        {config.hero_badge}
                                    </div>
                                )}
                                <h1 className="text-3xl font-bold mb-4 leading-tight">
                                    {/* Line 1 */}
                                    <span
                                        style={config.hero_line1_use_gradient_text ? {
                                            background: `linear-gradient(${config.hero_line1_gradient_angle}deg, ${config.hero_line1_gradient_from}, ${config.hero_line1_gradient_to})`,
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            backgroundClip: 'text',
                                        } : { color: config.hero_line1_solid_color }}
                                    >
                                        {config.hero_title_line1 || "Hero Başlığı - Satır 1"}
                                    </span>
                                    {config.hero_title_line2 && (
                                        <>
                                            <br />
                                            {/* Line 2 */}
                                            <span
                                                style={config.hero_line2_use_gradient_text ? {
                                                    background: `linear-gradient(${config.hero_line2_gradient_angle}deg, ${config.hero_line2_gradient_from}, ${config.hero_line2_gradient_to})`,
                                                    WebkitBackgroundClip: 'text',
                                                    WebkitTextFillColor: 'transparent',
                                                    backgroundClip: 'text',
                                                } : { color: config.hero_line2_solid_color }}
                                            >
                                                {config.hero_title_line2}
                                            </span>
                                        </>
                                    )}
                                </h1>
                                <p className="text-lg opacity-80 mb-6">
                                    {config.hero_subtitle || "Alt başlık buraya gelecek"}
                                </p>
                                <div className="flex flex-wrap gap-3">
                                    {config.primary_cta_label && (
                                        <button className="px-4 py-2 bg-rose-500 text-white rounded-lg text-sm">
                                            {config.primary_cta_label}
                                        </button>
                                    )}
                                    {config.secondary_cta_label && (
                                        <button className="px-4 py-2 border border-current rounded-lg text-sm">
                                            {config.secondary_cta_label}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Media Picker Dialog */}
            <MediaPickerDialog
                isOpen={showMediaPicker}
                onClose={() => setShowMediaPicker(false)}
                onSelect={(asset) => {
                    setConfig({ ...config, hero_image_url: asset.url });
                    setShowMediaPicker(false);
                }}
                category="hero"
            />
        </>);
};
