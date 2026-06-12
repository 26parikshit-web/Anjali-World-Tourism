"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu, X, Plane } from "lucide-react";
import { useChatbot } from "@/contexts/chatbot-context";
import { PageBackground } from "@/components/home/page-background";

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
  const { openChatbot } = useChatbot();

  return (
    <div
      className={cn(
        "relative min-h-screen text-zinc-900",
        isHomePage ? "bg-white" : "bg-amber-50/40 md:bg-zinc-50"
      )}
    >
      {!isHomePage && <PageBackground />}

      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          isHomePage
            ? "backdrop-blur-md bg-black/30 border-b border-white/10"
            : "backdrop-blur-xl bg-white/70 border-b border-zinc-200/50 shadow-sm"
        )}
      >
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="/logo.png"
              alt="Anjali World Tourism logo"
              width={32}
              height={32}
              className="h-8 w-8 rounded-lg"
              priority
            />
            <span
              className={cn(
                "text-sm font-bold tracking-[0.12em] transition-colors",
                isHomePage ? "text-white" : "text-zinc-900"
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
                    "px-3 py-1.5 text-xs font-medium tracking-wide transition-all rounded-lg",
                    isHomePage
                      ? isActive
                        ? "text-white bg-white/20 shadow-sm"
                        : "text-white/90 hover:text-white hover:bg-white/10"
                      : isActive
                        ? "text-zinc-900 bg-zinc-100/80 shadow-sm"
                        : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/50"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Plan your Trip Button */}
          <Button
            onClick={openChatbot}
            variant={isHomePage ? "outline" : "default"}
            size="sm"
            className={cn(
              "hidden md:flex gap-2 font-semibold transition-all shadow-md",
              isHomePage && "bg-white text-zinc-900 border-white/30 hover:bg-white/90 hover:shadow-lg"
            )}
          >
            <Plane className="h-4 w-4" />
            Plan Your Trip
          </Button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={cn(
              "md:hidden p-2 rounded-lg transition-all",
              isHomePage
                ? "text-white hover:bg-white/10"
                : "text-zinc-900 hover:bg-zinc-100/80"
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

                {/* Plan your Trip Button in Sidebar */}
                <div className="mt-6 pt-6 border-t border-zinc-200">
                  <Button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      openChatbot();
                    }}
                    variant="default"
                    size="default"
                    className="w-full gap-2 bg-zinc-900 font-semibold text-white hover:bg-zinc-800"
                  >
                    <Plane className="h-4 w-4" />
                    Plan Your Trip
                  </Button>
                </div>
              </nav>
            </div>
          </div>
        </>
      )}

      <main className="relative z-10 overflow-x-hidden">{children}</main>

      {!isHomePage && (
        <footer className="relative z-0 border-t border-zinc-200/80 bg-white/60 backdrop-blur-sm">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-8 text-xs text-zinc-500 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <div>
              <p className="font-semibold uppercase tracking-[0.15em] text-zinc-900">
                Anjali World Tourism
              </p>
              <p className="mt-2 max-w-md text-zinc-500">
                Curated itineraries and on-call planners for pilgrimages, group trips, family
                holidays, and honeymoons across India.
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
