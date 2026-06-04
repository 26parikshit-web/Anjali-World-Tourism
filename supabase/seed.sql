-- Seed data for Anjali World Tourism
-- Run this AFTER running schema.sql

-- =====================
-- TRIPS DATA
-- =====================

INSERT INTO trips (slug, name, category, short_description, description, duration, price, group_size, difficulty, best_season, hero_image, highlights, itinerary, inclusions, exclusions, gallery, tags, preferences, is_featured, is_active) VALUES

-- Char Dham Yatra
('char-dham-yatra', 'Char Dham Yatra', 'Spiritual Journey', 
'The ultimate pilgrimage circuit covering Yamunotri, Gangotri, Kedarnath & Badrinath.',
'The Char Dham Yatra is one of the most sacred pilgrimage circuits in Hinduism, taking you through four divine destinations nestled in the majestic Garhwal Himalayas. This spiritually enriching journey covers Yamunotri, Gangotri, Kedarnath, and Badrinath – each holding immense religious significance.

Our carefully curated package ensures comfortable travel with senior-friendly pacing, premium accommodations, and optional helicopter services for those who prefer to skip the trek. Every detail is handled manually by our expert team to ensure a seamless divine experience.

The journey begins from Haridwar and takes you through breathtaking mountain landscapes, ancient temples, and holy rivers. Whether you''re seeking spiritual enlightenment or simply wish to witness the Himalayan grandeur, this yatra offers an unforgettable experience.',
'10 Days / 9 Nights', '₹36,000', '2-15 persons', 'Moderate', 'May - June, Sept - Oct',
'/images/chaarDham.webp',
'["Darshan at all four sacred dhams", "Helicopter option for Kedarnath", "Senior-friendly route pacing", "Premium hotel accommodations", "Experienced local guides", "All temple VIP darshan arrangements", "Comfortable AC vehicle transfers", "24/7 on-ground support"]'::jsonb,
'[{"day": 1, "title": "Arrival in Haridwar", "description": "Arrive at Haridwar. Evening Ganga Aarti at Har Ki Pauri. Overnight stay at hotel."},{"day": 2, "title": "Haridwar to Barkot", "description": "Drive to Barkot (210 km). En route visit Kempty Falls. Check-in and rest."},{"day": 3, "title": "Yamunotri Darshan", "description": "Early morning drive to Janki Chatti, then trek/pony ride to Yamunotri temple. Return to Barkot."},{"day": 4, "title": "Barkot to Uttarkashi", "description": "Drive to Uttarkashi (100 km). Visit Vishwanath Temple. Overnight stay."},{"day": 5, "title": "Gangotri Darshan", "description": "Morning drive to Gangotri (100 km). Darshan at Gangotri temple. Return to Uttarkashi."},{"day": 6, "title": "Uttarkashi to Guptkashi", "description": "Scenic drive to Guptkashi (220 km). Visit Ardh Narishwar temple. Rest for next day."},{"day": 7, "title": "Kedarnath Darshan", "description": "Early helicopter/trek to Kedarnath. Darshan at the ancient temple. Return to Guptkashi."},{"day": 8, "title": "Guptkashi to Badrinath", "description": "Drive to Badrinath (190 km). Evening darshan and Aarti. Overnight stay."},{"day": 9, "title": "Badrinath to Rishikesh", "description": "Morning darshan if needed. Drive to Rishikesh (295 km). Evening at leisure."},{"day": 10, "title": "Departure", "description": "Transfer to Haridwar/Dehradun for onward journey. Tour concludes."}]'::jsonb,
'["9 nights accommodation in premium hotels", "All meals (breakfast & dinner)", "AC vehicle for all transfers", "Experienced driver and guide", "All temple darshan arrangements", "Helicopter tickets (if opted)", "First aid kit and oxygen cylinder", "All applicable taxes"]'::jsonb,
'["Personal expenses", "Travel insurance", "Pony/Palki charges", "Tips and gratitude", "Anything not mentioned in inclusions"]'::jsonb,
'[{"type": "image", "src": "/images/chaarDham.webp", "alt": "Char Dham Temple"}]'::jsonb,
'["Pilgrimage", "Helicopter Option", "Family Friendly", "Senior Support"]'::jsonb,
'{"travel": "Bus, Train", "hotels": "3 Star", "meals": "Breakfast & Dinner"}'::jsonb,
true, true),

