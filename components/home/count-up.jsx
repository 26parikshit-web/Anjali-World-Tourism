"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";

/**
 * Counts from 0 -> `value` once when scrolled into view.
 * Renders a stable, professional number (no layout shift): the final value
 * is reserved via tabular-nums so the surrounding layout never jumps.
 */
export function CountUp({ value, duration = 1600, prefix = "", suffix = "", decimals = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;

    let raf;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(value * eased);
      if (progress < 1) raf = requestAnimationFrame(tick);
      else setDisplay(value);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration]);

  const formatted = display.toLocaleString("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
