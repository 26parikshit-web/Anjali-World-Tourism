-- Supabase Database Schema for Anjali World Tourism
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Trips Table
CREATE TABLE IF NOT EXISTS trips (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  short_description TEXT,
  description TEXT,
  duration TEXT,
  price TEXT,
  pricing_packages JSONB NOT NULL DEFAULT '[]'::jsonb,
  discount_percent NUMERIC(5,2),
  discount_ends_at TIMESTAMPTZ,
  group_size TEXT,
  difficulty TEXT,
  best_season TEXT,
  hero_image TEXT,
  highlights JSONB DEFAULT '[]'::jsonb,
  itinerary JSONB DEFAULT '[]'::jsonb,
  inclusions JSONB DEFAULT '[]'::jsonb,
  exclusions JSONB DEFAULT '[]'::jsonb,
  gallery JSONB DEFAULT '[]'::jsonb,
  tags JSONB DEFAULT '[]'::jsonb,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Group trips: scheduled departures with fixed capacity
CREATE TABLE IF NOT EXISTS group_trips (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  hosted_place TEXT NOT NULL,
  departure_date TIMESTAMPTZ NOT NULL,
  max_capacity INTEGER NOT NULL CHECK (max_capacity > 0),
  spots_booked INTEGER NOT NULL DEFAULT 0 CHECK (spots_booked >= 0),
  category TEXT,
  short_description TEXT,
  description TEXT,
  duration TEXT,
  price TEXT,
  pricing_packages JSONB NOT NULL DEFAULT '[]'::jsonb,
  discount_percent NUMERIC(5,2),
  discount_ends_at TIMESTAMPTZ,
  group_size TEXT,
  difficulty TEXT,
  best_season TEXT,
  hero_image TEXT,
  highlights JSONB DEFAULT '[]'::jsonb,
  itinerary JSONB DEFAULT '[]'::jsonb,
  inclusions JSONB DEFAULT '[]'::jsonb,
  exclusions JSONB DEFAULT '[]'::jsonb,
  gallery JSONB DEFAULT '[]'::jsonb,
  tags JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT group_trips_spots_within_capacity CHECK (spots_booked <= max_capacity)
);

-- Bookings (Razorpay trip / group trip payments)
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  booking_kind TEXT DEFAULT 'trip',
  trip_slug TEXT NOT NULL,
  trip_name TEXT NOT NULL,
  group_trip_id UUID REFERENCES group_trips(id) ON DELETE SET NULL,
  group_trip_slug TEXT,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  pax INTEGER DEFAULT 1,
  package_tier TEXT,
  discount_percent NUMERIC(5,2),
  amount_before_discount NUMERIC(12, 2),
  amount NUMERIC(12, 2),
  departure_date TIMESTAMPTZ,
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  status TEXT DEFAULT 'paid' CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bookings_trip_slug ON bookings(trip_slug);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);

-- Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  designation TEXT,
  trip TEXT,
  trip_id UUID REFERENCES trips(id) ON DELETE SET NULL,
  quote TEXT NOT NULL,
  image_url TEXT,
  cloudinary_public_id TEXT,
  resource_type TEXT DEFAULT 'image',
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  is_featured BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gallery Table
CREATE TABLE IF NOT EXISTS gallery (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT,
  image_url TEXT NOT NULL,
  cloudinary_public_id TEXT,
  resource_type TEXT DEFAULT 'image',
  category TEXT,
  trip_id UUID REFERENCES trips(id) ON DELETE SET NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contact Submissions Table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT,
  trip_interest TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'converted', 'closed')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_trips_updated_at
  BEFORE UPDATE ON trips
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contact_submissions_updated_at
  BEFORE UPDATE ON contact_submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS)
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Bookings: admin read/update only (inserts via service role on payment verify)
CREATE POLICY "Admins can view bookings" ON bookings
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can update bookings" ON bookings
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Public read policies for trips, reviews, gallery
CREATE POLICY "Public can view active trips" ON trips
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view approved reviews" ON reviews
  FOR SELECT USING (is_approved = true);

CREATE POLICY "Public can submit pending reviews" ON reviews
  FOR INSERT
  WITH CHECK (
    is_approved = false
    AND is_featured = false
    AND rating BETWEEN 1 AND 5
  );

CREATE POLICY "Public can view gallery" ON gallery
  FOR SELECT USING (true);

-- Public can insert contact submissions
CREATE POLICY "Public can submit contact forms" ON contact_submissions
  FOR INSERT WITH CHECK (true);

-- Authenticated users (admins) can do everything
CREATE POLICY "Admins can manage trips" ON trips
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage reviews" ON reviews
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage gallery" ON gallery
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage contact submissions" ON contact_submissions
  FOR ALL USING (auth.role() = 'authenticated');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_trips_slug ON trips(slug);
CREATE INDEX IF NOT EXISTS idx_trips_category ON trips(category);
CREATE INDEX IF NOT EXISTS idx_trips_is_active ON trips(is_active);
CREATE INDEX IF NOT EXISTS idx_reviews_trip_id ON reviews(trip_id);
CREATE INDEX IF NOT EXISTS idx_reviews_is_featured ON reviews(is_featured);
CREATE INDEX IF NOT EXISTS idx_gallery_trip_id ON gallery(trip_id);
CREATE INDEX IF NOT EXISTS idx_contact_status ON contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_contact_created ON contact_submissions(created_at DESC);

-- Homepage editable content (singleton)
CREATE TABLE IF NOT EXISTS home_content (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  hero JSONB NOT NULL DEFAULT '{}'::jsonb,
  spiritual JSONB NOT NULL DEFAULT '{}'::jsonb,
  getaway JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE home_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read home content" ON home_content
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage home content" ON home_content
  FOR ALL USING (auth.role() = 'authenticated');

-- Storage: run supabase/migrations/trip-media-storage.sql in Supabase Dashboard
-- Creates public `trip-media` bucket for trip hero images and gallery uploads
