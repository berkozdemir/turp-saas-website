/**
 * Client-side Image Processing Utility
 * Resizes and compresses images using Canvas API
 */

export interface ImageProcessingOptions {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number; // 0-1 for JPEG/WebP
    targetMaxSizeKB?: number; // Soft limit for file size
    outputFormat?: 'image/jpeg' | 'image/webp' | 'image/png';
}

export interface ProcessedImage {
    blob: Blob;
    width: number;
    height: number;
    originalWidth: number;
    originalHeight: number;
    originalSizeKB: number;
    processedSizeKB: number;
    dataUrl: string;
}

const DEFAULT_OPTIONS: Required<ImageProcessingOptions> = {
    maxWidth: 1600,
    maxHeight: 1600,
    quality: 0.8,
    targetMaxSizeKB: 500,
    outputFormat: 'image/webp',
};

/**
 * Load an image file and return an HTMLImageElement
 */
function loadImage(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('Görsel yüklenirken hata oluştu'));
        img.src = URL.createObjectURL(file);
    });
}

/**
 * Calculate new dimensions maintaining aspect ratio
 */
function calculateDimensions(
    originalWidth: number,
    originalHeight: number,
    maxWidth: number,
    maxHeight: number
): { width: number; height: number } {
    // Don't upscale
    if (originalWidth <= maxWidth && originalHeight <= maxHeight) {
        return { width: originalWidth, height: originalHeight };
    }

    const aspectRatio = originalWidth / originalHeight;

    let newWidth = maxWidth;
    let newHeight = maxWidth / aspectRatio;

    if (newHeight > maxHeight) {
        newHeight = maxHeight;
        newWidth = maxHeight * aspectRatio;
    }

    return {
        width: Math.round(newWidth),
        height: Math.round(newHeight),
    };
}

/**
 * Compress image to target size by adjusting quality
 */
async function compressToTargetSize(
    canvas: HTMLCanvasElement,
    targetSizeKB: number,
    format: string,
    initialQuality: number
): Promise<Blob> {
    let quality = initialQuality;
    let blob: Blob | null = null;
    const minQuality = 0.3;

    while (quality >= minQuality) {
        blob = await new Promise<Blob | null>((resolve) => {
            canvas.toBlob(resolve, format, quality);
        });

        if (!blob) {
            throw new Error('Görsel sıkıştırılırken hata oluştu');
        }

        const sizeKB = blob.size / 1024;
        if (sizeKB <= targetSizeKB || quality <= minQuality) {
            break;
        }

        // Reduce quality step by step
        quality -= 0.1;
    }

    return blob!;
}

/**
 * Process an image file: resize and compress
 */
export async function processImage(
    file: File,
    options: ImageProcessingOptions = {}
): Promise<ProcessedImage> {
    const opts = { ...DEFAULT_OPTIONS, ...options };

    // Determine output format
    let outputFormat = opts.outputFormat;

    // If PNG is uploaded and transparency might be needed, keep as PNG or WebP
    if (file.type === 'image/png' && outputFormat === 'image/jpeg') {
        outputFormat = 'image/webp'; // WebP supports transparency
    }

    const originalSizeKB = file.size / 1024;

    // Load image
    const img = await loadImage(file);
    const originalWidth = img.naturalWidth;
    const originalHeight = img.naturalHeight;

    // Skip processing if image is already small and within size limits
    // This prevents over-processing already optimized images
    const alreadySmall = originalSizeKB <= opts.targetMaxSizeKB! &&
        originalWidth <= opts.maxWidth! &&
        originalHeight <= opts.maxHeight!;

    if (alreadySmall) {
        // Return original file without processing
        const dataUrl = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
        });

        URL.revokeObjectURL(img.src);

        return {
            blob: file,
            width: originalWidth,
            height: originalHeight,
            originalWidth,
            originalHeight,
            originalSizeKB: Math.round(originalSizeKB),
            processedSizeKB: Math.round(originalSizeKB),
            dataUrl,
        };
    }

    // Calculate new dimensions
    const { width, height } = calculateDimensions(
        originalWidth,
        originalHeight,
        opts.maxWidth!,
        opts.maxHeight!
    );

    // Create canvas and draw resized image
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
        throw new Error('Canvas context oluşturulamadı');
    }

    // Use high-quality image smoothing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, width, height);

    // Clean up object URL
    URL.revokeObjectURL(img.src);

    // Compress to target size
    const blob = await compressToTargetSize(
        canvas,
        opts.targetMaxSizeKB!,
        outputFormat,
        opts.quality!
    );

    // Create data URL for preview
    const dataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
    });

    return {
        blob,
        width,
        height,
        originalWidth,
        originalHeight,
        originalSizeKB: Math.round(originalSizeKB),
        processedSizeKB: Math.round(blob.size / 1024),
        dataUrl,
    };
}

/**
 * Validate file before processing
 */
export function validateImageFile(
    file: File,
    maxSizeMB: number = 20
): { valid: boolean; error?: string } {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

    if (!allowedTypes.includes(file.type)) {
        return {
            valid: false,
            error: 'Desteklenmeyen dosya formatı. Lütfen JPEG, PNG veya WebP yükleyin.',
        };
    }

    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
        return {
            valid: false,
            error: `Dosya çok büyük. Maksimum boyut: ${maxSizeMB}MB`,
        };
    }

    return { valid: true };
}

/**
 * Preset configurations for different use cases
 */
export const IMAGE_PRESETS = {
    // Blog cover images
    blogCover: {
        maxWidth: 1600,
        maxHeight: 900,
        quality: 0.85,
        targetMaxSizeKB: 400,
        outputFormat: 'image/webp' as const,
    },
    // Thumbnails
    thumbnail: {
        maxWidth: 400,
        maxHeight: 300,
        quality: 0.75,
        targetMaxSizeKB: 100,
        outputFormat: 'image/webp' as const,
    },
    // Avatar / Square images
    avatar: {
        maxWidth: 512,
        maxHeight: 512,
        quality: 0.8,
        targetMaxSizeKB: 150,
        outputFormat: 'image/webp' as const,
    },
    // Hero images
    hero: {
        maxWidth: 1920,
        maxHeight: 1080,
        quality: 0.85,
        targetMaxSizeKB: 600,
        outputFormat: 'image/webp' as const,
    },
};
