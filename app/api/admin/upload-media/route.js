import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { createClient } from "@/lib/supabase/server";
import { isCloudinaryConfigured } from "@/lib/cloudinary";

function getCloudinary() {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  return cloudinary;
}

function sanitizeSlug(slug) {
  return (slug || "drafts").replace(/[^a-zA-Z0-9_-]/g, "-").slice(0, 80);
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
      { error: "Cloudinary is not configured. Add CLOUDINARY_* env vars." },
      { status: 503 }
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const tripSlug = sanitizeSlug(formData.get("tripSlug"));
  const folder = formData.get("folder") === "hero" ? "hero" : "gallery";

  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const isVideo = file.type.startsWith("video/");
  const maxBytes = isVideo ? 30 * 1024 * 1024 : 10 * 1024 * 1024;
  if (file.size > maxBytes) {
    return NextResponse.json(
      {
        error: isVideo
          ? "Video must be under 30 MB. Keep clips short (under ~30 seconds)."
          : "Image must be under 10 MB.",
      },
      { status: 400 }
    );
  }

  const allowedImage = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  const allowedVideo = ["video/mp4", "video/webm", "video/quicktime"];
  const allowed = isVideo ? allowedVideo : allowedImage;

  if (!allowed.includes(file.type)) {
    return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const cld = getCloudinary();

    const result = await new Promise((resolve, reject) => {
      const stream = cld.uploader.upload_stream(
        {
          folder: `anjali-trips/${tripSlug}/${folder}`,
          resource_type: isVideo ? "video" : "image",
          use_filename: true,
          unique_filename: true,
        },
        (error, uploadResult) => {
          if (error) reject(error);
          else resolve(uploadResult);
        }
      );
      stream.end(buffer);
    });

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
      resourceType: result.resource_type,
      type: result.resource_type === "video" ? "video" : "image",
    });
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    return NextResponse.json(
      { error: err.message || "Upload failed" },
      { status: 500 }
    );
  }
}
