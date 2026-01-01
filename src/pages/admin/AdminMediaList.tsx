import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Upload, Search, Trash2, Copy, Check, X, Image as ImageIcon, Loader2, FolderOpen } from "lucide-react";
import { getTenantHeader } from "../../context/TenantContext";

interface MediaAsset {
    id: number;
    filename_original: string;
    filename_stored: string;
    url: string;
    mime_type: string;
    size_bytes: number;
    width: number | null;
    height: number | null;
    alt_text: string;
    title: string;
    tags: string[];
    category: string;
    created_at: string;
}

interface Pagination {
    total: number;
    page: number;
    limit: number;
    pages: number;
}

interface AdminMediaListProps {
    onBack?: () => void;
}

export const AdminMediaList = ({ onBack }: AdminMediaListProps) => {
    const [assets, setAssets] = useState<MediaAsset[]>([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState<Pagination>({ total: 0, page: 1, limit: 24, pages: 0 });
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);
    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const [copiedUrl, setCopiedUrl] = useState<number | null>(null);

    const API_URL = import.meta.env.VITE_API_URL || "/api";
    const API_BASE_URL = API_URL.endsWith('/index.php') ? API_URL : `${API_URL}/index.php`;

    const fetchAssets = useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("admin_token");
            const params = new URLSearchParams({
                page: pagination.page.toString(),
                limit: pagination.limit.toString(),
            });
            if (search) params.append("search", search);
            if (category) params.append("category", category);

            const response = await fetch(`${API_BASE_URL}?action=get_media_list&${params}`, {
                headers: { Authorization: `Bearer ${token}`, ...getTenantHeader() },
            });
            const data = await response.json();
            if (data.success) {
                setAssets(data.data);
                setPagination(data.pagination);
            }
        } catch (err) {
            console.error("Failed to fetch media:", err);
        } finally {
            setLoading(false);
        }
    }, [API_URL, pagination.page, search, category]);

    const fetchCategories = async () => {
        try {
            const token = localStorage.getItem("admin_token");
            const response = await fetch(`${API_BASE_URL}?action=get_media_categories`, {
                headers: { Authorization: `Bearer ${token}`, ...getTenantHeader() },
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
        fetchAssets();
        fetchCategories();
    }, [fetchAssets]);

    const handleUpload = async (files: FileList | null) => {
        if (!files || files.length === 0) return;

        setUploading(true);
        const formData = new FormData();
        Array.from(files).forEach((file) => {
            formData.append("files[]", file);
        });

        try {
            const token = localStorage.getItem("admin_token");
            const response = await fetch(`${API_BASE_URL}?action=upload_media`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}`, ...getTenantHeader() },
                body: formData,
            });
            const data = await response.json();
            if (data.success) {
                fetchAssets();
                fetchCategories();
            } else {
                alert(data.errors?.map((e: any) => e.error).join("\n") || "Upload failed");
            }
        } catch (err) {
            console.error("Upload failed:", err);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Bu görseli silmek istediğinize emin misiniz?")) return;

        try {
            const token = localStorage.getItem("admin_token");
            const response = await fetch(`${API_BASE_URL}?action=delete_media`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                    ...getTenantHeader()
                },
                body: JSON.stringify({ id }),
            });
            const data = await response.json();
            if (data.success) {
                setAssets((prev) => prev.filter((a) => a.id !== id));
                setSelectedAsset(null);
            }
        } catch (err) {
            console.error("Delete failed:", err);
        }
    };

    const handleUpdateMetadata = async (asset: MediaAsset) => {
        try {
            const token = localStorage.getItem("admin_token");
            const response = await fetch(`${API_BASE_URL}?action=update_media`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                    ...getTenantHeader()
                },
                body: JSON.stringify({
                    id: asset.id,
                    title: asset.title,
                    alt_text: asset.alt_text,
                    category: asset.category,
                    tags: asset.tags,
                }),
            });
            const data = await response.json();
            if (data.success) {
                setAssets((prev) => prev.map((a) => (a.id === asset.id ? asset : a)));
                fetchCategories();
            }
        } catch (err) {
            console.error("Update failed:", err);
        }
    };

    const copyUrl = (asset: MediaAsset) => {
        navigator.clipboard.writeText(window.location.origin + asset.url);
        setCopiedUrl(asset.id);
        setTimeout(() => setCopiedUrl(null), 2000);
    };

    const formatBytes = (bytes: number) => {
        if (bytes < 1024) return bytes + " B";
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
        return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        handleUpload(e.dataTransfer.files);
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="sticky top-0 z-30 bg-white border-b border-slate-200 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {onBack && (
                            <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg">
                                <ArrowLeft size={20} />
                            </button>
                        )}
                        <div>
                            <h1 className="text-xl font-bold text-slate-900">Medya Kütüphanesi</h1>
                            <p className="text-sm text-slate-500">{pagination.total} görsel</p>
                        </div>
                    </div>

                    <label className="flex items-center gap-2 px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 cursor-pointer transition-colors">
                        <Upload size={18} />
                        Görsel Yükle
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleUpload(e.target.files)}
                        />
                    </label>
                </div>
            </div>

            {/* Filters */}
            <div className="px-6 py-4 bg-white border-b border-slate-200">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative flex-1 min-w-[200px]">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Ara (dosya adı, başlık, etiket)..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                        />
                    </div>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500"
                    >
                        <option value="">Tüm Kategoriler</option>
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Upload Drop Zone */}
            <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={`mx-6 mt-4 border-2 border-dashed rounded-xl p-8 text-center transition-colors ${dragOver ? "border-rose-500 bg-rose-50" : "border-slate-200 bg-white"
                    }`}
            >
                {uploading ? (
                    <div className="flex items-center justify-center gap-2 text-slate-500">
                        <Loader2 className="animate-spin" size={24} />
                        Yükleniyor...
                    </div>
                ) : (
                    <div className="text-slate-500">
                        <ImageIcon size={32} className="mx-auto mb-2 opacity-50" />
                        <p>Görselleri buraya sürükleyip bırakın</p>
                        <p className="text-xs mt-1">veya yukarıdaki butonu kullanın</p>
                    </div>
                )}
            </div>

            {/* Grid */}
            <div className="p-6">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="animate-spin text-rose-500" size={32} />
                    </div>
                ) : assets.length === 0 ? (
                    <div className="text-center py-20 text-slate-400">
                        <FolderOpen size={48} className="mx-auto mb-4 opacity-50" />
                        <p>Henüz görsel yok</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {assets.map((asset) => (
                            <div
                                key={asset.id}
                                onClick={() => setSelectedAsset(asset)}
                                className="group relative bg-white rounded-xl border border-slate-200 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                            >
                                <div className="aspect-square bg-slate-100 flex items-center justify-center overflow-hidden">
                                    <img
                                        src={asset.url}
                                        alt={asset.alt_text || asset.filename_original}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                </div>
                                <div className="p-2">
                                    <p className="text-xs font-medium text-slate-700 truncate">{asset.title || asset.filename_original}</p>
                                    <p className="text-xs text-slate-400">{formatBytes(asset.size_bytes)}</p>
                                </div>
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); copyUrl(asset); }}
                                        className="p-1.5 bg-white/90 rounded-lg shadow hover:bg-white"
                                    >
                                        {copiedUrl === asset.id ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {pagination.pages > 1 && (
                    <div className="flex justify-center gap-2 mt-8">
                        {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => setPagination((p) => ({ ...p, page }))}
                                className={`px-3 py-1 rounded-lg ${page === pagination.page
                                    ? "bg-rose-500 text-white"
                                    : "bg-white border border-slate-200 hover:bg-slate-50"
                                    }`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            {selectedAsset && (
                <MediaDetailModal
                    asset={selectedAsset}
                    onClose={() => setSelectedAsset(null)}
                    onUpdate={(updated) => {
                        handleUpdateMetadata(updated);
                        setSelectedAsset(updated);
                    }}
                    onDelete={() => handleDelete(selectedAsset.id)}
                    onCopyUrl={() => copyUrl(selectedAsset)}
                    copiedUrl={copiedUrl === selectedAsset.id}
                />
            )}
        </div>
    );
};

// Detail Modal Component
interface MediaDetailModalProps {
    asset: MediaAsset;
    onClose: () => void;
    onUpdate: (asset: MediaAsset) => void;
    onDelete: () => void;
    onCopyUrl: () => void;
    copiedUrl: boolean;
}

const MediaDetailModal = ({ asset, onClose, onUpdate, onDelete, onCopyUrl, copiedUrl }: MediaDetailModalProps) => {
    const [editAsset, setEditAsset] = useState<MediaAsset>(asset);
    const [tagInput, setTagInput] = useState("");

    const addTag = () => {
        if (tagInput.trim() && !editAsset.tags.includes(tagInput.trim())) {
            setEditAsset({ ...editAsset, tags: [...editAsset.tags, tagInput.trim()] });
            setTagInput("");
        }
    };

    const removeTag = (tag: string) => {
        setEditAsset({ ...editAsset, tags: editAsset.tags.filter((t) => t !== tag) });
    };

    const formatBytes = (bytes: number) => {
        if (bytes < 1024) return bytes + " B";
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
        return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex" onClick={(e) => e.stopPropagation()}>
                {/* Preview */}
                <div className="w-1/2 bg-slate-900 flex items-center justify-center p-4">
                    <img src={asset.url} alt={asset.alt_text} className="max-w-full max-h-[70vh] object-contain" />
                </div>

                {/* Details */}
                <div className="w-1/2 p-6 overflow-y-auto">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="font-bold text-lg text-slate-900">Görsel Detayları</h2>
                        <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Info */}
                    <div className="space-y-3 text-sm mb-6">
                        <div className="flex justify-between">
                            <span className="text-slate-500">Dosya adı:</span>
                            <span className="font-medium text-slate-700 truncate ml-2">{asset.filename_original}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Boyut:</span>
                            <span className="font-medium text-slate-700">{formatBytes(asset.size_bytes)}</span>
                        </div>
                        {asset.width && asset.height && (
                            <div className="flex justify-between">
                                <span className="text-slate-500">Boyutlar:</span>
                                <span className="font-medium text-slate-700">{asset.width} × {asset.height}</span>
                            </div>
                        )}
                        <div className="flex justify-between">
                            <span className="text-slate-500">Tür:</span>
                            <span className="font-medium text-slate-700">{asset.mime_type}</span>
                        </div>
                    </div>

                    {/* URL */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-slate-600 mb-1">URL</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={window.location.origin + asset.url}
                                readOnly
                                className="flex-1 px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg"
                            />
                            <button onClick={onCopyUrl} className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg">
                                {copiedUrl ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Editable Fields */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">Başlık</label>
                            <input
                                type="text"
                                value={editAsset.title}
                                onChange={(e) => setEditAsset({ ...editAsset, title: e.target.value })}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">Alt Metin</label>
                            <input
                                type="text"
                                value={editAsset.alt_text}
                                onChange={(e) => setEditAsset({ ...editAsset, alt_text: e.target.value })}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">Kategori</label>
                            <input
                                type="text"
                                value={editAsset.category}
                                onChange={(e) => setEditAsset({ ...editAsset, category: e.target.value })}
                                placeholder="hero, blog, logo..."
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">Etiketler</label>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {editAsset.tags.map((tag) => (
                                    <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 rounded-lg text-sm">
                                        {tag}
                                        <button onClick={() => removeTag(tag)} className="hover:text-red-500">
                                            <X size={14} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                                    placeholder="Etiket ekle..."
                                    className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                />
                                <button onClick={addTag} className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm">
                                    Ekle
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 mt-6 pt-6 border-t border-slate-200">
                        <button
                            onClick={() => onUpdate(editAsset)}
                            className="flex-1 px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600"
                        >
                            Kaydet
                        </button>
                        <button
                            onClick={onDelete}
                            className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
