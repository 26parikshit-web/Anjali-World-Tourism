"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Mail, MapPin, Send, Star, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const initialForm = {
  name: "",
  email: "",
  designation: "",
  trip_id: "",
  trip: "",
  rating: 5,
  quote: "",
};

export function ReviewSubmissionForm({ trips = [] }) {
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit review.");
      }

      setMessage(data.message || "Review submitted successfully.");
      setFormData(initialForm);
    } catch (err) {
      setError(err.message || "Failed to submit review. Please try again.");
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
          </p>
          <div className="mt-5 flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-200">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
            Review submitted successfully after form completion
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-zinc-700">Name *</span>
              <span className="relative block">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
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

          {message && (
            <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              {message}
            </p>
          )}
          {error && (
            <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={loading}
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
