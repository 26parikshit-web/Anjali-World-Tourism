"use client";

import { useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Button } from "@/components/ui/button";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const spiritualJourneys = [
  {
    id: "char-dham",
    slug: "char-dham-yatra",
    name: "Char Dham Yatra",
    tagline: "The ultimate pilgrimage circuit",
    description: "Helicopter options, stay planning, and senior-friendly route pacing across Yamunotri, Gangotri, Kedarnath & Badrinath.",
    duration: "10 Days / 9 Nights",
    price: "₹36,000",
    image: "/images/chaarDham.webp",
    highlights: ["Helicopter Option", "Senior Support", "Temple Timing"]
  },
  {
    id: "jyotirlinga",
    slug: "12-jyotirlinga",
    name: "12 Jyotirlinga",
    tagline: "Sacred circuit across India",
    description: "A multi-state sacred route with smooth sequencing and temple-focused pacing across all 12 divine shrines.",
    duration: "14 Days / 13 Nights",
    price: "₹49,000",
    image: "/images/jyoti.jpg",
    highlights: ["Multi-City", "Manual Routing", "Premium Stays"]
  },
  {
    id: "panchkedar",
    slug: "panchkedar",
    name: "Panchkedar",
    tagline: "High-altitude devotion",
    description: "A serious mountain yatra balanced with quality stays and trek-side logistics in the Garhwal Himalayas.",
    duration: "8 Days / 7 Nights",
    price: "₹31,500",
    image: "/images/panchkedar.webp",
    highlights: ["Trek Support", "Alpine Camps", "Guide Included"]
  }
];

