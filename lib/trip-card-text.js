/** Max character lengths for homepage trip card fields. */
export const TRIP_CARD_LIMITS = {
  name: 40,
  tagline: 34,
  price: 30,
  description: 130,
  duration: 22,
  highlight: 18,
};

/** Max character lengths for /trips catalogue cards. */
export const TRIPS_CATALOG_LIMITS = {
  name: 48,
  price: 28,
  duration: 22,
  summary: 120,
  tag: 16,
};

export function truncateForCard(text, maxLen) {
  if (text == null || text === "") return "";
  const str = String(text).trim();
  if (str.length <= maxLen) return str;
  return `${str.slice(0, maxLen - 3).trimEnd()}...`;
}
