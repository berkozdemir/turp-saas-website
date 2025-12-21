import { useState, useEffect } from "react";
import { ArrowLeft, Save, MapPin, Phone, Mail, Clock } from "lucide-react";

interface ContactConfig {
    id?: number;
    language: string;
    contact_title: string;
    contact_subtitle: string;
    address_line1: string;
    address_line2: string;
    city: string;
    country: string;
    phone: string;
    email: string;
    map_embed_url: string;
    working_hours: string;
    form_enabled: boolean;
    notification_email: string;
    success_message: string;
    error_message: string;
    is_active: boolean;
}

interface AdminContactConfigEditorProps {
    editId: number | null;
    onBack: () => void;
}

const defaultConfig: ContactConfig = {
    language: "tr",
    contact_title: "",
    contact_subtitle: "",
    address_line1: "",
    address_line2: "",
    city: "",
    country: "",
    phone: "",
    email: "",
    map_embed_url: "",
    working_hours: "",
    form_enabled: true,
    notification_email: "",
    success_message: "Mesajınız başarıyla iletildi.",
    error_message: "Bir hata oluştu, lütfen tekrar deneyin.",
    is_active: true,
};

export const AdminContactConfigEditor = ({ editId, onBack }: AdminContactConfigEditorProps) => {
    const [config, setConfig] = useState<ContactConfig>(defaultConfig);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

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
                `${API_URL}/index.php?action=get_contact_config_detail&id=${editId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const data = await response.json();
            if (data.success && data.data) {
                setConfig({
                    ...data.data,
                    form_enabled: Boolean(data.data.form_enabled),
                    is_active: Boolean(data.data.is_active),
                });
            }
        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!config.contact_title.trim()) {
            alert("İletişim başlığı zorunludur.");
            return;
        }

        setSaving(true);
        try {
            const token = localStorage.getItem("admin_token");
            const response = await fetch(`${API_URL}/index.php?action=save_contact_config`, {
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

    if (loading) {
        return <div className="p-8 text-center text-slate-500">Yükleniyor...</div>;
    }

    return (
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
                        <p className="text-slate-500">İletişim bölümü ayarları</p>
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
                    {/* General Settings */}
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
                            <div className="flex items-end">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={config.is_active}
                                        onChange={(e) => setConfig({ ...config, is_active: e.target.checked })}
                                        className="w-4 h-4 text-rose-500 rounded"
                                    />
                                    <span className="text-sm text-slate-600">Aktif</span>
                                </label>
                            </div>
                        </div>
                        <div className="mt-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">Başlık *</label>
                                <input
                                    type="text"
                                    value={config.contact_title}
                                    onChange={(e) => setConfig({ ...config, contact_title: e.target.value })}
                                    placeholder="Bize Ulaşın"
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">Alt Başlık</label>
                                <textarea
                                    value={config.contact_subtitle}
                                    onChange={(e) => setConfig({ ...config, contact_subtitle: e.target.value })}
                                    placeholder="Sorularınız için bizimle iletişime geçin."
                                    rows={2}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Contact Details */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6">
                        <h3 className="font-semibold text-slate-800 mb-4">İletişim Bilgileri</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">Adres Satırı 1</label>
                                <input
                                    type="text"
                                    value={config.address_line1}
                                    onChange={(e) => setConfig({ ...config, address_line1: e.target.value })}
                                    placeholder="Cyberpark Teknokent"
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">Adres Satırı 2</label>
                                <input
                                    type="text"
                                    value={config.address_line2}
                                    onChange={(e) => setConfig({ ...config, address_line2: e.target.value })}
                                    placeholder="A Blok No: 123"
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-1">Şehir</label>
                                    <input
                                        type="text"
                                        value={config.city}
                                        onChange={(e) => setConfig({ ...config, city: e.target.value })}
                                        placeholder="Ankara"
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-1">Ülke</label>
                                    <input
                                        type="text"
                                        value={config.country}
                                        onChange={(e) => setConfig({ ...config, country: e.target.value })}
                                        placeholder="Türkiye"
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-1">Telefon</label>
                                    <input
                                        type="text"
                                        value={config.phone}
                                        onChange={(e) => setConfig({ ...config, phone: e.target.value })}
                                        placeholder="+90 312 XXX XX XX"
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-1">E-posta</label>
                                    <input
                                        type="email"
                                        value={config.email}
                                        onChange={(e) => setConfig({ ...config, email: e.target.value })}
                                        placeholder="info@example.com"
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">Çalışma Saatleri</label>
                                <input
                                    type="text"
                                    value={config.working_hours}
                                    onChange={(e) => setConfig({ ...config, working_hours: e.target.value })}
                                    placeholder="Pzt-Cum: 09:00 - 18:00"
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Map Settings */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6">
                        <h3 className="font-semibold text-slate-800 mb-4">Harita</h3>
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">Google Maps Embed URL</label>
                            <input
                                type="text"
                                value={config.map_embed_url}
                                onChange={(e) => setConfig({ ...config, map_embed_url: e.target.value })}
                                placeholder="https://www.google.com/maps/embed?pb=..."
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                            />
                            <p className="text-xs text-slate-400 mt-1">Google Maps'ten "Paylaş" → "Haritayı yerleştir" linkini kopyalayın.</p>
                        </div>
                    </div>

                    {/* Form Settings */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6">
                        <h3 className="font-semibold text-slate-800 mb-4">Form Ayarları</h3>
                        <div className="space-y-4">
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={config.form_enabled}
                                    onChange={(e) => setConfig({ ...config, form_enabled: e.target.checked })}
                                    className="w-4 h-4 text-rose-500 rounded"
                                />
                                <span className="text-sm text-slate-600">İletişim Formunu Etkinleştir</span>
                            </label>
                            {config.form_enabled && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-600 mb-1">Bildirim E-postası</label>
                                        <input
                                            type="email"
                                            value={config.notification_email}
                                            onChange={(e) => setConfig({ ...config, notification_email: e.target.value })}
                                            placeholder="admin@example.com"
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                                        />
                                        <p className="text-xs text-slate-400 mt-1">Form gönderimlerinin iletileceği e-posta adresi.</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-600 mb-1">Başarı Mesajı</label>
                                        <input
                                            type="text"
                                            value={config.success_message}
                                            onChange={(e) => setConfig({ ...config, success_message: e.target.value })}
                                            placeholder="Mesajınız başarıyla iletildi."
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-600 mb-1">Hata Mesajı</label>
                                        <input
                                            type="text"
                                            value={config.error_message}
                                            onChange={(e) => setConfig({ ...config, error_message: e.target.value })}
                                            placeholder="Bir hata oluştu, lütfen tekrar deneyin."
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                                        />
                                    </div>
                                </>
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
                        <div className="p-6 bg-slate-900 text-white min-h-[500px]">
                            {/* Title */}
                            <h2 className="text-2xl font-bold mb-2">
                                {config.contact_title || "İletişim Başlığı"}
                            </h2>
                            <p className="text-slate-400 text-sm mb-6">
                                {config.contact_subtitle || "Alt başlık buraya gelecek"}
                            </p>

                            {/* Contact Info */}
                            <div className="space-y-3 mb-6">
                                {(config.address_line1 || config.city) && (
                                    <div className="flex items-start gap-3">
                                        <MapPin size={18} className="text-rose-400 mt-0.5" />
                                        <div className="text-sm">
                                            <div>{config.address_line1 || "Adres"}</div>
                                            {config.address_line2 && <div>{config.address_line2}</div>}
                                            <div>{config.city}{config.country && `, ${config.country}`}</div>
                                        </div>
                                    </div>
                                )}
                                {config.phone && (
                                    <div className="flex items-center gap-3">
                                        <Phone size={18} className="text-rose-400" />
                                        <span className="text-sm">{config.phone}</span>
                                    </div>
                                )}
                                {config.email && (
                                    <div className="flex items-center gap-3">
                                        <Mail size={18} className="text-rose-400" />
                                        <span className="text-sm">{config.email}</span>
                                    </div>
                                )}
                                {config.working_hours && (
                                    <div className="flex items-center gap-3">
                                        <Clock size={18} className="text-rose-400" />
                                        <span className="text-sm">{config.working_hours}</span>
                                    </div>
                                )}
                            </div>

                            {/* Form Preview */}
                            {config.form_enabled && (
                                <div className="bg-white/10 rounded-lg p-4">
                                    <div className="space-y-3">
                                        <div className="h-10 bg-white/20 rounded"></div>
                                        <div className="h-10 bg-white/20 rounded"></div>
                                        <div className="h-20 bg-white/20 rounded"></div>
                                        <button className="w-full py-2 bg-rose-500 text-white rounded-lg text-sm">
                                            Gönder
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Map Placeholder */}
                            {config.map_embed_url && (
                                <div className="mt-4 bg-slate-700 rounded-lg h-32 flex items-center justify-center text-slate-400 text-sm">
                                    🗺️ Harita önizlemesi
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
