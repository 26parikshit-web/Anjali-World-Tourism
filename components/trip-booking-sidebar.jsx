"use client";

import { useMemo, useState } from "react";
import { Calendar, CheckCircle2, MessageCircle, Plane } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  buildWhatsAppMessage,
  buildWhatsAppUrl,
  formatDeparturePill,
  getDepartureDates,
} from "@/lib/trip-booking";
import { contactDetails } from "@/lib/site-data";
import { cn } from "@/lib/utils";
import { TripBookingModal } from "@/components/trip-booking-modal";

export function TripBookingSidebar({ trip, departureDate, onDepartureChange, razorpayEnabled = false }) {
  const [monthOffset, setMonthOffset] = useState(0);
  const [bookingOpen, setBookingOpen] = useState(false);

  const departureDates = useMemo(
    () => getDepartureDates({ count: 5, monthOffset }),
    [monthOffset]
  );

  const selectedDate = departureDate || departureDates[0];

  const whatsappUrl = buildWhatsAppUrl(
    contactDetails.whatsapp,
    buildWhatsAppMessage(trip, { departureDate: selectedDate })
  );

  const handleDateSelect = (date) => {
    onDepartureChange?.(date);
  };

  return (
    <>
      <div className="space-y-0 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-lg">
        {/* Price header */}
        <div className="relative overflow-hidden bg-zinc-900 px-6 py-5 text-white">
          <Plane className="absolute -right-2 -top-2 h-20 w-20 rotate-12 text-white/10" />
          <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
            Starting from
          </p>
          <p className="mt-1 text-3xl font-bold tabular-nums">
            {trip.price}
            <span className="ml-1 text-base font-medium text-zinc-400">/person</span>
          </p>
        </div>

        <div className="space-y-5 p-6">
          {/* Departure dates */}
          <div className="rounded-xl border border-zinc-200 p-4">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-zinc-900">Choose your Departure Dates</h3>
              <button
                type="button"
                onClick={() => setMonthOffset((m) => m + 1)}
                className="flex shrink-0 items-center gap-1 rounded-lg border border-zinc-200 px-2 py-1 text-[10px] font-medium text-zinc-600 transition-colors hover:border-amber-300 hover:bg-amber-50"
              >
                <Calendar className="h-3 w-3" />
                Later Month
              </button>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1">
              {departureDates.map((date) => {
                const pill = formatDeparturePill(date);
                const isSelected =
                  selectedDate &&
                  date.toDateString() === new Date(selectedDate).toDateString();

                return (
                  <button
                    key={date.toISOString()}
                    type="button"
                    onClick={() => handleDateSelect(date)}
                    className={cn(
                      "flex min-w-[52px] shrink-0 flex-col items-center rounded-xl border px-3 py-2 transition-colors",
                      isSelected
                        ? "border-zinc-900 bg-zinc-900 text-white"
                        : "border-zinc-300 bg-white text-zinc-900 hover:border-amber-300"
                    )}
                  >
                    <span className="text-lg font-bold leading-none">{pill.day}</span>
                    <span className="text-[10px] font-semibold uppercase">{pill.month}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Trip meta */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-500">Duration</span>
              <span className="font-medium text-zinc-900">{trip.duration}</span>
            </div>
            {(trip.group_size || trip.groupSize) && (
              <div className="flex justify-between">
                <span className="text-zinc-500">Group Size</span>
                <span className="font-medium text-zinc-900">
                  {trip.group_size || trip.groupSize}
                </span>
              </div>
            )}
            {(trip.best_season || trip.bestSeason) && (
              <div className="flex justify-between">
                <span className="text-zinc-500">Best Season</span>
                <span className="font-medium text-zinc-900">
                  {trip.best_season || trip.bestSeason}
                </span>
              </div>
            )}
          </div>

          {/* CTAs */}
          <div className="space-y-2">
            <Button
              onClick={() => setBookingOpen(true)}
              className="w-full rounded-xl bg-zinc-900 py-4 text-sm font-semibold text-white hover:bg-zinc-800"
            >
              Book Now
            </Button>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <Button
                variant="outline"
                className="w-full rounded-xl border-zinc-300 py-4 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
              >
                <MessageCircle className="mr-2 h-4 w-4 text-emerald-500" />
                Chat with an Expert
              </Button>
            </a>
          </div>

          {/* Hosted by */}
          <div className="border-t border-dashed border-zinc-200 pt-4">
            <p className="text-xs font-semibold text-zinc-900">Hosted by</p>
            <div className="mt-2 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
                AW
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-900">Anjali World Tourism</p>
                <p className="flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                  <CheckCircle2 className="h-3 w-3" />
                  Verified Operator
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <TripBookingModal
        trip={trip}
        departureDate={selectedDate}
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        razorpayEnabled={razorpayEnabled}
      />
    </>
  );
}
