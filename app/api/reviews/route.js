import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  sanitizeReviewPayload,
  validateReviewPayload,
} from "@/lib/form-validation";

const supabaseServiceRole =
  process.env.SUPABASE_SERVICE_ROLE_KEY &&
  process.env.NEXT_PUBLIC_SUPABASE_URL
    ? createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      )
    : null;

const supabase =
  supabaseServiceRole ||
  (process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
    ? createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
      )
    : null);

export async function POST(request) {
  try {
    if (!supabase) {
      return NextResponse.json(
        {
          success: false,
          message: "Review submissions are not configured yet.",
        },
        { status: 503 }
      );
    }

    const payload = await request.json();
    const validation = validateReviewPayload(payload);

    if (!validation.valid) {
      return NextResponse.json(
        { success: false, message: validation.message },
        { status: 400 }
      );
    }

    const sanitized = sanitizeReviewPayload(payload);

    const { data, error } = await supabase
      .from("reviews")
      .insert([
        {
          name: sanitized.name,
          email: sanitized.email,
          designation: sanitized.designation || null,
          trip: sanitized.trip || "General",
          trip_id: sanitized.trip_id,
          quote: sanitized.quote,
          rating: sanitized.rating,
          image_url: sanitized.image_url,
          cloudinary_public_id: sanitized.cloudinary_public_id,
          resource_type: sanitized.resource_type,
          is_featured: false,
          is_approved: false,
        },
      ])
      .select("id")
      .single();

    if (error) {
      console.error("Review submission error:", error);
      throw new Error(error.message);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Review submitted successfully. It will appear after admin approval.",
        reviewId: data.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to submit review:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to submit review. Please try again.",
      },
      { status: 500 }
    );
  }
}
