import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { FEATURE_FLAG_KEYS, isFeatureEnabled } from "@/lib/feature-flags";

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
      pax,
      name,
      email,
      phone,
      departureDate,
      amount,
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, message: "Missing payment verification data." },
        { status: 400 }
      );
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return NextResponse.json(
        { success: false, message: "Payment gateway is not configured." },
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

    let bookingId = null;

    if (supabase) {
      const { data, error } = await supabase
        .from("bookings")
        .insert([
          {
            trip_slug: tripSlug,
            trip_name: tripName,
            customer_name: name,
            customer_email: email,
            customer_phone: phone,
            pax: pax || 1,
            amount: amount,
            departure_date: departureDate || null,
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
          subject: `New Booking: ${tripName} — ${name}`,
          html: `
            <h2>New Trip Booking</h2>
            <p><strong>Trip:</strong> ${tripName}</p>
            <p><strong>Customer:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Travelers:</strong> ${pax}</p>
            <p><strong>Amount:</strong> ₹${amount}</p>
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
