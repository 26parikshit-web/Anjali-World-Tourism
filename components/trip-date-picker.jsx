"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatFullDate, getDefaultBookingDate } from "@/lib/trip-booking";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function isSameDay(a, b) {
  return (
    a &&
    b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function startOfDay(date) {
  const nextDate = new Date(date);
  nextDate.setHours(0, 0, 0, 0);
  return nextDate;
}

function buildCalendarDays(displayMonth) {
  const firstDay = startOfMonth(displayMonth);
  const daysInMonth = new Date(
    displayMonth.getFullYear(),
    displayMonth.getMonth() + 1,
    0
  ).getDate();
  const leadingBlanks = firstDay.getDay();

  return [
    ...Array.from({ length: leadingBlanks }, () => null),
    ...Array.from(
      { length: daysInMonth },
      (_, index) => new Date(displayMonth.getFullYear(), displayMonth.getMonth(), index + 1)
    ),
  ];
}

export function TripDatePicker({
  selectedDate,
  onSelect,
  compact = false,
  className = "",
}) {
  const [displayMonth, setDisplayMonth] = useState(() =>
    startOfMonth(selectedDate || getDefaultBookingDate())
  );

  const calendarDays = useMemo(
    () => buildCalendarDays(displayMonth),
    [displayMonth]
  );

  const today = getDefaultBookingDate();
  const todayMonth = startOfMonth(today);
  const canGoBack = displayMonth > todayMonth;
  const selected = selectedDate || today;

  const moveMonth = (direction) => {
    setDisplayMonth(
      (current) => new Date(current.getFullYear(), current.getMonth() + direction, 1)
    );
  };

  return (
    <div
      className={cn(
        "rounded-2xl border border-zinc-200 bg-white p-3.5 shadow-sm",
        compact ? "space-y-3" : "space-y-4 sm:p-4",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-600">
            <CalendarDays className="h-3.5 w-3.5" />
            Departure date
          </p>
          <h3 className="mt-1 text-sm font-semibold text-zinc-900">
            Choose your travel date
          </h3>
        </div>
        <div className="flex shrink-0 items-center rounded-full border border-zinc-200 bg-zinc-50 p-1">
          <button
            type="button"
            onClick={() => moveMonth(-1)}
            disabled={!canGoBack}
            className="flex h-7 w-7 items-center justify-center rounded-full text-zinc-500 transition hover:bg-white hover:text-zinc-900 disabled:pointer-events-none disabled:opacity-30"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => moveMonth(1)}
            className="flex h-7 w-7 items-center justify-center rounded-full text-zinc-500 transition hover:bg-white hover:text-zinc-900"
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="rounded-xl bg-zinc-950 px-3 py-2.5 text-white">
        <p className="text-xs font-semibold">
          {MONTHS[displayMonth.getMonth()]} {displayMonth.getFullYear()}
        </p>
        <p className="mt-0.5 text-[11px] text-zinc-400">
          Selected: {selected ? formatFullDate(selected) : "Pick a travel date"}
        </p>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold uppercase text-zinc-400">
        {WEEKDAYS.map((day, index) => (
          <span key={`${day}-${index}`}>{day}</span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((date, index) => {
          if (!date) {
            return <span key={`blank-${index}`} className="aspect-square" />;
          }

          const availableDate = startOfDay(date);
          const isAvailable = availableDate >= today;
          const isSelected = selected && isSameDay(date, selected);

          return (
            <button
              key={date.toISOString()}
              type="button"
              onClick={() => isAvailable && onSelect?.(availableDate)}
              disabled={!isAvailable}
              className={cn(
                "relative flex aspect-square min-h-9 items-center justify-center rounded-xl text-sm font-semibold transition",
                isSelected
                  ? "bg-zinc-950 text-white shadow-[0_10px_24px_-12px_rgba(0,0,0,0.75)]"
                    : isAvailable
                    ? "text-zinc-900 hover:bg-amber-50 hover:text-zinc-950"
                    : "text-zinc-300"
              )}
              aria-label={
                isAvailable
                  ? `Select ${formatFullDate(availableDate)}`
                  : `${date.getDate()} is unavailable`
              }
            >
              {date.getDate()}
              {isSameDay(date, today) && (
                <span
                  className={cn(
                    "absolute bottom-1 h-1 w-1 rounded-full",
                    isSelected ? "bg-amber-300" : "bg-amber-500"
                  )}
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between gap-3 rounded-xl border border-dashed border-zinc-200 bg-zinc-50 px-3 py-2">
        <span className="text-xs text-zinc-500">Every future date is available for booking.</span>
        <span className="h-2 w-2 shrink-0 rounded-full bg-amber-400" />
      </div>
    </div>
  );
}
