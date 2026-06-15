"use client";

import { Toaster } from "sonner";

export function AppToaster() {
  return (
    <Toaster
      position="top-center"
      closeButton
      richColors
      toastOptions={{
        classNames: {
          toast:
            "rounded-xl border border-zinc-200 bg-white text-zinc-900 shadow-lg text-sm font-medium",
          title: "text-zinc-900",
          description: "text-zinc-600",
          error: "border-red-200 bg-red-50 text-red-900",
          success: "border-emerald-200 bg-emerald-50 text-emerald-900",
        },
      }}
    />
  );
}
