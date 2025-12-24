import { useState, useEffect } from "react";
import { Plus, Edit, Copy, Trash2, Check, X, Globe } from "lucide-react";
import { getTenantHeader } from "../../context/TenantContext";

interface LandingConfig {
    id: number;
    tenant_id: string;
    language: string;
    hero_title: string;
    hero_subtitle: string;
    hero_badge: string;
    primary_cta_label: string;
    primary_cta_url: string;
    secondary_cta_label: string;
    secondary_cta_url: string;
    hero_image_url: string;
    background_style: string;
    is_active: number;
    updated_at: string;
}

interface AdminLandingListProps {
    onEdit: (id: number | null) => void;
}

export const AdminLandingList = ({ onEdit }: AdminLandingListProps) => {
    const [configs, setConfigs] = useState<LandingConfig[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterLang, setFilterLang] = useState("all");

    const API_URL = import.meta.env.VITE_API_URL || "/api";

    const fetchConfigs = async () => {
        try {
            const token = localStorage.getItem("admin_token");
            const response = await fetch(
                `${API_URL}/index.php?action=get_landing_configs_admin&language=${filterLang}`,
                { headers: { Authorization: `Bearer ${token}`, ...getTenantHeader() } }
            );
            const data = await response.json();
            if (data.success) {
                setConfigs(data.data);
            }
        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConfigs();
    }, [filterLang]);

    const handleDuplicate = async (id: number) => {
        if (!confirm("Bu yapılandırmayı kopyalamak istiyor musunuz?")) return;
        try {
            const token = localStorage.getItem("admin_token");
            const response = await fetch(`${API_URL}/index.php?action=duplicate_landing_config`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    ...getTenantHeader()
                },
                body: JSON.stringify({ id }),
            });
            const data = await response.json();
            if (data.success) {
                fetchConfigs();
            }
        } catch (err) {
            console.error("Duplicate error:", err);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Bu yapılandırmayı silmek istediğinizden emin misiniz?")) return;
        try {
            const token = localStorage.getItem("admin_token");
            const response = await fetch(`${API_URL}/index.php?action=delete_landing_config`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    ...getTenantHeader()
                },
                body: JSON.stringify({ id }),
            });
            const data = await response.json();
            if (data.success) {
                fetchConfigs();
            }
        } catch (err) {
            console.error("Delete error:", err);
        }
    };

    const handleToggleActive = async (config: LandingConfig) => {
        try {
            const token = localStorage.getItem("admin_token");
            const response = await fetch(`${API_URL}/index.php?action=save_landing_config`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    ...getTenantHeader()
                },
                body: JSON.stringify({
                    ...config,
                    is_active: config.is_active ? 0 : 1,
                }),
            });
            const data = await response.json();
            if (data.success) {
                fetchConfigs();
            }
        } catch (err) {
            console.error("Toggle error:", err);
        }
    };

    const getLangLabel = (lang: string) => {
        switch (lang) {
            case "tr": return "🇹🇷 Türkçe";
            case "en": return "🇬🇧 English";
            case "zh": return "🇨🇳 中文";
            default: return lang;
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-slate-500">Yükleniyor...</div>;
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Landing Builder</h2>
                    <p className="text-slate-500">Hero bölümü yapılandırmaları</p>
                </div>
                <button
                    onClick={() => onEdit(null)}
                    className="flex items-center gap-2 px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
                >
                    <Plus size={20} />
                    Yeni Yapılandırma
                </button>
            </div>

            {/* Filter */}
            <div className="mb-4 flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <Globe size={18} className="text-slate-400" />
                    <select
                        value={filterLang}
                        onChange={(e) => setFilterLang(e.target.value)}
                        className="px-3 py-2 border border-slate-200 rounded-lg"
                    >
                        <option value="all">Tüm Diller</option>
                        <option value="tr">🇹🇷 Türkçe</option>
                        <option value="en">🇬🇧 English</option>
                        <option value="zh">🇨🇳 中文</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            {configs.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                    Henüz yapılandırma bulunamadı.
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Dil</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Başlık</th>
                                <th className="px-4 py-3 text-center text-sm font-semibold text-slate-600">Aktif</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Güncellenme</th>
                                <th className="px-4 py-3 text-right text-sm font-semibold text-slate-600">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {configs.map((config) => (
                                <tr key={config.id} className="border-b border-slate-100 hover:bg-slate-50">
                                    <td className="px-4 py-3">
                                        <span className="text-sm">{getLangLabel(config.language)}</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="text-sm font-medium text-slate-800 line-clamp-1">
                                            {config.hero_title}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <button
                                            onClick={() => handleToggleActive(config)}
                                            className={`p-1 rounded-full ${config.is_active
                                                ? "bg-emerald-100 text-emerald-600"
                                                : "bg-slate-100 text-slate-400"
                                                }`}
                                        >
                                            {config.is_active ? <Check size={16} /> : <X size={16} />}
                                        </button>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="text-sm text-slate-500">
                                            {new Date(config.updated_at).toLocaleDateString("tr-TR")}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => onEdit(config.id)}
                                                className="p-2 text-slate-500 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                                                title="Düzenle"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDuplicate(config.id)}
                                                className="p-2 text-slate-500 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Kopyala"
                                            >
                                                <Copy size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(config.id)}
                                                className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Sil"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};
