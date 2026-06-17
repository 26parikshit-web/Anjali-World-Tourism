import { createClient } from "@/lib/supabase/server";
import { ContactsManager } from "./contacts-manager";

export default async function AdminContactsPage() {
  const supabase = await createClient();
  
  const { data: contacts } = await supabase
    .from("contact_submissions")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900">Contact Inquiries</h1>
        <p className="text-sm text-zinc-500 mt-1">
          View and manage contact form submissions
        </p>
      </div>

      <ContactsManager contacts={contacts || []} />
    </div>
  );
}
