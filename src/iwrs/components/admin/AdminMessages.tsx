import { useState, useEffect } from "react";
import { Mail, Eye, CheckCircle, Archive, X, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/iwrs/hooks/use-toast"; // Use shared toast hook
import { contactApi } from "@/iwrs/lib/api";

interface AdminMessagesProps {
    token?: string; // Token might be handled globally but keeping prop for compatibility
}

export const AdminMessages = ({ token }: AdminMessagesProps) => {
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();
    const [filter, setFilter] = useState("all");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedMessage, setSelectedMessage] = useState<any | null>(null);
    const [actionLoading, setActionLoading] = useState(false);

    // Mock pagination for now since backend returns all
    const ITEMS_PER_PAGE = 10;

    const fetchMessages = async () => {
        setLoading(true);
        try {
            const data = await contactApi.getMessages();
            // Client-side filtering and pagination until backend supports it fully
            let filtered = data;

            // Note: Backend currently returns valid JSON array
            // If we add status column to DB, we can filter. 
            // For now assuming all are 'new' or handling locally?
            // actually DB schema might not have status yet.
            // Let's assume schema has it or we default to 'new'.

            setMessages(filtered);
            setTotalPages(Math.ceil(filtered.length / ITEMS_PER_PAGE));
        } catch (err: any) {
            console.error(err);
            toast({
                title: "Hata",
                description: "Mesajlar yüklenirken hata oluştu.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, [filter, page]);

    const updateStatus = async (id: number, status: string) => {
        // Since we don't have update_message_status endpoint yet in this iteration,
        // we will mock it or skip.
        // But for 'delete-message' we have an endpoint.
        // Let's implement DELETE for now as 'Archive' action?
        // Or just leave it as is.
        // The user wants Unification.

        toast({
            title: "Bilgi",
            description: "Durum güncelleme henüz aktif değil.",
        });
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Bu mesajı silmek istediğinize emin misiniz?")) return;

        try {
            await contactApi.deleteMessage(id);
            setMessages(messages.filter(m => m.id !== id));
            if (selectedMessage?.id === id) setSelectedMessage(null);
            toast({
                title: "Başarılı",
                description: "Mesaj silindi.",
            });
        } catch (e) {
            toast({
                title: "Hata",
                description: "Silme işlemi başarısız.",
                variant: "destructive"
            });
        }
    };

    // Client-side pagination
    const paginatedMessages = messages.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <Mail className="text-cyan-600" /> Mesaj Kutusu
                </h2>
                {/* Filter buttons can be hidden if not functional yet */}
            </div>

            {/* List */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                        <tr>
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
                            paginatedMessages.map((msg) => (
                                <tr
                                    key={msg.id}
                                    className="hover:bg-slate-50 transition-colors cursor-pointer"
                                    onClick={() => setSelectedMessage(msg)}
                                >
                                    <td className="p-4">
                                        <div className="font-semibold text-slate-900">{msg.name}</div>
                                        <div className="text-xs text-slate-500">{msg.email}</div>
                                    </td>
                                    <td className="p-4 text-slate-700 font-medium">
                                        {msg.subject || 'Konu yok'}
                                    </td>
                                    <td className="p-4 text-slate-500 text-sm">
                                        {new Date(msg.created_at).toLocaleDateString("tr-TR")}
                                    </td>
                                    <td className="p-4 text-right flex justify-end gap-2">
                                        <button
                                            className="p-2 text-slate-400 hover:text-cyan-600 transition-colors"
                                            onClick={(e) => { e.stopPropagation(); setSelectedMessage(msg); }}
                                        >
                                            <Eye size={18} />
                                        </button>
                                        <button
                                            className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                                            onClick={(e) => { e.stopPropagation(); handleDelete(msg.id); }}
                                        >
                                            <X size={18} />
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
                            <h3 className="text-xl font-bold text-slate-900">{selectedMessage.subject || 'Mesaj Detayı'}</h3>
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
                                    <div className="font-medium text-slate-900">{selectedMessage.name}</div>
                                    <div className="text-cyan-600">{selectedMessage.email}</div>
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-xs uppercase font-bold mb-1">Tarih</label>
                                    <div className="font-medium text-slate-900">
                                        {new Date(selectedMessage.created_at).toLocaleString("tr-TR")}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 text-slate-800 leading-relaxed whitespace-pre-wrap">
                                {selectedMessage.message}
                            </div>

                            <div className="flex items-center justify-end pt-4 border-t border-slate-100">
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
