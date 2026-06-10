/**
 * Parse a trip message file and insert into Supabase.
 * Usage: node scripts/insert-trip-from-message.mjs scripts/trips/kedarnath-chopta-auli.txt
 */
import { readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";
import { parseTripMessage } from "../lib/trip-message-parser.js";

const filePath = process.argv[2];
if (!filePath) {
  console.error("Usage: node scripts/insert-trip-from-message.mjs <path-to-message.txt>");
  process.exit(1);
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!url || !key) {
  console.error("Missing Supabase env vars");
  process.exit(1);
}

const messageText = readFileSync(filePath, "utf8");
const trip = parseTripMessage(messageText);

console.log("Parsed trip:", trip.name);
console.log("  slug:", trip.slug);
console.log("  category:", trip.category);
console.log("  highlights:", trip.highlights.length);
console.log("  itinerary:", trip.itinerary.length);
console.log("  inclusions:", trip.inclusions.length);
console.log("  exclusions:", trip.exclusions.length);

const supabase = createClient(url, key);

const { data: existing } = await supabase
  .from("trips")
  .select("id, slug")
  .eq("slug", trip.slug)
  .maybeSingle();

let result;
if (existing) {
  const { data, error } = await supabase
    .from("trips")
    .update(trip)
    .eq("id", existing.id)
    .select()
    .single();
  result = { data, error, action: "updated" };
} else {
  const { data, error } = await supabase.from("trips").insert([trip]).select().single();
  result = { data, error, action: "inserted" };
}

if (result.error) {
  console.error("DB error:", result.error.message);
  process.exit(1);
}

console.log(`Trip ${result.action}:`, result.data.slug);
