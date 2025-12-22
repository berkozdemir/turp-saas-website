import { useState, useEffect } from "react";
import { Search, Plus, Edit2, Trash2, Globe, Star, StarOff, Eye, EyeOff, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/iwrs/hooks/use-toast";
import { faqApi } from "@/iwrs/lib/api";

interface AdminFaqListProps {
    onEdit: (faq: any) => void;
    onCreate: () => void;
}

export const AdminFaqList = ({ onEdit, onCreate }: AdminFaqListProps) => {
    const [faqs, setFaqs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();
    const [filterLang, setFilterLang] = useState("all");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    // Client-side pagination for now
    const ITEMS_PER_PAGE = 10;

    const fetchFaqs = async () => {
        setLoading(true);
        try {
            const data = await faqApi.getAll();
            setFaqs(data || []);
        } catch (err) {
            toast({ title: "Hata", description: "SSS listesi alınamadı", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFaqs();
    }, []);

    const handleDelete = async (id: number) => {
        if (!confirm("Bu SSS'yi silmek istediğinize emin misiniz?")) return;

        try {
            await faqApi.delete(id);
            setFaqs(faqs.filter(f => f.id !== id));
            toast({ title: "Başarılı", description: "SSS silindi" });
        } catch (err) {
            toast({ title: "Hata", description: "Silme işlemi başarısız", variant: "destructive" });
        }
    };

    const toggleField = async (id: number, field: 'is_showcased' | 'is_active', currentValue: any) => {
        const faq = faqs.find(f => f.id === id);
        if (!faq) return;

        // Toggle value (1 -> 0, 0 -> 1)
        const newValue = currentValue == 1 ? 0 : 1;

        try {
            await faqApi.update(id, { ...faq, [field]: newValue });
            setFaqs(faqs.map(f => f.id === id ? { ...f, [field]: newValue } : f));
        } catch (err) {
            console.error(err);
        }
    };

    // Filter and Pagination Logic
    const filteredFaqs = faqs.filter(faq => {
        if (filterLang !== "all" && faq.language !== filterLang) return false;
        if (search && !faq.question.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
    });

    const totalPages = Math.ceil(filteredFaqs.length / ITEMS_PER_PAGE);
    const paginatedFaqs = filteredFaqs.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h2 className="text-xl font-bold flex items-center gap-2 mb-1">
                        ❓ Sıkça Sorulan Sorular
                    </h2>
                    <p className="text-slate-500 text-sm">SSS içeriklerini buradan yönetin.</p>
                </div>

                <button
                    type="button"
                    onClick={onCreate}
                    className="bg-slate-900 text-white px-4 py-2 rounded-xl font-bold hover:bg-rose-600 transition-all flex items-center gap-2 shadow-lg shadow-rose-200"
                >
                    <Plus size={18} /> Yeni SSS Ekle
                </button>
            </div>

            {/* Filters */}
            <div className="p-4 bg-slate-50 border-b border-slate-100 flex flex-wrap gap-4 items-center">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Soruda ara..."
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-rose-500"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <select
                    className="p-2 border border-slate-200 rounded-lg outline-none focus:border-rose-500 bg-white"
                    value={filterLang}
                    onChange={e => setFilterLang(e.target.value)}
                >
                    <option value="all">Tüm Diller</option>
                    <option value="tr">Türkçe</option>
                    <option value="en">English</option>
                </select>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-white text-slate-500 text-xs uppercase font-bold border-b border-slate-100">
                        <tr>
                            <th className="p-4">Soru</th>
                            <th className="p-4 w-20">Dil</th>
                            <th className="p-4 w-24">Vitrin</th>
                            <th className="p-4 w-24">Aktif</th>
                            <th className="p-4 w-20">Sıra</th>
                            <th className="p-4 text-right w-32">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {loading ? (
                            <tr><td colSpan={6} className="p-8 text-center text-slate-400"><Loader2 className="animate-spin mx-auto" /></td></tr>
                        ) : filteredFaqs.length === 0 ? (
                            <tr><td colSpan={6} className="p-8 text-center text-slate-500">SSS bulunamadı.</td></tr>
                        ) : (
                            paginatedFaqs.map(faq => (
                                <tr key={faq.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-4">
                                        <div className="font-medium text-slate-900 line-clamp-2">{faq.question}</div>
                                        <div className="text-xs text-slate-400 mt-1">{faq.category}</div>
                                    </td>
                                    <td className="p-4">
                                        <span className="flex items-center gap-1 text-sm text-slate-600 uppercase font-bold">
                                            <Globe size={14} className="text-slate-400" /> {faq.language}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <button
                                            onClick={() => toggleField(faq.id, 'is_showcased', faq.is_showcased)}
                                            className={`p-2 rounded-lg transition-colors ${Number(faq.is_showcased) ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-400'}`}
                                        >
                                            {Number(faq.is_showcased) ? <Star size={16} /> : <StarOff size={16} />}
                                        </button>
                                    </td>
                                    <td className="p-4">
                                        <button
                                            onClick={() => toggleField(faq.id, 'is_active', faq.is_active)}
                                            className={`p-2 rounded-lg transition-colors ${Number(faq.is_active) ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-400'}`}
                                        >
                                            {Number(faq.is_active) ? <Eye size={16} /> : <EyeOff size={16} />}
                                        </button>
                                    </td>
                                    <td className="p-4 text-sm text-slate-500 font-mono">{faq.sort_order}</td>
                                    <td className="p-4 text-right space-x-2">
                                        <button onClick={() => onEdit(faq)} className="p-2 bg-white border border-slate-200 rounded-lg hover:border-cyan-500 hover:text-cyan-600 transition-all shadow-sm">
                                            <Edit2 size={16} />
                                        </button>
                                        <button onClick={() => handleDelete(faq.id)} className="p-2 bg-white border border-slate-200 rounded-lg hover:border-red-500 hover:text-red-600 transition-all shadow-sm">
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
                    <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="p-2 border rounded hover:bg-slate-50 disabled:opacity-50">
                        <ChevronLeft size={16} />
                    </button>
                    <span className="px-4 py-2 text-sm text-slate-600 font-medium">{page} / {totalPages}</span>
                    <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="p-2 border rounded hover:bg-slate-50 disabled:opacity-50">
                        <ChevronRight size={16} />
                    </button>
                </div>
            )}
        </div>
    );
};
