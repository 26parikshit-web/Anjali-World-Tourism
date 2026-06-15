"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { showError, showSuccess } from "@/lib/toast";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isConfigured, setIsConfigured] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    const configured =
      url && key && url.startsWith("http") && !url.includes("your_supabase");
    setIsConfigured(configured);
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();

    if (!isConfigured) {
      showError("Supabase is not configured. Please add your credentials to .env.local");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      if (isSignUp) {
        const { error: signUpError } = await supabase.auth.signUp({ email, password });
        if (signUpError) throw signUpError;
        showSuccess("Check your email for the confirmation link!");
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        router.push("/admin/dashboard");
        router.refresh();
      }
    } catch (err) {
      showError(err.message, e.currentTarget);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="admin-card p-8">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-zinc-900">
            {isSignUp ? "Create Admin Account" : "Admin Login"}
          </h1>
          <p className="mt-2 text-sm text-zinc-500">Anjali World Tourism Dashboard</p>
        </div>

        {!isConfigured && (
          <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className="mb-2 text-sm font-semibold text-amber-800">Supabase Not Configured</p>
            <p className="text-xs leading-relaxed text-amber-700">
              Update your <code className="rounded bg-amber-100 px-1">.env.local</code> with
              Supabase credentials, then run{" "}
              <code className="rounded bg-amber-100 px-1">supabase/schema.sql</code>.
            </p>
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4" data-error-anchor>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-700">Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@example.com"
              disabled={!isConfigured}
              className="admin-input"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-700">Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              minLength={6}
              disabled={!isConfigured}
              className="admin-input"
            />
          </div>

          <Button
            type="submit"
            disabled={loading || !isConfigured}
            className="mt-2 w-full rounded-xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-50"
          >
            {loading ? "Please wait..." : isSignUp ? "Create Account" : "Sign In"}
          </Button>
        </form>

        {isConfigured && (
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
              }}
              className="text-sm text-zinc-500 transition hover:text-zinc-700"
            >
              {isSignUp ? "Already have an account? Sign in" : "Need an account? Sign up"}
            </button>
          </div>
        )}
      </div>

      <p className="mt-6 text-center text-xs text-zinc-400">
        Protected admin area. Unauthorized access is prohibited.
      </p>
    </div>
  );
}
