-- Scheduled group departures with fixed capacity

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
  discount_percent NUMERIC(5,2)
    CHECK (discount_percent IS NULL OR (discount_percent >= 0 AND discount_percent <= 100)),
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
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT group_trips_spots_within_capacity CHECK (spots_booked <= max_capacity)
);

CREATE INDEX IF NOT EXISTS idx_group_trips_slug ON group_trips(slug);
CREATE INDEX IF NOT EXISTS idx_group_trips_departure ON group_trips(departure_date);
CREATE INDEX IF NOT EXISTS idx_group_trips_active ON group_trips(is_active);

ALTER TABLE group_trips ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view active group trips" ON group_trips;
CREATE POLICY "Public can view active group trips" ON group_trips
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage group trips" ON group_trips;
CREATE POLICY "Admins can manage group trips" ON group_trips
  FOR ALL USING (auth.role() = 'authenticated');

-- Atomically reserve spots when a booking is confirmed
CREATE OR REPLACE FUNCTION reserve_group_trip_spots(p_trip_id UUID, p_spots INTEGER)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF p_spots IS NULL OR p_spots < 1 THEN
    RETURN FALSE;
  END IF;

  UPDATE group_trips
  SET spots_booked = spots_booked + p_spots,
      updated_at = NOW()
  WHERE id = p_trip_id
    AND is_active = true
    AND spots_booked + p_spots <= max_capacity;

  RETURN FOUND;
END;
$$;

-- Bookings table (required for payment records; safe if already created via bookings.sql)
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  trip_slug TEXT NOT NULL,
  trip_name TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  pax INTEGER DEFAULT 1,
  amount NUMERIC(12, 2),
  departure_date TIMESTAMPTZ,
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  status TEXT DEFAULT 'paid' CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bookings_trip_slug ON bookings(trip_slug);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);

-- Pricing audit columns (from trip_pricing_packages.sql)
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS package_tier TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS discount_percent NUMERIC(5,2);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS amount_before_discount NUMERIC(12, 2);

-- Group trip booking columns
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS booking_kind TEXT DEFAULT 'trip';
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS group_trip_id UUID REFERENCES group_trips(id) ON DELETE SET NULL;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS group_trip_slug TEXT;
