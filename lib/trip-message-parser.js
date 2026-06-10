/**
 * Parses a formatted trip message and extracts structured trip data
 * @param {string} messageText - The formatted message text
 * @returns {object} Parsed trip data
 */
export function parseTripMessage(messageText) {
  if (!messageText || typeof messageText !== "string") {
    throw new Error("Invalid message text");
  }

  const result = {
    name: "",
    slug: "",
    category: "Adventure",
    short_description: "",
    description: "",
    duration: "",
    price: "",
    group_size: "",
    difficulty: "Moderate",
    best_season: "",
    hero_image: "",
    highlights: [],
    itinerary: [],
    inclusions: [],
    exclusions: [],
    tags: [],
    preferences: {
      travel: "",
      hotels: "",
      meals: "",
    },
    is_featured: false,
    is_active: true,
  };

  try {
    // Check if using structured format
    const isStructuredFormat = messageText.includes("=== TRIP DETAILS ===");

    if (isStructuredFormat) {
      return parseStructuredFormat(messageText);
    }

    // Fallback to legacy format parsing
    return parseLegacyFormat(messageText);
  } catch (error) {
    throw new Error(
      `Failed to parse trip message: ${error.message || "Invalid format"}`
    );
  }
}

/**
 * Parses the new structured format
 */
function parseStructuredFormat(messageText) {
  const result = {
    name: "",
    slug: "",
    category: "Adventure",
    short_description: "",
    description: "",
    duration: "",
    price: "",
    group_size: "",
    difficulty: "Moderate",
    best_season: "",
    hero_image: "",
    highlights: [],
    itinerary: [],
    inclusions: [],
    exclusions: [],
    tags: [],
    preferences: {
      travel: "",
      hotels: "",
      meals: "",
    },
    is_featured: false,
    is_active: true,
  };

  // Extract Trip Details section
  const tripDetailsMatch = messageText.match(
    /===\s*TRIP DETAILS\s*===\s*([\s\S]*?)(?:===|$)/i
  );
  if (tripDetailsMatch) {
    const section = tripDetailsMatch[1];

    const nameMatch = section.match(/Trip Name:\s*([^\n]+)/i);
    if (nameMatch) {
      result.name = nameMatch[1].trim();
      result.slug = generateSlug(result.name);
    }

    const categoryMatch = section.match(/Category:\s*([^\n]+)/i);
    if (categoryMatch) {
      result.category = normalizeCategory(categoryMatch[1].trim());
    }

    const shortDescMatch = section.match(/Short Description:\s*([^\n]+)/i);
    if (shortDescMatch) {
      result.short_description = shortDescMatch[1].trim();
    }
  }

  // Extract Full Description
  const fullDescMatch = messageText.match(
    /===\s*FULL DESCRIPTION\s*===\s*([\s\S]*?)(?:===|$)/i
  );
  if (fullDescMatch) {
    result.description = fullDescMatch[1].trim();
  }

  // Extract Day by Day Itinerary
  const itineraryMatch = messageText.match(
    /===\s*DAY BY DAY ITINERARY\s*===\s*([\s\S]*?)(?:===|$)/i
  );
  if (itineraryMatch) {
    const itinerarySection = itineraryMatch[1];
    const dayRegex = /Day\s+(\d+):\s*([^\n]+)\s*\n((?:(?!Day\s+\d+:)[^\n]+\n?)*)/gi;
    let dayMatch;

    while ((dayMatch = dayRegex.exec(itinerarySection)) !== null) {
      const dayNumber = parseInt(dayMatch[1]);
      const dayTitle = dayMatch[2].trim();
      const dayDescription = dayMatch[3].trim();

      result.itinerary.push({
        day: dayNumber,
        title: dayTitle,
        description: dayDescription,
      });
    }
  }

  // Extract Highlights
  const highlightsMatch = messageText.match(
    /===\s*HIGHLIGHTS\s*===\s*([\s\S]*?)(?:===|$)/i
  );
  if (highlightsMatch) {
    result.highlights = extractListItems(highlightsMatch[1]);
  }

  // Extract What's Included (supports straight/curly apostrophe in header)
  const includedMatch = messageText.match(
    /===\s*WHAT['']S INCLUDED\s*===\s*([\s\S]*?)(?=\n===|$)/i
  );
  if (includedMatch) {
    result.inclusions = extractListItems(includedMatch[1]);
  }

  // Extract What's Not Included
  const excludedMatch = messageText.match(
    /===\s*WHAT['']S NOT INCLUDED\s*===\s*([\s\S]*?)(?=\n===|$)/i
  );
  if (excludedMatch) {
    result.exclusions = extractListItems(excludedMatch[1]);
  }

  // Extract Preferences (keeping parser support but not showing in form)
  const preferencesMatch = messageText.match(
    /===\s*PREFERENCES\s*===\s*([\s\S]*?)(?:===|$)/i
  );
  if (preferencesMatch) {
    const section = preferencesMatch[1];

    const travelMatch = section.match(/Travel:\s*([^\n]+)/i);
    if (travelMatch) {
      result.preferences.travel = travelMatch[1].trim();
    }

    const hotelsMatch = section.match(/Hotels:\s*([^\n]+)/i);
    if (hotelsMatch) {
      result.preferences.hotels = hotelsMatch[1].trim();
    }

    const mealsMatch = section.match(/Meals:\s*([^\n]+)/i);
    if (mealsMatch) {
      result.preferences.meals = mealsMatch[1].trim();
    }
  }

  // Extract Trip Information
  const tripInfoMatch = messageText.match(
    /===\s*TRIP INFORMATION\s*===\s*([\s\S]*?)(?:===|$)/i
  );
  if (tripInfoMatch) {
    const section = tripInfoMatch[1];

    const durationMatch = section.match(/Duration:\s*([^\n]+)/i);
    if (durationMatch) {
      result.duration = durationMatch[1].trim();
    }

    const priceMatch = section.match(/Price:\s*([^\n]+)/i);
    if (priceMatch) {
      result.price = priceMatch[1].trim();
    }

    const groupMatch = section.match(/Group Size:\s*([^\n]+)/i);
    if (groupMatch) {
      result.group_size = groupMatch[1].trim();
    }

    const difficultyMatch = section.match(/Difficulty:\s*([^\n]+)/i);
    if (difficultyMatch) {
      result.difficulty = difficultyMatch[1].trim();
    }

    const seasonMatch = section.match(/Best Season:\s*([^\n]+)/i);
    if (seasonMatch) {
      result.best_season = seasonMatch[1].trim();
    }
  }

  // Extract Contact (append to description)
  const contactMatch = messageText.match(
    /===\s*CONTACT\s*===\s*([\s\S]*?)$/i
  );
  if (contactMatch) {
    const contactInfo = contactMatch[1].trim();
    result.description += "\n\n### Contact Information\n" + contactInfo;
  }

  // Generate tags from itinerary and highlights
  result.tags = generateTags(result);

  // Validate that we got some data
  if (!result.name && result.itinerary.length === 0) {
    throw new Error("Could not extract trip name or itinerary from the message.");
  }

  return result;
}

