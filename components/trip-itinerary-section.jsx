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
    <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-amber-50/60">
      <button
        type="button"
        onClick={() => setSectionOpen((o) => !o)}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
      >
        <h2 className="text-xl font-semibold text-zinc-900">Trip Itinerary</h2>
        {sectionOpen ? (
          <ChevronUp className="h-5 w-5 text-zinc-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-zinc-500" />
        )}
      </button>

      {sectionOpen && (
        <div className="space-y-5 px-5 pb-5">
          {/* Day selector pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            <button
              type="button"
              onClick={handleShowAll}
              className={cn(
                "shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition-colors",
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
                    <span className="flex flex-col items-center justify-center bg-zinc-900 px-2.5 py-2 text-[10px] font-bold leading-tight text-white">
                      <span>{pill.month}</span>
                      <span className="text-sm">{pill.day}</span>
                    </span>
                  )}
                  <span
                    className={cn(
                      "flex items-center px-3 py-2 text-xs font-semibold",
                      isSelected ? "text-zinc-900" : "text-zinc-600"
                    )}
                  >
                    Day {day.day}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Accordion list */}
          <div className="relative space-y-0">
            {itinerary.map((day, i) => {
              const expanded = isExpanded(day.day);
              const isLast = i === itinerary.length - 1;

              return (
                <div key={day.day} className="relative flex gap-4">
                  {/* Timeline */}
                  <div className="flex flex-col items-center">
                    <button
                      type="button"
                      onClick={() => handleSelectDay(day.day)}
                      className={cn(
                        "z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[10px] font-bold transition-colors",
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
                  <div className="min-w-0 flex-1 pb-6">
                    <button
                      type="button"
                      onClick={() => handleSelectDay(day.day)}
                      className="flex w-full items-start justify-between gap-3 text-left"
                    >
                      <h3 className="text-base font-semibold text-zinc-900">{day.title}</h3>
                      <ChevronDown
                        className={cn(
                          "mt-0.5 h-4 w-4 shrink-0 text-zinc-400 transition-transform",
                          expanded && "rotate-180"
                        )}
                      />
                    </button>
                    {expanded && day.description && (
                      <p className="mt-2 text-sm leading-relaxed text-zinc-600">{day.description}</p>
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
