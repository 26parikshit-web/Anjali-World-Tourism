"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/trips", label: "Trips" },
  { href: "/reviews", label: "Reviews" },
  { href: "/contact", label: "Contact" }
];

export function SiteChrome({ children }) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-colors",
          isHomePage
            ? "backdrop-blur-md bg-black/30 border-b border-white/10"
            : "backdrop-blur-md bg-white/90 border-b border-zinc-200"
        )}
      >
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <span
              className={cn(
                "text-sm font-bold tracking-[0.12em]",
                isHomePage ? "text-amber-400" : "text-zinc-900"
              )}
            >
              ANJALI WORLD TOURISM
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === item.href
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium tracking-wide transition rounded-lg",
                    isHomePage
                      ? isActive
                        ? "text-white bg-white/15"
                        : "text-zinc-300 hover:text-white hover:bg-white/10"
                      : isActive
                        ? "text-zinc-900 bg-zinc-100"
                        : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <a href="https://cal.com/varsha-tourism-ndqbdf/15min" target="_blank" rel="noopener noreferrer">
            <Button
              className={cn(
                "text-xs font-semibold tracking-wide px-4 py-2 rounded-lg",
                isHomePage
                  ? "bg-white text-zinc-900 hover:bg-zinc-100"
                  : "bg-zinc-900 text-white hover:bg-zinc-800"
              )}
            >
              Book Meeting
            </Button>
          </a>
        </div>
      </header>

      <main>{children}</main>

      {!isHomePage && (
        <footer className="border-t border-zinc-200 bg-zinc-50">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-8 text-xs text-zinc-500 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <div>
              <p className="font-semibold uppercase tracking-[0.15em] text-zinc-900">
                Anjali World Tourism
              </p>
              <p className="mt-2 max-w-md text-zinc-500">
                Manual travel planning desk for spiritual journeys, friend getaways, family holidays, and honeymoon packages.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-zinc-500 hover:text-zinc-900 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
