import { useState, useEffect } from "react";
import { ArrowLeft, Save, Loader2, Globe, Calendar, CheckCircle, Wand2 } from "lucide-react";
import { useToast } from "@/iwrs/hooks/use-toast";
import { blogApi, translationApi } from "@/iwrs/lib/api";

interface AdminBlogEditorProps {
    post: any | null; // null if creating new
    onSave: () => void;
    onCancel: () => void;
}

export const AdminBlogEditor = ({ post, onSave, onCancel }: AdminBlogEditorProps) => {
    const [loading, setLoading] = useState(false);
    const [translateLoading, setTranslateLoading] = useState(false);
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        featured_image: "", // Changed from image_url to match IWRS API
        status: "draft",
        excerpt: "",
        content: "",
        seo_title: "",
        seo_description: "",
        seo_keywords: "",
        published_at: "", // Added
        language: "tr" // Added
    });

    useEffect(() => {
        if (post) {
            setFormData({
                title: post.title || "",
                slug: post.slug || "",
                featured_image: post.featured_image || "",
                status: post.status || "draft",
                excerpt: post.excerpt || "",
                content: post.content || "",
                seo_title: post.seo_title || "",
                seo_description: post.seo_description || "",
                seo_keywords: post.seo_keywords || "",
                published_at: post.published_at ? post.published_at.slice(0, 16) : "",
                language: post.language || "tr"
            });
        }
    }, [post]);

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
            if (field === 'title' && !post) {
                newData.slug = generateSlug(value);
            }
            return newData;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (post) {
                await blogApi.update(post.id, formData);
            } else {
                await blogApi.create(formData);
            }
            toast({ title: "Başarılı", description: post ? "İçerik güncellendi" : "İçerik oluşturuldu" });
            onSave();
        } catch (err) {
            toast({ title: "Hata", description: "Kaydedilemedi", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleAiTranslate = async () => {
        if (!formData.title && !formData.content) {
            toast({ title: "Uyarı", description: "Çeviri için başlık veya içerik girilmelidir.", variant: "destructive" });
            return;
        }

        setTranslateLoading(true);
        try {

            const result = await translationApi.translateBlog({
                title: formData.title,
                excerpt: formData.excerpt,
                content: formData.content,
                target_language: 'en' // Always translate to EN for now as per requirement
            });

            if (result) {
                setFormData(prev => ({
                    ...prev,
                    title: result.title || prev.title,
                    excerpt: result.excerpt || prev.excerpt,
                    content: result.content || prev.content,
                    language: 'en',
                    slug: generateSlug(result.title || prev.title) // Regenerate slug for EN
                }));
                toast({ title: "Çeviri Tamamlandı", description: "İçerik İngilizceye çevrildi. Lütfen kontrol edip kaydedin." });
            }
        } catch (err) {
            toast({ title: "Hata", description: "Çeviri başarısız oldu.", variant: "destructive" });
        } finally {
            setTranslateLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <button onClick={onCancel} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-medium transition-colors">
                    <ArrowLeft size={18} /> Listeye Dön
                </button>
                <h2 className="text-xl font-bold text-slate-900">{post ? 'İçeriği Düzenle' : 'Yeni İçerik Ekle'}</h2>
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={handleAiTranslate}
                        disabled={translateLoading}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors font-medium text-sm disabled:opacity-50"
                    >
                        {translateLoading ? <Loader2 className="animate-spin" size={16} /> : <Wand2 size={16} />}
                        AI ile İngilizce'ye Çevir
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="p-8 max-w-5xl mx-auto">
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Left: Main Content */}
                    <div className="md:col-span-2 space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Başlık</label>
                            <input
                                type="text"
                                className="w-full p-3 border border-slate-200 rounded-xl focus:border-cyan-500 outline-none text-lg font-bold"
                                value={formData.title}
                                onChange={e => handleChange('title', e.target.value)}
                                placeholder="Blog başlığı..."
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Slug (URL)</label>
                            <div className="flex items-center gap-1 text-slate-400 bg-slate-50 p-3 rounded-xl border border-slate-200">
                                <span className="text-xs">iwrs.com.tr/blog/</span>
                                <input
                                    type="text"
                                    className="flex-1 bg-transparent outline-none text-slate-700 font-medium"
                                    value={formData.slug}
                                    onChange={e => handleChange('slug', e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Kapak Görseli URL</label>
                            <input
                                type="text"
                                className="w-full p-3 border border-slate-200 rounded-xl focus:border-cyan-500 outline-none"
                                value={formData.featured_image}
                                onChange={e => handleChange('featured_image', e.target.value)}
                                placeholder="https://..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Kısa Özet (Excerpt)</label>
                            <textarea
                                className="w-full p-3 border border-slate-200 rounded-xl focus:border-cyan-500 outline-none h-24 resize-none"
                                value={formData.excerpt}
                                onChange={e => handleChange('excerpt', e.target.value)}
                                placeholder="Liste görünümünde çıkacak kısa açıklama..."
                            ></textarea>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">İçerik (HTML/Markdown)</label>
                            <textarea
                                className="w-full p-4 border border-slate-200 rounded-xl focus:border-cyan-500 outline-none h-[500px] font-mono text-sm leading-relaxed"
                                value={formData.content}
                                onChange={e => handleChange('content', e.target.value)}
                                placeholder="İçeriğinizi buraya yazın..."
                            ></textarea>
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
                                    <Calendar size={16} className="text-slate-400" /> Yayın Tarihi
                                </label>
                                <input
                                    type="datetime-local"
                                    className="w-full p-3 border border-slate-200 rounded-xl focus:border-cyan-500 outline-none bg-white"
                                    value={formData.published_at}
                                    onChange={e => handleChange('published_at', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
                            <h3 className="font-bold text-slate-900 border-b border-slate-200 pb-2 mb-4">SEO</h3>

                            <div>
                                <label className="text-xs font-bold text-slate-500 block mb-1">SEO Başlığı</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border border-slate-200 rounded-lg outline-none text-sm"
                                    value={formData.seo_title}
                                    onChange={e => handleChange('seo_title', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 block mb-1">SEO Açıklaması</label>
                                <textarea
                                    className="w-full p-2 border border-slate-200 rounded-lg outline-none text-sm h-20 resize-none"
                                    value={formData.seo_description}
                                    onChange={e => handleChange('seo_description', e.target.value)}
                                />
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
    );
};
