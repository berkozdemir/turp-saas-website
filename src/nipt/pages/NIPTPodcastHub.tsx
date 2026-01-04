import { NIPTHeader } from '../components/NIPTHeader';
import { NIPTFooter } from '../components/NIPTFooter';
import { PodcastAIDisclaimer } from '../components/PodcastAIDisclaimer';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, Play, Calendar, Clock, Loader2, ExternalLink, Lock } from 'lucide-react';
import { usePodcastPlayer } from '../../context/PodcastPlayerContext';

const API_URL = import.meta.env.VITE_API_URL || '/api';

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
    preview_clip_url?: string;
}

const formatDuration = (seconds?: number) => {
    if (!seconds) return "";
    const mins = Math.floor(seconds / 60);
    return `${mins} dk`;
};

const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
};

export const NIPTPodcastHub = () => {
    const navigate = useNavigate();
    const { playEpisode, currentEpisode, isPlaying } = usePodcastPlayer();
    const [episodes, setEpisodes] = useState<Episode[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchEpisodes();
    }, []);

    const fetchEpisodes = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_URL}/index.php?action=get_podcasts&language=tr`, {
                headers: {
                    'X-Tenant-Id': '3', // NIPT tenant
                }
            });
            const data = await res.json();
            if (data.success && data.data) {
                setEpisodes(data.data);
            } else {
                setError('Podcast içerikleri yüklenemedi');
            }
        } catch (err) {
            console.error('Podcast fetch error:', err);
            setError('Bağlantı hatası');
        } finally {
            setLoading(false);
        }
    };

    const handlePlay = (episode: Episode) => {
        playEpisode({
            id: episode.id,
            slug: episode.slug,
            title: episode.title,
            audio_url: episode.audio_url,
            preview_clip_url: episode.preview_clip_url,
            cover_image_url: episode.cover_image_url,
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <NIPTHeader />

            {/* Hero */}
            <section className="relative py-20 px-6 bg-gradient-to-br from-purple-600 to-pink-600 text-white overflow-hidden">
                <div className="absolute inset-0 bg-[url('/images/sound-wave.svg')] opacity-10" />
                <div className="max-w-5xl mx-auto relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-sm font-medium mb-6">
                        <Mic size={16} />
                        Omega Genetik Podcast
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        Genetik ve Sağlık Podcast'i
                    </h1>
                    <p className="text-lg md:text-xl text-purple-100 max-w-2xl mx-auto">
                        Uzman doktorlarımızla prenatal testler, genetik ve sağlık hakkında bilgilendirici içerikler.
                    </p>
                </div>
            </section>

            {/* Episodes Grid */}
            <section className="py-16 px-6 flex-1">
                <div className="max-w-6xl mx-auto">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 size={40} className="animate-spin text-purple-500" />
                        </div>
                    ) : error ? (
                        <div className="text-center py-20">
                            <p className="text-red-500 mb-4">{error}</p>
                            <button
                                onClick={fetchEpisodes}
                                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                            >
                                Tekrar Dene
                            </button>
                        </div>
                    ) : episodes.length === 0 ? (
                        <div className="text-center py-20 text-slate-500">
                            <Mic size={48} className="mx-auto mb-4 opacity-30" />
                            <p>Henüz podcast bölümü bulunmuyor.</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {episodes.map((episode) => (
                                <EpisodeCard
                                    key={episode.id}
                                    episode={episode}
                                    isActive={currentEpisode?.id === episode.id}
                                    isPlaying={isPlaying && currentEpisode?.id === episode.id}
                                    onPlay={() => handlePlay(episode)}
                                    onDetail={() => navigate(`/podcast/${episode.slug}`)}
                                />
                            ))}
                        </div>
                    )}

                    {/* AI Disclaimer - shown once under the grid */}
                    {!loading && !error && episodes.length > 0 && (
                        <div className="mt-10 max-w-2xl mx-auto">
                            <PodcastAIDisclaimer />
                        </div>
                    )}
                </div>
            </section>

            <NIPTFooter />
        </div>
    );
};

// Episode Card Component
interface EpisodeCardProps {
    episode: Episode;
    isActive: boolean;
    isPlaying: boolean;
    onPlay: () => void;
    onDetail: () => void;
}

function EpisodeCard({ episode, isActive, isPlaying, onPlay, onDetail }: EpisodeCardProps) {
    const isPreviewOnly = !!episode.preview_clip_url;

    return (
        <div
            className={`bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-lg transition-all group ${isActive ? 'border-purple-500 ring-2 ring-purple-100' : 'border-slate-200'
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

                {isPreviewOnly && (
                    <div className="absolute top-2 right-2 px-2 py-1 bg-amber-400 text-amber-950 text-xs font-bold rounded flex items-center gap-1">
                        <Lock size={10} />
                        ÖNİZLEME
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
            </div>

            {/* Content */}
            <div className="p-5">
                <h3 className="font-bold text-slate-900 mb-2 line-clamp-2">{episode.title}</h3>
                {episode.short_description && (
                    <p className="text-sm text-slate-500 mb-3 line-clamp-2">{episode.short_description}</p>
                )}
                <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
                    {episode.publish_date && (
                        <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            {formatDate(episode.publish_date)}
                        </span>
                    )}
                    {episode.duration_seconds && (
                        <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {formatDuration(episode.duration_seconds)}
                        </span>
                    )}
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={onPlay}
                        className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-lg transition-colors"
                    >
                        {isPlaying ? 'Oynatılıyor...' : 'Dinle'}
                    </button>
                    <button
                        onClick={onDetail}
                        className="px-4 py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-semibold rounded-lg transition-colors"
                    >
                        <ExternalLink size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default NIPTPodcastHub;
