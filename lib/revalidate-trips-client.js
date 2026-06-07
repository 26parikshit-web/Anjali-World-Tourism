/** Ask the server to bust trip/homepage caches after admin changes. */
export async function revalidateTripsOnServer() {
  try {
    const res = await fetch("/api/revalidate/trips", { method: "POST" });
    if (!res.ok) {
      console.warn("Trip cache revalidation failed:", res.status);
      return false;
    }
    return true;
  } catch (err) {
    console.warn("Trip cache revalidation error:", err);
    return false;
  }
}
