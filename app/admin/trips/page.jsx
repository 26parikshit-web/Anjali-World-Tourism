import { createClient } from "@/lib/supabase/server";
import { Plus } from "lucide-react";
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
        <AddTripButton />
      </div>

      <TripsTable trips={trips || []} />
    </div>
  );
}
