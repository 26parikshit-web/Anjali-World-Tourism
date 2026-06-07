import { ContactPageView } from "@/components/pages/contact-page-view";
import { contactDetails, contactTestimonials } from "@/lib/site-data";

export default function ContactPage() {
  return (
    <ContactPageView
      contactDetails={contactDetails}
      contactTestimonials={contactTestimonials}
    />
  );
}
