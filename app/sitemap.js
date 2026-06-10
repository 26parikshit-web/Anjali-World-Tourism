import { getTrips } from "@/lib/data-service";
import { getSiteUrl } from "@/lib/seo";

export default async function sitemap() {
  const baseUrl = getSiteUrl();
  const trips = await getTrips();

  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/trips`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/reviews`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  const tripRoutes = trips
    .filter((trip) => trip.slug && trip.is_active !== false)
    .map((trip) => ({
      url: `${baseUrl}/trips/${trip.slug}`,
      lastModified: trip.updated_at ? new Date(trip.updated_at) : new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }));

  return [...staticRoutes, ...tripRoutes];
}
