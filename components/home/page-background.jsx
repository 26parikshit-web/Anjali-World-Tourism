"use client";

/**
 * Ambient background for non-home public pages.
 * Decorative only — fixed layer, pointer-events none, GPU-composited motion.
 * Mobile uses a brighter wash; desktop keeps the original subtle palette.
 */
export function PageBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Warm base wash — mobile bright; desktop original */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50/95 via-orange-50/70 to-amber-100/85 md:from-zinc-50 md:via-white md:to-amber-50/40" />

      {/* Fine dot grid for depth */}
      <div className="page-bg-grid absolute inset-0 opacity-90 md:opacity-60" />

      {/* Slow drifting colour fields */}
      <div className="page-aurora-blob page-aurora-a left-[-15%] top-[-20%] h-[55vw] w-[55vw] bg-amber-300/65 md:bg-amber-200/50" />
      <div className="page-aurora-blob page-aurora-b right-[-10%] top-[15%] h-[45vw] w-[45vw] bg-rose-200/70 md:bg-rose-100/60" />
      <div className="page-aurora-blob page-aurora-a left-[25%] bottom-[-25%] h-[50vw] w-[50vw] bg-indigo-200/60 md:bg-indigo-100/50" />

      {/* Soft vignette so edges feel grounded */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(255,255,255,0.25)_100%)] md:bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(255,255,255,0.55)_100%)]" />
    </div>
  );
}
