import ContactSection from "@/components/contactuspage/ContactSection";
import MapSection from "@/components/contactuspage/MapSection";
import TestimonialsSection from "@/components/shared/TestimonialsSection";
import ConsultationSection from "@/components/shared/ConsultationSection";
import data from "@/data/pages/contact-us.json";

export default function ContactUsPage() {
  return (
    <>
      <ContactSection data={data.contactSection} />
      <MapSection data={data.mapSection} />
      <TestimonialsSection data={data.testimonialsSection} />
      <ConsultationSection data={data.consultationSection} />
    </>
  );
}
