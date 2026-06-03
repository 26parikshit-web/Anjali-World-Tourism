import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getTripBySlug, getTripSlugs } from "@/lib/data-service";
import { ContactForm } from "@/components/contact-form";

export async function generateStaticParams() {
  const slugs = await getTripSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const trip = await getTripBySlug(slug);
  if (!trip) return { title: "Trip Not Found" };
  return {
    title: `${trip.name} | Anjali World Tourism`,
    description: trip.short_description || trip.shortDescription,
  };
}

export default async function TripDetailPage({ params }) {
  const { slug } = await params;
  const trip = await getTripBySlug(slug);

  if (!trip) {
    notFound();
  }

  const description = trip.description || "";
  const shortDescription = trip.short_description || trip.shortDescription || "";
  const heroImage = trip.hero_image || trip.heroImage;
  const groupSize = trip.group_size || trip.groupSize;
  const bestSeason = trip.best_season || trip.bestSeason;
  const highlights = trip.highlights || [];
  const itinerary = trip.itinerary || [];
  const gallery = trip.gallery || [];
  const inclusions = trip.inclusions || [];
  const exclusions = trip.exclusions || [];
  const tags = trip.tags || [];

  return (
    <div className="bg-white text-zinc-900 min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <img
          src={heroImage}
          alt={trip.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 max-w-7xl mx-auto">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-400">
            {trip.category}
          </p>
          <h1 className="mt-2 text-4xl md:text-5xl lg:text-6xl font-semibold text-white leading-tight">
            {trip.name}
          </h1>
          <p className="mt-3 text-base md:text-lg text-zinc-300 max-w-2xl">
            {shortDescription}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* Left Column - Details */}
          <div className="space-y-10">
            {/* Description */}
            <section>
              <h2 className="text-xl font-semibold text-zinc-900 mb-4">About This Trip</h2>
              <div className="prose prose-zinc max-w-none text-sm leading-relaxed text-zinc-600">
                {description.split('\n\n').map((para, i) => (
                  <p key={i} className="mb-4">{para}</p>
                ))}
              </div>
            </section>

            {/* Highlights */}
            {highlights.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold text-zinc-900 mb-4">Trip Highlights</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {highlights.map((highlight, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-3 rounded-xl border border-zinc-200 bg-zinc-50"
                    >
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-zinc-900 text-white flex items-center justify-center text-xs font-semibold">
                        {i + 1}
                      </span>
                      <span className="text-sm text-zinc-700">{highlight}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Itinerary */}
            {itinerary.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold text-zinc-900 mb-4">Day-by-Day Itinerary</h2>
                <div className="space-y-4">
                  {itinerary.map((day, i) => (
                    <div
                      key={i}
                      className="border border-zinc-200 rounded-xl p-4 hover:border-zinc-300 transition-colors"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-[10px] font-semibold uppercase tracking-widest text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                          Day {day.day}
                        </span>
                        <h3 className="text-base font-semibold text-zinc-900">{day.title}</h3>
                      </div>
                      <p className="text-sm text-zinc-600 leading-relaxed">{day.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Photo/Video Gallery */}
            {gallery.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold text-zinc-900 mb-4">Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {gallery.map((item, i) => (
                    <div
                      key={i}
                      className="relative aspect-[4/3] rounded-xl overflow-hidden group cursor-pointer"
                    >
                      {item.type === "video" ? (
                        <video
                          src={item.src || item.image_url}
                          className="w-full h-full object-cover"
                          muted
                          loop
                          onMouseEnter={(e) => e.target.play()}
                          onMouseLeave={(e) => e.target.pause()}
                        />
                      ) : (
                        <img
                          src={item.src || item.image_url}
                          alt={item.alt || item.title || `Gallery image ${i + 1}`}
                          className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                        />
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                      {item.type === "video" && (
                        <div className="absolute top-2 right-2 bg-black/50 text-white text-[9px] px-2 py-1 rounded-full">
                          Video
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Inclusions & Exclusions */}
            {(inclusions.length > 0 || exclusions.length > 0) && (
              <section className="grid gap-6 sm:grid-cols-2">
                {inclusions.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold text-zinc-900 mb-4">What's Included</h2>
                    <ul className="space-y-2">
                      {inclusions.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-zinc-600">
                          <span className="text-emerald-500 mt-0.5">✓</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {exclusions.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold text-zinc-900 mb-4">Not Included</h2>
                    <ul className="space-y-2">
                      {exclusions.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-zinc-600">
                          <span className="text-red-400 mt-0.5">✗</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            )}

            {/* Contact Form for Enquiry */}
            <section id="enquire">
              <ContactForm tripInterest={trip.name} />
            </section>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:sticky lg:top-20 h-fit">
            <div className="rounded-2xl border border-zinc-200 bg-white shadow-lg p-6 space-y-5">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
                  Starting From
                </p>
                <p className="text-3xl font-bold text-zinc-900 mt-1">{trip.price}</p>
                <p className="text-xs text-zinc-500">per person</p>
              </div>

              <div className="h-px bg-zinc-200" />

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Duration</span>
                  <span className="font-medium text-zinc-900">{trip.duration}</span>
                </div>
                {groupSize && (
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Group Size</span>
                    <span className="font-medium text-zinc-900">{groupSize}</span>
                  </div>
                )}
                {trip.difficulty && (
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Difficulty</span>
                    <span className="font-medium text-zinc-900">{trip.difficulty}</span>
                  </div>
                )}
                {bestSeason && (
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Best Season</span>
                    <span className="font-medium text-zinc-900">{bestSeason}</span>
                  </div>
                )}
              </div>

              {tags.length > 0 && (
                <>
                  <div className="h-px bg-zinc-200" />
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-medium bg-zinc-100 text-zinc-600 px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </>
              )}

              <div className="space-y-2 pt-2">
                <a href="#enquire">
                  <Button className="w-full bg-zinc-900 text-white hover:bg-zinc-800 text-sm font-semibold py-4 rounded-xl">
                    Request This Package
                  </Button>
                </a>
                <Link href="/contact">
                  <Button
                    variant="outline"
                    className="w-full border-zinc-300 text-zinc-700 hover:bg-zinc-50 text-sm font-medium py-4 rounded-xl"
                  >
                    Contact Us
                  </Button>
                </Link>
              </div>

              <p className="text-[10px] text-zinc-400 text-center">
                Our manual desk will contact you within 24 hours
              </p>
            </div>

            {/* Quick Contact */}
            <div className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
              <p className="text-xs font-semibold text-zinc-900">Need help deciding?</p>
              <p className="text-xs text-zinc-500 mt-1">
                Call us at <a href="tel:+919800000000" className="text-zinc-900 font-medium">+91 98XXX XXXXX</a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Back Link */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <Link
          href="/trips"
          className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
        >
          ← Back to all trips
        </Link>
      </div>
    </div>
  );
}
