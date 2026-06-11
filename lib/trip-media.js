export function detectMediaType(url) {
  if (!url) return "image";
  if (url.includes("/video/upload/") || /\.(mp4|webm|mov|m4v)(\?|$)/i.test(url)) {
    return "video";
  }
  return "image";
}

export function normalizeGalleryItem(item = {}) {
  const src = (item.src || item.image_url || "").trim();
  if (!src) return null;
  if (item.type === "youtube") return null;

  const type = item.type === "video" || detectMediaType(src) === "video" ? "video" : "image";

  return { type, src, alt: item.alt || item.title || "" };
}

export function normalizeGallery(items) {
  if (!Array.isArray(items)) return [];
  return items.map(normalizeGalleryItem).filter(Boolean);
}

export function mediaAcceptForType(type) {
  if (type === "video") return "video/mp4,video/webm,.mp4,.webm";
  return "image/jpeg,image/png,image/webp,image/gif,.jpg,.jpeg,.png,.webp,.gif";
}

export function maxUploadBytes(type) {
  return type === "video" ? 30 * 1024 * 1024 : 10 * 1024 * 1024;
}
