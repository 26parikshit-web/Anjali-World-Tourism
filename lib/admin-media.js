export async function uploadAdminMedia(
  file,
  {
    scope = "trip",
    tripSlug,
    folder = "gallery",
    category = "general",
    homeSection = "hero",
  } = {}
) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("scope", scope);

  if (scope === "site-gallery") {
    formData.append("category", category?.trim() || "general");
  } else if (scope === "home") {
    formData.append("homeSection", homeSection?.trim() || "hero");
  } else {
    formData.append("tripSlug", tripSlug?.trim() || "drafts");
    formData.append("folder", folder);
  }

  const res = await fetch("/api/admin/upload-media", {
    method: "POST",
    body: formData,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Upload failed");

  return {
    url: data.url,
    publicId: data.publicId,
    type: data.type,
    resourceType: data.resourceType,
  };
}

/** @deprecated Use uploadAdminMedia */
export async function uploadTripMedia(file, { tripSlug, folder = "gallery" } = {}) {
  const result = await uploadAdminMedia(file, { scope: "trip", tripSlug, folder });
  return result.url;
}

export async function deleteAdminMedia({ url, publicId, resourceType } = {}) {
  const res = await fetch("/api/admin/delete-media", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, publicId, resourceType }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Delete failed");
  return data;
}
