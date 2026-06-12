"use client";

import { usePathname } from "next/navigation";
import { EnquiryButton } from "./enquiry-button";

export function ConditionalEnquiryButton() {
  const pathname = usePathname();
  const isTripDetail = /^\/trips\/[^/]+$/.test(pathname);

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return <EnquiryButton hideOnMobile={isTripDetail} />;
}
