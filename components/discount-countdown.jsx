"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

function formatCountdown(ms) {
  if (ms <= 0) return "00:00:00";
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds]
    .map((n) => String(n).padStart(2, "0"))
    .join(":");
}

/**
 * Display-only countdown. Discount authority lives on the server (quote + payment APIs).
 */
export function DiscountCountdown({ endsAt, onExpire, className }) {
  const [remainingMs, setRemainingMs] = useState(() => {
    if (!endsAt) return 0;
    return Math.max(0, new Date(endsAt).getTime() - Date.now());
  });

  useEffect(() => {
    if (!endsAt) return undefined;

    const tick = () => {
      const next = Math.max(0, new Date(endsAt).getTime() - Date.now());
      setRemainingMs(next);
      if (next === 0) onExpire?.();
    };

    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [endsAt, onExpire]);

  if (!endsAt || remainingMs <= 0) return null;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full bg-amber-400/15 px-3 py-1 text-xs font-medium text-amber-700",
        className
      )}
    >
      <span className="uppercase tracking-wide">Offer ends in</span>
      <span className="font-mono font-semibold tabular-nums">{formatCountdown(remainingMs)}</span>
    </div>
  );
}
