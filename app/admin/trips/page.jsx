import { createClient } from "@/lib/supabase/server";
import { Plus } from "lucide-react";
import Link from "next/link";
import { TripsTable } from "./trips-table";
import { AddTripButton } from "./add-trip-button";

export default async function AdminTripsPage() {
  const supabase = await createClient();
  const { data: trips, error } = await supabase
    .from("trips")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">Trips</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Manage your travel packages
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/trips/bulk-upload" className="flex items-center gap-2 bg-zinc-100 text-zinc-900 hover:bg-zinc-200 text-sm font-semibold px-4 py-2.5 rounded-xl transition">
            Bulk Upload
          </Link>
          <AddTripButton />
        </div>
      </div>

      <TripsTable trips={trips || []} />
    </div>
  );
}
