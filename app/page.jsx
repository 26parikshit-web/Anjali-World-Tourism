import { HomePage } from "@/components/home/home-page";
import { JsonLd } from "@/components/seo/json-ld";
import { getFeaturedTripsByCategory } from "@/lib/data-service";
import {
  toHomeTripCard,
  fallbackSpiritualJourneys,
  fallbackFriendsGetaway,
} from "@/lib/home-trip-cards";
import { absoluteUrl, buildPageMetadata, siteConfig } from "@/lib/seo";

export const revalidate = 60;

export const metadata = buildPageMetadata({
  title: "Spiritual Journeys & India Travel",
  description:
    "Plan spiritual pilgrimages, friend getaways, family holidays, and honeymoons with Anjali World Tourism — real planners, handcrafted itineraries.",
  path: "/",
});

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteConfig.name,
  url: absoluteUrl("/"),
  description: siteConfig.description,
  potentialAction: {
    "@type": "SearchAction",
    target: `${absoluteUrl("/trips")}?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

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
    <>
      <JsonLd data={websiteJsonLd} />
      <HomePage
        spiritualJourneys={spiritualJourneys}
        friendsGetaway={friendsGetaway}
      />
    </>
  );
}
