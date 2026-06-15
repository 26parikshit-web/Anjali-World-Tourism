import { createClient } from "@/lib/supabase/server";
import { TripForm } from "@/components/admin/trip-form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

export default async function EditGroupTripPage({ params }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: trip, error } = await supabase
    .from("group_trips")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !trip) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/group-trips"
          className="p-2 rounded-lg hover:bg-zinc-100 text-zinc-500"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">Edit Group Trip</h1>
          <p className="text-sm text-zinc-500 mt-1">{trip.name}</p>
        </div>
      </div>

      <TripForm trip={trip} variant="group" />
    </div>
  );
}
