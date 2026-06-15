"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { revalidateTripsOnServer, revalidateGroupTripsOnServer } from "@/lib/revalidate-trips-client";
import { pickTripRow } from "@/lib/trip-row";
import { pickGroupTripRow } from "@/lib/group-trip-row";
import { normalizeGallery } from "@/lib/trip-media";
import { TripMediaEditor } from "@/components/admin/trip-media-editor";
import {
  TripPricingEditor,
  fromDatetimeLocalValue,
  toDatetimeLocalValue,
} from "@/components/admin/trip-pricing-editor";
import { showError } from "@/lib/toast";
import {
  buildPricingPackagesFromFormRows,
  deriveLegacyPriceLabel,
  pricingPackagesToFormRows,
} from "@/lib/trip-pricing";

const categories = [
  "Spiritual Journey",
  "Friends Getaway",
  "Family Time",
  "Honeymoon Package",
  "Adventure",
  "International",
];

const difficulties = ["Easy", "Moderate", "Challenging", "Difficult"];

export function TripForm({ trip, variant = "trip" }) {
  const router = useRouter();
  const supabase = createClient();
  const isEditing = !!trip;
  const isGroup = variant === "group";
  const table = isGroup ? "group_trips" : "trips";
  const adminListPath = isGroup ? "/admin/group-trips" : "/admin/trips";

  const [loading, setLoading] = useState(false);

  // Initialize form data
  const getInitialFormData = () => {
    // Check for draft data from upload
    if (typeof window !== "undefined" && !trip) {
      const draftData = sessionStorage.getItem("tripDraft");
      if (draftData) {
        try {
          const parsed = JSON.parse(draftData);
          sessionStorage.removeItem("tripDraft"); // Clear after loading
          return pickTripRow(parsed);
        } catch (err) {
          console.error("Failed to parse draft data:", err);
        }
      }
    }

    // Return default or existing trip data
    return {
      name: trip?.name || "",
      slug: trip?.slug || "",
      category: trip?.category || categories[0],
      short_description: trip?.short_description || "",
      description: trip?.description || "",
      duration: trip?.duration || "",
      price: trip?.price || "",
      group_size: trip?.group_size || "",
      difficulty: trip?.difficulty || difficulties[0],
      best_season: trip?.best_season || "",
      hero_image: trip?.hero_image || "",
      gallery: trip?.gallery || [],
      highlights: trip?.highlights || [],
      itinerary: trip?.itinerary || [],
      inclusions: trip?.inclusions || [],
      exclusions: trip?.exclusions || [],
      tags: trip?.tags || [],
      is_featured: trip?.is_featured || false,
      is_active: trip?.is_active ?? true,
      pricing_packages: trip?.pricing_packages || [],
      discount_percent: trip?.discount_percent ?? "",
      discount_ends_at: trip?.discount_ends_at || null,
      hosted_place: trip?.hosted_place || "",
      departure_date: trip?.departure_date || null,
      max_capacity: trip?.max_capacity ?? 20,
      spots_booked: trip?.spots_booked ?? 0,
    };
  };

  const [formData, setFormData] = useState(getInitialFormData());
  const [pricingRows, setPricingRows] = useState(() => pricingPackagesToFormRows(trip));
  const [discountPercent, setDiscountPercent] = useState(
    trip?.discount_percent != null && trip?.discount_percent !== ""
      ? String(trip.discount_percent)
      : ""
  );
  const [discountEndsAt, setDiscountEndsAt] = useState(
    toDatetimeLocalValue(trip?.discount_ends_at)
  );
  const [departureAt, setDepartureAt] = useState(
    toDatetimeLocalValue(trip?.departure_date)
  );
  const [isLoadedFromUpload, setIsLoadedFromUpload] = useState(false);

  // Check if data was loaded from upload
  useEffect(() => {
    if (typeof window !== "undefined" && !trip) {
      const draftData = sessionStorage.getItem("tripDraft");
      if (draftData) {
        setIsLoadedFromUpload(true);
      }
    }
  }, [trip]);

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name,
      slug: isEditing ? prev.slug : generateSlug(name),
    }));
  };

  const handleArrayAdd = (field, defaultValue = "") => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], defaultValue],
    }));
  };

  const handleArrayChange = (field, index, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const handleArrayRemove = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleItineraryAdd = () => {
    setFormData((prev) => ({
      ...prev,
      itinerary: [
        ...prev.itinerary,
        { day: prev.itinerary.length + 1, title: "", description: "" },
      ],
    }));
  };

  const handleItineraryChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      itinerary: prev.itinerary.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const pricing_packages = buildPricingPackagesFromFormRows(pricingRows);
      if (pricing_packages.length === 0) {
        throw new Error("Add at least a Standard package price.");
      }

      const parsedDiscount = discountPercent ? Number.parseFloat(discountPercent) : null;
      if (parsedDiscount != null && (parsedDiscount < 0 || parsedDiscount > 100)) {
        throw new Error("Discount must be between 0 and 100.");
      }
      if (parsedDiscount > 0 && !discountEndsAt) {
        throw new Error("Set an end date/time for the discount.");
      }

      if (isGroup) {
        if (!formData.hosted_place?.trim()) {
          throw new Error("Hosted place is required for group trips.");
        }
        if (!departureAt) {
          throw new Error("Departure date and time are required.");
        }
        const capacity = Number.parseInt(String(formData.max_capacity), 10);
        if (!capacity || capacity < 1) {
          throw new Error("Max capacity must be at least 1.");
        }
        const booked = Number.parseInt(String(formData.spots_booked), 10) || 0;
        if (booked > capacity) {
          throw new Error("Spots booked cannot exceed max capacity.");
        }
      }

      const rowPicker = isGroup ? pickGroupTripRow : pickTripRow;
      const dataToSave = rowPicker({
        ...formData,
        price: deriveLegacyPriceLabel(pricing_packages),
        pricing_packages,
        discount_percent: parsedDiscount > 0 ? parsedDiscount : null,
        discount_ends_at: parsedDiscount > 0 ? fromDatetimeLocalValue(discountEndsAt) : null,
        ...(isGroup
          ? {
              hosted_place: formData.hosted_place.trim(),
              departure_date: fromDatetimeLocalValue(departureAt),
              max_capacity: Number.parseInt(String(formData.max_capacity), 10),
              spots_booked: Number.parseInt(String(formData.spots_booked), 10) || 0,
            }
          : {}),
        gallery: normalizeGallery(formData.gallery),
        highlights: formData.highlights.filter(Boolean),
        inclusions: formData.inclusions.filter(Boolean),
        exclusions: formData.exclusions.filter(Boolean),
        tags: formData.tags.filter(Boolean),
      });

      if (isEditing) {
        const { error } = await supabase
          .from(table)
          .update(dataToSave)
          .eq("id", trip.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from(table).insert([dataToSave]);
        if (error) throw error;
      }

      if (isGroup) {
        await revalidateGroupTripsOnServer();
      } else {
        await revalidateTripsOnServer();
      }

      router.push(adminListPath);
      router.refresh();
    } catch (err) {
      showError(err.message, e.currentTarget);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8" data-error-anchor>
      {isLoadedFromUpload && (
        <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 text-sm">
          <div className="flex items-start gap-2">
            <svg
              className="w-5 h-5 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="font-semibold">Trip data loaded from upload</p>
              <p className="text-sm mt-0.5">
                Review and edit the auto-populated fields below before saving.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Basic Info */}
      <div className="bg-white rounded-xl border border-zinc-200 p-6">
        <h2 className="text-base font-semibold text-zinc-900 mb-4">
          Basic Information
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-zinc-700 mb-1.5">
              Trip Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={handleNameChange}
              required
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm outline-none focus:border-zinc-400 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1.5">
              Slug *
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, slug: e.target.value }))
              }
              required
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm outline-none focus:border-zinc-400 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1.5">
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, category: e.target.value }))
              }
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm outline-none focus:border-zinc-400 focus:bg-white"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-zinc-700 mb-1.5">
              Short Description
            </label>
            <input
              type="text"
              value={formData.short_description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  short_description: e.target.value,
                }))
              }
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm outline-none focus:border-zinc-400 focus:bg-white"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-zinc-700 mb-1.5">
              Full Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              rows={5}
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm outline-none focus:border-zinc-400 focus:bg-white resize-none"
            />
          </div>
        </div>
      </div>

      {isGroup && (
        <div
          className="bg-white rounded-xl border border-zinc-200 p-6"
          data-error-anchor="date"
          data-field="date"
        >
          <h2 className="text-base font-semibold text-zinc-900 mb-4">Group departure</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                Hosted place *
              </label>
              <input
                type="text"
                name="hosted_place"
                data-field="place"
                value={formData.hosted_place}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, hosted_place: e.target.value }))
                }
                placeholder="e.g., Kedarnath, Spiti Valley"
                required
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm outline-none focus:border-zinc-400 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                Departure date & time *
              </label>
              <input
                type="datetime-local"
                name="departure_date"
                data-field="date"
                value={departureAt}
                onChange={(e) => setDepartureAt(e.target.value)}
                required
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm outline-none focus:border-zinc-400 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                Max capacity (slots) *
              </label>
              <input
                type="number"
                name="max_capacity"
                data-field="capacity"
                min="1"
                value={formData.max_capacity}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, max_capacity: e.target.value }))
                }
                required
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm outline-none focus:border-zinc-400 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                Spots booked
              </label>
              <input
                type="number"
                min="0"
                value={formData.spots_booked}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, spots_booked: e.target.value }))
                }
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm outline-none focus:border-zinc-400 focus:bg-white"
              />
              <p className="mt-1 text-[11px] text-zinc-500">
                Usually auto-updated on payment. Adjust manually if needed.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Trip Details */}
      <div className="bg-white rounded-xl border border-zinc-200 p-6">
        <h2 className="text-base font-semibold text-zinc-900 mb-4">
          Trip Details
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1.5">
              Duration
            </label>
            <input
              type="text"
              value={formData.duration}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, duration: e.target.value }))
              }
              placeholder="e.g., 5 Days / 4 Nights"
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm outline-none focus:border-zinc-400 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1.5">
              Display price (auto)
            </label>
            <input
              type="text"
              value={deriveLegacyPriceLabel(buildPricingPackagesFromFormRows(pricingRows)) || formData.price}
              readOnly
              className="w-full rounded-xl border border-zinc-200 bg-zinc-100 px-4 py-2.5 text-sm text-zinc-600"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1.5">
              Group Size
            </label>
            <input
              type="text"
              value={formData.group_size}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, group_size: e.target.value }))
              }
              placeholder="e.g., 2-10 persons"
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm outline-none focus:border-zinc-400 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1.5">
              Difficulty
            </label>
            <select
              value={formData.difficulty}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, difficulty: e.target.value }))
              }
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm outline-none focus:border-zinc-400 focus:bg-white"
            >
              {difficulties.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1.5">
              Best Season
            </label>
            <input
              type="text"
              value={formData.best_season}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, best_season: e.target.value }))
              }
              placeholder="e.g., Oct - March"
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm outline-none focus:border-zinc-400 focus:bg-white"
            />
          </div>
        </div>

        <div className="flex items-center gap-6 mt-4 pt-4 border-t border-zinc-100">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, is_active: e.target.checked }))
              }
              className="rounded border-zinc-300"
            />
            <span className="text-sm text-zinc-700">Active</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_featured}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  is_featured: e.target.checked,
                }))
              }
              className="rounded border-zinc-300"
            />
            <span className="text-sm text-zinc-700">Featured</span>
          </label>
        </div>
      </div>

      <div
        className="bg-white rounded-xl border border-zinc-200 p-6"
        data-error-anchor="pricing"
        data-field="pricing"
      >
        <h2 className="text-base font-semibold text-zinc-900 mb-4">Pricing & packages</h2>
        <TripPricingEditor
          rows={pricingRows}
          discountPercent={discountPercent}
          discountEndsAt={discountEndsAt}
          onRowsChange={setPricingRows}
          onDiscountChange={({ discountPercent: nextPercent, discountEndsAt: nextEndsAt }) => {
            if (nextPercent !== undefined) setDiscountPercent(nextPercent);
            if (nextEndsAt !== undefined) setDiscountEndsAt(nextEndsAt);
          }}
        />
      </div>

      {/* Images & Videos */}
      <div className="bg-white rounded-xl border border-zinc-200 p-6">
        <h2 className="text-base font-semibold text-zinc-900 mb-4">Images & Videos</h2>
        <TripMediaEditor
          gallery={formData.gallery}
          heroImage={formData.hero_image}
          tripSlug={formData.slug}
          onGalleryChange={(gallery) =>
            setFormData((prev) => ({ ...prev, gallery }))
          }
          onHeroChange={(hero_image) =>
            setFormData((prev) => ({ ...prev, hero_image }))
          }
        />
      </div>

      {/* Highlights */}
      <div className="bg-white rounded-xl border border-zinc-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-zinc-900">Highlights</h2>
          <button
            type="button"
            onClick={() => handleArrayAdd("highlights", "")}
            className="text-xs text-zinc-500 hover:text-zinc-700 flex items-center gap-1"
          >
            <Plus className="w-3 h-3" /> Add
          </button>
        </div>
        <div className="space-y-2">
          {formData.highlights.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={item}
                onChange={(e) =>
                  handleArrayChange("highlights", index, e.target.value)
                }
                placeholder="Enter highlight"
                className="flex-1 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none focus:border-zinc-400 focus:bg-white"
              />
              <button
                type="button"
                onClick={() => handleArrayRemove("highlights", index)}
                className="p-2 text-zinc-400 hover:text-red-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          {formData.highlights.length === 0 && (
            <p className="text-sm text-zinc-500 py-2">No highlights added</p>
          )}
        </div>
      </div>

      {/* Itinerary */}
      <div className="bg-white rounded-xl border border-zinc-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-zinc-900">Itinerary</h2>
          <button
            type="button"
            onClick={handleItineraryAdd}
            className="text-xs text-zinc-500 hover:text-zinc-700 flex items-center gap-1"
          >
            <Plus className="w-3 h-3" /> Add Day
          </button>
        </div>
        <div className="space-y-4">
          {formData.itinerary.map((item, index) => (
            <div
              key={index}
              className="p-4 rounded-xl bg-zinc-50 border border-zinc-100"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs font-semibold text-zinc-500">
                  Day {item.day}
                </span>
                <button
                  type="button"
                  onClick={() => handleArrayRemove("itinerary", index)}
                  className="p-1 text-zinc-400 hover:text-red-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3">
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) =>
                    handleItineraryChange(index, "title", e.target.value)
                  }
                  placeholder="Day title"
                  className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400"
                />
                <textarea
                  value={item.description}
                  onChange={(e) =>
                    handleItineraryChange(index, "description", e.target.value)
                  }
                  placeholder="Day description"
                  rows={2}
                  className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400 resize-none"
                />
              </div>
            </div>
          ))}
          {formData.itinerary.length === 0 && (
            <p className="text-sm text-zinc-500 py-2">No itinerary added</p>
          )}
        </div>
      </div>

      {/* Inclusions & Exclusions */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bg-white rounded-xl border border-zinc-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-zinc-900">Inclusions</h2>
            <button
              type="button"
              onClick={() => handleArrayAdd("inclusions", "")}
              className="text-xs text-zinc-500 hover:text-zinc-700 flex items-center gap-1"
            >
              <Plus className="w-3 h-3" /> Add
            </button>
          </div>
          <div className="space-y-2">
            {formData.inclusions.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) =>
                    handleArrayChange("inclusions", index, e.target.value)
                  }
                  placeholder="Enter inclusion"
                  className="flex-1 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none focus:border-zinc-400 focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => handleArrayRemove("inclusions", index)}
                  className="p-2 text-zinc-400 hover:text-red-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            {formData.inclusions.length === 0 && (
              <p className="text-sm text-zinc-500 py-2">No inclusions added</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-zinc-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-zinc-900">Exclusions</h2>
            <button
              type="button"
              onClick={() => handleArrayAdd("exclusions", "")}
              className="text-xs text-zinc-500 hover:text-zinc-700 flex items-center gap-1"
            >
              <Plus className="w-3 h-3" /> Add
            </button>
          </div>
          <div className="space-y-2">
            {formData.exclusions.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) =>
                    handleArrayChange("exclusions", index, e.target.value)
                  }
                  placeholder="Enter exclusion"
                  className="flex-1 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none focus:border-zinc-400 focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => handleArrayRemove("exclusions", index)}
                  className="p-2 text-zinc-400 hover:text-red-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            {formData.exclusions.length === 0 && (
              <p className="text-sm text-zinc-500 py-2">No exclusions added</p>
            )}
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="bg-white rounded-xl border border-zinc-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-zinc-900">Tags</h2>
          <button
            type="button"
            onClick={() => handleArrayAdd("tags", "")}
            className="text-xs text-zinc-500 hover:text-zinc-700 flex items-center gap-1"
          >
            <Plus className="w-3 h-3" /> Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.tags.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-1 bg-zinc-100 rounded-full pl-3 pr-1 py-1"
            >
              <input
                type="text"
                value={item}
                onChange={(e) =>
                  handleArrayChange("tags", index, e.target.value)
                }
                placeholder="Tag"
                className="bg-transparent text-sm outline-none w-24"
              />
              <button
                type="button"
                onClick={() => handleArrayRemove("tags", index)}
                className="p-1 text-zinc-400 hover:text-red-500"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          {formData.tags.length === 0 && (
            <p className="text-sm text-zinc-500 py-2">No tags added</p>
          )}
        </div>
      </div>

      {/* Submit */}
      <div className="flex items-center gap-4">
        <Button
          type="submit"
          disabled={loading}
          className="bg-zinc-900 text-white hover:bg-zinc-800 text-sm font-semibold px-6 py-2.5 rounded-xl"
        >
          {loading ? "Saving..." : isEditing ? "Update Trip" : "Create Trip"}
        </Button>
        <button
          type="button"
          onClick={() => router.back()}
          className="text-sm text-zinc-500 hover:text-zinc-700"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
