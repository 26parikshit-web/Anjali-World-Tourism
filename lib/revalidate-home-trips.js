import { revalidatePath, revalidateTag } from "next/cache";

const HOMEPAGE_FEATURED_CATEGORIES = ["Spiritual Journey", "Friends Getaway"];

/** Bust trip + homepage caches so featured changes appear immediately. */
export function revalidateTripCaches() {
  revalidateTag("trips");

  for (const category of HOMEPAGE_FEATURED_CATEGORIES) {
    revalidateTag(`featured-trips-${category}`);
  }

  revalidatePath("/");
  revalidatePath("/trips");
}
