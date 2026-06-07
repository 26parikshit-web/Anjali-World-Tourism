"use client";

import Link from "next/link";
import { Mail, Phone, Calendar, ArrowRight } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { ContactTestimonials } from "@/components/contact-testimonials";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/home/reveal";
import { CtaBand } from "@/components/home/cta-band";

export function ContactPageView({ contactDetails, contactTestimonials }) {
  const contactItems = [
    {
      icon: Mail,
      label: "Email",
      value: contactDetails.email,
      href: `mailto:${contactDetails.email}`,
    },
    {
      icon: Phone,
      label: "Phone",
      value: contactDetails.phone,
      href: `tel:${contactDetails.phone}`,
    },
    {
      icon: Calendar,
      label: "Schedule a Call",
      value: "Book on Cal.com",
      href: contactDetails.calLink,
      external: true,
    },
  ];

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 pb-16 pt-20 sm:px-6 lg:px-8">
      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)] lg:items-start">
        <Reveal>
          <ContactForm />
        </Reveal>

        <Reveal delay={0.1} className="space-y-4">
          <aside className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 sm:p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-600">
              Contact Details
            </p>
            <h1 className="mt-2 text-2xl font-semibold leading-tight text-zinc-900 sm:text-3xl">
              Reach the desk
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600">
              A real planner responds — no bots, no auto-replies. We typically reply within 24 hours.
            </p>

            <div className="mt-6 space-y-4">
              {contactItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="rounded-xl border border-zinc-200 bg-white p-4 transition-colors hover:border-amber-200"
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-white">
                        <Icon className="h-4 w-4" />
                      </div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-500">
                        {item.label}
                      </p>
                    </div>
                    {item.external ? (
                      <Link
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-block"
                      >
                        <Button
                          variant="outline"
                          className="text-xs font-medium border-zinc-300 text-zinc-700 hover:bg-zinc-100 rounded-lg px-4 py-2"
                        >
                          {item.value}
                          <ArrowRight className="ml-1 h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    ) : (
                      <a
                        href={item.href}
                        className="mt-2 block text-base font-medium text-zinc-900 transition-colors hover:text-amber-700"
                      >
                        {item.value}
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </aside>
        </Reveal>
      </section>

      <Reveal>
        <section className="rounded-2xl border border-zinc-200 bg-white p-4 sm:p-5">
          <div className="mb-4 px-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-600">
              What travelers say
            </p>
            <h2 className="mt-1 text-lg font-semibold text-zinc-900">
              Trusted by people who travel with us
            </h2>
          </div>
          <ContactTestimonials items={contactTestimonials} />
        </section>
      </Reveal>

      <CtaBand
        eyebrow="Prefer browsing first?"
        title="Explore curated routes before you reach out."
        primaryHref="/trips"
        primaryLabel="View All Trips"
      />
    </div>
  );
}
