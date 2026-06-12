"use client";

import { useEffect, useState } from "react";
import { Calendar, CreditCard, Minus, Plus, User, Mail, Phone, X, Info, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  computeTotalWithGst,
  formatFullDate,
  formatINR,
  getTripEndDate,
  parsePriceToRupees,
} from "@/lib/trip-booking";
import { contactDetails } from "@/lib/site-data";

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function TripBookingModal({ trip, departureDate, open, onClose, razorpayEnabled = false }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pax, setPax] = useState(1);
  const [step, setStep] = useState("details");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const perPerson = parsePriceToRupees(trip.price);
  const { subtotal, gst, total } = computeTotalWithGst(perPerson, pax);
  const endDate = departureDate ? getTripEndDate(departureDate, trip.itinerary?.length || 1) : null;

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      setStep("details");
      setError("");
      setSuccessMessage("");
      setLoading(false);
    }
  }, [open]);

  if (!open) return null;

  const validateDetails = () => {
    if (!name.trim() || !email.trim() || !phone.trim()) {
      setError("Please fill in your name, email, and phone number.");
      return false;
    }
    setError("");
    return true;
  };

  const handleBookNow = () => {
    if (validateDetails()) {
      setStep("actions");
    }
  };

  const buildBookingNotes = () => {
    const lines = [
      `Trip: ${trip.name}`,
      `Duration: ${trip.duration || "N/A"}`,
      `Travelers: ${pax}`,
      `Estimated total: ${formatINR(total)} (incl. 5% GST)`,
    ];
    if (departureDate) {
      lines.push(`Departure: ${formatFullDate(departureDate)}`);
      if (endDate) lines.push(`Return: ${formatFullDate(endDate)}`);
    }
    lines.push(`Phone: ${phone.trim()}`);
    return lines.join("\n");
  };

  const handleSendEnquiry = async () => {
    if (!validateDetails()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          place: trip.name,
          passengers: String(pax),
          duration: departureDate ? formatFullDate(departureDate) : trip.duration,
          budget: `${formatINR(total)} (${pax} pax, incl. GST)`,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to send enquiry.");
      }

      setSuccessMessage(
        "Your enquiry has been sent! Our travel experts will reach out to you within 24 hours."
      );
      setStep("success");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBookMeeting = () => {
    if (!validateDetails()) return;

    const notes = buildBookingNotes();
    const meetingURL = `${contactDetails.calLink}?name=${encodeURIComponent(name.trim())}&email=${encodeURIComponent(email.trim())}&notes=${encodeURIComponent(notes)}`;
    window.open(meetingURL, "_blank", "noopener,noreferrer");

    setSuccessMessage(
      "Your meeting scheduler has opened in a new tab. Pick a time that works for you."
    );
    setStep("success");
  };

  const handlePayNow = async () => {
    if (!validateDetails()) return;

    setLoading(true);
    setError("");

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error("Failed to load payment gateway. Please try again.");
      }

      const orderRes = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tripSlug: trip.slug,
          tripName: trip.name,
          amount: total,
          pax,
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          departureDate: departureDate?.toISOString(),
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) {
        throw new Error(orderData.message || "Could not create payment order.");
      }

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Anjali World Tourism",
        description: `${trip.name} — ${pax} traveler${pax > 1 ? "s" : ""}`,
        order_id: orderData.orderId,
        prefill: { name, email, contact: phone },
        theme: { color: "#18181b" },
        handler: async (response) => {
          const verifyRes = await fetch("/api/payments/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...response,
              tripSlug: trip.slug,
              tripName: trip.name,
              pax,
              name: name.trim(),
              email: email.trim(),
              phone: phone.trim(),
              departureDate: departureDate?.toISOString(),
              amount: total,
            }),
          });

          const verifyData = await verifyRes.json();
          if (!verifyRes.ok) {
            setError(verifyData.message || "Payment verification failed.");
            setLoading(false);
            return;
          }

          setSuccessMessage(
            `Payment received for ${trip.name}. Our team will contact you shortly with trip details.`
          );
          setStep("success");
          setLoading(false);
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (resp) => {
        setError(resp.error?.description || "Payment failed. Please try again.");
        setLoading(false);
      });
      rzp.open();
    } catch (err) {
      setError(err.message || "Something went wrong.");
      setLoading(false);
    }
  };

  const actionSubtitle = razorpayEnabled
    ? "Pay online now, send an enquiry, or book a call with our team."
    : "Online payments are coming soon. For now, send an enquiry or book a call with our team.";

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 sm:items-center">
      <div
        className="relative w-full max-w-4xl rounded-2xl border border-zinc-200 bg-white shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-title"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {step === "success" ? (
          <div className="p-10 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
              <span className="text-2xl">✓</span>
            </div>
            <h2 className="text-xl font-semibold text-zinc-900">All set!</h2>
            <p className="mt-2 text-sm text-zinc-600">{successMessage}</p>
            <Button onClick={onClose} className="mt-6 rounded-xl bg-zinc-900 hover:bg-zinc-800">
              Close
            </Button>
          </div>
        ) : step === "actions" ? (
          <div className="p-6 md:p-10">
            <button
              type="button"
              onClick={() => setStep("details")}
              className="mb-4 text-sm text-zinc-500 transition-colors hover:text-zinc-900"
            >
              ← Back to details
            </button>
            <h2 id="booking-title" className="text-xl font-semibold text-zinc-900">
              How would you like to proceed?
            </h2>
            <p className="mt-2 text-sm text-zinc-600">{actionSubtitle}</p>

            <div className="mt-6 rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-600">
              <p className="font-semibold text-zinc-900">{trip.name}</p>
              <p className="mt-1">
                {pax} traveler{pax > 1 ? "s" : ""} · {formatINR(total)} total
              </p>
              {departureDate && (
                <p className="mt-1">Departure: {formatFullDate(departureDate)}</p>
              )}
            </div>

            <div
              className={`mt-6 grid gap-3 ${
                razorpayEnabled ? "sm:grid-cols-3" : "sm:grid-cols-2"
              }`}
            >
              {razorpayEnabled && (
                <button
                  type="button"
                  onClick={handlePayNow}
                  disabled={loading}
                  className="flex flex-col items-start rounded-2xl border border-zinc-900 bg-zinc-900 p-5 text-left text-white transition-colors hover:bg-zinc-800 disabled:opacity-60"
                >
                  <CreditCard className="h-5 w-5 text-amber-400" />
                  <span className="mt-3 text-base font-semibold">Pay Now</span>
                  <span className="mt-1 text-xs text-zinc-300">
                    Secure checkout via Razorpay · {formatINR(total)}
                  </span>
                </button>
              )}

              <button
                type="button"
                onClick={handleSendEnquiry}
                disabled={loading}
                className="flex flex-col items-start rounded-2xl border border-zinc-200 bg-white p-5 text-left transition-colors hover:border-amber-300 hover:bg-amber-50/50 disabled:opacity-60"
              >
                <Send className="h-5 w-5 text-amber-600" />
                <span className="mt-3 text-base font-semibold text-zinc-900">Send Enquiry</span>
                <span className="mt-1 text-xs text-zinc-500">
                  We&apos;ll email you back with availability and next steps.
                </span>
              </button>

              <button
                type="button"
                onClick={handleBookMeeting}
                disabled={loading}
                className="flex flex-col items-start rounded-2xl border border-zinc-200 bg-white p-5 text-left transition-colors hover:border-zinc-900 hover:bg-zinc-50 disabled:opacity-60"
              >
                <Calendar className="h-5 w-5 text-zinc-900" />
                <span className="mt-3 text-base font-semibold text-zinc-900">Book Meeting</span>
                <span className="mt-1 text-xs text-zinc-500">
                  Schedule a 15-min call with our travel expert.
                </span>
              </button>
            </div>

            {error && (
              <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
            )}
          </div>
        ) : (
          <div className="grid gap-0 md:grid-cols-[1fr_320px]">
            <div className="space-y-5 p-6 md:p-8">
              <h2 id="booking-title" className="text-xl font-semibold text-zinc-900">
                Complete Your Booking
              </h2>

              <div className="rounded-xl border border-zinc-200 p-4">
                <h3 className="mb-4 text-sm font-semibold text-zinc-900">Traveler Details</h3>
                <div className="space-y-3">
                  <label className="block">
                    <span className="sr-only">Full Name</span>
                    <span className="relative block">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full rounded-xl border border-zinc-200 py-3 pl-10 pr-4 text-sm outline-none transition-colors focus:border-zinc-900"
                      />
                    </span>
                  </label>
                  <label className="block">
                    <span className="sr-only">Email</span>
                    <span className="relative block">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                      <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-xl border border-zinc-200 py-3 pl-10 pr-4 text-sm outline-none transition-colors focus:border-zinc-900"
                      />
                    </span>
                  </label>
                  <label className="block">
                    <span className="sr-only">Phone Number</span>
                    <span className="relative block">
                      <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full rounded-xl border border-zinc-200 py-3 pl-10 pr-4 text-sm outline-none transition-colors focus:border-zinc-900"
                      />
                    </span>
                  </label>
                </div>
                <p className="mt-3 flex items-center gap-1.5 text-[11px] text-zinc-500">
                  <Info className="h-3.5 w-3.5 shrink-0" />
                  You can fill other passenger details later
                </p>
              </div>

              <div className="rounded-xl border border-zinc-200 p-4">
                <h3 className="mb-3 text-sm font-semibold text-zinc-900">Package Options</h3>
                <div className="relative rounded-xl bg-zinc-900 px-4 py-3 text-white">
                  <span className="absolute -top-2.5 left-3 rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-bold text-zinc-900">
                    {trip.price}
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">Standard</span>
                    <span className="text-amber-400">✓</span>
                  </div>
                </div>
              </div>

              {error && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
              )}
            </div>

            <div className="border-t border-zinc-200 bg-zinc-50 p-6 md:border-l md:border-t-0 md:rounded-r-2xl">
              <h3 className="text-base font-semibold text-zinc-900">{trip.name}</h3>

              {departureDate && endDate && (
                <div className="mt-4 space-y-2 text-xs text-zinc-600">
                  <p>{formatFullDate(departureDate)}</p>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-bold text-zinc-900">
                      {trip.duration}
                    </span>
                  </div>
                  <p>{formatFullDate(endDate)}</p>
                </div>
              )}

              <div className="mt-5 flex items-center justify-between text-sm">
                <span className="text-zinc-600">No. of Pax :</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setPax((n) => Math.max(1, n - 1))}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-900 text-white transition-colors hover:bg-zinc-700"
                    aria-label="Decrease travelers"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-6 text-center font-semibold tabular-nums">{pax}</span>
                  <button
                    type="button"
                    onClick={() => setPax((n) => Math.min(20, n + 1))}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-900 text-white transition-colors hover:bg-zinc-700"
                    aria-label="Increase travelers"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div className="mt-6 border-t border-zinc-200 pt-4">
                <p className="text-2xl font-bold tabular-nums text-zinc-900">
                  {formatINR(perPerson)}
                  <span className="text-sm font-medium text-zinc-500">/ person</span>
                </p>
                <p className="mt-1 text-xs text-zinc-500">+5% GST</p>
                <div className="mt-3 space-y-1 text-xs text-zinc-600">
                  <div className="flex justify-between">
                    <span>Subtotal ({pax} pax)</span>
                    <span>{formatINR(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (5%)</span>
                    <span>{formatINR(gst)}</span>
                  </div>
                  <div className="flex justify-between border-t border-zinc-200 pt-2 font-semibold text-zinc-900">
                    <span>Total</span>
                    <span>{formatINR(total)}</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleBookNow}
                className="mt-6 w-full rounded-full bg-zinc-900 py-4 text-sm font-semibold text-white hover:bg-zinc-800"
              >
                Book Now
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
