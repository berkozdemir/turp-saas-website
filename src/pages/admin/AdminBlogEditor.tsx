import { useState, useEffect } from "react";
import { ArrowLeft, Save, Loader2, Calendar, CheckCircle, Wand2, Languages, FolderOpen } from "lucide-react";
import { ImageUploader } from "../../components/ImageUploader";
import { useNotification } from "../../components/NotificationProvider";
import { MediaPickerDialog } from "../../components/MediaPickerDialog";
import { getTenantHeader } from "../../context/TenantContext";

interface AdminBlogEditorProps {
    token: string;
    post: any | null;
    onSave: () => void;
    onCancel: () => void;
}

type TabType = 'tr' | 'en' | 'zh';

export const AdminBlogEditor = ({ token, post, onSave, onCancel }: AdminBlogEditorProps) => {
    const [loading, setLoading] = useState(false);
    const [translateLoading, setTranslateLoading] = useState(false);
    const [loadingPost, setLoadingPost] = useState(false);
    const [showMediaPicker, setShowMediaPicker] = useState(false);
    const [activeTab, setActiveTab] = useState<TabType>('tr');
    const notify = useNotification();

    const [formData, setFormData] = useState({
        slug: "",
        image_url: "",
        status: "draft",
        publish_at: "",
        // Turkish (Primary)
        title_tr: "",
        excerpt_tr: "",
        content_tr: "",
        // English
        title_en: "",
        excerpt_en: "",
        content_en: "",
        // Chinese
        title_zh: "",
        excerpt_zh: "",
        content_zh: "",
    });

    const API_URL = import.meta.env.VITE_API_URL || "/api";

    // Fetch full post details when editing
    useEffect(() => {
        if (post?.id) {
            setLoadingPost(true);
            fetch(`${API_BASE_URL}?action=get_blog_post_detail&id=${post.id}`, {
                headers: { Authorization: `Bearer ${token}`, ...getTenantHeader() }
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success && data.data) {
                        const p = data.data;
                        setFormData({
                            slug: p.slug || "",
                            image_url: p.image_url || "",
                            status: p.status || "draft",
                            publish_at: p.publish_at ? p.publish_at.slice(0, 16) : "",
                            title_tr: p.title_tr || "",
                            excerpt_tr: p.excerpt_tr || "",
                            content_tr: p.content_tr || "",
                            title_en: p.title_en || "",
                            excerpt_en: p.excerpt_en || "",
                            content_en: p.content_en || "",
                            title_zh: p.title_zh || "",
                            excerpt_zh: p.excerpt_zh || "",
                            content_zh: p.content_zh || "",
                        });
                    }
                })
                .catch(err => {
                    console.error("Post detail fetch error:", err);
                    notify.error("İçerik detayları yüklenemedi");
                })
                .finally(() => setLoadingPost(false));
        } else if (!post) {
            // New post - reset form
            setFormData({
                slug: "",
                image_url: "",
                status: "draft",
                publish_at: "",
                title_tr: "",
                excerpt_tr: "",
                content_tr: "",
                title_en: "",
                excerpt_en: "",
                content_en: "",
                title_zh: "",
                excerpt_zh: "",
                content_zh: "",
            });
        }
    }, [post, token, API_URL]);

    const generateSlug = (text: string) => {
        return text.toLowerCase()
            .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');
    };

    const handleChange = (field: string, value: any) => {
        setFormData(prev => {
            const newData = { ...prev, [field]: value };
            if (field === 'title_tr' && !post) {
                newData.slug = generateSlug(value);
            }
            return newData;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const action = post ? 'update_blog_post' : 'create_blog_post';
        const payload = { ...formData, id: post?.id };

        try {
            const response = await fetch(`${API_BASE_URL}?action=${action}`, {
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
                notify.success(post ? "İçerik başarıyla güncellendi" : "İçerik başarıyla oluşturuldu");
                onSave();
            } else {
                notify.error("Hata: " + (data.error || "Kaydedilemedi"));
            }
        } catch (err) {
            notify.error("Bağlantı hatası");
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateTranslations = async () => {
        if (!formData.title_tr && !formData.content_tr) {
            notify.error("Çeviri için Türkçe başlık ve içerik gereklidir.");
            return;
        }

        setTranslateLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}?action=ai_translate_blog_all`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    ...getTenantHeader()
                },
                body: JSON.stringify({
                    title_tr: formData.title_tr,
                    excerpt_tr: formData.excerpt_tr,
                    content_tr: formData.content_tr,
                }),
            });
            const result = await response.json();

            if (result.en || result.zh) {
                setFormData(prev => ({
                    ...prev,
                    title_en: result.en?.title || prev.title_en,
                    excerpt_en: result.en?.excerpt || prev.excerpt_en,
                    content_en: result.en?.content || prev.content_en,
                    title_zh: result.zh?.title || prev.title_zh,
                    excerpt_zh: result.zh?.excerpt || prev.excerpt_zh,
                    content_zh: result.zh?.content || prev.content_zh,
                }));
                notify.success("EN ve ZH çevirileri oluşturuldu. Kontrol edip kaydedebilirsiniz.");
            } else if (result.error) {
                notify.error("Çeviri hatası: " + result.error);
            }
        } catch (err) {
            notify.error("Çeviri başarısız oldu.");
        } finally {
            setTranslateLoading(false);
        }
    };

    const tabs: { key: TabType; label: string; flag: string }[] = [
        { key: 'tr', label: 'Türkçe', flag: '🇹🇷' },
        { key: 'en', label: 'English', flag: '🇬🇧' },
        { key: 'zh', label: '中文', flag: '🇨🇳' },
    ];

    const hasTranslation = (lang: 'en' | 'zh') => {
        return formData[`title_${lang}`] || formData[`content_${lang}`];
    };

    return (
        <>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative">
                {loadingPost && (
                    <div className="absolute inset-0 bg-white/80 z-50 flex items-center justify-center">
                        <div className="flex items-center gap-3 text-cyan-600">
                            <Loader2 className="w-8 h-8 animate-spin" />
                            <span className="font-medium">İçerik yükleniyor...</span>
                        </div>
                    </div>
                )}

                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                    <button onClick={onCancel} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-medium transition-colors">
                        <ArrowLeft size={18} /> Listeye Dön
                    </button>
                    <h2 className="text-xl font-bold text-slate-900">{post ? 'İçeriği Düzenle' : 'Yeni İçerik Ekle'}</h2>
                    <button
                        type="button"
                        onClick={handleGenerateTranslations}
                        disabled={translateLoading}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-all font-medium text-sm disabled:opacity-50"
                    >
                        {translateLoading ? <Loader2 className="animate-spin" size={16} /> : <Wand2 size={16} />}
                        {translateLoading ? 'Çevriliyor...' : 'EN + ZH Çeviri Oluştur'}
                    </button>
                </div>

                {/* Language Tabs */}
                <div className="flex border-b border-slate-200 bg-slate-50/50">
                    {tabs.map(tab => (
                        <button
                            key={tab.key}
                            type="button"
                            onClick={() => setActiveTab(tab.key)}
                            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.key
                                ? 'border-cyan-500 text-cyan-600 bg-white'
                                : 'border-transparent text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            <span>{tab.flag}</span>
                            {tab.label}
                            {tab.key !== 'tr' && hasTranslation(tab.key) && (
                                <CheckCircle size={14} className="text-green-500" />
                            )}
                            {tab.key !== 'tr' && !hasTranslation(tab.key) && (
                                <span className="text-xs text-amber-500">(boş)</span>
                            )}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSubmit} className="p-8 max-w-5xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Left: Main Content based on active tab */}
                        <div className="md:col-span-2 space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">
                                    Başlık ({tabs.find(t => t.key === activeTab)?.label})
                                    {activeTab === 'tr' && <span className="text-red-500 ml-1">*</span>}
                                </label>
                                <input
                                    type="text"
                                    className="w-full p-3 border border-slate-200 rounded-xl focus:border-cyan-500 outline-none text-lg font-bold"
                                    value={formData[`title_${activeTab}`]}
                                    onChange={e => handleChange(`title_${activeTab}`, e.target.value)}
                                    placeholder={activeTab === 'tr' ? "Blog başlığı..." : `${tabs.find(t => t.key === activeTab)?.label} title...`}
                                    required={activeTab === 'tr'}
                                />
                            </div>

                            {activeTab === 'tr' && (
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Slug (URL)</label>
                                    <div className="flex items-center gap-1 text-slate-400 bg-slate-50 p-3 rounded-xl border border-slate-200">
                                        <span className="text-xs">ct.turp.health/blog/</span>
                                        <input
                                            type="text"
                                            className="flex-1 bg-transparent outline-none text-slate-700 font-medium"
                                            value={formData.slug}
                                            onChange={e => handleChange('slug', e.target.value)}
                                        />
                                    </div>
                                </div>
                            )}

                            {activeTab === 'tr' && (
                                <div>
                                    <ImageUploader
                                        label="Kapak Görseli"
                                        uploadEndpoint={`${API_BASE_URL}?action=upload_image`}
                                        token={token}
                                        existingImageUrl={formData.image_url}
                                        preset="blogCover"
                                        onUploadSuccess={(url) => handleChange('image_url', url)}
                                        onUploadError={(error) => notify.error("Görsel yükleme hatası: " + error)}
                                        onRemove={() => handleChange('image_url', '')}
                                        helperText="Otomatik olarak optimize edilir (maks 1600×900, ~400KB)"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowMediaPicker(true)}
                                        className="mt-2 w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                                    >
                                        <FolderOpen size={16} />
                                        Medya Kütüphanesinden Seç
                                    </button>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">
                                    Özet ({tabs.find(t => t.key === activeTab)?.label})
                                </label>
                                <textarea
                                    className="w-full p-3 border border-slate-200 rounded-xl focus:border-cyan-500 outline-none h-24 resize-none"
                                    value={formData[`excerpt_${activeTab}`]}
                                    onChange={e => handleChange(`excerpt_${activeTab}`, e.target.value)}
                                    placeholder={activeTab === 'tr' ? "Liste görünümünde çıkacak kısa açıklama..." : "Short excerpt..."}
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">
                                    İçerik ({tabs.find(t => t.key === activeTab)?.label})
                                    {activeTab === 'tr' && <span className="text-red-500 ml-1">*</span>}
                                </label>
                                <textarea
                                    className="w-full p-4 border border-slate-200 rounded-xl focus:border-cyan-500 outline-none h-[400px] font-mono text-sm leading-relaxed"
                                    value={formData[`content_${activeTab}`]}
                                    onChange={e => handleChange(`content_${activeTab}`, e.target.value)}
                                    placeholder={activeTab === 'tr' ? "İçeriğinizi buraya yazın..." : "Content..."}
                                    required={activeTab === 'tr'}
                                ></textarea>
                                <p className="text-xs text-slate-400 mt-2 text-right">HTML etiketleri desteklenir.</p>
                            </div>
                        </div>

                        {/* Right: Sidebar Options */}
                        <div className="space-y-6">
                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
                                <h3 className="font-bold text-slate-900 border-b border-slate-200 pb-2 mb-4">Yayın Ayarları</h3>

                                <div>
                                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                                        <CheckCircle size={16} className="text-slate-400" /> Durum
                                    </label>
                                    <select
                                        className="w-full p-3 border border-slate-200 rounded-xl focus:border-cyan-500 outline-none bg-white"
                                        value={formData.status}
                                        onChange={e => handleChange('status', e.target.value)}
                                    >
                                        <option value="draft">Taslak</option>
                                        <option value="published">Yayında</option>
                                        <option value="archived">Arşiv</option>
                                    </select>
                                </div>

                                {formData.status === 'published' && (
                                    <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm border border-green-100">
                                        <div className="flex items-center gap-2 font-bold mb-1">
                                            <CheckCircle size={14} /> Yayında
                                        </div>
                                        <a
                                            href={`${window.location.origin}/blog/${formData.slug}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="underline break-all hover:text-green-800"
                                        >
                                            /blog/{formData.slug}
                                        </a>
                                    </div>
                                )}

                                <div>
                                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                                        <Calendar size={16} className="text-slate-400" /> Yayın Tarihi
                                    </label>
                                    <input
                                        type="datetime-local"
                                        className="w-full p-3 border border-slate-200 rounded-xl focus:border-cyan-500 outline-none bg-white"
                                        value={formData.publish_at}
                                        onChange={e => handleChange('publish_at', e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Translation Status */}
                            <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100">
                                <div className="flex items-center gap-2 text-indigo-700 font-bold mb-3">
                                    <Languages size={16} />
                                    Çeviri Durumu
                                </div>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between items-center">
                                        <span>🇹🇷 Türkçe</span>
                                        <span className={formData.title_tr ? 'text-green-600 font-bold' : 'text-slate-400'}>
                                            {formData.title_tr ? '✓ Mevcut' : '—'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span>🇬🇧 English</span>
                                        <span className={formData.title_en ? 'text-green-600 font-bold' : 'text-amber-500'}>
                                            {formData.title_en ? '✓ Mevcut' : '⚠ Eksik'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span>🇨🇳 中文</span>
                                        <span className={formData.title_zh ? 'text-green-600 font-bold' : 'text-amber-500'}>
                                            {formData.title_zh ? '✓ Mevcut' : '⚠ Eksik'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-bold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                {loading ? 'Kaydediliyor...' : (post ? 'Güncelle' : 'Kaydet')}
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {/* Media Picker Dialog */}
            <MediaPickerDialog
                isOpen={showMediaPicker}
                onClose={() => setShowMediaPicker(false)}
                onSelect={(asset) => {
                    handleChange('image_url', asset.url);
                    setShowMediaPicker(false);
                }}
                category="blog"
            />
        </>
    );
};

export default AdminBlogEditor;
