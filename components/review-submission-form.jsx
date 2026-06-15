"use client";

import { useMemo, useRef, useState } from "react";
import {
  CheckCircle2,
  ImagePlus,
  Loader2,
  Mail,
  MapPin,
  Send,
  Star,
  User,
  Video,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { showError, showSuccess } from "@/lib/toast";

const initialForm = {
  name: "",
  email: "",
  designation: "",
  trip_id: "",
  trip: "",
  rating: 5,
  quote: "",
};

const initialMedia = {
  file: null,
  preview: "",
  url: "",
  publicId: "",
  resourceType: "",
  uploading: false,
  error: "",
};

export function ReviewSubmissionForm({ trips = [] }) {
  const [formData, setFormData] = useState(initialForm);
  const [media, setMedia] = useState(initialMedia);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const fileInputRef = useRef(null);

  const tripOptions = useMemo(
    () => trips.filter((trip) => trip?.id && trip?.name),
    [trips]
  );

  const updateField = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const handleTripChange = (value) => {
    const selectedTrip = tripOptions.find((trip) => trip.id === value);
    setFormData((current) => ({
      ...current,
      trip_id: value,
      trip: selectedTrip?.name || "",
    }));
  };

  const clearMedia = () => {
    if (media.preview?.startsWith("blob:")) {
      URL.revokeObjectURL(media.preview);
    }
    setMedia(initialMedia);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const uploadMedia = async (file) => {
    const preview = URL.createObjectURL(file);
    setMedia({
      file,
      preview,
      url: "",
      publicId: "",
      resourceType: file.type.startsWith("video/") ? "video" : "image",
      uploading: true,
      error: "",
    });

    try {
      const body = new FormData();
      body.append("file", file);

      const response = await fetch("/api/reviews/upload-media", {
        method: "POST",
        body,
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to upload media.");
      }

      setMedia((current) => ({
        ...current,
        url: data.url,
        publicId: data.publicId,
        resourceType: data.resourceType || data.type || current.resourceType,
        uploading: false,
        error: "",
      }));
    } catch (err) {
      setMedia((current) => ({
        ...current,
        uploading: false,
        error: err.message || "Upload failed. Please try again.",
      }));
      showError(err.message || "Upload failed. Please try again.", "media");
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    uploadMedia(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    if (media.uploading) {
      showError("Please wait for your photo or video to finish uploading.", "media");
      setLoading(false);
      return;
    }

    if (media.file && !media.url) {
      showError("Media upload failed. Remove the file and try again.", "media");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          image_url: media.url || null,
          cloudinary_public_id: media.publicId || null,
          resource_type: media.resourceType || null,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit review.");
      }

      setMessage(data.message || "Review submitted successfully.");
      showSuccess(data.message || "Review submitted successfully.");
      setFormData(initialForm);
      clearMedia();
    } catch (err) {
      showError(err.message || "Failed to submit review. Please try again.", event.currentTarget);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="submit-review"
      className="scroll-mt-24 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-6"
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-start">
        <div className="rounded-2xl bg-zinc-950 p-5 text-white sm:p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-400">
            Share your story
          </p>
          <h2 className="mt-3 text-2xl font-semibold leading-tight">
            Help future travelers choose with confidence.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-300">
            Submitted reviews go to the admin portal first. Once approved, they appear on this page.
            Add a photo or video to feature your moment in the gallery above.
          </p>
          <div className="mt-5 flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-200">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
            Review submitted successfully after form completion
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" data-error-anchor>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-zinc-700">Name *</span>
              <span className="relative block">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  name="name"
                  data-field="name"
                  value={formData.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  maxLength={100}
                  required
                  autoComplete="name"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3 pl-10 pr-4 text-base outline-none transition focus:border-zinc-900 focus:bg-white sm:text-sm"
                />
              </span>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-zinc-700">Email *</span>
              <span className="relative block">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <input
                  type="email"
                  name="email"
                  data-field="email"
                  value={formData.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  maxLength={254}
                  required
                  autoComplete="email"
                  inputMode="email"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3 pl-10 pr-4 text-base outline-none transition focus:border-zinc-900 focus:bg-white sm:text-sm"
                />
              </span>
            </label>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-zinc-700">
                City or role
              </span>
              <span className="relative block">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  value={formData.designation}
                  onChange={(event) => updateField("designation", event.target.value)}
                  maxLength={120}
                  placeholder="Delhi, family traveler"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3 pl-10 pr-4 text-base outline-none transition focus:border-zinc-900 focus:bg-white sm:text-sm"
                />
              </span>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-zinc-700">Trip</span>
              <select
                name="trip_id"
                data-field="trip"
                value={formData.trip_id}
                onChange={(event) => handleTripChange(event.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-base outline-none transition focus:border-zinc-900 focus:bg-white sm:text-sm"
              >
                <option value="">General review</option>
                {tripOptions.map((trip) => (
                  <option key={trip.id} value={trip.id}>
                    {trip.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div>
            <span className="mb-1.5 block text-xs font-medium text-zinc-700">Rating *</span>
            <div className="flex items-center gap-1 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => updateField("rating", value)}
                  className="rounded-lg p-1 transition hover:bg-white"
                  aria-label={`Rate ${value} out of 5`}
                >
                  <Star
                    className={cn(
                      "h-6 w-6 transition",
                      value <= formData.rating
                        ? "fill-amber-400 text-amber-400"
                        : "text-zinc-300"
                    )}
                  />
                </button>
              ))}
              <span className="ml-2 text-xs font-medium text-zinc-500">
                {formData.rating}/5
              </span>
            </div>
          </div>

          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-zinc-700">Review *</span>
            <textarea
              name="quote"
              data-field="message"
              value={formData.quote}
              onChange={(event) => updateField("quote", event.target.value)}
              minLength={20}
              maxLength={2000}
              required
              rows={5}
              placeholder="Tell us what stood out from your trip."
              className="w-full resize-none rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-base outline-none transition focus:border-zinc-900 focus:bg-white sm:text-sm"
            />
          </label>

          <div data-error-anchor="media" data-field="media">
            <span className="mb-1.5 block text-xs font-medium text-zinc-700">
              Photo or video <span className="font-normal text-zinc-400">(optional)</span>
            </span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime"
              onChange={handleFileChange}
              className="sr-only"
              id="review-media-upload"
            />

            {!media.file ? (
              <label
                htmlFor="review-media-upload"
                className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-zinc-50 px-4 py-8 text-center transition hover:border-zinc-400 hover:bg-white"
              >
                <div className="flex items-center gap-2 text-zinc-500">
                  <ImagePlus className="h-5 w-5" />
                  <Video className="h-5 w-5" />
                </div>
                <p className="mt-2 text-sm font-medium text-zinc-700">
                  Upload a trip photo or video
                </p>
                <p className="mt-1 text-xs text-zinc-500">
                  JPG, PNG, WebP up to 8 MB · MP4, WebM, MOV up to 30 MB
                </p>
              </label>
            ) : (
              <div className="relative overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50">
                {media.resourceType === "video" ? (
                  <video
                    src={media.preview}
                    className="h-48 w-full object-cover"
                    muted
                    playsInline
                  />
                ) : (
                  <img
                    src={media.preview}
                    alt="Review upload preview"
                    className="h-48 w-full object-cover"
                  />
                )}

                {media.uploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <div className="flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-zinc-900">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Uploading to Cloudinary…
                    </div>
                  </div>
                )}

                {!media.uploading && media.url && (
                  <div className="absolute left-3 top-3 rounded-full bg-emerald-500/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
                    Ready
                  </div>
                )}

                <button
                  type="button"
                  onClick={clearMedia}
                  disabled={media.uploading}
                  className="absolute right-3 top-3 rounded-full bg-white/90 p-1.5 text-zinc-700 shadow-sm transition hover:bg-white disabled:opacity-50"
                  aria-label="Remove uploaded media"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

          </div>

          {message && (
            <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              {message}
            </p>
          )}

          <Button
            type="submit"
            disabled={loading || media.uploading}
            className="w-full rounded-xl bg-zinc-900 py-5 text-sm font-semibold text-white hover:bg-zinc-800 sm:w-auto sm:px-6"
          >
            <Send className="mr-2 h-4 w-4 text-amber-300" />
            {loading ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      </div>
    </section>
  );
}
