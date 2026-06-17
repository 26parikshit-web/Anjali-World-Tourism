"use client";

import { Fragment, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { OmLoader } from "@/components/om-loader";
import { Reveal } from "@/components/home/reveal";
import { CountUp } from "@/components/home/count-up";
import {
  Plane,
  ArrowRight,
  Users,
  Clock,
  IndianRupee,
  CheckCircle2,
  MapPin,
} from "lucide-react";
import { TripCard } from "@/components/trip-card";
import { contactDetails } from "@/lib/site-data";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const marqueeDestinations = [
  "Kedarnath",
  "Spiti Valley",
  "Char Dham",
  "Goa",
  "Tawang",
  "Varkala",
  "Badrinath",
  "Kasol",
  "12 Jyotirlinga",
  "Panchkedar",
];

const heroStats = [
  { value: 500, suffix: "+", label: "Trips Planned" },
  { value: 4.9, decimals: 1, label: "Traveler Rating" },
  { value: 100, suffix: "%", label: "Human Planned" },
];

const whyUs = [
  {
    icon: Users,
    title: "Real human planners",
    description:
      "No bots, no auto-itineraries. Every route is sequenced by a person who has done the trip.",
  },
  {
    icon: Clock,
    title: "24/7 manual support",
    description:
      "Reach a real planner before, during, and after your journey — across time zones.",
  },
  {
    icon: IndianRupee,
    title: "Honest, best-value pricing",
    description:
      "Transparent costs with premium stays and the right add-ons, never hidden markups.",
  },
  {
    icon: CheckCircle2,
    title: "Trusted & senior-friendly",
    description:
      "Pacing, comfort, and temple timings planned with families and elders in mind.",
  },
];

const wordVariants = {
  hidden: { y: "0.7em", opacity: 0 },
  show: { y: 0, opacity: 1 },
};

function SectionBackground({ background, alt }) {
  if (!background) return null;

  if (background.type === "video") {
    return (
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster={background.poster || undefined}
        className="optimized-video h-full w-full object-cover"
      >
        {(background.sources || [{ src: background.url, type: "video/mp4" }]).map(
          (source) => (
            <source key={source.src} src={source.src} type={source.type} />
          )
        )}
      </video>
    );
  }

  return (
    <img
      src={background.url}
      alt={alt}
      className="h-full w-full object-cover"
    />
  );
}

function HorizontalScrollSection({ title, subtitle, description, items, id, background }) {
  const containerRef = useRef(null);
  const scrollRef = useRef(null);

  useGSAP(
    () => {
      const cards = gsap.utils.toArray(".scroll-card", scrollRef.current);
      if (cards.length === 0) return;

      gsap.to(scrollRef.current, {
        x: () => -(scrollRef.current.scrollWidth - window.innerWidth + 100),
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          scrub: 1,
          end: () => `+=${scrollRef.current.scrollWidth - window.innerWidth + 200}`,
        },
      });

      gsap.from(cards, {
        y: 64,
        opacity: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
        },
      });
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} id={id} className="h-screen w-full overflow-hidden relative">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <SectionBackground
          background={background}
          alt={`${title} section background`}
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>
      <div className="h-full flex items-center relative z-10">
        <div
          ref={scrollRef}
          className="flex items-center gap-6 px-8 md:px-16"
          style={{ width: "max-content" }}
        >
          <div className="w-[320px] md:w-[380px] shrink-0 pr-8">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-400">
              {subtitle}
            </p>
            <h2 className="mt-2 text-3xl md:text-4xl font-semibold text-white leading-tight">
              {title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-300">{description}</p>
            <Link href="/trips">
              <Button className="mt-4 bg-white text-zinc-900 hover:bg-zinc-100 text-xs font-semibold px-4 py-2 rounded-lg">
                {id === "spiritual" ? "See pilgrimage packages" : "Explore group getaways"}
              </Button>
            </Link>
          </div>

          {items.map((item) => (
            <TripCard
              key={item.id}
              item={item}
              className="scroll-card h-[400px] w-[280px] shrink-0 md:h-[440px] md:w-[320px]"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomePage({ spiritualJourneys, friendsGetaway, homeContent }) {
  const [pageReady, setPageReady] = useState(false);
  const headlineLines = homeContent?.hero?.headlineLines || [
    "Where meaningful journeys",
    "become lifelong memories.",
  ];
  const heroDescription =
    homeContent?.hero?.description ||
    "Anjali World Tourism crafts editorial-quality itineraries for spiritual pilgrimages, friend getaways, family holidays, and honeymoons across India — with hands-on planners, not algorithms.";

  if (!pageReady) {
    return <OmLoader onLoadComplete={() => setPageReady(true)} />;
  }

  return (
    <div className="bg-white text-zinc-900">

      <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-zinc-950">
        <div className="absolute inset-0 z-0">
          <SectionBackground
            background={homeContent?.hero?.background}
            alt="Anjali World Tourism hero background"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/45 to-black/70" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 pt-16">
          <motion.h1
            initial="hidden"
            animate="show"
            transition={{ staggerChildren: 0.05, delayChildren: 0.25 }}
            className="text-4xl sm:text-5xl md:text-6xl font-semibold text-white leading-[1.1] tracking-tight"
          >
            {headlineLines.map((line, li) => {
              const words = line.split(" ");
              return (
                <span key={li} className="block overflow-hidden">
                  {words.map((wordText, wi) => (
                    <Fragment key={wi}>
                      <span className="inline-block overflow-hidden align-bottom">
                        <motion.span
                          variants={wordVariants}
                          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                          className="inline-block"
                        >
                          {wordText}
                        </motion.span>
                      </span>
                      {wi < words.length - 1 ? " " : null}
                    </Fragment>
                  ))}
                </span>
              );
            })}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="mt-6 text-base sm:text-lg text-zinc-300 max-w-2xl mx-auto leading-relaxed"
          >
            {heroDescription}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.75 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <Link href="/trips">
              <Button className="group bg-white text-zinc-900 hover:bg-zinc-100 text-sm font-semibold px-6 py-3 rounded-xl">
                Explore India packages
                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </Link>
            <a
              href="https://cal.com/varsha-tourism-ndqbdf/15min"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 text-sm font-semibold px-6 py-3 rounded-xl"
              >
                Book Meeting
              </Button>
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.9 }}
            className="mt-10 flex items-center justify-center gap-6 sm:gap-8 text-xs text-zinc-300"
          >
            {heroStats.map((stat, i) => (
              <div key={stat.label} className="flex items-center gap-6 sm:gap-8">
                {i > 0 && <div className="w-px h-8 bg-white/20" />}
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">
                    <CountUp
                      value={stat.value}
                      suffix={stat.suffix}
                      decimals={stat.decimals || 0}
                    />
                  </p>
                  <p>{stat.label}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="absolute bottom-0 inset-x-0 z-10 border-t border-white/10 bg-gradient-to-t from-black/60 to-transparent py-3 backdrop-blur-[2px]">
          <div className="marquee-track">
            {[...marqueeDestinations, ...marqueeDestinations].map((place, i) => (
              <span
                key={i}
                className="mx-6 flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.2em] text-white/45"
              >
                <MapPin className="h-3 w-3 text-amber-400/70" />
                {place}
              </span>
            ))}
          </div>
        </div>
      </section>

      <HorizontalScrollSection
        id="spiritual"
        subtitle={homeContent?.spiritual?.subtitle || "Spiritual Journeys"}
        title={homeContent?.spiritual?.title || "Sacred Pilgrimage Routes"}
        description={
          homeContent?.spiritual?.description ||
          "Slow, reverent, logistics-heavy routes designed for darshan, family comfort, and trusted pacing."
        }
        items={spiritualJourneys}
        background={homeContent?.spiritual?.background}
      />

      <HorizontalScrollSection
        id="getaway"
        subtitle={homeContent?.getaway?.subtitle || "Friends Getaway"}
        title={homeContent?.getaway?.title || "Group Adventure Escapes"}
        description={
          homeContent?.getaway?.description ||
          "Mood-led escapes for friend groups who want scenery, stories, and high-energy shared memories."
        }
        items={friendsGetaway}
        background={homeContent?.getaway?.background}
      />

      <section className="relative bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-600">
              Why travelers choose us
            </p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-900">
              Planned by people, not algorithms.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-zinc-600">
              Every itinerary is sequenced, paced, and supported by real planners — so the details
              that matter stay reliable from booking to homecoming.
            </p>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {whyUs.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <Reveal
                  key={feature.title}
                  delay={i * 0.08}
                  className="group rounded-2xl border border-zinc-200 bg-zinc-50/60 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-amber-200 hover:bg-white hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.18)]"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-900 text-white transition-colors group-hover:bg-amber-500">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-base font-semibold text-zinc-900">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                    {feature.description}
                  </p>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-t border-zinc-200 bg-zinc-50 py-20 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-900">
              Handcrafted travel across India
            </h2>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-zinc-600">
              <p>
                Anjali World Tourism is a manual travel planning desk based in India, built for
                travelers who want curated routes instead of generic package listings. Whether you
                are planning a Char Dham Yatra, a Kedarnath pilgrimage, a Kashmir family holiday, or
                a friends getaway to Spiti or Goa, our planners shape the itinerary around your
                dates, comfort level, and budget — not a one-size-fits-all template.
              </p>
              <p>
                Spiritual journeys are our foundation. We understand temple timings, helicopter
                windows, senior-friendly pacing, and the logistics that make or break a pilgrimage.
                For family time and honeymoon packages, we balance scenic stays with practical
                transfers. For group adventures, we focus on routes that feel alive — mountain
                passes, coastal drives, and shared experiences worth remembering.
              </p>
              <p>
                Every package on this site is sequenced by a real person who has studied the route,
                verified stays, and thought through what happens when weather shifts or plans change.
                You get 24/7 manual support before departure and on the road, transparent pricing
                without hidden markups, and honest guidance when a deluxe upgrade or simpler option
                makes more sense.
              </p>
              <p>
                From Uttarakhand and Himachal to Kashmir, South India, Sikkim, and international
                options like Sri Lanka, we cover curated travel experiences across India and nearby
                destinations. Browse our trip catalog, read traveler reviews, or book a short planning
                call — and we will help you turn your next journey into something that feels
                editorial on screen and deeply human in execution.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/trips">
                <Button className="bg-zinc-900 text-white hover:bg-zinc-800 text-sm font-semibold px-5 py-2.5 rounded-xl">
                  View trip packages
                </Button>
              </Link>
              <Link href="/reviews">
                <Button
                  variant="outline"
                  className="border-zinc-300 text-zinc-800 hover:bg-zinc-100 text-sm font-semibold px-5 py-2.5 rounded-xl"
                >
                  Read traveler stories
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  variant="outline"
                  className="border-zinc-300 text-zinc-800 hover:bg-zinc-100 text-sm font-semibold px-5 py-2.5 rounded-xl"
                >
                  Contact our planners
                </Button>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="relative overflow-hidden bg-zinc-950 py-20 sm:py-28">
        <div className="absolute inset-0 overflow-hidden mix-blend-screen pointer-events-none">
          <div className="aurora-blob aurora-a left-[5%] top-[-30%] h-[40vw] w-[40vw] bg-amber-500/30" />
          <div className="aurora-blob aurora-b right-[0%] bottom-[-40%] h-[42vw] w-[42vw] bg-indigo-500/30" />
        </div>
        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-white">
              Ready to plan your next journey?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-zinc-300">
              Tell us your dates and travel mood — a real planner will shape the route, stays, and
              pacing around you.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link href="/trips">
                <Button className="group bg-white text-zinc-900 hover:bg-zinc-100 text-sm font-semibold px-6 py-3 rounded-xl">
                  Start planning today
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </Link>
              <a
                href="https://cal.com/varsha-tourism-ndqbdf/15min"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="outline"
                  className="gap-2 border-white/30 text-white hover:bg-white/10 text-sm font-semibold px-6 py-3 rounded-xl"
                >
                  <Plane className="h-4 w-4" />
                  Book a Meeting
                </Button>
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <footer className="border-t border-zinc-200 bg-zinc-50">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-8 text-xs text-zinc-500 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <p className="font-semibold uppercase tracking-[0.15em] text-zinc-900">
              Anjali World Tourism
            </p>
            <p className="mt-2 max-w-md text-zinc-500">
              Curated itineraries and on-call planners for pilgrimages, group trips, family
              holidays, and honeymoons across India.
            </p>
            <a
              href={`tel:${contactDetails.whatsapp}`}
              className="mt-2 inline-block font-medium text-zinc-700 hover:text-zinc-900"
            >
              {contactDetails.phone}
            </a>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link href="/" className="hover:text-zinc-900 transition-colors">
              Home
            </Link>
            <Link href="/trips" className="hover:text-zinc-900 transition-colors">
              Trips
            </Link>
            <Link href="/reviews" className="hover:text-zinc-900 transition-colors">
              Reviews
            </Link>
            <Link href="/contact" className="hover:text-zinc-900 transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
