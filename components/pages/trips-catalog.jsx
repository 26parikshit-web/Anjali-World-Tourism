"use client";

import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/home/page-hero";
import { CtaBand } from "@/components/home/cta-band";
import { Reveal } from "@/components/home/reveal";
import { TripsCatalogCard } from "@/components/trips-catalog-card";
import { GroupTripCard } from "@/components/group-trip-card";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

const PAGE_SIZE = 9;
const DEFAULT_CATEGORY = "Spiritual Journey";

function TripSection({ section, sectionIndex }) {
  const [currentPage, setCurrentPage] = useState(1);
  const tripKey = section.trips.map((t) => t.slug).join(",");

  useEffect(() => {
    setCurrentPage(1);
  }, [tripKey]);

  const totalPages = Math.ceil(section.trips.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedTrips = section.trips.slice(startIndex, startIndex + PAGE_SIZE);

  return (
    <section id={section.id} className="space-y-5">
      <Reveal delay={sectionIndex * 0.05}>
        <div className="max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-600">
            {section.title}
          </p>
          <h2 className="mt-1 text-xl font-semibold leading-tight text-zinc-900 sm:text-2xl">
            {section.title}
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-zinc-600">{section.description}</p>
        </div>
      </Reveal>

      <div className="grid auto-rows-fr gap-4 md:grid-cols-2 xl:grid-cols-3">
        {paginatedTrips.map((trip, ti) => (
          <Reveal key={trip.slug} delay={ti * 0.06} className="h-full">
            <TripsCatalogCard trip={trip} />
          </Reveal>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col gap-3 border-t border-zinc-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-zinc-500">
            Showing {startIndex + 1} to {Math.min(startIndex + PAGE_SIZE, section.trips.length)} of{" "}
            {section.trips.length} trips
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="rounded-lg border border-zinc-200 p-1.5 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm text-zinc-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="rounded-lg border border-zinc-200 p-1.5 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export function TripsCatalog({ sections, groupTrips = [] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(DEFAULT_CATEGORY);

  const categoryOptions = ["All", ...sections.map((s) => s.title)];

  const q = searchQuery.toLowerCase().trim();

  const filteredGroupTrips = groupTrips.filter((t) => {
    if (!q) return true;
    const nameMatch = t.name?.toLowerCase().includes(q);
    const placeMatch = t.hosted_place?.toLowerCase().includes(q);
    const tagMatch = t.tags?.some((tag) => tag.toLowerCase().includes(q));
    return nameMatch || placeMatch || tagMatch;
  });

  const categorySections =
    selectedCategory === "All"
      ? sections
      : sections.filter((section) => section.title === selectedCategory);

  const filteredSections = categorySections
    .map((section) => ({
      ...section,
      trips: section.trips.filter((t) => {
        if (!q) return true;
        const nameMatch = t.name?.toLowerCase().includes(q);
        const tagMatch = t.tags?.some((tag) => tag.toLowerCase().includes(q));
        return nameMatch || tagMatch;
      }),
    }))
    .filter((section) => section.trips.length > 0);

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

      <div className="relative w-full -mt-6 mb-8">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-zinc-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by country, destination, or tag..."
            className="w-full pl-11 pr-4 py-3.5 bg-white border border-zinc-200 rounded-2xl text-sm shadow-sm outline-none focus:border-zinc-400 focus:ring-4 focus:ring-zinc-400/10 transition-all"
          />
        </div>
        <div className="flex flex-wrap gap-2 mt-4 items-center">
          <span className="text-xs text-zinc-500 font-medium mr-1">Category:</span>
          {categoryOptions.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
                selectedCategory === category
                  ? "bg-zinc-900 text-white"
                  : "bg-zinc-100 hover:bg-zinc-200 text-zinc-600"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {filteredGroupTrips.length > 0 && (
        <section id="group-trips" className="space-y-5">
          <Reveal>
            <div className="max-w-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-600">
                Group Trips
              </p>
              <h2 className="mt-1 text-xl font-semibold leading-tight text-zinc-900 sm:text-2xl">
                Join a fixed departure
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-zinc-600">
                Scheduled group journeys with limited slots, per-person pricing, and a set hosted
                destination. Once spots fill up, booking closes automatically.
              </p>
            </div>
          </Reveal>

          <div className="grid auto-rows-fr gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredGroupTrips.map((trip, i) => (
              <Reveal key={trip.slug} delay={i * 0.06} className="h-full">
                <GroupTripCard trip={trip} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {filteredSections.map((section, si) => (
        <TripSection key={section.id} section={section} sectionIndex={si} />
      ))}

      {filteredSections.length === 0 && filteredGroupTrips.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-zinc-500 text-lg">
            No trips found
            {searchQuery ? ` matching "${searchQuery}"` : ""}
            {selectedCategory !== "All" ? ` in ${selectedCategory}` : ""}.
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory(DEFAULT_CATEGORY);
            }}
          >
            Reset filters
          </Button>
        </div>
      )}

      <CtaBand />
    </div>
  );
}
