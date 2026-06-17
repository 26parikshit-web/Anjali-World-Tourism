import { createClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { BookingsManager } from "./bookings-manager";

export default async function AdminBookingsPage() {
  const supabase = await createClient();

  const { data: bookings, error } = await supabase
    .from("bookings")
    .select("id, created_at, booking_kind, trip_id, razorpay_order_id, razorpay_payment_id, amount_paid, customer_name, customer_email, customer_phone, travel_date, travelers_count, special_requests, payment_status, booking_status")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Bookings"
        description="Paid trip and group trip reservations from Razorpay checkout"
      />

      {error && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Could not load bookings. Run{" "}
          <code className="rounded bg-amber-100 px-1">supabase/migrations/bookings_rls.sql</code>{" "}
          in Supabase if the table exists but access is denied.
        </div>
      )}

      <BookingsManager bookings={bookings || []} />
    </div>
  );
}
