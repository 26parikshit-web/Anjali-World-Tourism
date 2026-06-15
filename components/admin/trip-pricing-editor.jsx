"use client";

import { PACKAGE_TIERS } from "@/lib/trip-pricing";

export function TripPricingEditor({ rows, discountPercent, discountEndsAt, onRowsChange, onDiscountChange }) {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-sm font-semibold text-zinc-900">Package tiers</h3>
        <p className="mt-1 text-xs text-zinc-500">
          Set per-person prices for Standard, Deluxe, and Super Deluxe. Leave blank to omit a tier.
        </p>
        <div className="mt-3 space-y-3">
          {rows.map((row, index) => (
            <div
              key={row.key}
              className="grid gap-3 rounded-xl border border-zinc-200 bg-zinc-50/60 p-3 sm:grid-cols-[140px_1fr]"
            >
              <div>
                <p className="text-sm font-medium text-zinc-900">{row.label}</p>
                <p className="text-[11px] text-zinc-500">{row.key}</p>
              </div>
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-zinc-600">
                  Price per person (₹)
                </span>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={row.price_rupees}
                  onChange={(e) => {
                    const next = [...rows];
                    next[index] = { ...row, price_rupees: e.target.value };
                    onRowsChange(next);
                  }}
                  placeholder={row.key === "standard" ? "e.g. 36000" : "Optional"}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-zinc-400"
                />
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4">
        <h3 className="text-sm font-semibold text-zinc-900">Limited-time discount (this trip only)</h3>
        <p className="mt-1 text-xs text-zinc-500">
          Set a discount for this trip only — other trips are unaffected. Applies to every package
          tier on this trip (Standard, Deluxe, Super Deluxe). Validated on the server until the end
          time below.
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-zinc-600">Discount (%)</span>
            <input
              type="number"
              min="0"
              max="100"
              step="1"
              value={discountPercent}
              onChange={(e) => onDiscountChange({ discountPercent: e.target.value })}
              placeholder="e.g. 10"
              className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-zinc-400"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-zinc-600">Ends at</span>
            <input
              type="datetime-local"
              value={discountEndsAt}
              onChange={(e) => onDiscountChange({ discountEndsAt: e.target.value })}
              className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-zinc-400"
            />
          </label>
        </div>
        {discountPercent && discountEndsAt && (
          <p className="mt-2 text-xs text-amber-800">
            Preview: {discountPercent}% off all tiers on this trip only, until the end time above.
          </p>
        )}
      </div>

      <p className="text-xs text-zinc-500">
        Display price on cards is auto-generated from the lowest tier (
        {PACKAGE_TIERS[0].label} minimum).
      </p>
    </div>
  );
}

export function toDatetimeLocalValue(isoString) {
  if (!isoString) return "";
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function fromDatetimeLocalValue(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}
