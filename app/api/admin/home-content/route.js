import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  mergeHomeContent,
  sanitizeHomeContentPayload,
} from "@/lib/home-content";
import { revalidateHomeContentCaches } from "@/lib/revalidate-home-trips";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("home_content")
    .select("hero, spiritual, getaway, updated_at")
    .eq("id", 1)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    content: mergeHomeContent(data),
    updated_at: data?.updated_at ?? null,
  });
}

export async function PUT(request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const sanitized = sanitizeHomeContentPayload(body);

  const { data, error } = await supabase
    .from("home_content")
    .upsert(
      {
        id: 1,
        hero: sanitized.hero,
        spiritual: sanitized.spiritual,
        getaway: sanitized.getaway,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    )
    .select("hero, spiritual, getaway, updated_at")
    .single();

  if (error) {
    console.error("Home content save error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to save home content." },
      { status: 500 }
    );
  }

  revalidateHomeContentCaches();

  return NextResponse.json({
    success: true,
    content: mergeHomeContent(data),
    updated_at: data.updated_at,
  });
}
