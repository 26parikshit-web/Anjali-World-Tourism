export async function uploadTripMedia(file, { tripSlug, folder = "gallery" } = {}) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("tripSlug", tripSlug?.trim() || "drafts");
  formData.append("folder", folder);

  const res = await fetch("/api/admin/upload-media", {
    method: "POST",
    body: formData,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Upload failed");
  return data.url;
}
