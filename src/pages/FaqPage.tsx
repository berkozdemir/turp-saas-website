import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown, ChevronUp, Search, HelpCircle } from "lucide-react";

import { fetchAPI } from "../lib/contentApi";

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
    const { t, i18n } = useTranslation();
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [openItems, setOpenItems] = useState<Set<number>>(new Set());
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");

    useEffect(() => {
        const fetchFaqs = async () => {
            try {
                const data = await fetchAPI('get_faqs_public', { language: i18n.language });
                if (data && data.success) {
                    setFaqs(data.data || []);
                    setCategories(data.categories || []);
                }
            } catch (err) {
                console.error("FAQ fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchFaqs();
    }, [i18n.language]);

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
            {/* Hero */}
            <section className="relative py-32 px-6 overflow-hidden flex items-center justify-center min-h-[50vh]">
                <div className="absolute inset-0 z-0">
                    <img
                        src="/faq_hero.jpg"
                        alt="FAQ"
                        className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-rose-900 via-slate-900 to-slate-900 opacity-90 mix-blend-multiply"></div>
                </div>

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-full font-bold text-sm mb-6 shadow-xl">
                        <HelpCircle size={16} /> {t("faq_page.help_center")}
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 font-heading drop-shadow-lg">
                        {t("faq_page.title")}
                    </h1>
                    <p className="text-xl text-slate-200 leading-relaxed max-w-2xl mx-auto font-light">
                        {t("faq_page.subtitle")}
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
                            placeholder={t("faq_page.search_placeholder")}
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
                            <option value="all">{t("faq_page.all_categories")}</option>
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
                        <div className="text-center py-12 text-slate-500">{t("faq_page.loading")}</div>
                    ) : filteredFaqs.length === 0 ? (
                        <div className="text-center py-12 text-slate-500">
                            {searchQuery ? t("faq_page.no_results") : t("faq_page.no_faqs")}
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
