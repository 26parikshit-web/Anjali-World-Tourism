import Link from "next/link";
import { MapPin, Users } from "lucide-react";
import { getTripListPrice } from "@/lib/trip-pricing";
import { capacityLabel } from "@/lib/group-trip-capacity";
import { formatFullDate } from "@/lib/trip-booking";

export function GroupTripCard({ trip }) {
  const listPrice = getTripListPrice(trip);
  const capacity = capacityLabel(trip);
  const departure = trip.departure_date ? new Date(trip.departure_date) : null;

  return (
    <Link
      href={`/group-trips/${trip.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-amber-200 hover:shadow-lg"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-zinc-100">
        {trip.hero_image ? (
          <img
            src={trip.hero_image}
            alt={trip.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-zinc-400">No image</div>
        )}
        <div className="absolute left-3 top-3 rounded-full bg-zinc-900/85 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
          Group trip
        </div>
        <div
          className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-semibold ${
            capacity.isFull ? "bg-red-500 text-white" : "bg-emerald-500 text-white"
          }`}
        >
          {capacity.label}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-amber-600">
          <MapPin className="h-3 w-3" />
          {trip.hosted_place}
        </p>
        <h3 className="mt-1 text-lg font-semibold leading-tight text-zinc-900">{trip.name}</h3>
        {departure && (
          <p className="mt-1 text-xs text-zinc-500">{formatFullDate(departure)}</p>
        )}
        <p className="mt-2 line-clamp-2 text-sm text-zinc-600">
          {trip.short_description || trip.description?.slice(0, 120)}
        </p>
        <div className="mt-auto flex items-end justify-between pt-4">
          <div>
            {listPrice.discountActive && listPrice.displayPriceBase && (
              <p className="text-sm text-zinc-400 line-through tabular-nums">
                {listPrice.displayPriceBase}
              </p>
            )}
            <p className="text-lg font-bold text-zinc-900">{listPrice.displayPrice}</p>
            <p className="text-[11px] text-zinc-500">
              {listPrice.discountActive
                ? `${listPrice.discountPercent}% off this trip · per person`
                : "per person"}
            </p>
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-medium text-zinc-600">
            <Users className="h-3.5 w-3.5" />
            Join
          </span>
        </div>
      </div>
    </Link>
  );
}
