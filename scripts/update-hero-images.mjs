import { createClient } from "@supabase/supabase-js";
import axios from "axios";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env.production
dotenv.config({ path: path.resolve(__dirname, "../.env.production") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.production");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function getImageUrl(query) {
  try {
    const queryParam = encodeURIComponent(query.split(" ")[0]); // First word usually is the main place
    const res = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${queryParam}`, {
      headers: { "User-Agent": "AnjaliTourismBot/1.0 (sonubanjare100@gmail.com)" }
    });

    if (res.data && res.data.originalimage && res.data.originalimage.source) {
      return res.data.originalimage.source;
    }
  } catch (error) {
    console.error(`Error fetching image for ${query}:`, error.message);
  }
  return null;
}

async function main() {
  console.log("Fetching trips from Supabase...");
  
  let allTrips = [];
  let page = 0;
  const pageSize = 1000;
  
  while (true) {
    const { data: trips, error } = await supabase
      .from("trips")
      .select("id, name, hero_image")
      .range(page * pageSize, (page + 1) * pageSize - 1);
      
    if (error) {
      console.error("Error fetching trips:", error);
      process.exit(1);
    }
    
    if (trips.length === 0) break;
    allTrips.push(...trips);
    page++;
  }
  
  console.log(`Found ${allTrips.length} trips. Starting update...`);
  
  let updatedCount = 0;
  
  for (let i = 0; i < allTrips.length; i++) {
    const trip = allTrips[i];
    
    // We update all of them even if they already have one, or maybe only if it's the example one.
    // The JSON had "https://example.com/bali-indonesia-hero.jpg". We'll replace all example.com ones.
    if (trip.hero_image && !trip.hero_image.includes("example.com")) {
      console.log(`Skipping ${trip.name} (Already has custom image)`);
      continue;
    }
    
    console.log(`[${i+1}/${allTrips.length}] Searching image for: ${trip.name}`);
    
    // Clean name a bit (e.g. "BALI, INDONESIA" -> "Bali Indonesia")
    const cleanName = trip.name.replace(/[^a-zA-Z0-9 ]/g, " ").trim();
    let imageUrl = await getImageUrl(cleanName);
    
    // Fallback search if no landscape found
    if (!imageUrl) {
      imageUrl = await getImageUrl(cleanName.replace(" landscape", ""));
    }

    if (imageUrl) {
      const { error: updateError } = await supabase
        .from("trips")
        .update({ hero_image: imageUrl })
        .eq("id", trip.id);
        
      if (updateError) {
        console.error(`  -> Failed to update ${trip.name}:`, updateError.message);
      } else {
        console.log(`  -> Updated! ${imageUrl}`);
        updatedCount++;
      }
    } else {
      console.log(`  -> No image found for ${trip.name}`);
    }
    
    await delay(1500); // Prevent rate limiting
  }
  
  console.log(`\nFinished! Successfully updated ${updatedCount} trips.`);
}

main();
