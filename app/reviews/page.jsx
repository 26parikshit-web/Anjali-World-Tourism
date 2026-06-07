import { getReviews } from "@/lib/data-service";
import { ReviewsPageView } from "@/components/pages/reviews-page-view";

export const revalidate = 60;

export default async function ReviewsPage() {
  const reviews = await getReviews();

  const photoWallItems = reviews.map((review) => ({
    id: review.id,
    name: review.name,
    designation: review.designation,
    trip: review.trip,
    quote: review.quote,
    image: review.image_url || review.image,
    rating: review.rating || 5,
  }));

  return <ReviewsPageView reviews={reviews} photoWallItems={photoWallItems} />;
}
