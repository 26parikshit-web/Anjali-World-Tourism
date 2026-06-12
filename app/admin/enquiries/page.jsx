import { createClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { EnquiriesManager } from "./enquiries-manager";

export default async function AdminEnquiriesPage() {
  const supabase = await createClient();
  const { data: enquiries } = await supabase
    .from("enquiries")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Travel Enquiries"
        description="Manage and track customer enquiries from the website and booking flow"
      />
      <EnquiriesManager initialEnquiries={enquiries || []} />
    </div>
  );
}
