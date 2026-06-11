const CLOUDINARY_HOST = "res.cloudinary.com";

export function isCloudinaryConfigured() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );
}

export function isCloudinaryUrl(url) {
  return Boolean(url && url.includes(CLOUDINARY_HOST));
}

function buildTransform({ width, height, crop = "fill", quality = "auto", format = "auto" } = {}) {
  const parts = [];
  if (width) parts.push(`w_${width}`);
  if (height) parts.push(`h_${height}`);
  if (crop) parts.push(`c_${crop}`);
  parts.push(`q_${quality}`);
  if (format) parts.push(`f_${format}`);
  return parts.join(",");
}

/** Insert Cloudinary transforms into a delivery URL (images only). */
export function cloudinaryImageUrl(url, options = {}) {
  if (!url || !isCloudinaryUrl(url)) return url;
  if (url.includes("/video/upload/")) return url;

  const transform = buildTransform(options);
  if (!transform) return url;

  // Avoid double-transform if URL already has w_ or q_
  if (/\/upload\/[^/]*w_\d/.test(url)) return url;

  return url.replace(/\/image\/upload\//, `/image/upload/${transform}/`);
}

/** Hero: wide, high quality */
export function cloudinaryHeroUrl(url) {
  return cloudinaryImageUrl(url, { width: 1920, crop: "fill", quality: "auto" });
}

/** Gallery grid thumbnail */
export function cloudinaryGalleryUrl(url) {
  return cloudinaryImageUrl(url, { width: 800, crop: "fill", quality: "auto" });
}

/** Trip cards / catalog */
export function cloudinaryCardUrl(url) {
  return cloudinaryImageUrl(url, { width: 600, height: 400, crop: "fill", quality: "auto" });
}

/** Lightbox full view */
export function cloudinaryLightboxUrl(url) {
  return cloudinaryImageUrl(url, { width: 1600, crop: "limit", quality: "auto" });
}

/** Video delivery URL — optional quality tweak for shorter clips */
export function cloudinaryVideoUrl(url) {
  if (!url || !isCloudinaryUrl(url) || !url.includes("/video/upload/")) return url;
  if (/\/video\/upload\/[^/]*q_auto/.test(url)) return url;
  return url.replace(/\/video\/upload\//, "/video/upload/q_auto,f_mp4/");
}