-- 12 Jyotirlinga
('12-jyotirlinga', '12 Jyotirlinga', 'Spiritual Journey',
'A sacred circuit across India visiting all 12 divine Jyotirlinga shrines.',
'The 12 Jyotirlinga pilgrimage is one of the most revered spiritual journeys in Hinduism. These twelve shrines of Lord Shiva are believed to be self-manifested lingams of divine light, each holding immense spiritual significance.

This comprehensive tour takes you across multiple states in India, from Somnath in Gujarat to Mallikarjuna in Andhra Pradesh, covering all twelve sacred sites. Our manual routing ensures smooth transitions between cities with comfortable stays and temple-timing optimized visits.

Each Jyotirlinga has its unique mythology and architectural beauty. Our expert guides will share the stories and significance of each shrine, making this not just a pilgrimage but a deep spiritual education.',
'14 Days / 13 Nights', '₹49,000', '4-20 persons', 'Easy to Moderate', 'Oct - March',
'/images/jyoti.jpg',
'["Visit all 12 Jyotirlinga shrines", "Multi-city coordinated travel", "VIP darshan at major temples", "Comfortable AC travel", "Expert spiritual guides", "Premium accommodations", "Flexible meal options", "Complete documentation support"]'::jsonb,
'[{"day": 1, "title": "Somnath (Gujarat)", "description": "Arrive at Rajkot/Veraval. Visit Somnath Jyotirlinga. Evening Aarti."},{"day": 2, "title": "Nageshwar & Dwarka", "description": "Visit Nageshwar Jyotirlinga near Dwarka. Evening at Dwarkadhish temple."},{"day": 3, "title": "Travel to Ujjain", "description": "Fly/train to Ujjain, Madhya Pradesh. Rest and evening at leisure."},{"day": 4, "title": "Mahakaleshwar (Ujjain)", "description": "Early morning Bhasma Aarti at Mahakaleshwar. City tour."},{"day": 5, "title": "Omkareshwar & Mamalleshwar", "description": "Day trip to Omkareshwar Jyotirlinga. Return to Ujjain."},{"day": 6, "title": "Travel to Nashik", "description": "Journey to Nashik, Maharashtra. Evening at Godavari Ghat."},{"day": 7, "title": "Trimbakeshwar & Bhimashankar", "description": "Visit Trimbakeshwar Jyotirlinga. Drive to Bhimashankar."},{"day": 8, "title": "Grishneshwar (Aurangabad)", "description": "Visit Grishneshwar Jyotirlinga. Optional Ellora Caves visit."},{"day": 9, "title": "Travel to Varanasi", "description": "Fly to Varanasi. Evening Ganga Aarti at Dashashwamedh Ghat."},{"day": 10, "title": "Kashi Vishwanath", "description": "Early morning darshan at Kashi Vishwanath Jyotirlinga. City exploration."},{"day": 11, "title": "Travel to Jharkhand", "description": "Journey to Deoghar, Jharkhand. Rest at hotel."},{"day": 12, "title": "Baidyanath (Deoghar)", "description": "Darshan at Baidyanath Jyotirlinga. Travel to Srisailam."},{"day": 13, "title": "Mallikarjuna (Srisailam)", "description": "Visit Mallikarjuna Jyotirlinga. Evening Aarti."},{"day": 14, "title": "Rameshwaram & Departure", "description": "Fly to Rameshwaram. Darshan at Ramanathaswamy. Tour concludes."}]'::jsonb,
'["13 nights accommodation", "All inter-city transfers", "Flight tickets as per itinerary", "All temple darshan arrangements", "Daily breakfast", "Experienced tour manager", "All applicable taxes"]'::jsonb,
'["Lunch and dinner", "Personal expenses", "Travel insurance", "Camera fees at temples", "Tips and donations"]'::jsonb,
'[{"type": "image", "src": "/images/jyoti.jpg", "alt": "12 Jyotirlinga Temples"}]'::jsonb,
'["Temple Circuit", "Multi-City", "Manual Routing", "Premium Stays"]'::jsonb,
'{"travel": "Bus, Train, Airways", "hotels": "3-4 Star", "meals": "Breakfast Only"}'::jsonb,
true, true),

-- Panchkedar
('panchkedar', 'Panchkedar Expedition', 'Spiritual Journey',
'A high-altitude yatra to five sacred Kedar shrines in the Garhwal Himalayas.',
'The Panchkedar pilgrimage is an extraordinary spiritual journey to five ancient temples dedicated to Lord Shiva, located at high altitudes in the Garhwal Himalayas of Uttarakhand. According to legend, after the Mahabharata war, the Pandavas sought Lord Shiva to absolve them of sins.

The five temples – Kedarnath, Tungnath, Rudranath, Madhyamaheshwar, and Kalpeshwar – are believed to enshrine different parts of Lord Shiva. This trek combines deep spirituality with breathtaking Himalayan beauty, alpine meadows, and pristine nature.

This expedition requires good physical fitness due to the trekking involved, but our experienced guides and support team ensure a safe and comfortable journey. We provide quality camping equipment, nutritious meals, and proper acclimatization schedules.',
'8 Days / 7 Nights', '₹31,500', '4-12 persons', 'Moderate to Challenging', 'May - June, Sept - Oct',
'/images/panchkedar.webp',
'["Visit all five Kedar shrines", "Professional trek guides", "Quality camping equipment", "Proper acclimatization", "Stunning Himalayan views", "Alpine meadow experiences", "All permits included", "Emergency evacuation support"]'::jsonb,
'[{"day": 1, "title": "Rishikesh to Guptkashi", "description": "Drive from Rishikesh to Guptkashi (190 km). Acclimatization walk. Overnight at hotel."},{"day": 2, "title": "Kedarnath Darshan", "description": "Trek/helicopter to Kedarnath (first Kedar). Darshan and return to Guptkashi."},{"day": 3, "title": "To Chopta", "description": "Drive to Chopta (85 km). Evening walk in the meadows. Camp overnight."},{"day": 4, "title": "Tungnath Darshan", "description": "Trek to Tungnath (second Kedar) – highest Shiva temple. Optional Chandrashila peak. Return to Chopta."},{"day": 5, "title": "Madhyamaheshwar", "description": "Drive and trek to Madhyamaheshwar (third Kedar). Camp near temple."},{"day": 6, "title": "To Rudranath Base", "description": "Trek to Rudranath base camp. Stunning views of Nanda Devi range."},{"day": 7, "title": "Rudranath & Kalpeshwar", "description": "Darshan at Rudranath (fourth Kedar). Descend and drive to Kalpeshwar (fifth Kedar)."},{"day": 8, "title": "Return to Rishikesh", "description": "Early darshan at Kalpeshwar. Drive back to Rishikesh. Tour concludes."}]'::jsonb,
'["7 nights accommodation (hotel + camping)", "All meals during trek", "Professional trek guide", "Camping equipment", "All permits and entries", "First aid and oxygen", "Porter support", "All transfers"]'::jsonb,
'["Personal trekking gear", "Travel insurance", "Helicopter charges", "Personal expenses", "Tips for guides"]'::jsonb,
'[{"type": "image", "src": "/images/panchkedar.webp", "alt": "Panchkedar Temple"}]'::jsonb,
'["Trek Support", "Alpine Camps", "Guide Included", "Himalayan"]'::jsonb,
'{"travel": "Bus", "hotels": "3 Star", "meals": "All Meals Included"}'::jsonb,
false, true),

