import { ContactPageView } from "@/components/pages/contact-page-view";
import { contactDetails, contactTestimonials } from "@/lib/site-data";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Contact Us",
  description:
    "Reach the Anjali World Tourism planning desk — email, phone, or book a call to start your journey.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <ContactPageView
      contactDetails={contactDetails}
      contactTestimonials={contactTestimonials}
    />
  );
}
