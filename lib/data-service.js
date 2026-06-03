import { createClient } from "@/lib/supabase/server";
import { tripDetails as localTripDetails } from "@/lib/trip-details";
import { tripSections as localTripSections, reviewStories as localReviewStories, customerPhotoWall as localPhotoWall } from "@/lib/site-data";

const isSupabaseConfigured = () => {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== "your_supabase_project_url" &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== "your_supabase_anon_key"
  );
};

export async function getTrips() {
  if (!isSupabaseConfigured()) {
    return Object.values(localTripDetails);
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("trips")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error("Error fetching trips from Supabase:", err);
    return Object.values(localTripDetails);
  }
}

export async function getTripBySlug(slug) {
  if (!isSupabaseConfigured()) {
    return localTripDetails[slug] || null;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("trips")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.error("Error fetching trip from Supabase:", err);
    return localTripDetails[slug] || null;
  }
}

export async function getTripSlugs() {
  if (!isSupabaseConfigured()) {
    return Object.keys(localTripDetails);
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("trips")
      .select("slug")
      .eq("is_active", true);

    if (error) throw error;
    return data?.map((t) => t.slug) || [];
  } catch (err) {
    console.error("Error fetching trip slugs:", err);
    return Object.keys(localTripDetails);
  }
}

export async function getTripsByCategory(category) {
  if (!isSupabaseConfigured()) {
    return Object.values(localTripDetails).filter((t) => t.category === category);
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("trips")
      .select("*")
      .eq("category", category)
      .eq("is_active", true);

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error("Error fetching trips by category:", err);
    return Object.values(localTripDetails).filter((t) => t.category === category);
  }
}

export async function getReviews() {
  if (!isSupabaseConfigured()) {
    return localReviewStories;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("is_approved", true)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error("Error fetching reviews:", err);
    return localReviewStories;
  }
}

export async function getFeaturedReviews() {
  if (!isSupabaseConfigured()) {
    return localReviewStories.slice(0, 3);
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("is_featured", true)
      .eq("is_approved", true)
      .limit(6);

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error("Error fetching featured reviews:", err);
    return localReviewStories.slice(0, 3);
  }
}

export async function getGallery() {
  if (!isSupabaseConfigured()) {
    return localPhotoWall;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("gallery")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error("Error fetching gallery:", err);
    return localPhotoWall;
  }
}

export async function getGalleryByTrip(tripId) {
  if (!isSupabaseConfigured()) {
    return [];
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("gallery")
      .select("*")
      .eq("trip_id", tripId)
      .order("display_order", { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error("Error fetching gallery by trip:", err);
    return [];
  }
}

export function getTripSections() {
  return localTripSections;
}