-- Spiti Valley
('spiti-valley', 'Spiti Valley Circuit', 'Friends Getaway',
'High-altitude road trip through the moonland landscapes of Spiti.',
'Spiti Valley, often called "Little Tibet," is a cold desert mountain valley located high in the Himalayas. This road trip is perfect for adventure-seeking friend groups who want dramatic landscapes, ancient monasteries, and nights under star-filled skies.

The journey takes you through some of the most spectacular roads in India, crossing high passes, visiting ancient Buddhist monasteries, and experiencing the unique culture of the Spiti people. The stark, lunar-like landscapes create a surreal atmosphere unlike anywhere else.

Our package includes comfortable stays in boutique camps and homestays, experienced drivers who know the terrain, and carefully planned stops for the best photography opportunities and cultural experiences.',
'7 Days / 6 Nights', '₹24,000', '4-10 persons', 'Moderate (high altitude)', 'June - September',
'https://images.unsplash.com/photo-1518002054494-3a6f94352e9d?auto=format&fit=crop&w=1200&q=80',
'["Iconic road trip experience", "Ancient monastery visits", "Stargazing in dark sky zones", "Highest villages in the world", "Scenic Kunzum & Rohtang Pass", "Boutique camping experience", "Local Spitian cuisine", "Photography paradise"]'::jsonb,
'[{"day": 1, "title": "Manali to Kaza", "description": "Epic drive over Rohtang and Kunzum Pass. Arrive Kaza by evening."},{"day": 2, "title": "Kaza & Key Monastery", "description": "Visit Key Monastery and Kibber village. Evening stargazing session."},{"day": 3, "title": "Hikkim & Langza", "description": "Visit world''s highest post office. See Buddha statue at Langza. Fossil hunting."},{"day": 4, "title": "Chandratal Lake", "description": "Drive to stunning Chandratal Lake. Camp by the lake."},{"day": 5, "title": "Tabo & Pin Valley", "description": "Visit 1000-year-old Tabo Monastery. Explore Pin Valley National Park."},{"day": 6, "title": "Dhankar & Mud Village", "description": "Visit Dhankar Monastery and lake. Experience Mud village hospitality."},{"day": 7, "title": "Return to Manali", "description": "Scenic drive back to Manali via Atal Tunnel. Tour concludes."}]'::jsonb,
'["6 nights accommodation (camps & homestays)", "All meals", "4x4 vehicle with experienced driver", "All permits", "Bonfire & stargazing sessions", "Monastery entry fees", "Oxygen cylinder backup"]'::jsonb,
'["Personal expenses", "Travel insurance", "Alcoholic beverages", "Tips for staff", "Anything not mentioned"]'::jsonb,
'[{"type": "image", "src": "https://images.unsplash.com/photo-1518002054494-3a6f94352e9d?auto=format&fit=crop&w=1200&q=80", "alt": "Spiti Valley"}]'::jsonb,
'["Road Trip", "Stargazing", "Adventure", "Photography"]'::jsonb,
'{"travel": "Bus", "hotels": "Budget Friendly", "meals": "All Meals Included"}'::jsonb,
true, true),

