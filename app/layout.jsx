import "./globals.css";
import { ConditionalChrome } from "@/components/conditional-chrome";
import { ConditionalEnquiryButton } from "@/components/conditional-enquiry-button";
import { ChatbotProvider } from "@/contexts/chatbot-context";

export const metadata = {
  title: "Anjali World Tourism",
  description:
    "A premium travel showcase for spiritual journeys, friend getaways, family holidays, and honeymoon packages."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <ChatbotProvider>
          <ConditionalChrome>{children}</ConditionalChrome>
          <ConditionalEnquiryButton />
        </ChatbotProvider>
      </body>
    </html>
  );
}
