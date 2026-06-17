import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { revalidateReviewCaches } from "@/lib/revalidate-home-trips";
import { promoteReviewMediaToApproved } from "@/lib/review-media-cloudinary";

const PATCH_FIELDS = [
  "name",
  "email",
  "designation",
  "trip",
  "trip_id",
  "quote",
  "image_url",
  "cloudinary_public_id",
  "resource_type",
  "rating",
  "is_featured",
];

export async function POST(request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { reviewId, patch } = body;

  if (!reviewId) {
    return NextResponse.json({ error: "reviewId is required" }, { status: 400 });
  }

  const { data: review, error: fetchError } = await supabase
    .from("reviews")
    .select("id, created_at, name, designation, trip, quote, image, is_approved, is_featured")
    .eq("id", reviewId)
    .single();

  if (fetchError || !review) {
    return NextResponse.json({ error: "Review not found" }, { status: 404 });
  }

  let mediaFields = {};
  if (!review.is_approved) {
    try {
      const promoted = await promoteReviewMediaToApproved(review);
      if (promoted.moved) {
        mediaFields = {
          image_url: promoted.image_url,
          cloudinary_public_id: promoted.cloudinary_public_id,
          resource_type: promoted.resource_type,
        };
      }
    } catch (error) {
      console.error("Review media promote error:", error);
      return NextResponse.json(
        {
          error:
            error.message ||
            "Failed to move review media to the approved folder in Cloudinary.",
        },
        { status: 500 }
      );
    }
  }

  const sanitizedPatch = {};
  if (patch && typeof patch === "object") {
    for (const field of PATCH_FIELDS) {
      if (Object.prototype.hasOwnProperty.call(patch, field)) {
        sanitizedPatch[field] = patch[field];
      }
    }
    if (sanitizedPatch.trip_id === "") {
      sanitizedPatch.trip_id = null;
    }
  }

  const updatePayload = {
    is_approved: true,
    ...mediaFields,
    ...sanitizedPatch,
  };

  const { data: updated, error: updateError } = await supabase
    .from("reviews")
    .update(updatePayload)
    .eq("id", reviewId)
    .select()
    .single();

  if (updateError) {
    console.error("Review approval update error:", updateError);
    return NextResponse.json(
      { error: updateError.message || "Failed to approve review." },
      { status: 500 }
    );
  }

  revalidateReviewCaches();

  return NextResponse.json({
    success: true,
    review: updated,
    mediaMoved: Boolean(mediaFields.image_url),
  });
}
