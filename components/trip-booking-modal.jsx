"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { showError } from "@/lib/toast";
import { Calendar, CreditCard, Minus, Plus, User, Mail, Phone, X, Info, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DiscountCountdown } from "@/components/discount-countdown";
import { formatFullDate, formatINR, getTripEndDate } from "@/lib/trip-booking";
import { contactDetails } from "@/lib/site-data";
import {
  sanitizeBookingContact,
  validateBookingDetails,
} from "@/lib/form-validation";
import { TripDatePicker } from "@/components/trip-date-picker";
import { ModalPortal, MODAL_LAYER_CLASS } from "@/components/modal-portal";
import { cn } from "@/lib/utils";

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

export function TripBookingModal({
  trip,
  departureDate,
  onDepartureChange,
  open,
  onClose,
  razorpayEnabled = false,
  bookingKind = "trip",
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pax, setPax] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState("standard");
  const [quote, setQuote] = useState(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [step, setStep] = useState("details");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const contentRef = useRef(null);
  const isGroup = bookingKind === "group";
  const fixedDeparture = isGroup && trip.departure_date ? new Date(trip.departure_date) : null;
  const endDate = (fixedDeparture || departureDate)
    ? getTripEndDate(fixedDeparture || departureDate, trip.itinerary?.length || 1)
    : null;

  const fetchQuote = useCallback(async () => {
    if (!trip?.slug) return;
    setQuoteLoading(true);
    try {
      const params = new URLSearchParams({
        pax: String(pax),
        package: selectedPackage,
      });
      const quotePath = isGroup
        ? `/api/group-trips/${trip.slug}/quote`
        : `/api/trips/${trip.slug}/quote`;
      const res = await fetch(`${quotePath}?${params}`);
      const data = await res.json();
      if (!res.ok || !data.valid) {
        throw new Error(data.message || "Could not load pricing.");
      }
      setQuote(data);
    } catch (err) {
      setQuote(null);
      showError(err.message || "Could not load pricing.", "pricing");
    } finally {
      setQuoteLoading(false);
    }
  }, [trip?.slug, pax, selectedPackage, isGroup]);

  useEffect(() => {
    if (!open) return;
    fetchQuote();
  }, [open, fetchQuote]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      setStep("details");
      setSuccessMessage("");
      setLoading(false);
      setSelectedPackage("standard");
    }
  }, [open]);

  if (!open) return null;

  const validateDetails = () => {
    const result = validateBookingDetails({ name, email, phone });
    if (!result.valid) {
      showError(result.message, contentRef);
      return false;
    }
    if (!quote?.valid) {
      showError("Pricing is not available. Please try again.", "pricing");
      return false;
    }
    return true;
  };

  const getSanitizedContact = () => sanitizeBookingContact({ name, email, phone });

  const handleBookNow = () => {
    if (validateDetails()) {
      setStep("actions");
    }
  };

  const buildBookingNotes = (phoneNumber = phone) => {
    const lines = [
      `Trip: ${trip.name}`,
      `Package: ${quote?.packageLabel || "Standard"}`,
      `Duration: ${trip.duration || "N/A"}`,
      `Travelers: ${pax}`,
      `Estimated total: ${quote?.totalLabel || "N/A"} (incl. ${quote?.gstPercent || 5}% GST)`,
    ];
    if (departureDate) {
      lines.push(`Departure: ${formatFullDate(departureDate)}`);
      if (endDate) lines.push(`Return: ${formatFullDate(endDate)}`);
    }
    lines.push(`Phone: ${phoneNumber}`);
    return lines.join("\n");
  };

  const handleSendEnquiry = async () => {
    if (!validateDetails()) return;

    const contact = getSanitizedContact();
    setLoading(true);

    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: contact.name,
          email: contact.email,
          phone: contact.phone,
          place: trip.name,
          passengers: String(pax),
          duration: departureDate ? formatFullDate(departureDate) : trip.duration,
          budget: `${quote.totalLabel} (${quote.packageLabel}, ${pax} pax, incl. GST)`,
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
      showError(err.message || "Something went wrong. Please try again.", contentRef);
    } finally {
      setLoading(false);
    }
  };

  const handleBookMeeting = () => {
    if (!validateDetails()) return;

    const contact = getSanitizedContact();
    const notes = buildBookingNotes(contact.phone);
    const meetingURL = `${contactDetails.calLink}?name=${encodeURIComponent(contact.name)}&email=${encodeURIComponent(contact.email)}&notes=${encodeURIComponent(notes)}`;
    window.open(meetingURL, "_blank", "noopener,noreferrer");

    setSuccessMessage(
      "Your meeting scheduler has opened in a new tab. Pick a time that works for you."
    );
    setStep("success");
  };

  const handlePayNow = async () => {
    if (!validateDetails()) return;

    const contact = getSanitizedContact();
    setLoading(true);

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
          bookingKind,
          packageKey: selectedPackage,
          pax,
          name: contact.name,
          email: contact.email,
          phone: contact.phone,
          departureDate: (fixedDeparture || departureDate)?.toISOString(),
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
        description: `${trip.name} — ${quote.packageLabel} — ${pax} traveler${pax > 1 ? "s" : ""}`,
        order_id: orderData.orderId,
        prefill: { name: contact.name, email: contact.email, contact: contact.phone },
        theme: { color: "#18181b" },
        handler: async (response) => {
          const verifyRes = await fetch("/api/payments/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...response,
              tripSlug: trip.slug,
              tripName: trip.name,
              bookingKind,
              packageKey: selectedPackage,
              pax,
              name: contact.name,
              email: contact.email,
              phone: contact.phone,
              departureDate: (fixedDeparture || departureDate)?.toISOString(),
            }),
          });

          const verifyData = await verifyRes.json();
          if (!verifyRes.ok) {
            showError(verifyData.message || "Payment verification failed.", contentRef);
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
        showError(resp.error?.description || "Payment failed. Please try again.", contentRef);
        setLoading(false);
      });
      rzp.open();
    } catch (err) {
      showError(err.message || "Something went wrong.", contentRef);
      setLoading(false);
    }
  };

  const actionSubtitle = razorpayEnabled
    ? "Pay online now, send an enquiry, or book a call with our team."
    : "Online payments are coming soon. For now, send an enquiry or book a call with our team.";

  const packages = quote?.packages?.length
    ? quote.packages
    : [{ key: "standard", label: "Standard", priceLabel: trip.price }];

  return (
    <ModalPortal>
      <div
        className={cn(
          "fixed inset-0 flex items-end justify-center overflow-x-hidden bg-black/50 sm:items-start sm:overflow-y-auto sm:p-4 sm:pt-[max(1rem,env(safe-area-inset-top))] sm:pb-[max(1rem,env(safe-area-inset-bottom))]",
          MODAL_LAYER_CLASS
        )}
        onClick={onClose}
      >
      <div
        ref={contentRef}
        data-error-anchor="booking"
        className="relative flex max-h-[92dvh] w-full min-w-0 max-w-full flex-col overflow-hidden rounded-t-2xl border border-zinc-200 bg-white shadow-2xl sm:my-auto sm:max-h-[calc(100dvh-2rem)] sm:max-w-4xl sm:rounded-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 rounded-full p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-900 sm:right-4 sm:top-4"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {step === "success" ? (
          <div className="min-h-0 flex-1 overflow-y-auto p-6 text-center sm:p-10">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
              <span className="text-2xl">✓</span>
            </div>
            <h2 className="text-xl font-semibold text-zinc-900">All set!</h2>
            <p className="mt-2 text-sm text-zinc-600">{successMessage}</p>
            <Button onClick={onClose} className="mt-6 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white">
              Close
            </Button>
          </div>
        ) : step === "actions" ? (
          <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-6 md:p-10">
            <button
              type="button"
              onClick={() => setStep("details")}
              className="mb-4 text-sm text-zinc-500 transition-colors hover:text-zinc-900"
            >
              ← Back to details
            </button>
            <h2 id="booking-title" className="pr-10 text-lg font-semibold text-zinc-900 sm:text-xl">
              How would you like to proceed?
            </h2>
            <p className="mt-2 text-sm text-zinc-600">{actionSubtitle}</p>

            <div className="mt-5 rounded-xl border border-zinc-200 bg-zinc-50 p-3.5 text-sm text-zinc-600 sm:mt-6 sm:p-4">
              <p className="font-semibold text-zinc-900">{trip.name}</p>
              <p className="mt-1">
                {quote?.packageLabel} · {pax} traveler{pax > 1 ? "s" : ""} · {quote?.totalLabel} total
              </p>
              {departureDate && (
                <p className="mt-1">Departure: {formatFullDate(departureDate)}</p>
              )}
            </div>

            <div
              className={`mt-5 grid gap-2.5 sm:mt-6 sm:gap-3 ${
                razorpayEnabled ? "sm:grid-cols-3" : "sm:grid-cols-2"
              }`}
            >
              {razorpayEnabled && (
                <button
                  type="button"
                  onClick={handlePayNow}
                  disabled={loading}
                  className="flex items-center gap-3 rounded-2xl border border-zinc-900 bg-zinc-900 p-4 text-left text-white transition-colors hover:bg-zinc-800 disabled:opacity-60 sm:flex-col sm:items-start sm:gap-0 sm:p-5"
                >
                  <CreditCard className="h-5 w-5 shrink-0 text-amber-400" />
                  <div className="min-w-0 flex-1 sm:mt-3">
                    <span className="block text-base font-semibold">Pay Now</span>
                    <span className="mt-0.5 block text-xs text-zinc-300 sm:mt-1">
                      Secure checkout via Razorpay · {quote?.totalLabel}
                    </span>
                  </div>
                </button>
              )}

              <button
                type="button"
                onClick={handleSendEnquiry}
                disabled={loading}
                className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white p-4 text-left transition-colors hover:border-amber-300 hover:bg-amber-50/50 disabled:opacity-60 sm:flex-col sm:items-start sm:gap-0 sm:p-5"
              >
                <Send className="h-5 w-5 shrink-0 text-amber-600" />
                <div className="min-w-0 flex-1 sm:mt-3">
                  <span className="block text-base font-semibold text-zinc-900">Send Enquiry</span>
                  <span className="mt-0.5 block text-xs text-zinc-500 sm:mt-1">
                    We&apos;ll email you back with availability and next steps.
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={handleBookMeeting}
                disabled={loading}
                className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white p-4 text-left transition-colors hover:border-zinc-900 hover:bg-zinc-50 disabled:opacity-60 sm:flex-col sm:items-start sm:gap-0 sm:p-5"
              >
                <Calendar className="h-5 w-5 shrink-0 text-zinc-900" />
                <div className="min-w-0 flex-1 sm:mt-3">
                  <span className="block text-base font-semibold text-zinc-900">Book Meeting</span>
                  <span className="mt-0.5 block text-xs text-zinc-500 sm:mt-1">
                    Schedule a 15-min call with our travel expert.
                  </span>
                </div>
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto">
              <div className="grid w-full min-w-0 gap-0 md:grid-cols-[minmax(0,1fr)_minmax(0,320px)]">
                <div className="order-2 min-w-0 space-y-4 p-4 sm:space-y-5 sm:p-6 md:order-1 md:p-8">
                  <h2 id="booking-title" className="pr-10 text-lg font-semibold text-zinc-900 sm:text-xl">
                    Complete Your Booking
                  </h2>

                  <TripDatePicker
                    selectedDate={fixedDeparture || departureDate}
                    onSelect={isGroup ? undefined : onDepartureChange}
                  />
                  {isGroup && fixedDeparture && (
                    <p className="text-xs text-zinc-500">
                      Fixed group departure — {formatFullDate(fixedDeparture)}
                    </p>
                  )}
                  {quote?.capacity && (
                    <p
                      className={`text-xs font-medium ${
                        quote.capacity.isFull ? "text-red-600" : "text-emerald-700"
                      }`}
                    >
                      {quote.capacity.label}
                    </p>
                  )}

                  <div className="rounded-xl border border-zinc-200 p-3.5 sm:p-4">
                    <h3 className="mb-4 text-sm font-semibold text-zinc-900">Traveler Details</h3>
                    <div className="space-y-3">
                      <label className="block">
                        <span className="sr-only">Full Name</span>
                        <span className="relative block">
                          <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                          <input
                            type="text"
                            name="name"
                            data-field="name"
                            placeholder="Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            maxLength={100}
                            autoComplete="name"
                            className="w-full rounded-xl border border-zinc-200 py-2.5 pl-10 pr-4 text-base outline-none transition-colors focus:border-zinc-900 sm:py-3 sm:text-sm"
                          />
                        </span>
                      </label>
                      <label className="block">
                        <span className="sr-only">Email</span>
                        <span className="relative block">
                          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                          <input
                            type="email"
                            name="email"
                            data-field="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            maxLength={254}
                            autoComplete="email"
                            inputMode="email"
                            className="w-full rounded-xl border border-zinc-200 py-2.5 pl-10 pr-4 text-base outline-none transition-colors focus:border-zinc-900 sm:py-3 sm:text-sm"
                          />
                        </span>
                      </label>
                      <label className="block">
                        <span className="sr-only">Phone Number</span>
                        <span className="relative block">
                          <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                          <input
                            type="tel"
                            name="phone"
                            data-field="phone"
                            placeholder="Phone Number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            maxLength={15}
                            autoComplete="tel"
                            inputMode="tel"
                            className="w-full rounded-xl border border-zinc-200 py-2.5 pl-10 pr-4 text-base outline-none transition-colors focus:border-zinc-900 sm:py-3 sm:text-sm"
                          />
                        </span>
                      </label>
                    </div>
                    <p className="mt-3 flex items-center gap-1.5 text-[11px] text-zinc-500">
                      <Info className="h-3.5 w-3.5 shrink-0" />
                      You can fill other passenger details later
                    </p>
                  </div>

                  <div
                    className="rounded-xl border border-zinc-200 p-3.5 sm:p-4"
                    data-error-anchor="pricing"
                    data-field="pricing"
                  >
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-semibold text-zinc-900">Package Options</h3>
                        {quote?.discount?.active && (
                          <p className="mt-0.5 text-[11px] font-medium text-emerald-600">
                            {quote.discount.percent}% off this trip&apos;s packages
                          </p>
                        )}
                      </div>
                      {quote?.discount?.active && (
                        <DiscountCountdown
                          endsAt={quote.discount.endsAt}
                          onExpire={fetchQuote}
                        />
                      )}
                    </div>
                    <div className="space-y-2">
                      {packages.map((pkg) => {
                        const isSelected = selectedPackage === pkg.key;
                        return (
                          <button
                            key={pkg.key}
                            type="button"
                            onClick={() => setSelectedPackage(pkg.key)}
                            className={cn(
                              "relative w-full rounded-xl px-4 py-3 text-left transition",
                              isSelected
                                ? "bg-zinc-900 text-white"
                                : "border border-zinc-200 bg-white text-zinc-900 hover:border-zinc-300"
                            )}
                          >
                            <span
                              className={cn(
                                "absolute -top-2.5 left-3 max-w-[calc(100%-1.5rem)] truncate rounded-full px-2 py-0.5 text-[10px] font-bold",
                                isSelected
                                  ? "bg-amber-400 text-zinc-900"
                                  : "bg-zinc-100 text-zinc-700"
                              )}
                            >
                              {pkg.priceLabelBase ? (
                                <>
                                  <span className="line-through opacity-70">{pkg.priceLabelBase}</span>{" "}
                                  {pkg.priceLabel}
                                </>
                              ) : (
                                pkg.priceLabel
                              )}
                            </span>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-semibold">{pkg.label}</span>
                              {isSelected && <span className="text-amber-400">✓</span>}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="order-1 min-w-0 border-b border-zinc-200 bg-zinc-50 p-4 sm:p-6 md:order-2 md:border-b-0 md:border-l md:rounded-r-2xl">
                  <h3 className="line-clamp-2 break-words text-base font-semibold text-zinc-900">{trip.name}</h3>

                  {departureDate && endDate && (
                    <div className="mt-3 space-y-2 text-xs text-zinc-600 sm:mt-4">
                      <p>{formatFullDate(departureDate)}</p>
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-bold text-zinc-900">
                          {trip.duration}
                        </span>
                      </div>
                      <p>{formatFullDate(endDate)}</p>
                    </div>
                  )}

                  <div className="mt-4 flex items-center justify-between text-sm sm:mt-5">
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
                        onClick={() =>
                          setPax((n) => {
                            const maxPax = quote?.capacity?.remaining
                              ? Math.min(20, quote.capacity.remaining)
                              : 20;
                            return Math.min(maxPax, n + 1);
                          })
                        }
                        disabled={quote?.capacity?.isFull}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-900 text-white transition-colors hover:bg-zinc-700 disabled:opacity-40"
                        aria-label="Increase travelers"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 border-t border-zinc-200 pt-4 sm:mt-6">
                    {quoteLoading ? (
                      <p className="text-sm text-zinc-500">Updating price…</p>
                    ) : quote ? (
                      <>
                        <div className="flex flex-wrap items-end gap-2">
                          {quote.discount?.active && (
                            <p className="text-sm text-zinc-400 line-through tabular-nums">
                              {quote.perPersonBaseLabel}
                            </p>
                          )}
                          <p className="text-xl font-bold tabular-nums text-zinc-900 sm:text-2xl">
                            {quote.perPersonLabel}
                            <span className="text-sm font-medium text-zinc-500">/ person</span>
                          </p>
                        </div>
                        {quote.discount?.active && (
                          <p className="mt-1 text-xs font-medium text-emerald-600">
                            {quote.discount.percent}% off this trip (per person, before GST)
                          </p>
                        )}
                        <p className="mt-1 text-xs text-zinc-500">+{quote.gstPercent}% GST</p>
                        <div className="mt-3 space-y-1 text-xs text-zinc-600">
                          <div className="flex min-w-0 justify-between gap-2">
                            <span className="min-w-0 shrink">Subtotal ({pax} pax)</span>
                            <span className="shrink-0 tabular-nums">{quote.subtotalLabel}</span>
                          </div>
                          <div className="flex min-w-0 justify-between gap-2">
                            <span className="min-w-0 shrink">GST ({quote.gstPercent}%)</span>
                            <span className="shrink-0 tabular-nums">{quote.gstLabel}</span>
                          </div>
                          <div className="flex min-w-0 justify-between gap-2 border-t border-zinc-200 pt-2 font-semibold text-zinc-900">
                            <span className="min-w-0 shrink">Total</span>
                            <span className="shrink-0 tabular-nums">{quote.totalLabel}</span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <p className="text-sm text-zinc-500">Price unavailable</p>
                    )}
                  </div>

                  <Button
                    onClick={handleBookNow}
                    disabled={quoteLoading || !quote || quote?.capacity?.isFull}
                    className="mt-5 hidden w-full rounded-full bg-zinc-900 py-4 text-sm font-semibold text-white hover:bg-zinc-800 sm:mt-6 md:inline-flex"
                  >
                    {quote?.capacity?.isFull ? "Fully Booked" : "Book Now"}
                  </Button>
                </div>
              </div>
            </div>

            <div className="shrink-0 border-t border-zinc-200 bg-amber-50/80 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] md:hidden">
              <div className="mx-auto flex w-full max-w-full items-center gap-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-base font-bold tabular-nums text-zinc-900 sm:text-lg">
                    {quote?.totalLabel || "—"}
                  </p>
                  <p className="truncate text-xs text-zinc-500">
                    {pax} traveler{pax > 1 ? "s" : ""} · incl. GST
                  </p>
                </div>
                <Button
                  onClick={handleBookNow}
                  disabled={quoteLoading || !quote || quote?.capacity?.isFull}
                  className="shrink-0 rounded-full bg-zinc-900 px-5 py-3 text-sm font-semibold text-white hover:bg-zinc-800"
                >
                  {quote?.capacity?.isFull ? "Full" : "Book Now"}
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
    </ModalPortal>
  );
}
