import { useState, useEffect } from "react";
import { Search, Plus, Edit2, Trash2, Clock, FileText, Loader2, ChevronLeft, ChevronRight, CheckCircle, AlertCircle } from "lucide-react";
import { useNotification } from "../../components/NotificationProvider";
import { useConfirm } from "../../components/ConfirmProvider";
import { getTenantHeader } from "../../context/TenantContext";

interface AdminBlogListProps {
    token: string;
    onEdit: (post: any) => void;
    onCreate: () => void;
}

export const AdminBlogList = ({ token, onEdit, onCreate }: AdminBlogListProps) => {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const notify = useNotification();
    const confirm = useConfirm();
    const [filterStatus, setFilterStatus] = useState("all");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const API_URL = import.meta.env.VITE_API_URL || "/api";
    const API_BASE_URL = API_URL.endsWith('/index.php') ? API_URL : `${API_URL}/index.php`;

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `${API_BASE_URL}?action=get_blog_posts_admin&status=${filterStatus}&search=${search}&page=${page}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        ...getTenantHeader()
                    }
                }
            );
            const data = await response.json();
            if (data.success) {
                setPosts(data.data);
                setTotalPages(data.pagination.pages);
            } else {
                notify.error(data.error || "Blog yazıları alınamadı");
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
            fetchPosts();
        }, 300);
        return () => clearTimeout(timer);
    }, [filterStatus, search, page]);

    const handleDelete = async (id: number) => {
        const isConfirmed = await confirm({
            title: 'İçerik Sil',
            message: "Bu içeriği silmek istediğinize emin misiniz? Bu işlem geri alınamaz.",
            confirmLabel: 'Sil',
            cancelLabel: 'İptal',
            type: 'danger'
        });

        if (!isConfirmed) return;

        try {
            const response = await fetch(`${API_BASE_URL}?action=delete_blog_post`, {
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
                setPosts(posts.filter(p => p.id !== id));
                notify.success("İçerik başarıyla silindi");
            } else {
                notify.error("Silme hatası");
            }
        } catch (err) {
            notify.error("Bağlantı hatası");
        }
    };

    const TranslationBadge = ({ hasTranslation, lang }: { hasTranslation: boolean; lang: string }) => (
        <span className={`inline-flex items-center gap-0.5 text-xs ${hasTranslation ? 'text-green-600' : 'text-amber-500'}`}>
            {lang}
            {hasTranslation ? <CheckCircle size={10} /> : <AlertCircle size={10} />}
        </span>
    );

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Header & Toolbar */}
            <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h2 className="text-xl font-bold flex items-center gap-2 mb-1">
                        <FileText className="text-rose-600" /> Blog İçerikleri
                    </h2>
                    <p className="text-slate-500 text-sm">Çok dilli blog yazılarını buradan yönetin.</p>
                </div>

                <button
                    type="button"
                    onClick={onCreate}
                    className="bg-slate-900 text-white px-4 py-2 rounded-xl font-bold hover:bg-rose-600 transition-all flex items-center gap-2 shadow-lg shadow-rose-200"
                >
                    <Plus size={18} /> Yeni İçerik Ekle
                </button>
            </div>

            <div className="p-4 bg-slate-50 border-b border-slate-100 flex flex-wrap gap-4 items-center">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Başlıkta ara (TR/EN/ZH)..."
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-rose-500"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <select
                    className="p-2 border border-slate-200 rounded-lg outline-none focus:border-rose-500 bg-white"
                    value={filterStatus}
                    onChange={e => setFilterStatus(e.target.value)}
                >
                    <option value="all">Tüm Durumlar</option>
                    <option value="published">Yayında</option>
                    <option value="draft">Taslak</option>
                    <option value="archived">Arşiv</option>
                </select>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-white text-slate-500 text-xs uppercase font-bold border-b border-slate-100">
                        <tr>
                            <th className="p-4">Durum</th>
                            <th className="p-4">Başlık</th>
                            <th className="p-4">Çeviriler</th>
                            <th className="p-4">Tarih</th>
                            <th className="p-4 text-right">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {loading ? (
                            <tr><td colSpan={5} className="p-8 text-center text-slate-400"><Loader2 className="animate-spin mx-auto" /></td></tr>
                        ) : posts.length === 0 ? (
                            <tr><td colSpan={5} className="p-8 text-center text-slate-500">İçerik bulunamadı.</td></tr>
                        ) : (
                            posts.map(post => (
                                <tr key={post.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${post.status === 'published' ? 'bg-green-100 text-green-700' :
                                            post.status === 'draft' ? 'bg-slate-100 text-slate-600' : 'bg-orange-100 text-orange-700'
                                            }`}>
                                            {post.status}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="font-bold text-slate-900 line-clamp-1">{post.title_tr || '(başlıksız)'}</div>
                                        <div className="text-xs text-slate-400 mt-1">/{post.slug}</div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex gap-2">
                                            <TranslationBadge hasTranslation={!!post.title_tr} lang="TR" />
                                            <TranslationBadge hasTranslation={!!post.title_en} lang="EN" />
                                            <TranslationBadge hasTranslation={!!post.title_zh} lang="ZH" />
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-slate-500">
                                        <div className="flex items-center gap-1">
                                            <Clock size={14} /> {new Date(post.created_at).toLocaleDateString("tr-TR")}
                                        </div>
                                    </td>
                                    <td className="p-4 text-right space-x-2">
                                        <button type="button" onClick={() => onEdit(post)} className="p-2 bg-white border border-slate-200 rounded-lg hover:border-cyan-500 hover:text-cyan-600 transition-all shadow-sm">
                                            <Edit2 size={16} />
                                        </button>
                                        <button type="button" onClick={() => handleDelete(post.id)} className="p-2 bg-white border border-slate-200 rounded-lg hover:border-red-500 hover:text-red-600 transition-all shadow-sm">
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
                        onClick={() => setPage(p => p - 1)}
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
                        onClick={() => setPage(p => p + 1)}
                        className="p-2 border rounded hover:bg-slate-50 disabled:opacity-50"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            )}
        </div>
    );
};