/**
 * Parses the legacy format (old Route-based format)
 */
function parseLegacyFormat(messageText) {
  const result = {
    name: "",
    slug: "",
    category: "Adventure",
    short_description: "",
    description: "",
    duration: "",
    price: "",
    group_size: "",
    difficulty: "Moderate",
    best_season: "",
    hero_image: "",
    highlights: [],
    itinerary: [],
    inclusions: [],
    exclusions: [],
    tags: [],
    preferences: {
      travel: "",
      hotels: "",
      meals: "",
    },
    is_featured: false,
    is_active: true,
  };

  // Extract trip name from title or first heading
  const titleMatch =
    messageText.match(/(?:^|\n)#*\s*TRAVEL\s+DIARY\s*\n([^\n]+)/i) ||
    messageText.match(/(?:^|\n)([A-Z][^\n]+(?:Sightseeing|Tour|Package))/);
  if (titleMatch) {
    result.name = titleMatch[1].trim();
    result.slug = generateSlug(result.name);
  }

    // Extract contact info for description footer
    const contactMatch = messageText.match(
      /Contact\s+([^\n]+)\s*\n*([^\n]+)\s*\n*Email:\s*([^\n]+)\s*\n*WhatsApp:\s*([^\n]+)/i
    );
    let contactInfo = "";
    if (contactMatch) {
      contactInfo = `\n\nContact: ${contactMatch[1].trim()}\n${contactMatch[2].trim()}\nEmail: ${contactMatch[3].trim()}\nWhatsApp: ${contactMatch[4].trim()}`;
    }

    // Extract description from intro text
    const introMatch = messageText.match(
      /To fully explore\s+([^,]+),\s+([^\n]+(?:\n(?!​Route|Route)[^\n]+)*)/i
    );
    if (introMatch) {
      const locationName = introMatch[1].trim();
      if (!result.name) {
        result.name = `${locationName} Sightseeing Package`;
        result.slug = generateSlug(result.name);
      }
      result.description = introMatch[0].trim() + contactInfo;
      result.short_description = `Explore ${locationName} through multiple scenic routes and attractions.`;
    }

    // Extract routes/circuits as itinerary
    // Match both regular "Route" and zero-width space "​Route"
    const routeRegex =
      /(?:^|\n)(?:​)?Route\s+(\d+):\s*([^\n]+)\s*\n((?:(?!(?:​)?Route\s+\d)[^\n]*\n)*)/gi;
    let routeMatch;
    let dayCounter = 1;

    while ((routeMatch = routeRegex.exec(messageText)) !== null) {
      const routeNumber = routeMatch[1];
      const routeTitle = routeMatch[2].trim();
      let routeContent = routeMatch[3].trim();

      // Clean up content - remove zero-width spaces and excessive whitespace
      routeContent = routeContent
        .replace(/​/g, "")
        .replace(/\n{3,}/g, "\n\n")
        .trim();

      // Extract highlights from route description
      const highlights = extractHighlights(routeContent);
      result.highlights.push(...highlights);

      // Create itinerary day with cleaned content
      const maxDescLength = 800;
      const description =
        routeContent.length > maxDescLength
          ? routeContent.substring(0, maxDescLength) + "..."
          : routeContent;

      result.itinerary.push({
        day: dayCounter++,
        title: `Route ${routeNumber}: ${routeTitle}`,
        description: description,
      });
    }

    // Extract logistics section for inclusions/exclusions
    const logisticsMatch = messageText.match(
      /(?:​Important Logistics|Important Logistics)([\s\S]+?)(?:Contact|$)/i
    );
    if (logisticsMatch) {
      const logisticsText = logisticsMatch[1];

      // Parse logistics items as inclusions
      const gypsyMatch = logisticsText.match(/Gypsy Booking:([^\n]+)/i);
      if (gypsyMatch) {
        result.inclusions.push("Gypsy vehicle booking assistance");
      }

      const permitMatch = logisticsText.match(/Forest Permits:([^\n]+)/i);
      if (permitMatch) {
        result.inclusions.push("Forest permit arrangements");
      }

      const guideMatch = logisticsText.match(/Guide:([^\n]+)/i);
      if (guideMatch) {
        result.inclusions.push("Certified guide service");
      }
    }

    // Add common exclusions
    result.exclusions = [
      "Personal expenses",
      "Food and beverages",
      "Entry fees to monuments",
      "Travel insurance",
    ];

    // Extract tags from route titles and categories
    const tagSet = new Set();
    result.itinerary.forEach((day) => {
      const title = day.title.toLowerCase();
      if (title.includes("waterfall")) tagSet.add("Waterfalls");
      if (title.includes("adventure")) tagSet.add("Adventure");
      if (title.includes("spiritual")) tagSet.add("Spiritual");
      if (title.includes("heritage")) tagSet.add("Heritage");
      if (title.includes("sunset") || title.includes("peak"))
        tagSet.add("Scenic Views");
      if (title.includes("forest") || title.includes("cave"))
        tagSet.add("Nature");
    });
    result.tags = Array.from(tagSet);

    // Set category based on content
    if (messageText.toLowerCase().includes("spiritual")) {
      result.category = "Spiritual Journey";
    } else if (messageText.toLowerCase().includes("heritage")) {
      result.category = "Adventure";
    } else {
      result.category = "Family Time";
    }

    // Extract group size if mentioned
    const groupMatch = messageText.match(/(\d+)\s*people/i);
    if (groupMatch) {
      result.group_size = `Up to ${groupMatch[1]} persons`;
    } else {
      result.group_size = "2-10 persons";
    }

    // Set default duration based on number of routes
    result.duration = `${Math.max(2, result.itinerary.length)} Days / ${
      Math.max(1, result.itinerary.length - 1)
    } Nights`;

  // If no data was extracted, throw error
  if (!result.name && result.itinerary.length === 0) {
    throw new Error(
      "Could not parse trip details. Please check the message format."
    );
  }

  return result;
}

/** Map free-text categories from uploads to admin dropdown values. */
function normalizeCategory(raw) {
  const lower = raw.toLowerCase();
  if (lower.includes("spiritual") || lower.includes("pilgrimage")) {
    return "Spiritual Journey";
  }
  if (lower.includes("friend") || lower.includes("getaway")) {
    return "Friends Getaway";
  }
  if (lower.includes("honeymoon")) {
    return "Honeymoon Package";
  }
  if (lower.includes("family")) {
    return "Family Time";
  }
  if (lower.includes("international")) {
    return "International";
  }
  if (lower.includes("adventure")) {
    return "Adventure";
  }
  return raw;
}

/**
 * Extracts list items from a section — supports bullet lines (-, •, *)
 * and plain one-item-per-line format (no bullet prefix).
 */
function extractListItems(content) {
  const points = [];
  const lines = content.split("\n");

  for (const line of lines) {
    let trimmed = line.trim().replace(/​/g, "");
    if (!trimmed || trimmed.startsWith("===")) continue;

    const bulletMatch = trimmed.match(/^[-•*]\s*(.+)/);
    const point = (bulletMatch?.[1] ?? trimmed).trim();

    if (point.length > 0 && point.length < 300 && !/^category:/i.test(point)) {
      points.push(point);
    }
  }

  return points;
}

/**
 * Generates tags from trip data
 */
function generateTags(tripData) {
  const tagSet = new Set();

  // From category
  if (tripData.category) {
    tagSet.add(tripData.category);
  }

  // From itinerary titles
  tripData.itinerary.forEach((day) => {
    const title = day.title.toLowerCase();
    if (title.includes("waterfall")) tagSet.add("Waterfalls");
    if (title.includes("adventure")) tagSet.add("Adventure");
    if (title.includes("spiritual")) tagSet.add("Spiritual");
    if (title.includes("heritage")) tagSet.add("Heritage");
    if (title.includes("sunset") || title.includes("peak"))
      tagSet.add("Scenic Views");
    if (title.includes("forest") || title.includes("cave"))
      tagSet.add("Nature");
    if (title.includes("temple")) tagSet.add("Religious");
    if (title.includes("trek") || title.includes("hiking"))
      tagSet.add("Trekking");
  });

  // From highlights
  tripData.highlights.forEach((highlight) => {
    const lower = highlight.toLowerCase();
    if (lower.includes("temple") || lower.includes("shrine"))
      tagSet.add("Religious");
    if (lower.includes("trek") || lower.includes("climb"))
      tagSet.add("Trekking");
    if (lower.includes("cave")) tagSet.add("Caves");
    if (lower.includes("fall") || lower.includes("cascade"))
      tagSet.add("Waterfalls");
  });

  return Array.from(tagSet).slice(0, 10); // Limit to 10 tags
}

/**
 * Extracts highlights from route content (legacy)
 */
function extractHighlights(content) {
  const highlights = [];
  const lines = content.split("\n");

  for (const line of lines) {
    let trimmed = line.trim();

    // Remove zero-width spaces
    trimmed = trimmed.replace(/​/g, "");

    // Look for bullet points, dashes, or location names with colons
    if (trimmed.match(/^[•\-\*]\s*(.+)/) || trimmed.match(/^([A-Z][^:]+):/)) {
      let match =
        trimmed.match(/^[•\-\*]\s*(.+)/) || trimmed.match(/^([^:]+):/);

      if (match && match[1]) {
        let highlight = match[1].trim();

        // Remove zero-width spaces from highlight
        highlight = highlight.replace(/​/g, "");

        // Clean up common patterns
        highlight = highlight
          .replace(/\s*\([^)]*\)$/, "") // Remove trailing parentheses
          .trim();

        // Validate length and content
        if (
          highlight.length > 5 &&
          highlight.length < 100 &&
          !highlight.toLowerCase().includes("this is") &&
          !highlight.toLowerCase().includes("this route")
        ) {
          highlights.push(highlight);
        }
      }
    }
  }

  return highlights.slice(0, 8); // Limit to 8 highlights per route
}

/**
 * Generates a URL-friendly slug from text
 */
function generateSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
