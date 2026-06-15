import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { FEATURE_FLAG_KEYS, isFeatureEnabled } from "@/lib/feature-flags";
import {
  sanitizeBookingContact,
  validateBookingDetails,
} from "@/lib/form-validation";
import { computeTripQuote, fetchTripForPricing, fetchGroupTripForPricing, paiseToRupees } from "@/lib/trip-pricing";
import { canAccommodatePax } from "@/lib/group-trip-capacity";
import { reserveGroupTripSpots } from "@/lib/group-trip-reserve";
import { createRazorpayClient, getRazorpayConfigError } from "@/lib/razorpay-config";

const supabase = process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
  : null;

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

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
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      tripSlug,
      tripName,
      packageKey = "standard",
      pax,
      name,
      email,
      phone,
      departureDate,
      bookingKind = "trip",
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, message: "Missing payment verification data." },
        { status: 400 }
      );
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();
    const configError = getRazorpayConfigError();
    if (!keySecret || configError) {
      return NextResponse.json(
        { success: false, message: configError || "Payment gateway is not configured." },
        { status: 503 }
      );
    }

    const expected = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expected !== razorpay_signature) {
      return NextResponse.json(
        { success: false, message: "Payment verification failed." },
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

    const { client: razorpay } = createRazorpayClient();
    if (!razorpay) {
      return NextResponse.json(
        { success: false, message: getRazorpayConfigError() || "Payment gateway is not configured." },
        { status: 503 }
      );
    }

    const order = await razorpay.orders.fetch(razorpay_order_id);
    const resolvedPackageKey = order?.notes?.package_key || packageKey;
    const isGroup = order?.notes?.booking_kind === "group" || bookingKind === "group";

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

    const quote = computeTripQuote(trip, {
      packageKey: resolvedPackageKey,
      pax,
      now: new Date(),
    });

    if (!quote.valid) {
      return NextResponse.json(
        { success: false, message: quote.message },
        { status: 400 }
      );
    }

    if (isGroup && !canAccommodatePax(trip, quote.pax)) {
      return NextResponse.json(
        { success: false, message: "Not enough spots remaining for this group trip." },
        { status: 409 }
      );
    }

    if (Number(order.amount) !== quote.totalPaise) {
      return NextResponse.json(
        {
          success: false,
          message: "Payment amount does not match the current trip price.",
        },
        { status: 400 }
      );
    }

    const contact = sanitizeBookingContact({ name, email, phone });
    const amountBeforeDiscount = quote.discount.active
      ? (() => {
          const baseSubtotal = paiseToRupees(quote.perPersonPaiseBase * quote.pax);
          return baseSubtotal + Math.round(baseSubtotal * (quote.gstPercent / 100));
        })()
      : null;

    let bookingId = null;

    if (isGroup) {
      const reserved = await reserveGroupTripSpots(trip.id, quote.pax);
      if (!reserved) {
        return NextResponse.json(
          { success: false, message: "Could not reserve spots — group trip may be full." },
          { status: 409 }
        );
      }
    }

    if (supabase) {
      const { data, error } = await supabase
        .from("bookings")
        .insert([
          {
            booking_kind: isGroup ? "group" : "trip",
            trip_slug: tripSlug,
            trip_name: tripName,
            group_trip_id: isGroup ? trip.id : null,
            group_trip_slug: isGroup ? tripSlug : null,
            customer_name: contact.name,
            customer_email: contact.email,
            customer_phone: contact.phone,
            pax: quote.pax,
            package_tier: quote.packageKey,
            discount_percent: quote.discount.active ? quote.discount.percent : null,
            amount_before_discount: amountBeforeDiscount,
            amount: quote.totalRupees,
            departure_date: departureDate || (isGroup ? trip.departure_date : null),
            razorpay_order_id,
            razorpay_payment_id,
            status: "paid",
          },
        ])
        .select("id")
        .single();

      if (error) {
        console.error("Booking save error:", error);
      } else {
        bookingId = data?.id;
      }
    }

    if (resend && process.env.ENQUIRY_EMAIL_TO) {
      try {
        await resend.emails.send({
          from: process.env.ENQUIRY_EMAIL_FROM || "onboarding@resend.dev",
          to: process.env.ENQUIRY_EMAIL_TO,
          subject: `New Booking: ${tripName} — ${contact.name}`,
          html: `
            <h2>New Trip Booking</h2>
            <p><strong>Trip:</strong> ${tripName}</p>
            <p><strong>Package:</strong> ${quote.packageLabel}</p>
            <p><strong>Customer:</strong> ${contact.name}</p>
            <p><strong>Email:</strong> ${contact.email}</p>
            <p><strong>Phone:</strong> ${contact.phone}</p>
            <p><strong>Travelers:</strong> ${quote.pax}</p>
            <p><strong>Amount:</strong> ₹${quote.totalRupees}</p>
            ${
              quote.discount.active
                ? `<p><strong>Discount:</strong> ${quote.discount.percent}% (applied server-side)</p>`
                : ""
            }
            <p><strong>Departure:</strong> ${departureDate || "Not specified"}</p>
            <p><strong>Payment ID:</strong> ${razorpay_payment_id}</p>
          `,
        });
      } catch (emailErr) {
        console.error("Booking email error:", emailErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully.",
      bookingId,
      paymentId: razorpay_payment_id,
    });
  } catch (error) {
    console.error("Verify payment error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Verification failed." },
      { status: 500 }
    );
  }
}
