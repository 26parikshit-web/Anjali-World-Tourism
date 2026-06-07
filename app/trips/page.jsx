import { getTrips, getTripSections } from "@/lib/data-service";
import { TripsCatalog } from "@/components/pages/trips-catalog";

export const revalidate = 60;

export default async function TripsPage() {
  const trips = await getTrips();
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
    trips: categoryTrips.map((trip) => ({
      name: trip.name,
      slug: trip.slug,
      duration: trip.duration,
      price: trip.price,
      image: trip.hero_image || trip.heroImage,
      summary: trip.short_description || trip.shortDescription,
      tags: trip.tags || [],
    })),
  }));

  return <TripsCatalog sections={sections} />;
}
