import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { revalidateGroupTripCaches } from "@/lib/revalidate-home-trips";

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  revalidateGroupTripCaches();

  return NextResponse.json({ revalidated: true, now: Date.now() });
}
