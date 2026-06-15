"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import {
  cloudinaryGalleryUrl,
  cloudinaryLightboxUrl,
  cloudinaryVideoUrl,
} from "@/lib/cloudinary";
import { normalizeGalleryItem } from "@/lib/trip-media";
import { ModalPortal, MODAL_LAYER_CLASS } from "@/components/modal-portal";
import { cn } from "@/lib/utils";

function GalleryVideo({ src, className, hoverPreview = false }) {
  const videoSrc = cloudinaryVideoUrl(src);

  return (
    <video
      src={videoSrc}
      className={className}
      muted
      loop
      playsInline
      controls={!hoverPreview}
      onMouseEnter={hoverPreview ? (e) => e.currentTarget.play() : undefined}
      onMouseLeave={
        hoverPreview
          ? (e) => {
              e.currentTarget.pause();
              e.currentTarget.currentTime = 0;
            }
          : undefined
      }
    />
  );
}

export function TripGallery({ items = [] }) {
  const gallery = items.map(normalizeGalleryItem).filter(Boolean);
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    if (activeIndex === null) return;
    const onKey = (e) => {
      if (e.key === "Escape") setActiveIndex(null);
      if (e.key === "ArrowRight") setActiveIndex((i) => (i + 1) % gallery.length);
      if (e.key === "ArrowLeft")
        setActiveIndex((i) => (i - 1 + gallery.length) % gallery.length);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [activeIndex, gallery.length]);

  if (gallery.length === 0) return null;

  const active = activeIndex !== null ? gallery[activeIndex] : null;

  return (
    <>
      <section>
        <h2 className="mb-4 text-xl font-semibold text-zinc-900">Gallery</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {gallery.map((item, i) => (
            <button
              key={`${item.src}-${i}`}
              type="button"
              onClick={() => setActiveIndex(i)}
              className="group relative aspect-[4/3] overflow-hidden rounded-xl text-left"
            >
              {item.type === "video" ? (
                <GalleryVideo
                  src={item.src}
                  className="h-full w-full object-cover"
                  hoverPreview
                />
              ) : (
                <img
                  src={cloudinaryGalleryUrl(item.src)}
                  alt={item.alt || `Gallery image ${i + 1}`}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              )}
              <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />
              {item.type === "video" && (
                <div className="absolute right-2 top-2 rounded-full bg-black/50 px-2 py-1 text-[9px] uppercase tracking-wide text-white">
                  Video
                </div>
              )}
            </button>
          ))}
        </div>
      </section>

      {active && (
        <ModalPortal>
          <div
            className={cn(
              "fixed inset-0 flex items-center justify-center bg-black/90 p-4",
              MODAL_LAYER_CLASS
            )}
            onClick={() => setActiveIndex(null)}
          >
          <button
            type="button"
            onClick={() => setActiveIndex(null)}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            aria-label="Close gallery"
          >
            <X className="h-5 w-5" />
          </button>

          <div
            className="relative max-h-[85vh] w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            {active.type === "video" ? (
              <GalleryVideo
                src={active.src}
                className="max-h-[85vh] w-full rounded-xl object-contain"
              />
            ) : (
              <img
                src={cloudinaryLightboxUrl(active.src)}
                alt={active.alt || "Trip gallery"}
                className="max-h-[85vh] w-full rounded-xl object-contain"
              />
            )}
            {active.alt && (
              <p className="mt-3 text-center text-sm text-zinc-300">{active.alt}</p>
            )}
          </div>
        </div>
        </ModalPortal>
      )}
    </>
  );
}
