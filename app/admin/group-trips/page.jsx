import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Plus } from "lucide-react";
import { GroupTripsTable } from "./group-trips-table";

export default async function AdminGroupTripsPage() {
  const supabase = await createClient();
  const { data: trips } = await supabase
    .from("group_trips")
    .select("id, created_at, updated_at, name, slug, departure_date, hosted_place, capacity, price, hero_image, short_description, is_active, is_featured")
    .order("departure_date", { ascending: true });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">Group Trips</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Scheduled departures with fixed capacity and per-person pricing
          </p>
        </div>
        <Link
          href="/admin/group-trips/new"
          className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800"
        >
          <Plus className="h-4 w-4" />
          Add Group Trip
        </Link>
      </div>

      <GroupTripsTable trips={trips || []} />
    </div>
  );
}
