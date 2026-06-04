-- Enable Row Level Security on enquiries table
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any (to avoid conflicts)
DROP POLICY IF EXISTS "Allow public to insert enquiries" ON enquiries;
DROP POLICY IF EXISTS "Allow authenticated users to view enquiries" ON enquiries;
DROP POLICY IF EXISTS "Allow authenticated users to update enquiries" ON enquiries;

-- Policy: Allow anyone to insert enquiries (for the chatbot/public form)
CREATE POLICY "Allow public to insert enquiries"
  ON enquiries FOR INSERT
  TO public
  WITH CHECK (true);

-- Policy: Only authenticated users can view enquiries (for admin)
CREATE POLICY "Allow authenticated users to view enquiries"
  ON enquiries FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Only authenticated users can update enquiries (for admin)
CREATE POLICY "Allow authenticated users to update enquiries"
  ON enquiries FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);
