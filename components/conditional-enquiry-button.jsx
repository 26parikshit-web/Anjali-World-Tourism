"use client";

import { usePathname } from "next/navigation";
import { EnquiryButton } from "./enquiry-button";

export function ConditionalEnquiryButton() {
  const pathname = usePathname();
  
  // Hide chatbot on admin pages
  if (pathname.startsWith('/admin')) {
    return null;
  }

  return <EnquiryButton />;
}
