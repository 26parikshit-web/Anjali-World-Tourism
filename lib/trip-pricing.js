import { parsePriceToRupees, formatINR, computeTotalWithGst } from "@/lib/trip-booking";
import { createClient } from "@supabase/supabase-js";

export const GST_PERCENT = 5;

export const PACKAGE_TIERS = [
  { key: "standard", label: "Standard", order: 1 },
  { key: "deluxe", label: "Deluxe", order: 2 },
  { key: "super_deluxe", label: "Super Deluxe", order: 3 },
];

const TIER_LABELS = Object.fromEntries(PACKAGE_TIERS.map((t) => [t.key, t.label]));

function getServiceSupabase() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return null;
  }
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export function tierLabel(key) {
  return TIER_LABELS[key] || key;
}

export function rupeesToPaise(rupees) {
  return Math.round(Number(rupees) * 100);
}

export function paiseToRupees(paise) {
  return Math.round(Number(paise)) / 100;
}

/** Normalize admin/client package rows into authoritative paise values. */
export function normalizePricingPackages(trip) {
  const raw = trip?.pricing_packages;
  if (Array.isArray(raw) && raw.length > 0) {
    const packages = raw
      .map((pkg) => ({
        key: String(pkg?.key || "").trim(),
        label: String(pkg?.label || tierLabel(pkg?.key)).trim(),
        price_paise: Math.round(Number(pkg?.price_paise || 0)),
      }))
      .filter((pkg) => pkg.key && pkg.price_paise > 0);

    if (packages.length > 0) {
      return PACKAGE_TIERS.map((tier) => packages.find((p) => p.key === tier.key))
        .filter(Boolean);
    }
  }

  const legacyRupees = parsePriceToRupees(trip?.price);
  if (legacyRupees > 0) {
    return [
      {
        key: "standard",
        label: "Standard",
        price_paise: rupeesToPaise(legacyRupees),
      },
    ];
  }

  return [];
}

export function getPackageByKey(trip, packageKey) {
  const packages = normalizePricingPackages(trip);
  return packages.find((pkg) => pkg.key === packageKey) || packages[0] || null;
}

/**
 * Discount is active only when server time is strictly before discount_ends_at.
 * Client clocks cannot extend the offer.
 */
export function getDiscountState(trip, now = new Date()) {
  const percent = Number(trip?.discount_percent);
  const endsAtRaw = trip?.discount_ends_at;

  if (!percent || percent <= 0 || !endsAtRaw) {
    return { active: false, percent: 0, endsAt: null };
  }

  const endsAt = new Date(endsAtRaw);
  if (Number.isNaN(endsAt.getTime())) {
    return { active: false, percent: 0, endsAt: null };
  }

  const active = now.getTime() < endsAt.getTime();
  return {
    active,
    percent: active ? Math.min(100, percent) : 0,
    endsAt: endsAt.toISOString(),
  };
}

export function applyDiscountPaise(basePaise, discountPercent) {
  if (!discountPercent || discountPercent <= 0) return basePaise;
  return Math.round(basePaise * (1 - discountPercent / 100));
}

/**
 * Authoritative quote — used by quote API and payment routes.
 */
export function computeTripQuote(
  trip,
  { packageKey = "standard", pax = 1, now = new Date(), gstPercent = GST_PERCENT } = {}
) {
  const travelers = Math.min(50, Math.max(1, Math.round(Number(pax) || 1)));
  const pkg = getPackageByKey(trip, packageKey);

  if (!pkg) {
    return { valid: false, message: "No pricing configured for this trip." };
  }

  const discount = getDiscountState(trip, now);
  const perPersonPaiseBase = pkg.price_paise;
  const perPersonPaise = applyDiscountPaise(
    perPersonPaiseBase,
    discount.active ? discount.percent : 0
  );
  const subtotalPaise = perPersonPaise * travelers;
  const gstPaise = Math.round(subtotalPaise * (gstPercent / 100));
  const totalPaise = subtotalPaise + gstPaise;

  const perPersonRupees = paiseToRupees(perPersonPaise);
  const { subtotal, gst, total } = computeTotalWithGst(perPersonRupees, travelers, gstPercent);

  return {
    valid: true,
    packageKey: pkg.key,
    packageLabel: pkg.label,
    pax: travelers,
    perPersonPaise,
    perPersonPaiseBase,
    perPersonRupees,
    perPersonRupeesBase: paiseToRupees(perPersonPaiseBase),
    subtotalPaise,
    gstPaise,
    totalPaise,
    subtotalRupees: subtotal,
    gstRupees: gst,
    totalRupees: total,
    gstPercent,
    discount: {
      active: discount.active,
      percent: discount.active ? discount.percent : 0,
      endsAt: discount.endsAt,
      savingsPerPersonRupees: discount.active
        ? paiseToRupees(perPersonPaiseBase - perPersonPaise)
        : 0,
    },
    packages: normalizePricingPackages(trip).map((item) => ({
      key: item.key,
      label: item.label,
      pricePaise: item.price_paise,
      priceRupees: paiseToRupees(item.price_paise),
      priceLabel: formatINR(paiseToRupees(item.price_paise)),
    })),
  };
}

