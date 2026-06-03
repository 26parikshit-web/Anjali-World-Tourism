"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isConfigured, setIsConfigured] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    const configured = url && key && url.startsWith('http') && !url.includes('your_supabase');
    setIsConfigured(configured);
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    
    if (!isConfigured) {
      setError("Supabase is not configured. Please add your credentials to .env.local");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();
      
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setError("Check your email for the confirmation link!");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push("/admin/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-zinc-900">
              {isSignUp ? "Create Admin Account" : "Admin Login"}
            </h1>
            <p className="text-sm text-zinc-500 mt-2">
              Anjali World Tourism Dashboard
            </p>
          </div>

          {!isConfigured && (
            <div className="mb-6 p-4 rounded-xl border border-amber-200 bg-amber-50">
              <p className="text-sm font-semibold text-amber-800 mb-2">
                Supabase Not Configured
              </p>
              <p className="text-xs text-amber-700 leading-relaxed">
                To enable admin functionality, update your <code className="bg-amber-100 px-1 rounded">.env.local</code> file with your Supabase credentials:
              </p>
              <pre className="mt-2 text-[10px] bg-amber-100 p-2 rounded overflow-x-auto text-amber-800">
{`NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key`}
              </pre>
              <p className="text-xs text-amber-700 mt-2">
                Then run the SQL schema from <code className="bg-amber-100 px-1 rounded">supabase/schema.sql</code> in your Supabase SQL Editor.
              </p>
            </div>
          )}

          {error && (
            <div className={`mb-6 p-4 rounded-xl border text-sm ${
              error.includes("Check your email") 
                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                : "bg-red-50 border-red-200 text-red-700"
            }`}>
              {error}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@example.com"
                disabled={!isConfigured}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-400 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                minLength={6}
                disabled={!isConfigured}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-400 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <Button
              type="submit"
              disabled={loading || !isConfigured}
              className="w-full bg-zinc-900 text-white hover:bg-zinc-800 text-sm font-semibold px-4 py-3 rounded-xl mt-2 disabled:opacity-50"
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
                  setError(null);
                }}
                className="text-sm text-zinc-500 hover:text-zinc-700 transition"
              >
                {isSignUp
                  ? "Already have an account? Sign in"
                  : "Need an account? Sign up"}
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-zinc-400 mt-6">
          Protected admin area. Unauthorized access is prohibited.
        </p>
      </div>
    </div>
  );
}
