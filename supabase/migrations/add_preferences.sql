-- Migration: Add preferences column to trips table
-- Created: 2026-06-04
-- Description: Adds preferences field to store travel, hotel, and meal preferences

-- Add preferences column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'trips' AND column_name = 'preferences'
  ) THEN
    ALTER TABLE trips 
    ADD COLUMN preferences JSONB DEFAULT '{"travel": "", "hotels": "", "meals": ""}'::jsonb;
    
    RAISE NOTICE 'Preferences column added successfully';
  ELSE
    RAISE NOTICE 'Preferences column already exists';
  END IF;
END $$;

-- Update existing rows to have the default preferences structure
UPDATE trips 
SET preferences = '{"travel": "", "hotels": "", "meals": ""}'::jsonb
WHERE preferences IS NULL;

-- Add comment to document the column
COMMENT ON COLUMN trips.preferences IS 'Travel preferences (travel options, hotel category, meals) stored as JSON object with travel, hotels, and meals keys';
