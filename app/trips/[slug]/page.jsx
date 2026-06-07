import { notFound } from "next/navigation";
import { getTripBySlug, getTripSlugs } from "@/lib/data-service";
import { TripDetailView } from "@/components/pages/trip-detail-view";

export async function generateStaticParams() {
  const slugs = await getTripSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const trip = await getTripBySlug(slug);
  if (!trip) return { title: "Trip Not Found" };
  return {
    title: `${trip.name} | Anjali World Tourism`,
    description: trip.short_description || trip.shortDescription,
  };
}

export default async function TripDetailPage({ params }) {
  const { slug } = await params;
  const trip = await getTripBySlug(slug);

  if (!trip) {
    notFound();
  }

  return <TripDetailView trip={trip} />;
}
