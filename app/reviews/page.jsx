import { getReviews, getTripNames } from "@/lib/data-service";
import { ReviewsPageView } from "@/components/pages/reviews-page-view";
import { buildPageMetadata } from "@/lib/seo";
import { hasReviewMedia, mapReviewToShowcaseItem } from "@/lib/review-media";

export const revalidate = 60;

export const metadata = buildPageMetadata({
  title: "Traveler Reviews",
  description:
    "Read real stories from travelers who planned spiritual journeys and getaways with Anjali World Tourism.",
  path: "/reviews",
});

export default async function ReviewsPage() {
  const [reviews, reviewTrips] = await Promise.all([getReviews(), getTripNames()]);

  const mediaReviews = reviews.filter(hasReviewMedia);
  const textReviews = reviews.filter((review) => !hasReviewMedia(review));

  const photoWallItems = mediaReviews.map(mapReviewToShowcaseItem);

  return (
    <ReviewsPageView
      reviews={textReviews}
      photoWallItems={photoWallItems}
      trips={reviewTrips}
      totalReviewCount={reviews.length}
    />
  );
}
