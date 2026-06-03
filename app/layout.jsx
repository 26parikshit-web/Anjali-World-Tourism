import "./globals.css";
import { ConditionalChrome } from "@/components/conditional-chrome";

export const metadata = {
  title: "Anjali World Tourism",
  description:
    "A premium travel showcase for spiritual journeys, friend getaways, family holidays, and honeymoon packages."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <ConditionalChrome>{children}</ConditionalChrome>
      </body>
    </html>
  );
}
