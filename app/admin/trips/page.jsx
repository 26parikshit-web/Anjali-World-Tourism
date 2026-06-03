import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus } from "lucide-react";
import { TripsTable } from "./trips-table";

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
        <Link
          href="/admin/trips/new"
          className="flex items-center gap-2 bg-zinc-900 text-white hover:bg-zinc-800 text-sm font-semibold px-4 py-2.5 rounded-xl transition"
        >
          <Plus className="w-4 h-4" />
          Add Trip
        </Link>
      </div>

      <TripsTable trips={trips || []} />
    </div>
  );
}
