# Database Migration Guide - Preferences Feature

## Overview
This guide explains how to add the `preferences` field to your existing Supabase database.

## What's Being Added

A new column `preferences` to the `trips` table that stores:
- **travel**: Transportation options (e.g., "Bus, Train, Airways")
- **hotels**: Hotel category (e.g., "3 Star", "4 Star", "5 Star")
- **meals**: Meal plan (e.g., "Breakfast Only", "All Meals Included")

## Migration Methods

### Method 1: Using the Migration File (Recommended)

1. **Go to Supabase Dashboard**
   - Open your project at https://supabase.com/dashboard
   - Navigate to: SQL Editor

2. **Run the Migration**
   - Copy contents from: `supabase/migrations/add_preferences.sql`
   - Paste into SQL Editor
   - Click "Run"

3. **Verify**
   ```sql
   SELECT column_name, data_type, column_default
   FROM information_schema.columns
   WHERE table_name = 'trips' AND column_name = 'preferences';
   ```

### Method 2: Quick ALTER (Manual)

Run this SQL in your Supabase SQL Editor:

```sql
-- Add preferences column
ALTER TABLE trips 
ADD COLUMN preferences JSONB DEFAULT '{"travel": "", "hotels": "", "meals": ""}'::jsonb;

-- Update existing rows
UPDATE trips 
SET preferences = '{"travel": "", "hotels": "", "meals": ""}'::jsonb
WHERE preferences IS NULL;
```

### Method 3: Fresh Setup

If you're setting up a fresh database, use the updated `supabase/schema.sql` file which already includes the preferences column.

## Verify Migration

After running the migration, verify it worked:

```sql
-- Check column exists
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'trips' AND column_name = 'preferences';

-- Check existing trips have default preferences
SELECT id, name, preferences 
FROM trips 
LIMIT 5;
```

Expected output:
```
{
  "travel": "",
  "hotels": "",
  "meals": ""
}
```

## Rollback (If Needed)

If you need to remove the preferences column:

```sql
ALTER TABLE trips DROP COLUMN IF EXISTS preferences;
```

## Sample Data with Preferences

Here are some examples of how preferences look in the database:

### Budget Trip
```json
{
  "travel": "Bus",
  "hotels": "3 Star",
  "meals": "Not Included"
}
```

### Mid-Range Trip
```json
{
  "travel": "Bus, Train",
  "hotels": "3 Star",
  "meals": "Breakfast Only"
}
```

### Luxury Package
```json
{
  "travel": "Airways",
  "hotels": "5 Star",
  "meals": "All Meals Included"
}
```

### Flexible Options
```json
{
  "travel": "Bus, Train, Airways",
  "hotels": "3-4 Star",
  "meals": "Breakfast & Dinner"
}
```

## Update Existing Trips

To add preferences to existing trips, run:

```sql
-- Update a specific trip
UPDATE trips 
SET preferences = '{"travel": "Bus, Train", "hotels": "3 Star", "meals": "Breakfast Only"}'::jsonb
WHERE slug = 'char-dham-yatra';

-- Or update multiple trips at once
UPDATE trips 
SET preferences = jsonb_build_object(
  'travel', 'Bus, Train',
  'hotels', '3 Star',
  'meals', 'Breakfast Only'
)
WHERE category = 'Spiritual Journey';
```

## Querying Preferences

### Get trips by travel preference:
```sql
SELECT name, preferences->>'travel' as travel_options
FROM trips
WHERE preferences->>'travel' LIKE '%Airways%';
```

### Get trips by hotel category:
```sql
SELECT name, preferences->>'hotels' as hotel_category
FROM trips
WHERE preferences->>'hotels' = '5 Star';
```

### Get trips by meal plan:
```sql
SELECT name, preferences->>'meals' as meal_plan
FROM trips
WHERE preferences->>'meals' LIKE '%Breakfast%';
```

## TypeScript Types (Optional)

If using TypeScript, update your types:

```typescript
interface TripPreferences {
  travel: string;
  hotels: string;
  meals: string;
}

interface Trip {
  id: string;
  slug: string;
  name: string;
  // ... other fields
  preferences: TripPreferences;
  // ... more fields
}
```

## Troubleshooting

### Error: "column already exists"
This means the migration was already run. You can safely ignore this.

### Error: "permission denied"
Make sure you're running the SQL as the database owner or with proper permissions.

### Preferences not showing in queries
Check that the column exists:
```sql
\d trips  -- In psql
-- or
SELECT * FROM information_schema.columns WHERE table_name = 'trips';
```

## Next Steps

After migration:
1. ✅ Column added to database
2. ✅ Frontend form has preferences fields
3. ✅ Parser extracts preferences from uploaded text
4. ✅ Preview shows preferences
5. ✅ Everything saves correctly

Now you can:
- Add preferences to existing trips
- Upload new trips with preferences
- Filter trips by preferences (frontend feature)
- Display preferences on trip pages

## Support

If you encounter issues:
1. Check Supabase logs in Dashboard → Database → Logs
2. Verify your Supabase project has the latest schema
3. Test with a single trip first before bulk updates

---

**Migration complete!** Your database now supports preferences. 🎉
