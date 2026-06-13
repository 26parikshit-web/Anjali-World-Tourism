import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { isCloudinaryConfigured } from "@/lib/cloudinary";

const ALLOWED_IMAGES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_VIDEOS = ["video/mp4", "video/webm", "video/quicktime"];

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
  if (!isCloudinaryConfigured()) {
    return NextResponse.json(
      { error: "Cloudinary is not configured. Add CLOUDINARY_* env vars." },
      { status: 503 }
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const isVideo = file.type.startsWith("video/");
  const allowed = isVideo ? ALLOWED_VIDEOS : ALLOWED_IMAGES;
  const maxBytes = isVideo ? 30 * 1024 * 1024 : 8 * 1024 * 1024;

  if (!allowed.includes(file.type)) {
    return NextResponse.json(
      { error: "Upload a JPG, PNG, WebP, MP4, WebM, or MOV file." },
      { status: 400 }
    );
  }

  if (file.size > maxBytes) {
    return NextResponse.json(
      {
        error: isVideo
          ? "Video must be under 30 MB."
          : "Photo must be under 8 MB.",
      },
      { status: 400 }
    );
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const cld = getCloudinary();

    const result = await new Promise((resolve, reject) => {
      const stream = cld.uploader.upload_stream(
        {
          folder: "anjali-reviews/pending",
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
  } catch (error) {
    console.error("Review media upload error:", error);
    return NextResponse.json(
      { error: error.message || "Upload failed" },
      { status: 500 }
    );
  }
}
