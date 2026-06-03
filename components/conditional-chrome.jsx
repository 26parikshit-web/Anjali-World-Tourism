"use client";

import { usePathname } from "next/navigation";
import { SiteChrome } from "@/components/site-chrome";

export function ConditionalChrome({ children }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return <SiteChrome>{children}</SiteChrome>;
}
