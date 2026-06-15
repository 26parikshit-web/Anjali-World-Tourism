"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { validateContactForm } from "@/lib/form-validation";
import { contactDetails } from "@/lib/site-data";

const isSupabaseConfigured = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  return (
    url &&
    key &&
    url.startsWith('http') &&
    !url.includes('your_supabase') &&
    !key.includes('your_supabase')
  );
};

export function ContactForm({ tripInterest }) {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.target);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      message: formData.get("message"),
      trip_interest: tripInterest || null,
      status: "new",
    };

    const validation = validateContactForm(data);
    if (!validation.valid) {
      setError(validation.message);
      setLoading(false);
      return;
    }

    // If Supabase isn't configured, just show success (demo mode)
    if (!isSupabaseConfigured()) {
      console.log("Contact form submission (demo mode):", data);
      setSent(true);
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      const { error: submitError } = await supabase
        .from("contact_submissions")
        .insert([{
          ...data,
          name: String(data.name).trim(),
          email: String(data.email).trim().toLowerCase(),
          phone: String(data.phone).trim(),
          message: data.message ? String(data.message).trim() : null,
        }]);

      if (submitError) throw submitError;
      setSent(true);
    } catch (err) {
      setError(`Failed to submit. Please try again or call us at ${contactDetails.phone}.`);
      console.error("Contact form error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
        Get in Touch
      </p>
      <h2 className="mt-2 text-2xl font-semibold leading-tight text-zinc-900 sm:text-3xl">
        Tell us about your trip.
      </h2>
      <p className="mt-2 max-w-lg text-sm leading-relaxed text-zinc-600">
        Use this form for enquiries, itinerary help, or callback requests.
      </p>

      {sent ? (
        <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-emerald-700">
            Request received
          </p>
          <p className="mt-2 text-sm leading-relaxed text-emerald-600">
            We'll get back to you shortly via your preferred contact method.
          </p>
        </div>
      ) : (
        <>
          {error && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form className="mt-6 grid gap-3" onSubmit={handleSubmit}>
            <label className="grid gap-1.5">
              <span className="text-xs font-medium text-zinc-700">Name</span>
              <input
                type="text"
                name="name"
                required
                maxLength={100}
                autoComplete="name"
                placeholder="Your full name"
                className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-zinc-400 focus:bg-white"
              />
            </label>

            <label className="grid gap-1.5">
              <span className="text-xs font-medium text-zinc-700">Email</span>
              <input
                type="email"
                name="email"
                required
                maxLength={254}
                autoComplete="email"
                inputMode="email"
                placeholder="you@example.com"
                className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-zinc-400 focus:bg-white"
              />
            </label>

            <label className="grid gap-1.5">
              <span className="text-xs font-medium text-zinc-700">Phone</span>
              <input
                type="tel"
                name="phone"
                required
                maxLength={15}
                autoComplete="tel"
                inputMode="tel"
                placeholder="+91 98XXX XXXXX"
                className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-zinc-400 focus:bg-white"
              />
            </label>

            <label className="grid gap-1.5">
              <span className="text-xs font-medium text-zinc-700">Message</span>
              <textarea
                name="message"
                rows="4"
                maxLength={2000}
                placeholder="Tell us about destination, dates, group size..."
                className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-zinc-400 focus:bg-white resize-none"
              />
            </label>

            <Button
              type="submit"
              disabled={loading}
              className="mt-2 bg-zinc-900 text-white hover:bg-zinc-800 text-xs font-semibold px-4 py-3 rounded-xl disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Enquiry"}
            </Button>
          </form>
        </>
      )}
    </div>
  );
}
