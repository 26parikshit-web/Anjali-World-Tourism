import { createClient } from "@/lib/supabase/server";
import { getDefaultFeatureFlagRows } from "@/lib/feature-flags";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { FeatureFlagsManager } from "./feature-flags-manager";
import { DeveloperAlertModal } from "./developer-alert-modal";

export default async function AdminSettingsPage() {
  const supabase = await createClient();
  const { data: flags, error } = await supabase
    .from("feature_flags")
    .select("id, key, value, created_at, updated_at")
    .order("category", { ascending: true })
    .order("label", { ascending: true });

  const initialFlags = error || !flags?.length ? getDefaultFeatureFlagRows() : flags;

  return (
    <div className="space-y-8">
      <DeveloperAlertModal />
      <AdminPageHeader
        title="Settings"
        description="Control site features without redeploying code"
      />

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">Feature Flags</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Toggle integrations and booking options for the public site
          </p>
        </div>

        {error && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Could not load flags from the database. Run{" "}
            <code className="rounded bg-amber-100 px-1">supabase/migrations/feature_flags.sql</code>{" "}
            in Supabase, then refresh.
          </div>
        )}

        <FeatureFlagsManager flags={initialFlags} />
      </section>
    </div>
  );
}
