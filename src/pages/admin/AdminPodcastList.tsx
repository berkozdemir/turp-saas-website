import { useState, useEffect } from "react";
import {
    Search, Plus, Edit2, Trash2, Clock, Mic, Loader2,
    ChevronLeft, ChevronRight, Filter, Globe, Tag
} from "lucide-react";
import { useNotification } from "../../components/NotificationProvider";
import { useConfirm } from "../../components/ConfirmProvider";
import { getTenantHeader } from "../../context/TenantContext";

interface AdminPodcastListProps {
    token: string;
    onEdit: (podcast: any) => void;
    onCreate: () => void;
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
    draft: { label: "Taslak", color: "bg-slate-100 text-slate-600" },
    scheduled: { label: "Planlandı", color: "bg-blue-100 text-blue-700" },
    published: { label: "Yayında", color: "bg-green-100 text-green-700" },
    archived: { label: "Arşiv", color: "bg-orange-100 text-orange-700" },
};

const LANGUAGE_LABELS: Record<string, string> = {
    tr: "TR",
    en: "EN",
    zh: "ZH",
};

export const AdminPodcastList = ({ token, onEdit, onCreate }: AdminPodcastListProps) => {
    const [podcasts, setPodcasts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState("all");
    const [filterLanguage, setFilterLanguage] = useState("all");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    const notify = useNotification();
    const confirm = useConfirm();

    const API_URL = import.meta.env.VITE_API_URL || "/api";
    const API_BASE_URL = API_URL.endsWith('/index.php') ? API_URL : `${API_URL}/index.php`;

    const fetchPodcasts = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                action: "get_podcasts_admin",
                page: String(page),
                pageSize: "20",
            });

            if (filterStatus !== "all") params.append("status", filterStatus);
            if (filterLanguage !== "all") params.append("language", filterLanguage);
            if (search) params.append("search", search);

            const response = await fetch(`${API_BASE_URL}?${params.toString()}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    ...getTenantHeader(),
                },
            });

            const data = await response.json();
            if (data.success) {
                setPodcasts(data.data || []);
                setTotalPages(data.pagination?.pages || 1);
                setTotalCount(data.pagination?.total || 0);
            } else {
                notify.error(data.error || "Podcast listesi alınamadı");
            }
        } catch (err: any) {
            console.error("Fetch error:", err);
            notify.error("Veri yüklenemedi: " + (err.message || "Bağlantı hatası"));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchPodcasts();
        }, 300);
        return () => clearTimeout(timer);
    }, [filterStatus, filterLanguage, search, page]);

    const handleDelete = async (id: number) => {
        const isConfirmed = await confirm({
            title: "Podcast Sil",
            message: "Bu podcast bölümünü silmek istediğinize emin misiniz?",
            confirmLabel: "Sil",
            cancelLabel: "İptal",
            type: "danger",
        });

        if (!isConfirmed) return;

        try {
            const response = await fetch(`${API_BASE_URL}?action=delete_podcast`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    ...getTenantHeader(),
                },
                body: JSON.stringify({ id }),
            });

            const data = await response.json();
            if (data.success) {
                setPodcasts(podcasts.filter((p) => p.id !== id));
                notify.success("Podcast başarıyla silindi");
            } else {
                notify.error(data.error || "Silme hatası");
            }
        } catch (err) {
            notify.error("Bağlantı hatası");
        }
    };

    const formatDuration = (seconds: number) => {
        if (!seconds) return "-";
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h2 className="text-xl font-bold flex items-center gap-2 mb-1">
                        <Mic className="text-purple-600" /> Podcast Bölümleri
                    </h2>
                    <p className="text-slate-500 text-sm">
                        Podcast bölümlerini buradan yönetin. ({totalCount} bölüm)
                    </p>
                </div>

                <button
                    type="button"
                    onClick={onCreate}
                    className="bg-slate-900 text-white px-4 py-2 rounded-xl font-bold hover:bg-purple-600 transition-all flex items-center gap-2 shadow-lg shadow-purple-200"
                >
                    <Plus size={18} /> Yeni Bölüm
                </button>
            </div>

            {/* Filters */}
            <div className="p-4 bg-slate-50 border-b border-slate-100 flex flex-wrap gap-4 items-center">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Başlık veya açıklamada ara..."
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-purple-500"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <select
                    className="p-2 border border-slate-200 rounded-lg outline-none focus:border-purple-500 bg-white"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                >
                    <option value="all">Tüm Durumlar</option>
                    <option value="draft">Taslak</option>
                    <option value="scheduled">Planlandı</option>
                    <option value="published">Yayında</option>
                    <option value="archived">Arşiv</option>
                </select>

                <select
                    className="p-2 border border-slate-200 rounded-lg outline-none focus:border-purple-500 bg-white"
                    value={filterLanguage}
                    onChange={(e) => setFilterLanguage(e.target.value)}
                >
                    <option value="all">Tüm Diller</option>
                    <option value="tr">Türkçe</option>
                    <option value="en">English</option>
                    <option value="zh">中文</option>
                </select>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-white text-slate-500 text-xs uppercase font-bold border-b border-slate-100">
                        <tr>
                            <th className="p-4">Durum</th>
                            <th className="p-4">Başlık</th>
                            <th className="p-4">Yayın Tarihi</th>
                            <th className="p-4">Süre</th>
                            <th className="p-4">Dil</th>
                            <th className="p-4">Etiketler</th>
                            <th className="p-4 text-right">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {loading ? (
                            <tr>
                                <td colSpan={7} className="p-8 text-center text-slate-400">
                                    <Loader2 className="animate-spin mx-auto" />
                                </td>
                            </tr>
                        ) : podcasts.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="p-8 text-center text-slate-500">
                                    <div className="flex flex-col items-center gap-4">
                                        <Mic size={48} className="text-slate-300" />
                                        <p>Bu sitede henüz podcast bölümü yok.</p>
                                        <button
                                            onClick={onCreate}
                                            className="text-purple-600 hover:underline font-medium"
                                        >
                                            İlk bölümü oluşturmak için tıklayın
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            podcasts.map((podcast) => (
                                <tr key={podcast.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="p-4">
                                        <span
                                            className={`px-2 py-1 rounded text-xs font-bold uppercase ${STATUS_LABELS[podcast.status]?.color || "bg-slate-100 text-slate-600"
                                                }`}
                                        >
                                            {STATUS_LABELS[podcast.status]?.label || podcast.status}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="font-bold text-slate-900 line-clamp-1">
                                            {podcast.title || "(başlıksız)"}
                                        </div>
                                        <div className="text-xs text-slate-400 mt-1">/{podcast.slug}</div>
                                    </td>
                                    <td className="p-4 text-sm text-slate-500">
                                        <div className="flex items-center gap-1">
                                            <Clock size={14} />
                                            {podcast.publish_date
                                                ? new Date(podcast.publish_date).toLocaleDateString("tr-TR")
                                                : "-"}
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-slate-600 font-mono">
                                        {formatDuration(podcast.duration_seconds)}
                                    </td>
                                    <td className="p-4">
                                        <span className="px-2 py-1 bg-slate-100 rounded text-xs font-medium">
                                            {LANGUAGE_LABELS[podcast.language] || podcast.language}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-wrap gap-1">
                                            {(podcast.tags || []).slice(0, 3).map((tag: string, i: number) => (
                                                <span
                                                    key={i}
                                                    className="px-2 py-0.5 bg-purple-50 text-purple-600 rounded text-xs"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                            {(podcast.tags || []).length > 3 && (
                                                <span className="text-xs text-slate-400">+{podcast.tags.length - 3}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4 text-right space-x-2">
                                        <button
                                            type="button"
                                            onClick={() => onEdit(podcast)}
                                            className="p-2 bg-white border border-slate-200 rounded-lg hover:border-purple-500 hover:text-purple-600 transition-all shadow-sm"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(podcast.id)}
                                            className="p-2 bg-white border border-slate-200 rounded-lg hover:border-red-500 hover:text-red-600 transition-all shadow-sm"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="p-4 border-t border-slate-100 flex justify-center gap-2">
                    <button
                        type="button"
                        disabled={page === 1}
                        onClick={() => setPage((p) => p - 1)}
                        className="p-2 border rounded hover:bg-slate-50 disabled:opacity-50"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <span className="px-4 py-2 text-sm text-slate-600 font-medium">
                        {page} / {totalPages}
                    </span>
                    <button
                        type="button"
                        disabled={page === totalPages}
                        onClick={() => setPage((p) => p + 1)}
                        className="p-2 border rounded hover:bg-slate-50 disabled:opacity-50"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            )}
        </div>
    );
};
