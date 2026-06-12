import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { FEATURE_FLAG_KEYS, isFeatureEnabled } from "@/lib/feature-flags";

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
    const { tripSlug, tripName, amount, pax, name, email, phone, departureDate } = body;

    if (!tripSlug || !tripName || !amount || !name || !email || !phone) {
      return NextResponse.json(
        { success: false, message: "Missing required booking fields." },
        { status: 400 }
      );
    }

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

    const amountPaise = Math.round(Number(amount) * 100);
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
        pax: String(pax || 1),
        customer_name: name,
        customer_email: email,
        customer_phone: phone,
        departure_date: departureDate || "",
      },
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create order." },
      { status: 500 }
    );
  }
}
