/** Columns on the `group_trips` table. */
const GROUP_TRIP_ROW_KEYS = [
  "slug",
  "name",
  "hosted_place",
  "departure_date",
  "max_capacity",
  "spots_booked",
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
  "is_active",
];

export function pickGroupTripRow(data) {
  const row = {};
  for (const key of GROUP_TRIP_ROW_KEYS) {
    if (data[key] !== undefined) row[key] = data[key];
  }
  return row;
}
