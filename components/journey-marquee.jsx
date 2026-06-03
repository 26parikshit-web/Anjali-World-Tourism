import Link from "next/link";
import { Button } from "@/components/ui/button";

export function JourneyMarquee({ title, description, items, reverse = false }) {
  const reel = [...items, ...items];

  return (
    <section className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 sm:p-6">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Featured Journeys
          </p>
          <h2 className="mt-2 text-xl font-semibold leading-tight text-zinc-900 sm:text-2xl">
            {title}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600">{description}</p>
        </div>

        <Link href="/trips">
          <Button
            variant="outline"
            className="text-xs font-medium border-zinc-300 text-zinc-700 hover:bg-zinc-100 rounded-lg px-4 py-2"
          >
            View all trips
          </Button>
        </Link>
      </div>

      <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]">
        <div
          className={`flex w-max gap-4 py-2 [animation:marquee_34s_linear_infinite] ${reverse ? "[animation-direction:reverse]" : ""}`}
        >
          {reel.map((item, index) => (
            <article
              key={`${item.name}-${index}`}
              className="flex w-64 shrink-0 flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm"
            >
              <img src={item.image} alt={item.name} className="h-32 w-full object-cover" />
              <div className="space-y-2 p-4">
                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                  Curated escape
                </p>
                <h3 className="text-base font-semibold text-zinc-900">{item.name}</h3>
                <p className="text-xs leading-relaxed text-zinc-600">{item.blurb}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