-- Goa Getaway
('goa-getaway', 'Goa Afterglow', 'Friends Getaway',
'Beach clubs, sunset sails, and flexible villa stays for the perfect group escape.',
'Goa is the ultimate destination for friend groups seeking sun, sand, and great times. Our Goa Afterglow package is designed for those who want flexibility – sleep in, hit the beach, explore local cafes, or party the night away.

We arrange private villa stays that give your group the space and privacy to create your own schedule. Whether you want to lounge by the pool, take a sunset cruise, try water sports, or explore the Portuguese heritage of Old Goa, we''ve got you covered.

The package includes curated experiences while leaving room for spontaneous adventures. Our local contacts ensure you get the best tables, the right parties, and insider access to Goa''s vibrant scene.',
'4 Days / 3 Nights', '₹16,500', '4-12 persons', 'Easy', 'Oct - March',
'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
'["Private villa accommodation", "Sunset cruise experience", "Beach club access", "Water sports included", "Flexible itinerary", "Airport transfers", "Local insider tips", "Party recommendations"]'::jsonb,
'[{"day": 1, "title": "Arrival & Beach Vibes", "description": "Airport pickup. Check into private villa. Evening at Baga/Calangute beach. Welcome dinner."},{"day": 2, "title": "Water Sports & Exploration", "description": "Morning water sports. Afternoon at leisure. Evening sunset cruise with drinks."},{"day": 3, "title": "Old Goa & Nightlife", "description": "Heritage tour of Old Goa. Afternoon pool party. Night out at premium clubs."},{"day": 4, "title": "Brunch & Departure", "description": "Late brunch at beachside café. Check-out and airport transfer."}]'::jsonb,
'["3 nights in private villa", "Daily breakfast", "Airport transfers", "Sunset cruise", "Water sports session", "One club entry", "Local guide/contact"]'::jsonb,
'["Flights", "Lunch and dinner", "Alcoholic beverages", "Personal expenses", "Additional activities"]'::jsonb,
'[{"type": "image", "src": "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80", "alt": "Goa Beach"}]'::jsonb,
'["Beach Villa", "Nightlife", "Sunset Cruise", "Water Sports"]'::jsonb,
'{"travel": "Airways", "hotels": "4 Star", "meals": "Breakfast Only"}'::jsonb,
false, true),

-- Varkala Cliff Escape
('varkala-cliff-escape', 'Varkala Cliff Escape', 'Friends Getaway',
'A soft-paced Kerala coast retreat with cafés, surf, and wellness stops.',
'Varkala is Kerala''s best-kept secret – a stunning cliffside destination where red laterite cliffs meet the Arabian Sea. Unlike the busy beaches of Goa, Varkala offers a more relaxed, bohemian atmosphere perfect for friend groups seeking a slower pace.

The cliff-top stretch is lined with cafés, yoga shalas, and Ayurvedic centers. Spend your mornings with sunrise yoga, afternoons exploring the beach and local temples, and evenings watching the sun dip below the horizon from a cliffside café.

Our package includes comfortable beachside stays, curated café recommendations, and optional wellness experiences like Ayurvedic treatments and surfing lessons.',
'5 Days / 4 Nights', '₹18,000', '2-8 persons', 'Easy', 'Oct - March',
'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
'["Cliffside views", "Yoga sessions", "Ayurvedic spa", "Surf lessons", "Café hopping", "Papanasam Beach", "Temple visits", "Sunset watching"]'::jsonb,
'[{"day": 1, "title": "Arrival at Varkala", "description": "Arrive at Trivandrum airport. Transfer to Varkala. Evening cliff walk and sunset."},{"day": 2, "title": "Beach & Yoga", "description": "Morning yoga session. Beach time at Papanasam. Evening café hopping on the cliff."},{"day": 3, "title": "Temple & Wellness", "description": "Visit Janardhana Swamy Temple. Afternoon Ayurvedic massage. Sunset at Black Beach."},{"day": 4, "title": "Adventure Day", "description": "Optional surfing lesson. Explore Kappil Beach. Farewell dinner at cliff restaurant."},{"day": 5, "title": "Departure", "description": "Leisure morning. Transfer to Trivandrum airport."}]'::jsonb,
'["4 nights accommodation", "Daily breakfast", "Airport transfers", "2 yoga sessions", "One Ayurvedic treatment", "Surf lesson (optional)", "Local guide"]'::jsonb,
'["Flights", "Lunch and dinner", "Personal expenses", "Additional treatments"]'::jsonb,
'[{"type": "image", "src": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80", "alt": "Varkala Cliff"}]'::jsonb,
'["Cliffside", "Ayurveda", "Slow Travel", "Yoga"]'::jsonb,
'{"travel": "Train, Airways", "hotels": "3 Star", "meals": "Breakfast Only"}'::jsonb,
false, true),

