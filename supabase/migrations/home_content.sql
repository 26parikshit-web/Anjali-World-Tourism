-- Editable homepage hero + scroll section content (singleton row)

CREATE TABLE IF NOT EXISTS home_content (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  hero JSONB NOT NULL DEFAULT '{}'::jsonb,
  spiritual JSONB NOT NULL DEFAULT '{}'::jsonb,
  getaway JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO home_content (id, hero, spiritual, getaway)
VALUES (1, '{}'::jsonb, '{}'::jsonb, '{}'::jsonb)
ON CONFLICT (id) DO NOTHING;

ALTER TABLE home_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read home content"
  ON home_content FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage home content"
  ON home_content FOR ALL
  USING (auth.role() = 'authenticated');
