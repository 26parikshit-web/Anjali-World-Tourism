import { HomePage } from "@/components/home/home-page";
import { getFeaturedTripsByCategory } from "@/lib/data-service";
import {
  toHomeTripCard,
  fallbackSpiritualJourneys,
  fallbackFriendsGetaway,
} from "@/lib/home-trip-cards";
import { buildPageMetadata } from "@/lib/seo";

export const revalidate = 60;

export const metadata = buildPageMetadata({
  title: "Spiritual Journeys & Curated Travel in India",
  description:
    "Plan spiritual pilgrimages, friend getaways, family holidays, and honeymoons with Anjali World Tourism — real planners, handcrafted itineraries.",
  path: "/",
});

const SPIRITUAL_JOURNEY_CATEGORY = "Spiritual Journey";
const FRIENDS_GETAWAY_CATEGORY = "Friends Getaway";

export default async function Page() {
  const [spiritualFeatured, friendsFeatured] = await Promise.all([
    getFeaturedTripsByCategory(SPIRITUAL_JOURNEY_CATEGORY),
    getFeaturedTripsByCategory(FRIENDS_GETAWAY_CATEGORY),
  ]);

  const mapFallback = (item) => ({
    ...item,
    images: item.images || [item.image],
  });

  const spiritualJourneys =
    spiritualFeatured.length > 0
      ? spiritualFeatured.map(toHomeTripCard)
      : fallbackSpiritualJourneys.map(mapFallback);

  const friendsGetaway =
    friendsFeatured.length > 0
      ? friendsFeatured.map(toHomeTripCard)
      : fallbackFriendsGetaway.map(mapFallback);

  return (
    <HomePage
      spiritualJourneys={spiritualJourneys}
      friendsGetaway={friendsGetaway}
    />
  );
}
