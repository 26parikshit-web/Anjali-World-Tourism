import { createClient } from "@supabase/supabase-js";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env.production") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.production");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

function formatPrice(amount) {
  return "Rs. " + amount.toLocaleString("en-IN");
}

async function main() {
  console.log("Fetching trips from Supabase...");
  
  let allTrips = [];
  let page = 0;
  const pageSize = 1000;
  
  while (true) {
    const { data: trips, error } = await supabase
      .from("trips")
      .select("id, name, price, pricing_packages")
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
    
    if (!trip.pricing_packages || !Array.isArray(trip.pricing_packages) || trip.pricing_packages.length === 0) {
      console.log(`Skipping ${trip.name} (No pricing packages)`);
      continue;
    }

    let lowestPrice = Infinity;
    
    // Increase each package price by 15%
    const updatedPackages = trip.pricing_packages.map(pkg => {
      const currentPrice = pkg.price;
      if (typeof currentPrice === "number") {
        const newPrice = Math.round(currentPrice * 1.15);
        if (newPrice < lowestPrice) lowestPrice = newPrice;
        return { ...pkg, price: newPrice };
      }
      return pkg;
    });

    const newPriceString = lowestPrice !== Infinity ? formatPrice(lowestPrice) : trip.price;
    
    const { error: updateError } = await supabase
      .from("trips")
      .update({ 
        pricing_packages: updatedPackages,
        price: newPriceString
      })
      .eq("id", trip.id);
      
    if (updateError) {
      console.error(`  -> Failed to update ${trip.name}:`, updateError.message);
    } else {
      updatedCount++;
    }
  }
  
  console.log(`\nFinished! Successfully updated prices for ${updatedCount} trips by 15%.\n`);
}

main();
