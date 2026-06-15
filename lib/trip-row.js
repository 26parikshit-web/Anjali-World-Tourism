/** Columns that exist on the `trips` table — use before insert/update. */
const TRIP_ROW_KEYS = [
  "slug",
  "name",
  "category",
  "short_description",
  "description",
  "duration",
  "price",
  "pricing_packages",
  "discount_percent",
  "discount_ends_at",
  "group_size",
  "difficulty",
  "best_season",
  "hero_image",
  "highlights",
  "itinerary",
  "inclusions",
  "exclusions",
  "gallery",
  "tags",
  "is_featured",
  "is_active",
];

export function pickTripRow(data) {
  const row = {};
  for (const key of TRIP_ROW_KEYS) {
    if (data[key] !== undefined) row[key] = data[key];
  }
  return row;
}
