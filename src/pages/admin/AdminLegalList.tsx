import { useState, useEffect } from "react";
import { Search, Plus, Edit2, Trash2, Globe, Star, StarOff, Eye, EyeOff, Loader2, ChevronLeft, ChevronRight, FileText } from "lucide-react";
import { useNotification } from "../../components/NotificationProvider";
import { useConfirm } from "../../components/ConfirmProvider";

interface AdminLegalListProps {
    token: string;
    onEdit: (doc: any) => void;
    onCreate: () => void;
}

export const AdminLegalList = ({ token, onEdit, onCreate }: AdminLegalListProps) => {
    const [docs, setDocs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const notify = useNotification();
    const confirm = useConfirm();
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");

    const API_URL = import.meta.env.VITE_API_URL || "/api";

    const fetchDocs = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/index.php?action=get_legal_docs_admin`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setDocs(data.data);
            } else {
                notify.error(data.error || "Doküman listesi alınamadı");
            }
        } catch (err) {
            notify.error("Bağlantı hatası");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocs();
    }, []);

    const handleDelete = async (id: number) => {
        const isConfirmed = await confirm({
            title: 'Dokümanı Sil',
            message: "Bu dokümanı silmek istediğinize emin misiniz?",
            confirmLabel: 'Sil',
            cancelLabel: 'İptal',
            type: 'danger'
        });

        if (!isConfirmed) return;

        try {
            const response = await fetch(`${API_URL}/index.php?action=delete_legal_doc`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ id }),
            });
            const data = await response.json();
            if (data.success) {
                setDocs(docs.filter(d => d.id !== id));
                notify.success("Doküman başarıyla silindi");
            } else {
                notify.error("Silme hatası");
            }
        } catch (err) {
            notify.error("Bağlantı hatası");
        }
    };

    const toggleActive = async (id: number, current: boolean) => {
        // Since we don't have a direct toggle endpoint, we use save_legal_doc with existing data
        // Ideally backend should support individual field updates or we fetch full doc first.
        // For list view optimization, we can optimistically update or fetch-update.
        // But simplified: fetch single, update active, save.

        // OR better: Assume we have all data in 'docs' array (since it's not paginated server side heavily in this simple implementation)
        const doc = docs.find(d => d.id === id);
        if (!doc) return;

        try {
            const response = await fetch(`${API_URL}/index.php?action=save_legal_doc`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ ...doc, is_active: !current }),
            });
            const data = await response.json();
            if (data.success) {
                setDocs(docs.map(d => d.id === id ? { ...d, is_active: !current ? 1 : 0 } : d));
                notify.success("Durum güncellendi");
            } else {
                notify.error("Güncelleme hatası");
            }
        } catch (err) {
            notify.error("Bağlantı hatası");
        }
    };

    // Simple client-side search since list is small
    const filteredDocs = docs.filter(d =>
        d.title_tr.toLowerCase().includes(search.toLowerCase()) ||
        d.key.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h2 className="text-xl font-bold flex items-center gap-2 mb-1">
                        <FileText className="text-slate-900" /> Hukuki Dokümanlar
                    </h2>
                    <p className="text-slate-500 text-sm">Sözleşme ve politikaları yönetin.</p>
                </div>

                <button
                    type="button"
                    onClick={onCreate}
                    className="bg-slate-900 text-white px-4 py-2 rounded-xl font-bold hover:bg-rose-600 transition-all flex items-center gap-2 shadow-lg shadow-rose-200"
                >
                    <Plus size={18} /> Yeni Doküman
                </button>
            </div>

            {/* Filters */}
            <div className="p-4 bg-slate-50 border-b border-slate-100">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Başlık veya key ara..."
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-rose-500"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-white text-slate-500 text-xs uppercase font-bold border-b border-slate-100">
                        <tr>
                            <th className="p-4">Başlık / Key</th>
                            <th className="p-4 w-32">Etkin Tarih</th>
                            <th className="p-4 w-24">Aktif</th>
                            <th className="p-4 w-20">Sıra</th>
                            <th className="p-4 text-right w-32">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {loading ? (
                            <tr><td colSpan={5} className="p-8 text-center text-slate-400"><Loader2 className="animate-spin mx-auto" /></td></tr>
                        ) : filteredDocs.length === 0 ? (
                            <tr><td colSpan={5} className="p-8 text-center text-slate-500">Doküman bulunamadı.</td></tr>
                        ) : (
                            filteredDocs.map(doc => (
                                <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-4">
                                        <div className="font-medium text-slate-900">{doc.title_tr}</div>
                                        <div className="text-xs text-slate-400 font-mono mt-1">{doc.key}</div>
                                    </td>
                                    <td className="p-4 text-sm text-slate-600">
                                        {doc.effective_date || "-"}
                                    </td>
                                    <td className="p-4">
                                        <button
                                            onClick={() => toggleActive(doc.id, Boolean(Number(doc.is_active)))}
                                            className={`p-2 rounded-lg transition-colors ${Number(doc.is_active) ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-400'}`}
                                        >
                                            {Number(doc.is_active) ? <Eye size={16} /> : <EyeOff size={16} />}
                                        </button>
                                    </td>
                                    <td className="p-4 text-sm text-slate-500 font-mono">{doc.sort_order}</td>
                                    <td className="p-4 text-right space-x-2">
                                        <button onClick={() => onEdit(doc)} className="p-2 bg-white border border-slate-200 rounded-lg hover:border-cyan-500 hover:text-cyan-600 transition-all shadow-sm">
                                            <Edit2 size={16} />
                                        </button>
                                        <button onClick={() => handleDelete(doc.id)} className="p-2 bg-white border border-slate-200 rounded-lg hover:border-red-500 hover:text-red-600 transition-all shadow-sm">
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
