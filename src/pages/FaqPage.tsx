import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown, ChevronUp, Search, HelpCircle } from "lucide-react";

interface FAQ {
    id: number;
    question: string;
    answer: string;
    category: string;
}

interface FaqPageProps {
    setView: (view: string) => void;
}

export const FaqPage = ({ setView: _setView }: FaqPageProps) => {
    const { i18n } = useTranslation();
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [openItems, setOpenItems] = useState<Set<number>>(new Set());
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");

    const API_URL = import.meta.env.VITE_API_URL || "/api";

    useEffect(() => {
        const fetchFaqs = async () => {
            try {
                const response = await fetch(`${API_URL}/index.php?action=get_faqs_public&language=${i18n.language}`);
                const data = await response.json();
                if (data.success) {
                    setFaqs(data.data);
                    setCategories(data.categories || []);
                }
            } catch (err) {
                console.error("FAQ fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchFaqs();
    }, [i18n.language, API_URL]);

    const toggleItem = (id: number) => {
        setOpenItems(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const filteredFaqs = faqs.filter(faq => {
        const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    // Group by category
    const groupedFaqs: { [key: string]: FAQ[] } = {};
    filteredFaqs.forEach(faq => {
        if (!groupedFaqs[faq.category]) {
            groupedFaqs[faq.category] = [];
        }
        groupedFaqs[faq.category].push(faq);
    });

    return (
        <>
            {/* Hero */}
            <section className="pt-32 pb-16 px-6 bg-gradient-to-br from-rose-50 via-white to-cyan-50">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-100 text-rose-700 rounded-full font-bold text-sm mb-6">
                        <HelpCircle size={16} /> Yardım Merkezi
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 font-heading">
                        Sıkça Sorulan Sorular
                    </h1>
                    <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
                        TURP platformu hakkında merak ettiklerinizi burada bulabilirsiniz.
                    </p>
                </div>
            </section>

            {/* Search & Filter */}
            <section className="py-8 px-6 border-b border-slate-100 bg-white sticky top-16 z-10">
                <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Soru ara..."
                            className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-rose-500 transition-colors"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </div>
                    {categories.length > 1 && (
                        <select
                            className="p-3 border border-slate-200 rounded-xl outline-none focus:border-rose-500 bg-white min-w-[200px]"
                            value={selectedCategory}
                            onChange={e => setSelectedCategory(e.target.value)}
                        >
                            <option value="all">Tüm Kategoriler</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    )}
                </div>
            </section>

            {/* FAQ List */}
            <section className="py-16 px-6">
                <div className="max-w-4xl mx-auto">
                    {loading ? (
                        <div className="text-center py-12 text-slate-500">Yükleniyor...</div>
                    ) : filteredFaqs.length === 0 ? (
                        <div className="text-center py-12 text-slate-500">
                            {searchQuery ? "Aramanızla eşleşen soru bulunamadı." : "Henüz SSS eklenmemiş."}
                        </div>
                    ) : (
                        Object.entries(groupedFaqs).map(([category, items]) => (
                            <div key={category} className="mb-12">
                                <h2 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
                                    <span className="w-2 h-2 bg-rose-500 rounded-full"></span>
                                    {category}
                                </h2>
                                <div className="space-y-3">
                                    {items.map(faq => (
                                        <div
                                            key={faq.id}
                                            className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-rose-200 transition-colors"
                                        >
                                            <button
                                                onClick={() => toggleItem(faq.id)}
                                                className="w-full p-5 flex items-center justify-between text-left"
                                            >
                                                <span className="font-bold text-slate-900 pr-4">{faq.question}</span>
                                                {openItems.has(faq.id) ? (
                                                    <ChevronUp className="text-rose-500 shrink-0" size={20} />
                                                ) : (
                                                    <ChevronDown className="text-slate-400 shrink-0" size={20} />
                                                )}
                                            </button>
                                            {openItems.has(faq.id) && (
                                                <div className="px-5 pb-5 text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                                                    {faq.answer}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>
        </>
    );
};
