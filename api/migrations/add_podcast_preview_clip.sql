-- Add preview_clip_url column to podcasts table for guest preview support
-- This allows non-authenticated users to hear a 30-second preview

ALTER TABLE podcasts
ADD COLUMN preview_clip_url VARCHAR(1024)
COLLATE utf8mb4_unicode_ci
DEFAULT NULL
COMMENT '30 second preview for non-members'
AFTER audio_url;

-- Add index for faster queries
CREATE INDEX idx_preview_clip ON podcasts(preview_clip_url);
