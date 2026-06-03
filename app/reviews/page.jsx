import { ReviewShowcase } from "@/components/review-showcase";
import { getReviews, getGallery } from "@/lib/data-service";
import { Star } from "lucide-react";

export default async function ReviewsPage() {
  const reviews = await getReviews();
  const gallery = await getGallery();

  // Format reviews for the showcase component
  const photoWallItems = reviews.map(review => ({
    id: review.id,
    name: review.name,
    designation: review.designation,
    trip: review.trip,
    quote: review.quote,
    image: review.image_url || review.image,
    rating: review.rating || 5,
  }));

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pb-16 pt-20 sm:px-6 lg:px-8">
      <section className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 sm:p-6">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
          Reviews
        </p>
        <h1 className="mt-2 max-w-2xl text-2xl font-semibold leading-tight text-zinc-900 sm:text-3xl">
          Customer moments backed by written stories.
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-zinc-600">
          Click any image to read the traveler&apos;s full review in the side panel.
        </p>
      </section>

      <ReviewShowcase items={photoWallItems} />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {reviews.map((review) => (
          <article
            key={review.id}
            className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                {review.trip}
              </p>
              {review.rating && (
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${
                        i < review.rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-zinc-200"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
            <h2 className="mt-2 text-lg font-semibold leading-tight text-zinc-900">
              {review.name}
            </h2>
            <p className="mt-0.5 text-xs text-zinc-500">{review.designation}</p>
            <p className="mt-3 text-sm leading-relaxed text-zinc-600">
              &quot;{review.quote}&quot;
            </p>
          </article>
        ))}
      </section>
    </div>
  );
}
