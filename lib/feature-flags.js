import { createClient as createServerClient } from "@/lib/supabase/server";
import { createBuildClient } from "@/lib/supabase/build-client";
import { unstable_cache } from "next/cache";

export const FEATURE_FLAG_KEYS = {
  RAZORPAY_PAYMENTS: "razorpay_payments",
};

const DEFAULT_FLAGS = {
  [FEATURE_FLAG_KEYS.RAZORPAY_PAYMENTS]: false,
};

const FLAG_META = {
  [FEATURE_FLAG_KEYS.RAZORPAY_PAYMENTS]: {
    label: "Razorpay Payments",
    description:
      "Enable online payment checkout on trip booking. Requires Razorpay API keys in environment variables.",
    category: "payments",
  },
};

function isSupabaseConfigured() {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your_supabase")
  );
}

async function getSupabaseClient() {
  if (process.env.NEXT_PHASE === "phase-production-build") {
    return createBuildClient();
  }
  try {
    return await createServerClient();
  } catch {
    return createBuildClient();
  }
}

async function fetchFeatureFlagsFromDb() {
  if (!isSupabaseConfigured()) {
    return { ...DEFAULT_FLAGS };
  }

  try {
    const supabase = await getSupabaseClient();
    if (!supabase) return { ...DEFAULT_FLAGS };

    const { data, error } = await supabase.from("feature_flags").select("key, enabled");

    if (error || !data) {
      return { ...DEFAULT_FLAGS };
    }

    const flags = { ...DEFAULT_FLAGS };
    for (const row of data) {
      flags[row.key] = Boolean(row.enabled);
    }
    return flags;
  } catch {
    return { ...DEFAULT_FLAGS };
  }
}

const getCachedFeatureFlags = unstable_cache(
  fetchFeatureFlagsFromDb,
  ["feature-flags"],
  { revalidate: 60 }
);

export async function getFeatureFlags() {
  return getCachedFeatureFlags();
}

export async function isFeatureEnabled(key) {
  const flags = await getFeatureFlags();
  return Boolean(flags[key]);
}

export function getDefaultFeatureFlagRows() {
  return Object.entries(FLAG_META).map(([key, meta]) => ({
    key,
    enabled: DEFAULT_FLAGS[key],
    label: meta.label,
    description: meta.description,
    category: meta.category,
  }));
}
