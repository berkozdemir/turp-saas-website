import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
    Play, Pause, Calendar, Clock, ArrowLeft, Mic, ExternalLink, AlertTriangle, Image, Video, Loader2
} from "lucide-react";
import { usePodcastPlayer } from "../context/PodcastPlayerContext";

interface Episode {
    id: number;
    slug: string;
    title: string;
    short_description?: string;
    full_description?: string;
    audio_url: string;
    cover_image_url?: string;
    duration_seconds?: number;
    publish_date?: string;
    tags?: string[];
    external_links?: {
        spotify?: string;
        apple?: string;
        youtube?: string;
        other?: string;
    };
    extra_images?: string[];
    extra_videos?: string[];
}

export const PodcastDetail = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const { playEpisode, currentEpisode, isPlaying, togglePlay } = usePodcastPlayer();

    const [episode, setEpisode] = useState<Episode | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lightboxImage, setLightboxImage] = useState<string | null>(null);

    const API_URL = import.meta.env.VITE_API_URL || "/api";
    const API_BASE_URL = API_URL.endsWith("/index.php") ? API_URL : `${API_URL}/index.php`;

    useEffect(() => {
        const fetchEpisode = async () => {
            if (!slug) return;
            setLoading(true);
            try {
                const response = await fetch(`${API_BASE_URL}?action=get_podcast_public&slug=${slug}`);
                const data = await response.json();

                if (data.success && data.data) {
                    setEpisode(data.data);
                } else {
                    setError("Podcast bulunamadı");
                }
            } catch (err) {
                console.error("Failed to fetch podcast:", err);
                setError("Yüklenirken bir hata oluştu");
            } finally {
                setLoading(false);
            }
        };

        fetchEpisode();
    }, [slug]);

    const formatDuration = (seconds?: number) => {
        if (!seconds) return "";
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return "";
        return new Date(dateStr).toLocaleDateString("tr-TR", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    const handlePlay = () => {
        if (!episode?.audio_url) return;

        if (currentEpisode?.id === episode.id) {
            togglePlay();
        } else {
            playEpisode(episode);
        }
    };

    const isCurrentEpisode = currentEpisode?.id === episode?.id;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="animate-spin text-purple-600" size={48} />
            </div>
        );
    }

    if (error || !episode) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4">
                <Mic size={64} className="text-slate-300 mb-4" />
                <h2 className="text-2xl font-bold text-slate-700 mb-2">{error || "Podcast bulunamadı"}</h2>
                <button
                    onClick={() => navigate("/podcast")}
                    className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                    Podcaste Geri Dön
                </button>
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>{episode.title} | Nipt.tr Podcast</title>
                <meta name="description" content={episode.short_description || `${episode.title} bölümünü dinleyin.`} />
                <meta property="og:title" content={episode.title} />
                <meta property="og:description" content={episode.short_description} />
                <meta property="og:image" content={episode.cover_image_url || "https://nipt.tr/og-podcast.png"} />
                <meta property="og:type" content="article" />
                <link rel="canonical" href={`https://nipt.tr/podcast/${episode.slug}`} />
            </Helmet>

            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
                {/* Header - Omega Genetik Navy Theme */}
                <div className="bg-gradient-to-br from-[#1a365d] via-[#2c5282] to-[#1a365d] text-white">
                    <div className="max-w-5xl mx-auto px-4 py-6">
                        <button
                            onClick={() => navigate("/podcast")}
                            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
                        >
                            <ArrowLeft size={18} />
                            Tüm Bölümler
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-5xl mx-auto px-4 py-8">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Left: Cover & Play */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-8">
                                {/* Cover Image */}
                                <div className="aspect-square rounded-2xl overflow-hidden bg-slate-100 shadow-xl mb-6">
                                    {episode.cover_image_url ? (
                                        <img
                                            src={episode.cover_image_url}
                                            alt={episode.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
                                            <Mic size={80} className="text-purple-300" />
                                        </div>
                                    )}
                                </div>

                                {/* Play Button */}
                                {episode.audio_url ? (
                                    <button
                                        onClick={handlePlay}
                                        className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-3 shadow-lg"
                                    >
                                        {isCurrentEpisode && isPlaying ? (
                                            <>
                                                <Pause size={24} />
                                                Duraklat
                                            </>
                                        ) : (
                                            <>
                                                <Play size={24} />
                                                Dinle
                                            </>
                                        )}
                                    </button>
                                ) : (
                                    <p className="text-center text-slate-500 text-sm">Ses dosyası mevcut değil</p>
                                )}

                                {/* External Links */}
                                {episode.external_links && Object.values(episode.external_links).some(Boolean) && (
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {episode.external_links.spotify && (
                                            <a
                                                href={episode.external_links.spotify}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-1 px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors flex items-center justify-center gap-2"
                                            >
                                                <ExternalLink size={14} />
                                                Spotify
                                            </a>
                                        )}
                                        {episode.external_links.apple && (
                                            <a
                                                href={episode.external_links.apple}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-1 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200 transition-colors flex items-center justify-center gap-2"
                                            >
                                                <ExternalLink size={14} />
                                                Apple
                                            </a>
                                        )}
                                        {episode.external_links.youtube && (
                                            <a
                                                href={episode.external_links.youtube}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-1 px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors flex items-center justify-center gap-2"
                                            >
                                                <ExternalLink size={14} />
                                                YouTube
                                            </a>
                                        )}
                                    </div>
                                )}

                                {/* Meta Info */}
                                <div className="mt-6 space-y-3 text-sm text-slate-500">
                                    {episode.publish_date && (
                                        <div className="flex items-center gap-2">
                                            <Calendar size={16} />
                                            {formatDate(episode.publish_date)}
                                        </div>
                                    )}
                                    {episode.duration_seconds && (
                                        <div className="flex items-center gap-2">
                                            <Clock size={16} />
                                            {formatDuration(episode.duration_seconds)}
                                        </div>
                                    )}
                                </div>

                                {/* Tags */}
                                {episode.tags && episode.tags.length > 0 && (
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {episode.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-xs font-medium"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right: Content */}
                        <div className="lg:col-span-2">
                            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">{episode.title}</h1>

                            {/* Short Description */}
                            {episode.short_description && (
                                <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                                    {episode.short_description}
                                </p>
                            )}

                            {/* Full Description / Show Notes */}
                            {episode.full_description && (
                                <div className="mb-12">
                                    <h2 className="text-xl font-bold text-slate-800 mb-4">Bölüm Notları</h2>
                                    <div
                                        className="prose prose-slate max-w-none"
                                        dangerouslySetInnerHTML={{ __html: episode.full_description }}
                                    />
                                </div>
                            )}

                            {/* Extra Images */}
                            {episode.extra_images && episode.extra_images.length > 0 && (
                                <div className="mb-12">
                                    <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                                        <Image size={20} />
                                        Ek Görseller
                                    </h2>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {episode.extra_images.map((url, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setLightboxImage(url)}
                                                className="aspect-video rounded-lg overflow-hidden bg-slate-100 hover:opacity-90 transition-opacity"
                                            >
                                                <img src={url} alt={`Görsel ${i + 1}`} className="w-full h-full object-cover" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Extra Videos */}
                            {episode.extra_videos && episode.extra_videos.length > 0 && (
                                <div className="mb-12">
                                    <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                                        <Video size={20} />
                                        Ek Videolar
                                    </h2>
                                    <div className="space-y-4">
                                        {episode.extra_videos.map((url, i) => (
                                            <div key={i} className="aspect-video rounded-lg overflow-hidden bg-slate-900">
                                                {url.includes("youtube.com") || url.includes("youtu.be") ? (
                                                    <iframe
                                                        src={url.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/")}
                                                        className="w-full h-full"
                                                        allowFullScreen
                                                        title={`Video ${i + 1}`}
                                                    />
                                                ) : url.includes("vimeo.com") ? (
                                                    <iframe
                                                        src={url.replace("vimeo.com", "player.vimeo.com/video")}
                                                        className="w-full h-full"
                                                        allowFullScreen
                                                        title={`Video ${i + 1}`}
                                                    />
                                                ) : (
                                                    <video src={url} controls className="w-full h-full" />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Disclaimer */}
                            <div className="mt-12 p-6 bg-amber-50 border border-amber-200 rounded-xl">
                                <div className="flex items-start gap-3">
                                    <AlertTriangle size={24} className="text-amber-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h3 className="font-bold text-amber-800 mb-1">Önemli Bilgilendirme</h3>
                                        <p className="text-amber-700 text-sm leading-relaxed">
                                            Bu podcast bölümü genel bilgilendirme amaçlıdır ve kişisel tıbbi tavsiye yerine
                                            geçmez. Kararlarınızı her zaman kendi hekiminizle birlikte verin.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Lightbox */}
                {lightboxImage && (
                    <div
                        className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
                        onClick={() => setLightboxImage(null)}
                    >
                        <img
                            src={lightboxImage}
                            alt="Lightbox"
                            className="max-w-full max-h-full object-contain"
                        />
                    </div>
                )}
            </div>
        </>
    );
};

export default PodcastDetail;
