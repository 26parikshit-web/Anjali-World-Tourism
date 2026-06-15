import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { FEATURE_FLAG_KEYS, isFeatureEnabled } from "@/lib/feature-flags";
import {
  sanitizeBookingContact,
  validateBookingDetails,
} from "@/lib/form-validation";
import { computeTripQuote, fetchTripForPricing } from "@/lib/trip-pricing";

function getRazorpay() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) return null;
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
}

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
      packageKey = "standard",
      pax,
      name,
      email,
      phone,
      departureDate,
    } = body;

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

    const trip = await fetchTripForPricing(tripSlug);
    if (!trip) {
      return NextResponse.json(
        { success: false, message: "Trip not found or inactive." },
        { status: 404 }
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

    const razorpay = getRazorpay();
    if (!razorpay) {
      return NextResponse.json(
        {
          success: false,
          message: "Payment gateway is not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.",
        },
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
      receipt: `trip_${tripSlug}_${Date.now()}`.slice(0, 40),
      notes: {
        trip_slug: tripSlug,
        trip_name: tripName,
        package_key: quote.packageKey,
        pax: String(quote.pax),
        customer_name: contact.name,
        customer_email: contact.email,
        customer_phone: contact.phone,
        departure_date: departureDate || "",
        discount_percent: String(quote.discount.active ? quote.discount.percent : 0),
      },
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID,
      quote: {
        packageKey: quote.packageKey,
        total: quote.totalRupees,
        totalPaise: quote.totalPaise,
      },
    });
  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create order." },
      { status: 500 }
    );
  }
}
