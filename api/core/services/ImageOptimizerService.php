<?php
/**
 * Service: Image Optimizer Service
 * Scope: Core / Shared
 * Description:
 *   - Provides GD-based image resizing and compression.
 *   - Converts uploads to WebP format for performance.
 *   - Used during media upload and batch optimization.
 */
/**
 * ImageOptimizerService
 * 
 * Multi-tenant image optimization service using GD library.
 * Handles resizing, compression, and metadata stripping for JPEG, PNG, WebP.
 */

// Configuration - can be overridden via tenant settings
if (!defined('IMAGE_OPTIMIZE_ON_UPLOAD'))
    define('IMAGE_OPTIMIZE_ON_UPLOAD', true);
if (!defined('IMAGE_MAX_WIDTH'))
    define('IMAGE_MAX_WIDTH', 1920);
if (!defined('IMAGE_MAX_HEIGHT'))
    define('IMAGE_MAX_HEIGHT', 1920);
if (!defined('IMAGE_JPEG_QUALITY'))
    define('IMAGE_JPEG_QUALITY', 82);
if (!defined('IMAGE_PNG_COMPRESSION'))
    define('IMAGE_PNG_COMPRESSION', 7);

class ImageOptimizerService
{
    private int $maxWidth;
    private int $maxHeight;
    private int $jpegQuality;
    private int $pngCompression;

    public function __construct(array $options = [])
    {
        $this->maxWidth = $options['max_width'] ?? IMAGE_MAX_WIDTH;
        $this->maxHeight = $options['max_height'] ?? IMAGE_MAX_HEIGHT;
        $this->jpegQuality = $options['jpeg_quality'] ?? IMAGE_JPEG_QUALITY;
        $this->pngCompression = $options['png_compression'] ?? IMAGE_PNG_COMPRESSION;
    }

    /**
     * Optimize an image file in-place
     * 
     * @param string $filePath Absolute path to the image
     * @param array $options Optional overrides: max_width, max_height, jpeg_quality, png_compression
     * @return array Result with success, stats, or error
     */
    public function optimize(string $filePath, array $options = []): array
    {
        if (!file_exists($filePath)) {
            return ['success' => false, 'error' => 'File not found'];
        }

        // Get file info
        $originalSize = filesize($filePath);
        $imageInfo = @getimagesize($filePath);

        if (!$imageInfo) {
            return ['success' => false, 'error' => 'Not a valid image'];
        }

        $mimeType = $imageInfo['mime'];
        $width = $imageInfo[0];
        $height = $imageInfo[1];

        // Check if image type is supported
        $supportedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!in_array($mimeType, $supportedTypes)) {
            return ['success' => false, 'error' => 'Unsupported image type: ' . $mimeType];
        }

        // Override options
        $maxWidth = $options['max_width'] ?? $this->maxWidth;
        $maxHeight = $options['max_height'] ?? $this->maxHeight;
        $jpegQuality = $options['jpeg_quality'] ?? $this->jpegQuality;
        $pngCompression = $options['png_compression'] ?? $this->pngCompression;

        try {
            // Load image based on type
            $image = $this->loadImage($filePath, $mimeType);
            if (!$image) {
                return ['success' => false, 'error' => 'Failed to load image'];
            }

            $newWidth = $width;
            $newHeight = $height;
            $wasResized = false;

            // Resize if needed (never upscale)
            if ($width > $maxWidth || $height > $maxHeight) {
                $ratio = min($maxWidth / $width, $maxHeight / $height);
                $newWidth = (int) ($width * $ratio);
                $newHeight = (int) ($height * $ratio);

                $resized = imagecreatetruecolor($newWidth, $newHeight);

                // Preserve transparency for PNG and WebP
                if ($mimeType === 'image/png' || $mimeType === 'image/webp') {
                    imagealphablending($resized, false);
                    imagesavealpha($resized, true);
                    $transparent = imagecolorallocatealpha($resized, 0, 0, 0, 127);
                    imagefill($resized, 0, 0, $transparent);
                }

                imagecopyresampled($resized, $image, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);
                imagedestroy($image);
                $image = $resized;
                $wasResized = true;
            }

            // Save optimized image
            $success = $this->saveImage($image, $filePath, $mimeType, $jpegQuality, $pngCompression);
            imagedestroy($image);

            if (!$success) {
                return ['success' => false, 'error' => 'Failed to save optimized image'];
            }

            // Clear file stat cache and get new size
            clearstatcache(true, $filePath);
            $optimizedSize = filesize($filePath);
            $bytesSaved = $originalSize - $optimizedSize;
            $percentageSaved = $originalSize > 0 ? round(($bytesSaved / $originalSize) * 100, 1) : 0;

            return [
                'success' => true,
                'original_size' => $originalSize,
                'optimized_size' => $optimizedSize,
                'bytes_saved' => $bytesSaved,
                'percentage_saved' => $percentageSaved,
                'original_dimensions' => ['width' => $width, 'height' => $height],
                'new_dimensions' => ['width' => $newWidth, 'height' => $newHeight],
                'was_resized' => $wasResized
            ];

        } catch (Exception $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }

    /**
     * Load image resource from file
     */
    private function loadImage(string $filePath, string $mimeType)
    {
        switch ($mimeType) {
            case 'image/jpeg':
                return @imagecreatefromjpeg($filePath);
            case 'image/png':
                return @imagecreatefrompng($filePath);
            case 'image/webp':
                return @imagecreatefromwebp($filePath);
            default:
                return false;
        }
    }

    /**
     * Save image resource to file with compression
     */
    private function saveImage($image, string $filePath, string $mimeType, int $jpegQuality, int $pngCompression): bool
    {
        switch ($mimeType) {
            case 'image/jpeg':
                return imagejpeg($image, $filePath, $jpegQuality);
            case 'image/png':
                return imagepng($image, $filePath, $pngCompression);
            case 'image/webp':
                return imagewebp($image, $filePath, $jpegQuality);
            default:
                return false;
        }
    }

    /**
     * Get optimization config for a specific tenant
     * Can be extended to read from tenant_settings table
     */
    public static function getConfigForTenant(int $tenantId): array
    {
        // TODO: Read from tenant_settings table if per-tenant config needed
        return [
            'max_width' => IMAGE_MAX_WIDTH,
            'max_height' => IMAGE_MAX_HEIGHT,
            'jpeg_quality' => IMAGE_JPEG_QUALITY,
            'png_compression' => IMAGE_PNG_COMPRESSION,
            'optimize_on_upload' => IMAGE_OPTIMIZE_ON_UPLOAD
        ];
    }
}

/**
 * Helper function to optimize an image file
 */
function optimize_image(string $filePath, array $options = []): array
{
    $optimizer = new ImageOptimizerService($options);
    return $optimizer->optimize($filePath, $options);
}
