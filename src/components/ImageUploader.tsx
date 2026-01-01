import { useState, useRef, useCallback } from 'react';
import {
    Loader2,
    CheckCircle,
    AlertCircle,
    FileImage,
    Trash2
} from 'lucide-react';
import {
    processImage,
    validateImageFile,
    ImageProcessingOptions,
    ProcessedImage,
    IMAGE_PRESETS
} from '../utils/imageProcessing';

export type UploadStatus = 'idle' | 'processing' | 'uploading' | 'success' | 'error';

export interface ImageUploaderProps {
    uploadEndpoint?: string;
    token?: string;
    onUploadSuccess?: (url: string, processedImage: ProcessedImage) => void;
    onUploadError?: (error: string) => void;
    onRemove?: () => void;
    existingImageUrl?: string;
    processingOptions?: ImageProcessingOptions;
    preset?: keyof typeof IMAGE_PRESETS;
    maxFileSizeMB?: number;
    label?: string;
    helperText?: string;
    showSizeInfo?: boolean;
    disabled?: boolean;
    className?: string;
    compact?: boolean;
}

export const ImageUploader = ({
    uploadEndpoint = '/api/index.php?action=upload_image',
    token,
    onUploadSuccess,
    onUploadError,
    onRemove,
    existingImageUrl,
    processingOptions,
    preset,
    maxFileSizeMB = 20,
    label = 'Görsel Yükle',
    helperText = 'JPEG, PNG veya WebP. Maks 20MB.',
    showSizeInfo = true,
    disabled = false,
    className = '',
    compact = false,
}: ImageUploaderProps) => {
    const [status, setStatus] = useState<UploadStatus>('idle');
    const [error, setError] = useState<string | null>(null);
    const [preview, setPreview] = useState<string | null>(existingImageUrl || null);
    const [processedInfo, setProcessedInfo] = useState<ProcessedImage | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const getProcessingOptions = useCallback((): ImageProcessingOptions => {
        const presetOptions = preset ? IMAGE_PRESETS[preset] : {};
        return { ...presetOptions, ...processingOptions };
    }, [preset, processingOptions]);

    const resetState = useCallback(() => {
        setStatus('idle');
        setError(null);
        setPreview(existingImageUrl || null);
        setProcessedInfo(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, [existingImageUrl]);

    const handleFile = useCallback(async (file: File) => {
        setError(null);

        const validation = validateImageFile(file, maxFileSizeMB);
        if (!validation.valid) {
            setError(validation.error!);
            setStatus('error');
            onUploadError?.(validation.error!);
            return;
        }

        try {
            setStatus('processing');
            const processed = await processImage(file, getProcessingOptions());
            setProcessedInfo(processed);
            setPreview(processed.dataUrl);

            setStatus('uploading');
            const formData = new FormData();

            const extension = processed.blob.type.split('/')[1];
            const processedFile = new File(
                [processed.blob],
                `image.${extension}`,
                { type: processed.blob.type }
            );
            formData.append('image', processedFile);

            // Import getTenantHeader dynamically to avoid circular dependencies
            const { getTenantHeader } = await import('../context/TenantContext');
            const tenantHeaders = getTenantHeader();

            // Also add tenant info to FormData as fallback for multipart requests
            if (tenantHeaders['X-Tenant-Id']) {
                formData.append('tenant_id', tenantHeaders['X-Tenant-Id']);
            }
            if (tenantHeaders['X-Tenant-Code']) {
                formData.append('tenant_code', tenantHeaders['X-Tenant-Code']);
            }

            const headers: Record<string, string> = {
                ...tenantHeaders
            };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(uploadEndpoint, {
                method: 'POST',
                headers,
                body: formData,
            });

            const data = await response.json();

            if (data.success && data.url) {
                setStatus('success');
                onUploadSuccess?.(data.url, processed);
            } else {
                throw new Error(data.error || 'Yükleme başarısız oldu');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Bir hata oluştu';
            setError(errorMessage);
            setStatus('error');
            onUploadError?.(errorMessage);
        }
    }, [getProcessingOptions, maxFileSizeMB, onUploadError, onUploadSuccess, token, uploadEndpoint]);

    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFile(file);
        }
    }, [handleFile]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!disabled) {
            setIsDragging(true);
        }
    }, [disabled]);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (disabled) return;

        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) {
            handleFile(file);
        } else {
            setError('Lütfen geçerli bir görsel dosyası bırakın');
            setStatus('error');
        }
    }, [disabled, handleFile]);

    const handleRemove = useCallback(() => {
        resetState();
        onRemove?.();
    }, [resetState, onRemove]);

    const handleClick = useCallback(() => {
        if (!disabled && status !== 'processing' && status !== 'uploading') {
            fileInputRef.current?.click();
        }
    }, [disabled, status]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
            e.preventDefault();
            handleClick();
        }
    }, [disabled, handleClick]);

    const renderStatusText = () => {
        switch (status) {
            case 'processing':
                return 'Görsel işleniyor...';
            case 'uploading':
                return 'Yükleniyor...';
            case 'success':
                return 'Yükleme tamamlandı';
            case 'error':
                return error || 'Bir hata oluştu';
            default:
                return null;
        }
    };

    const containerClasses = [
        'relative rounded-xl border-2 border-dashed transition-all duration-200',
        isDragging ? 'border-cyan-400 bg-cyan-50' : 'border-slate-200 hover:border-slate-300',
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
        status === 'error' ? 'border-red-300 bg-red-50' : '',
        status === 'success' ? 'border-emerald-300' : '',
        className
    ].filter(Boolean).join(' ');

    return (
        <div className="space-y-2">
            {label && (
                <label className="block text-sm font-bold text-slate-700">
                    {label}
                </label>
            )}

            <div
                className={containerClasses}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleClick}
                onKeyDown={handleKeyDown}
                tabIndex={disabled ? -1 : 0}
                role="button"
                aria-label={label}
                aria-disabled={disabled}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleFileChange}
                    className="sr-only"
                    disabled={disabled || status === 'processing' || status === 'uploading'}
                    aria-hidden="true"
                />

                {preview ? (
                    <div className={compact ? 'p-3' : 'p-4'}>
                        <div className={`relative ${compact ? 'h-32' : 'h-48'} w-full overflow-hidden rounded-lg bg-slate-100`}>
                            <img
                                src={preview}
                                alt="Önizleme"
                                className="h-full w-full object-contain"
                            />

                            {(status === 'processing' || status === 'uploading') && (
                                <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                                    <div className="flex items-center gap-2 text-cyan-600">
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                        <span className="font-medium">{renderStatusText()}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {showSizeInfo && processedInfo && status === 'success' && (
                            <div className="mt-2 text-xs text-slate-500 flex items-center gap-3">
                                <span>
                                    {processedInfo.width} × {processedInfo.height}px
                                </span>
                                <span>•</span>
                                <span className="text-emerald-600">
                                    {processedInfo.originalSizeKB}KB → {processedInfo.processedSizeKB}KB
                                    <span className="ml-1 text-emerald-700 font-medium">
                                        ({Math.round((1 - processedInfo.processedSizeKB / processedInfo.originalSizeKB) * 100)}% küçültüldü)
                                    </span>
                                </span>
                            </div>
                        )}

                        {!disabled && status !== 'processing' && status !== 'uploading' && (
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemove();
                                }}
                                className="absolute top-6 right-6 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                                aria-label="Görseli kaldır"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                ) : (
                    <div className={`flex flex-col items-center justify-center ${compact ? 'py-6 px-4' : 'py-10 px-6'}`}>
                        <div className={`${compact ? 'p-2' : 'p-3'} rounded-full bg-slate-100 text-slate-400 mb-3`}>
                            {status === 'processing' || status === 'uploading' ? (
                                <Loader2 className={`${compact ? 'w-6 h-6' : 'w-8 h-8'} animate-spin text-cyan-600`} />
                            ) : (
                                <FileImage className={compact ? 'w-6 h-6' : 'w-8 h-8'} />
                            )}
                        </div>

                        <div className="text-center">
                            {status === 'processing' || status === 'uploading' ? (
                                <p className="text-sm font-medium text-cyan-600">{renderStatusText()}</p>
                            ) : (
                                <>
                                    <p className={`font-medium text-slate-700 ${compact ? 'text-sm' : ''}`}>
                                        <span className="text-cyan-600">Dosya seçin</span> veya sürükleyip bırakın
                                    </p>
                                    {helperText && (
                                        <p className="mt-1 text-xs text-slate-400">{helperText}</p>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {status === 'error' && error && (
                <div
                    className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-2 rounded-lg"
                    role="alert"
                >
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {status === 'success' && (
                <div
                    className="flex items-center gap-2 text-sm text-emerald-600"
                    role="status"
                    aria-live="polite"
                >
                    <CheckCircle className="w-4 h-4" />
                    <span>Görsel başarıyla yüklendi</span>
                </div>
            )}
        </div>
    );
};

export default ImageUploader;
