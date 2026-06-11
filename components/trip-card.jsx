"use client";

import { useState } from "react";
import Link from "next/link";
import { TRIP_CARD_LIMITS, truncateForCard } from "@/lib/trip-card-text";
import { resolveTripCardImage } from "@/lib/home-trip-cards";
import { TripCardMedia } from "@/components/trip-card-media";

export function TripCard({ item, className = "" }) {
  const [hovered, setHovered] = useState(false);
  const images =
    Array.isArray(item.images) && item.images.length > 0
      ? item.images
      : [item.image || resolveTripCardImage("")];

  const name = truncateForCard(item.name, TRIP_CARD_LIMITS.name);
  const tagline = truncateForCard(item.tagline, TRIP_CARD_LIMITS.tagline);
  const price = truncateForCard(item.price, TRIP_CARD_LIMITS.price);
  const description = truncateForCard(item.description, TRIP_CARD_LIMITS.description);
  const duration = truncateForCard(item.duration, TRIP_CARD_LIMITS.duration);
  const highlights = (item.highlights || []).map((tag) =>
    truncateForCard(tag, TRIP_CARD_LIMITS.highlight)
  );

  return (
    <Link
      href={`/trips/${item.slug || item.id}`}
      title={item.name}
      className={`group relative block cursor-pointer overflow-hidden rounded-2xl ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <TripCardMedia images={images} alt={item.name} playing={hovered} />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 group-hover:opacity-0" />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 p-5 transition-opacity duration-300 group-hover:opacity-0">
        <p
          className="text-[10px] font-semibold uppercase tracking-widest text-amber-400"
          title={item.tagline}
        >
          {tagline}
        </p>
        <h3 className="mt-1 truncate text-2xl font-semibold text-white" title={item.name}>
          {name}
        </h3>
        <p className="mt-2 truncate text-lg font-bold text-white" title={item.price}>
          {price}
        </p>
      </div>

      <div className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-black/85 p-5 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100">
        <p
          className="text-[10px] font-semibold uppercase tracking-widest text-amber-400"
          title={item.tagline}
        >
          {tagline}
        </p>
        <p className="mt-1 truncate text-2xl font-semibold text-white" title={item.name}>
          {name}
        </p>
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-zinc-300" title={item.description}>
          {description}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {highlights.map((tag, i) => (
            <span
              key={`${tag}-${i}`}
              className="rounded-full border border-white/20 bg-white/10 px-2 py-1 text-[9px] font-medium text-white"
              title={item.highlights?.[i]}
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-white/20 pt-3">
          <div className="min-w-0">
            <p className="text-[10px] text-zinc-400" title={item.duration}>
              {duration}
            </p>
            <p className="truncate text-xl font-bold text-white" title={item.price}>
              {price}
            </p>
          </div>
          <span className="shrink-0 rounded-lg bg-white px-4 py-2 text-[10px] font-semibold text-zinc-900">
            View Details →
          </span>
        </div>
      </div>
    </Link>
  );
}
