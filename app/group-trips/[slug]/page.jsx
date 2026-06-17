import { notFound } from "next/navigation";
import { getGroupTripBySlug, getGroupTripSlugs } from "@/lib/data-service";
import { getFeatureFlags } from "@/lib/feature-flags";
import { TripDetailView } from "@/components/pages/trip-detail-view";
import { JsonLd } from "@/components/seo/json-ld";
import { absoluteUrl, buildPageMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  const slugs = await getGroupTripSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const trip = await getGroupTripBySlug(slug);
  if (!trip) {
    return buildPageMetadata({
      title: "Group Trip Not Found",
      description: "The requested group trip could not be found.",
      path: `/group-trips/${slug}`,
      noIndex: true,
    });
  }

  return buildPageMetadata({
    title: `${trip.name} — Group Trip`,
    description:
      trip.short_description ||
      `Join our group departure to ${trip.hosted_place} with Anjali World Tourism.`,
    path: `/group-trips/${slug}`,
    image: trip.hero_image || undefined,
  });
}

export default async function GroupTripDetailPage({ params }) {
  const { slug } = await params;
  const [trip, featureFlags] = await Promise.all([
    getGroupTripBySlug(slug),
    getFeatureFlags(),
  ]);

  if (!trip) {
    notFound();
  }

  const tripJsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: trip.name,
    description: trip.short_description || trip.description,
    url: absoluteUrl(`/group-trips/${slug}`),
    touristType: "Group Trip",
  };

  return (
    <>
      <JsonLd data={tripJsonLd} />
      <TripDetailView trip={trip} featureFlags={featureFlags} bookingKind="group" />
    </>
  );
}
