"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/home/page-hero";
import { CtaBand } from "@/components/home/cta-band";
import { Reveal } from "@/components/home/reveal";

export function TripsCatalog({ sections }) {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 pb-16 pt-20 sm:px-6 lg:px-8">
      <PageHero
        eyebrow="Trip Catalogue"
        title="Curated routes across every mood of travel."
        description="Browse Friends Getaway, Spiritual Journeys, Family Time, and Honeymoon packages — each sequenced by real planners."
        action={
          <a href="https://cal.com/varsha-tourism-ndqbdf/15min" target="_blank" rel="noopener noreferrer">
            <Button className="bg-zinc-900 text-white hover:bg-zinc-800 text-xs font-semibold px-4 py-2 rounded-lg">
              Book Meeting
            </Button>
          </a>
        }
      />

      {sections.map((section, si) => (
        <section key={section.id} id={section.id} className="space-y-5">
          <Reveal delay={si * 0.05}>
            <div className="max-w-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-600">
                {section.title}
              </p>
              <h2 className="mt-1 text-xl font-semibold leading-tight text-zinc-900 sm:text-2xl">
                {section.title}
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-zinc-600">
                {section.description}
              </p>
            </div>
          </Reveal>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {section.trips.map((trip, ti) => (
              <Reveal key={trip.slug} delay={ti * 0.06}>
                <Link
                  href={`/trips/${trip.slug}`}
                  className="group block overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-200 hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.15)]"
                >
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={trip.image}
                      alt={trip.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </div>

                  <div className="space-y-3 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-base font-semibold leading-tight text-zinc-900">
                          {trip.name}
                        </h3>
                        <p className="mt-0.5 text-xs text-zinc-500">{trip.duration}</p>
                      </div>
                      <span className="shrink-0 rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-0.5 text-[10px] font-semibold text-zinc-700 tabular-nums">
                        {trip.price}
                      </span>
                    </div>

                    <p className="text-xs leading-relaxed text-zinc-600 line-clamp-2">
                      {trip.summary}
                    </p>

                    {trip.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {trip.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[10px] text-zinc-600"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-1 border-t border-zinc-100 pt-2 text-xs font-semibold text-zinc-900 transition-colors group-hover:text-amber-700">
                      View Details
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      ))}

      <CtaBand />
    </div>
  );
}
