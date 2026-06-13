import { createClient as createServerClient } from "@/lib/supabase/server";
import { createBuildClient } from "@/lib/supabase/build-client";
import { tripDetails as localTripDetails } from "@/lib/trip-details";
import { tripSections as localTripSections, reviewStories as localReviewStories, customerPhotoWall as localPhotoWall } from "@/lib/site-data";
import { unstable_cache } from "next/cache";

const isSupabaseConfigured = () => {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== "your_supabase_project_url" &&
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY !== "your_supabase_publishable_key"
  );
};

// Get appropriate Supabase client (build-time vs runtime)
async function getSupabaseClient() {
  // During build, use the simple client without cookies
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return createBuildClient();
  }
  
  // At runtime, try to use the server client with cookies
  try {
    return await createServerClient();
  } catch (error) {
    // If cookies fail (e.g., during static generation), use build client
    return createBuildClient();
  }
}

// Cache duration: 60 seconds for development, 5 minutes for production
const CACHE_REVALIDATE = process.env.NODE_ENV === 'development' ? 60 : 300;

// Internal function to fetch trips
async function fetchTripsInternal() {
  if (!isSupabaseConfigured()) {
    return Object.values(localTripDetails);
  }

  try {
    const supabase = await getSupabaseClient();
    if (!supabase) return Object.values(localTripDetails);
    
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

// Cached version of getTrips
export const getTrips = unstable_cache(
  fetchTripsInternal,
  ["trips-list"],
  { revalidate: CACHE_REVALIDATE, tags: ["trips"] }
);

// Internal function to fetch trip by slug
async function fetchTripBySlugInternal(slug) {
  if (!isSupabaseConfigured()) {
    return localTripDetails[slug] || null;
  }

  try {
    const supabase = await getSupabaseClient();
    if (!supabase) return localTripDetails[slug] || null;
    
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

// Cached version - wrapper function for dynamic slug
export async function getTripBySlug(slug) {
  const cachedFn = unstable_cache(
    () => fetchTripBySlugInternal(slug),
    [`trip-${slug}`],
    { revalidate: CACHE_REVALIDATE, tags: ["trips", `trip-${slug}`] }
  );
  return cachedFn();
}

export async function getTripSlugs() {
  if (!isSupabaseConfigured()) {
    return Object.keys(localTripDetails);
  }

  try {
    const supabase = await getSupabaseClient();
    if (!supabase) return Object.keys(localTripDetails);
    
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
    const supabase = await getSupabaseClient();
    if (!supabase) return Object.values(localTripDetails).filter((t) => t.category === category);
    
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

async function fetchFeaturedTripsByCategoryInternal(category) {
  if (!isSupabaseConfigured()) {
    return [];
  }

  try {
    const supabase = await getSupabaseClient();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from("trips")
      .select("*")
      .eq("category", category)
      .eq("is_active", true)
      .eq("is_featured", true)
      .order("updated_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error("Error fetching featured trips:", err);
    return [];
  }
}

export async function getFeaturedTripsByCategory(category) {
  const cachedFn = unstable_cache(
    () => fetchFeaturedTripsByCategoryInternal(category),
    [`featured-trips-${category}`],
    { revalidate: CACHE_REVALIDATE, tags: ["trips", `featured-trips-${category}`] }
  );
  return cachedFn();
}

// Internal function to fetch reviews
async function fetchReviewsInternal() {
  if (!isSupabaseConfigured()) {
    return localReviewStories;
  }

  try {
    const supabase = await getSupabaseClient();
    if (!supabase) return localReviewStories;
    
    const { data, error } = await supabase
      .from("reviews")
      .select("id,name,designation,trip,trip_id,quote,image_url,cloudinary_public_id,resource_type,rating,is_featured,is_approved,created_at")
      .eq("is_approved", true)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error("Error fetching reviews:", err);
    return localReviewStories;
  }
}

// Cached version of getReviews
export const getReviews = unstable_cache(
  fetchReviewsInternal,
  ["reviews-list"],
  { revalidate: CACHE_REVALIDATE, tags: ["reviews"] }
);

export async function getFeaturedReviews() {
  if (!isSupabaseConfigured()) {
    return localReviewStories.slice(0, 3);
  }

  try {
    const supabase = await getSupabaseClient();
    if (!supabase) return localReviewStories.slice(0, 3);
    
    const { data, error } = await supabase
      .from("reviews")
      .select("id,name,designation,trip,trip_id,quote,image_url,cloudinary_public_id,resource_type,rating,is_featured,is_approved,created_at")
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

// Internal function to fetch gallery
async function fetchGalleryInternal() {
  if (!isSupabaseConfigured()) {
    return localPhotoWall;
  }

  try {
    const supabase = await getSupabaseClient();
    if (!supabase) return localPhotoWall;
    
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

// Cached version of getGallery
export const getGallery = unstable_cache(
  fetchGalleryInternal,
  ["gallery-list"],
  { revalidate: CACHE_REVALIDATE, tags: ["gallery"] }
);

export async function getGalleryByTrip(tripId) {
  if (!isSupabaseConfigured()) {
    return [];
  }

  try {
    const supabase = await getSupabaseClient();
    if (!supabase) return [];
    
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
