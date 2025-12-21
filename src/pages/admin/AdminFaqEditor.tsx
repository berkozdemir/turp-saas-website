import { useState, useEffect } from "react";
import { ArrowLeft, Save, Loader2, Globe, Star, Eye, Hash, Plus, Languages, Sparkles } from "lucide-react";

interface AdminFaqEditorProps {
    token: string;
    faq: any | null;
    onCancel: () => void;
    onSave: () => void;
}

export const AdminFaqEditor = ({ token, faq, onCancel, onSave }: AdminFaqEditorProps) => {
    // Turkish (primary)
    const [question, setQuestion] = useState(faq?.question || "");
    const [answer, setAnswer] = useState(faq?.answer || "");

    // English translations
    const [questionEn, setQuestionEn] = useState(faq?.question_en || "");
    const [answerEn, setAnswerEn] = useState(faq?.answer_en || "");

    // Chinese translations
    const [questionZh, setQuestionZh] = useState(faq?.question_zh || "");
    const [answerZh, setAnswerZh] = useState(faq?.answer_zh || "");

    const [category, setCategory] = useState(faq?.category || "Genel");
    const [newCategory, setNewCategory] = useState("");
    const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
    const [categories, setCategories] = useState<string[]>(["Genel", "Hastalar", "Araştırıcılar", "Teknik", "Fiyatlandırma"]);
    const [isShowcased, setIsShowcased] = useState(Boolean(Number(faq?.is_showcased)));
    const [isActive, setIsActive] = useState(faq ? Boolean(Number(faq.is_active)) : true);
    const [sortOrder, setSortOrder] = useState(faq?.sort_order || 0);
    const [saving, setSaving] = useState(false);
    const [translating, setTranslating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [translateSuccess, setTranslateSuccess] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL || "/api";
    const isEditing = Boolean(faq?.id);

    // Fetch existing categories from settings
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${API_URL}/index.php?action=get_settings`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await response.json();
                if (data.success && data.data?.faq_categories) {
                    const cats = data.data.faq_categories.split(',').map((c: string) => c.trim()).filter((c: string) => c);
                    if (cats.length > 0) {
                        setCategories(cats);
                        if (faq?.category && !cats.includes(faq.category)) {
                            setCategories([...cats, faq.category]);
                        }
                    }
                }
            } catch (err) {
                console.error("Categories fetch error:", err);
            }
        };
        fetchCategories();
    }, [token, API_URL, faq?.category]);

    const handleAddCategory = () => {
        if (newCategory.trim() && !categories.includes(newCategory.trim())) {
            const updatedCategories = [...categories, newCategory.trim()];
            setCategories(updatedCategories);
            setCategory(newCategory.trim());
            setNewCategory("");
            setShowNewCategoryInput(false);

            fetch(`${API_URL}/index.php?action=update_settings`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ faq_categories: updatedCategories.join(', ') }),
            }).catch(err => console.error("Category save error:", err));
        }
    };

    // AI Translation
    const handleTranslate = async () => {
        if (!question.trim() || !answer.trim()) {
            setError("Çeviri için önce Türkçe soru ve cevap girin.");
            return;
        }

        setTranslating(true);
        setError(null);
        setTranslateSuccess(false);

        try {
            const response = await fetch(`${API_URL}/index.php?action=translate_faq_all`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    question_tr: question,
                    answer_tr: answer
                }),
            });

            const data = await response.json();

            if (data.success && data.translations) {
                setQuestionEn(data.translations.en.question);
                setAnswerEn(data.translations.en.answer);
                setQuestionZh(data.translations.zh.question);
                setAnswerZh(data.translations.zh.answer);
                setTranslateSuccess(true);
                setTimeout(() => setTranslateSuccess(false), 3000);
            } else {
                setError(data.error || "Çeviri başarısız");
            }
        } catch (err) {
            setError("Çeviri bağlantı hatası");
        } finally {
            setTranslating(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!question.trim() || !answer.trim()) {
            setError("Soru ve cevap alanları zorunludur.");
            return;
        }

        setSaving(true);

        try {
            const action = isEditing ? 'update_faq' : 'create_faq';
            const payload: any = {
                question,
                answer,
                question_en: questionEn,
                answer_en: answerEn,
                question_zh: questionZh,
                answer_zh: answerZh,
                category,
                is_showcased: isShowcased,
                is_active: isActive,
                sort_order: sortOrder
            };

            if (isEditing) payload.id = faq.id;

            const response = await fetch(`${API_URL}/index.php?action=${action}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (data.success) {
                onSave();
            } else {
                setError(data.error || "Kayıt başarısız");
            }
        } catch (err) {
            setError("Bağlantı hatası");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onCancel}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="text-slate-500" />
                    </button>
                    <div>
                        <h2 className="text-xl font-bold">
                            {isEditing ? "SSS Düzenle" : "Yeni SSS Ekle"}
                        </h2>
                        <p className="text-slate-500 text-sm">Sık sorulan soruları buradan yönetin.</p>
                    </div>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-8 max-w-4xl space-y-6">
                {error && (
                    <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl font-medium">
                        {error}
                    </div>
                )}

                {translateSuccess && (
                    <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl font-medium flex items-center gap-2">
                        <Sparkles size={18} /> Çeviriler başarıyla oluşturuldu!
                    </div>
                )}

                {/* Turkish (Primary) */}
                <div className="bg-rose-50 p-6 rounded-xl border border-rose-100">
                    <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <Globe size={18} className="text-rose-600" /> Türkçe (Ana İçerik)
                    </h3>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Soru <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                className="w-full p-3 border border-slate-200 rounded-xl focus:border-rose-500 outline-none bg-white"
                                value={question}
                                onChange={e => setQuestion(e.target.value)}
                                placeholder="Örn: e-Nabız entegrasyonu nasıl çalışır?"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Cevap <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                className="w-full p-3 border border-slate-200 rounded-xl focus:border-rose-500 outline-none resize-none h-32 bg-white"
                                value={answer}
                                onChange={e => setAnswer(e.target.value)}
                                placeholder="Sorunun cevabını buraya yazın..."
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* AI Translate Button */}
                <div className="flex justify-center">
                    <button
                        type="button"
                        onClick={handleTranslate}
                        disabled={translating || !question.trim() || !answer.trim()}
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    >
                        {translating ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                Çeviriliyor...
                            </>
                        ) : (
                            <>
                                <Languages size={20} />
                                🤖 AI ile Çevir (EN + ZH)
                            </>
                        )}
                    </button>
                </div>

                {/* English */}
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                    <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <Globe size={18} className="text-blue-600" /> English
                    </h3>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Question</label>
                            <input
                                type="text"
                                className="w-full p-3 border border-slate-200 rounded-xl focus:border-blue-500 outline-none bg-white"
                                value={questionEn}
                                onChange={e => setQuestionEn(e.target.value)}
                                placeholder="English question..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Answer</label>
                            <textarea
                                className="w-full p-3 border border-slate-200 rounded-xl focus:border-blue-500 outline-none resize-none h-24 bg-white"
                                value={answerEn}
                                onChange={e => setAnswerEn(e.target.value)}
                                placeholder="English answer..."
                            />
                        </div>
                    </div>
                </div>

                {/* Chinese */}
                <div className="bg-amber-50 p-6 rounded-xl border border-amber-100">
                    <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <Globe size={18} className="text-amber-600" /> 中文
                    </h3>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">问题</label>
                            <input
                                type="text"
                                className="w-full p-3 border border-slate-200 rounded-xl focus:border-amber-500 outline-none bg-white"
                                value={questionZh}
                                onChange={e => setQuestionZh(e.target.value)}
                                placeholder="Chinese question..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">回答</label>
                            <textarea
                                className="w-full p-3 border border-slate-200 rounded-xl focus:border-amber-500 outline-none resize-none h-24 bg-white"
                                value={answerZh}
                                onChange={e => setAnswerZh(e.target.value)}
                                placeholder="Chinese answer..."
                            />
                        </div>
                    </div>
                </div>

                {/* Category & Settings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                            <Hash size={14} /> Kategori
                        </label>
                        {showNewCategoryInput ? (
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    className="flex-1 p-3 border border-slate-200 rounded-xl focus:border-rose-500 outline-none"
                                    value={newCategory}
                                    onChange={e => setNewCategory(e.target.value)}
                                    placeholder="Yeni kategori adı..."
                                    autoFocus
                                />
                                <button
                                    type="button"
                                    onClick={handleAddCategory}
                                    className="px-4 py-2 bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition-colors"
                                >
                                    <Plus size={18} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setShowNewCategoryInput(false); setNewCategory(""); }}
                                    className="px-4 py-2 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 transition-colors"
                                >
                                    İptal
                                </button>
                            </div>
                        ) : (
                            <div className="flex gap-2">
                                <select
                                    className="flex-1 p-3 border border-slate-200 rounded-xl focus:border-rose-500 outline-none bg-white"
                                    value={category}
                                    onChange={e => setCategory(e.target.value)}
                                >
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                                <button
                                    type="button"
                                    onClick={() => setShowNewCategoryInput(true)}
                                    className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors flex items-center gap-1"
                                    title="Yeni kategori ekle"
                                >
                                    <Plus size={16} /> Yeni
                                </button>
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Sıralama</label>
                        <input
                            type="number"
                            className="w-full p-3 border border-slate-200 rounded-xl focus:border-rose-500 outline-none"
                            value={sortOrder}
                            onChange={e => setSortOrder(Number(e.target.value))}
                            min={0}
                        />
                    </div>
                </div>

                {/* Toggles */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100">
                        <input
                            type="checkbox"
                            id="showcased"
                            checked={isShowcased}
                            onChange={e => setIsShowcased(e.target.checked)}
                            className="w-5 h-5 accent-amber-500"
                        />
                        <label htmlFor="showcased" className="flex items-center gap-2 cursor-pointer">
                            <Star size={18} className="text-amber-500" />
                            <span className="font-medium text-slate-700">Ana Sayfada Göster</span>
                        </label>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-100">
                        <input
                            type="checkbox"
                            id="active"
                            checked={isActive}
                            onChange={e => setIsActive(e.target.checked)}
                            className="w-5 h-5 accent-green-500"
                        />
                        <label htmlFor="active" className="flex items-center gap-2 cursor-pointer">
                            <Eye size={18} className="text-green-500" />
                            <span className="font-medium text-slate-700">Aktif</span>
                        </label>
                    </div>
                </div>

                {/* Submit */}
                <div className="pt-4 flex gap-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                    >
                        İptal
                    </button>
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-6 py-3 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                        {saving ? 'Kaydediliyor...' : isEditing ? 'Güncelle' : 'Kaydet'}
                    </button>
                </div>
            </form>
        </div>
    );
};
