import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Mic, Play, ChevronRight, Calendar, Clock, Loader2, ExternalLink, MessageCircle } from "lucide-react";
import { usePodcastPlayer } from "../context/PodcastPlayerContext";
import { PodcastChatTab } from "../components/chatbot/PodcastChatTab";

interface Episode {
    id: number;
    slug: string;
    title: string;
    short_description?: string;
    audio_url: string;
    cover_image_url?: string;
    duration_seconds?: number;
    publish_date?: string;
    tags?: string[];
    external_links?: {
        spotify?: string;
        apple?: string;
        youtube?: string;
    };
}

// Helper: Format duration
const formatDuration = (seconds?: number) => {
    if (!seconds) return "";
    const mins = Math.floor(seconds / 60);
    return `${mins} dk`;
};

// Sub-component: EpisodeCard
interface EpisodeCardProps {
    episode: Episode;
    isActive: boolean;
    isPlaying: boolean;
    onPlay: () => void;
}

function EpisodeCard({ episode, isActive, isPlaying, onPlay }: EpisodeCardProps) {
    return (
        <div
            className={`bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-lg transition-shadow group ${isActive ? "border-purple-500 ring-2 ring-purple-100" : "border-slate-200"
                }`}
        >
            {/* Cover */}
            <div className="relative aspect-video bg-slate-100">
                {episode.cover_image_url ? (
                    <img
                        src={episode.cover_image_url}
                        alt={episode.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
                        <Mic size={48} className="text-purple-300" />
                    </div>
                )}

                {/* Play Overlay */}
                <button
                    onClick={onPlay}
                    className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                        <Play size={28} className="text-purple-600 ml-1" />
                    </div>
                </button>

                {/* Duration Badge */}
                {episode.duration_seconds && (
                    <span className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-xs rounded-md">
                        {formatDuration(episode.duration_seconds)}
                    </span>
                )}
            </div>

            {/* Content */}
            <div className="p-5">
                <h3 className="font-bold text-lg text-slate-900 mb-2 line-clamp-2">{episode.title}</h3>

                {episode.short_description && (
                    <p className="text-slate-500 text-sm mb-4 line-clamp-2">{episode.short_description}</p>
                )}

                {/* Meta */}
                <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
                    {episode.publish_date && (
                        <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            {new Date(episode.publish_date).toLocaleDateString("tr-TR")}
                        </span>
                    )}
                    {episode.duration_seconds && (
                        <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {formatDuration(episode.duration_seconds)}
                        </span>
                    )}
                </div>

                {/* Tags */}
                {episode.tags && episode.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                        {episode.tags.slice(0, 3).map((tag) => (
                            <span
                                key={tag}
                                className="px-2 py-0.5 bg-purple-50 text-purple-600 text-xs rounded-full"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={onPlay}
                        className={`flex-1 py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors ${isActive
                            ? "bg-purple-600 text-white"
                            : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                            }`}
                    >
                        <Play size={16} />
                        {isPlaying ? "Çalıyor..." : "Dinle"}
                    </button>

                    <a
                        href={`/podcast/${episode.slug}`}
                        className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-1"
                    >
                        Detaylar
                        <ChevronRight size={14} />
                    </a>
                </div>
            </div>
        </div>
    );
}

// Main Component
export const PodcastHub = () => {
    const { playEpisode, currentEpisode, isPlaying } = usePodcastPlayer();

    const [episodes, setEpisodes] = useState<Episode[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [availableTags, setAvailableTags] = useState<string[]>([]);
    const [activeTab, setActiveTab] = useState<'episodes' | 'chat'>('episodes');

    const API_URL = import.meta.env.VITE_API_URL || "/api";
    const API_BASE_URL = API_URL.endsWith("/index.php") ? API_URL : `${API_URL}/index.php`;

    const fetchEpisodes = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ action: "get_podcasts_public" });
            if (selectedTag) params.append("tag", selectedTag);

            const response = await fetch(`${API_BASE_URL}?${params.toString()}`);
            const data = await response.json();

            if (data.success) {
                setEpisodes(data.data || []);
                // Extract unique tags
                const tags = new Set<string>();
                (data.data || []).forEach((ep: Episode) => {
                    (ep.tags || []).forEach((tag) => tags.add(tag));
                });
                setAvailableTags(Array.from(tags));
            }
        } catch (err) {
            console.error("Failed to fetch podcasts:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEpisodes();
    }, [selectedTag]);

    const latestEpisode = episodes[0];

    const handlePlayLatest = () => {
        if (latestEpisode?.audio_url) {
            playEpisode(latestEpisode);
        }
    };

    return (
        <>
            {/* SEO */}
            <Helmet>
                <title>Hamilelik Yolculuğu Podcast Serisi | Nipt.tr - Omega Genetik</title>
                <meta name="description" content="Uzman doktorlarımız ile hazırladığımız podcast bölümlerinde hamilelik sürecini, genetik testleri ve sağlıklı bir gebelik için önemli bilgileri paylaşıyoruz." />
                <meta property="og:title" content="Hamilelik Yolculuğu Podcast Serisi | Nipt.tr" />
                <meta property="og:description" content="Uzman doktorlarımız ile hazırladığımız podcast bölümlerinde hamilelik sürecini ve genetik testleri konuşuyoruz." />
                <meta property="og:type" content="website" />
                <link rel="canonical" href="https://nipt.tr/podcast" />
            </Helmet>

            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
                {/* Hero Section - Omega Genetik Navy Theme */}
                <section className="bg-gradient-to-br from-[#1a365d] via-[#2c5282] to-[#1a365d] text-white py-20 px-4">
                    <div className="max-w-5xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-sm font-medium mb-6">
                            <Mic size={16} />
                            <span>Podcast Serisi</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Hamilelik Yolculuğu Podcast Serisi
                        </h1>

                        <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
                            Uzman doktorlarımız ile hazırladığımız podcast bölümlerinde hamilelik sürecini,
                            genetik testleri ve sağlıklı bir gebelik için önemli bilgileri paylaşıyoruz.
                        </p>

                        <p className="text-sm text-white/60 mb-8">
                            * Bu içerikler genel bilgilendirme amaçlıdır ve kişisel tıbbi tavsiye yerine geçmez.
                        </p>

                        {latestEpisode && (
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <button
                                    onClick={handlePlayLatest}
                                    className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full font-bold hover:opacity-90 transition-opacity flex items-center gap-2"
                                >
                                    <Play size={20} />
                                    Son Bölümü Dinle
                                </button>

                                {latestEpisode.external_links?.spotify && (
                                    <a
                                        href={latestEpisode.external_links.spotify}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-4 py-2 bg-white/10 rounded-full text-sm hover:bg-white/20 transition-colors flex items-center gap-2"
                                    >
                                        <ExternalLink size={14} />
                                        Spotify
                                    </a>
                                )}

                                {latestEpisode.external_links?.apple && (
                                    <a
                                        href={latestEpisode.external_links.apple}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-4 py-2 bg-white/10 rounded-full text-sm hover:bg-white/20 transition-colors flex items-center gap-2"
                                    >
                                        <ExternalLink size={14} />
                                        Apple Podcasts
                                    </a>
                                )}
                            </div>
                        )}
                    </div>
                </section>

                {/* Content */}
                <section className="max-w-6xl mx-auto px-4 py-12">
                    {/* Tab Navigation */}
                    <div className="flex gap-2 mb-8 border-b border-gray-200">
                        <button
                            onClick={() => setActiveTab('episodes')}
                            className={`pb-4 px-6 font-medium transition-colors ${activeTab === 'episodes'
                                    ? 'border-b-2 border-purple-600 text-purple-600'
                                    : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <span className="flex items-center gap-2">
                                <Mic size={18} />
                                Podcast Bölümleri
                            </span>
                        </button>
                        <button
                            onClick={() => setActiveTab('chat')}
                            className={`pb-4 px-6 font-medium transition-colors ${activeTab === 'chat'
                                    ? 'border-b-2 border-purple-600 text-purple-600'
                                    : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <span className="flex items-center gap-2">
                                <MessageCircle size={18} />
                                Soru & Cevap
                            </span>
                        </button>
                    </div>

                    {/* Episodes Tab */}
                    {activeTab === 'episodes' && (
                        <>
                            {/* Tag Filters */}
                            {availableTags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-8">
                                    <button
                                        onClick={() => setSelectedTag(null)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${!selectedTag
                                            ? "bg-purple-600 text-white"
                                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                            }`}
                                    >
                                        Tümü
                                    </button>
                                    {availableTags.map((tag) => (
                                        <button
                                            key={tag}
                                            onClick={() => setSelectedTag(tag)}
                                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedTag === tag
                                                ? "bg-purple-600 text-white"
                                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                                }`}
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Episode List */}
                            {loading ? (
                                <div className="flex items-center justify-center py-20">
                                    <Loader2 className="animate-spin text-purple-600" size={40} />
                                </div>
                            ) : episodes.length === 0 ? (
                                <div className="text-center py-20">
                                    <Mic size={64} className="mx-auto text-slate-300 mb-4" />
                                    <h3 className="text-xl font-bold text-slate-700 mb-2">Yakında Yeni Bölümler</h3>
                                    <p className="text-slate-500">
                                        Podcast bölümlerimiz hazırlanıyor. Yakında burada dinleyebileceksiniz!
                                    </p>
                                </div>
                            ) : (
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {episodes.map((episode) => (
                                        <EpisodeCard
                                            key={episode.id}
                                            episode={episode}
                                            isActive={currentEpisode?.id === episode.id}
                                            isPlaying={currentEpisode?.id === episode.id && isPlaying}
                                            onPlay={() => playEpisode(episode)}
                                        />
                                    ))}
                                </div>
                            )}
                        </>
                    )}

                    {/* Chat Tab */}
                    {activeTab === 'chat' && (
                        <PodcastChatTab contextType="podcast_hub" />
                    )}
                </section>
            </div>
        </>
    );
};

export default PodcastHub;
