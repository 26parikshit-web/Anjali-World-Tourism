import { HomePage } from "@/components/home/home-page";
import { getFeaturedTripsByCategory } from "@/lib/data-service";
import {
  toHomeTripCard,
  fallbackSpiritualJourneys,
  fallbackFriendsGetaway,
} from "@/lib/home-trip-cards";

export const revalidate = 60;

const SPIRITUAL_JOURNEY_CATEGORY = "Spiritual Journey";
const FRIENDS_GETAWAY_CATEGORY = "Friends Getaway";

export default async function Page() {
  const [spiritualFeatured, friendsFeatured] = await Promise.all([
    getFeaturedTripsByCategory(SPIRITUAL_JOURNEY_CATEGORY),
    getFeaturedTripsByCategory(FRIENDS_GETAWAY_CATEGORY),
  ]);

  const spiritualJourneys =
    spiritualFeatured.length > 0
      ? spiritualFeatured.map(toHomeTripCard)
      : fallbackSpiritualJourneys;

  const friendsGetaway =
    friendsFeatured.length > 0
      ? friendsFeatured.map(toHomeTripCard)
      : fallbackFriendsGetaway;

  return (
    <HomePage
      spiritualJourneys={spiritualJourneys}
      friendsGetaway={friendsGetaway}
    />
  );
}
