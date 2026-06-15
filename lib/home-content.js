import { createClient as createServerClient } from "@/lib/supabase/server";
import { createBuildClient } from "@/lib/supabase/build-client";
import { cloudinaryHeroUrl } from "@/lib/cloudinary";
import { unstable_cache } from "next/cache";

export const DEFAULT_HOME_CONTENT = {
  hero: {
    headline_line_1: "Where meaningful journeys",
    headline_line_2: "become lifelong memories.",
    description:
      "Anjali World Tourism crafts editorial-quality itineraries for spiritual pilgrimages, friend getaways, family holidays, and honeymoons across India — with hands-on planners, not algorithms.",
    media_url: null,
    media_type: "video",
    poster_url: "/videos/hero-poster.jpg",
    cloudinary_public_id: null,
  },
  spiritual: {
    subtitle: "Spiritual Journeys",
    title: "Sacred Pilgrimage Routes",
    description:
      "Slow, reverent, logistics-heavy routes designed for darshan, family comfort, and trusted pacing.",
    media_url: null,
    media_type: "video",
    poster_url: "/videos/spiritual-poster.jpg",
    cloudinary_public_id: null,
  },
  getaway: {
    subtitle: "Friends Getaway",
    title: "Group Adventure Escapes",
    description:
      "Mood-led escapes for friend groups who want scenery, stories, and high-energy shared memories.",
    media_url:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2000&q=80",
    media_type: "image",
    poster_url: null,
    cloudinary_public_id: null,
  },
};

const LOCAL_HERO_VIDEO = {
  sources: [
    { src: "/videos/hero-bg.webm", type: "video/webm" },
    { src: "/videos/hero-bg.mp4", type: "video/mp4" },
  ],
  poster: "/videos/hero-poster.jpg",
};

const LOCAL_SPIRITUAL_VIDEO = {
  sources: [
    { src: "/videos/spiritual-bg.webm", type: "video/webm" },
    { src: "/videos/spiritual-bg.mp4", type: "video/mp4" },
  ],
  poster: "/videos/spiritual-poster.jpg",
};

function isSupabaseConfigured() {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== "your_supabase_project_url" &&
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY !== "your_supabase_publishable_key"
  );
}

async function getSupabaseClient() {
  if (process.env.NEXT_PHASE === "phase-production-build") {
    return createBuildClient();
  }
  try {
    return await createServerClient();
  } catch {
    return createBuildClient();
  }
}

function mergeSection(defaults, stored) {
  if (!stored || typeof stored !== "object") return { ...defaults };
  return { ...defaults, ...stored };
}

export function mergeHomeContent(stored) {
  if (!stored) return { ...DEFAULT_HOME_CONTENT };

  return {
    hero: mergeSection(DEFAULT_HOME_CONTENT.hero, stored.hero),
    spiritual: mergeSection(DEFAULT_HOME_CONTENT.spiritual, stored.spiritual),
    getaway: mergeSection(DEFAULT_HOME_CONTENT.getaway, stored.getaway),
  };
}

export function resolveSectionBackground(section, localVideoFallback) {
  const mediaType = section.media_type === "image" ? "image" : "video";

  if (section.media_url) {
    const url =
      mediaType === "image" ? cloudinaryHeroUrl(section.media_url) : section.media_url;
    return {
      type: mediaType,
      url,
      poster: section.poster_url || localVideoFallback?.poster || null,
      sources: mediaType === "video" ? [{ src: url, type: "video/mp4" }] : null,
    };
  }

  if (mediaType === "video" && localVideoFallback) {
    return {
      type: "video",
      url: localVideoFallback.sources[1]?.src || localVideoFallback.sources[0]?.src,
      poster: section.poster_url || localVideoFallback.poster,
      sources: localVideoFallback.sources,
    };
  }

  return {
    type: "image",
    url: section.media_url || DEFAULT_HOME_CONTENT.getaway.media_url,
    poster: null,
    sources: null,
  };
}

