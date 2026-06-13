"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowLeft, Check, X } from "lucide-react";
import { Reveal } from "@/components/home/reveal";
import { TripGallery } from "@/components/trip-gallery";
import { TripItinerarySection } from "@/components/trip-itinerary-section";
import { TripBookingSidebar } from "@/components/trip-booking-sidebar";
import { cloudinaryHeroUrl } from "@/lib/cloudinary";
import { getDefaultBookingDate } from "@/lib/trip-booking";

export function TripDetailView({ trip, featureFlags = {} }) {
  const description = trip.description || "";
  const shortDescription = trip.short_description || trip.shortDescription || "";
  const heroImage = trip.hero_image || trip.heroImage;
  const highlights = trip.highlights || [];
  const itinerary = trip.itinerary || [];
  const gallery = trip.gallery || [];
  const inclusions = trip.inclusions || [];
  const exclusions = trip.exclusions || [];
  const tags = trip.tags || [];

  const defaultDeparture = useMemo(() => getDefaultBookingDate(), []);
  const [departureDate, setDepartureDate] = useState(defaultDeparture);

  return (
    <div className="min-h-screen overflow-x-hidden pt-16 text-zinc-900">
      {/* Hero — image has subtle ken-burns; text is fixed and stable */}
      <section className="relative h-[42vh] overflow-hidden sm:h-[50vh] md:h-[60vh]">
        <motion.img
          src={cloudinaryHeroUrl(heroImage)}
          alt={trip.name}
          className="optimized-video h-full w-full object-cover"
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/20" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl p-4 sm:p-6 md:p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-400 sm:text-[11px]">
              {trip.category}
            </p>
            <h1 className="mt-2 text-2xl font-semibold leading-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
              {trip.name}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-zinc-300 sm:mt-3 sm:text-base md:text-lg">
              {shortDescription}
            </p>
          </motion.div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-7xl px-4 py-8 pb-32 sm:px-6 sm:py-12 sm:pb-12 lg:px-8">
        <div className="grid min-w-0 gap-6 sm:gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="min-w-0 space-y-8 sm:space-y-10">
            <Reveal>
              <section>
                <h2 className="mb-4 text-xl font-semibold text-zinc-900">About This Trip</h2>
                <div className="prose prose-zinc max-w-none text-sm leading-relaxed break-words text-zinc-600">
                  {description.split("\n\n").map((para, i) => (
                    <p key={i} className="mb-4">
                      {para}
                    </p>
                  ))}
                </div>
              </section>
            </Reveal>

            {highlights.length > 0 && (
              <Reveal>
                <section>
                  <h2 className="mb-4 text-xl font-semibold text-zinc-900">Trip Highlights</h2>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {highlights.map((highlight, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-3 transition-colors hover:border-amber-200"
                      >
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-xs font-semibold text-white">
                          {i + 1}
                        </span>
                        <span className="min-w-0 break-words text-sm text-zinc-700">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </section>
              </Reveal>
            )}

            {itinerary.length > 0 && (
              <Reveal>
                <TripItinerarySection itinerary={itinerary} departureDate={departureDate} />
              </Reveal>
            )}

            {gallery.length > 0 && (
              <Reveal>
                <TripGallery items={gallery} />
              </Reveal>
            )}

            {(inclusions.length > 0 || exclusions.length > 0) && (
              <Reveal>
                <section className="min-w-0 grid gap-6 sm:grid-cols-2">
                  {inclusions.length > 0 && (
                    <div className="min-w-0">
                      <h2 className="mb-4 text-xl font-semibold text-zinc-900">
                        What&apos;s Included
                      </h2>
                      <ul className="space-y-2">
                        {inclusions.map((item, i) => (
                          <li key={i} className="flex min-w-0 items-start gap-2 text-sm text-zinc-600">
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                            <span className="min-w-0 break-words">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {exclusions.length > 0 && (
                    <div className="min-w-0">
                      <h2 className="mb-4 text-xl font-semibold text-zinc-900">Not Included</h2>
                      <ul className="space-y-2">
                        {exclusions.map((item, i) => (
                          <li key={i} className="flex min-w-0 items-start gap-2 text-sm text-zinc-600">
                            <X className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                            <span className="min-w-0 break-words">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </section>
              </Reveal>
            )}

            {tags.length > 0 && (
              <Reveal>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-zinc-100 px-2 py-1 text-[10px] font-medium text-zinc-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Reveal>
            )}

          </div>

          {/* Booking sidebar — card on desktop; sticky bar on mobile */}
          <aside className="contents lg:block lg:sticky lg:top-20 lg:h-fit lg:min-w-0">
            <Reveal direction="up" delay={0.15} className="contents lg:block">
              <TripBookingSidebar
                trip={trip}
                departureDate={departureDate}
                onDepartureChange={setDepartureDate}
                razorpayEnabled={Boolean(featureFlags.razorpay_payments)}
              />

              <div className="mt-4 hidden rounded-xl border border-zinc-200 bg-zinc-50 p-4 lg:block">
                <p className="text-xs font-semibold text-zinc-900">Need help deciding?</p>
                <p className="mt-1 text-xs text-zinc-500">
                  Call us at{" "}
                  <a href="tel:+919220429249" className="font-medium text-zinc-900">
                    +91 92204 29249
                  </a>
                </p>
              </div>
            </Reveal>
          </aside>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <Reveal>
          <Link
            href="/trips"
            className="inline-flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-zinc-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to all trips
          </Link>
        </Reveal>
      </div>
    </div>
  );
}
