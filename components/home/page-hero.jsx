"use client";

import { Reveal } from "@/components/home/reveal";

/**
 * Fixed, professional page header. Motion is limited to a single
 * entrance reveal — the text itself stays stable and readable.
 */
export function PageHero({
  eyebrow,
  title,
  description,
  action,
  dark = false,
  className = "",
}) {
  return (
    <Reveal
      className={`rounded-2xl border p-5 sm:p-6 ${
        dark
          ? "border-white/10 bg-zinc-900 text-white"
          : "border-zinc-200 bg-zinc-50"
      } ${className}`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <p
            className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${
              dark ? "text-amber-400" : "text-amber-600"
            }`}
          >
            {eyebrow}
          </p>
          <h1
            className={`mt-2 text-2xl font-semibold leading-tight sm:text-3xl ${
              dark ? "text-white" : "text-zinc-900"
            }`}
          >
            {title}
          </h1>
          {description && (
            <p
              className={`mt-2 text-sm leading-relaxed ${
                dark ? "text-zinc-300" : "text-zinc-600"
              }`}
            >
              {description}
            </p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </Reveal>
  );
}
