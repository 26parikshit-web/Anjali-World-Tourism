import os

replacements = {
    "app/admin/bookings/bookings-manager.jsx": ('select("*")', 'select("id, created_at, booking_kind, trip_id, razorpay_order_id, razorpay_payment_id, amount_paid, customer_name, customer_email, customer_phone, travel_date, travelers_count, special_requests, payment_status, booking_status")'),
    "app/admin/bookings/page.jsx": ('select("*")', 'select("id, created_at, booking_kind, trip_id, razorpay_order_id, razorpay_payment_id, amount_paid, customer_name, customer_email, customer_phone, travel_date, travelers_count, special_requests, payment_status, booking_status")'),
    "app/admin/contacts/page.jsx": ('select("*")', 'select("id, created_at, name, email, phone, subject, message, status")'),
    "app/admin/dashboard/page.jsx": ('.select("*")', '.select("id, name, email, status, created_at")'),
    "app/admin/enquiries/enquiries-manager.jsx": ('select("*")', 'select("id, created_at, name, phone, trip_name, travel_date, travelers, details, status, source")'),
    "app/admin/enquiries/page.jsx": ('select("*")', 'select("id, created_at, name, phone, trip_name, travel_date, travelers, details, status, source")'),
    "app/admin/gallery/page.jsx": ('select("*")', 'select("id, image_url, trip_id, display_order, alt_text, created_at")'),
    "app/admin/group-trips/[id]/page.jsx": ('select("*")', 'select("id, created_at, updated_at, name, slug, departure_date, hosted_place, capacity, price, hero_image, short_description, description, highlights, itinerary, gallery, inclusions, exclusions, tags, is_active, is_featured")'),
    "app/admin/group-trips/page.jsx": ('select("*")', 'select("id, created_at, updated_at, name, slug, departure_date, hosted_place, capacity, price, hero_image, short_description, is_active, is_featured")'),
    "app/admin/reviews/page.jsx": ('select("*")', 'select("id, created_at, name, designation, trip, quote, image, is_approved, is_featured")'),
    "app/admin/settings/page.jsx": ('select("*")', 'select("id, key, value, created_at, updated_at")'),
    "app/admin/trips/[id]/page.jsx": ('select("*")', 'select("id, created_at, updated_at, name, slug, category, duration, price, hero_image, short_description, description, highlights, itinerary, gallery, inclusions, exclusions, tags, is_active, is_featured")'),
    "app/admin/trips/page.jsx": ('select("*")', 'select("id, created_at, updated_at, name, slug, category, duration, price, hero_image, short_description, is_active, is_featured")'),
    "app/api/admin/reviews/approve/route.js": ('select("*")', 'select("id, created_at, name, designation, trip, quote, image, is_approved, is_featured")'),
}

for file_path, (old_str, new_str) in replacements.items():
    if os.path.exists(file_path):
        with open(file_path, "r") as f:
            content = f.read()
        if old_str in content:
            new_content = content.replace(old_str, new_str)
            with open(file_path, "w") as f:
                f.write(new_content)
            print(f"Replaced in {file_path}")
        else:
            print(f"String not found in {file_path}")
    else:
        print(f"File not found: {file_path}")
