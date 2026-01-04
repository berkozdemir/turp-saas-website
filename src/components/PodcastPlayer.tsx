import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, Lock } from 'lucide-react';

interface PodcastPlayerProps {
  audioUrl: string;
  previewUrl?: string;
  isAuthenticated?: boolean;
  title?: string;
  onPlayStateChange?: (isPlaying: boolean) => void;
}

export const PodcastPlayer = ({
  audioUrl,
  previewUrl,
  isAuthenticated = false,
  title = 'Podcast',
  onPlayStateChange
}: PodcastPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  // Determine which URL to use
  const currentAudioUrl = isAuthenticated ? audioUrl : (previewUrl || audioUrl);
  const isPreview = !isAuthenticated && previewUrl;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
    };
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
      onPlayStateChange?.(!isPlaying);
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-slate-900">{title}</h3>
        {isPreview && (
          <span className="flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 text-xs rounded-full">
            <Lock size={12} />
            30 saniye ön izleme
          </span>
        )}
      </div>

      {/* Player */}
      <div className="space-y-4">
        {/* Play Button */}
        <div className="flex items-center justify-center">
          <button
            onClick={togglePlay}
            className="w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white hover:shadow-lg transition-shadow"
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
          </button>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleProgressChange}
            className="w-full h-2 bg-purple-200 rounded-full cursor-pointer accent-purple-600"
          />
          <div className="flex justify-between text-xs text-slate-600">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-3">
          <Volume2 size={16} className="text-slate-500" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={handleVolumeChange}
            className="flex-1 h-2 bg-purple-200 rounded-full cursor-pointer accent-purple-600"
          />
        </div>

        {/* Login CTA for preview */}
        {isPreview && (
          <div className="pt-2 border-t border-purple-200">
            <p className="text-xs text-slate-600 mb-2">
              Tamamını dinlemek için üye olun
            </p>
            <button className="w-full px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors">
              Üye Ol / Giriş Yap
            </button>
          </div>
        )}
      </div>

      {/* Hidden Audio Element */}
      <audio ref={audioRef} src={currentAudioUrl} />
    </div>
  );
};

export default PodcastPlayer;
