import "./globals.css";
import { SiteChrome } from "@/components/site-chrome";

export const metadata = {
  title: "Anjali World Tourism",
  description:
    "A premium travel showcase for spiritual journeys, friend getaways, family holidays, and honeymoon packages."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
