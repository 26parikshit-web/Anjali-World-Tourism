import { isCloudinaryUrl } from "@/lib/cloudinary";

/** Extract Cloudinary public_id from a delivery URL. */
export function publicIdFromCloudinaryUrl(url) {
  if (!url || !isCloudinaryUrl(url)) return null;

  const match = url.match(/\/(?:image|video)\/upload\/(?:v\d+\/)?(.+)$/i);
  if (!match) return null;

  return match[1].replace(/\.[a-z0-9]+$/i, "");
}

export function resourceTypeFromCloudinaryUrl(url) {
  if (!url || !isCloudinaryUrl(url)) return "image";
  return url.includes("/video/upload/") ? "video" : "image";
}