-- Tawang Skyline Route
('tawang-skyline-route', 'Tawang Skyline Route', 'Friends Getaway',
'Monasteries, alpine roads, and a rare Northeast group adventure.',
'Tawang in Arunachal Pradesh is one of India''s most remote and beautiful destinations. Home to the largest Buddhist monastery in India and surrounded by snow-capped peaks, it offers a unique cultural and natural experience.

The journey to Tawang is as spectacular as the destination itself – winding through Sela Pass at 13,700 feet, past pristine lakes, and through dense forests. This trip is perfect for adventure-seeking friend groups who want to explore offbeat India.

Our package includes all necessary permits, experienced drivers familiar with the challenging terrain, and stays in the best available accommodations in this remote region.',
'6 Days / 5 Nights', '₹27,500', '4-10 persons', 'Moderate (high altitude)', 'March - June, Sept - Oct',
'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
'["Tawang Monastery", "Sela Pass crossing", "War Memorial", "Madhuri Lake", "Buddhist culture", "Mountain views", "Permits included", "Local cuisine"]'::jsonb,
'[{"day": 1, "title": "Guwahati to Tezpur", "description": "Arrive Guwahati. Drive to Tezpur (180 km). Evening at leisure."},{"day": 2, "title": "Tezpur to Bomdila", "description": "Scenic drive to Bomdila (160 km). Visit local monastery. Overnight stay."},{"day": 3, "title": "Bomdila to Tawang", "description": "Epic drive over Sela Pass. Stop at Jaswant Garh War Memorial. Reach Tawang."},{"day": 4, "title": "Tawang Exploration", "description": "Visit Tawang Monastery, War Memorial. Evening walk in town."},{"day": 5, "title": "Madhuri Lake & Bum La", "description": "Visit PTSO Lake (Madhuri Lake). Optional Bum La Pass excursion."},{"day": 6, "title": "Return Journey", "description": "Drive back to Tezpur/Guwahati for departure."}]'::jsonb,
'["5 nights accommodation", "All meals", "4x4 vehicle", "All permits", "Experienced driver", "Monastery entries", "Oxygen support"]'::jsonb,
'["Flights", "Personal expenses", "Bum La Pass permit (extra)", "Travel insurance"]'::jsonb,
'[{"type": "image", "src": "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80", "alt": "Tawang Monastery"}]'::jsonb,
'["Monastery", "Scenic Drive", "Permits Included", "Northeast"]'::jsonb,
'{"travel": "Airways, Bus", "hotels": "3 Star", "meals": "All Meals Included"}'::jsonb,
false, true),

-- Kasol & Parvati Trails
('kasol-parvati-trails', 'Kasol & Parvati Trails', 'Friends Getaway',
'River trails, café hopping, and easy group energy in the Himachal hills.',
'Kasol, the backpacker''s paradise in Parvati Valley, is perfect for a quick weekend escape with friends. Known for its Israeli cafés, stunning river views, and laid-back vibe, it''s where mountains meet counterculture.

The Parvati River runs through the village, creating a serene backdrop for your adventures. Trek to nearby villages like Chalal and Tosh, try the famous café food, or simply relax by the river with your crew.

Our package keeps things flexible – we arrange comfortable stays and transport, while leaving plenty of room for spontaneous adventures and lazy café afternoons.',
'4 Days / 3 Nights', '₹14,800', '4-12 persons', 'Easy', 'March - June, Sept - Nov',
'https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=1200&q=80',
'["Riverside camping", "Café culture", "Chalal trek", "Tosh village", "Manikaran Gurudwara", "Hot springs", "Bonfire nights", "Mountain views"]'::jsonb,
'[{"day": 1, "title": "Delhi to Kasol", "description": "Overnight Volvo from Delhi. Arrive Kasol by morning. Check-in and explore."},{"day": 2, "title": "Tosh & Chalal", "description": "Morning trek to Chalal village. Afternoon visit to Tosh. Evening café session."},{"day": 3, "title": "Manikaran & Leisure", "description": "Visit Manikaran hot springs and Gurudwara. Afternoon at leisure. Bonfire night."},{"day": 4, "title": "Departure", "description": "Morning by the river. Afternoon departure to Delhi by Volvo."}]'::jsonb,
'["3 nights accommodation", "Volvo tickets (Delhi-Kasol-Delhi)", "Daily breakfast", "Chalal trek guide", "Bonfire arrangement"]'::jsonb,
'["Lunch and dinner", "Personal expenses", "Café bills", "Additional activities"]'::jsonb,
'[{"type": "image", "src": "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=1200&q=80", "alt": "Kasol River"}]'::jsonb,
'["Trekking", "Café Culture", "Weekend Trip", "Budget Friendly"]'::jsonb,
'{"travel": "Bus", "hotels": "Budget Friendly", "meals": "Breakfast Only"}'::jsonb,
false, true),

-- Kashmir Family Retreat
('kashmir-family-retreat', 'Kashmir Family Retreat', 'Family Time',
'Houseboat moments, gardens, and easy scenic pacing for families.',
'Kashmir, the crown jewel of India, offers families an unforgettable experience with its stunning landscapes, serene lakes, and warm hospitality. This package is designed for families seeking comfortable travel with scenic beauty.

Stay in a traditional houseboat on Dal Lake, explore the famous Mughal Gardens, take a Shikara ride at sunset, and enjoy the apple orchards of Pahalgam. The pace is gentle, perfect for families with children or elderly members.

Our team ensures every detail is handled – from comfortable vehicles to family-friendly accommodations, making your Kashmir dream come true.',
'5 Days / 4 Nights', '₹21,000', '2-10 persons', 'Easy', 'April - October',
'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=1200&q=80',
'["Dal Lake houseboat", "Shikara ride", "Mughal Gardens", "Gulmarg excursion", "Pahalgam visit", "Local cuisine", "Family-friendly pace", "Scenic drives"]'::jsonb,
'[{"day": 1, "title": "Arrival in Srinagar", "description": "Airport pickup. Check into houseboat. Evening Shikara ride on Dal Lake."},{"day": 2, "title": "Mughal Gardens", "description": "Visit Nishat, Shalimar, and Chashme Shahi gardens. Local market exploration."},{"day": 3, "title": "Gulmarg Excursion", "description": "Day trip to Gulmarg (51 km). Gondola ride optional. Return to Srinagar."},{"day": 4, "title": "Pahalgam Day", "description": "Drive to Pahalgam (95 km). Visit Betaab Valley and Aru. Return by evening."},{"day": 5, "title": "Departure", "description": "Morning leisure. Airport transfer for departure."}]'::jsonb,
'["4 nights (houseboat + hotel)", "All meals on houseboat", "AC vehicle for transfers", "Shikara ride", "All sightseeing", "Airport transfers"]'::jsonb,
'["Flights", "Gondola tickets", "Personal expenses", "Pony rides"]'::jsonb,
'[{"type": "image", "src": "https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=1200&q=80", "alt": "Kashmir"}]'::jsonb,
'["Nature", "Houseboat", "Easy Pace", "Family Friendly"]'::jsonb,
'{"travel": "Airways", "hotels": "4 Star", "meals": "Breakfast & Dinner"}'::jsonb,
false, true),

