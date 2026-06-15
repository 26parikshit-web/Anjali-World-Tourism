-- Admin read access for Razorpay booking records (inserts use service role on payment verify)

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view bookings" ON bookings;
CREATE POLICY "Admins can view bookings" ON bookings
  FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admins can update bookings" ON bookings;
CREATE POLICY "Admins can update bookings" ON bookings
  FOR UPDATE USING (auth.role() = 'authenticated');
