import { useState, useEffect } from "react";
import { ArrowLeft, Save, Loader2, Globe, Calendar, User, CheckCircle, Image as ImageIcon, X } from "lucide-react";

interface AdminBlogEditorProps {
    token: string;
    post: any | null; // null if creating new
    onSave: () => void;
    onCancel: () => void;
}

export const AdminBlogEditor = ({ token, post, onSave, onCancel }: AdminBlogEditorProps) => {
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
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

    useEffect(() => {
        if (post) {
            setFormData({
                title: post.title || "",
                slug: post.slug || "",
                image_url: post.image_url || "",
                language: post.language || "tr",
                author: post.author || "",
                excerpt: post.excerpt || "",
                content: post.content || "",
                status: post.status || "draft",
                publish_at: post.publish_at ? post.publish_at.slice(0, 16) : "", // Format for datetime-local
            });
        } else {
            // Defaults for new post
            setFormData(prev => ({ ...prev, author: 'Admin' })); // Or fetch current user name
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
                // Auto-generate slug from title IF creating new
                newData.slug = generateSlug(value);
            }
            return newData;
        });
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;
        const file = e.target.files[0];
        setUploading(true);

        const uploadData = new FormData();
        uploadData.append('image', file);

        try {
            const res = await fetch(`${API_URL}/index.php?action=upload_image`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: uploadData
            });
            const data = await res.json();
            if (data.success) {
                handleChange('image_url', data.url);
            } else {
                alert("Görsel yükleme hatası: " + (data.error || "Bilinmeyen hata"));
            }
        } catch (err) {
            alert("Bağlantı hatası");
        } finally {
            setUploading(false);
        }
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
                onSave(); // Navigate back or show success
            } else {
                alert("Hata: " + (data.error || "Kaydedilemedi"));
            }
        } catch (err) {
            alert("Bağlantı hatası");
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
                <h2 className="text-xl font-bold text-slate-900">{post ? 'İçeriği Düzenle' : 'Yeni İçerik Ekle'}</h2>
                <div className="w-24"></div> {/* Spacer for centering */}
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
                            <label className="block text-sm font-bold text-slate-700 mb-2">Kapak Görseli</label>
                            <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center bg-slate-50 hover:bg-white hover:border-cyan-500 transition-all text-center relative group">
                                {formData.image_url ? (
                                    <div className="relative w-full">
                                        <img src={formData.image_url} alt="Cover" className="h-48 w-full object-cover rounded-lg shadow-sm" />
                                        <button
                                            type="button"
                                            onClick={() => handleChange('image_url', '')}
                                            className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md text-slate-500 hover:text-red-500 transition-colors"
                                        >
                                            <X size={16} />
                                        </button>
                                        <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur">
                                            Değiştirmek için tıkla
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="w-12 h-12 bg-cyan-100/50 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                            {uploading ? <Loader2 className="animate-spin text-cyan-600" /> : <ImageIcon className="text-cyan-600" />}
                                        </div>
                                        <p className="text-sm font-medium text-slate-900">{uploading ? "Yükleniyor..." : "Görsel Yükle"}</p>
                                        <p className="text-xs text-slate-400 mt-1">PNG, JPG, WEBP (Max 5MB)</p>
                                    </>
                                )}

                                <input
                                    type="file"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    disabled={uploading}
                                />
                            </div>
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
                                    className="w-full p-2 bg-white border border-slate-200 rounded-lg outline-none"
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
                                    className="w-full p-2 bg-white border border-slate-200 rounded-lg outline-none"
                                    value={formData.language}
                                    onChange={e => handleChange('language', e.target.value)}
                                >
                                    <option value="tr">Türkçe</option>
                                    <option value="en">English</option>
                                    <option value="zh">Chinese</option>
                                </select>
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                                    <User size={16} className="text-slate-400" /> Yazar
                                </label>
                                <input
                                    type="text"
                                    className="w-full p-2 bg-white border border-slate-200 rounded-lg outline-none"
                                    value={formData.author}
                                    onChange={e => handleChange('author', e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                                    <Calendar size={16} className="text-slate-400" /> Yayın Tarihi
                                </label>
                                <input
                                    type="datetime-local"
                                    className="w-full p-2 bg-white border border-slate-200 rounded-lg outline-none text-sm"
                                    value={formData.publish_at}
                                    onChange={e => handleChange('publish_at', e.target.value)}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-cyan-600 text-white font-bold rounded-xl hover:bg-cyan-700 transition-all flex items-center justify-center gap-2 mt-4 shadow-lg shadow-cyan-200"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : <><Save size={18} /> Kaydet</>}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};
