-- Trip media storage bucket (images + videos for trip gallery & hero)
-- Run in Supabase SQL Editor if the bucket does not exist yet.

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'trip-media',
  'trip-media',
  true,
  104857600,
  ARRAY[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'video/mp4',
    'video/webm',
    'video/quicktime'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Public read trip media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload trip media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated update trip media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated delete trip media" ON storage.objects;

CREATE POLICY "Public read trip media"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'trip-media');

CREATE POLICY "Authenticated upload trip media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'trip-media');

CREATE POLICY "Authenticated update trip media"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'trip-media');

CREATE POLICY "Authenticated delete trip media"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'trip-media');
