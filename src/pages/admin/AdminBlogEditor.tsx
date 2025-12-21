import { useState, useEffect } from "react";
import { ArrowLeft, Save, Loader2, Globe, Calendar, User, CheckCircle } from "lucide-react";
import { ImageUploader } from "../../components/ImageUploader";
import { useNotification } from "../../components/NotificationProvider";

interface AdminBlogEditorProps {
    token: string;
    post: any | null; // null if creating new
    onSave: () => void;
    onCancel: () => void;
}

export const AdminBlogEditor = ({ token, post, onSave, onCancel }: AdminBlogEditorProps) => {
    const [loading, setLoading] = useState(false);
    const notify = useNotification();
    const [loadingPost, setLoadingPost] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        image_url: "",
        language: "tr",
        author: "",
        excerpt: "",
        content: "",
        status: "draft",
        publish_at: "",
    });

    const API_URL = import.meta.env.VITE_API_URL || "/api";

    // Fetch full post details when editing (list API only returns partial data)
    useEffect(() => {
        if (post?.id) {
            setLoadingPost(true);
            fetch(`${API_URL}/index.php?action=get_blog_post_detail&id=${post.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success && data.data) {
                        const p = data.data;
                        setFormData({
                            title: p.title || "",
                            slug: p.slug || "",
                            image_url: p.image_url || "",
                            language: p.language || "tr",
                            author: p.author || "",
                            excerpt: p.excerpt || "",
                            content: p.content || "",
                            status: p.status || "draft",
                            publish_at: p.publish_at ? p.publish_at.slice(0, 16) : "",
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
                title: "",
                slug: "",
                image_url: "",
                language: "tr",
                author: "Admin",
                excerpt: "",
                content: "",
                status: "draft",
                publish_at: "",
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
            if (field === 'title' && !post) {
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

    return (
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
                <div className="w-24"></div>
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
                                <span className="text-xs">turp.health/blog/</span>
                                <input
                                    type="text"
                                    className="flex-1 bg-transparent outline-none text-slate-700 font-medium"
                                    value={formData.slug}
                                    onChange={e => handleChange('slug', e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <ImageUploader
                                label="Kapak Görseli"
                                uploadEndpoint={`${API_URL}/index.php?action=upload_image`}
                                token={token}
                                existingImageUrl={formData.image_url}
                                preset="blogCover"
                                onUploadSuccess={(url) => handleChange('image_url', url)}
                                onUploadError={(error) => notify.error("Görsel yükleme hatası: " + error)}
                                onRemove={() => handleChange('image_url', '')}
                                helperText="Otomatik olarak optimize edilir (maks 1600×900, ~400KB)"
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
                                    <User size={16} className="text-slate-400" /> Yazar
                                </label>
                                <input
                                    type="text"
                                    className="w-full p-3 border border-slate-200 rounded-xl focus:border-cyan-500 outline-none bg-white"
                                    value={formData.author}
                                    onChange={e => handleChange('author', e.target.value)}
                                    placeholder="Yazar adı"
                                />
                            </div>

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

export default AdminBlogEditor;
