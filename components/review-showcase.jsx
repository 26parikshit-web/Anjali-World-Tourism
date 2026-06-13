"use client";

import { useState } from "react";
import { ParallaxScroll } from "@/components/ui/parallax-scroll";
import { Star, X } from "lucide-react";

export function ReviewShowcase({ items }) {
  const [selectedId, setSelectedId] = useState(null);

  const selectedItem = items.find((item) => item.id === selectedId);

  const photoWallData = items.map((item) => ({
    id: item.id,
    src: item.thumbnail || item.image,
    alt: item.name,
    label: `${item.name} - ${item.trip}`,
    resourceType: item.resourceType || "image",
  }));

  if (items.length === 0) return null;

  return (
    <div className="relative">
      <ParallaxScroll
        items={photoWallData}
        selectedId={selectedId}
        onSelect={setSelectedId}
        className="rounded-2xl border border-zinc-200 bg-white"
      />

      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => setSelectedId(null)}
        >
          <div
            className="relative w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedId(null)}
              className="absolute right-4 top-4 z-10 rounded-full bg-zinc-100 p-2 text-zinc-600 transition hover:bg-zinc-200 hover:text-zinc-900"
            >
              <X className="h-4 w-4" />
            </button>

            {selectedItem.resourceType === "video" ? (
              <video
                src={selectedItem.mediaUrl || selectedItem.image}
                controls
                playsInline
                className="h-56 w-full rounded-xl object-cover bg-zinc-950"
              />
            ) : (
              <img
                src={selectedItem.mediaUrl || selectedItem.image}
                alt={selectedItem.name}
                className="h-56 w-full rounded-xl object-cover"
              />
            )}

            <div className="mt-4">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                  {selectedItem.trip}
                </p>
                {selectedItem.rating && (
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < selectedItem.rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-zinc-200"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              <h2 className="mt-2 text-xl font-semibold text-zinc-900">
                {selectedItem.name}
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                {selectedItem.designation}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-zinc-600">
                &quot;{selectedItem.quote}&quot;
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
