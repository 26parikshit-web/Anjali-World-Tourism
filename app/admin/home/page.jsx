import { createClient } from "@/lib/supabase/server";
import { mergeHomeContent } from "@/lib/home-content";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { HomeContentManager } from "./home-content-manager";

export default async function AdminHomePage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("home_content")
    .select("hero, spiritual, getaway")
    .eq("id", 1)
    .maybeSingle();

  const initialContent = mergeHomeContent(data);

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Homepage"
        description="Edit hero copy and upload background media to Cloudinary for the three main homepage sections"
      />

      {error && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Could not load homepage content from the database. Run{" "}
          <code className="rounded bg-amber-100 px-1">supabase/migrations/home_content.sql</code>{" "}
          in Supabase, then refresh.
        </div>
      )}

      <HomeContentManager initialContent={initialContent} />
    </div>
  );
}
