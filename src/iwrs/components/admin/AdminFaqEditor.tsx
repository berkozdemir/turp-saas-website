import { useState, useEffect } from "react";
import { ArrowLeft, Save, Loader2, Globe, List, Wand2 } from "lucide-react";
import { useToast } from "@/iwrs/hooks/use-toast";
import { faqApi, translationApi } from "@/iwrs/lib/api";

interface AdminFaqEditorProps {
    faq: any | null; // null if creating new
    onSave: () => void;
    onCancel: () => void;
}

export const AdminFaqEditor = ({ faq, onSave, onCancel }: AdminFaqEditorProps) => {
    const [loading, setLoading] = useState(false);
    const [translateLoading, setTranslateLoading] = useState(false);
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        question: "",
        answer: "",
        language: "tr",
        category: "general",
        sort_order: 0,
        is_active: 1,
        is_showcased: 0
    });

    useEffect(() => {
        if (faq) {
            setFormData({
                question: faq.question || "",
                answer: faq.answer || "",
                language: faq.language || "tr",
                category: faq.category || "general",
                sort_order: faq.sort_order || 0,
                is_active: faq.is_active !== undefined ? Number(faq.is_active) : 1,
                is_showcased: faq.is_showcased !== undefined ? Number(faq.is_showcased) : 0
            });
        }
    }, [faq]);

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleAiTranslate = async () => {
        if (!formData.question && !formData.answer) {
            toast({ title: "Uyarı", description: "Çeviri için soru veya cevap girilmelidir.", variant: "destructive" });
            return;
        }

        setTranslateLoading(true);
        try {
            const result = await translationApi.translateFaq({
                question: formData.question,
                answer: formData.answer,
                target_language: 'en'
            });

            if (result) {
                setFormData(prev => ({
                    ...prev,
                    question: result.question || prev.question,
                    answer: result.answer || prev.answer,
                    language: 'en'
                }));
                toast({ title: "Çeviri Tamamlandı", description: "SSS İngilizceye çevrildi. Lütfen kontrol edip kaydedin." });
            }
        } catch (err) {
            toast({ title: "Hata", description: "Çeviri başarısız oldu.", variant: "destructive" });
        } finally {
            setTranslateLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const payload = { ...formData, id: faq?.id };

        try {
            if (faq) {
                await faqApi.update(faq.id, payload);
            } else {
                await faqApi.create(payload);
            }
            toast({ title: "Başarılı", description: "SSS kaydedildi" });
            onSave();
        } catch (err) {
            toast({ title: "Hata", description: "Kaydedilemedi", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <button onClick={onCancel} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-medium transition-colors">
                    <ArrowLeft size={18} /> Listeye Dön
                </button>
                <h2 className="text-xl font-bold text-slate-900">{faq ? 'SSS Düzenle' : 'Yeni SSS Ekle'}</h2>
                <button
                    type="button"
                    onClick={handleAiTranslate}
                    disabled={translateLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors font-medium text-sm disabled:opacity-50"
                >
                    {translateLoading ? <Loader2 className="animate-spin" size={16} /> : <Wand2 size={16} />}
                    AI ile Çevir
                </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 max-w-3xl mx-auto space-y-6">

                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Soru</label>
                    <input
                        type="text"
                        className="w-full p-3 border border-slate-200 rounded-xl focus:border-cyan-500 outline-none text-lg font-bold"
                        value={formData.question}
                        onChange={e => handleChange('question', e.target.value)}
                        placeholder="Sıkça sorulan soru..."
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Cevap</label>
                    <textarea
                        className="w-full p-4 border border-slate-200 rounded-xl focus:border-cyan-500 outline-none h-48 resize-none leading-relaxed"
                        value={formData.answer}
                        onChange={e => handleChange('answer', e.target.value)}
                        placeholder="Cevabı buraya yazın..."
                        required
                    ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                            <Globe size={16} className="text-slate-400" /> Dil
                        </label>
                        <select
                            className="w-full p-3 border border-slate-200 rounded-xl focus:border-cyan-500 outline-none bg-white"
                            value={formData.language}
                            onChange={e => handleChange('language', e.target.value)}
                        >
                            <option value="tr">🇹🇷 Türkçe</option>
                            <option value="en">🇬🇧 English</option>
                        </select>
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                            <List size={16} className="text-slate-400" /> Kategori
                        </label>
                        <input
                            type="text"
                            className="w-full p-3 border border-slate-200 rounded-xl focus:border-cyan-500 outline-none"
                            value={formData.category}
                            onChange={e => handleChange('category', e.target.value)}
                            placeholder="Örn: general, pricing"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-6 pt-4 border-t border-slate-100">
                    <label className="flex items-center gap-3 cursor-pointer p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                        <input
                            type="checkbox"
                            className="w-5 h-5 accent-emerald-500"
                            checked={!!Number(formData.is_active)}
                            onChange={e => handleChange('is_active', e.target.checked ? 1 : 0)}
                        />
                        <span className="font-bold text-slate-700">Aktif</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                        <input
                            type="checkbox"
                            className="w-5 h-5 accent-amber-500"
                            checked={!!Number(formData.is_showcased)}
                            onChange={e => handleChange('is_showcased', e.target.checked ? 1 : 0)}
                        />
                        <span className="font-bold text-slate-700">Vitrinde Göster</span>
                    </label>

                    <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Sıralama</label>
                        <input
                            type="number"
                            className="w-full p-2 border border-slate-200 rounded-lg outline-none"
                            value={formData.sort_order}
                            onChange={e => handleChange('sort_order', Number(e.target.value))}
                        />
                    </div>
                </div>

                <div className="pt-6">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-rose-600 hover:shadow-lg hover:shadow-rose-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                        {loading ? 'Kaydediliyor...' : 'Kaydet'}
                    </button>
                </div>

            </form>
        </div>
    );
};
