import "./globals.css";
import { ConditionalChrome } from "@/components/conditional-chrome";
import { ConditionalEnquiryButton } from "@/components/conditional-enquiry-button";
import { ChatbotProvider } from "@/contexts/chatbot-context";
import { AppToaster } from "@/components/app-toaster";
import { JsonLd } from "@/components/seo/json-ld";
import { absoluteUrl, defaultMetadata, getSiteUrl, siteConfig } from "@/lib/seo";

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  name: siteConfig.name,
  url: absoluteUrl("/"),
  description: siteConfig.description,
  areaServed: "IN",
};

export const metadata = {
  metadataBase: new URL(getSiteUrl()),
  ...defaultMetadata,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <JsonLd data={organizationJsonLd} />
        <ChatbotProvider>
          <ConditionalChrome>{children}</ConditionalChrome>
          <ConditionalEnquiryButton />
          <AppToaster />
        </ChatbotProvider>
      </body>
    </html>
  );
}
