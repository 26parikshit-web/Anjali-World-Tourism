"use client";
import { useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";

export const ParallaxScroll = ({
  items,
  images,
  className,
  onSelect,
  selectedId
}) => {
  const gridRef = useRef(null);
  const { scrollYProgress } = useScroll({
    container: gridRef,
    offset: ["start start", "end start"],
  });

  const translateFirst = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const translateSecond = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const translateThird = useTransform(scrollYProgress, [0, 1], [0, -200]);

  const normalizedItems =
    items ??
    images.map((src, index) => ({
      id: `${index}`,
      src,
      alt: "thumbnail"
    }));

  const third = Math.ceil(normalizedItems.length / 3);

  const firstPart = normalizedItems.slice(0, third);
  const secondPart = normalizedItems.slice(third, 2 * third);
  const thirdPart = normalizedItems.slice(2 * third);

  const renderCard = (item, index, motionStyle, keyPrefix) => {
    const isSelected = selectedId && item.id === selectedId;
    const isVideo = item.resourceType === "video";

    return (
      <motion.button
        type="button"
        style={{ y: motionStyle }}
        key={`${keyPrefix}${index}`}
        onClick={() => onSelect?.(item.id)}
        className={cn(
          "group relative overflow-hidden rounded-xl border bg-white text-left shadow-sm transition focus:outline-none",
          isSelected
            ? "border-zinc-900 ring-2 ring-zinc-900/10"
            : "border-zinc-200 hover:border-zinc-300 hover:shadow-md"
        )}
      >
        <img
          src={item.src}
          className="h-48 w-full object-cover object-center transition duration-300 group-hover:scale-105"
          height="400"
          width="400"
          alt={item.alt ?? "thumbnail"}
        />
        {isVideo && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/20">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-zinc-900 shadow-sm">
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent p-3">
          <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/80">
            {isVideo ? "Tap to watch" : "Tap to read"}
          </p>
          <p className="mt-1 text-xs font-medium text-white">{item.label ?? item.alt}</p>
        </div>
      </motion.button>
    );
  };

  return (
    <div
      className={cn("h-[40rem] w-full overflow-y-auto", className)}
      ref={gridRef}
    >
      <div className="mx-auto grid max-w-4xl grid-cols-1 items-start gap-4 px-4 py-8 md:grid-cols-2 lg:grid-cols-3">
        <div className="grid gap-4">
          {firstPart.map((item, idx) => renderCard(item, idx, translateFirst, "grid-1"))}
        </div>
        <div className="grid gap-4">
          {secondPart.map((item, idx) => renderCard(item, idx, translateSecond, "grid-2"))}
        </div>
        <div className="grid gap-4">
          {thirdPart.map((item, idx) => renderCard(item, idx, translateThird, "grid-3"))}
        </div>
      </div>
    </div>
  );
};
