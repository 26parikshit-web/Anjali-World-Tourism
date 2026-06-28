import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { pickTripRow } from "@/lib/trip-row";
import { revalidateTripsOnServer } from "@/lib/revalidate-trips-client";

export async function POST(req) {
  try {
    const supabase = await createClient();
    const data = await req.json();

    if (!Array.isArray(data)) {
      return NextResponse.json({ error: "Payload must be a JSON array of trips" }, { status: 400 });
    }

    const rowsToInsert = data.map(trip => {
        // ensure required fields have some default or just pass it to pickTripRow
        return pickTripRow(trip);
    });

    const { data: insertedTrips, error } = await supabase
      .from("trips")
      .insert(rowsToInsert)
      .select();

    if (error) {
      console.error("Bulk upload error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Call revalidate logic if applicable, though typically server-actions use revalidatePath
    // In this case, we might just return success. If they use a fetch, we can let them refresh.
    
    return NextResponse.json({ success: true, count: insertedTrips.length, trips: insertedTrips }, { status: 200 });
  } catch (error) {
    console.error("Bulk upload handler error:", error);
    return NextResponse.json({ error: "Failed to process bulk upload" }, { status: 500 });
  }
}
