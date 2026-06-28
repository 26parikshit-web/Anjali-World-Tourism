import { createClient } from "@supabase/supabase-js";
import fs from "fs";
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

async function main() {
  try {
    const filePath = path.resolve(__dirname, "../anjali_world_tourism_all_packages.json");
    console.log(`Reading file: ${filePath}`);
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    
    if (!Array.isArray(data)) {
      throw new Error("JSON data should be an array of trip objects.");
    }
    
    console.log(`Found ${data.length} trips to insert.`);
    
    const { data: inserted, error } = await supabase
      .from("trips")
      .insert(data)
      .select();
      
    if (error) {
      console.error("Failed to insert:", error);
      process.exit(1);
    }
    
    console.log(`Successfully inserted ${inserted.length} trips!`);
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
