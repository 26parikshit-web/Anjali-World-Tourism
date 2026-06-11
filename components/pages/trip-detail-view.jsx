"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowLeft, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContactForm } from "@/components/contact-form";
import { Reveal } from "@/components/home/reveal";
import { TripGallery } from "@/components/trip-gallery";
import { cloudinaryHeroUrl } from "@/lib/cloudinary";

export function TripDetailView({ trip }) {
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
    <div className="min-h-screen pt-16 text-zinc-900">
      {/* Hero — image has subtle ken-burns; text is fixed and stable */}
      <section className="relative h-[50vh] overflow-hidden md:h-[60vh]">
        <motion.img
          src={cloudinaryHeroUrl(heroImage)}
          alt={trip.name}
          className="optimized-video h-full w-full object-cover"
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/20" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl p-6 md:p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-400">
              {trip.category}
            </p>
            <h1 className="mt-2 text-4xl font-semibold leading-tight text-white md:text-5xl lg:text-6xl">
              {trip.name}
            </h1>
            <p className="mt-3 max-w-2xl text-base text-zinc-300 md:text-lg">
              {shortDescription}
            </p>
          </motion.div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-10">
            <Reveal>
              <section>
                <h2 className="mb-4 text-xl font-semibold text-zinc-900">About This Trip</h2>
                <div className="prose prose-zinc max-w-none text-sm leading-relaxed text-zinc-600">
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
                        <span className="text-sm text-zinc-700">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </section>
              </Reveal>
            )}

            {itinerary.length > 0 && (
              <Reveal>
                <section>
                  <h2 className="mb-4 text-xl font-semibold text-zinc-900">
                    Day-by-Day Itinerary
                  </h2>
                  <div className="space-y-4">
                    {itinerary.map((day, i) => (
                      <Reveal key={i} delay={i * 0.04}>
                        <div className="rounded-xl border border-zinc-200 p-4 transition-colors hover:border-zinc-300">
                          <div className="mb-2 flex items-center gap-3">
                            <span className="rounded-full bg-amber-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-amber-600">
                              Day {day.day}
                            </span>
                            <h3 className="text-base font-semibold text-zinc-900">{day.title}</h3>
                          </div>
                          <p className="text-sm leading-relaxed text-zinc-600">{day.description}</p>
                        </div>
                      </Reveal>
                    ))}
                  </div>
                </section>
              </Reveal>
            )}

            {gallery.length > 0 && (
              <Reveal>
                <TripGallery items={gallery} />
              </Reveal>
            )}

            {(inclusions.length > 0 || exclusions.length > 0) && (
              <Reveal>
                <section className="grid gap-6 sm:grid-cols-2">
                  {inclusions.length > 0 && (
                    <div>
                      <h2 className="mb-4 text-xl font-semibold text-zinc-900">
                        What&apos;s Included
                      </h2>
                      <ul className="space-y-2">
                        {inclusions.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-zinc-600">
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {exclusions.length > 0 && (
                    <div>
                      <h2 className="mb-4 text-xl font-semibold text-zinc-900">Not Included</h2>
                      <ul className="space-y-2">
                        {exclusions.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-zinc-600">
                            <X className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </section>
              </Reveal>
            )}

            <Reveal>
              <section id="enquire">
                <ContactForm tripInterest={trip.name} />
              </section>
            </Reveal>
          </div>

          {/* Booking card — fixed, professional, sticky */}
          <div className="h-fit lg:sticky lg:top-20">
            <Reveal direction="left" delay={0.15}>
              <div className="space-y-5 rounded-2xl border border-zinc-200 bg-white p-6 shadow-lg">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
                    Starting From
                  </p>
                  <p className="mt-1 text-3xl font-bold tabular-nums text-zinc-900">
                    {trip.price}
                  </p>
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
                          className="rounded-full bg-zinc-100 px-2 py-1 text-[10px] font-medium text-zinc-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </>
                )}

                <div className="space-y-2 pt-2">
                  <a
                    href="https://cal.com/varsha-tourism-ndqbdf/15min"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="w-full rounded-xl bg-zinc-900 py-4 text-sm font-semibold text-white hover:bg-zinc-800">
                      Book Meeting
                    </Button>
                  </a>
                  <a href="#enquire">
                    <Button
                      variant="outline"
                      className="w-full rounded-xl border-zinc-300 py-4 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
                    >
                      Request This Package
                    </Button>
                  </a>
                </div>

                <p className="text-center text-[10px] text-zinc-400">
                  Our manual desk will contact you within 24 hours
                </p>
              </div>

              <div className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                <p className="text-xs font-semibold text-zinc-900">Need help deciding?</p>
                <p className="mt-1 text-xs text-zinc-500">
                  Call us at{" "}
                  <a href="tel:+919800000000" className="font-medium text-zinc-900">
                    +91 98XXX XXXXX
                  </a>
                </p>
              </div>
            </Reveal>
          </div>
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