const friendsGetaway = [
  {
    id: "spiti",
    slug: "spiti-valley",
    name: "Spiti Valley",
    tagline: "Road-trip through moonland",
    description: "High-altitude drives, moonland landscapes, and boutique campfire nights with your crew.",
    duration: "7 Days / 6 Nights",
    price: "₹24,000",
    image: "https://images.unsplash.com/photo-1518002054494-3a6f94352e9d?auto=format&fit=crop&w=1200&q=80",
    highlights: ["Road Trip", "Stargazing", "Café Stops"]
  },
  {
    id: "goa",
    slug: "goa-getaway",
    name: "Goa",
    tagline: "Sun, sand & stories",
    description: "Beach clubs, sunset sail add-ons, and flexible villa packages for the perfect group escape.",
    duration: "4 Days / 3 Nights",
    price: "₹16,500",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80",
    highlights: ["Beach Villa", "Nightlife", "Sunset Cruise"]
  },
  {
    id: "varkala",
    slug: "varkala",
    name: "Varkala",
    tagline: "Kerala's cliffside charm",
    description: "Cliffside sunsets, cafés, and a calmer Kerala coast rhythm for mindful getaways.",
    duration: "5 Days / 4 Nights",
    price: "₹18,000",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    highlights: ["Cliffside", "Ayurveda", "Slow Travel"]
  },
  {
    id: "tawang",
    slug: "tawang",
    name: "Tawang",
    tagline: "Northeast serenity",
    description: "Monastery views, winding mountain roads, and rare Northeast stillness in Arunachal.",
    duration: "6 Days / 5 Nights",
    price: "₹27,500",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    highlights: ["Monastery", "Scenic Drive", "Permits Included"]
  },
  {
    id: "kasol",
    slug: "kasol",
    name: "Kasol",
    tagline: "Parvati valley vibes",
    description: "River trails, café hopping, and easy group energy in the Himachal hills.",
    duration: "4 Days / 3 Nights",
    price: "₹14,800",
    image: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=1200&q=80",
    highlights: ["Trekking", "Café Culture", "Weekend Trip"]
  }
];

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
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} id={id} className="h-screen w-full overflow-hidden relative">
      {/* Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {bgVideo ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src={bgVideo} type="video/mp4" />
          </video>
        ) : (
          <img
            src={bgImage}
            alt=""
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/50" />
      </div>
      <div className="h-full flex items-center relative z-10">
        <div
          ref={scrollRef}
          className="flex items-center gap-6 px-8 md:px-16"
          style={{ width: "max-content" }}
        >
          {/* Section Header Card */}
          <div className="w-[320px] md:w-[380px] shrink-0 pr-8">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-400">
              {subtitle}
            </p>
            <h2 className="mt-2 text-3xl md:text-4xl font-semibold text-white leading-tight">
              {title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-300">
              {description}
            </p>
            <Link href="/trips">
              <Button className="mt-4 bg-white text-zinc-900 hover:bg-zinc-100 text-xs font-semibold px-4 py-2 rounded-lg">
                View All Trips
              </Button>
            </Link>
          </div>

          {/* Trip Cards - Image with hover overlay */}
          {items.map((item) => (
            <Link
              key={item.id}
              href={`/trips/${item.slug || item.id}`}
              className="scroll-card w-[280px] md:w-[320px] h-[400px] md:h-[440px] shrink-0 rounded-2xl overflow-hidden group relative cursor-pointer block"
            >
              {/* Main Image */}
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
              />
              
              {/* Default Overlay - Title & Price */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 group-hover:opacity-0" />
              <div className="absolute bottom-0 left-0 right-0 p-5 transition-opacity duration-300 group-hover:opacity-0">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-amber-400">
                  {item.tagline}
                </p>
                <h3 className="text-2xl font-semibold text-white mt-1">
                  {item.name}
                </h3>
                <p className="text-lg font-bold text-white mt-2">{item.price}</p>
              </div>

              {/* Hover Overlay - Full Details */}
              <div className="absolute inset-0 bg-black/85 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-5">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-amber-400">
                  {item.tagline}
                </p>
                <h3 className="text-2xl font-semibold text-white mt-1">
                  {item.name}
                </h3>
                <p className="text-sm leading-relaxed text-zinc-300 mt-3">
                  {item.description}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {item.highlights.map((tag) => (
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

export default function HomePage() {
  return (
    <div className="bg-white text-zinc-900">
      {/* Hero Section with Video Background */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="https://videos.pexels.com/video-files/1409899/1409899-uhd_2560_1440_25fps.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/50" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6 px-4 sm:px-6 lg:px-8 pt-16">
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-amber-400">
            Manual Travel Planning Desk
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold text-white leading-[1.1] tracking-tight">
            Journeys that feel editorial on screen, deeply human in planning.
          </h1>
          <p className="text-base sm:text-lg text-zinc-300 max-w-2xl mx-auto leading-relaxed">
            We craft spiritual pilgrimages, friend getaways, family holidays, and honeymoon packages with hands-on support — no bots, no automation, just real people helping you travel better.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <Link href="/trips">
              <Button className="bg-white text-zinc-900 hover:bg-zinc-100 text-sm font-semibold px-6 py-3 rounded-xl">
                Explore Trips
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 text-sm font-semibold px-6 py-3 rounded-xl">
                Request Custom Itinerary
              </Button>
            </Link>
          </div>
          <div className="pt-8 flex items-center justify-center gap-8 text-xs text-zinc-300">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">500+</p>
              <p>Trips Planned</p>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center">
              <p className="text-2xl font-bold text-white">4.9</p>
              <p>Traveler Rating</p>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center">
              <p className="text-2xl font-bold text-white">24/7</p>
              <p>Manual Support</p>
            </div>
          </div>
          <div className="pt-12 animate-bounce">
            <p className="text-[10px] uppercase tracking-widest text-white/60">Scroll to explore</p>
            <div className="mt-2 w-px h-8 bg-white/40 mx-auto" />
          </div>
        </div>
      </section>

      {/* Spiritual Journeys - Horizontal Scroll */}
      <HorizontalScrollSection
        id="spiritual"
        title="Spiritual Journeys"
        subtitle="Pilgrimage Routes"
        description="Slow, reverent, logistics-heavy routes designed for darshan, family comfort, and trusted pacing."
        items={spiritualJourneys}
        bgVideo="/videos/spiritual-bg.mp4"
      />

      {/* Friends Getaway - Horizontal Scroll */}
      <HorizontalScrollSection
        id="getaway"
        title="Friends Getaway"
        subtitle="Group Adventures"
        description="Mood-led escapes for friend groups who want scenery, stories, and high-energy shared memories."
        items={friendsGetaway}
        bgImage="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2000&q=80"
      />

      {/* Footer */}
      <footer className="border-t border-zinc-200 bg-zinc-50">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-8 text-xs text-zinc-500 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <p className="font-semibold uppercase tracking-[0.15em] text-zinc-900">
              Anjali World Tourism
            </p>
            <p className="mt-2 max-w-md text-zinc-500">
              Manual travel planning desk for spiritual journeys, friend getaways, family holidays, and honeymoon packages.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link href="/" className="hover:text-zinc-900 transition-colors">Home</Link>
            <Link href="/trips" className="hover:text-zinc-900 transition-colors">Trips</Link>
            <Link href="/reviews" className="hover:text-zinc-900 transition-colors">Reviews</Link>
            <Link href="/contact" className="hover:text-zinc-900 transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
