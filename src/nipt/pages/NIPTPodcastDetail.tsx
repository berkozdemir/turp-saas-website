import { NIPTHeader } from '../components/NIPTHeader';
import { NIPTFooter } from '../components/NIPTFooter';
import { PodcastAIDisclaimer } from '../components/PodcastAIDisclaimer';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Mic, Play, Pause, Calendar, Clock, Loader2, ArrowLeft, ExternalLink, Lock } from 'lucide-react';
import { usePodcastPlayer } from '../../context/PodcastPlayerContext';

const API_URL = import.meta.env.VITE_API_URL || '/api';

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
        month: 'long',
        year: 'numeric'
    });
};

export const NIPTPodcastDetail = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const { playEpisode, currentEpisode, isPlaying, togglePlay } = usePodcastPlayer();

    const [episode, setEpisode] = useState<Episode | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (slug) fetchEpisode();
    }, [slug]);

    const fetchEpisode = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_URL}/index.php?action=get_podcast_detail&slug=${slug}`, {
                headers: {
                    'X-Tenant-Id': '3', // NIPT tenant
                }
            });
            const data = await res.json();
            if (data.success && data.data) {
                setEpisode(data.data);
            } else {
                setError('Podcast bulunamadı');
            }
        } catch (err) {
            console.error('Podcast fetch error:', err);
            setError('Bağlantı hatası');
        } finally {
            setLoading(false);
        }
    };

    const handlePlay = () => {
        if (!episode) return;

        if (currentEpisode?.id === episode.id) {
            togglePlay();
        } else {
            playEpisode({
                id: episode.id,
                slug: episode.slug,
                title: episode.title,
                audio_url: episode.audio_url,
                preview_clip_url: episode.preview_clip_url,
                cover_image_url: episode.cover_image_url,
            });
        }
    };

    const isCurrentPlaying = currentEpisode?.id === episode?.id && isPlaying;
    const isPreviewOnly = episode && !!episode.preview_clip_url;

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <NIPTHeader />

            <main className="flex-1">
                {loading ? (
                    <div className="flex items-center justify-center py-32">
                        <Loader2 size={40} className="animate-spin text-purple-500" />
                    </div>
                ) : error || !episode ? (
                    <div className="text-center py-32">
                        <p className="text-red-500 mb-4">{error || 'Podcast bulunamadı'}</p>
                        <button
                            onClick={() => navigate('/podcast')}
                            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                        >
                            Podcast Listesine Dön
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Hero */}
                        <section className="relative py-16 px-6 bg-gradient-to-br from-purple-600 to-pink-600 text-white">
                            <div className="max-w-4xl mx-auto">
                                <button
                                    onClick={() => navigate('/podcast')}
                                    className="flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
                                >
                                    <ArrowLeft size={18} />
                                    Tüm Podcastler
                                </button>

                                <div className="grid md:grid-cols-3 gap-8 items-start">
                                    {/* Cover */}
                                    <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl">
                                        {episode.cover_image_url ? (
                                            <img
                                                src={episode.cover_image_url}
                                                alt={episode.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-400 to-pink-400">
                                                <Mic size={64} className="text-white/50" />
                                            </div>
                                        )}
                                        {isPreviewOnly && (
                                            <div className="absolute top-3 right-3 px-3 py-1.5 bg-amber-400 text-amber-950 text-sm font-bold rounded-lg flex items-center gap-1">
                                                <Lock size={14} />
                                                ÖNİZLEME
                                            </div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="md:col-span-2">
                                        <h1 className="text-3xl md:text-4xl font-bold mb-4">{episode.title}</h1>

                                        <div className="flex flex-wrap items-center gap-4 text-purple-100 mb-6">
                                            {episode.publish_date && (
                                                <span className="flex items-center gap-2">
                                                    <Calendar size={16} />
                                                    {formatDate(episode.publish_date)}
                                                </span>
                                            )}
                                            {episode.duration_seconds && (
                                                <span className="flex items-center gap-2">
                                                    <Clock size={16} />
                                                    {formatDuration(episode.duration_seconds)}
                                                </span>
                                            )}
                                        </div>

                                        {episode.short_description && (
                                            <p className="text-lg text-purple-100 mb-6">{episode.short_description}</p>
                                        )}

                                        {/* Play Button */}
                                        <button
                                            onClick={handlePlay}
                                            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-purple-600 font-bold rounded-full shadow-lg hover:shadow-xl transition-all"
                                        >
                                            {isCurrentPlaying ? (
                                                <>
                                                    <Pause size={24} />
                                                    Duraklat
                                                </>
                                            ) : (
                                                <>
                                                    <Play size={24} className="ml-1" />
                                                    {isPreviewOnly ? 'Önizlemeyi Dinle' : 'Dinle'}
                                                </>
                                            )}
                                        </button>

                                        {/* External Links */}
                                        {episode.external_links && Object.keys(episode.external_links).length > 0 && (
                                            <div className="flex flex-wrap gap-3 mt-6">
                                                {episode.external_links.spotify && (
                                                    <a
                                                        href={episode.external_links.spotify}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-full text-sm font-medium hover:bg-green-600 transition-colors"
                                                    >
                                                        Spotify
                                                        <ExternalLink size={14} />
                                                    </a>
                                                )}
                                                {episode.external_links.apple && (
                                                    <a
                                                        href={episode.external_links.apple}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-full text-sm font-medium hover:bg-pink-600 transition-colors"
                                                    >
                                                        Apple Podcasts
                                                        <ExternalLink size={14} />
                                                    </a>
                                                )}
                                                {episode.external_links.youtube && (
                                                    <a
                                                        href={episode.external_links.youtube}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-full text-sm font-medium hover:bg-red-600 transition-colors"
                                                    >
                                                        YouTube
                                                        <ExternalLink size={14} />
                                                    </a>
                                                )}
                                            </div>
                                        )}

                                        {/* AI Disclaimer */}
                                        <div className="mt-6">
                                            <PodcastAIDisclaimer />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Full Description */}
                        {episode.full_description && (
                            <section className="py-16 px-6">
                                <div className="max-w-3xl mx-auto">
                                    <h2 className="text-2xl font-bold text-slate-900 mb-6">Bölüm Hakkında</h2>
                                    <div
                                        className="prose prose-slate max-w-none"
                                        dangerouslySetInnerHTML={{ __html: episode.full_description }}
                                    />
                                </div>
                            </section>
                        )}

                        {/* Tags */}
                        {episode.tags && episode.tags.length > 0 && (
                            <section className="py-8 px-6 border-t border-slate-200">
                                <div className="max-w-3xl mx-auto">
                                    <div className="flex flex-wrap gap-2">
                                        {episode.tags.map((tag, i) => (
                                            <span
                                                key={i}
                                                className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full"
                                            >
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </section>
                        )}
                    </>
                )}
            </main>

            <NIPTFooter />
        </div>
    );
};

export default NIPTPodcastDetail;
