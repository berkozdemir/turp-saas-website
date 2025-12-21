import { useState } from "react";
import { ArrowLeft, Save, Loader2, Globe, Star, Eye, Hash } from "lucide-react";

interface AdminFaqEditorProps {
    token: string;
    faq: any | null;
    onCancel: () => void;
    onSave: () => void;
}

export const AdminFaqEditor = ({ token, faq, onCancel, onSave }: AdminFaqEditorProps) => {
    const [question, setQuestion] = useState(faq?.question || "");
    const [answer, setAnswer] = useState(faq?.answer || "");
    const [category, setCategory] = useState(faq?.category || "Genel");
    const [language, setLanguage] = useState(faq?.language || "tr");
    const [isShowcased, setIsShowcased] = useState(Boolean(Number(faq?.is_showcased)));
    const [isActive, setIsActive] = useState(faq ? Boolean(Number(faq.is_active)) : true);
    const [sortOrder, setSortOrder] = useState(faq?.sort_order || 0);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const API_URL = import.meta.env.VITE_API_URL || "/api";
    const isEditing = Boolean(faq?.id);

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
                category,
                language,
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
            <form onSubmit={handleSubmit} className="p-8 max-w-3xl space-y-6">
                {error && (
                    <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl font-medium">
                        {error}
                    </div>
                )}

                {/* Question */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                        Soru <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        className="w-full p-3 border border-slate-200 rounded-xl focus:border-rose-500 outline-none"
                        value={question}
                        onChange={e => setQuestion(e.target.value)}
                        placeholder="Örn: e-Nabız entegrasyonu nasıl çalışır?"
                        required
                    />
                </div>

                {/* Answer */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                        Cevap <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        className="w-full p-3 border border-slate-200 rounded-xl focus:border-rose-500 outline-none resize-none h-40"
                        value={answer}
                        onChange={e => setAnswer(e.target.value)}
                        placeholder="Sorunun cevabını buraya yazın..."
                        required
                    />
                    <p className="text-xs text-slate-400 mt-1">Markdown desteklenir.</p>
                </div>

                {/* Category & Language */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                            <Hash size={14} /> Kategori
                        </label>
                        <select
                            className="w-full p-3 border border-slate-200 rounded-xl focus:border-rose-500 outline-none bg-white"
                            value={category}
                            onChange={e => setCategory(e.target.value)}
                        >
                            <option value="Genel">Genel</option>
                            <option value="Hastalar">Hastalar</option>
                            <option value="Araştırıcılar">Araştırıcılar</option>
                            <option value="Teknik">Teknik</option>
                            <option value="Fiyatlandırma">Fiyatlandırma</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                            <Globe size={14} /> Dil
                        </label>
                        <select
                            className="w-full p-3 border border-slate-200 rounded-xl focus:border-rose-500 outline-none bg-white"
                            value={language}
                            onChange={e => setLanguage(e.target.value)}
                        >
                            <option value="tr">Türkçe</option>
                            <option value="en">English</option>
                            <option value="zh">中文</option>
                        </select>
                    </div>
                </div>

                {/* Toggles & Sort Order */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
