import { useState, useEffect } from "react";
import {
    ArrowLeft, Save, Loader2, Calendar, CheckCircle, Mic, Link2, Plus, Trash2, FolderOpen, Play, Clock, Tag, Globe
} from "lucide-react";
import { useNotification } from "../../components/NotificationProvider";
import { MediaPickerDialog } from "../../components/MediaPickerDialog";
import { getTenantHeader } from "../../context/TenantContext";

interface AdminPodcastEditorProps {
    token: string;
    podcast: any | null;
    onSave: () => void;
    onCancel: () => void;
}

const STATUS_OPTIONS = [
    { value: "draft", label: "Taslak" },
    { value: "scheduled", label: "Planlandı" },
    { value: "published", label: "Yayında" },
    { value: "archived", label: "Arşiv" },
];

const LANGUAGE_OPTIONS = [
    { value: "tr", label: "🇹🇷 Türkçe" },
    { value: "en", label: "🇬🇧 English" },
    { value: "zh", label: "🇨🇳 中文" },
];

export const AdminPodcastEditor = ({ token, podcast, onSave, onCancel }: AdminPodcastEditorProps) => {
    const [loading, setLoading] = useState(false);
    const [loadingPodcast, setLoadingPodcast] = useState(false);
    const [showCoverPicker, setShowCoverPicker] = useState(false);
    const [showExtraImagesPicker, setShowExtraImagesPicker] = useState(false);
    const notify = useNotification();

    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        status: "draft",
        publish_date: "",
        language: "tr",
        short_description: "",
        full_description: "",
        audio_url: "",
        duration_seconds: 0,
        cover_image_url: "",
        tags: [] as string[],
        external_links: {
            spotify: "",
            apple: "",
            youtube: "",
            other: "",
        },
        extra_images: [] as string[],
        extra_videos: [] as string[],
    });

    const [tagInput, setTagInput] = useState("");

    const API_URL = import.meta.env.VITE_API_URL || "/api";
    const API_BASE_URL = API_URL.endsWith('/index.php') ? API_URL : `${API_URL}/index.php`;

    // Fetch podcast details when editing
    useEffect(() => {
        if (podcast?.id) {
            setLoadingPodcast(true);
            fetch(`${API_BASE_URL}?action=get_podcast&id=${podcast.id}`, {
                headers: { Authorization: `Bearer ${token}`, ...getTenantHeader() },
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.success && data.data) {
                        const p = data.data;
                        setFormData({
                            title: p.title || "",
                            slug: p.slug || "",
                            status: p.status || "draft",
                            publish_date: p.publish_date ? p.publish_date.slice(0, 16) : "",
                            language: p.language || "tr",
                            short_description: p.short_description || "",
                            full_description: p.full_description || "",
                            audio_url: p.audio_url || "",
                            duration_seconds: p.duration_seconds || 0,
                            cover_image_url: p.cover_image_url || "",
                            tags: p.tags || [],
                            external_links: p.external_links || { spotify: "", apple: "", youtube: "", other: "" },
                            extra_images: p.extra_images || [],
                            extra_videos: p.extra_videos || [],
                        });
                    }
                })
                .catch((err) => {
                    console.error("Podcast detail fetch error:", err);
                    notify.error("Podcast detayları yüklenemedi");
                })
                .finally(() => setLoadingPodcast(false));
        } else if (!podcast) {
            // Reset form for new podcast
            setFormData({
                title: "",
                slug: "",
                status: "draft",
                publish_date: "",
                language: "tr",
                short_description: "",
                full_description: "",
                audio_url: "",
                duration_seconds: 0,
                cover_image_url: "",
                tags: [],
                external_links: { spotify: "", apple: "", youtube: "", other: "" },
                extra_images: [],
                extra_videos: [],
            });
        }
    }, [podcast, token]);

    const generateSlug = (text: string) => {
        return text
            .toLowerCase()
            .replace(/ğ/g, "g")
            .replace(/ü/g, "u")
            .replace(/ş/g, "s")
            .replace(/ı/g, "i")
            .replace(/ö/g, "o")
            .replace(/ç/g, "c")
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-");
    };

    const handleChange = (field: string, value: any) => {
        setFormData((prev) => {
            const newData = { ...prev, [field]: value };
            if (field === "title" && !podcast) {
                newData.slug = generateSlug(value);
            }
            return newData;
        });
    };

    const handleExternalLinkChange = (key: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            external_links: { ...prev.external_links, [key]: value },
        }));
    };

    const handleAddTag = () => {
        const tag = tagInput.trim();
        if (tag && !formData.tags.includes(tag)) {
            setFormData((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
            setTagInput("");
        }
    };

    const handleRemoveTag = (tag: string) => {
        setFormData((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }));
    };

    const handleAddExtraVideo = () => {
        setFormData((prev) => ({ ...prev, extra_videos: [...prev.extra_videos, ""] }));
    };

    const handleExtraVideoChange = (index: number, value: string) => {
        setFormData((prev) => {
            const newVideos = [...prev.extra_videos];
            newVideos[index] = value;
            return { ...prev, extra_videos: newVideos };
        });
    };

    const handleRemoveExtraVideo = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            extra_videos: prev.extra_videos.filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title) {
            notify.error("Başlık zorunludur");
            return;
        }

        setLoading(true);
        const action = podcast ? "update_podcast" : "create_podcast";
        const payload = { ...formData, id: podcast?.id };

        try {
            const response = await fetch(`${API_BASE_URL}?action=${action}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    ...getTenantHeader(),
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            if (data.success) {
                notify.success(podcast ? "Podcast güncellendi" : "Podcast oluşturuldu");
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

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    return (
        <>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative">
                {loadingPodcast && (
                    <div className="absolute inset-0 bg-white/80 z-50 flex items-center justify-center">
                        <div className="flex items-center gap-3 text-purple-600">
                            <Loader2 className="w-8 h-8 animate-spin" />
                            <span className="font-medium">Podcast yükleniyor...</span>
                        </div>
                    </div>
                )}

                {/* Header */}
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                    <button
                        onClick={onCancel}
                        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-medium transition-colors"
                    >
                        <ArrowLeft size={18} /> Listeye Dön
                    </button>
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <Mic className="text-purple-600" />
                        {podcast ? "Podcast Düzenle" : "Yeni Podcast Bölümü"}
                    </h2>
                    <div className="w-24" /> {/* Spacer */}
                </div>

                <form onSubmit={handleSubmit} className="p-8">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* General Section */}
                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <Globe size={18} /> Genel Bilgiler
                                </h3>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold text-slate-700 mb-2">
                                            Başlık <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full p-3 border border-slate-200 rounded-xl focus:border-purple-500 outline-none text-lg font-bold"
                                            value={formData.title}
                                            onChange={(e) => handleChange("title", e.target.value)}
                                            placeholder="Podcast bölüm başlığı..."
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Slug (URL)</label>
                                        <div className="flex items-center gap-1 text-slate-400 bg-white p-3 rounded-xl border border-slate-200">
                                            <span className="text-xs">/podcast/</span>
                                            <input
                                                type="text"
                                                className="flex-1 bg-transparent outline-none text-slate-700 font-medium"
                                                value={formData.slug}
                                                onChange={(e) => handleChange("slug", e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Dil</label>
                                        <select
                                            className="w-full p-3 border border-slate-200 rounded-xl focus:border-purple-500 outline-none bg-white"
                                            value={formData.language}
                                            onChange={(e) => handleChange("language", e.target.value)}
                                        >
                                            {LANGUAGE_OPTIONS.map((opt) => (
                                                <option key={opt.value} value={opt.value}>
                                                    {opt.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Content Section */}
                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                                <h3 className="font-bold text-slate-900 mb-4">İçerik</h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Kısa Açıklama</label>
                                        <textarea
                                            className="w-full p-3 border border-slate-200 rounded-xl focus:border-purple-500 outline-none h-24 resize-none"
                                            value={formData.short_description}
                                            onChange={(e) => handleChange("short_description", e.target.value)}
                                            placeholder="Podcast kartlarında görünecek kısa açıklama..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Detaylı Açıklama / Show Notes</label>
                                        <textarea
                                            className="w-full p-4 border border-slate-200 rounded-xl focus:border-purple-500 outline-none h-64 font-mono text-sm"
                                            value={formData.full_description}
                                            onChange={(e) => handleChange("full_description", e.target.value)}
                                            placeholder="Bölüm notları, konular, linkler..."
                                        />
                                        <p className="text-xs text-slate-400 mt-1">Markdown desteklenir</p>
                                    </div>

                                    {/* Tags */}
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-1">
                                            <Tag size={14} /> Etiketler
                                        </label>
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            {formData.tags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm flex items-center gap-1"
                                                >
                                                    {tag}
                                                    <button type="button" onClick={() => handleRemoveTag(tag)} className="hover:text-red-500">
                                                        ×
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                className="flex-1 p-2 border border-slate-200 rounded-lg outline-none focus:border-purple-500"
                                                value={tagInput}
                                                onChange={(e) => setTagInput(e.target.value)}
                                                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                                                placeholder="Etiket ekle..."
                                            />
                                            <button
                                                type="button"
                                                onClick={handleAddTag}
                                                className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200"
                                            >
                                                Ekle
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Media Section */}
                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <Mic size={18} /> Medya
                                </h3>

                                <div className="space-y-4">
                                    {/* Cover Image */}
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Kapak Görseli</label>
                                        {formData.cover_image_url ? (
                                            <div className="relative w-48 h-48 rounded-xl overflow-hidden border border-slate-200">
                                                <img
                                                    src={formData.cover_image_url}
                                                    alt="Cover"
                                                    className="w-full h-full object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleChange("cover_image_url", "")}
                                                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => setShowCoverPicker(true)}
                                                className="w-48 h-48 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:border-purple-500 hover:text-purple-500 transition-colors"
                                            >
                                                <FolderOpen size={32} />
                                                <span className="text-sm mt-2">Görsel Seç</span>
                                            </button>
                                        )}
                                    </div>

                                    {/* Audio URL */}
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">
                                            Ses Dosyası URL (Cloudflare R2 / CDN)
                                        </label>
                                        <input
                                            type="url"
                                            className="w-full p-3 border border-slate-200 rounded-xl focus:border-purple-500 outline-none"
                                            value={formData.audio_url}
                                            onChange={(e) => handleChange("audio_url", e.target.value)}
                                            placeholder="https://cdn.example.com/podcast-bolum-1.mp3"
                                        />
                                    </div>

                                    {/* Duration */}
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-1">
                                                <Clock size={14} /> Süre (saniye)
                                            </label>
                                            <input
                                                type="number"
                                                className="w-full p-3 border border-slate-200 rounded-xl focus:border-purple-500 outline-none"
                                                value={formData.duration_seconds}
                                                onChange={(e) => handleChange("duration_seconds", parseInt(e.target.value) || 0)}
                                                placeholder="3600"
                                            />
                                            {formData.duration_seconds > 0 && (
                                                <p className="text-xs text-slate-500 mt-1">
                                                    ≈ {formatDuration(formData.duration_seconds)}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* External Links Section */}
                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <Link2 size={18} /> Harici Linkler
                                </h3>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-600 mb-1">Spotify</label>
                                        <input
                                            type="url"
                                            className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:border-green-500"
                                            value={formData.external_links.spotify}
                                            onChange={(e) => handleExternalLinkChange("spotify", e.target.value)}
                                            placeholder="https://open.spotify.com/..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-600 mb-1">Apple Podcasts</label>
                                        <input
                                            type="url"
                                            className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:border-purple-500"
                                            value={formData.external_links.apple}
                                            onChange={(e) => handleExternalLinkChange("apple", e.target.value)}
                                            placeholder="https://podcasts.apple.com/..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-600 mb-1">YouTube</label>
                                        <input
                                            type="url"
                                            className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:border-red-500"
                                            value={formData.external_links.youtube}
                                            onChange={(e) => handleExternalLinkChange("youtube", e.target.value)}
                                            placeholder="https://youtube.com/..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-600 mb-1">Diğer</label>
                                        <input
                                            type="url"
                                            className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:border-slate-500"
                                            value={formData.external_links.other}
                                            onChange={(e) => handleExternalLinkChange("other", e.target.value)}
                                            placeholder="https://..."
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Extra Materials Section */}
                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                                <h3 className="font-bold text-slate-900 mb-4">Ek Materyaller</h3>

                                {/* Extra Images */}
                                <div className="mb-6">
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Ek Görseller (İnfografikler)</label>
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {formData.extra_images.map((url, i) => (
                                            <div key={i} className="relative w-24 h-24 rounded-lg overflow-hidden border border-slate-200">
                                                <img src={url} alt={`Extra ${i}`} className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            extra_images: prev.extra_images.filter((_, idx) => idx !== i),
                                                        }))
                                                    }
                                                    className="absolute top-1 right-1 p-0.5 bg-red-500 text-white rounded-full hover:bg-red-600"
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={() => setShowExtraImagesPicker(true)}
                                            className="w-24 h-24 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center text-slate-400 hover:border-purple-500 hover:text-purple-500"
                                        >
                                            <Plus size={20} />
                                            <span className="text-xs">Ekle</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Extra Videos */}
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Ek Videolar</label>
                                    <div className="space-y-2">
                                        {formData.extra_videos.map((url, i) => (
                                            <div key={i} className="flex gap-2">
                                                <input
                                                    type="url"
                                                    className="flex-1 p-2 border border-slate-200 rounded-lg outline-none focus:border-purple-500"
                                                    value={url}
                                                    onChange={(e) => handleExtraVideoChange(i, e.target.value)}
                                                    placeholder="https://youtube.com/..."
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveExtraVideo(i)}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={handleAddExtraVideo}
                                            className="flex items-center gap-2 px-4 py-2 text-sm text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-lg"
                                        >
                                            <Plus size={16} /> Video Ekle
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Publish Settings */}
                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                                <h3 className="font-bold text-slate-900 border-b border-slate-200 pb-2 mb-4">Yayın Ayarları</h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-1">
                                            <CheckCircle size={14} className="text-slate-400" /> Durum
                                        </label>
                                        <select
                                            className="w-full p-3 border border-slate-200 rounded-xl focus:border-purple-500 outline-none bg-white"
                                            value={formData.status}
                                            onChange={(e) => handleChange("status", e.target.value)}
                                        >
                                            {STATUS_OPTIONS.map((opt) => (
                                                <option key={opt.value} value={opt.value}>
                                                    {opt.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-1">
                                            <Calendar size={14} className="text-slate-400" /> Yayın Tarihi
                                        </label>
                                        <input
                                            type="datetime-local"
                                            className="w-full p-3 border border-slate-200 rounded-xl focus:border-purple-500 outline-none bg-white"
                                            value={formData.publish_date}
                                            onChange={(e) => handleChange("publish_date", e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Preview Card */}
                            <div className="bg-gradient-to-br from-purple-600 to-indigo-700 p-6 rounded-xl text-white">
                                <h3 className="font-bold mb-4 flex items-center gap-2">
                                    <Play size={18} /> Önizleme
                                </h3>

                                <div className="bg-white/10 rounded-lg overflow-hidden backdrop-blur-sm">
                                    {formData.cover_image_url ? (
                                        <img
                                            src={formData.cover_image_url}
                                            alt="Preview"
                                            className="w-full h-32 object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-32 bg-white/20 flex items-center justify-center">
                                            <Mic size={32} className="opacity-50" />
                                        </div>
                                    )}

                                    <div className="p-4">
                                        <h4 className="font-bold line-clamp-2">{formData.title || "Podcast Başlığı"}</h4>
                                        <p className="text-sm text-white/70 mt-1 line-clamp-2">
                                            {formData.short_description || "Kısa açıklama..."}
                                        </p>
                                        <div className="flex items-center justify-between mt-3 text-xs text-white/60">
                                            <span>{formData.publish_date ? new Date(formData.publish_date).toLocaleDateString("tr-TR") : "Tarih"}</span>
                                            <span>{formData.duration_seconds > 0 ? formatDuration(formData.duration_seconds) : "0:00"}</span>
                                        </div>
                                        <div className="flex flex-wrap gap-1 mt-2">
                                            {formData.tags.slice(0, 3).map((tag) => (
                                                <span key={tag} className="px-2 py-0.5 bg-white/20 rounded text-xs">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                {loading ? "Kaydediliyor..." : podcast ? "Güncelle" : "Kaydet"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {/* Media Picker for Cover */}
            <MediaPickerDialog
                isOpen={showCoverPicker}
                onClose={() => setShowCoverPicker(false)}
                onSelect={(asset) => {
                    handleChange("cover_image_url", asset.url);
                    setShowCoverPicker(false);
                }}
            />

            {/* Media Picker for Extra Images */}
            <MediaPickerDialog
                isOpen={showExtraImagesPicker}
                onClose={() => setShowExtraImagesPicker(false)}
                onSelect={(asset) => {
                    setFormData((prev) => ({
                        ...prev,
                        extra_images: [...prev.extra_images, asset.url],
                    }));
                    setShowExtraImagesPicker(false);
                }}
            />
        </>
    );
};

export default AdminPodcastEditor;
