/**
 * Component: Admin Legal Editor
 * Context: Modal in Admin Legal List
 * Description:
 *   - Form to edit legal document content.
 *   - Supports multilingual AI translation (TR -> EN, etc.).
 * Related:
 *   - API: ?action=legal_admin_save
 */
import React, { useState } from 'react';
import { ArrowLeft, Save, Loader2, Globe, Eye, Hash, Languages, Sparkles, Calendar } from "lucide-react";
import { getTenantHeader } from "../../context/TenantContext";

interface AdminLegalEditorProps {
    token: string;
    doc: any | null;
    onCancel: () => void;
    onSave: () => void;
}

export const AdminLegalEditor = ({ token, doc, onCancel, onSave }: AdminLegalEditorProps) => {
    // Basic Info
    const [key, setKey] = useState(doc?.key || "");
    const [isActive, setIsActive] = useState(doc ? Boolean(Number(doc.is_active)) : true);
    const [sortOrder, setSortOrder] = useState(doc?.sort_order || 0);
    const [effectiveDate, setEffectiveDate] = useState(doc?.effective_date || "");

    // Turkish (Primary)
    const [titleTr, setTitleTr] = useState(doc?.title_tr || "");
    const [contentTr, setContentTr] = useState(doc?.content_tr || "");

    // English
    const [titleEn, setTitleEn] = useState(doc?.title_en || "");
    const [contentEn, setContentEn] = useState(doc?.content_en || "");

    // Chinese
    const [titleZh, setTitleZh] = useState(doc?.title_zh || "");
    const [contentZh, setContentZh] = useState(doc?.content_zh || "");

    // State
    const [saving, setSaving] = useState(false);
    const [translating, setTranslating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [translateSuccess, setTranslateSuccess] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL || "/api";
    const API_BASE_URL = API_URL.endsWith('/index.php') ? API_URL : `${API_URL}/index.php`;
    const isEditing = Boolean(doc?.id);

    // AI Translation
    const handleTranslate = async () => {
        if (!titleTr.trim() || !contentTr.trim()) {
            setError("Çeviri için önce Türkçe başlık ve içerik girin.");
            return;
        }

        setTranslating(true);
        setError(null);
        setTranslateSuccess(false);

        try {
            const response = await fetch(`${API_BASE_URL}?action=translate_legal`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    ...getTenantHeader()
                },
                body: JSON.stringify({
                    title_tr: titleTr,
                    content_tr: contentTr
                }),
            });

            const data = await response.json();

            if (data.success && data.translations) {
                if (data.translations.en.success) {
                    setTitleEn(data.translations.en.title);
                    setContentEn(data.translations.en.content);
                }
                if (data.translations.zh.success) {
                    setTitleZh(data.translations.zh.title);
                    setContentZh(data.translations.zh.content);
                }
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

        if (!key.trim() || !titleTr.trim()) {
            setError("Key ve Türkçe Başlık zorunludur.");
            return;
        }

        setSaving(true);

        try {
            const payload: any = {
                key,
                title_tr: titleTr,
                content_tr: contentTr,
                title_en: titleEn,
                content_en: contentEn,
                title_zh: titleZh,
                content_zh: contentZh,
                is_active: isActive,
                sort_order: sortOrder,
                effective_date: effectiveDate
            };

            if (isEditing) payload.id = doc.id;

            const response = await fetch(`${API_BASE_URL}?action=save_legal_doc`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    ...getTenantHeader()
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
                            {isEditing ? "Doküman Düzenle" : "Yeni Doküman Ekle"}
                        </h2>
                        <p className="text-slate-500 text-sm">Hukuki metinleri ve çevirilerini yönetin.</p>
                    </div>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-8 max-w-5xl space-y-8">
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

                {/* Settings */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50 p-6 rounded-xl border border-slate-100">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                            Key (Benzersiz ID) <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            className="w-full p-3 border border-slate-200 rounded-xl focus:border-rose-500 outline-none font-mono text-sm disabled:bg-slate-100 disabled:text-slate-500"
                            value={key}
                            onChange={e => setKey(e.target.value.toLowerCase().replace(/\s+/g, '_'))}
                            placeholder="terms_of_use"
                            disabled={isEditing && !!doc.key} // Key updates usually restricted to avoid breaking links
                            required
                        />
                        <p className="text-xs text-slate-400 mt-1">URL'de kullanılacak tanımlayıcı (örn: privacy_policy)</p>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                            <Calendar size={14} /> Etkin Tarih
                        </label>
                        <input
                            type="date"
                            className="w-full p-3 border border-slate-200 rounded-xl focus:border-rose-500 outline-none"
                            value={effectiveDate}
                            onChange={e => setEffectiveDate(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                            <Hash size={14} /> Sıralama
                        </label>
                        <input
                            type="number"
                            className="w-full p-3 border border-slate-200 rounded-xl focus:border-rose-500 outline-none"
                            value={sortOrder}
                            onChange={e => setSortOrder(Number(e.target.value))}
                        />
                    </div>
                    <div className="md:col-span-3 flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="active"
                            checked={isActive}
                            onChange={e => setIsActive(e.target.checked)}
                            className="w-5 h-5 accent-green-500"
                        />
                        <label htmlFor="active" className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                            <Eye size={18} className="text-green-500" /> Aktif (Yayınla)
                        </label>
                    </div>
                </div>

                {/* Content Sections */}
                <div className="space-y-8">
                    {/* TR */}
                    <div className="bg-rose-50 p-6 rounded-xl border border-rose-100">
                        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2 border-b border-rose-200 pb-2">
                            <Globe size={18} className="text-rose-600" /> Türkçe (Ana Dil)
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Başlık</label>
                                <input
                                    type="text"
                                    className="w-full p-3 border border-slate-200 rounded-xl focus:border-rose-500 outline-none"
                                    value={titleTr}
                                    onChange={e => setTitleTr(e.target.value)}
                                    placeholder="Örn: Kullanım Koşulları"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">İçerik (Markdown/HTML)</label>
                                <div className="text-xs text-slate-500 mb-1">Markdown formatı destekler.</div>
                                <textarea
                                    className="w-full p-3 border border-slate-200 rounded-xl focus:border-rose-500 outline-none font-mono text-sm h-64"
                                    value={contentTr}
                                    onChange={e => setContentTr(e.target.value)}
                                    placeholder="# Başlık&#10;&#10;İçerik..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* AI Button */}
                    <div className="flex justify-center">
                        <button
                            type="button"
                            onClick={handleTranslate}
                            disabled={translating || !titleTr.trim() || !contentTr.trim()}
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

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* EN */}
                        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2 border-b border-blue-200 pb-2">
                                <Globe size={18} className="text-blue-600" /> English
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Title</label>
                                    <input
                                        type="text"
                                        className="w-full p-3 border border-slate-200 rounded-xl focus:border-blue-500 outline-none"
                                        value={titleEn}
                                        onChange={e => setTitleEn(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Content</label>
                                    <textarea
                                        className="w-full p-3 border border-slate-200 rounded-xl focus:border-blue-500 outline-none font-mono text-sm h-64"
                                        value={contentEn}
                                        onChange={e => setContentEn(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* ZH */}
                        <div className="bg-amber-50 p-6 rounded-xl border border-amber-100">
                            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2 border-b border-amber-200 pb-2">
                                <Globe size={18} className="text-amber-600" /> 中文
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">标题</label>
                                    <input
                                        type="text"
                                        className="w-full p-3 border border-slate-200 rounded-xl focus:border-amber-500 outline-none"
                                        value={titleZh}
                                        onChange={e => setTitleZh(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">内容</label>
                                    <textarea
                                        className="w-full p-3 border border-slate-200 rounded-xl focus:border-amber-500 outline-none font-mono text-sm h-64"
                                        value={contentZh}
                                        onChange={e => setContentZh(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="pt-6 border-t border-slate-100 flex justify-end gap-4">
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
                        {saving ? 'Kaydediliyor...' : 'Kaydet'}
                    </button>
                </div>
            </form>
        </div>
    );
};
