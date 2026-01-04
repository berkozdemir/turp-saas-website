import { useState, useEffect, useCallback } from "react";
import { Settings, Play, Pause, CheckCircle2, AlertCircle, Loader2, HardDrive, Image as ImageIcon } from "lucide-react";
import { getTenantHeader } from "../../context/TenantContext";

const API_URL = import.meta.env.VITE_API_URL || '/api';

interface OptimizationStats {
    total_images: number;
    optimized_count: number;
    unoptimized_count: number;
    total_size_bytes: number;
    total_original_size_bytes: number;
    bytes_saved: number;
    percentage_saved: number;
}

interface BatchResult {
    success: boolean;
    processed: number;
    optimized: number;
    skipped: number;
    bytes_saved: number;
    remaining: number;
    errors?: { id: number; error: string }[];
}

export function ImageOptimizerPanel() {
    const [stats, setStats] = useState<OptimizationStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isOptimizing, setIsOptimizing] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [progress, setProgress] = useState({ processed: 0, total: 0 });
    const [totalBytesSaved, setTotalBytesSaved] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [onlyUnoptimized, setOnlyUnoptimized] = useState(true);
    const [batchSize] = useState(25);

    const authToken = localStorage.getItem('authToken');
    const tenantHeader = getTenantHeader();

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    const fetchStats = useCallback(async () => {
        try {
            const res = await fetch(`${API_URL}/index.php?action=get_media_optimization_stats`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    ...tenantHeader
                }
            });
            const data = await res.json();
            if (data.success && data.data) {
                setStats(data.data);
            }
        } catch (err) {
            console.error('Failed to fetch stats:', err);
        } finally {
            setIsLoading(false);
        }
    }, [authToken, tenantHeader]);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    const runBatch = async (): Promise<BatchResult | null> => {
        try {
            const res = await fetch(`${API_URL}/index.php?action=optimize_media_batch`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                    ...tenantHeader
                },
                body: JSON.stringify({
                    limit: batchSize,
                    only_unoptimized: onlyUnoptimized
                })
            });
            return await res.json();
        } catch (err) {
            console.error('Batch optimization error:', err);
            return null;
        }
    };

    const startOptimization = async () => {
        setIsOptimizing(true);
        setIsPaused(false);
        setError(null);
        setProgress({ processed: 0, total: stats?.unoptimized_count || 0 });
        setTotalBytesSaved(0);

        let totalProcessed = 0;
        let totalSaved = 0;
        let remaining = stats?.unoptimized_count || 1;

        while (remaining > 0 && !isPaused) {
            const result = await runBatch();

            if (!result || !result.success) {
                setError('Optimizasyon sırasında bir hata oluştu');
                break;
            }

            totalProcessed += result.processed;
            totalSaved += result.bytes_saved;
            remaining = result.remaining;

            setProgress({ processed: totalProcessed, total: (stats?.unoptimized_count || 0) });
            setTotalBytesSaved(totalSaved);

            if (result.remaining === 0 || result.processed === 0) {
                break;
            }

            // Small delay between batches
            await new Promise(r => setTimeout(r, 100));
        }

        setIsOptimizing(false);
        fetchStats(); // Refresh stats
    };

    const pauseOptimization = () => {
        setIsPaused(true);
    };

    if (isLoading) {
        return (
            <div className="p-8 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Settings className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-slate-900">Görsel Optimizasyonu</h2>
                    <p className="text-sm text-slate-500">Görselleri küçülterek yükleme hızını artırın</p>
                </div>
            </div>

            {/* Stats Grid */}
            {stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-slate-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
                            <ImageIcon className="w-4 h-4" />
                            Toplam Görsel
                        </div>
                        <div className="text-2xl font-bold text-slate-900">{stats.total_images}</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 text-green-600 text-sm mb-1">
                            <CheckCircle2 className="w-4 h-4" />
                            Optimize Edilmiş
                        </div>
                        <div className="text-2xl font-bold text-green-700">{stats.optimized_count}</div>
                    </div>
                    <div className="bg-amber-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 text-amber-600 text-sm mb-1">
                            <AlertCircle className="w-4 h-4" />
                            Bekleyen
                        </div>
                        <div className="text-2xl font-bold text-amber-700">{stats.unoptimized_count}</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 text-purple-600 text-sm mb-1">
                            <HardDrive className="w-4 h-4" />
                            Kazanç
                        </div>
                        <div className="text-2xl font-bold text-purple-700">
                            {formatBytes(stats.bytes_saved)}
                            {stats.percentage_saved > 0 && (
                                <span className="text-sm font-normal ml-1">(%{stats.percentage_saved})</span>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Progress */}
            {isOptimizing && (
                <div className="mb-6">
                    <div className="flex justify-between text-sm text-slate-600 mb-2">
                        <span>İşlenen: {progress.processed} / {progress.total}</span>
                        <span>Kazanç: {formatBytes(totalBytesSaved)}</span>
                    </div>
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                            style={{ width: `${progress.total > 0 ? (progress.processed / progress.total) * 100 : 0}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                    {error}
                </div>
            )}

            {/* Controls */}
            <div className="flex flex-wrap items-center gap-4">
                <label className="flex items-center gap-2 text-sm text-slate-600">
                    <input
                        type="checkbox"
                        checked={onlyUnoptimized}
                        onChange={(e) => setOnlyUnoptimized(e.target.checked)}
                        disabled={isOptimizing}
                        className="rounded border-slate-300"
                    />
                    Sadece optimize edilmemiş görselleri işle
                </label>

                <div className="flex-1" />

                {!isOptimizing ? (
                    <button
                        onClick={startOptimization}
                        disabled={stats?.unoptimized_count === 0}
                        className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <Play className="w-4 h-4" />
                        Optimizasyonu Başlat
                    </button>
                ) : (
                    <button
                        onClick={pauseOptimization}
                        className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition-colors"
                    >
                        <Pause className="w-4 h-4" />
                        Duraklat
                    </button>
                )}
            </div>
        </div>
    );
}

export default ImageOptimizerPanel;
