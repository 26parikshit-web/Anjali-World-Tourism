"use client";

import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/home/page-hero";
import { CtaBand } from "@/components/home/cta-band";
import { Reveal } from "@/components/home/reveal";
import { TripsCatalogCard } from "@/components/trips-catalog-card";

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

          <div className="grid auto-rows-fr gap-4 md:grid-cols-2 xl:grid-cols-3">
            {section.trips.map((trip, ti) => (
              <Reveal key={trip.slug} delay={ti * 0.06} className="h-full">
                <TripsCatalogCard trip={trip} />
              </Reveal>
            ))}
          </div>
        </section>
      ))}

      <CtaBand />
    </div>
  );
}
