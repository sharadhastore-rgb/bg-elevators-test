import ContentSection from "@/components/servicedetailspage/ContentSection";
import Section2 from "@/components/servicedetailspage/Section2";
import TestimonialsSection from "@/components/shared/TestimonialsSection";
import ConsultationSection from "@/components/shared/ConsultationSection";
import data from "@/data/pages/service-details.json";

export default function ServiceDetailsPage() {
  return (
    <>
      <ContentSection data={data.contentSection} />
      <Section2 data={data.section2} />
      <TestimonialsSection data={data.section3} />
      <ConsultationSection data={data.section4} />
    </>
  );
}
