import { createClient } from "@supabase/supabase-js";

function getServiceSupabase() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return null;
  }
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export async function reserveGroupTripSpots(groupTripId, spots) {
  const supabase = getServiceSupabase();
  if (!supabase || !groupTripId) return false;

  const { data, error } = await supabase.rpc("reserve_group_trip_spots", {
    p_trip_id: groupTripId,
    p_spots: spots,
  });

  if (error) {
    console.error("reserve_group_trip_spots error:", error);
    return false;
  }

  return Boolean(data);
}
