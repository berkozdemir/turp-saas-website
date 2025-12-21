import { useState, useEffect, useCallback } from "react";
import { Search, X, Check, Loader2, FolderOpen } from "lucide-react";

interface MediaAsset {
    id: number;
    filename_original: string;
    url: string;
    mime_type: string;
    size_bytes: number;
    width: number | null;
    height: number | null;
    alt_text: string;
    title: string;
    category: string;
}

interface MediaPickerDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (asset: { id: number; url: string; alt_text?: string }) => void;
    multiple?: boolean;
    category?: string;
}

export const MediaPickerDialog = ({
    isOpen,
    onClose,
    onSelect,
    multiple = false,
    category: filterCategory,
}: MediaPickerDialogProps) => {
    const [assets, setAssets] = useState<MediaAsset[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState(filterCategory || "");
    const [categories, setCategories] = useState<string[]>([]);
    const [selected, setSelected] = useState<MediaAsset[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const API_URL = import.meta.env.VITE_API_URL || "/api";

    const fetchAssets = useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("admin_token");
            const params = new URLSearchParams({
                page: page.toString(),
                limit: "24",
            });
            if (search) params.append("search", search);
            if (category) params.append("category", category);

            const response = await fetch(`${API_URL}/index.php?action=get_media_list&${params}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            if (data.success) {
                setAssets(data.data);
                setTotalPages(data.pagination.pages);
            }
        } catch (err) {
            console.error("Failed to fetch media:", err);
        } finally {
            setLoading(false);
        }
    }, [API_URL, page, search, category]);

    const fetchCategories = async () => {
        try {
            const token = localStorage.getItem("admin_token");
            const response = await fetch(`${API_URL}/index.php?action=get_media_categories`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            if (data.success) {
                setCategories(data.data);
            }
        } catch (err) {
            console.error("Failed to fetch categories:", err);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchAssets();
            fetchCategories();
        }
    }, [isOpen, fetchAssets]);

    useEffect(() => {
        setSelected([]);
    }, [isOpen]);

    const toggleSelect = (asset: MediaAsset) => {
        if (multiple) {
            setSelected((prev) =>
                prev.find((a) => a.id === asset.id)
                    ? prev.filter((a) => a.id !== asset.id)
                    : [...prev, asset]
            );
        } else {
            setSelected([asset]);
        }
    };

    const handleConfirm = () => {
        if (selected.length === 0) return;
        if (multiple) {
            selected.forEach((asset) => onSelect({ id: asset.id, url: asset.url, alt_text: asset.alt_text }));
        } else {
            const asset = selected[0];
            onSelect({ id: asset.id, url: asset.url, alt_text: asset.alt_text });
        }
        onClose();
    };

    const formatBytes = (bytes: number) => {
        if (bytes < 1024) return bytes + " B";
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
        return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
            <div
                className="bg-white rounded-2xl shadow-xl max-w-5xl w-full max-h-[85vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                    <div>
                        <h2 className="font-bold text-lg text-slate-900">Medya Kütüphanesinden Seç</h2>
                        <p className="text-sm text-slate-500">
                            {multiple ? "Birden fazla görsel seçebilirsiniz" : "Bir görsel seçin"}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
                        <X size={20} />
                    </button>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-4 px-6 py-3 border-b border-slate-200 bg-slate-50">
                    <div className="relative flex-1">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Ara..."
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm"
                        />
                    </div>
                    <select
                        value={category}
                        onChange={(e) => { setCategory(e.target.value); setPage(1); }}
                        className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500 text-sm"
                    >
                        <option value="">Tüm Kategoriler</option>
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                {/* Grid */}
                <div className="flex-1 overflow-y-auto p-4">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="animate-spin text-rose-500" size={32} />
                        </div>
                    ) : assets.length === 0 ? (
                        <div className="text-center py-20 text-slate-400">
                            <FolderOpen size={48} className="mx-auto mb-4 opacity-50" />
                            <p>Görsel bulunamadı</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
                            {assets.map((asset) => {
                                const isSelected = selected.some((a) => a.id === asset.id);
                                return (
                                    <div
                                        key={asset.id}
                                        onClick={() => toggleSelect(asset)}
                                        className={`relative aspect-square bg-slate-100 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${isSelected ? "border-rose-500 ring-2 ring-rose-200" : "border-transparent hover:border-slate-300"
                                            }`}
                                    >
                                        <img
                                            src={asset.url}
                                            alt={asset.alt_text || asset.filename_original}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                        />
                                        {isSelected && (
                                            <div className="absolute top-1 right-1 w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center">
                                                <Check size={14} className="text-white" />
                                            </div>
                                        )}
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                                            <p className="text-xs text-white truncate">{asset.title || asset.filename_original}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center gap-2 mt-4">
                            {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => i + 1).map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setPage(p)}
                                    className={`px-2 py-1 text-sm rounded ${p === page ? "bg-rose-500 text-white" : "bg-slate-100 hover:bg-slate-200"
                                        }`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
                    <p className="text-sm text-slate-500">
                        {selected.length > 0 ? `${selected.length} görsel seçildi` : "Görsel seçilmedi"}
                    </p>
                    <div className="flex gap-3">
                        <button onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                            İptal
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={selected.length === 0}
                            className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Seç
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
