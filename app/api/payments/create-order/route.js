import { NextResponse } from "next/server";
import { FEATURE_FLAG_KEYS, isFeatureEnabled } from "@/lib/feature-flags";
import {
  sanitizeBookingContact,
  validateBookingDetails,
} from "@/lib/form-validation";
import { computeTripQuote, fetchTripForPricing, fetchGroupTripForPricing } from "@/lib/trip-pricing";
import { canAccommodatePax, capacityLabel } from "@/lib/group-trip-capacity";
import {
  createRazorpayClient,
  formatRazorpayError,
  getRazorpayKeyIdForCheckout,
} from "@/lib/razorpay-config";

export async function POST(request) {
  try {
    if (!(await isFeatureEnabled(FEATURE_FLAG_KEYS.RAZORPAY_PAYMENTS))) {
      return NextResponse.json(
        { success: false, message: "Online payments are currently disabled." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      tripSlug,
      tripName,
      bookingKind = "trip",
      packageKey = "standard",
      pax,
      name,
      email,
      phone,
      departureDate,
    } = body;

    const isGroup = bookingKind === "group";

    if (!tripSlug || !tripName) {
      return NextResponse.json(
        { success: false, message: "Missing required booking fields." },
        { status: 400 }
      );
    }

    const validation = validateBookingDetails({ name, email, phone });
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, message: validation.message },
        { status: 400 }
      );
    }

    const trip = isGroup
      ? await fetchGroupTripForPricing(tripSlug)
      : await fetchTripForPricing(tripSlug);
    if (!trip) {
      return NextResponse.json(
        {
          success: false,
          message: isGroup ? "Group trip not found or inactive." : "Trip not found or inactive.",
        },
        { status: 404 }
      );
    }

    if (isGroup && !canAccommodatePax(trip, pax)) {
      const cap = capacityLabel(trip);
      return NextResponse.json(
        {
          success: false,
          message: cap.isFull
            ? "This group trip is fully booked."
            : `Only ${cap.remaining} spot${cap.remaining === 1 ? "" : "s"} left.`,
        },
        { status: 409 }
      );
    }

    const quote = computeTripQuote(trip, {
      packageKey,
      pax,
      now: new Date(),
    });

    if (!quote.valid) {
      return NextResponse.json(
        { success: false, message: quote.message },
        { status: 400 }
      );
    }

    const contact = sanitizeBookingContact({ name, email, phone });

    const { client: razorpay, error: configError } = createRazorpayClient();
    if (!razorpay) {
      return NextResponse.json(
        { success: false, message: configError },
        { status: 503 }
      );
    }

    const amountPaise = quote.totalPaise;
    if (amountPaise < 100) {
      return NextResponse.json(
        { success: false, message: "Invalid payment amount." },
        { status: 400 }
      );
    }

    const order = await razorpay.orders.create({
      amount: amountPaise,
      currency: "INR",
      receipt: `${isGroup ? "group" : "trip"}_${tripSlug}_${Date.now()}`.slice(0, 40),
      notes: {
        booking_kind: isGroup ? "group" : "trip",
        trip_slug: tripSlug,
        trip_name: tripName,
        package_key: quote.packageKey,
        pax: String(quote.pax),
        customer_name: contact.name,
        customer_email: contact.email,
        customer_phone: contact.phone,
        departure_date: departureDate || "",
        discount_percent: String(quote.discount.active ? quote.discount.percent : 0),
        ...(isGroup ? { group_trip_id: trip.id } : {}),
      },
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: getRazorpayKeyIdForCheckout(),
      quote: {
        packageKey: quote.packageKey,
        total: quote.totalRupees,
        totalPaise: quote.totalPaise,
      },
    });
  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json(
      { success: false, message: formatRazorpayError(error) },
      { status: 500 }
    );
  }
}
