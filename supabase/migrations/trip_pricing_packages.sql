-- Package tiers + timed discounts on trips

ALTER TABLE trips ADD COLUMN IF NOT EXISTS pricing_packages JSONB NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE trips ADD COLUMN IF NOT EXISTS discount_percent NUMERIC(5,2)
  CHECK (discount_percent IS NULL OR (discount_percent >= 0 AND discount_percent <= 100));
ALTER TABLE trips ADD COLUMN IF NOT EXISTS discount_ends_at TIMESTAMPTZ;

COMMENT ON COLUMN trips.pricing_packages IS 'Array of { key, label, price_paise } — standard, deluxe, super_deluxe';
COMMENT ON COLUMN trips.discount_percent IS 'Percent off per-person package price; enforced server-side until discount_ends_at';
COMMENT ON COLUMN trips.discount_ends_at IS 'UTC timestamp after which discount is ignored (server clock)';

-- Booking audit fields
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS package_tier TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS discount_percent NUMERIC(5,2);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS amount_before_discount NUMERIC(12, 2);