-- Kerala Backwaters
('kerala-backwaters', 'Kerala Backwaters', 'Family Time',
'A gentle itinerary with houseboat stays, cultural stops, and comfort transport.',
'Kerala''s backwaters offer a unique experience that families cherish forever. Cruise through palm-fringed canals on a traditional houseboat, watch local life unfold along the banks, and enjoy the freshest seafood cooked onboard.

This package combines the serene backwaters with cultural experiences in Kochi and the tea gardens of Munnar. The pace is relaxed, allowing families to bond while experiencing the best of God''s Own Country.

Every detail is arranged for comfort – from the best houseboats to air-conditioned vehicles and hand-picked family stays.',
'5 Days / 4 Nights', '₹19,500', '2-8 persons', 'Easy', 'Sept - March',
'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=80',
'["Alleppey houseboat", "Kochi Fort", "Kathakali show", "Munnar tea gardens", "Fresh seafood", "Spice garden visit", "Village walks", "Comfortable stays"]'::jsonb,
'[{"day": 1, "title": "Arrival in Kochi", "description": "Airport pickup. Visit Fort Kochi and Chinese fishing nets. Evening Kathakali show."},{"day": 2, "title": "Kochi to Munnar", "description": "Scenic drive to Munnar (130 km). Tea garden visit. Overnight in hill resort."},{"day": 3, "title": "Munnar to Alleppey", "description": "Morning at leisure. Drive to Alleppey. Board houseboat by 12 PM."},{"day": 4, "title": "Backwater Cruise", "description": "Full day on houseboat cruising through backwaters. All meals onboard."},{"day": 5, "title": "Departure", "description": "Disembark after breakfast. Transfer to Kochi airport."}]'::jsonb,
'["4 nights accommodation", "All meals on houseboat", "Breakfast at hotels", "AC vehicle", "Kathakali show", "All transfers"]'::jsonb,
'["Flights", "Lunch and dinner (except houseboat)", "Personal expenses", "Entry fees"]'::jsonb,
'[{"type": "image", "src": "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=80", "alt": "Kerala Backwaters"}]'::jsonb,
'["Backwaters", "Culture", "Premium Stay", "Family"]'::jsonb,
'{"travel": "Airways, Train", "hotels": "4 Star", "meals": "Breakfast Only"}'::jsonb,
false, true),

-- Dubai Family Escape
('dubai-family-escape', 'Dubai Family Escape', 'Family Time',
'Theme parks, skyline evenings, and concierge-ready transfers.',
'Dubai is a playground for families – world-class theme parks, stunning architecture, and experiences that kids and adults love equally. This package covers the best of Dubai while keeping the pace comfortable for families.

From the observation deck of Burj Khalifa to the thrills of IMG Worlds of Adventure, from desert safaris to Dubai Mall''s aquarium, every day brings new excitement. Our concierge service ensures smooth logistics throughout.',
'4 Days / 3 Nights', '₹32,000', '2-8 persons', 'Easy', 'Oct - April',
'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
'["Burj Khalifa", "Desert safari", "Dubai Mall", "Theme parks", "Dubai Frame", "Dhow cruise", "Shopping", "Kids activities"]'::jsonb,
'[{"day": 1, "title": "Arrival & City Tour", "description": "Airport pickup. Check-in. Evening city tour and Dubai Frame visit."},{"day": 2, "title": "Theme Park Day", "description": "Full day at IMG Worlds of Adventure or Dubai Parks. Evening at leisure."},{"day": 3, "title": "Burj Khalifa & Desert", "description": "Visit Burj Khalifa and Dubai Mall. Evening desert safari with BBQ dinner."},{"day": 4, "title": "Departure", "description": "Morning shopping at Global Village (if open). Airport transfer."}]'::jsonb,
'["3 nights 4-star hotel", "Daily breakfast", "Airport transfers", "City tour", "Burj Khalifa entry", "Desert safari with dinner", "Travel insurance"]'::jsonb,
'["Flights", "Visa fees", "Theme park tickets", "Personal shopping", "Lunch and dinner"]'::jsonb,
'[{"type": "image", "src": "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80", "alt": "Dubai Skyline"}]'::jsonb,
'["International", "City Break", "Kids Friendly", "Theme Parks"]'::jsonb,
'{"travel": "Airways", "hotels": "4 Star", "meals": "Breakfast Only"}'::jsonb,
false, true),

