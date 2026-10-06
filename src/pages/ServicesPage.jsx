import ServicesSection from "@/components/servicespage/ServicesSection";
import ProcessSection from "@/components/shared/ProcessSection";
import TestimonialsSection from "@/components/shared/TestimonialsSection";
import ConsultationSection from "@/components/shared/ConsultationSection";
import data from "@/data/pages/services.json";

export default function ServicesPage() {
  return (
    <>
      <ServicesSection data={data.servicesSection} />
      <ProcessSection data={data.processSection} />
      <TestimonialsSection data={data.testimonialsSection} />
      <ConsultationSection data={data.consultationSection} />
    </>
  );
}
