-- Create enquiries table
CREATE TABLE IF NOT EXISTS enquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  passengers INTEGER,
  duration TEXT,
  place TEXT NOT NULL,
  budget TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'converted', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index for faster queries
CREATE INDEX idx_enquiries_created_at ON enquiries(created_at DESC);
CREATE INDEX idx_enquiries_status ON enquiries(status);
CREATE INDEX idx_enquiries_email ON enquiries(email);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_enquiries_updated_at 
  BEFORE UPDATE ON enquiries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public to insert enquiries
CREATE POLICY "Allow public to insert enquiries"
  ON enquiries FOR INSERT
  TO public
  WITH CHECK (true);

-- Policy: Only authenticated users can view enquiries (for admin)
CREATE POLICY "Allow authenticated users to view enquiries"
  ON enquiries FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Only authenticated users can update enquiries
CREATE POLICY "Allow authenticated users to update enquiries"
  ON enquiries FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);
