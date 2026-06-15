import { NextResponse } from "next/server";
import {
  computeTripQuote,
  fetchTripForPricing,
  quoteResponseFromCompute,
} from "@/lib/trip-pricing";

export async function GET(request, { params }) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const packageKey = searchParams.get("package") || "standard";
    const pax = Number.parseInt(searchParams.get("pax") || "1", 10);

    const trip = await fetchTripForPricing(slug);
    if (!trip) {
      return NextResponse.json({ valid: false, message: "Trip not found." }, { status: 404 });
    }

    const quote = computeTripQuote(trip, { packageKey, pax, now: new Date() });
    if (!quote.valid) {
      return NextResponse.json(quote, { status: 400 });
    }

    return NextResponse.json(quoteResponseFromCompute(quote));
  } catch (error) {
    console.error("Trip quote error:", error);
    return NextResponse.json(
      { valid: false, message: "Failed to compute quote." },
      { status: 500 }
    );
  }
}
