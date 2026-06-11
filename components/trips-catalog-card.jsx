"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { TRIPS_CATALOG_LIMITS, truncateForCard } from "@/lib/trip-card-text";
import { resolveTripCardImage } from "@/lib/home-trip-cards";
import { TripCardMedia } from "@/components/trip-card-media";

export function TripsCatalogCard({ trip }) {
  const [hovered, setHovered] = useState(false);
  const images =
    Array.isArray(trip.images) && trip.images.length > 0
      ? trip.images
      : [trip.image || resolveTripCardImage("")];
  const name = truncateForCard(trip.name, TRIPS_CATALOG_LIMITS.name);
  const price = truncateForCard(trip.price, TRIPS_CATALOG_LIMITS.price);
  const duration = truncateForCard(trip.duration, TRIPS_CATALOG_LIMITS.duration);
  const summary = truncateForCard(trip.summary, TRIPS_CATALOG_LIMITS.summary);
  const tags = (trip.tags || []).slice(0, 3).map((tag) =>
    truncateForCard(tag, TRIPS_CATALOG_LIMITS.tag)
  );

  return (
    <Link
      href={`/trips/${trip.slug}`}
      title={trip.name}
      className="group flex h-full min-h-[22.5rem] flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-200 hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.15)]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative h-44 shrink-0 overflow-hidden">
        <TripCardMedia images={images} alt={trip.name} playing={hovered} />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex min-h-[3.25rem] items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3
              className="line-clamp-2 text-base font-semibold leading-snug text-zinc-900"
              title={trip.name}
            >
              {name}
            </h3>
            <p className="mt-0.5 truncate text-xs text-zinc-500" title={trip.duration}>
              {duration || "\u00A0"}
            </p>
          </div>
          <span
            className="max-w-[42%] shrink-0 truncate rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-0.5 text-[10px] font-semibold text-zinc-700 tabular-nums"
            title={trip.price}
          >
            {price || "\u00A0"}
          </span>
        </div>

        <p
          className="mt-3 min-h-[2.75rem] line-clamp-2 text-xs leading-relaxed text-zinc-600"
          title={trip.summary}
        >
          {summary || "\u00A0"}
        </p>

        <div className="mt-3 flex min-h-[1.625rem] flex-wrap content-start gap-1.5">
          {tags.length > 0 ? (
            tags.map((tag, i) => (
              <span
                key={`${tag}-${i}`}
                className="max-w-full truncate rounded-full border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[10px] text-zinc-600"
                title={trip.tags?.[i]}
              >
                {tag}
              </span>
            ))
          ) : (
            <span className="invisible select-none px-2 py-0.5 text-[10px]" aria-hidden>
              placeholder
            </span>
          )}
        </div>

        <div className="mt-auto flex min-h-[2rem] items-center gap-1 border-t border-zinc-100 pt-2 text-xs font-semibold text-zinc-900 transition-colors group-hover:text-amber-700">
          View Details
          <ArrowRight className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:translate-x-0.5" />
        </div>
      </div>
    </Link>
  );
}
