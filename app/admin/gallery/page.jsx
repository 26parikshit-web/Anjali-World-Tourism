import { createClient } from "@/lib/supabase/server";
import { GalleryManager } from "./gallery-manager";

export default async function AdminGalleryPage() {
  const supabase = await createClient();
  
  const [{ data: gallery }, { data: trips }] = await Promise.all([
    supabase.from("gallery").select("id, image_url, trip_id, display_order, alt_text, created_at").order("created_at", { ascending: false }),
    supabase.from("trips").select("id, name, slug"),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900">Gallery</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Manage photos and images for your trips
        </p>
      </div>

      <GalleryManager gallery={gallery || []} trips={trips || []} />
    </div>
  );
}
