import { cloudinaryCardUrl } from "./cloudinary";
import { normalizeGalleryItem } from "./trip-media";

/** Fallback cards when no featured trips are marked in the database. */
export const fallbackSpiritualJourneys = [
  {
    id: "char-dham",
    slug: "char-dham-yatra",
    name: "Char Dham Yatra",
    tagline: "The ultimate pilgrimage circuit",
    description:
      "Helicopter options, stay planning, and senior-friendly route pacing across Yamunotri, Gangotri, Kedarnath & Badrinath.",
    duration: "10 Days / 9 Nights",
    price: "₹36,000",
    image: "/images/chaarDham.webp",
    highlights: ["Helicopter Option", "Senior Support", "Temple Timing"],
  },
  {
    id: "jyotirlinga",
    slug: "12-jyotirlinga",
    name: "12 Jyotirlinga",
    tagline: "Sacred circuit across India",
    description:
      "A multi-state sacred route with smooth sequencing and temple-focused pacing across all 12 divine shrines.",
    duration: "14 Days / 13 Nights",
    price: "₹49,000",
    image: "/images/jyoti.jpg",
    highlights: ["Multi-City", "Manual Routing", "Premium Stays"],
  },
  {
    id: "panchkedar",
    slug: "panchkedar",
    name: "Panchkedar",
    tagline: "High-altitude devotion",
    description:
      "A serious mountain yatra balanced with quality stays and trek-side logistics in the Garhwal Himalayas.",
    duration: "8 Days / 7 Nights",
    price: "₹31,500",
    image: "/images/panchkedar.webp",
    highlights: ["Trek Support", "Alpine Camps", "Guide Included"],
  },
];

export const fallbackFriendsGetaway = [
  {
    id: "spiti",
    slug: "spiti-valley",
    name: "Spiti Valley",
    tagline: "Road-trip through moonland",
    description:
      "High-altitude drives, moonland landscapes, and boutique campfire nights with your crew.",
    duration: "7 Days / 6 Nights",
    price: "₹24,000",
    image:
      "https://images.unsplash.com/photo-1518002054494-3a6f94352e9d?auto=format&fit=crop&w=1200&q=80",
    highlights: ["Road Trip", "Stargazing", "Café Stops"],
  },
  {
    id: "goa",
    slug: "goa-getaway",
    name: "Goa",
    tagline: "Sun, sand & stories",
    description:
      "Beach clubs, sunset sail add-ons, and flexible villa packages for the perfect group escape.",
    duration: "4 Days / 3 Nights",
    price: "₹16,500",
    image:
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80",
    highlights: ["Beach Villa", "Nightlife", "Sunset Cruise"],
  },
  {
    id: "varkala",
    slug: "varkala",
    name: "Varkala",
    tagline: "Kerala's cliffside charm",
    description:
      "Cliffside sunsets, cafés, and a calmer Kerala coast rhythm for mindful getaways.",
    duration: "5 Days / 4 Nights",
    price: "₹18,000",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    highlights: ["Cliffside", "Ayurveda", "Slow Travel"],
  },
  {
    id: "tawang",
    slug: "tawang",
    name: "Tawang",
    tagline: "Northeast serenity",
    description:
      "Monastery views, winding mountain roads, and rare Northeast stillness in Arunachal.",
    duration: "6 Days / 5 Nights",
    price: "₹27,500",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    highlights: ["Monastery", "Scenic Drive", "Permits Included"],
  },
  {
    id: "kasol",
    slug: "kasol",
    name: "Kasol",
    tagline: "Parvati valley vibes",
    description:
      "River trails, café hopping, and easy group energy in the Himachal hills.",
    duration: "4 Days / 3 Nights",
    price: "₹14,800",
    image:
      "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=1200&q=80",
    highlights: ["Trekking", "Café Culture", "Weekend Trip"],
  },
];

export const DEFAULT_TRIP_CARD_IMAGE =
  "https://images.unsplash.com/photo-1469854523086-cc02afe5c880?auto=format&fit=crop&w=1200&q=80";

/** Resolve a trip/card image, never returning an empty string. */
export function resolveTripCardImage(image) {
  const src = typeof image === "string" ? image.trim() : "";
  const resolved = src || DEFAULT_TRIP_CARD_IMAGE;
  return cloudinaryCardUrl(resolved);
}

/** Hero + gallery images for trip card hover carousel. */
export function collectTripCardImages(trip) {
  const hero = resolveTripCardImage(trip.hero_image || trip.heroImage || trip.image);
  const gallery = (trip.gallery || [])
    .map(normalizeGalleryItem)
    .filter(Boolean)
    .filter((item) => item.type === "image")
    .map((item) => cloudinaryCardUrl(item.src));

  const seen = new Set();
  const images = [];
  for (const url of [hero, ...gallery]) {
    if (url && !seen.has(url)) {
      seen.add(url);
      images.push(url);
    }
  }

  return images.length > 0 ? images : [resolveTripCardImage("")];
}

/** Map a Supabase / local trip record to the homepage horizontal-scroll card shape. */
export function toHomeTripCard(trip) {
  const tags = Array.isArray(trip.tags) ? trip.tags : [];
  const highlights = Array.isArray(trip.highlights) ? trip.highlights.slice(0, 3) : [];
  const images = collectTripCardImages(trip);

  return {
    id: trip.slug || trip.id,
    slug: trip.slug,
    name: trip.name,
    tagline: tags[0] || trip.category || "Curated journey",
    description: trip.short_description || trip.shortDescription || "",
    duration: trip.duration || "",
    price: trip.price || "",
    image: images[0],
    images,
    highlights: highlights.length > 0 ? highlights : tags.slice(0, 3),
  };
}
