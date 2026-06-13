-- Review media: Cloudinary public_id and resource type for photos/videos
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS cloudinary_public_id TEXT;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS resource_type TEXT DEFAULT 'image';
