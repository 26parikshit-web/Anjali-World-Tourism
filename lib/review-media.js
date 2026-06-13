import {
  cloudinaryGalleryUrl,
  cloudinaryLightboxUrl,
  cloudinaryVideoUrl,
  isCloudinaryUrl,
} from "@/lib/cloudinary";

export function hasReviewMedia(review) {
  return Boolean(review?.image_url || review?.image);
}

export function getReviewResourceType(review) {
  if (review?.resource_type === "video") return "video";
  const url = review?.image_url || review?.image;
  if (url?.includes("/video/upload/")) return "video";
  return "image";
}

/** Thumbnail for parallax grid (video → first-frame JPG). */
export function getReviewThumbnailUrl(review) {
  const url = review?.image_url || review?.image;
  if (!url) return null;

  if (getReviewResourceType(review) === "video") {
    if (isCloudinaryUrl(url) && url.includes("/video/upload/")) {
      if (/\/video\/upload\/[^/]*so_0/.test(url)) return url;
      return url.replace(
        /\/video\/upload\//,
        "/video/upload/so_0,w_800,h_480,c_fill,f_jpg,q_auto/"
      );
    }
    return url;
  }

  return cloudinaryGalleryUrl(url);
}

/** Full media URL for lightbox / modal. */
export function getReviewMediaUrl(review) {
  const url = review?.image_url || review?.image;
  if (!url) return null;

  if (getReviewResourceType(review) === "video") {
    return cloudinaryVideoUrl(url);
  }

  return cloudinaryLightboxUrl(url);
}

export function mapReviewToShowcaseItem(review) {
  const resourceType = getReviewResourceType(review);
  const mediaUrl = review.image_url || review.image;

  return {
    id: review.id,
    name: review.name,
    designation: review.designation,
    trip: review.trip,
    quote: review.quote,
    image: mediaUrl,
    mediaUrl: getReviewMediaUrl(review),
    thumbnail: getReviewThumbnailUrl(review),
    resourceType,
    rating: review.rating || 5,
  };
}
