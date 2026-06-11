-- Site gallery: store Cloudinary public_id for reliable deletes
ALTER TABLE gallery ADD COLUMN IF NOT EXISTS cloudinary_public_id TEXT;
ALTER TABLE gallery ADD COLUMN IF NOT EXISTS resource_type TEXT DEFAULT 'image';
