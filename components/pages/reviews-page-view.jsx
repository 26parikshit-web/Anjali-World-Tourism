"use client";

import { Star } from "lucide-react";
import { PageHero } from "@/components/home/page-hero";
import { CtaBand } from "@/components/home/cta-band";
import { Reveal } from "@/components/home/reveal";
import { CountUp } from "@/components/home/count-up";
import { ReviewShowcase } from "@/components/review-showcase";

export function ReviewsPageView({ reviews, photoWallItems }) {
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + (r.rating || 5), 0) / reviews.length
      : 4.9;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 pb-16 pt-20 sm:px-6 lg:px-8">
      <PageHero
        eyebrow="Reviews"
        title="Customer moments backed by written stories."
        description="Click any image to read the traveler's full review. Every story comes from a real trip we planned."
      />

      {/* Fixed stats row — numbers animate, labels stay stable */}
      <Reveal className="grid grid-cols-3 gap-4 rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6">
        <div className="text-center">
          <p className="text-2xl font-bold text-zinc-900 tabular-nums">
            <CountUp value={reviews.length} suffix="+" />
          </p>
          <p className="mt-1 text-[11px] uppercase tracking-[0.15em] text-zinc-500">
            Stories Shared
          </p>
        </div>
        <div className="text-center border-x border-zinc-200">
          <p className="text-2xl font-bold text-zinc-900 tabular-nums">
            <CountUp value={avgRating} decimals={1} />
          </p>
          <p className="mt-1 text-[11px] uppercase tracking-[0.15em] text-zinc-500">
            Avg. Rating
          </p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-zinc-900">100%</p>
          <p className="mt-1 text-[11px] uppercase tracking-[0.15em] text-zinc-500">
            Verified Trips
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <ReviewShowcase items={photoWallItems} />
      </Reveal>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {reviews.map((review, i) => (
          <Reveal key={review.id} delay={i * 0.05}>
            <article className="h-full rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-200 hover:shadow-[0_16px_40px_-16px_rgba(0,0,0,0.12)]">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-600">
                  {review.trip}
                </p>
                {review.rating && (
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, j) => (
                      <Star
                        key={j}
                        className={`h-3 w-3 ${
                          j < review.rating
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
          </Reveal>
        ))}
      </section>

      <CtaBand
        eyebrow="Inspired by their journeys?"
        title="Let us plan yours with the same care."
        description="Share your dates and travel mood — a real planner will take it from there."
        primaryHref="/contact"
        primaryLabel="Get in Touch"
      />
    </div>
  );
}
