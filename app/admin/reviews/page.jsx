import { createClient } from "@/lib/supabase/server";
import { ReviewsManager } from "./reviews-manager";

export default async function AdminReviewsPage() {
  const supabase = await createClient();
  
  const [{ data: reviews }, { data: trips }] = await Promise.all([
    supabase.from("reviews").select("id, created_at, name, designation, trip, quote, image, is_approved, is_featured").order("created_at", { ascending: false }),
    supabase.from("trips").select("id, name, slug"),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900">Reviews</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Manage customer testimonials and reviews
        </p>
      </div>

      <ReviewsManager reviews={reviews || []} trips={trips || []} />
    </div>
  );
}
