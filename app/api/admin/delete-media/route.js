import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { createClient } from "@/lib/supabase/server";
import { isCloudinaryConfigured, isCloudinaryUrl } from "@/lib/cloudinary";
import {
  publicIdFromCloudinaryUrl,
  resourceTypeFromCloudinaryUrl,
} from "@/lib/cloudinary-utils";

function getCloudinary() {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  return cloudinary;
}

export async function POST(request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isCloudinaryConfigured()) {
    return NextResponse.json(
      { error: "Cloudinary is not configured." },
      { status: 503 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { url, publicId: providedPublicId, resourceType: providedResourceType } = body;

  if (!url && !providedPublicId) {
    return NextResponse.json({ error: "url or publicId required" }, { status: 400 });
  }

  if (url && !isCloudinaryUrl(url)) {
    return NextResponse.json({ ok: true, skipped: true, reason: "not_cloudinary" });
  }

  const publicId = providedPublicId || publicIdFromCloudinaryUrl(url);
  if (!publicId) {
    return NextResponse.json({ error: "Could not resolve Cloudinary public_id" }, { status: 400 });
  }

  const resourceType =
    providedResourceType || (url ? resourceTypeFromCloudinaryUrl(url) : "image");

  try {
    const cld = getCloudinary();
    const result = await cld.uploader.destroy(publicId, {
      resource_type: resourceType === "video" ? "video" : "image",
      invalidate: true,
    });

    return NextResponse.json({ ok: true, result: result.result });
  } catch (err) {
    console.error("Cloudinary delete error:", err);
    return NextResponse.json(
      { error: err.message || "Delete failed" },
      { status: 500 }
    );
  }
}
