"use client";

import Link from "next/link";
import { ArrowRight, Plane } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/home/reveal";

export function CtaBand({
  eyebrow = "Need something bespoke?",
  title = "Build a route around your dates, pace, and budget.",
  description,
  primaryHref = "/trips",
  primaryLabel = "Browse Trips",
  secondaryHref = "https://cal.com/varsha-tourism-ndqbdf/15min",
  secondaryLabel = "Book a Meeting",
}) {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 p-5 sm:p-6">
      <div className="absolute inset-0 overflow-hidden mix-blend-screen pointer-events-none">
        <div className="aurora-blob aurora-a left-[5%] top-[-40%] h-[36vw] w-[36vw] bg-amber-500/25" />
        <div className="aurora-blob aurora-b right-[-5%] bottom-[-50%] h-[38vw] w-[38vw] bg-indigo-500/25" />
      </div>
      <Reveal className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-lg">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-400">
            {eyebrow}
          </p>
          <h2 className="mt-1 text-xl font-semibold leading-tight text-white sm:text-2xl">
            {title}
          </h2>
          {description && (
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">{description}</p>
          )}
        </div>
        <div className="flex flex-wrap gap-2 shrink-0">
          <Link href={primaryHref}>
            <Button className="group bg-white text-zinc-900 hover:bg-zinc-100 text-xs font-semibold px-4 py-2 rounded-lg">
              {primaryLabel}
              <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </Link>
          <a href={secondaryHref} target="_blank" rel="noopener noreferrer">
            <Button
              variant="outline"
              className="gap-1.5 border-white/30 text-white hover:bg-white/10 text-xs font-semibold px-4 py-2 rounded-lg"
            >
              <Plane className="h-3.5 w-3.5" />
              {secondaryLabel}
            </Button>
          </a>
        </div>
      </Reveal>
    </section>
  );
}