export function resolveHomeContentForPage(content) {
  const merged = mergeHomeContent(content);

  return {
    hero: {
      headlineLines: [
        merged.hero.headline_line_1,
        merged.hero.headline_line_2,
      ].filter(Boolean),
      description: merged.hero.description,
      background: resolveSectionBackground(merged.hero, LOCAL_HERO_VIDEO),
    },
    spiritual: {
      subtitle: merged.spiritual.subtitle,
      title: merged.spiritual.title,
      description: merged.spiritual.description,
      background: resolveSectionBackground(merged.spiritual, LOCAL_SPIRITUAL_VIDEO),
    },
    getaway: {
      subtitle: merged.getaway.subtitle,
      title: merged.getaway.title,
      description: merged.getaway.description,
      background: resolveSectionBackground(merged.getaway, null),
    },
    raw: merged,
  };
}

async function fetchHomeContentInternal() {
  if (!isSupabaseConfigured()) {
    return DEFAULT_HOME_CONTENT;
  }

  try {
    const supabase = await getSupabaseClient();
    if (!supabase) return DEFAULT_HOME_CONTENT;

    const { data, error } = await supabase
      .from("home_content")
      .select("hero, spiritual, getaway")
      .eq("id", 1)
      .maybeSingle();

    if (error) throw error;
    return mergeHomeContent(data);
  } catch (err) {
    console.error("Error fetching home content:", err);
    return DEFAULT_HOME_CONTENT;
  }
}

export const getHomeContent = unstable_cache(
  fetchHomeContentInternal,
  ["home-content"],
  { revalidate: 60, tags: ["home-content"] }
);

export function sanitizeHomeSection(section, { allowedTypes = ["video", "image"] } = {}) {
  const mediaType = allowedTypes.includes(section?.media_type)
    ? section.media_type
    : "video";

  return {
    headline_line_1: String(section?.headline_line_1 ?? "").trim().slice(0, 120),
    headline_line_2: String(section?.headline_line_2 ?? "").trim().slice(0, 120),
    subtitle: String(section?.subtitle ?? "").trim().slice(0, 80),
    title: String(section?.title ?? "").trim().slice(0, 120),
    description: String(section?.description ?? "").trim().slice(0, 600),
    media_url: section?.media_url ? String(section.media_url).trim().slice(0, 2048) : null,
    media_type: mediaType,
    poster_url: section?.poster_url ? String(section.poster_url).trim().slice(0, 2048) : null,
    cloudinary_public_id: section?.cloudinary_public_id
      ? String(section.cloudinary_public_id).trim().slice(0, 256)
      : null,
  };
}

export function sanitizeHomeContentPayload(payload) {
  const hero = sanitizeHomeSection(payload?.hero || {});
  const spiritual = sanitizeHomeSection(payload?.spiritual || {});
  const getaway = sanitizeHomeSection(payload?.getaway || {});

  return {
    hero: {
      headline_line_1: hero.headline_line_1 || DEFAULT_HOME_CONTENT.hero.headline_line_1,
      headline_line_2: hero.headline_line_2 || DEFAULT_HOME_CONTENT.hero.headline_line_2,
      description: hero.description || DEFAULT_HOME_CONTENT.hero.description,
      media_url: hero.media_url,
      media_type: hero.media_type,
      poster_url: hero.poster_url,
      cloudinary_public_id: hero.cloudinary_public_id,
    },
    spiritual: {
      subtitle: spiritual.subtitle || DEFAULT_HOME_CONTENT.spiritual.subtitle,
      title: spiritual.title || DEFAULT_HOME_CONTENT.spiritual.title,
      description: spiritual.description || DEFAULT_HOME_CONTENT.spiritual.description,
      media_url: spiritual.media_url,
      media_type: spiritual.media_type,
      poster_url: spiritual.poster_url,
      cloudinary_public_id: spiritual.cloudinary_public_id,
    },
    getaway: {
      subtitle: getaway.subtitle || DEFAULT_HOME_CONTENT.getaway.subtitle,
      title: getaway.title || DEFAULT_HOME_CONTENT.getaway.title,
      description: getaway.description || DEFAULT_HOME_CONTENT.getaway.description,
      media_url: getaway.media_url,
      media_type: getaway.media_type,
      poster_url: getaway.poster_url,
      cloudinary_public_id: getaway.cloudinary_public_id,
    },
  };
}
