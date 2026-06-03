import Link from "next/link";
import { getTrips, getTripSections } from "@/lib/data-service";
import { Button } from "@/components/ui/button";

export default async function TripsPage() {
  const trips = await getTrips();
  const tripSections = getTripSections();

  // Group trips by category
  const tripsByCategory = trips.reduce((acc, trip) => {
    const category = trip.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(trip);
    return acc;
  }, {});

  // Create sections from trips data
  const sections = Object.entries(tripsByCategory).map(([category, categoryTrips]) => ({
    id: category.toLowerCase().replace(/\s+/g, '-'),
    title: category,
    description: tripSections.find(s => s.title === category)?.description || `Explore our ${category} packages`,
    trips: categoryTrips.map(trip => ({
      name: trip.name,
      slug: trip.slug,
      duration: trip.duration,
      price: trip.price,
      image: trip.hero_image || trip.heroImage,
      summary: trip.short_description || trip.shortDescription,
      tags: trip.tags || [],
    })),
  }));

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pb-16 pt-20 sm:px-6 lg:px-8">
      <section className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-5 sm:flex-row sm:items-end sm:justify-between sm:p-6">
        <div className="max-w-2xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Trip Catalogue
          </p>
          <h1 className="mt-2 text-2xl font-semibold leading-tight text-zinc-900 sm:text-3xl">
            Curated routes across every mood of travel.
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600">
            Browse Friends Getaway, Spiritual Journeys, Family Time, and Honeymoon packages.
          </p>
        </div>

        <a href="https://cal.com/varsha-tourism-ndqbdf/15min" target="_blank" rel="noopener noreferrer">
          <Button className="bg-zinc-900 text-white hover:bg-zinc-800 text-xs font-semibold px-4 py-2 rounded-lg">
            Book Meeting
          </Button>
        </a>
      </section>

      {sections.map((section) => (
        <section key={section.id} id={section.id} className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                {section.title}
              </p>
              <h2 className="mt-1 text-xl font-semibold leading-tight text-zinc-900 sm:text-2xl">
                {section.title}
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-zinc-600">
                {section.description}
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {section.trips.map((trip) => (
              <Link
                key={trip.name}
                href={`/trips/${trip.slug}`}
                className="group overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition hover:shadow-md hover:border-zinc-300 block"
              >
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={trip.image}
                    alt={trip.name}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                </div>

                <div className="space-y-3 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-semibold leading-tight text-zinc-900">
                        {trip.name}
                      </h3>
                      <p className="mt-0.5 text-xs text-zinc-500">{trip.duration}</p>
                    </div>
                    <span className="rounded-full border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[10px] font-semibold text-zinc-700">
                      {trip.price}
                    </span>
                  </div>

                  <p className="text-xs leading-relaxed text-zinc-600">{trip.summary}</p>

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

                  <div className="pt-2 border-t border-zinc-100">
                    <span className="text-xs font-semibold text-zinc-900 group-hover:text-zinc-600 transition-colors">
                      View Details →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}

      <section className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-zinc-900 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="max-w-lg">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400">
            Need something bespoke?
          </p>
          <h2 className="mt-1 text-xl font-semibold leading-tight text-white sm:text-2xl">
            Build a route around your dates, pace, and budget.
          </h2>
        </div>

        <a href="https://cal.com/varsha-tourism-ndqbdf/15min" target="_blank" rel="noopener noreferrer">
          <Button className="bg-white text-zinc-900 hover:bg-zinc-100 text-xs font-semibold px-4 py-2 rounded-lg">
            Book Meeting
          </Button>
        </a>
      </section>
    </div>
  );
}
