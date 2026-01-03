import { createContext, useContext, useState, useRef, useEffect, ReactNode } from "react";

interface Episode {
    id: number;
    slug: string;
    title: string;
    short_description?: string;
    audio_url: string;
    cover_image_url?: string;
    duration_seconds?: number;
}

interface PodcastPlayerContextType {
    currentEpisode: Episode | null;
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    volume: number;
    isVisible: boolean;
    playEpisode: (episode: Episode) => void;
    pause: () => void;
    resume: () => void;
    togglePlay: () => void;
    seek: (time: number) => void;
    seekRelative: (delta: number) => void;
    setVolume: (vol: number) => void;
    closePlayer: () => void;
}

const PodcastPlayerContext = createContext<PodcastPlayerContextType | null>(null);

export const usePodcastPlayer = () => {
    const ctx = useContext(PodcastPlayerContext);
    if (!ctx) {
        throw new Error("usePodcastPlayer must be used within PodcastPlayerProvider");
    }
    return ctx;
};

interface PodcastPlayerProviderProps {
    children: ReactNode;
}

export const PodcastPlayerProvider = ({ children }: PodcastPlayerProviderProps) => {
    const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolumeState] = useState(1);
    const [isVisible, setIsVisible] = useState(false);

    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Initialize audio element
    useEffect(() => {
        const audio = new Audio();
        audio.volume = volume;
        audioRef.current = audio;

        audio.addEventListener("timeupdate", () => {
            setCurrentTime(audio.currentTime);
        });

        audio.addEventListener("loadedmetadata", () => {
            setDuration(audio.duration);
        });

        audio.addEventListener("ended", () => {
            setIsPlaying(false);
        });

        audio.addEventListener("play", () => setIsPlaying(true));
        audio.addEventListener("pause", () => setIsPlaying(false));
        audio.addEventListener("error", () => {
            console.error("[PodcastPlayer] Audio error:", audio.error);
        });

        return () => {
            audio.pause();
            audio.src = "";
        };
    }, []);

    const playEpisode = (episode: Episode) => {
        if (!episode.audio_url) {
            console.warn("[PodcastPlayer] No audio_url provided for episode:", episode.title);
            return;
        }

        const audio = audioRef.current;
        if (!audio) {
            console.warn("[PodcastPlayer] Audio element not initialized");
            return;
        }

        // If same episode, just resume
        if (currentEpisode?.id === episode.id && audio.src) {
            audio.play().catch(err => console.error("[PodcastPlayer] Resume failed:", err));
            setIsPlaying(true);
            setIsVisible(true);
            return;
        }

        // New episode
        console.log("[PodcastPlayer] Playing new episode:", episode.title, episode.audio_url);
        setCurrentEpisode(episode);
        audio.src = episode.audio_url;
        audio.load();
        audio.play()
            .then(() => {
                console.log("[PodcastPlayer] Playback started successfully");
            })
            .catch(err => {
                console.error("[PodcastPlayer] Play failed:", err);
                // Still show player so user can manually click play
            });
        setIsPlaying(true);
        setIsVisible(true);
        setCurrentTime(0);
    };

    const pause = () => {
        audioRef.current?.pause();
        setIsPlaying(false);
    };

    const resume = () => {
        audioRef.current?.play();
        setIsPlaying(true);
    };

    const togglePlay = () => {
        if (isPlaying) {
            pause();
        } else {
            resume();
        }
    };

    const seek = (time: number) => {
        const audio = audioRef.current;
        if (audio) {
            audio.currentTime = Math.max(0, Math.min(time, duration));
            setCurrentTime(audio.currentTime);
        }
    };

    const seekRelative = (delta: number) => {
        const audio = audioRef.current;
        if (audio) {
            audio.currentTime = Math.max(0, Math.min(audio.currentTime + delta, duration));
            setCurrentTime(audio.currentTime);
        }
    };

    const setVolume = (vol: number) => {
        const v = Math.max(0, Math.min(1, vol));
        setVolumeState(v);
        if (audioRef.current) {
            audioRef.current.volume = v;
        }
    };

    const closePlayer = () => {
        const audio = audioRef.current;
        if (audio) {
            audio.pause();
            audio.src = "";
        }
        setCurrentEpisode(null);
        setIsPlaying(false);
        setIsVisible(false);
        setCurrentTime(0);
        setDuration(0);
    };

    return (
        <PodcastPlayerContext.Provider
            value={{
                currentEpisode,
                isPlaying,
                currentTime,
                duration,
                volume,
                isVisible,
                playEpisode,
                pause,
                resume,
                togglePlay,
                seek,
                seekRelative,
                setVolume,
                closePlayer,
            }}
        >
            {children}
        </PodcastPlayerContext.Provider>
    );
};
