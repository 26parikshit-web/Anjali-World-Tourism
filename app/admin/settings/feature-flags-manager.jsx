"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { CreditCard, Loader2 } from "lucide-react";

const CATEGORY_LABELS = {
  payments: "Payments",
  general: "General",
};

const FLAG_ICONS = {
  razorpay_payments: CreditCard,
};

function FlagToggle({ flag, saving, onToggle }) {
  const Icon = FLAG_ICONS[flag.key] || CreditCard;

  return (
    <div className="admin-card flex items-start justify-between gap-4 p-5">
      <div className="flex gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100">
          <Icon className="h-5 w-5 text-zinc-700" />
        </div>
        <div>
          <p className="font-semibold text-zinc-900">{flag.label}</p>
          <p className="mt-1 text-sm text-zinc-500">{flag.description}</p>
          <p className="mt-2 font-mono text-[11px] text-zinc-400">{flag.key}</p>
          {flag.key === "razorpay_payments" && (
            <p className="mt-2 text-xs text-zinc-500">
              Also requires{" "}
              <code className="rounded bg-zinc-100 px-1">RAZORPAY_KEY_ID</code>,{" "}
              <code className="rounded bg-zinc-100 px-1">RAZORPAY_KEY_SECRET</code>, and{" "}
              <code className="rounded bg-zinc-100 px-1">NEXT_PUBLIC_RAZORPAY_KEY_ID</code> in
              your environment.
            </p>
          )}
        </div>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={flag.enabled}
        disabled={saving === flag.key}
        onClick={() => onToggle(flag)}
        className={`relative h-7 w-12 shrink-0 rounded-full transition-colors disabled:opacity-50 ${
          flag.enabled ? "bg-zinc-900" : "bg-zinc-200"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow transition-transform ${
            flag.enabled ? "translate-x-5" : "translate-x-0"
          }`}
        >
          {saving === flag.key && <Loader2 className="h-3.5 w-3.5 animate-spin text-zinc-500" />}
        </span>
      </button>
    </div>
  );
}

export function FeatureFlagsManager({ flags: initialFlags }) {
  const router = useRouter();
  const supabase = createClient();
  const [flags, setFlags] = useState(initialFlags);
  const [saving, setSaving] = useState(null);
  const [error, setError] = useState(null);

  const grouped = flags.reduce((acc, flag) => {
    const cat = flag.category || "general";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(flag);
    return acc;
  }, {});

  const handleToggle = async (flag) => {
    const nextEnabled = !flag.enabled;
    setSaving(flag.key);
    setError(null);

    setFlags((prev) =>
      prev.map((f) => (f.key === flag.key ? { ...f, enabled: nextEnabled } : f))
    );

    try {
      const { error: updateError } = await supabase
        .from("feature_flags")
        .update({ enabled: nextEnabled, updated_at: new Date().toISOString() })
        .eq("key", flag.key);

      if (updateError) throw updateError;

      router.refresh();
    } catch (err) {
      setFlags((prev) =>
        prev.map((f) => (f.key === flag.key ? { ...f, enabled: flag.enabled } : f))
      );
      setError(err.message || "Failed to update flag.");
    } finally {
      setSaving(null);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {Object.entries(grouped).map(([category, categoryFlags]) => (
        <div key={category} className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
            {CATEGORY_LABELS[category] || category}
          </h3>
          <div className="space-y-3">
            {categoryFlags.map((flag) => (
              <FlagToggle
                key={flag.key}
                flag={flag}
                saving={saving}
                onToggle={handleToggle}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
