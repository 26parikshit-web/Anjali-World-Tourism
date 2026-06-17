import { getTrips, getTripSections, getGroupTrips } from "@/lib/data-service";
import { collectTripCardImages } from "@/lib/home-trip-cards";
import { getTripListPrice } from "@/lib/trip-pricing";
import { TripsCatalog } from "@/components/pages/trips-catalog";
import { buildPageMetadata } from "@/lib/seo";

export const revalidate = 60;

export const metadata = buildPageMetadata({
  title: "Trip Catalogue",
  description:
    "Browse spiritual journeys, friends getaways, family holidays, and honeymoon packages — curated routes across every mood of travel.",
  path: "/trips",
});

export default async function TripsPage() {
  const [trips, groupTrips] = await Promise.all([getTrips(), getGroupTrips()]);
  const tripSections = getTripSections();

  const tripsByCategory = trips.reduce((acc, trip) => {
    const category = trip.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(trip);
    return acc;
  }, {});

  const sections = Object.entries(tripsByCategory).map(([category, categoryTrips]) => ({
    id: category.toLowerCase().replace(/\s+/g, "-"),
    title: category,
    description:
      tripSections.find((s) => s.title === category)?.description ||
      `Explore our ${category} packages`,
    trips: categoryTrips.map((trip) => {
      const images = collectTripCardImages(trip);
      const listPrice = getTripListPrice(trip);
      return {
        name: trip.name,
        slug: trip.slug,
        duration: trip.duration,
        price: listPrice.displayPrice || trip.price,
        image: images[0],
        images,
        summary: trip.short_description || trip.shortDescription,
        tags: trip.tags || [],
      };
    }),
  }));

  const slimGroupTrips = groupTrips.map((trip) => ({
    id: trip.id,
    name: trip.name,
    slug: trip.slug,
    departure_date: trip.departure_date,
    hosted_place: trip.hosted_place,
    capacity: trip.capacity,
    price: trip.price,
    hero_image: trip.hero_image,
    short_description: trip.short_description,
  }));

  return <TripsCatalog sections={sections} groupTrips={slimGroupTrips} />;
}
