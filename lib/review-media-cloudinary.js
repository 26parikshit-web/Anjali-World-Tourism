import { v2 as cloudinary } from "cloudinary";
import { isCloudinaryConfigured } from "@/lib/cloudinary";
import {
  publicIdFromCloudinaryUrl,
  resourceTypeFromCloudinaryUrl,
} from "@/lib/cloudinary-utils";

export const REVIEW_MEDIA_PENDING_PREFIX = "anjali-reviews/pending/";
export const REVIEW_MEDIA_APPROVED_PREFIX = "anjali-reviews/approved/";

function getCloudinary() {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  return cloudinary;
}

export function resolveReviewPublicId(review) {
  if (review?.cloudinary_public_id) {
    return review.cloudinary_public_id;
  }
  if (review?.image_url) {
    return publicIdFromCloudinaryUrl(review.image_url);
  }
  return null;
}

export function isPendingReviewMedia(publicId) {
  return Boolean(publicId?.startsWith(REVIEW_MEDIA_PENDING_PREFIX));
}

export function toApprovedPublicId(publicId) {
  if (!isPendingReviewMedia(publicId)) return null;
  return publicId.replace(REVIEW_MEDIA_PENDING_PREFIX, REVIEW_MEDIA_APPROVED_PREFIX);
}

export function getReviewResourceType(review) {
  if (review?.resource_type === "video") return "video";
  if (review?.image_url) return resourceTypeFromCloudinaryUrl(review.image_url);
  return "image";
}

/**
 * Move review media from anjali-reviews/pending → anjali-reviews/approved.
 * Returns updated media fields when a rename occurred.
 */
export async function promoteReviewMediaToApproved(review) {
  const publicId = resolveReviewPublicId(review);

  if (!publicId || !isPendingReviewMedia(publicId)) {
    return {
      moved: false,
      image_url: review?.image_url ?? null,
      cloudinary_public_id: publicId ?? review?.cloudinary_public_id ?? null,
      resource_type: getReviewResourceType(review),
    };
  }

  if (!isCloudinaryConfigured()) {
    throw new Error("Cloudinary is not configured.");
  }

  const resourceType = getReviewResourceType(review);
  const newPublicId = toApprovedPublicId(publicId);
  const cld = getCloudinary();

  const result = await cld.uploader.rename(publicId, newPublicId, {
    resource_type: resourceType,
    invalidate: true,
  });

  return {
    moved: true,
    image_url: result.secure_url,
    cloudinary_public_id: result.public_id,
    resource_type: resourceType,
  };
}