-- Kashmir Honeymoon Edit
('kashmir-honeymoon-edit', 'Kashmir Honeymoon Edit', 'Honeymoon Package',
'Lakeside stays, mountain romance, and candlelight dining add-ons.',
'Kashmir is where romance meets natural beauty. This honeymoon package is crafted for couples seeking intimate moments amidst stunning landscapes. Wake up to mountain views, cruise on serene lakes, and dine under the stars.

From a luxurious houseboat on Dal Lake to a cozy resort in Pahalgam, every stay is chosen for its romantic appeal. We arrange special touches like candlelight dinners, couple''s Shikara rides, and room decorations to make your honeymoon unforgettable.',
'6 Days / 5 Nights', '₹28,500', '2 persons', 'Easy', 'April - October',
'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=1200&q=80',
'["Luxury houseboat", "Couple''s Shikara", "Candlelight dinner", "Gulmarg gondola", "Pahalgam romance", "Room decoration", "Private transfers", "Scenic photography spots"]'::jsonb,
'[{"day": 1, "title": "Arrival & Romance Begins", "description": "Airport pickup. Premium houseboat check-in. Evening couple''s Shikara with snacks."},{"day": 2, "title": "Gardens & Dinner", "description": "Visit Mughal Gardens. Candlelight dinner at lakeside restaurant."},{"day": 3, "title": "Gulmarg Day", "description": "Day trip to Gulmarg. Gondola ride together. Return for spa session."},{"day": 4, "title": "Pahalgam Transfer", "description": "Scenic drive to Pahalgam. Check into romantic resort. Evening walk."},{"day": 5, "title": "Pahalgam Exploration", "description": "Visit Betaab Valley and Chandanwari. Farewell dinner with room decoration."},{"day": 6, "title": "Departure", "description": "Late checkout. Transfer to Srinagar airport."}]'::jsonb,
'["5 nights premium stays", "All meals", "Private vehicle", "Shikara ride", "Room decoration", "Candlelight dinner", "Airport transfers"]'::jsonb,
'["Flights", "Gondola tickets", "Spa charges", "Personal expenses"]'::jsonb,
'[{"type": "image", "src": "https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=1200&q=80", "alt": "Kashmir Romance"}]'::jsonb,
'["Romantic", "Mountain Stay", "Private Transfers", "Luxury"]'::jsonb,
'{"travel": "Airways", "hotels": "5 Star", "meals": "All Meals Included"}'::jsonb,
true, true),

-- Bali Sunset Voyage
('bali-sunset-voyage', 'Bali Sunset Voyage', 'Honeymoon Package',
'Villa privacy, beach clubs, and resort-led wellness experiences.',
'Bali is the ultimate honeymoon destination – tropical beaches, stunning temples, world-class spas, and romantic sunsets. This package gives couples the perfect blend of adventure, relaxation, and togetherness.

Stay in a private pool villa, explore ancient temples, enjoy couple''s spa treatments, and dance the night away at Bali''s famous beach clubs. Every moment is designed for romance.',
'6 Days / 5 Nights', '₹45,000', '2 persons', 'Easy', 'April - October',
'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?auto=format&fit=crop&w=1200&q=80',
'["Private pool villa", "Couple''s spa", "Ubud temples", "Beach clubs", "Sunset dinner", "Rice terrace visit", "Water sports", "Romantic photography"]'::jsonb,
'[{"day": 1, "title": "Arrival in Bali", "description": "Airport pickup. Check into private villa. Evening at beach club."},{"day": 2, "title": "Ubud Culture", "description": "Visit Ubud – Monkey Forest, rice terraces, art villages. Evening at villa."},{"day": 3, "title": "Temple & Spa", "description": "Tanah Lot temple visit. Afternoon couple''s spa treatment."},{"day": 4, "title": "Adventure Day", "description": "Water sports or ATV ride. Sunset dinner at Jimbaran Bay."},{"day": 5, "title": "Relaxation", "description": "Pool day at villa. Evening beach club party or romantic dinner."},{"day": 6, "title": "Departure", "description": "Late checkout. Airport transfer."}]'::jsonb,
'["5 nights private villa", "Daily breakfast", "Airport transfers", "Ubud tour", "Tanah Lot visit", "Couple''s spa", "Sunset dinner", "Beach club entry"]'::jsonb,
'["Flights", "Visa (if applicable)", "Lunch and other dinners", "Water sports", "Personal expenses"]'::jsonb,
'[{"type": "image", "src": "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?auto=format&fit=crop&w=1200&q=80", "alt": "Bali Beach"}]'::jsonb,
'["International", "Villa", "Sunset Dinner", "Spa"]'::jsonb,
'{"travel": "Airways", "hotels": "5 Star", "meals": "Breakfast & Dinner"}'::jsonb,
false, true),

