import "./admin.css";
import { createClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/admin/admin-shell";

export const metadata = {
  title: "Admin | Anjali World Tourism",
  description: "Admin dashboard for managing trips, reviews, and contacts",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({ children }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <AdminShell user={user}>{children}</AdminShell>;
}
