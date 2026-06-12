"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { addDays, formatDeparturePill } from "@/lib/trip-booking";
import { cn } from "@/lib/utils";

export function TripItinerarySection({ itinerary = [], departureDate }) {
  const [selectedDay, setSelectedDay] = useState(1);
  const [showAll, setShowAll] = useState(false);
  const [sectionOpen, setSectionOpen] = useState(true);

  if (itinerary.length === 0) return null;

  const isExpanded = (dayNum) => showAll || selectedDay === dayNum;

  const handleSelectDay = (dayNum) => {
    setShowAll(false);
    setSelectedDay(dayNum);
  };

  const handleShowAll = () => {
    setShowAll(true);
  };

  return (
    <section className="w-full min-w-0 max-w-full overflow-hidden rounded-2xl border border-zinc-200 bg-amber-50/60">
      <button
        type="button"
        onClick={() => setSectionOpen((o) => !o)}
        className="flex w-full items-center justify-between px-3 py-3.5 text-left sm:px-5 sm:py-4"
      >
        <h2 className="min-w-0 pr-2 text-lg font-semibold text-zinc-900 sm:text-xl">Trip Itinerary</h2>
        {sectionOpen ? (
          <ChevronUp className="h-5 w-5 text-zinc-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-zinc-500" />
        )}
      </button>

      {sectionOpen && (
        <div className="min-w-0 space-y-4 px-3 pb-4 sm:space-y-5 sm:px-5 sm:pb-5">
          {/* Day selector pills */}
          <div className="max-w-full overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch]">
            <div className="flex w-max max-w-none items-center gap-1.5 pb-1 sm:gap-2">
            <button
              type="button"
              onClick={handleShowAll}
              className={cn(
                "shrink-0 rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-colors sm:px-4 sm:py-2 sm:text-xs",
                showAll
                  ? "border-zinc-900 bg-zinc-900 text-white"
                  : "border-zinc-300 bg-white text-zinc-700 hover:border-amber-300"
              )}
            >
              All Days
            </button>

            {itinerary.map((day) => {
              const dayDate = departureDate ? addDays(departureDate, day.day - 1) : null;
              const pill = dayDate ? formatDeparturePill(dayDate) : null;
              const isSelected = !showAll && selectedDay === day.day;

              return (
                <button
                  key={day.day}
                  type="button"
                  onClick={() => handleSelectDay(day.day)}
                  className={cn(
                    "flex shrink-0 items-stretch overflow-hidden rounded-xl border transition-colors",
                    isSelected
                      ? "border-zinc-900 bg-zinc-900/5 ring-1 ring-zinc-900"
                      : "border-zinc-300 bg-white hover:border-amber-300"
                  )}
                >
                  {pill && (
                    <span className="flex flex-col items-center justify-center bg-zinc-900 px-2 py-1.5 text-[9px] font-bold leading-tight text-white sm:px-2.5 sm:py-2 sm:text-[10px]">
                      <span>{pill.month}</span>
                      <span className="text-xs sm:text-sm">{pill.day}</span>
                    </span>
                  )}
                  <span
                    className={cn(
                      "flex items-center px-2 py-1.5 text-[11px] font-semibold sm:px-3 sm:py-2 sm:text-xs",
                      isSelected ? "text-zinc-900" : "text-zinc-600"
                    )}
                  >
                    Day {day.day}
                  </span>
                </button>
              );
            })}
            </div>
          </div>

          {/* Accordion list */}
          <div className="relative min-w-0 space-y-0">
            {itinerary.map((day, i) => {
              const expanded = isExpanded(day.day);
              const isLast = i === itinerary.length - 1;

              return (
                <div key={day.day} className="relative flex min-w-0 gap-2.5 sm:gap-4">
                  {/* Timeline */}
                  <div className="flex shrink-0 flex-col items-center">
                    <button
                      type="button"
                      onClick={() => handleSelectDay(day.day)}
                      className={cn(
                        "z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold transition-colors sm:h-9 sm:w-9",
                        expanded
                          ? "bg-amber-400 text-zinc-900"
                          : "bg-amber-200 text-amber-800"
                      )}
                    >
                      {day.day}
                    </button>
                    {!isLast && (
                      <div className="w-px flex-1 border-l-2 border-dashed border-amber-300/80" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1 pb-5 sm:pb-6">
                    <button
                      type="button"
                      onClick={() => handleSelectDay(day.day)}
                      className="flex w-full min-w-0 items-start justify-between gap-2 text-left sm:gap-3"
                    >
                      <h3 className="min-w-0 break-words text-sm font-semibold text-zinc-900 sm:text-base">
                        {day.title}
                      </h3>
                      <ChevronDown
                        className={cn(
                          "mt-0.5 h-4 w-4 shrink-0 text-zinc-400 transition-transform",
                          expanded && "rotate-180"
                        )}
                      />
                    </button>
                    {expanded && day.description && (
                      <p className="mt-2 break-words text-sm leading-relaxed text-zinc-600">
                        {day.description}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
