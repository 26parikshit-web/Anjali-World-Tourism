# Trips Bulk Upload API Documentation

This document explains how to use the Bulk Upload API for trips, including the required JSON payload format and how to trigger it via `curl` or the admin interface.

## API Endpoint
**URL**: `POST /api/trips/bulk`
**Content-Type**: `application/json`

## Required JSON Payload

The API expects a JSON **array** of trip objects. Below is the required JSON payload for a trip (the same fields expected by the existing manual creation).

```json
[
  {
    "name": "Weekend Getaway in the Mountains",
    "slug": "weekend-getaway-mountains",
    "category": "Adventure",
    "short_description": "A thrilling weekend trip to the nearest peak.",
    "description": "Experience nature like never before with guided treks, campfire, and more.",
    "duration": "2 Days / 1 Night",
    "price": "₹ 5,000",
    "pricing_packages": [
      {
        "title": "Standard",
        "price": 5000,
        "description": "Includes stay and meals"
      }
    ],
    "discount_percent": 10,
    "discount_ends_at": "2024-12-31T23:59:00",
    "group_size": "5-15 persons",
    "difficulty": "Moderate",
    "best_season": "Sep - March",
    "hero_image": "https://example.com/image.jpg",
    "highlights": [
      "Guided trek",
      "Campfire night"
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "Arrival & Setup",
        "description": "Reach the basecamp, pitch tents and enjoy."
      },
      {
        "day": 2,
        "title": "Summit & Return",
        "description": "Trek to the summit and head back."
      }
    ],
    "inclusions": [
      "Accommodation in tents",
      "All meals"
    ],
    "exclusions": [
      "Travel to basecamp",
      "Personal expenses"
    ],
    "gallery": [
      "https://example.com/gallery1.jpg",
      "https://example.com/gallery2.jpg"
    ],
    "tags": ["weekend", "trek"],
    "is_featured": true,
    "is_active": true
  }
]
```

### Important Fields Explanation:
- `slug` (string): Unique identifier for the URL. Must contain only lowercase letters, numbers, and hyphens.
- `name` (string): Title of the trip.
- `pricing_packages` (array): Array of pricing objects. A standard price is typically required.
- `discount_percent` (number, optional): e.g., 10 for 10% off.
- `discount_ends_at` (datetime string, optional): ISO string indicating when the discount expires.
- `is_active` (boolean): Whether the trip should be publicly visible immediately.

## Using the API via cURL

To upload trips directly via terminal or script, you can use the `curl` command. Ensure your payload is saved in a file (e.g., `trips.json`).

### Step 1: Prepare your data
Save your JSON array in `trips.json`.

### Step 2: Run the cURL command

```bash
curl -X POST http://localhost:3000/api/trips/bulk \
  -H "Content-Type: application/json" \
  -d @trips.json
```
*(Replace `http://localhost:3000` with your production URL if running in production. Note: depending on your setup, you may need to pass authentication cookies if the API is protected by Next.js middleware).*

## Using the Admin Dashboard

You can also use the graphical interface directly from the admin panel:
1. Navigate to **Admin > Trips**.
2. Click the **Bulk Upload** button at the top right.
3. Either click to upload your `.json` file, or paste your JSON array directly into the text box.
4. Click **Upload Data**.
