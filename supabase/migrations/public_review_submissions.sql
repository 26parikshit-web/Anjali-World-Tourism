-- Allow website visitors to submit reviews for admin moderation.

ALTER TABLE reviews
  ADD COLUMN IF NOT EXISTS email TEXT;

CREATE POLICY "Public can submit pending reviews" ON reviews
  FOR INSERT
  WITH CHECK (
    is_approved = false
    AND is_featured = false
    AND rating BETWEEN 1 AND 5
  );
