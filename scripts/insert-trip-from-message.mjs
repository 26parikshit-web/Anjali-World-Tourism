/**
 * Parse trip message file(s) and insert/update in Supabase.
 * Supports single trip or bulk PACKAGE 1..N files.
 *
 * Usage:
 *   node scripts/insert-trip-from-message.mjs scripts/trips/all-packages.txt
 */
import { readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";
import { parseTripMessages } from "../lib/trip-message-parser.js";

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
const trips = parseTripMessages(messageText);

if (trips.length === 0) {
  console.error("No trips parsed from file");
  process.exit(1);
}

console.log(`Parsed ${trips.length} trip(s)\n`);

const supabase = createClient(url, key);
let inserted = 0;
let updated = 0;
let failed = 0;

for (const trip of trips) {
  console.log(`→ ${trip.name}`);
  console.log(
    `   slug: ${trip.slug} | ${trip.category} | itinerary: ${trip.itinerary.length} | inc: ${trip.inclusions.length} | exc: ${trip.exclusions.length}`
  );

  const { data: existing } = await supabase
    .from("trips")
    .select("id, slug")
    .eq("slug", trip.slug)
    .maybeSingle();

  let error;
  if (existing) {
    ({ error } = await supabase.from("trips").update(trip).eq("id", existing.id));
    if (!error) updated++;
  } else {
    ({ error } = await supabase.from("trips").insert([trip]));
    if (!error) inserted++;
  }

  if (error) {
    console.error(`   ✗ ${error.message}`);
    failed++;
  } else {
    console.log(`   ✓ ${existing ? "updated" : "inserted"}`);
  }
}

console.log(`\nDone: ${inserted} inserted, ${updated} updated, ${failed} failed`);
if (failed > 0) process.exit(1);