export function getTripListPrice(trip, now = new Date()) {
  const packages = normalizePricingPackages(trip);
  if (packages.length === 0) {
    return {
      displayPrice: trip?.price || "",
      fromRupees: parsePriceToRupees(trip?.price),
      fromRupeesBase: parsePriceToRupees(trip?.price),
      discountActive: false,
      discountPercent: 0,
      discountEndsAt: null,
      hasMultiplePackages: false,
    };
  }

  const cheapest = packages.reduce((min, pkg) =>
    pkg.price_paise < min.price_paise ? pkg : min
  );
  const discount = getDiscountState(trip, now);
  const fromRupeesBase = paiseToRupees(cheapest.price_paise);
  const fromRupees = discount.active
    ? paiseToRupees(applyDiscountPaise(cheapest.price_paise, discount.percent))
    : fromRupeesBase;

  const prefix = packages.length > 1 ? "From " : "";
  return {
    displayPrice: `${prefix}${formatINR(fromRupees)}`,
    displayPriceBase: `${prefix}${formatINR(fromRupeesBase)}`,
    fromRupees,
    fromRupeesBase,
    discountActive: discount.active,
    discountPercent: discount.active ? discount.percent : 0,
    discountEndsAt: discount.endsAt,
    hasMultiplePackages: packages.length > 1,
  };
}

export function buildPricingPackagesFromFormRows(rows) {
  return PACKAGE_TIERS.map((tier) => {
    const row = rows.find((r) => r.key === tier.key);
    const rupees = Number.parseFloat(String(row?.price_rupees ?? "").replace(/,/g, ""));
    if (!rupees || rupees <= 0) return null;
    return {
      key: tier.key,
      label: tier.label,
      price_paise: rupeesToPaise(rupees),
    };
  }).filter(Boolean);
}

export function pricingPackagesToFormRows(trip) {
  const packages = normalizePricingPackages(trip);
  return PACKAGE_TIERS.map((tier) => {
    const pkg = packages.find((p) => p.key === tier.key);
    return {
      key: tier.key,
      label: tier.label,
      price_rupees: pkg ? String(paiseToRupees(pkg.price_paise)) : "",
    };
  });
}

export function deriveLegacyPriceLabel(packages) {
  if (!packages?.length) return "";
  const minPaise = Math.min(...packages.map((p) => p.price_paise));
  const label = formatINR(paiseToRupees(minPaise));
  return packages.length > 1 ? `From ${label}` : label;
}

export async function fetchTripForPricing(slug) {
  const supabase = getServiceSupabase();
  if (!supabase || !slug) return null;

  const { data, error } = await supabase
    .from("trips")
    .select(
      "id,slug,name,price,pricing_packages,discount_percent,discount_ends_at,is_active"
    )
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export function quoteResponseFromCompute(quote) {
  if (!quote.valid) return quote;

  return {
    valid: true,
    packageKey: quote.packageKey,
    packageLabel: quote.packageLabel,
    pax: quote.pax,
    perPerson: quote.perPersonRupees,
    perPersonBase: quote.perPersonRupeesBase,
    perPersonLabel: formatINR(quote.perPersonRupees),
    perPersonBaseLabel: formatINR(quote.perPersonRupeesBase),
    subtotal: quote.subtotalRupees,
    gst: quote.gstRupees,
    total: quote.totalRupees,
    subtotalLabel: formatINR(quote.subtotalRupees),
    gstLabel: formatINR(quote.gstRupees),
    totalLabel: formatINR(quote.totalRupees),
    gstPercent: quote.gstPercent,
    totalPaise: quote.totalPaise,
    discount: quote.discount,
    packages: quote.packages,
    serverTime: new Date().toISOString(),
  };
}
