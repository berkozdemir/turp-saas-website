import { usePodcastPlayer } from "../context/PodcastPlayerContext";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, X, Mic } from "lucide-react";

export const GlobalPodcastPlayer = () => {
    const {
        currentEpisode,
        isPlaying,
        currentTime,
        duration,
        volume,
        isVisible,
        togglePlay,
        seekRelative,
        seek,
        setVolume,
        closePlayer,
    } = usePodcastPlayer();

    if (!isVisible || !currentEpisode) return null;

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl border-t border-slate-700">
            {/* Progress bar (clickable) */}
            <div
                className="h-1 bg-slate-700 cursor-pointer group"
                onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const percent = (e.clientX - rect.left) / rect.width;
                    seek(percent * duration);
                }}
            >
                <div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <div className="max-w-7xl mx-auto px-4 py-3">
                <div className="flex items-center gap-4">
                    {/* Cover & Info */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        {currentEpisode.cover_image_url ? (
                            <img
                                src={currentEpisode.cover_image_url}
                                alt={currentEpisode.title}
                                className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                            />
                        ) : (
                            <div className="w-12 h-12 rounded-lg bg-slate-700 flex items-center justify-center flex-shrink-0">
                                <Mic size={20} className="text-slate-400" />
                            </div>
                        )}
                        <div className="min-w-0">
                            <h4 className="font-bold text-sm truncate">{currentEpisode.title}</h4>
                            <p className="text-xs text-slate-400 truncate">
                                {currentEpisode.short_description}
                            </p>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-2">
                        {/* -15s */}
                        <button
                            onClick={() => seekRelative(-15)}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors"
                            aria-label="15 saniye geri"
                        >
                            <SkipBack size={18} />
                        </button>

                        {/* Play/Pause */}
                        <button
                            onClick={togglePlay}
                            className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full hover:opacity-90 transition-opacity"
                            aria-label={isPlaying ? "Duraklat" : "Oynat"}
                        >
                            {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
                        </button>

                        {/* +15s */}
                        <button
                            onClick={() => seekRelative(15)}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors"
                            aria-label="15 saniye ileri"
                        >
                            <SkipForward size={18} />
                        </button>
                    </div>

                    {/* Time */}
                    <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 font-mono">
                        <span>{formatTime(currentTime)}</span>
                        <span>/</span>
                        <span>{formatTime(duration)}</span>
                    </div>

                    {/* Volume */}
                    <div className="hidden md:flex items-center gap-2">
                        <button
                            onClick={() => setVolume(volume > 0 ? 0 : 1)}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors"
                            aria-label={volume > 0 ? "Sesi kapat" : "Sesi aç"}
                        >
                            {volume > 0 ? <Volume2 size={18} /> : <VolumeX size={18} />}
                        </button>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={volume}
                            onChange={(e) => setVolume(parseFloat(e.target.value))}
                            className="w-20 accent-purple-500"
                        />
                    </div>

                    {/* Close */}
                    <button
                        onClick={closePlayer}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"
                        aria-label="Oynatıcıyı kapat"
                    >
                        <X size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};
