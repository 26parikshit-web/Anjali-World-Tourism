"use client";

import { useRef } from "react";
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
import { resolveTripCardImage } from "@/lib/home-trip-cards";

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

const headlineLines = [
  "Journeys that feel editorial on screen,",
  "deeply human in planning.",
];

const wordVariants = {
  hidden: { y: "0.7em", opacity: 0 },
  show: { y: 0, opacity: 1 },
};

function HorizontalScrollSection({ title, subtitle, description, items, id, bgImage, bgVideo }) {
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
        {bgVideo ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster="/videos/spiritual-poster.jpg"
            className="optimized-video w-full h-full object-cover"
          >
            <source src="/videos/spiritual-bg.webm" type="video/webm" />
            <source src="/videos/spiritual-bg.mp4" type="video/mp4" />
          </video>
        ) : (
          <img src={bgImage} alt="" className="w-full h-full object-cover" />
        )}
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
                View All Trips
              </Button>
            </Link>
          </div>

          {items.map((item) => (
            <Link
              key={item.id}
              href={`/trips/${item.slug || item.id}`}
              className="scroll-card w-[280px] md:w-[320px] h-[400px] md:h-[440px] shrink-0 rounded-2xl overflow-hidden group relative cursor-pointer block"
            >
              <img
                src={resolveTripCardImage(item.image)}
                alt={item.name}
                className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 group-hover:opacity-0" />
              <div className="absolute bottom-0 left-0 right-0 p-5 transition-opacity duration-300 group-hover:opacity-0">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-amber-400">
                  {item.tagline}
                </p>
                <h3 className="text-2xl font-semibold text-white mt-1">{item.name}</h3>
                <p className="text-lg font-bold text-white mt-2">{item.price}</p>
              </div>
              <div className="absolute inset-0 bg-black/85 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-5">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-amber-400">
                  {item.tagline}
                </p>
                <h3 className="text-2xl font-semibold text-white mt-1">{item.name}</h3>
                <p className="text-sm leading-relaxed text-zinc-300 mt-3">{item.description}</p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {(item.highlights || []).map((tag) => (
                    <span
                      key={tag}
                      className="text-[9px] font-medium bg-white/10 text-white px-2 py-1 rounded-full border border-white/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/20">
                  <div>
                    <p className="text-[10px] text-zinc-400">{item.duration}</p>
                    <p className="text-xl font-bold text-white">{item.price}</p>
                  </div>
                  <span className="bg-white text-zinc-900 text-[10px] font-semibold px-4 py-2 rounded-lg">
                    View Details →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomePage({ spiritualJourneys, friendsGetaway }) {
  return (
    <div className="bg-white text-zinc-900">
      <OmLoader />

      <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-zinc-950">
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster="/videos/hero-poster.jpg"
            className="optimized-video w-full h-full object-cover"
          >
            <source src="/videos/hero-bg.webm" type="video/webm" />
            <source src="/videos/hero-bg.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/45 to-black/70" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 pt-16">
          <motion.h1
            initial="hidden"
            animate="show"
            transition={{ staggerChildren: 0.05, delayChildren: 0.25 }}
            className="text-4xl sm:text-5xl md:text-6xl font-semibold text-white leading-[1.1] tracking-tight"
          >
            {headlineLines.map((line, li) => (
              <span key={li} className="block overflow-hidden">
                {line.split(" ").map((wordText, wi) => (
                  <span key={wi} className="inline-block overflow-hidden align-bottom">
                    <motion.span
                      variants={wordVariants}
                      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                      className="inline-block pr-[0.25em]"
                    >
                      {wordText}
                    </motion.span>
                  </span>
                ))}
              </span>
            ))}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="mt-6 text-base sm:text-lg text-zinc-300 max-w-2xl mx-auto leading-relaxed"
          >
            We craft spiritual pilgrimages, friend getaways, family holidays, and honeymoon
            packages with hands-on support — no bots, no automation, just real people helping you
            travel better.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.75 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <Link href="/trips">
              <Button className="group bg-white text-zinc-900 hover:bg-zinc-100 text-sm font-semibold px-6 py-3 rounded-xl">
                Explore Trips
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
        title="Spiritual Journeys"
        subtitle="Pilgrimage Routes"
        description="Slow, reverent, logistics-heavy routes designed for darshan, family comfort, and trusted pacing."
        items={spiritualJourneys}
        bgVideo="/videos/spiritual-bg.mp4"
      />

      <HorizontalScrollSection
        id="getaway"
        title="Friends Getaway"
        subtitle="Group Adventures"
        description="Mood-led escapes for friend groups who want scenery, stories, and high-energy shared memories."
        items={friendsGetaway}
        bgImage="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2000&q=80"
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
                  Browse Trips
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
              Manual travel planning desk for spiritual journeys, friend getaways, family holidays,
              and honeymoon packages.
            </p>
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
