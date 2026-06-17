import { notFound } from "next/navigation";
import { getTripBySlug, getTripSlugs } from "@/lib/data-service";
import { getFeatureFlags } from "@/lib/feature-flags";
import { TripDetailView } from "@/components/pages/trip-detail-view";
import { JsonLd } from "@/components/seo/json-ld";
import { absoluteUrl, buildPageMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  const slugs = await getTripSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const trip = await getTripBySlug(slug);
  if (!trip) {
    return buildPageMetadata({
      title: "Trip Not Found",
      description: "The requested trip could not be found.",
      path: `/trips/${slug}`,
      noIndex: true,
    });
  }

  const heroImage = trip.hero_image || trip.heroImage;
  const description =
    trip.short_description ||
    trip.shortDescription ||
    `Explore ${trip.name} — ${trip.duration || "a curated journey"} with Anjali World Tourism.`;

  return buildPageMetadata({
    title: trip.name,
    description,
    path: `/trips/${slug}`,
    image: heroImage || undefined,
    keywords: [
      trip.name,
      trip.category,
      ...(Array.isArray(trip.tags) ? trip.tags : []),
      "Anjali World Tourism",
    ],
    type: "article",
  });
}

export default async function TripDetailPage({ params }) {
  const { slug } = await params;
  const [trip, featureFlags] = await Promise.all([getTripBySlug(slug), getFeatureFlags()]);

  if (!trip) {
    notFound();
  }

  const heroImage = trip.hero_image || trip.heroImage;
  const description =
    trip.short_description || trip.shortDescription || trip.description || "";
  const imageUrl = heroImage
    ? heroImage.startsWith("http")
      ? heroImage
      : absoluteUrl(heroImage)
    : undefined;

  const tripJsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: trip.name,
    description,
    url: absoluteUrl(`/trips/${slug}`),
    ...(imageUrl && { image: imageUrl }),
    provider: {
      "@type": "TravelAgency",
      name: "Anjali World Tourism",
      url: absoluteUrl("/"),
    },
    touristType: trip.category,
  };

  const mappedTrip = {
    id: trip.id,
    name: trip.name,
    slug: trip.slug,
    category: trip.category,
    description: trip.description,
    short_description: trip.short_description,
    shortDescription: trip.shortDescription,
    hero_image: trip.hero_image,
    heroImage: trip.heroImage,
    highlights: trip.highlights,
    itinerary: trip.itinerary,
    gallery: trip.gallery,
    inclusions: trip.inclusions,
    exclusions: trip.exclusions,
    tags: trip.tags,
    price: trip.price,
    pricing_model: trip.pricing_model,
  };

  return (
    <>
      <JsonLd data={tripJsonLd} />
      <TripDetailView trip={mappedTrip} featureFlags={featureFlags} />
    </>
  );
}
