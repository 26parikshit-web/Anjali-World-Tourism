"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/trips", label: "Trips" },
  { href: "/reviews", label: "Reviews" },
  { href: "/contact", label: "Contact" }
];

export function SiteChrome({ children }) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

          {/* Desktop Book Meeting Button */}
          <a href="https://cal.com/varsha-tourism-ndqbdf/15min" target="_blank" rel="noopener noreferrer" className="hidden md:block">
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

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={cn(
              "md:hidden p-2 rounded-lg transition",
              isHomePage
                ? "text-white hover:bg-white/10"
                : "text-zinc-900 hover:bg-zinc-100"
            )}
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Sidebar */}
          <div className="fixed inset-y-0 right-0 z-50 w-64 bg-white shadow-2xl md:hidden">
            <div className="flex h-full flex-col">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3">
                <span className="text-sm font-bold tracking-[0.12em] text-zinc-900">
                  MENU
                </span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-lg text-zinc-600 hover:bg-zinc-100 transition"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex-1 overflow-y-auto px-4 py-6">
                <div className="space-y-2">
                  {navItems.map((item) => {
                    const isActive =
                      item.href === "/"
                        ? pathname === item.href
                        : pathname.startsWith(item.href);

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          "block px-4 py-3 text-sm font-medium rounded-lg transition",
                          isActive
                            ? "bg-zinc-900 !text-white"
                            : "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900"
                        )}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </div>

                {/* Book Meeting Button in Sidebar */}
                <div className="mt-6 pt-6 border-t border-zinc-200">
                  <a
                    href="https://cal.com/varsha-tourism-ndqbdf/15min"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button className="w-full bg-zinc-900 text-white hover:bg-zinc-800 text-sm font-semibold px-4 py-3 rounded-lg">
                      Book Meeting
                    </Button>
                  </a>
                </div>
              </nav>
            </div>
          </div>
        </>
      )}

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
