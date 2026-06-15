"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, MessageCircle, Plane } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DiscountCountdown } from "@/components/discount-countdown";
import {
  buildWhatsAppMessage,
  buildWhatsAppUrl,
  formatFullDate,
  getDefaultBookingDate,
} from "@/lib/trip-booking";
import { getTripListPrice, getTripPackageDisplayPrices } from "@/lib/trip-pricing";
import { capacityLabel } from "@/lib/group-trip-capacity";
import { contactDetails } from "@/lib/site-data";
import { TripBookingModal } from "@/components/trip-booking-modal";
import { TripDatePicker } from "@/components/trip-date-picker";

export function TripBookingSidebar({
  trip,
  departureDate,
  onDepartureChange,
  razorpayEnabled = false,
  bookingKind = "trip",
}) {
  const [bookingOpen, setBookingOpen] = useState(false);
  const isGroup = bookingKind === "group";

  const defaultDate = useMemo(() => {
    if (isGroup && trip.departure_date) return new Date(trip.departure_date);
    return getDefaultBookingDate();
  }, [isGroup, trip.departure_date]);

  const selectedDate = departureDate || defaultDate;
  const listPrice = useMemo(() => getTripListPrice(trip), [trip]);
  const packagePrices = useMemo(() => getTripPackageDisplayPrices(trip), [trip]);
  const capacity = useMemo(
    () => (isGroup ? capacityLabel(trip) : null),
    [isGroup, trip]
  );

  const whatsappUrl = buildWhatsAppUrl(
    contactDetails.whatsapp,
    buildWhatsAppMessage(trip, { departureDate: selectedDate })
  );

  const handleDateSelect = (date) => {
    onDepartureChange?.(date);
  };

  return (
    <>
      <div className="hidden w-full min-w-0 max-w-full space-y-0 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-lg lg:block">
        {/* Price header */}
        <div className="relative overflow-hidden bg-zinc-900 px-4 py-4 text-white sm:px-6 sm:py-5">
          <Plane className="absolute -right-2 -top-2 h-16 w-16 rotate-12 text-white/10 sm:h-20 sm:w-20" />
          <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
            {isGroup ? trip.hosted_place : "Starting from"}
          </p>
          {listPrice.discountActive && (
            <p className="mt-1 text-sm text-zinc-400 line-through tabular-nums">
              {listPrice.displayPriceBase}
            </p>
          )}
          <p className="mt-1 text-2xl font-bold tabular-nums sm:text-3xl">
            {listPrice.displayPrice}
            <span className="ml-1 text-sm font-medium text-zinc-400 sm:text-base">/person</span>
          </p>
          {listPrice.discountActive && (
            <div className="mt-2">
              <p className="text-xs font-medium text-amber-300">
                {listPrice.discountPercent}% off this trip
              </p>
              <DiscountCountdown endsAt={listPrice.discountEndsAt} className="mt-2 text-amber-200" />
            </div>
          )}
          {packagePrices.length > 1 && (
            <ul className="mt-3 space-y-1 border-t border-white/10 pt-3 text-xs">
              {packagePrices.map((pkg) => (
                <li key={pkg.key} className="flex items-center justify-between gap-2">
                  <span className="text-zinc-400">{pkg.label}</span>
                  <span className="tabular-nums text-white">
                    {pkg.priceLabelBase && (
                      <span className="mr-1 text-zinc-500 line-through">{pkg.priceLabelBase}</span>
                    )}
                    {pkg.priceLabel}
                  </span>
                </li>
              ))}
            </ul>
          )}
          {capacity && (
            <p className="mt-2 text-xs font-medium text-amber-300">{capacity.label}</p>
          )}
        </div>

        <div className="space-y-4 p-4 sm:space-y-5 sm:p-6">
          {!isGroup && (
            <TripDatePicker selectedDate={selectedDate} onSelect={handleDateSelect} compact />
          )}
          {isGroup && trip.departure_date && (
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-700">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
                Group departure
              </p>
              <p className="mt-1 font-medium">
                {formatFullDate(new Date(trip.departure_date))}
              </p>
            </div>
          )}

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
              disabled={capacity?.isFull}
              className="w-full rounded-xl bg-zinc-900 py-4 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-50"
            >
              {capacity?.isFull ? "Fully Booked" : isGroup ? "Join Group Trip" : "Book Now"}
            </Button>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <Button
                variant="outline"
                className="w-full rounded-xl border-zinc-300 py-3.5 text-sm font-semibold text-zinc-900 hover:bg-zinc-50 sm:py-4"
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

      <div className="fixed inset-x-0 bottom-0 z-40 overflow-hidden rounded-t-2xl border border-white/10 border-b-0 bg-gradient-to-t from-zinc-950/98 via-zinc-900/95 to-zinc-900/90 shadow-[0_-12px_40px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl lg:hidden">
        <div className="px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <div className="mx-auto w-full max-w-lg">
            <div className="mb-2.5">
              {listPrice.discountActive && listPrice.displayPriceBase && (
                <p className="text-sm text-zinc-500 line-through tabular-nums">
                  {listPrice.displayPriceBase}
                </p>
              )}
              <p className="text-base font-bold tabular-nums text-white">
                {listPrice.displayPrice}
                <span className="text-sm font-medium text-zinc-400">/ person</span>
              </p>
              <p className="mt-0.5 text-[10px] text-zinc-400">
                {listPrice.discountActive
                  ? `${listPrice.discountPercent}% off this trip · +5% GST`
                  : "+5% GST · taxes as applicable"}
              </p>
            </div>
            <div className="flex items-stretch gap-2">
              <Button
                onClick={() => setBookingOpen(true)}
                disabled={capacity?.isFull}
                className="h-10 flex-1 rounded-xl bg-white text-sm font-semibold text-zinc-900 hover:bg-zinc-100 disabled:opacity-50"
              >
                {capacity?.isFull ? "Full" : isGroup ? "Join" : "Book Now"}
              </Button>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0"
                aria-label="Chat with an Expert on WhatsApp"
              >
                <Button
                  variant="outline"
                  className="h-10 w-11 rounded-xl border-white/20 bg-white/10 px-0 text-emerald-400 backdrop-blur-sm hover:bg-white/20"
                >
                  <MessageCircle className="h-5 w-5" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>

      <TripBookingModal
        trip={trip}
        departureDate={selectedDate}
        onDepartureChange={handleDateSelect}
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        razorpayEnabled={razorpayEnabled}
        bookingKind={bookingKind}
      />
    </>
  );
}