-- Udaipur Royal Romance
('udaipur-royal-romance', 'Udaipur Royal Romance', 'Honeymoon Package',
'Lake views, palace stays, and elegant city pacing for couples.',
'Udaipur, the City of Lakes, is India''s most romantic destination. This package offers couples a taste of royal Rajasthan – palatial stays, lake views, candlelight dinners, and the charm of a city that has inspired countless love stories.

From boat rides on Lake Pichola to dinners overlooking the City Palace, every experience is curated for romance. Stay in heritage properties that make you feel like royalty.',
'4 Days / 3 Nights', '₹23,000', '2 persons', 'Easy', 'Sept - March',
'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
'["Lake Pichola boat ride", "City Palace", "Jagmandir Island", "Heritage stay", "Rooftop dinner", "Vintage car ride", "Monsoon Palace sunset", "Cultural show"]'::jsonb,
'[{"day": 1, "title": "Arrival & Lake Magic", "description": "Airport pickup. Heritage hotel check-in. Evening boat ride on Lake Pichola."},{"day": 2, "title": "Palace & Culture", "description": "Visit City Palace and Jagdish Temple. Evening cultural show and dinner."},{"day": 3, "title": "Romance Day", "description": "Jagmandir Island visit. Vintage car ride. Sunset at Monsoon Palace. Rooftop dinner."},{"day": 4, "title": "Departure", "description": "Morning market walk. Airport transfer."}]'::jsonb,
'["3 nights heritage stay", "Daily breakfast", "Lake boat ride", "City Palace entry", "Jagmandir visit", "Airport transfers", "One rooftop dinner"]'::jsonb,
'["Flights", "Lunch and other dinners", "Vintage car ride (optional)", "Personal expenses"]'::jsonb,
'[{"type": "image", "src": "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80", "alt": "Udaipur Lake"}]'::jsonb,
'["Heritage", "Luxury", "Lake City", "Romantic"]'::jsonb,
'{"travel": "Airways, Train", "hotels": "5 Star", "meals": "Breakfast & Dinner"}'::jsonb,
false, true);


-- =====================
-- REVIEWS DATA
-- =====================

INSERT INTO reviews (name, designation, trip, quote, image_url, rating, is_featured, is_approved) VALUES
('Neha & Family', 'Char Dham travelers from Jaipur', 'Char Dham Yatra', 'Everything was handled manually but so carefully that we never felt lost. Hotel changes, temple timing, and elder assistance were all sorted before we even had to ask.', 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=900&q=80', 5, true, true),
('Raghav''s Group', 'Friends getaway to Spiti', 'Spiti Valley Circuit', 'The route felt cinematic from start to finish. Our stays were well picked, the road days were paced properly, and the whole trip felt made for our group instead of copy-pasted.', 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=900&q=80', 5, true, true),
('Sonal & Vivek', 'Honeymoon couple', 'Kashmir Honeymoon Edit', 'We wanted something romantic without it feeling generic. The team balanced scenic moments, privacy, and smooth local support beautifully.', 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=900&q=80', 5, true, true),
('Anita Mehra', 'Family traveler', 'Kerala Backwaters', 'This was the first family trip in years where everyone, from kids to grandparents, felt considered. The pace was gentle and the support was immediate.', 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=900&q=80', 5, false, true),
('Dev & Crew', 'Goa group escape', 'Goa Afterglow', 'We mainly wanted a smooth group trip with no planning chaos. Transfers, villa coordination, and add-on activities were all handled without the usual back-and-forth.', 'https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=900&q=80', 5, false, true),
('Priya Nair', 'Dubai family holiday', 'Dubai Family Escape', 'The international paperwork support made the whole process lighter. We had clear guidance, quick responses, and a trip that felt polished end to end.', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80', 5, false, true),
('Arjun', 'Panchkedar traveler', 'Panchkedar Expedition', 'The manual team kept checking route conditions and stay quality all along the way. It felt dependable at a time when that matters most.', 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80', 5, false, true),
('Mitali', 'Varkala getaway', 'Varkala Cliff Escape', 'The trip had exactly the mood we were hoping for. Easy, breezy, and beautiful without feeling over-planned.', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80', 5, false, true),
('Karan', 'Kasol long weekend', 'Kasol & Parvati Trails', 'The itinerary fit a short break perfectly. No wasted time, no messy transfers, and the right mix of chill and adventure.', 'https://images.unsplash.com/photo-1541417904950-b855846fe074?auto=format&fit=crop&w=900&q=80', 5, false, true);


-- =====================
-- GALLERY DATA
-- =====================

INSERT INTO gallery (title, image_url, category) VALUES
('Char Dham Temple View', '/images/chaarDham.webp', 'Spiritual'),
('Jyotirlinga Shrine', '/images/jyoti.jpg', 'Spiritual'),
('Panchkedar Mountains', '/images/panchkedar.webp', 'Spiritual'),
('Spiti Valley Landscape', 'https://images.unsplash.com/photo-1518002054494-3a6f94352e9d?auto=format&fit=crop&w=1200&q=80', 'Mountains'),
('Goa Beach Sunset', 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80', 'Beach'),
('Varkala Cliffs', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80', 'Beach'),
('Tawang Monastery', 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80', 'Culture'),
('Kasol River Valley', 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=1200&q=80', 'Mountains'),
('Kashmir Dal Lake', 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=1200&q=80', 'Destinations'),
('Kerala Backwaters', 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=80', 'Destinations'),
('Dubai Skyline', 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80', 'Destinations'),
('Bali Temple', 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?auto=format&fit=crop&w=1200&q=80', 'Destinations'),
('Udaipur Lake Palace', 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80', 'Destinations');
