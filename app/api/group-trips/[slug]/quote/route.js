import { NextResponse } from "next/server";
import {
  computeTripQuote,
  fetchGroupTripForPricing,
  quoteResponseFromCompute,
} from "@/lib/trip-pricing";
import { canAccommodatePax, capacityLabel } from "@/lib/group-trip-capacity";

export async function GET(request, { params }) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const packageKey = searchParams.get("package") || "standard";
    const pax = Number.parseInt(searchParams.get("pax") || "1", 10);

    const trip = await fetchGroupTripForPricing(slug);
    if (!trip) {
      return NextResponse.json({ valid: false, message: "Group trip not found." }, { status: 404 });
    }

    if (!canAccommodatePax(trip, pax)) {
      const cap = capacityLabel(trip);
      return NextResponse.json(
        {
          valid: false,
          message: cap.isFull
            ? "This group trip is fully booked."
            : `Only ${cap.remaining} spot${cap.remaining === 1 ? "" : "s"} remaining.`,
          capacity: cap,
        },
        { status: 409 }
      );
    }

    const quote = computeTripQuote(trip, { packageKey, pax, now: new Date() });
    if (!quote.valid) {
      return NextResponse.json(quote, { status: 400 });
    }

    return NextResponse.json(
      quoteResponseFromCompute(quote, { capacity: capacityLabel(trip) })
    );
  } catch (error) {
    console.error("Group trip quote error:", error);
    return NextResponse.json(
      { valid: false, message: "Failed to compute quote." },
      { status: 500 }
    );
  }
}
