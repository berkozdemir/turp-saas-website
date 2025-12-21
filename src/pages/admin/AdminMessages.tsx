import { useState, useEffect } from "react";
import { Mail, Eye, CheckCircle, Archive, X, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useNotification } from "../../components/NotificationProvider";

interface AdminMessagesProps {
    token: string;
}

export const AdminMessages = ({ token }: AdminMessagesProps) => {
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const notify = useNotification();
    const [filter, setFilter] = useState("all"); // all, new, read, archived
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedMessage, setSelectedMessage] = useState<any | null>(null);

    const [actionLoading, setActionLoading] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL || "/api";

    const fetchMessages = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `${API_URL}/index.php?action=get_messages&status=${filter}&page=${page}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const data = await response.json();
            if (data.success) {
                setMessages(data.data);
                setTotalPages(data.pagination.pages);
            } else {
                notify.error("Mesajlar yüklenirken hata oluştu: " + (data.error || "Bilinmeyen hata"));
            }
        } catch (err) {
            console.error(err);
            notify.error("Bağlantı hatası");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, [filter, page]);

    const updateStatus = async (id: number, status: string) => {
        setActionLoading(true);
        try {
            const response = await fetch(`${API_URL}/index.php?action=update_message_status`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ id, status }),
            });
            const data = await response.json();

            if (data.success) {
                // Update local state or refetch
                setMessages(messages.map(m => m.id === id ? { ...m, status } : m));
                if (selectedMessage?.id === id) {
                    setSelectedMessage({ ...selectedMessage, status });
                }
                notify.success(status === 'read' ? 'Mesaj okundu olarak işaretlendi' : status === 'archived' ? 'Mesaj arşivlendi' : 'Durum güncellendi');
            } else {
                notify.error("Güncelleme hatası");
            }
        } catch (err) {
            notify.error("Bağlantı hatası");
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <Mail className="text-cyan-600" /> Mesaj Kutusu
                </h2>

                <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-lg border border-slate-200">
                    {["all", "new", "read", "archived"].map((f) => (
                        <button
                            key={f}
                            onClick={() => { setFilter(f); setPage(1); }}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${filter === f
                                ? "bg-white text-cyan-700 shadow-sm border border-slate-100"
                                : "text-slate-500 hover:text-slate-700"
                                }`}
                        >
                            {f === "all" ? "Tümü" : f === "new" ? "Yeni" : f === "read" ? "Okunmuş" : "Arşiv"}
                        </button>
                    ))}
                </div>
            </div>

            {/* List */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                        <tr>
                            <th className="p-4 border-b">Durum</th>
                            <th className="p-4 border-b">Gönderen</th>
                            <th className="p-4 border-b">Konu</th>
                            <th className="p-4 border-b">Tarih</th>
                            <th className="p-4 border-b text-right">İşlem</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-slate-500">
                                    <Loader2 className="animate-spin mx-auto w-8 h-8 opacity-50" />
                                </td>
                            </tr>
                        ) : messages.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-slate-500">
                                    Mesaj bulunamadı.
                                </td>
                            </tr>
                        ) : (
                            messages.map((msg) => (
                                <tr
                                    key={msg.id}
                                    className={`hover:bg-slate-50 transition-colors cursor-pointer ${msg.status === 'new' ? 'bg-cyan-50/30' : ''}`}
                                    onClick={() => setSelectedMessage(msg)}
                                >
                                    <td className="p-4">
                                        <span className={`inline-block w-2.5 h-2.5 rounded-full ${msg.status === 'new' ? 'bg-green-500' :
                                            msg.status === 'read' ? 'bg-slate-300' : 'bg-orange-300'
                                            }`}></span>
                                        <span className="ml-2 text-xs font-medium text-slate-500 uppercase">{msg.status}</span>
                                    </td>
                                    <td className="p-4">
                                        <div className="font-semibold text-slate-900">{msg.full_name}</div>
                                        <div className="text-xs text-slate-500">{msg.email}</div>
                                    </td>
                                    <td className="p-4 text-slate-700 font-medium">
                                        {msg.subject}
                                    </td>
                                    <td className="p-4 text-slate-500 text-sm">
                                        {new Date(msg.created_at).toLocaleDateString("tr-TR")}
                                    </td>
                                    <td className="p-4 text-right">
                                        <button
                                            className="p-2 text-slate-400 hover:text-cyan-600 transition-colors"
                                            onClick={(e) => { e.stopPropagation(); setSelectedMessage(msg); }}
                                        >
                                            <Eye size={18} />
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
                        disabled={page === 1}
                        onClick={() => setPage(p => p - 1)}
                        className="p-2 border rounded hover:bg-slate-50 disabled:opacity-50"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <span className="px-4 py-2 text-sm text-slate-600 font-medium">
                        Sayfa {page} / {totalPages}
                    </span>
                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage(p => p + 1)}
                        className="p-2 border rounded hover:bg-slate-50 disabled:opacity-50"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            )}

            {/* Modal */}
            {selectedMessage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center p-6 border-b border-slate-100">
                            <h3 className="text-xl font-bold text-slate-900">{selectedMessage.subject}</h3>
                            <button
                                onClick={() => setSelectedMessage(null)}
                                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                            >
                                <X size={20} className="text-slate-500" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <label className="block text-slate-400 text-xs uppercase font-bold mb-1">Gönderen</label>
                                    <div className="font-medium text-slate-900">{selectedMessage.full_name}</div>
                                    <div className="text-cyan-600">{selectedMessage.email}</div>
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-xs uppercase font-bold mb-1">Tarih</label>
                                    <div className="font-medium text-slate-900">
                                        {new Date(selectedMessage.created_at).toLocaleString("tr-TR")}
                                    </div>
                                </div>
                                {selectedMessage.organization && (
                                    <div className="col-span-2">
                                        <label className="block text-slate-400 text-xs uppercase font-bold mb-1">Kurum / Organizasyon</label>
                                        <div className="font-medium text-slate-900">{selectedMessage.organization}</div>
                                    </div>
                                )}
                            </div>

                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 text-slate-800 leading-relaxed whitespace-pre-wrap">
                                {selectedMessage.message_body}
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                <div className="flex gap-2">
                                    {selectedMessage.status !== 'read' && (
                                        <button
                                            onClick={() => updateStatus(selectedMessage.id, 'read')}
                                            disabled={actionLoading}
                                            className="bg-white border border-green-200 text-green-700 hover:bg-green-50 px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2"
                                        >
                                            <CheckCircle size={16} /> Okundu İşaretle
                                        </button>
                                    )}
                                    {selectedMessage.status !== 'archived' && (
                                        <button
                                            onClick={() => updateStatus(selectedMessage.id, 'archived')}
                                            disabled={actionLoading}
                                            className="bg-white border border-orange-200 text-orange-700 hover:bg-orange-50 px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2"
                                        >
                                            <Archive size={16} /> Arşivle
                                        </button>
                                    )}
                                </div>

                                <a
                                    href={`mailto:${selectedMessage.email}?subject=RE: ${selectedMessage.subject}`}
                                    className="bg-cyan-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-cyan-700 transition-colors shadow-lg shadow-cyan-200"
                                >
                                    Yanıtla
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
