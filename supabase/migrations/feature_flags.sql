CREATE TABLE IF NOT EXISTS feature_flags (
  key TEXT PRIMARY KEY,
  enabled BOOLEAN NOT NULL DEFAULT false,
  label TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'general',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO feature_flags (key, enabled, label, description, category)
VALUES (
  'razorpay_payments',
  false,
  'Razorpay Payments',
  'Enable online payment checkout on trip booking. Requires RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in environment variables.',
  'payments'
)
ON CONFLICT (key) DO NOTHING;

ALTER TABLE feature_flags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read feature flags"
  ON feature_flags FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage feature flags"
  ON feature_flags FOR ALL
  USING (auth.role() = 'authenticated');
