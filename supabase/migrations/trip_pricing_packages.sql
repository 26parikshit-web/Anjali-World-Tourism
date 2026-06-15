-- Package tiers + timed discounts on trips

ALTER TABLE trips ADD COLUMN IF NOT EXISTS pricing_packages JSONB NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE trips ADD COLUMN IF NOT EXISTS discount_percent NUMERIC(5,2)
  CHECK (discount_percent IS NULL OR (discount_percent >= 0 AND discount_percent <= 100));
ALTER TABLE trips ADD COLUMN IF NOT EXISTS discount_ends_at TIMESTAMPTZ;

COMMENT ON COLUMN trips.pricing_packages IS 'Array of { key, label, price_paise } — standard, deluxe, super_deluxe';
COMMENT ON COLUMN trips.discount_percent IS 'Per-trip only: percent off package prices on this trip until discount_ends_at (not site-wide)';
COMMENT ON COLUMN trips.discount_ends_at IS 'Per-trip only: UTC timestamp after which this trip''s discount is ignored';

-- Bookings table (payment records)
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

-- Booking audit fields
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS package_tier TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS discount_percent NUMERIC(5,2);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS amount_before_discount NUMERIC(12, 2);
