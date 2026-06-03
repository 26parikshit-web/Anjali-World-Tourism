import Link from "next/link";
import { ContactForm } from "@/components/contact-form";
import { ContactTestimonials } from "@/components/contact-testimonials";
import { contactDetails, contactTestimonials } from "@/lib/site-data";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pb-16 pt-20 sm:px-6 lg:px-8">
      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)] lg:items-start">
        <ContactForm />

        <aside className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 sm:p-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Contact Details
          </p>
          <h1 className="mt-2 text-2xl font-semibold leading-tight text-zinc-900 sm:text-3xl">
            Reach the desk
          </h1>

          <div className="mt-6 space-y-4 text-sm text-zinc-600">
            <div>
              <p className="text-[10px] uppercase tracking-[0.15em] text-zinc-500">
                Email
              </p>
              <a
                href={`mailto:${contactDetails.email}`}
                className="mt-1 block text-base font-medium text-zinc-900 hover:text-zinc-600 transition-colors"
              >
                {contactDetails.email}
              </a>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-[0.15em] text-zinc-500">
                Phone
              </p>
              <a
                href={`tel:${contactDetails.phone}`}
                className="mt-1 block text-base font-medium text-zinc-900 hover:text-zinc-600 transition-colors"
              >
                {contactDetails.phone}
              </a>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-[0.15em] text-zinc-500">
                Schedule a Call
              </p>
              <Link
                href={contactDetails.calLink}
                target="_blank"
                rel="noreferrer"
              >
                <Button
                  variant="outline"
                  className="mt-2 text-xs font-medium border-zinc-300 text-zinc-700 hover:bg-zinc-100 rounded-lg px-4 py-2"
                >
                  Book on Cal.com
                </Button>
              </Link>
            </div>
          </div>
        </aside>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-4">
        <div className="mb-2 px-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
            What travelers say
          </p>
        </div>
        <ContactTestimonials items={contactTestimonials} />
      </section>
    </div>
  );
}
